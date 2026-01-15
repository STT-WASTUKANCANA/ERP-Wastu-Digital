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

    // Menangani pendaftaran pengguna baru
    public function signup(AuthRequest $request)
    {
        try {
            $user = $this->authService->signup($request->validated());

            Log::info('[API] Pendaftaran pengguna baru berhasil', [
                'email' => $user->email,
                'ip' => request()->ip(),
            ]);

            return response()->json([
                'message' => 'User signed up successfully',
                'user'    => new UserResource($user),
            ], 201);
        } catch (Throwable $e) {
            Log::error('[API] Pendaftaran gagal: Terjadi kesalahan server', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Signup failed'], 500);
        }
    }

    // Menangani proses login dan penerbitan token
    public function signin(AuthRequest $request)
    {
        $credentials = $request->only('email', 'password');
        $tokens = $this->authService->signin($credentials);

        if (!$tokens) {
            Log::warning('[API] Percobaan login ditolak: Kredensial tidak valid', [
                'email' => $credentials['email'] ?? null,
                'ip' => request()->ip(),
            ]);
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        Log::info('[API] Login berhasil: Token diterbitkan', [
            'email' => $credentials['email'],
            'ip' => request()->ip(),
        ]);

        return $this->respondWithTokens($tokens['access_token'], $tokens['refresh_token']);
    }

    // Mengambil data profil pengguna yang sedang login
    public function profile()
    {
        $user = $this->authService->currentUser();

        Log::info('[API] Data profil diakses', [
            'email' => $user?->email,
            'ip' => request()->ip(),
        ]);

        return new UserResource($user);
    }

    // Menangani proses logout dan invalidasi token
    public function signout(Request $request)
    {
        // Mengambil refresh token dari cookie
        $refreshToken = $request->cookie('refresh_token');
        $this->authService->signout($refreshToken);

        $user = $this->authService->currentUser();
        Log::info('[API] Logout berhasil', [
            'email' => $user?->email,
            'ip' => request()->ip(),
        ]);

        return response()
            ->json(['message' => 'Successfully logged out'])
            ->withoutCookie('refresh_token')
            ->withoutCookie('access_token');
    }

    // Memperbarui akses token menggunakan refresh token
    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        try {
            $newAccessToken = $this->authService->refresh($refreshToken);

            if (!$newAccessToken) {
                Log::warning('[API] Refresh token gagal: Token tidak valid atau sesi habis', [
                    'ip' => request()->ip()
                ]);
                return response()->json(['error' => 'Invalid or expired refresh token'], 401);
            }

            Log::info('[API] Refresh token sukses: Mengirim akses token baru', [
                'ip' => request()->ip(),
            ]);

            return $this->respondWithAccessToken($newAccessToken);
        } catch (Throwable $e) {
            Log::error('[API] Refresh token error sistem', [
                'error' => $e->getMessage(),
                'ip' => request()->ip(),
            ]);

            return response()->json(['error' => 'Token refresh failed'], 500);
        }
    }

    // Helper untuk merespons dengan token akses dan refresh
    protected function respondWithTokens($accessToken, $refreshToken)
    {
        $response = [
            'message'      => 'Signin successful',
            'access_token' => $accessToken,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60
        ];

        return response()->json($response)
            ->cookie(
                'refresh_token',
                $refreshToken,
                config('jwt.refresh_ttl', 20160),
                '/',
                null,
                app()->environment('production'),
                true,
                false,
                'Strict'
            )
            ->cookie(
                'access_token',
                $accessToken,
                auth('api')->factory()->getTTL() * 60,
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
        ])->cookie(
            'access_token',
            $accessToken,
            auth('api')->factory()->getTTL() * 60,
            '/',
            null,
            app()->environment('production'),
            true,
            false,
            'Strict'
        );
    }
}
