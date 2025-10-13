<?php

namespace App\Http\Controllers\Api\Mails;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Mails\MailRequest;
use App\Http\Resources\Api\Mails\MailResource;
use App\Services\Api\Mails\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class MailController extends Controller
{
        protected MailService $service;

        public function __construct(MailService $service)
        {
                $this->service = $service;
        }

        private function getTypeFromRoute(Request $request): int
        {
                return str_contains($request->path(), 'outgoing') ? 2 : 1; // 2 = Outgoing, 1 = Incoming
        }

        public function index(Request $request)
        {
                try {
                        $type = $this->getTypeFromRoute($request);
                        $data = $this->service->all($type);
                        Log::info('Mail:index', ['count' => count($data), 'type' => $type]);
                        return response()->json(['status' => true, 'data' => MailResource::collection($data)]);
                } catch (Throwable $e) {
                        Log::error('Mail:index', ['msg' => $e->getMessage()]);
                        return response()->json(['status' => false], 500);
                }
        }

        public function store(MailRequest $request)
        {
                try {
                        $type = $this->getTypeFromRoute($request);
                        $mail = $this->service->create($request->validated(), $type);
                        Log::info('Mail:store', ['id' => $mail->id, 'type' => $type]);
                        return response()->json(['status' => true, 'data' => new MailResource($mail)], 201);
                } catch (Throwable $e) {
                        Log::error('Mail:store', ['msg' => $e->getMessage()]);
                        return response()->json(['status' => false], 500);
                }
        }

        public function show(Request $request, $id)
        {
                $decoded = decodeId($id);
                if (!$decoded) {
                        Log::warning('Mail:show invalid', ['id' => $id]);
                        return response()->json(['status' => false], 404);
                }

                $type = $this->getTypeFromRoute($request);
                $mail = $this->service->find($decoded, $type);
                if (!$mail) {
                        Log::warning('Mail:show notfound', ['id' => $decoded, 'type' => $type]);
                        return response()->json(['status' => false], 404);
                }

                Log::info('Mail:show', ['id' => $decoded, 'type' => $type]);
                return response()->json(['status' => true, 'data' => new MailResource($mail)]);
        }

        public function update(MailRequest $request, $id)
        {
                $decoded = decodeId($id);
                if (!$decoded) {
                        Log::warning('Mail:update invalid', ['id' => $id]);
                        return response()->json(['status' => false], 404);
                }

                try {
                        $type = $this->getTypeFromRoute($request);
                        $mail = $this->service->update($decoded, $request->validated(), $type);
                        if (!$mail) {
                                Log::warning('Mail:update notfound', ['id' => $decoded, 'type' => $type]);
                                return response()->json(['status' => false], 404);
                        }

                        Log::info('Mail:update', ['id' => $decoded, 'type' => $type]);
                        return response()->json(['status' => true, 'data' => new MailResource($mail)]);
                } catch (Throwable $e) {
                        Log::error('Mail:update', ['msg' => $e->getMessage()]);
                        return response()->json(['status' => false], 500);
                }
        }

        public function destroy(Request $request, $id)
        {
                $decoded = decodeId($id);
                if (!$decoded) {
                        Log::warning('Mail:destroy invalid', ['id' => $id]);
                        return response()->json(['status' => false], 404);
                }

                $type = $this->getTypeFromRoute($request);
                $deleted = $this->service->delete($decoded, $type);
                if (!$deleted) {
                        Log::warning('Mail:destroy notfound', ['id' => $decoded, 'type' => $type]);
                        return response()->json(['status' => false], 404);
                }

                Log::info('Mail:destroy', ['id' => $decoded, 'type' => $type]);
                return response()->json(['status' => true]);
        }

        public function summary(Request $request)
        {
                try {
                        $type = $this->getTypeFromRoute($request);
                        $stats = $this->service->getMonthlySummary($type);
                        Log::info('Mail:summary', ['type' => $type, 'stats' => $stats]);
                        return response()->json(['status' => true, 'data' => $stats]);
                } catch (Throwable $e) {
                        Log::error('Mail:summary', ['msg' => $e->getMessage()]);
                        return response()->json(['status' => false], 500);
                }
        }
}
