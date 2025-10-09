<?php

namespace App\Models\Dashboard\Mail;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncomingMail extends Model
{
    use SoftDeletes;
    protected $table = 'incoming_mails';
    protected $guarded = ['id'];
    protected $casts = ['date' => 'datetime'];

    public function mail_category()
    {
        return $this->belongsTo(MailCategory::class, 'category_id');
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
