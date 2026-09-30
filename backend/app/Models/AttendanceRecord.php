<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceRecord extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];
}
