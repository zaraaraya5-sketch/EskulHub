<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceSession extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'total_members' => 'integer',
        'present_count' => 'integer',
        'late_count' => 'integer',
        'excused_count' => 'integer',
        'absent_count' => 'integer',
    ];
}
