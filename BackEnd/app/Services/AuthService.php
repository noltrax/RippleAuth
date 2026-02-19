<?php
namespace App\Services;
use App\Contracts\AuthServiceContract;
use App\Exceptions\InvalidCredentialsException;
use App\Models\LoginSession;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthService implements AuthServiceContract{

    /**
     * @throws InvalidCredentialsException
     */
    public function identify(array $credentials): string{

        if($credentials['method']==='email'){
            $user= $this->createUserWithEmail($credentials);

        }
        elseif ($credentials['method']==='phone'){
            $user= $this->createUserWithPhone($credentials);
            $this->generateOtp($user);
        }
        else{
            throw new InvalidCredentialsException('Unsupported method.');
        }
        return $this->createLoginSession($user, $credentials);


    }
    private function createLoginSession(User $user,array $credentials): LoginSession
    {
        $identifierToken = Str::uuid()->toString();
        return LoginSession::create([
            'user_id' => $user->id,
            'identifier_token' => $identifierToken,
            'method' => $credentials['method'],
            'expires_at' => now()->addMinutes(10),
        ]);

    }


    private function createUserWithEmail(array $credentials):User
    {
         return User::firstOrCreate(
            ['email' => $credentials['email']],
            ['password' => null]
        );
    }

    private function createUserWithPhone(array $credentials):?User
    {
        return User::firstOrCreate(
            ['phone' => $credentials['phone']],
            ['password' => null]
        );
    }
    private function generateOtp(User $user): string
    {
        $otp = rand(100000, 999999);

        Otp::create([
            'phone' => $user->phone,
            'otp_hash' => Hash::make($otp),
            'expires_at' => now()->addMinutes(5),
        ]);
        return $otp;

        // In real app, send SMS here
    }

    /**
     * @throws InvalidCredentialsException
     */
    public function verify(array $data): string
    {
        $session = $this->getValidSession($data['identifier_token']);

        $user = $session->user;

        $this->validateCredentials($session->method, $user, $data);

        $token = $this->issueToken($user);

        $this->finalizeSession($session);

        return $token;

    }

    /**
     * @throws InvalidCredentialsException
     */
    private function getValidSession(string $identifierToken): LoginSession
    {
        $session = LoginSession::where('identifier_token', $identifierToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$session) {
            throw new InvalidCredentialsException('Session expired or invalid.');
        }

        return $session;
    }

    /**
     * @throws InvalidCredentialsException
     */
    private function validateCredentials(string $method, User $user, array $data): void
    {
        match ($method) {
            'email' => $this->validatePassword($user, $data['password'] ?? null),
            'otp'   => $this->validateOtp($user, $data['otp'] ?? null),
            default => throw new InvalidCredentialsException('Unsupported login method.'),
        };
    }

    /**
     * @throws InvalidCredentialsException
     */
    private function validatePassword(User $user, ?string $password): void
    {
        if (!$password || !$user->password) {
            throw new InvalidCredentialsException('Password required.');
        }

        if (!Hash::check($password, $user->password)) {
            throw new InvalidCredentialsException('Invalid password.');
        }
    }

    /**
     * @throws InvalidCredentialsException
     */
    private function validateOtp(User $user, ?string $otp):void
    {
        if (!$otp) {
            throw new InvalidCredentialsException('OTP required.');
        }

        $record = Otp::where('phone', $user->phone)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$record || !Hash::check($otp, $record->otp_hash)) {
            throw new InvalidCredentialsException('Invalid OTP.');
        }

        $record->delete();

    }
    private function issueToken(User $user): string
    {
        return $user->createToken('coolLogin')->plainTextToken;
    }
    private function finalizeSession(LoginSession $session): void
    {
        $session->delete();
    }


}
