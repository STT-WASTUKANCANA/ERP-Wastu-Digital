<?php
namespace App\Http\Requests\Api\Mails;

use Illuminate\Foundation\Http\FormRequest;

class IncomingRequest extends FormRequest
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
                    'user_id' => 'required|exists:users,id',
                    'number' => 'required|string|max:100',
                    'category_id' => 'required|exists:mail_categories,id',
                    'date' => 'required|date',
                    'attachment' => 'nullable|string|max:255',
                ];

            case 'PUT':
            case 'PATCH':
                return [
                    'user_id' => 'sometimes|exists:users,id',
                    'number' => 'sometimes|string|max:100',
                    'category_id' => 'sometimes|exists:mail_categories,id',
                    'date' => 'sometimes|date',
                    'attachment' => 'sometimes|string|max:255',
                ];

            default:
                return [];
        }
    }
}
