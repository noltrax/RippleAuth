<?php
namespace App\Services\Auth;
use App\Models\User;

class UserResolverService
{
    public function resolveByEmail(string $email): User
    {
        return User::firstOrCreate(
            ['email' => $email],
        );
    }

    public function resolveByPhone(string $phone): User
    {
        return User::firstOrCreate(
            ['phone' => $phone],
        );
    }

}
