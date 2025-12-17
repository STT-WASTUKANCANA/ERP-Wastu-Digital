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

    public function all(int $type)
    {
        $model = $this->getModel($type);
        $data = $model::with('mail_category', 'mail_log')->latest()->get();
        Log::info('Mail: fetched all', ['count' => $data->count(), 'type' => $type]);
        return $data;
    }

    public function create(array $data, int $type)
    {
        return DB::transaction(function () use ($data, $type) {
            try {
                Log::info('Mail: Created Data', [
                    'type' => $type,
                    'data' => $data,
                ]);
                $model = $this->getModel($type);
                $mail = $model::create($data);

                MailLog::create([
                    'user_id' => $data['user_id'],
                    'mail_id' => $mail->id,
                    'type'    => (string) $type,
                    'status'  => $type == 1 ? '1' : null,
                    'desc'    => $data['desc'] ?? null,
                ]);

                Log::info('Mail: created', ['id' => $mail->id, 'type' => $type]);
                return $mail;
            } catch (\Throwable $e) {
                Log::error('Mail: creation failed', [
                    'error' => $e->getMessage(),
                    'type'  => $type,
                    'data'  => $data
                ]);
                throw $e;
            }
        });
    }

    public function find($id, int $type)
    {
        $model = $this->getModel($type);
        return $model::with('mail_category', 'mail_log')->find($id);
    }

    public function update($id, array $data, int $type)
    {
        $mail = $this->find($id, $type);

        if (!$mail) {
            Log::warning('Mail: update failed, mail not found', [
                'id' => $id,
                'type' => $type,
                'payload' => $data
            ]);
            return null;
        }

        try {
            $mail->update($data);

            if ($type === 1 && isset($data['desc'])) {
                $mailLog = $mail->mail_log()
                    ->where('type', 1)
                    ->where('status', $mail->status)
                    ->first();

                if ($mailLog) {
                    $mailLog->update(['desc' => $data['desc']]);
                    Log::info('MailLog: desc updated', [
                        'mail_id' => $mail->id,
                        'type' => 1,
                        'status' => $mail->status
                    ]);
                }
            }

            Log::info('Mail: updated successfully', [
                'id' => $id,
                'type' => $type
            ]);

            return $mail;
        } catch (\Throwable $e) {
            Log::error('Mail: update failed', [
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
        Log::info('Mail: deleted', ['id' => $id, 'type' => $type]);
        return true;
    }

    public function getMonthlySummary(int $type): array
    {
        $model = $this->getModel($type);
        $curr = $model::getTotalForCurrentMonth();
        $prev = $model::getTotalForPreviousMonth();
        $diff = $prev > 0 ? (($curr - $prev) / $prev) * 100 : ($curr > 0 ? 100 : 0);
        $status = $diff > 0 ? 'increase' : ($diff < 0 ? 'decrease' : 'unchanged');

        Log::info('Mail: monthly summary', [
            'curr' => $curr,
            'prev' => $prev,
            'diff' => round($diff, 2)
        ]);

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

        $nextStatus = [
            1 => 2,
            2 => 3,
            3 => 3,
        ][$mail->status] ?? null;


        if (!$nextStatus) {
            Log::warning('MailService: invalid status transition', [
                'id' => $id,
                'current_status' => $mail->status
            ]);
            return null;
        }

        return DB::transaction(function () use ($mail, $data, $id, $type, $nextStatus) {
            try {
                $updateData = ['status' => $nextStatus];

                if ($nextStatus === 2) {
                    $updateData['division_id'] = $data['division_id'];
                }

                if ($nextStatus === 3) {
                    $updateData['follow_status'] = $data['follow_status'];
                }

                $mail->update($updateData);

                MailLog::updateOrCreate(
                    [
                        'mail_id' => $id,
                        'type'    => 1,
                        'status'  => $nextStatus,
                    ],
                    [
                        'user_id' => $data['user_id'],
                        'desc'    => $nextStatus === 3
                            ? ($data['division_desc'] ?? null)
                            : ($data['desc'] ?? null),
                    ]
                );

                Log::info('MailService: reviewed successfully', compact('id', 'type'));

                return $mail->load('mail_log');
            } catch (\Throwable $e) {
                Log::error('MailService: review failed', [
                    'id' => $id,
                    'type' => $type,
                    'payload' => $data,
                    'error' => $e->getMessage()
                ]);
                throw $e;
            }
        });
    }
}
