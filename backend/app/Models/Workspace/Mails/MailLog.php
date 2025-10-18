<?php

namespace App\Models\Workspace\Mails;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MailLog extends Model
{
    protected $table = 'mail_logs';
    protected $guarded = ['id'];
    public function incoming_mail(): BelongsTo
    {
        return $this->belongsTo(IncomingMail::class, 'mail_id');
    }
    public function outgoing_mail(): BelongsTo
    {
        return $this->belongsTo(OutgoingMail::class, 'mail_id');
    }
}
