<?php

namespace App\Http\Controllers\Api\Mails;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Mails\IncomingRequest;
use App\Http\Resources\Api\Mails\IncomingResource;
use App\Services\Api\Mails\IncomingService;

class IncomingController extends Controller
{
    protected IncomingService $service;

    public function __construct(IncomingService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $data = $this->service->all();

        return response()->json([
            'status'  => true,
            'message' => 'Incoming mails retrieved successfully',
            'data'    => IncomingResource::collection($data),
        ]);
    }

    public function store(IncomingRequest $request)
    {
        $mail = $this->service->create($request->validated());

        return response()->json([
            'status'  => true,
            'message' => 'Incoming mail created successfully',
            'data'    => new IncomingResource($mail),
        ], 201);
    }

    public function show($id)
    {
        $decodedId = decodeId($id);

        if (!$decodedId) {
            return response()->json([
                'status'  => false,
                'message' => 'Invalid mail ID',
            ], 404);
        }

        $mail = $this->service->find($decodedId);

        if (!$mail) {
            return response()->json([
                'status'  => false,
                'message' => 'Incoming mail not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data'   => new IncomingResource($mail),
        ]);
    }

    public function update(IncomingRequest $request, $id)
    {
        $decodedId = decodeId($id);

        if (!$decodedId) {
            return response()->json([
                'status'  => false,
                'message' => 'Invalid mail ID',
            ], 404);
        }

        $mail = $this->service->update($decodedId, $request->validated());

        if (!$mail) {
            return response()->json([
                'status'  => false,
                'message' => 'Incoming mail not found',
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Incoming mail updated successfully',
            'data'    => new IncomingResource($mail),
        ]);
    }

    public function destroy($id)
    {
        $decodedId = decodeId($id);

        if (!$decodedId) {
            return response()->json([
                'status'  => false,
                'message' => 'Invalid mail ID',
            ], 404);
        }

        $deleted = $this->service->delete($decodedId);

        if (!$deleted) {
            return response()->json([
                'status'  => false,
                'message' => 'Incoming mail not found',
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Incoming mail deleted successfully',
        ]);
    }

    public function summary()
    {
        $stats = $this->service->getMonthlySummary();

        return response()->json([
            'status'  => true,
            'message' => 'Incoming mail summary retrieved successfully',
            'data'    => $stats,
        ]);
    }
}
