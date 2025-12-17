<?php

namespace App\Models\Workspace\Mails;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DecisionLetter extends Model
{
    use SoftDeletes;
    protected $table = "decision_latters";
    protected $guarded = ["id"];
    public function mail_category()
    {
        return $this->belongsTo(MailCategory::class, 'category_id');
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function mail_log()
    {
        return $this->hasOne(MailLog::class, 'mail_id')->where('type', '3');
    }
}
