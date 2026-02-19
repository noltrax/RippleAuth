<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    protected $fillable = [
        'phone',
        'otp_hash',
        'expires_at'
    ];
    protected $casts = [
        'expires_at' => 'datetime'
    ];
}
