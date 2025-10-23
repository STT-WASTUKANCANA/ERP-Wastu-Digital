<?php

namespace App\Http\Requests\Api\Master;

use Illuminate\Foundation\Http\FormRequest;

class DivisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        switch ($this->method()) {
            case 'POST':
                return [
                    'name' => ['required', 'string', 'max:50', 'unique:divisions,name'],
                    'description' => ['nullable', 'string'],
                ];

            case 'PUT':
            case 'PATCH':
                $divisionId = $this->route('division');
                return [
                    'name' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('divisions','name')->ignore($divisionId)],
                    'description' => ['nullable', 'string'],
                ];

            default:
                return [];
        }
    }
}
