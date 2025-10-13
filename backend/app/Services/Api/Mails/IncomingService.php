<?php

namespace App\Services\Api\Mails;

use App\Models\Dashboard\Mail\IncomingMail;
use Illuminate\Support\Facades\Log;

class IncomingService
{
    public function all()
    {
        $data = IncomingMail::with('mail_category')->latest()->get();
        Log::info('Mail: fetched all', ['count' => $data->count()]);
        return $data;
    }

    public function create(array $data)
    {
        try {
            $mail = IncomingMail::create($data);
            Log::info('Mail: created', ['id' => $mail->id]);
            return $mail;
        } catch (\Throwable $e) {
            Log::error('Mail: create failed', ['msg' => $e->getMessage()]);
            throw $e;
        }
    }

    public function find($id)
    {
        $mail = IncomingMail::with('mail_category')->find($id);
        Log::warning('Mail: not found', ['id' => $id]) ?: Log::info('Mail: found', ['id' => $id]);
        return $mail;
    }

    public function update($id, array $data)
    {
        $mail = IncomingMail::find($id);
        if (!$mail) {
            Log::warning('Mail: update failed, not found', ['id' => $id]);
            return null;
        }
        $mail->update($data);
        Log::info('Mail: updated', ['id' => $id]);
        return $mail;
    }

    public function delete($id)
    {
        $mail = IncomingMail::find($id);
        if (!$mail) {
            Log::warning('Mail: delete failed, not found', ['id' => $id]);
            return false;
        }
        $mail->delete();
        Log::info('Mail: deleted', ['id' => $id]);
        return true;
    }

    public function getMonthlySummary(): array
    {
        $curr = IncomingMail::getTotalForCurrentMonth();
        $prev = IncomingMail::getTotalForPreviousMonth();
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
