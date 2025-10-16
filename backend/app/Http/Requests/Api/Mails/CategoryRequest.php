<?php

namespace App\Http\Requests\Api\Mails;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
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
                    'name' => [
                        'required',
                        'string',
                        'max:100',
                        Rule::unique('mail_categories')->where(function ($query) {
                            return $query->where('user_id', auth()->id());
                        }),
                    ],
                    'type' => 'required|in:1,2',
                ];

            case 'PUT':
            case 'PATCH':
                $categoryId = $this->route('category');

                return [
                    'name' => [
                        'sometimes',
                        'required',
                        'string',
                        'max:100',
                        Rule::unique('mail_categories')->where(function ($query) {
                            return $query->where('user_id', auth()->id());
                        })
                            ->ignore($categoryId),
                    ],
                    'type' => 'sometimes|required|in:1,2',
                ];

            default:
                return [];
        }
    }
}
