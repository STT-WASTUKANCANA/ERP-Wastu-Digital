<?php

namespace App\Services\Api;

use App\Models\User;
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

        public function signin(array $credentials): ?string
        {
                Log::debug('Percobaan signin', ['email' => $credentials['email']]);

                if (!$token = auth('api')->attempt($credentials)) {
                        Log::warning('Signin gagal: kredensial salah', ['email' => $credentials['email']]);
                        return null;
                }

                Log::info('User berhasil signin', ['email' => $credentials['email']]);
                return $token;
        }

        public function signout(): void
        {
                $user = auth('api')->user();
                Log::info('User signout', ['id' => $user?->id, 'email' => $user?->email]);
                auth('api')->logout();
        }

        public function refresh(): string
        {
                $user = auth('api')->user();
                Log::debug('Token di-refresh', ['id' => $user?->id, 'email' => $user?->email]);

                $token = auth('api')->refresh();

                Log::info('Token berhasil diperbarui', ['id' => $user?->id]);
                return $token;
        }

        public function currentUser(): ?User
        {
                $user = auth('api')->user();
                Log::debug('Mengambil data user saat ini', ['id' => $user?->id, 'email' => $user?->email]);
                return $user;
        }
}
