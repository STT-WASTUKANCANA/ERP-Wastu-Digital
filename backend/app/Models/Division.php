<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Division extends Model
{
    use SoftDeletes;
    protected $table = "divisions";
    protected $guarded = ["id"];

    public function leader()
    {
        return $this->belongsTo(User::class, 'leader_id');
    }
}
