<?php

namespace App\Services\Api\Mails;

use App\Models\Dashboard\Mail\IncomingMail;
use Carbon\Carbon;

class IncomingService
{
    public function all()
    {
        return IncomingMail::with('mail_category')->latest()->get();
    }

    public function create(array $data)
    {
        return IncomingMail::create($data);
    }

    public function find($id)
    {
        return IncomingMail::with('mail_category')->find($id);
    }

    public function update($id, array $data)
    {
        $mail = IncomingMail::find($id);
        if (!$mail) return null;

        $mail->update($data);
        return $mail;
    }

    public function delete($id)
    {
        $mail = IncomingMail::find($id);
        if (!$mail) return false;

        $mail->delete();
        return true;
    }

    public function getMonthlySummary(): array
    {
        $currentMonthTotal = IncomingMail::getTotalForCurrentMonth();
        $previousMonthTotal = IncomingMail::getTotalForPreviousMonth();

        $percentageChange = 0;
        if ($previousMonthTotal > 0) {
            $percentageChange = (($currentMonthTotal - $previousMonthTotal) / $previousMonthTotal) * 100;
        } elseif ($currentMonthTotal > 0) {
            $percentageChange = 100;
        }

        $status = 'unchanged';
        if ($percentageChange > 0) {
            $status = 'increase';
        } elseif ($percentageChange < 0) {
            $status = 'decrease';
        }

        return [
            'current_month_total' => $currentMonthTotal,
            'previous_month_total' => $previousMonthTotal,
            'percentage_change' => round($percentageChange, 2),
            'status' => $status,
        ];
    }
}
