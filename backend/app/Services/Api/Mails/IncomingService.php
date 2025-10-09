<?php
namespace App\Services\Api\Mails;

use App\Models\Dashboard\Mail\IncomingMail;

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
}
