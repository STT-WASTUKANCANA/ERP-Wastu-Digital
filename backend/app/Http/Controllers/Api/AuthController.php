<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AuthRequest;
use App\Http\Resources\Api\UserResource;
use App\Services\Api\AuthService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function signup(AuthRequest $request)
    {
        try {
            $user = $this->authService->signup($request->validated());

            Log::info('User signup successfully', [
                'email' => $user->email,
                'ip' => request()->ip(),
            ]);

            return response()->json([
                'message' => 'User signed up successfully',
                'user'    => new UserResource($user),
            ], 201);
        } catch (Throwable $e) {
            Log::error('Signup failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Signup failed'], 500);
        }
    }

    public function signin(AuthRequest $request)
    {
        $credentials = $request->only('email', 'password');
        $token = $this->authService->signin($credentials);

        if (!$token) {
            Log::warning('Unauthorized signin attempt', [
                'email' => $credentials['email'] ?? null,
                'ip' => request()->ip(),
            ]);
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        Log::info('User signed in successfully', [
            'email' => $credentials['email'],
            'ip' => request()->ip(),
        ]);

        return $this->respondWithCookie($token);
    }

    public function profile()
    {
        $user = $this->authService->currentUser();

        Log::info('Profile accessed', [
            'email' => $user?->email,
            'ip' => request()->ip(),
        ]);

        return new UserResource($user);
    }

    public function signout()
    {
        $user = $this->authService->currentUser();

        $this->authService->signout();

        Log::info('User signed out', [
            'email' => $user?->email,
            'ip' => request()->ip(),
        ]);

        return response()
            ->json(['message' => 'Successfully logged out'])
            ->withoutCookie('access_token');
    }

    public function refresh()
    {
        try {
            $token = $this->authService->refresh();

            Log::info('Token refreshed successfully', [
                'email' => auth('api')->user()?->email,
                'ip' => request()->ip(),
            ]);

            return $this->respondWithCookie($token);
        } catch (Throwable $e) {
            Log::error('Token refresh failed', [
                'error' => $e->getMessage(),
                'ip' => request()->ip(),
            ]);

            return response()->json(['error' => 'Token refresh failed'], 500);
        }
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
                app()->environment('production'),
                true,
                'Strict'
            );
    }
}
