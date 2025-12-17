<?php

namespace App\Http\Resources\Api\Mails;

use Illuminate\Http\Resources\Json\JsonResource;

class MailResource extends JsonResource
{
    public function toArray($request)
    {
        $path = $request->path();
        $type = str_contains($path, 'outgoing') ? 'outgoing'
            : (str_contains($path, 'decision') ? 'decision' : 'incoming');

        return match ($type) {
            'incoming' => $this->incomingFormat(),
            'outgoing' => $this->outgoingFormat(),
            'decision' => $this->decisionFormat(),
        };
    }

    private function incomingFormat()
    {
        $tataLaksanaNotes = $this->mail_log
            ->where('status', 1)
            ->first();

        $sekumDesc = $this->mail_log
            ->where('status', 2)
            ->first();

        $divisionDesc = $this->mail_log
            ->where('status', 3)
            ->first();

        return [
            'id'            => $this->id,
            'number'        => $this->number,
            'user_id'       => $this->user_id,
            'user_name'     => $this->user?->name,
            'category_name' => $this->mail_category?->name,
            'status'        => $this->status,
            'follow_status' => $this->follow_status,
            'date'          => $this->date,
            'attachment'    => $this->attachment,
            'desc'          => $tataLaksanaNotes->desc ?? null,
            'sekum_desc'    => $sekumDesc->desc ?? null,
            'division_desc' => $divisionDesc->desc ?? null,
        ];
    }

    private function outgoingFormat()
    {
        $initialLog = $this->mail_log->first();

        return [
            'id'            => $this->id,
            'number'        => $this->number,
            'user_id'       => $this->user_id,
            'user_name'     => $this->user?->name,
            'category_name' => $this->mail_category?->name,
            'date'          => $this->date,
            'attachment'    => $this->attachment,

            'institute'     => $this->institute,
            'address'       => $this->address,
            'purpose'       => $this->purpose,

            'desc'          => $initialLog->desc ?? null,
        ];
    }

    private function decisionFormat()
    {
        $initialLog = $this->mail_log->first();
        
        return [
            'id'            => $this->id,
            'number'        => $this->number,
            'user_id'       => $this->user_id,
            'user_name'     => $this->user?->name,
            'category_name' => $this->mail_category?->name,
            'date'          => $this->date,
            'attachment'    => $this->attachment,
            'title'         => $this->title,
            'desc'          => $initialLog->desc ?? null,
        ];
    }
}
