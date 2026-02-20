<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static where(string $string, mixed $phone)
 * @method static create(array $array)
 */
class Otp extends Model
{

    protected $fillable = [
        'phone',
        'otp_hash',
        'expires_at'
    ];
    protected $casts = [
        'expires_at' => 'datetime',
        'otp_hash' => 'hashed'

    ];
    protected $hidden = [
        'otp_hash',
    ];
}
