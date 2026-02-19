<?php

namespace App\Http\Controllers;

use App\Contracts\AuthServiceContract;
use App\Exceptions\InvalidCredentialsException;
use App\Http\Requests\IdentifyRequest;
use App\Http\Requests\VerifyRequest;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function identify(IdentifyRequest $request, AuthServiceContract $authService)
    {
        $data = $request->validated();
        $identifierToken = $authService->identify($data);

        return response()->json([
            'message' => 'Identifier accepted',
            'identifier_token' => $identifierToken,
        ], 200);
    }
    public function verify(VerifyRequest $request, AuthServiceContract $authService)
    {
        $data = $request->validated();

        $token = $authService->verify($data);

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
        ], 200);
    }
}
