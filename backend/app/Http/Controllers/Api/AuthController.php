<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AuthRequest;
use App\Http\Resources\Api\UserResource;
use App\Services\Api\AuthService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function signup(AuthRequest $request)
    {
        $user = $this->authService->signup($request->validated());

        return response()->json([
            'message' => 'User signuped successfully',
            'user'    => new UserResource($user),
        ], 201);
    }

    public function signin(AuthRequest $request)
    {
        $token = $this->authService->signin($request->only('email', 'password'));

        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // simpan token di HttpOnly cookie
        return $this->respondWithCookie($token);
    }

    public function profile()
    {
        return new UserResource($this->authService->currentUser());
    }

    public function signout()
    {
        $this->authService->signout();

        return response()
            ->json(['message' => 'Successfully logged out'])
            ->withoutCookie('access_token');
    }

    public function refresh()
    {
        $token = $this->authService->refresh();

        return $this->respondWithCookie($token);
    }

    protected function respondWithCookie($token)
    {
        $json = [
            'message' => 'Signin successful',
        ];

        if (app()->environment('local')) { 
            $json['token'] = $token;
            $json['token_type'] = 'bearer';
            $json['expires_in'] = Auth::guard('api')->factory()->getTTL() * 60;
        }

        return response()
            ->json($json)
            ->cookie(
                'access_token',
                $token,
                Auth::guard('api')->factory()->getTTL(),
                '/',
                null,
                app()->environment('production'), // secure=true di production
                true,
                'Strict'
            );
    }
}
