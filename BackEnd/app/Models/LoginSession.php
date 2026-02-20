<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static create(array $array)
 * @method static where(string $string, string $identifierToken)
 * @property mixed $method
 */
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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}
