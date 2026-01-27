<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Master\MailCategoryRequest;
use App\Http\Resources\Api\Master\MailCategoryResource;
use App\Models\Workspace\Mails\MailCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Throwable;
use App\Exports\CategoryExport;
use Maatwebsite\Excel\Facades\Excel;

class MailCategoryController extends Controller
{
    public function index(Request $request)
    {
        // CRUD for Master: List all categories
        // Supports: Filter by type (?type=1) and Search (?search=name)
        $query = MailCategory::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->orderBy('type')->orderBy('name')->get();

        Log::info('[MASTER] MAIL KATEGORI LIST: Mengambil daftar kategori', [
            'count' => $categories->count(),
            'user_id' => Auth::id()
        ]);

        return response()->json([
            'status' => true,
            'data' => MailCategoryResource::collection($categories)
        ]);
    }

    public function store(MailCategoryRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = Auth::id(); // Track creator

            $category = MailCategory::create($data);

            Log::info('[MASTER] MAIL KATEGORI CREATE: Kategori berhasil dibuat', ['user_id' => Auth::id(), 'category_id' => $category->id]);

            return response()->json([
                'status' => true,
                'data' => new MailCategoryResource($category)
            ], 201);
        } catch (Throwable $e) {
            Log::error('[MASTER] MAIL KATEGORI CREATE: Gagal membuat kategori', ['user_id' => Auth::id(), 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $category = MailCategory::findOrFail($id);
        return new MailCategoryResource($category);
    }

    public function update(MailCategoryRequest $request, $id)
    {
        try {
            $category = MailCategory::findOrFail($id);
            $category->update($request->validated());

            Log::info('[MASTER] MAIL KATEGORI UPDATE: Kategori berhasil diperbarui', ['category_id' => $id, 'user_id' => Auth::id()]);

            return response()->json([
                'status' => true,
                'data' => new MailCategoryResource($category)
            ]);
        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => 'Update failed'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $category = MailCategory::findOrFail($id);
            $category->delete();

            Log::info('[MASTER] MAIL KATEGORI DELETE: Kategori berhasil dihapus', ['category_id' => $id, 'user_id' => Auth::id()]);

            return response()->json(['status' => true, 'message' => 'Category deleted']);
        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => 'Delete failed'], 500);
        }
    }

    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|in:excel,pdf',
            'mail_type' => 'nullable|in:1,2,3'
        ]);

        try {
            $type = $request->type;
            $mailType = $request->mail_type;
            $filename = 'kategori_surat_' . date('Y-m-d_His');

            Log::info('[MASTER] MAIL KATEGORI EXPORT: Export dimulai', [
                'user_id' => Auth::id(),
                'type' => $type,
                'mail_type' => $mailType
            ]);

            $export = new CategoryExport($mailType);

            if ($type === 'pdf') {
                return Excel::download($export, $filename . '.pdf', \Maatwebsite\Excel\Excel::DOMPDF);
            }

            return Excel::download($export, $filename . '.xlsx');
        } catch (Throwable $e) {
            Log::error('[MASTER] MAIL KATEGORI EXPORT: Export gagal', ['user_id' => Auth::id(), 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => 'Export failed'], 500);
        }
    }
}
