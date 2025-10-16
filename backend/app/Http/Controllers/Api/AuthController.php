<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AuthRequest;
use App\Http\Resources\Api\UserResource;
use App\Services\Api\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        $tokens = $this->authService->signin($credentials);

        if (!$tokens) {
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

        return $this->respondWithTokens($tokens['access_token'], $tokens['refresh_token']);
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

    public function signout(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');
        $this->authService->signout($refreshToken);

        $user = $this->authService->currentUser();
        Log::info('User signed out', [
            'email' => $user?->email,
            'ip' => request()->ip(),
        ]);

        return response()
            ->json(['message' => 'Successfully logged out'])
            ->withoutCookie('refresh_token');
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        try {
            $newAccessToken = $this->authService->refresh($refreshToken);

            if (!$newAccessToken) {
                return response()->json(['error' => 'Invalid or expired refresh token'], 401);
            }

            Log::info('Token refreshed successfully', [
                'email' => auth('api')->user()?->email,
                'ip' => request()->ip(),
            ]);

            return $this->respondWithAccessToken($newAccessToken);
        } catch (Throwable $e) {
            Log::error('Token refresh failed', [
                'error' => $e->getMessage(),
                'ip' => request()->ip(),
            ]);

            return response()->json(['error' => 'Token refresh failed'], 500);
        }
    }

    protected function respondWithTokens($accessToken, $refreshToken)
    {
        $response = [
            'message'      => 'Signin successful',
            'access_token' => $accessToken,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60
        ];

        return response()->json($response)->cookie(
            'refresh_token',
            $refreshToken,
            auth('api')->factory()->getTTL() * 24 * 7, // 7 hari
            '/',
            null,
            app()->environment('production'),
            true,
            false,
            'Strict'
        );
    }

    protected function respondWithAccessToken($accessToken)
    {
        return response()->json([
            'access_token' => $accessToken,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60
        ]);
    }
}
