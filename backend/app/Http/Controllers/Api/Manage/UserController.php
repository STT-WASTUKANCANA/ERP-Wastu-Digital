<?php

namespace App\Http\Controllers\Api\Manage;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Manage\UserRequest;
use App\Http\Resources\Api\Master\UserResource;
use App\Services\Api\Master\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class UserController extends Controller
{
    protected $service;

    public function __construct(UserService $service)
    {
        $this->service = $service;
    }

    // Menampilkan daftar pengguna
    public function index(Request $request)
    {
        try {
            $filters = $request->all();
            $users = $this->service->all($filters);

            Log::info('[MANAGE] USER LIST: Mengambil daftar pengguna', [
                'count' => $users->count(),
                'user_id' => auth()->id()
            ]);

            return UserResource::collection($users);
        } catch (Throwable $e) {
            Log::error('[MANAGE] USER LIST: Gagal mengambil daftar pengguna', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch users'], 500);
        }
    }

    // Membuat pengguna baru
    public function store(UserRequest $request)
    {
        try {
            $data = $request->validated();
            $user = $this->service->create($data);

            Log::info('[MANAGE] USER CREATE: Pengguna baru berhasil dibuat', ['new_user_id' => $user->id, 'creator_id' => auth()->id()]);
            
            return response()->json([
                'message' => 'User created successfully',
                'data' => new UserResource($user)
            ], 201);
        } catch (Throwable $e) {
            Log::error('[MANAGE] USER CREATE: Gagal membuat pengguna', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create user'], 500);
        }
    }

    // Menampilkan detail pengguna
    public function show(Request $request, $id)
    {
        try {
            $user = $this->service->find($id);
            
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            Log::info('[MANAGE] USER SHOW: Menampilkan detail pengguna', ['user_id' => $id, 'viewer_id' => auth()->id()]);
            
            return new UserResource($user);
        } catch (Throwable $e) {
            Log::error('[MANAGE] USER SHOW: Gagal menampilkan detail pengguna', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch user'], 500);
        }
    }

    // Memperbarui data pengguna
    public function update(UserRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $user = $this->service->update($id, $data);
            
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            Log::info('[MANAGE] USER UPDATE: Pengguna berhasil diperbarui', ['user_id' => $id, 'updater_id' => auth()->id()]);
            
            return response()->json([
                'message' => 'User updated successfully',
                'data' => new UserResource($user)
            ], 200);
        } catch (Throwable $e) {
            Log::error('[MANAGE] USER UPDATE: Gagal memperbarui pengguna', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update user'], 500);
        }
    }

    // Menghapus pengguna
    public function destroy(Request $request, $id)
    {
        try {
            $result = $this->service->delete($id);
            
            if (!$result) {
                return response()->json(['error' => 'User not found'], 404);
            }

            Log::info('[MANAGE] USER DELETE: Pengguna berhasil dihapus', ['user_id' => $id, 'deleter_id' => auth()->id()]);
            
            return response()->json(['message' => 'User deleted successfully'], 200);
        } catch (Throwable $e) {
            Log::error('[MANAGE] USER DELETE: Gagal menghapus pengguna', ['id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete user'], 500);
        }
    }
}
