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
                Log::debug('[Auth] Memulai proses login', ['email' => $credentials['email']]);

                if (!$accessToken = auth('api')->attempt($credentials)) {
                        Log::warning('[Auth] Gagal login: Password atau email salah', ['email' => $credentials['email']]);
                        return null;
                }

                $user = auth('api')->user();
                $refreshTokenString = Str::random(60);

                $refreshToken = RefreshToken::create([
                        'user_id'    => $user->id,
                        'token'      => Hash::make($refreshTokenString),
                        'expires_at' => now()->addDays(7),
                        'ip_address' => request()->ip(),
                        'user_agent' => request()->userAgent(),
                ]);

                Log::info('[Auth] Pengguna berhasil login', [
                    'id' => $user->id,
                    'email' => $user->email,
                    'ip' => request()->ip()
                ]);

                return [
                        'access_token'  => $accessToken,
                        'refresh_token' => $refreshToken->id . '|' . $refreshTokenString,
                ];
        }

        public function signout(?string $refreshTokenString): void
        {
                if ($refreshTokenString) {
                        // Memastikan format token adalah ID|STRING sebelum diproses
                        if (str_contains($refreshTokenString, '|')) {
                            [$id, $token] = explode('|', $refreshTokenString, 2);
                            $storedToken = RefreshToken::find($id);
                            
                            if ($storedToken && Hash::check($token, $storedToken->token)) {
                                $storedToken->delete();
                                Log::info('[Auth] Refresh token berhasil dihapus', ['token_id' => $id]);
                            } else {
                                Log::warning('[Auth] Gagal logout: Token tidak valid atau tidak ditemukan', ['token_id' => $id]);
                            }
                        }
                }

                $user = auth('api')->user();
                Log::info('[Auth] Pengguna melakukan logout', ['id' => $user?->id, 'email' => $user?->email]);
                auth('api')->logout();
        }

        public function refresh(?string $refreshTokenString): ?string
        {
                if (!$refreshTokenString) {
                        Log::warning('[Auth] Permintaan refresh gagal: Token kosong');
                        return null;
                }

                if (!str_contains($refreshTokenString, '|')) {
                    Log::error('[Auth] Refresh token token rusak: Format tidak sesuai (Tanpa pemisah pipe)');
                    return null;
                }

                [$id, $token] = explode('|', $refreshTokenString, 2);

                $refreshToken = RefreshToken::find($id);

                if (!$refreshToken) {
                    Log::warning('[Auth] Refresh gagal: ID Token tidak ditemukan di database', ['token_id' => $id]);
                    return null;
                }

                if ($refreshToken->expires_at <= now()) {
                    Log::warning('[Auth] Refresh gagal: Token sudah kadaluwarsa', ['token_id' => $id, 'expired_at' => $refreshToken->expires_at]);
                    return null;
                }

                if (!Hash::check($token, $refreshToken->token)) {
                    Log::error('[Auth] Refresh gagal: Hash token tidak cocok (Potensi manipulasi)', ['token_id' => $id]);
                    return null;
                }

                $user = User::find($refreshToken->user_id);
                if (!$user) {
                     Log::critical('[Auth] Refresh gagal: Data pengguna terkait token hilang', ['user_id' => $refreshToken->user_id]);
                     return null;
                }

                $newAccessToken = auth('api')->login($user);

                Log::info('[Auth] Refresh token berhasil: Akses token baru diterbitkan', [
                    'user_id' => $user->id,
                    'token_id' => $id
                ]);
                
                return $newAccessToken;
        }

        public function currentUser(): ?User
        {
                $user = auth('api')->user();
                if ($user) {
                    Log::debug('[Auth] Mengambil data pengguna aktif', ['id' => $user->id]);
                }
                return $user;
        }
}
