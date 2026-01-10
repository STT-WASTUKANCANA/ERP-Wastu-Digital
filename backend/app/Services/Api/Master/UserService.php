<?php

namespace App\Services\Api\Master;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserService
{
    public function all()
    {
        $data = User::with('role', 'division')->latest()->get();
        Log::info('User: fetched all', ['count' => $data->count()]);
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

                Log::info('User: created', ['id' => $user->id, 'email' => $user->email]);
                return $user->load('role', 'division');
            } catch (\Throwable $e) {
                Log::error('User: creation failed', [
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
            Log::warning('User: update failed, user not found', ['id' => $id]);
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

            Log::info('User: updated successfully', ['id' => $id, 'email' => $user->email]);
            return $user->load('role', 'division');
        } catch (\Throwable $e) {
            Log::error('User: update failed', [
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
            Log::warning('User: delete failed, user not found', ['id' => $id]);
            return false;
        }

        $user->delete();
        Log::info('User: deleted', ['id' => $id, 'email' => $user->email]);
        return true;
    }
}
