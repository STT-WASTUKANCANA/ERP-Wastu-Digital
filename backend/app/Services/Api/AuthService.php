<?php

namespace App\Services\Api;

use App\Models\User;
use App\Models\RefreshToken;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthService
{
        public function signup(array $data): User
        {
                Log::info('Proses signup dimulai', ['email' => $data['email']]);

                $user = User::create([
                        'name'     => $data['name'],
                        'email'    => $data['email'],
                        'password' => Hash::make($data['password']),
                ]);

                Log::info('User berhasil dibuat', ['id' => $user->id, 'email' => $user->email]);

                return $user;
        }

        public function signin(array $credentials): ?array
        {
                Log::debug('Percobaan signin', ['email' => $credentials['email']]);

                if (!$accessToken = auth('api')->attempt($credentials)) {
                        Log::warning('Signin gagal: kredensial salah', ['email' => $credentials['email']]);
                        return null;
                }

                $user = auth('api')->user();
                $refreshTokenString = Str::random(60);

                RefreshToken::create([
                        'user_id'    => $user->id,
                        'token'      => Hash::make($refreshTokenString),
                        'expires_at' => now()->addDays(7),
                        'ip_address' => request()->ip(),
                        'user_agent' => request()->userAgent(),
                ]);

                Log::info('User berhasil signin', ['email' => $credentials['email']]);

                return [
                        'access_token'  => $accessToken,
                        'refresh_token' => $refreshTokenString,
                ];
        }

        public function signout(?string $refreshTokenString): void
        {
                if ($refreshTokenString) {
                        $tokens = RefreshToken::where('user_id', auth('api')->id())->get();
                        foreach ($tokens as $token) {
                                if (Hash::check($refreshTokenString, $token->token)) {
                                        $token->delete();
                                        Log::info('Refresh token dihapus dari DB', ['id' => $token->id]);
                                        break;
                                }
                        }
                }

                $user = auth('api')->user();
                Log::info('User signout', ['id' => $user?->id, 'email' => $user?->email]);
                auth('api')->logout();
        }

        public function refresh(?string $refreshTokenString): ?string
        {
                if (!$refreshTokenString) {
                        return null;
                }

                $refreshToken = RefreshToken::where('user_id', auth('api')->id())->where('expires_at', '>', now())->get()->first(function ($token) use ($refreshTokenString) {
                        return Hash::check($refreshTokenString, $token->token);
                });

                if (!$refreshToken) {
                        Log::warning('Refresh token tidak valid atau kedaluwarsa');
                        return null;
                }

                $user = $this->currentUser();
                $newAccessToken = auth('api')->login($user);

                Log::info('Token berhasil diperbarui menggunakan refresh token', ['id' => $user?->id]);
                return $newAccessToken;
        }

        public function currentUser(): ?User
        {
                $user = auth('api')->user();
                Log::debug('Mengambil data user saat ini', ['id' => $user?->id, 'email' => $user?->email]);
                return $user;
        }
}
