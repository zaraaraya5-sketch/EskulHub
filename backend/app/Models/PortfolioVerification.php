<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioVerification extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;
    protected $guarded = [];

    protected $casts = [
        'summary_data' => 'array',
    ];
}
