<?php

namespace App\Services\Api;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
        public function signup(array $data): User
        {
                return User::create([
                        'name'     => $data['name'],
                        'email'    => $data['email'],
                        'password' => Hash::make($data['password']),
                ]);
        }

        public function signin(array $credentials): ?string
        {
                if (!$token = auth('api')->attempt($credentials)) {
                        return null;
                }
                return $token;
        }

        public function signout(): void
        {
                auth('api')->logout();
        }

        public function refresh(): string
        {
                return auth('api')->refresh();
        }

        public function currentUser(): ?User
        {
                return auth('api')->user();
        }
}
