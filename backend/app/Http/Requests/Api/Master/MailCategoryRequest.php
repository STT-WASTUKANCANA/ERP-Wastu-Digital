<?php

namespace App\Http\Requests\Api\Master;

use Illuminate\Foundation\Http\FormRequest;

class MailCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => [
                'required',
                'string',
                'max:100',
                \Illuminate\Validation\Rule::unique('mail_categories')->where(function ($query) {
                    return $query->where('user_id', auth()->id());
                }),
            ],
            'type' => 'required|in:1,2,3',
            'description' => 'nullable|string',
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $id = $this->route('mail_category'); // Check if route param name matches
            $rules['name'][3] = \Illuminate\Validation\Rule::unique('mail_categories')->where(function ($query) {
                    return $query->where('user_id', auth()->id());
                })->ignore($id);
            $rules['type'] = 'sometimes|required|in:1,2,3';
        }

        return $rules;
    }
}
