<?php

namespace App\Services\Api\Mails;

use App\Models\Workspace\Mails\MailCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

class CategoryService
{
    public function all(?int $type = null): Collection
    {
        $query = MailCategory::query();

        if ($type) {
            $query->where('type', $type);
        }

        return $query->latest()->get();
    }

    public function create(array $data): MailCategory
    {
        $category = MailCategory::create($data);
        return $category;
    }

    public function update(MailCategory $category, array $data): MailCategory
    {
        $category->update($data);
        return $category;
    }

    public function delete(MailCategory $category): bool
    {
        $category->delete();
        return true;
    }
}
