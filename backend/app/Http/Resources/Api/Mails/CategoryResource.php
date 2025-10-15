<?php

namespace App\Http\Resources\Api\Mails;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'type_name' => $this->type == '1' ? 'Incoming Mail' : 'Outgoing Mail',
        ];
    }
}