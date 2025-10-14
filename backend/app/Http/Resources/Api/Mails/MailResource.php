<?php

namespace App\Http\Resources\Api\Mails;

use Illuminate\Http\Resources\Json\JsonResource;

class MailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'            => encodeId($this->id),
            'user_id'       => encodeId($this->user_id),
            'user_name'     => $this->user->name,
            'number'        => $this->number,
            'category_id'   => encodeId($this->category_id),
            'category_name' => $this->whenLoaded('mail_category', fn() => $this->mail_category->name),
            'date' => \Carbon\Carbon::parse($this->date)->translatedFormat('d F Y'),
            'attachment'    => $this->attachment,

            'institute'     => $this->when(isset($this->institute), fn() => $this->institute),
            'address'       => $this->when(isset($this->address), fn() => $this->address),
            'purpose'       => $this->when(isset($this->purpose), fn() => $this->purpose),
            
            'created_at'    => $this->created_at->format('Y-m-d H:i:s'),

        ];
    }
}
