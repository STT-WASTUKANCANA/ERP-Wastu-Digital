<?php

namespace App\Http\Resources\Api\Mails;

use Illuminate\Http\Resources\Json\JsonResource;

class IncomingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'user_id'       => $this->user_id,
            'number'        => $this->number,
            'category_id'   => $this->category_id,
            'category_name' => $this->whenLoaded('mail_category', fn () => $this->mail_category->name),
            'date'          => $this->date->format('Y-m-d'),
            'attachment'    => $this->attachment,
            'created_at'    => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
