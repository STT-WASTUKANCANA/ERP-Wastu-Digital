<?php

namespace App\Models\Dashboard\Mail;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MailCategory extends Model
{
    use SoftDeletes;
    protected $table = 'mail_categories';
    protected $guarded = ['id'];
    public function incoming_mails()
    {
        return $this->hasMany(IncomingMail::class);
    }

    public function outgoing_mails()
    {
        return $this->hasMany(OutgoingMail::class);
    }
}
