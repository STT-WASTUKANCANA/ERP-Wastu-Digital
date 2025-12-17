<?php

namespace App\Http\Resources\Api\Master;

use Illuminate\Http\Resources\Json\JsonResource;

class MailCategoryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'type_label' => $this->getTypeLabel($this->type),
            'description' => $this->description,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }

    private function getTypeLabel($type)
    {
        return match ((int)$type) {
            1 => 'Surat Masuk',
            2 => 'Surat Keluar',
            3 => 'Surat Keputusan',
            default => 'Unknown',
        };
    }
}
