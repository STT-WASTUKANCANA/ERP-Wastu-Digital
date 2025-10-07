<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        switch (true) {
            case $this->routeIs('api.auth.signup'):
                return [
                    'name'     => 'required|string|max:255',
                    'email'    => 'required|string|email|max:255|unique:users',
                    'password' => 'required|string|min:6|confirmed',
                ];

            case $this->routeIs('api.auth.signin'):
                return [
                    'email'    => 'required|string|email',
                    'password' => 'required|string|min:6',
                ];

            default:
                return [];
        }
    }
}
