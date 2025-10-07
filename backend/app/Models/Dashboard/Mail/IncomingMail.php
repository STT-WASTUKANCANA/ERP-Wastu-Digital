<?php

namespace App\Models\Dashboard\Mail;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncomingMail extends Model
{
    use SoftDeletes;
    protected $table = 'incoming_mails';
    protected $guarded = ['id'];
    protected $dates = ['deleted_at'];

    public function mail_category() {
        return $this->belongsTo(MailCategories::class);
    }
}
