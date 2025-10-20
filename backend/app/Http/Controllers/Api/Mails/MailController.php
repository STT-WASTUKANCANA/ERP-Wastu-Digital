<?php

namespace App\Http\Controllers\Api\Mails;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Mails\MailRequest;
use App\Http\Resources\Api\Mails\MailResource;
use App\Services\Api\Mails\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
                        $validatedData = $request->validated();
                        $validatedData['user_id'] = Auth::id();

                        if ($request->hasFile('attachment')) {
                                $year = date('Y');
                                $month = date('m');
                                $day = date('d');
                                $dynamicPath = "mails/incoming/{$year}/{$month}/{$day}";

                                $filePath = $request->file('attachment')->store($dynamicPath, 'public');
                                $validatedData['attachment'] = $filePath;
                        }

                        $type = $this->getTypeFromRoute($request);
                        $mail = $this->service->create($validatedData, $type);

                        Log::info('Mail:store', ['id' => $mail->id, 'type' => $type]);
                        return response()->json(['status' => true, 'data' => new MailResource($mail)], 201);
                } catch (Throwable $e) {
                        Log::error('Mail:store', ['msg' => $e->getMessage()]);
                        return response()->json(['status' => false, 'message' => 'Internal Server Error'], 500);
                }
        }

        public function show(Request $request, $id)
        {
                $type = $this->getTypeFromRoute($request);
                $mail = $this->service->find($id, $type);

                if (!$mail) {
                        Log::warning('Mail:show notfound', ['id' => $id, 'type' => $type]);
                        return response()->json(['status' => false], 404);
                }

                Log::info('Mail:show', ['id' => $id, 'type' => $type]);
                return response()->json(['status' => true, 'data' => new MailResource($mail)]);
        }

        public function update(MailRequest $request, $id)
        {
                try {
                        $type = $this->getTypeFromRoute($request);
                        $mail = $this->service->find($id, $type);

                        if (!$mail) {
                                Log::warning('Mail:update notfound', ['id' => $id, 'type' => $type]);
                                return response()->json(['status' => false], 404);
                        }

                        $validatedData = $request->validated();

                        if ($request->hasFile('attachment')) {
                                if ($mail->attachment) {
                                        \Storage::disk('public')->delete($mail->attachment);
                                }

                                $year = date('Y');
                                $month = date('m');
                                $day = date('d');
                                $dynamicPath = "mails/incoming/{$year}/{$month}/{$day}";
                                $filePath = $request->file('attachment')->store($dynamicPath, 'public');
                                $validatedData['attachment'] = $filePath;
                        }

                        $updatedMail = $this->service->update($id, $validatedData, $type);

                        Log::info('Mail:update', ['id' => $id, 'type' => $type]);
                        return response()->json(['status' => true, 'data' => new MailResource($updatedMail)]);
                } catch (Throwable $e) {
                        Log::error('Mail:update', ['msg' => $e->getMessage()]);
                        return response()->json(['status' => false], 500);
                }
        }


        public function destroy(Request $request, $id)
        {
                $type = $this->getTypeFromRoute($request);
                $deleted = $this->service->delete($id, $type);

                if (!$deleted) {
                        Log::warning('Mail:destroy notfound', ['id' => $id, 'type' => $type]);
                        return response()->json(['status' => false], 404);
                }

                Log::info('Mail:destroy', ['id' => $id, 'type' => $type]);
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
