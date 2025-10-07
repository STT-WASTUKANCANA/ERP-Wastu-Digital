<?php

namespace App\Models\Dashboard\Mail;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MailCategories extends Model
{
    use SoftDeletes;
    protected $table = 'mail_categories';
    protected $guarded = ['id'];
    protected $dates = ['deleted_at'];

    public function incoming_mail() {
        return $this->hasMany(IncomingMail::class);
    }
    
    public function outgoing_mail() {
        return $this->hasMany(OutgoingMail::class);
    }

}
