<?php

namespace App\Models\Workspace\Mails;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncomingMail extends Model
{
    use SoftDeletes;
    protected $table = 'incoming_mails';
    protected $guarded = ['id'];
    protected $casts = ['date' => 'datetime'];

    public function viewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_view_id');
    }
    
    public function divisions()
    {
        return $this->belongsToMany(\App\Models\Division::class, 'incoming_mail_divisions', 'incoming_mail_id', 'division_id')
                    ->withPivot('user_view_id');
    }
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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function mail_category(): BelongsTo
    {
        return $this->belongsTo(MailCategory::class, 'category_id');
    }
    public function mail_log(): HasMany
    {
        return $this->hasMany(MailLog::class, 'mail_id')->where('type', 1);
    }
}
