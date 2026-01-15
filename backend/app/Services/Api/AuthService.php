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


                $user = User::create([
                        'name'     => $data['name'],
                        'email'    => $data['email'],
                        'password' => Hash::make($data['password']),
                ]);



                return $user;
        }

        public function signin(array $credentials): ?array
        {
                // Log::debug('[Auth] Memulai proses login', ['email' => $credentials['email']]);

                if (!$accessToken = auth('api')->attempt($credentials)) {
                        Log::warning('[AUTH SERVICE] LOGIN: Gagal login (Kredensial salah)', ['email' => $credentials['email']]);
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
                                Log::info('[AUTH SERVICE] TOKEN: Refresh token dihapus', ['token_id' => $id]);
                            } else {
                                Log::warning('[AUTH SERVICE] LOGOUT: Token tidak valid/ditemukan saat logout', ['token_id' => $id]);
                            }
                        }
                }

                $user = auth('api')->user();
                // Log::info('[Auth] Pengguna melakukan logout', ['id' => $user?->id, 'email' => $user?->email]);
                auth('api')->logout();
        }

        public function refresh(?string $refreshTokenString): ?string
        {
                if (!$refreshTokenString) {
                        Log::warning('[AUTH SERVICE] REFRESH: Permintaan refresh gagal (Token kosong)');
                        return null;
                }

                if (!str_contains($refreshTokenString, '|')) {
                    Log::error('[AUTH SERVICE] REFRESH: Token rusak (Format salah)');
                    return null;
                }

                [$id, $token] = explode('|', $refreshTokenString, 2);

                $refreshToken = RefreshToken::find($id);

                if (!$refreshToken) {
                    Log::warning('[AUTH SERVICE] REFRESH: Gagal (ID Token tidak ditemukan)', ['token_id' => $id]);
                    return null;
                }

                if ($refreshToken->expires_at <= now()) {
                    Log::warning('[AUTH SERVICE] REFRESH: Gagal (Token kadaluwarsa)', ['token_id' => $id, 'expired_at' => $refreshToken->expires_at]);
                    return null;
                }

                if (!Hash::check($token, $refreshToken->token)) {
                    Log::error('[AUTH SERVICE] REFRESH: Gagal (Hash tidak cocok - Potensi manipulasi)', ['token_id' => $id]);
                    return null;
                }

                $user = User::find($refreshToken->user_id);
                if (!$user) {
                     Log::critical('[AUTH SERVICE] REFRESH: Gagal (Data pengguna hilang)', ['user_id' => $refreshToken->user_id]);
                     return null;
                }

                $newAccessToken = auth('api')->login($user);


                
                return $newAccessToken;
        }

        public function currentUser(): ?User
        {
                $user = auth('api')->user();
                if ($user) {
                    // Log::debug('[Auth] Mengambil data pengguna aktif', ['id' => $user->id]);
                }
                return $user;
        }
}
