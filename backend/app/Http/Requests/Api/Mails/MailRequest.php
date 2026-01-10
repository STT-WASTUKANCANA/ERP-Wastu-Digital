<?php

namespace App\Http\Requests\Api\Mails;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class MailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isOutgoing = $this->routeIs('api.mails.outgoing.*');
        $isDecision = $this->routeIs('api.mails.decision.*');

        if ($this->routeIs('api.mails.incoming.review')) {
            return [
                'division_id' => 'nullable|exists:divisions,id',
                'desc' => 'nullable|string',
            ];
        }

        if ($this->routeIs('api.mails.incoming.divisionReview')) {
            return [
                'follow_status' => 'required|integer',
                'division_desc' => 'nullable|string',
            ];
        }

        switch ($this->method()) {
            case 'POST':
                $rules = [
                    'number' => 'required|string|max:100',
                    'category_id' => 'required|exists:mail_categories,id',
                    'date' => 'required|date',
                    'attachment' => $isDecision ? 'required|string|url' : [
                        'required',
                        function ($attribute, $value, $fail) {
                             if (request()->hasFile($attribute)) {
                                  $file = request()->file($attribute);
                                  if ($file->getMimeType() != 'application/pdf') {
                                      $fail('File harus berformat PDF.');
                                  }
                                  if ($file->getSize() > 10240 * 1024) { // 10MB
                                      $fail('Ukuran file terlalu besar. Maksimal 10MB.');
                                  }
                             } else {
                                  if (!is_string($value)) {
                                      $fail('Lampiran harus berupa file PDF atau Link Google Drive.');
                                  }
                             }
                        }
                    ],
                    'desc' => 'nullable|string',
                ];

                if ($isOutgoing) {
                    $rules = array_merge($rules, [
                        'institute' => 'required|string|max:100',
                        'address' => 'required|string',
                        'purpose' => 'required|string|max:255',
                    ]);
                }

                if ($isDecision) {
                    $rules = array_merge($rules, [
                        'title' => 'required|string|max:255',
                    ]);
                }

                return $rules;

            case 'PUT':
            case 'PATCH':
                $rules = [
                    'number' => 'sometimes|string|max:100',
                    'category_id' => 'sometimes|exists:mail_categories,id',
                    'date' => 'sometimes|date',
                    'attachment' => 'nullable|file|mimes:pdf|max:10240', // max 10MB
                    'desc' => 'nullable|string',
                ];

                if ($isOutgoing) {
                    $rules = array_merge($rules, [
                        'institute' => 'sometimes|string|max:100',
                        'address' => 'sometimes|string',
                        'purpose' => 'sometimes|string|max:255',
                    ]);
                }

                if ($isDecision) {
                    $rules = array_merge($rules, [
                        'title' => 'sometimes|string|max:255',
                    ]);
                }

                return $rules;

            default:
                return [];
        }
    }

    public function messages(): array
    {
        return [
            'category_id.exists' => 'Kategori surat tidak valid.',
            'date.required' => 'Tanggal surat wajib diisi.',
            'attachment.required' => 'Lampiran surat wajib diisi (File PDF atau Link Drive).',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => $validator->errors()->first(),
            'errors' => $validator->errors()
        ], 422));
    }
}

