<?php

namespace App\Models\Dashboard\Mail;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OutgoingMail extends Model
{
    use SoftDeletes;
    protected $table = 'outgoing_mails';
    protected $guarded = ['id'];
    protected $dates = ['deleted_at'];
    public function mail_category()
    {
        return $this->belongsTo(MailCategories::class, 'category_id');
    }
}
