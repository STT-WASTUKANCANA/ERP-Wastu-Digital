<?php

namespace App\Http\Requests\Api\Mails;

use Illuminate\Foundation\Http\FormRequest;

class MailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isOutgoing = $this->routeIs('api.mails.outgoing.*');

        switch ($this->method()) {
            case 'POST':
                $rules = [
                    'user_id' => 'required|exists:users,id',
                    'number' => 'required|string|max:100',
                    'category_id' => 'required|exists:mail_categories,id',
                    'date' => 'required|date',
                    'attachment' => 'nullable|string|max:255',
                ];

                if ($isOutgoing) {
                    $rules = array_merge($rules, [
                        'institute' => 'required|string|max:100',
                        'address' => 'required|string',
                        'purpose' => 'required|string|max:255',
                    ]);
                }
                return $rules;

            case 'PUT':
            case 'PATCH':
                $rules = [
                    'user_id' => 'sometimes|exists:users,id',
                    'number' => 'sometimes|string|max:100',
                    'category_id' => 'sometimes|exists:mail_categories,id',
                    'date' => 'sometimes|date',
                    'attachment' => 'sometimes|string|max:255',
                ];

                if ($isOutgoing) {
                    $rules = array_merge($rules, [
                        'institute' => 'sometimes|string|max:100',
                        'address' => 'sometimes|string',
                        'purpose' => 'sometimes|string|max:255',
                    ]);
                }
                return $rules;

            default:
                return [];
        }
    }
}
