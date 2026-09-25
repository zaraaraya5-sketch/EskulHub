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
        'is_registration_open' => 'boolean',
        'syllabus' => 'array',
        'achievements' => 'array',
        'current_members' => 'integer',
        'max_quota' => 'integer',
    ];
}
