<?php

namespace App\Http\Controllers;

use App\Exceptions\InvalidCredentialsException;
use App\Http\Requests\IdentifyRequest;
use App\Http\Requests\VerifyRequest;
use App\Services\Auth\AuthService;

class LoginController extends Controller
{

    public function __construct(
        private AuthService  $authService,
        )
    {

    }

    /**
     * @throws InvalidCredentialsException
     */
    public function identify(IdentifyRequest $request)
    {
        $data = $request->validated();
        $identifierToken = $this->authService->identify($data);

        return response()->json([
            'message' => 'Identifier accepted',
            'identifier_token' => $identifierToken,
        ], 200);
    }

    /**
     * @throws InvalidCredentialsException
     */
    public function verify(VerifyRequest $request)
    {
        $data = $request->validated();

        $token = $this->authService->verify($data);

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
        ], 200);
    }
}
