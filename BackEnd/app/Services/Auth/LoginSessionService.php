<?php /** @noinspection ALL */

namespace App\Services\Auth;
use App\Exceptions\InvalidCredentialsException;
use App\Models\LoginSession;
use App\Models\User;
use Illuminate\Support\Str;

class LoginSessionService{
    public function createLoginSession(User $user,array $credentials): string
    {
        $identifierToken = Str::uuid()->toString();
         LoginSession::create([
            'user_id' => $user->id,
            'identifier_token' => $identifierToken,
            'method' => $credentials['method'],
            'expires_at' => now()->addMinutes(10),
        ]);
        return $identifierToken;
    }
    /**
     * @throws InvalidCredentialsException
     */
    public function getValidSession(string $identifierToken): LoginSession
    {
        $session = LoginSession::where('identifier_token',$identifierToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$session) {
            throw new InvalidCredentialsException('Session expired or invalid.');
        }

        return $session;
    }
    public function finalizeSession(LoginSession $session): void
    {
        $session->delete();
    }

}
