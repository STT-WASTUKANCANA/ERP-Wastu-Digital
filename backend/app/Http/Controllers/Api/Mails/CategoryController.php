<?php

namespace App\Http\Controllers\Api\Mails;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Mails\CategoryRequest;
use App\Http\Resources\Api\Mails\CategoryResource;
use App\Models\Dashboard\Mail\MailCategory;
use App\Services\Api\Mails\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        }

        $categories = $this->service->all($type);
        return response()->json([
            'status' => true,
            'data'   => CategoryResource::collection($categories)
        ]);
    }

    public function store(CategoryRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = Auth::id();

            $category = $this->service->create($data);
            return response()->json([
                'status' => true,
                'data' => new CategoryResource($category)
            ], 201);
        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(CategoryRequest $request, MailCategory $category)
    {
        try {
            $updatedCategory = $this->service->update($category, $request->validated());
            return response()->json([
                'status' => true,
                'data' => new CategoryResource($updatedCategory)
            ]);
        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(MailCategory $category)
    {
        $this->service->delete($category);
        return response()->json(['status' => true, 'message' => 'Category deleted successfully'], 200);
    }
}
