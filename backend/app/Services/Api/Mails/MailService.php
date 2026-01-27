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
            $relations[] = 'divisions';
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
                      // Read = All assigned divisions have read (user_view_id IS NOT NULL)
                      // Or strictly: Doesn't have any division with user_view_id NULL
                      $query->whereDoesntHave('divisions', function($q) {
                           $q->whereNull('incoming_mail_divisions.user_view_id');
                      });
                 } elseif ($filters['view_status'] === 'unread') {
                      // Unread = At least one assigned division has NOT read (user_view_id IS NULL)
                      $query->whereHas('divisions', function($q) {
                           $q->whereNull('incoming_mail_divisions.user_view_id');
                      });
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

        $data = $query->get();
        return $data;
    }

    public function create(array $data, int $type)
    {
        return DB::transaction(function () use ($data, $type) {
            try {
                $user = auth()->user();

                // Logic for Outgoing Mail (Type 2)
                if ($type === 2) {
                    // Restriction for Pulahta (3) creating non-SK mails removed/commented out 
                    // to allow creating Outgoing Mails if needed.
                    /* 
                    if ($user->role_id === 3) {
                         $category = \App\Models\MailCategory::find($data['category_id']);
                         // 3 = Surat Keputusan
                         if (!$category || $category->type != '3') {
                             throw new \Exception("Pulahta hanya dapat membuat Surat Keputusan (SK).");
                         }
                    }
                    */

                    // Set Status
                    // Sekum (2) & Admin (5) => Approved (3)
                    if (in_array($user->role_id, [2, 5])) {
                        $data['status'] = '3';
                    } else {
                        // Others (Tata Laksana/Kabid/Pulahta) => Verifikasi Sekum (1)
                        $data['status'] = '1';
                    }
                }

                // Shared Sequence Logic for Outgoing (2) & Decision (3)
                if ($type === 2 || $type === 3) {
                     $inputDate = strtotime($data['date']);
                     $today = strtotime(date('Y-m-d'));

                     if ($inputDate < $today) {
                         // Backdate: Sequence is NULL to preserve global counter.
                         $data['sequence'] = null;
                     } else {
                         // Regular: Increment global sequence based on Year.
                         $year = date('Y', $inputDate);
                         $latestSeq = $this->getLatestSequenceInteger($type, $year);
                         $data['sequence'] = $latestSeq + 1;
                     }
                }

                // Log::info('Mail: Created Data', ['type' => $type, 'data' => $data]);
                $model = $this->getModel($type);
                $mail = $model::create($data);

                $logStatus = null;
                if ($type == 2) {
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

    // Get raw integer sequence for calculating next number
    private function getLatestSequenceInteger(int $type, string $year): int
    {
        $typesToCheck = ($type === 2 || $type === 3) ? [2, 3] : [$type];
        $maxSeq = 0;

        foreach ($typesToCheck as $t) {
            $model = $this->getModel($t);
            if ($model) {
                // Primary: Try getting Max Sequence from DB
                $max = $model::whereYear('date', $year)->max('sequence');
                if ($max > $maxSeq) {
                    $maxSeq = $max;
                }
            }
        }
        
        // Fallback: If sequence is missing (legacy data), check string number.
        if ($maxSeq === 0) {
             $legacyMax = 0;
             foreach ($typesToCheck as $t) {
                $model = $this->getModel($t);
                if ($model) {
                    $numbers = $model::whereYear('date', $year)->pluck('number');
                    foreach ($numbers as $num) {
                        if (preg_match('/^(\d{4})/', $num, $matches)) {
                            $val = intval($matches[1]);
                            if ($val > $legacyMax) $legacyMax = $val;
                        }
                    }
                }
             }
             if ($legacyMax > $maxSeq) {
                 $maxSeq = $legacyMax;
             }
        }

        return $maxSeq;
    }

    public function getLatestNumber(int $type, string $dateString): string
    {
        $inputDate = strtotime($dateString);
        $today = strtotime(date('Y-m-d'));
        
        $year = date('Y', $inputDate);

        if ($inputDate < $today) {
            // Backdate Logic: Find latest number <= date, do NOT increment.
            $typesToCheck = ($type === 2 || $type === 3) ? [2, 3] : [$type];
            $latestNumber = null;
            $latestDate = null;

            foreach ($typesToCheck as $t) {
                $model = $this->getModel($t);
                if ($model) {
                    // Get latest mail on or before the target date
                    $item = $model::whereDate('date', '<=', $dateString)
                        ->whereYear('date', $year)
                        ->orderBy('date', 'desc')
                        ->orderBy('id', 'desc') 
                        ->first();
                    
                    if ($item) {
                         // Find the most recent among checked types
                        if (!$latestDate || strtotime($item->date) >= $latestDate) {
                            $latestDate = strtotime($item->date);
                            $latestNumber = $item->number;
                        }
                    }
                }
            }
            
            // Prefer clean sequence if available
            if ($latestNumber) {
                // Re-find object to check sequence if needed, but for now relying on regex fallback is fine for simple display
                // Or simplified regex extraction
                if (preg_match('/^(\d{4})/', $latestNumber, $matches)) {
                    return $matches[1];
                }
            }
            
            return '0000';
            
        } else {
             // Standard Logic: Max Sequence + 1
            $maxSeq = $this->getLatestSequenceInteger($type, $year);
            return str_pad($maxSeq + 1, 4, '0', STR_PAD_LEFT);
        }
    }
    public function getMonthlySummary(int $type): array
    {
        $model = $this->getModel($type);
        if (!$model) {
            return [
                'current_month_total' => 0,
                'percentage_change' => 0,
                'status' => 'increase'
            ];
        }

        $currentCount = $model::getTotalForCurrentMonth();
        $lastCount = $model::getTotalForPreviousMonth();

        $percentage = 0;
        if ($lastCount > 0) {
            $percentage = (($currentCount - $lastCount) / $lastCount) * 100;
        } elseif ($currentCount > 0) {
            $percentage = 100;
        }

        $status = $currentCount >= $lastCount ? 'increase' : 'decrease';

        return [
            'current_month_total' => $currentCount,
            'percentage_change' => round(abs($percentage), 1),
            'status' => $status
        ];
    }
}
