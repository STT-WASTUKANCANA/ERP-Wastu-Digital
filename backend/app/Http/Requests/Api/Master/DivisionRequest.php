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
                    'leader_id' => ['nullable', 'exists:users,id'],
                ];

            case 'PUT':
            case 'PATCH':
                $divisionId = $this->route('id');
                return [
                    'name' => ['sometimes', 'required', 'string', 'max:50', \Illuminate\Validation\Rule::unique('divisions','name')->ignore($divisionId)],
                    'description' => ['nullable', 'string'],
                    'leader_id' => ['nullable', 'exists:users,id'],
                ];

            default:
                return [];
        }
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama divisi wajib diisi.',
            'name.string' => 'Nama divisi harus berupa teks.',
            'name.max' => 'Nama divisi maksimal 50 karakter.',
            'name.unique' => 'Nama divisi sudah digunakan.',
            'leader_id.exists' => 'Kepala Bidang yang dipilih tidak valid.',
        ];
    }
}
