<?php

namespace App\Http\Controllers\Api\Mails;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Mails\IncomingRequest;
use App\Http\Resources\Api\Mails\IncomingResource;
use App\Services\Api\Mails\IncomingService;
use Illuminate\Support\Facades\Log;
use Throwable;

class IncomingController extends Controller
{
    protected IncomingService $service;

    public function __construct(IncomingService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        try {
            $data = $this->service->all();
            Log::info('Mail:index', ['count' => count($data)]);
            return response()->json(['status' => true, 'data' => IncomingResource::collection($data)]);
        } catch (Throwable $e) {
            Log::error('Mail:index', ['msg' => $e->getMessage()]);
            return response()->json(['status' => false], 500);
        }
    }

    public function store(IncomingRequest $request)
    {
        try {
            $mail = $this->service->create($request->validated());
            Log::info('Mail:store', ['id' => $mail->id]);
            return response()->json(['status' => true, 'data' => new IncomingResource($mail)], 201);
        } catch (Throwable $e) {
            Log::error('Mail:store', ['msg' => $e->getMessage()]);
            return response()->json(['status' => false], 500);
        }
    }

    public function show($id)
    {
        $decoded = decodeId($id);
        if (!$decoded) {
            Log::warning('Mail:show invalid', ['id' => $id]);
            return response()->json(['status' => false], 404);
        }

        $mail = $this->service->find($decoded);
        if (!$mail) {
            Log::warning('Mail:show notfound', ['id' => $decoded]);
            return response()->json(['status' => false], 404);
        }

        Log::info('Mail:show', ['id' => $decoded]);
        return response()->json(['status' => true, 'data' => new IncomingResource($mail)]);
    }

    public function update(IncomingRequest $request, $id)
    {
        $decoded = decodeId($id);
        if (!$decoded) {
            Log::warning('Mail:update invalid', ['id' => $id]);
            return response()->json(['status' => false], 404);
        }

        try {
            $mail = $this->service->update($decoded, $request->validated());
            if (!$mail) {
                Log::warning('Mail:update notfound', ['id' => $decoded]);
                return response()->json(['status' => false], 404);
            }

            Log::info('Mail:update', ['id' => $decoded]);
            return response()->json(['status' => true, 'data' => new IncomingResource($mail)]);
        } catch (Throwable $e) {
            Log::error('Mail:update', ['msg' => $e->getMessage()]);
            return response()->json(['status' => false], 500);
        }
    }

    public function destroy($id)
    {
        $decoded = decodeId($id);
        if (!$decoded) {
            Log::warning('Mail:destroy invalid', ['id' => $id]);
            return response()->json(['status' => false], 404);
        }

        $deleted = $this->service->delete($decoded);
        if (!$deleted) {
            Log::warning('Mail:destroy notfound', ['id' => $decoded]);
            return response()->json(['status' => false], 404);
        }

        Log::info('Mail:destroy', ['id' => $decoded]);
        return response()->json(['status' => true]);
    }

    public function summary()
    {
        try {
            $stats = $this->service->getMonthlySummary();
            Log::info('Mail:summary', $stats);
            return response()->json(['status' => true, 'data' => $stats]);
        } catch (Throwable $e) {
            Log::error('Mail:summary', ['msg' => $e->getMessage()]);
            return response()->json(['status' => false], 500);
        }
    }
}
