<?php

namespace App\Http\Requests\Api\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id');

        switch ($this->method()) {
            case 'POST':
                return [
                    'name' => 'required|string|max:255',
                    'email' => 'required|email|unique:users,email',
                    'password' => 'required|string|min:8',
                    'role_id' => 'nullable|exists:roles,id',
                    'division_id' => 'nullable|exists:divisions,id',
                ];

            case 'PUT':
            case 'PATCH':
                return [
                    'name' => 'sometimes|string|max:255',
                    'email' => [
                        'sometimes',
                        'email',
                        Rule::unique('users', 'email')->ignore($userId),
                    ],
                    'password' => 'sometimes|string|min:8',
                    'role_id' => 'nullable|exists:roles,id',
                    'division_id' => 'nullable|exists:divisions,id',
                ];

            default:
                return [];
        }
    }
}
