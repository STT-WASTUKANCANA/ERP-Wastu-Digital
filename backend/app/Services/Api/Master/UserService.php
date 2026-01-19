<?php

namespace App\Services\Api\Master;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserService
{
    public function all(array $filters = [])
    {
        $query = User::with('role', 'division')->latest();

        // Search
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('role', function($q) use ($search){
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('division', function($q) use ($search){
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by Role Name
        if (!empty($filters['role'])) {
            $roleName = $filters['role'];
            $query->whereHas('role', function($q) use ($roleName) {
                $q->where('name', $roleName);
            });
        }

        // Filter by Division Name
        if (!empty($filters['division'])) {
            $divName = $filters['division'];
            $query->whereHas('division', function($q) use ($divName) {
                $q->where('name', $divName);
            });
        }

        $data = $query->get();
        return $data;
    }

    public function find($id)
    {
        return User::with('role', 'division')->find($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            try {
                // Use default password from .env if not provided
                $password = $data['password'] ?? env('DEFAULT_PASSWORD', 'Minimal8@');
                $data['password'] = Hash::make($password);

                $user = User::create($data);

                return $user->load('role', 'division');
            } catch (\Throwable $e) {
                Log::error('[SERVICE] USER CREATE: Gagal membuat data pengguna', [
                    'error' => $e->getMessage(),
                    'data' => $data
                ]);
                throw $e;
            }
        });
    }

    public function update($id, array $data)
    {
        $user = $this->find($id);

        if (!$user) {
            Log::warning('[SERVICE] USER UPDATE: Gagal, pengguna tidak ditemukan', ['id' => $id]);
            return null;
        }

        try {
            // Hash password jika ada dan diisi
            if (isset($data['password']) && !empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                // Hapus password dari array jika tidak diisi
                unset($data['password']);
            }

            $user->update($data);

            return $user->load('role', 'division');
        } catch (\Throwable $e) {
            Log::error('[SERVICE] USER UPDATE: Gagal memperbarui pengguna', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function delete($id)
    {
        $user = $this->find($id);
        if (!$user) {
            Log::warning('[SERVICE] USER DELETE: Gagal, pengguna tidak ditemukan', ['id' => $id]);
            return false;
        }

        $user->delete();
        return true;
    }
}
