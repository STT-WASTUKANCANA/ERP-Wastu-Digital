<?php

namespace App\Services\Api\Mails;

use App\Models\Workspace\Mails\IncomingMail;
use App\Models\Workspace\Mails\MailLog;
use App\Models\Workspace\Mails\OutgoingMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MailService
{
    private function getModel(int $type)
    {
        return $type === 1 ? IncomingMail::class : OutgoingMail::class;
    }

    public function all(int $type)
    {
        $model = $this->getModel($type);
        $data = $model::with('mail_category')->latest()->get();
        Log::info('Mail: fetched all', ['count' => $data->count(), 'type' => $type]);
        return $data;
    }

    public function create(array $data, int $type)
    {
        return DB::transaction(function () use ($data, $type) {
            try {
                $model = $this->getModel($type);
                $mail = $model::create($data);

                if ($type === 1) {
                    MailLog::create([
                        'user_id' => $data['user_id'],
                        'mail_id' => $mail->id,
                        'type'    => 1,
                        'status'  => 1,
                        'desc'    => $data['desc'] ?? null,
                    ]);
                }

                Log::info('Mail: created', [
                    'id'   => $mail->id,
                    'type' => $type
                ]);

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
        return $model::with('mail_category')->find($id);
    }

    public function update($id, array $data, int $type)
    {
        $mail = $this->find($id, $type);
        if (!$mail) return null;
        $mail->update($data);
        Log::info('Mail: updated', ['id' => $id, 'type' => $type]);
        return $mail;
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

        Log::info('Mail: monthly summary', ['curr' => $curr, 'prev' => $prev, 'diff' => round($diff, 2)]);
        return [
            'current_month_total' => $curr,
            'previous_month_total' => $prev,
            'percentage_change' => round($diff, 2),
            'status' => $status,
        ];
    }
}
