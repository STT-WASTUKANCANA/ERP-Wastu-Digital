<?php

namespace App\Http\Resources\Api\Mails;

use Illuminate\Http\Resources\Json\JsonResource;

class MailResource extends JsonResource
{
    public function toArray($request)
    {
        $log = $this->mail_log
                    ->where('status', $this->status)
                    ->first();

        return [
            'id'            => $this->id,
            'user_id'       => $this->user_id,
            'user_name'     => $this->user->name,
            'number'        => $this->number,
            'category_id'   => $this->category_id,
            'category_name' => $this->whenLoaded('mail_category', fn() => $this->mail_category->name),
            'date'          => \Carbon\Carbon::parse($this->date)->format('Y-m-d'),
            'attachment'    => $this->attachment,
            'status'        => $this->status,
            'follow_status' => $this->follow_status,

            'desc'          => $log->desc ?? null,

            'institute'     => $this->when(isset($this->institute), fn() => $this->institute),
            'address'       => $this->when(isset($this->address), fn() => $this->address),
            'purpose'       => $this->when(isset($this->purpose), fn() => $this->purpose),
            
            'created_at'    => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
