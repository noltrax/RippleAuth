<?php
namespace App\Services\Auth;
use App\Models\User;

class TokenService{
    public function issueToken(User $user): string
    {
        return $user->createToken('coolLogin')->plainTextToken;
    }
}
