<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserExtracurricular extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function extracurricular()
    {
        return $this->belongsTo(Ekskul::class, 'extracurricular_id', 'id');
    }
}
