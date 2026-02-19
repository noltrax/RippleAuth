<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class LoginSession extends Model{
    protected $fillable = [
        'user_id',
        'identifier_token',
        'method',
        'expires_at',
    ];
    protected $casts = [
        'expires_at' => 'datetime'
    ];
}
