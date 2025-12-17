<?php

namespace App\Models\Workspace\Mails;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class OutgoingMail extends Model
{
    use SoftDeletes;
    protected $table = 'outgoing_mails';
    protected $guarded = ['id'];
    protected $casts = ['date' => 'datetime'];
    public static function getTotalForCurrentMonth(): int
    {
        $start = Carbon::now()->startOfMonth();
        $end = Carbon::now()->endOfMonth();

        return self::whereBetween('created_at', [$start, $end])->count();
    }
    public static function getTotalForPreviousMonth(): int
    {
        $start = Carbon::now()->subMonth()->startOfMonth();
        $end = Carbon::now()->subMonth()->endOfMonth();

        return self::whereBetween('created_at', [$start, $end])->count();
    }
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
        return $this->hasOne(MailLog::class, 'mail_id')->where('type', 2);
    }
}
