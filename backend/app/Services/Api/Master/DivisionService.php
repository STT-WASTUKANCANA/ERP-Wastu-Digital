<?php

namespace App\Services\Api\Master;

use App\Models\Division;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

class DivisionService
{
    public function all(): Collection
    {
        return Division::latest()->get();
    }
    public function create(array $data): Division
    {
        $division = Division::create($data);
        Log::info('Division created', ['id' => $division->id]);
        return $division;
    }
    public function update(Division $division, array $data): Division
    {
        $division->update($data);
        Log::info('Division updated', ['id' => $division->id]);
        return $division;
    }
    public function delete(Division $division): bool
    {
        $division->delete();
        Log::info('Division deleted', ['id' => $division->id]);
        return true;
    }
}
