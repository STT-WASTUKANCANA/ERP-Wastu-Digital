<?php

namespace App\Services\Api\Mails;

use App\Models\Workspace\Mails\DecisionLetter;
use App\Models\Workspace\Mails\IncomingMail;
use App\Models\Workspace\Mails\MailLog;
use App\Models\Workspace\Mails\OutgoingMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MailService
{
    private function getModel(int $type)
    {
        return match ($type) {
            1 => IncomingMail::class,
            2 => OutgoingMail::class,
            3 => DecisionLetter::class,
            default => null,
        };
    }

    public function all(int $type, $filters = [])
    {
        $search = is_string($filters) ? $filters : ($filters['search'] ?? null);

        $model = $this->getModel($type);
        $relations = ['mail_category', 'mail_log'];
        if ($type === 1) {
            $relations[] = 'division';
        }
        $query = $model::with($relations)->latest();

        // Apply Search Filter
        if (!empty($search)) {
            $query->where(function ($q) use ($search, $type) {
                // Universal search on 'number'
                $q->where('number', 'like', "%{$search}%");

                if ($type === 1) { // Incoming
                     // Search by Category Name via relation
                     $q->orWhereHas('mail_category', function($subQ) use ($search) {
                         $subQ->where('name', 'like', "%{$search}%");
                     });
                } elseif ($type === 2) { // Outgoing
                     $q->orWhere('institute', 'like', "%{$search}%")
                       ->orWhere('purpose', 'like', "%{$search}%");
                } elseif ($type === 3) { // Decision
                     $q->orWhere('title', 'like', "%{$search}%");
                }
            });
        }

        // Apply Advanced Filters
        if (is_array($filters)) {
            if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
                 $query->whereBetween('date', [$filters['start_date'], $filters['end_date']]);
            }
            if (!empty($filters['category_id'])) {
                 $query->where('category_id', $filters['category_id']);
            }
            if (!empty($filters['status'])) {
                 $query->where('status', (string) $filters['status']);
            }
            // Outgoing - Destination
            if ($type === 2 && !empty($filters['destination'])) {
                 $query->where('institute', 'like', "%{$filters['destination']}%");
            }
            // Incoming - View Status
            if ($type === 1 && !empty($filters['view_status'])) {
                 if ($filters['view_status'] === 'read') {
                      $query->whereNotNull('user_view_id');
                 } elseif ($filters['view_status'] === 'unread') {
                      $query->whereNull('user_view_id');
                 }
            }
        }

        if ($type === 2) { // Outgoing Mail Logic
            $user = auth()->user();
            if (!$user) return [];

            // Role IDs: 1=TataLaksana, 2=Sekum, 3=Pulahta, 4=Kabid, 5=Admin
            if (in_array($user->role_id, [2, 5])) {
                // Admin & Sekum: View All
                return $query->get();
            } elseif (in_array($user->role_id, [3])) {
                // Pulahta: View Approved (3) Only + Own Created
                $query->where(function($q) use ($user) {
                     $q->where('status', '3')
                       ->orWhere('user_id', $user->id);
                });
            } else {
                // Tata Laksana & Kabid (Others): View Own Created Only
                $query->where('user_id', $user->id);
            }
        }

        return $data;
    }

    public function create(array $data, int $type)
    {
        return DB::transaction(function () use ($data, $type) {
            try {
                $user = auth()->user();

                // Logic for Outgoing Mail (Type 2)
                if ($type === 2) {
                    // Check Role Pulahta (3) - Only SK Allowed
                    if ($user->role_id === 3) {
                         $category = \App\Models\MailCategory::find($data['category_id']);
                         // 3 = Surat Keputusan
                         if (!$category || $category->type != '3') {
                             throw new \Exception("Pulahta hanya dapat membuat Surat Keputusan (SK).");
                         }
                    }

                    // Set Status
                    // Sekum (2) & Admin (5) => Approved (3)
                    if (in_array($user->role_id, [2, 5])) {
                        $data['status'] = '3';
                    } else {
                        // Others (Tata Laksana/Kabid/Pulahta) => Verifikasi Sekum (1)
                        $data['status'] = '1';
                    }
                }

                // Log::info('Mail: Created Data', ['type' => $type, 'data' => $data]);
                $model = $this->getModel($type);
                $mail = $model::create($data);

                $logStatus = null;
                if ($type == 2) {
                    // For Outgoing: '1', '2', '3', '4' are already compatible with MailLog?
                    // MailLog uses tinyInteger status. '1' -> 1.
                    // Let's ensure integer value for log.
                    $logStatus = (int) $data['status'];
                } else {
                    $logStatus = $type == 1 ? 1 : null;
                }

                MailLog::create([
                    'user_id' => $data['user_id'],
                    'mail_id' => $mail->id,
                    'type'    => (string) $type,
                    'status'  => $logStatus,
                    'desc'    => $data['desc'] ?? null,
                ]);

                return $mail;
            } catch (\Throwable $e) {
                Log::error('[SERVICE] MAIL CREATE: Gagal membuat surat', [
                    'error' => $e->getMessage(),
                    'type'  => $type,
                    'data'  => $data
                ]);
                throw $e;
            }
        });
    }

    public function validateOutgoingMail($id, array $data)
    {
        $mail = $this->find($id, 2); // Type 2 = Outgoing
        if (!$mail) return null;

        $user = auth()->user();
        if ($user->role_id != 2 && $user->role_id != 5) { // Only Sekum & Admin
             throw new \Exception("Unauthorized validation.");
        }

        // data['status'] should be '2', '3', '4' (Revision, Approved, Rejected)
        $mail->update(['status' => $data['status']]);
        
        // Log changes
        $logStatus = (int) $data['status'];

        MailLog::create([
            'user_id' => $user->id,
            'mail_id' => $mail->id,
            'type'    => '2', // Outgoing
            'status'  => $logStatus,
            'desc'    => $data['note'] ?? 'Status validation by ' . $user->name,
        ]);

        return $mail;
    }

    public function find($id, int $type)
    {
        $model = $this->getModel($type);
        $mail = $model::with('mail_category', 'mail_log')->find($id);

        if ($mail && $type === 1) {
            $user = auth()->user();
            // Logic: Update Last Read By if user belongs to the target division
            if ($user && $mail->division_id && $user->division_id == $mail->division_id) {
                // Always overwrite to track "Last Read By"
                if ($mail->user_view_id !== $user->id) {
                     $mail->update(['user_view_id' => $user->id]);
                }
            }
        }

        return $mail;
    }

    public function update($id, array $data, int $type)
    {
        $mail = $this->find($id, $type);

        if (!$mail) {
            Log::warning('[SERVICE] MAIL UPDATE: Gagal, surat tidak ditemukan', [
                'id' => $id,
                'type' => $type,
                'payload' => $data
            ]);
            return null;
        }

        try {
            // Logic for Outgoing Mail (Type 2): Reset Status if "Perlu Perbaikan" -> "Verifikasi Sekum" on update
            if ($type === 2) {
                $user = auth()->user();
                // If current status is '2' (Perlu Perbaikan) and user is Creator (Not Sekum/Admin)
                if ($mail->status == '2' && !in_array($user->role_id, [2, 5])) {
                    $data['status'] = '1'; // Reset to Verifikasi Sekum
                    // No new log created, so the previous Sekum log remains the latest for display
                }
            }

            $mail->update($data);

            if ($type === 1 && isset($data['desc'])) {
                $mailLog = $mail->mail_log()
                    ->where('type', 1)
                    ->where('status', $mail->status)
                    ->first();

                if ($mailLog) {
                    $mailLog->update(['desc' => $data['desc']]);
                    Log::info('[SERVICE] MAIL LOG: Deskripsi diperbarui', [
                        'mail_id' => $mail->id,
                        'type' => 1,
                        'status' => $mail->status
                    ]);
                }
            }



            return $mail;
        } catch (\Throwable $e) {
            Log::error('[SERVICE] MAIL UPDATE: Gagal memperbarui surat', [
                'id' => $id,
                'type' => $type,
                'payload' => $data,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function delete($id, int $type)
    {
        $mail = $this->find($id, $type);
        if (!$mail) return false;
        $mail->delete();
        return true;
    }

    public function getMonthlySummary(int $type): array
    {
        $model = $this->getModel($type);
        $curr = $model::getTotalForCurrentMonth();
        $prev = $model::getTotalForPreviousMonth();
        $diff = $prev > 0 ? (($curr - $prev) / $prev) * 100 : ($curr > 0 ? 100 : 0);
        $status = $diff > 0 ? 'increase' : ($diff < 0 ? 'decrease' : 'unchanged');



        return [
            'current_month_total' => $curr,
            'previous_month_total' => $prev,
            'percentage_change' => round($diff, 2),
            'status' => $status,
        ];
    }

    public function reviewIncomingMail($id, array $data, int $type)
    {
        $mail = $this->find($id, $type);

        if (!$mail) {
            Log::warning('MailService: review failed, mail not found', compact('id', 'type'));
            return null;
        }

        // Tentukan status selanjutnya berdasarkan data yang dikirim
        $mailStatus = null;
        $logStatus = null;

        if (array_key_exists('division_id', $data)) {
            $mailStatus = 2; // Sekum Review / Edit Disposisi
            $logStatus = 2;
        } elseif (array_key_exists('follow_status', $data)) {
            // Division Review
            $logStatus = 3; // Log selalu di slot 3 (Divisi) agar tidak menimpa slot 2 (Sekum)
            
            if ($data['follow_status'] == 3) {
                $mailStatus = 3; // Selesai
            } else {
                $mailStatus = 2; // Tetap 2 (Disposisi/Proses) jika belum selesai
            }
        }

        if (!$mailStatus || !$logStatus) {
            Log::warning('MailService: invalid status transition based on payload', [
                'id' => $id,
                'current_status' => $mail->status,
                'payload_keys' => array_keys($data)
            ]);
            return null;
        }

        $updatedMail = DB::transaction(function () use ($mail, $data, $id, $type, $mailStatus, $logStatus) {
            try {
                $updateData = ['status' => $mailStatus];

                if ($mailStatus === 2 && isset($data['division_id'])) {
                    $updateData['division_id'] = $data['division_id'];
                    $updateData['user_view_id'] = null; // Reset read status on new disposition
                }

                if (isset($data['follow_status'])) {
                    $updateData['follow_status'] = $data['follow_status'];
                }

                $mail->update($updateData);

                MailLog::updateOrCreate(
                    [
                        'mail_id' => $id,
                        'type'    => 1,
                        'status'  => $logStatus,
                    ],
                    [
                        'user_id' => $data['user_id'],
                        'desc'    => $logStatus === 3
                            ? ($data['division_desc'] ?? null)
                            : ($data['desc'] ?? null),
                    ]
                );

                // Log::info('MailService: reviewed successfully', compact('id', 'type'));

                return $mail->load('mail_log');
            } catch (\Throwable $e) {
                Log::error('[SERVICE] MAIL REVIEW: Gagal review', [
                    'id' => $id,
                    'type' => $type,
                    'payload' => $data,
                    'error' => $e->getMessage()
                ]);
                throw $e;
            }
        });

        // Send Email Notification to Division Leader if Disposition (Status 2)
        if ($updatedMail && $mailStatus === 2) {
            try {
                $updatedMail->refresh(); // Reload to get new division relation
                $leader = $updatedMail->division?->leader;
                
                if ($leader && $leader->email) {
                    \Illuminate\Support\Facades\Mail::to($leader->email)
                        ->send(new \App\Mail\DispositionNotification($updatedMail, $data['sekum_desc'] ?? ''));
                    Log::info('[MAIL SERVICE] NOTIFIKASI: Email disposisi dikirim', ['email' => $leader->email]);
                } else {
                     Log::warning('[MAIL SERVICE] NOTIFIKASI: Gagal kirim email (tidak ada email leader)', ['division_id' => $updatedMail->division_id]);
                }
            } catch (\Exception $e) {
                Log::error('[MAIL SERVICE] NOTIFIKASI: Gagal mengirim email', ['error' => $e->getMessage()]);
                // Don't throw, just log. Transaction is already committed.
            }
        }

        return $updatedMail;
    }
}
