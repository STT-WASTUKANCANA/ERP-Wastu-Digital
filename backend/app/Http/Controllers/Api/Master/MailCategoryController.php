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

            Log::info('MailCategory:store', ['user_id' => Auth::id(), 'category_id' => $category->id]);

            return response()->json([
                'status' => true,
                'data' => new MailCategoryResource($category)
            ], 201);
        } catch (Throwable $e) {
            Log::error('MailCategory:store failed', ['user_id' => Auth::id(), 'error' => $e->getMessage()]);
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

            return response()->json(['status' => true, 'message' => 'Category deleted']);
        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => 'Delete failed'], 500);
        }
    }
}
