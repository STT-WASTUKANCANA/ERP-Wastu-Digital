<?php

namespace App\Services\Api\Mails;

use App\Models\Dashboard\Mail\MailCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

class CategoryService
{
    public function all(?int $type = null): Collection
    {
        $query = MailCategory::where('user_id', auth()->id());

        if ($type) {
            $query->where('type', $type);
        }

        return $query->latest()->get();
    }

    public function create(array $data): MailCategory
    {
        $category = MailCategory::create($data);
        Log::info('MailCategory: created', ['id' => $category->id]);
        return $category;
    }

    public function update(MailCategory $category, array $data): MailCategory
    {
        $category->update($data);
        Log::info('MailCategory: updated', ['id' => $category->id]);
        return $category;
    }

    public function delete(MailCategory $category): bool
    {
        $category->delete();
        Log::info('MailCategory: deleted', ['id' => $category->id]);
        return true;
    }
}