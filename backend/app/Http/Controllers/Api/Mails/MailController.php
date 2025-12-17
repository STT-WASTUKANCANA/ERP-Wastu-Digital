<?php

namespace App\Http\Controllers\Api\Mails;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Mails\MailRequest;
use App\Http\Resources\Api\Mails\MailResource;
use App\Services\Api\Mails\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
                $name = $request->route()->getName();

                return match (true) {
                        str_contains($name, 'incoming') => 1,
                        str_contains($name, 'outgoing') => 2,
                        str_contains($name, 'decision') => 3,
                        default => 0,
                };
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

                        // ambil type dari route (1 = incoming, 2 = outgoing)
                        $type = $this->getTypeFromRoute($request);

                        Log::debug('Mail:store started', [
                                'type' => $type,
                                'user_id' => Auth::id(),
                                'has_attachment' => $request->hasFile('attachment'),
                                'request_data' => $request->except(['attachment']),
                        ]);

                        if ($request->hasFile('attachment')) {
                                $year  = date('Y');
                                $month = date('m');
                                $day   = date('d');

                                // mapping folder berdasarkan type
                                $folder = match ($type) {
                                        1 => 'incoming',
                                        2 => 'outgoing',
                                        3 => 'decision',
                                };

                                $dynamicPath = "mails/{$folder}/{$year}/{$month}/{$day}";
                                
                                $file = $request->file('attachment');
                                Log::debug('Mail:store attachment info', [
                                        'original_name' => $file->getClientOriginalName(),
                                        'size' => $file->getSize(),
                                        'mime_type' => $file->getMimeType(),
                                        'path' => $dynamicPath,
                                ]);
                                
                                $filePath = $file->store($dynamicPath, 'public');
                                $validatedData['attachment'] = $filePath;
                                
                                Log::debug('Mail:store attachment saved', ['path' => $filePath]);
                        }

                        $mail = $this->service->create($validatedData, $type);

                        Log::info('Mail:store success', ['id' => $mail->id, 'type' => $type]);

                        return response()->json([
                                'status' => true,
                                'data'   => new MailResource($mail)
                        ], 201);
                } catch (Throwable $e) {
                        Log::error('Mail:store FAILED', [
                                'message' => $e->getMessage(),
                                'file' => $e->getFile(),
                                'line' => $e->getLine(),
                                'trace' => $e->getTraceAsString(),
                                'request_data' => $request->except(['attachment']),
                                'user_id' => Auth::id(),
                        ]);
                        return response()->json(['status' => false, 'message' => 'Internal Server Error: ' . $e->getMessage()], 500);
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
                                        Storage::disk('public')->delete($mail->attachment);
                                }

                                $year = date('Y');
                                $month = date('m');
                                $day = date('d');
                                $dynamicPath = "mails/incoming/{$year}/{$month}/{$day}";
                                $filePath = $request->file('attachment')->store($dynamicPath, 'public');
                                $validatedData['attachment'] = $filePath;
                        }

                        $updatedMail = $this->service->update($id, $validatedData, $type);

                        Log::info('Mail:update success', ['id' => $id, 'type' => $type]);
                        return response()->json(['status' => true, 'data' => new MailResource($updatedMail)]);
                } catch (Throwable $e) {
                        Log::error('Mail:update FAILED', [
                                'id' => $id,
                                'message' => $e->getMessage(),
                                'file' => $e->getFile(),
                                'line' => $e->getLine(),
                                'trace' => $e->getTraceAsString(),
                                'request_data' => $request->except(['attachment']),
                        ]);
                        return response()->json(['status' => false, 'message' => 'Update failed: ' . $e->getMessage()], 500);
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

        public function review(MailRequest $request, $id)
        {
                try {
                        $type = $this->getTypeFromRoute($request);

                        if ($type !== 1) {
                                Log::warning('Mail:review invalid route', ['id' => $id, 'type' => $type]);
                                return response()->json(['status' => false, 'message' => 'Not Found'], 404);
                        }

                        $validatedData = $request->validated();
                        $validatedData['user_id'] = Auth::id();

                        $reviewedMail = $this->service->reviewIncomingMail($id, $validatedData, $type);

                        if (!$reviewedMail) {
                                Log::warning('Mail:review notfound', ['id' => $id, 'type' => $type]);
                                return response()->json(['status' => false, 'message' => 'Mail not found'], 404);
                        }

                        Log::info('Mail:review success', ['id' => $id, 'type' => $type]);
                        return response()->json([
                                'status' => true,
                                'data' => new MailResource($reviewedMail)
                        ]);
                } catch (Throwable $e) {
                        Log::error('Mail:review exception', ['msg' => $e->getMessage(), 'id' => $id]);
                        return response()->json(['status' => false, 'message' => 'Internal Server Error'], 500);
                }
        }

        public function progress() {}
}
