<?php

namespace App\Http\Controllers\Api\Mails;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Mails\CategoryRequest;
use App\Http\Resources\Api\Mails\CategoryResource;
use App\Models\Workspace\Mails\MailCategory;
use App\Services\Api\Mails\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Throwable;

class CategoryController extends Controller
{
    private CategoryService $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $type = null;
        if ($request->routeIs('api.mails.incoming.category')) {
            $type = 1;
        } elseif ($request->routeIs('api.mails.outgoing.category')) {
            $type = 2;
        } elseif ($request->routeIs('api.mails.decision.category')) {
            $type = 3;
        }

        $categories = $this->service->all($type);

        Log::info('Category:index', [
            'user_id' => Auth::id(),
            'type' => $type,
            'count' => $categories->count()
        ]);

        return response()->json([
            'status' => true,
            'data' => CategoryResource::collection($categories)
        ]);
    }


    public function store(CategoryRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = Auth::id();

            $category = $this->service->create($data);

            Log::info('Category:store', ['user_id' => Auth::id(), 'category_id' => $category->id]);

            return response()->json([
                'status' => true,
                'data' => new CategoryResource($category)
            ], 201);
        } catch (Throwable $e) {
            Log::error('Category:store failed', ['user_id' => Auth::id(), 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $category = MailCategory::where('user_id', auth()->id())->findOrFail($id);
            return new CategoryResource($category);
        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => 'Category not found.'], 404);
        }
    }

    public function update(CategoryRequest $request, $id)
    {
        try {
            $category = MailCategory::where('user_id', auth()->id())->findOrFail($id);
            $updatedCategory = $this->service->update($category, $request->validated());

            Log::info('Category:update', ['user_id' => Auth::id(), 'category_id' => $updatedCategory->id]);

            return response()->json([
                'status' => true,
                'data' => new CategoryResource($updatedCategory)
            ]);
        } catch (Throwable $e) {
            Log::error('Category:update failed', ['user_id' => Auth::id(), 'category_id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => 'Update failed or category not found.'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $category = MailCategory::where('user_id', auth()->id())->findOrFail($id);
            $this->service->delete($category);

            Log::info('Category:destroy', ['user_id' => Auth::id(), 'category_id' => $id]);

            return response()->json(['status' => true, 'message' => 'Category deleted successfully'], 200);
        } catch (Throwable $e) {
            Log::error('Category:destroy failed', ['user_id' => Auth::id(), 'category_id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => 'Delete failed or category not found.'], 500);
        }
    }
}
