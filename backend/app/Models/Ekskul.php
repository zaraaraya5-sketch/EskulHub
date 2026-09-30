<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ekskul extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $guarded = [];

    protected $casts = [
        'syllabus' => 'array',
        'achievements' => 'array',
        'member_capacity' => 'integer',
        'current_member_count' => 'integer',
        'achievements_count' => 'integer',
    ];
}
