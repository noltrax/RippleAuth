<?php
namespace App\Services\Auth;
use App\Exceptions\InvalidCredentialsException;

readonly class AuthService{

    public function __construct(
        private UserResolverService $userResolver,
        private LoginSessionService $sessionService,
        private OtpService          $otpService,
        private TokenService        $tokenService,

    ) {}

    /**
     * @throws InvalidCredentialsException
     */

    public function identify(array $credentials): string{

        $user = match($credentials['method']) {
            'email' => $this->userResolver->resolveByEmail($credentials['identifier']),
            'phone' => $this->userResolver->resolveByPhone($credentials['identifier']),
            default => throw new InvalidCredentialsException('Unsupported method.'),
        };
        $this->otpService->generateOtp($user);

        return $this->sessionService->createLoginSession($user, $credentials);


    }

    /**
     * @throws InvalidCredentialsException
     */
    public function verify(array $data): string
    {
        $session = $this->sessionService->getValidSession($data['identifier_token']);

        $user = $session->user;
        if (!$user) {
            throw new InvalidCredentialsException('User not found for session.');
        }
        $this->otpService->validateOtp($user, $data['otp'] ?? null);

        $token = $this->tokenService->issueToken($user);

        $this->sessionService->finalizeSession($session);

        return $token;

    }


}
