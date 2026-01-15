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

        // Helper untuk mendapatkan tipe surat dari nama rute
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


    // Menampilkan daftar surat berdasarkan filter
    public function index(Request $request)
        {
                try {
                        $type = $this->getTypeFromRoute($request);
                        $filters = $request->all();
                        $search = $request->input('search');

                        $data = $this->service->all($type, $filters);

                        Log::info('[MAIL] LIST: Mengambil daftar surat', ['type' => $type, 'count' => count($data), 'search' => $search, 'user_id' => Auth::id()]);
                        return response()->json(['status' => true, 'data' => MailResource::collection($data)]);
                } catch (Throwable $e) {
                        Log::error('[MAIL] LIST: Gagal mengambil daftar surat', ['msg' => $e->getMessage()]);
                        return response()->json(['status' => false], 500);
                }
        }

        public function store(MailRequest $request)
        {
                try {
                        $validatedData = $request->validated();
                        $validatedData['user_id'] = Auth::id();

                        // Ambil tipe surat dari rute (1=masuk, 2=keluar, 3=keputusan)
                        $type = $this->getTypeFromRoute($request);
                        
                        // Batasan Surat Keputusan (Tipe 3): Hanya Role Pulahta
                        if ($type === 3 && Auth::user()->role_id !== 3) {
                            return response()->json([
                                'status' => false,
                                'message' => 'Hanya Role Pulahta yang diizinkan membuat Surat Keputusan.'
                            ], 403);
                        }

                        Log::debug('[MAIL] CREATE: Memulai pembuatan surat', [
                                'type' => $type,
                                'user_id' => Auth::id(),
                                'has_attachment' => $request->hasFile('attachment'),
                        ]);

                        if ($request->hasFile('attachment')) {
                                $year  = date('Y');
                                $month = date('m');
                                $day   = date('d');

                                // Mapping folder berdasarkan tipe
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
                                
                                Log::debug('[MAIL] CREATE: Lampiran tersimpan', ['path' => $filePath]);
                        }

                        $mail = $this->service->create($validatedData, $type);

                        Log::info('[MAIL] CREATE: Surat berhasil dibuat', ['id' => $mail->id, 'type' => $type, 'user_id' => Auth::id()]);

                        return response()->json([
                                'status' => true,
                                'data'   => new MailResource($mail)
                        ], 201);
                } catch (Throwable $e) {
                        Log::error('[MAIL] CREATE: Gagal membuat surat', [
                                'message' => $e->getMessage(),
                                'file' => $e->getFile(),
                                'line' => $e->getLine(),
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
                        Log::warning('[MAIL] SHOW: Surat tidak ditemukan', ['id' => $id, 'type' => $type]);
                        return response()->json(['status' => false], 404);
                }

                Log::info('[MAIL] SHOW: Menampilkan detail surat', ['id' => $id, 'type' => $type, 'user_id' => Auth::id()]);
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

                        Log::info('[MAIL] UPDATE: Surat berhasil diperbarui', ['id' => $id, 'type' => $type, 'user_id' => Auth::id()]);
                        return response()->json(['status' => true, 'data' => new MailResource($updatedMail)]);
                } catch (Throwable $e) {
                        Log::error('[MAIL] UPDATE: Gagal memperbarui surat', [
                                'id' => $id,
                                'message' => $e->getMessage(),
                                'user_id' => Auth::id(),
                        ]);
                        return response()->json(['status' => false, 'message' => 'Update failed: ' . $e->getMessage()], 500);
                }
        }


        public function destroy(Request $request, $id)
        {
                $type = $this->getTypeFromRoute($request);
                $deleted = $this->service->delete($id, $type);

                if (!$deleted) {
                        Log::warning('[MAIL] DELETE: Surat tidak ditemukan untuk dihapus', ['id' => $id, 'type' => $type]);
                        return response()->json(['status' => false], 404);
                }

                Log::info('[MAIL] DELETE: Surat berhasil dihapus', ['id' => $id, 'type' => $type, 'user_id' => Auth::id()]);
                return response()->json(['status' => true]);
        }

        public function summary(Request $request)
        {
                try {
                        $type = $this->getTypeFromRoute($request);
                        $stats = $this->service->getMonthlySummary($type);

                        Log::info('[MAIL] SUMMARY: Mengambil ringkasan bulanan', ['type' => $type, 'stats' => $stats, 'user_id' => Auth::id()]);
                        return response()->json(['status' => true, 'data' => $stats]);
                } catch (Throwable $e) {
                        Log::error('[MAIL] SUMMARY: Gagal mengambil ringkasan', ['msg' => $e->getMessage()]);
                        return response()->json(['status' => false], 500);
                }
        }

    // Menangani proses review surat masuk
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
                                Log::warning('[MAIL] REVIEW: Surat tidak ditemukan', ['id' => $id, 'type' => $type]);
                                return response()->json(['status' => false, 'message' => 'Mail not found'], 404);
                        }

                        Log::info('[MAIL] REVIEW: Surat masuk berhasil direview', ['id' => $id, 'type' => $type, 'user_id' => Auth::id()]);
                        return response()->json([
                                'status' => true,
                                'data' => new MailResource($reviewedMail)
                        ]);
                } catch (Throwable $e) {
                        Log::error('Mail:review exception', ['msg' => $e->getMessage(), 'id' => $id]);
                        return response()->json(['status' => false, 'message' => 'Internal Server Error'], 500);
                }
        }


    // Menangani proses validasi surat keluar
    public function validateOutgoing(Request $request, $id)
        {
                try {
                        $type = $this->getTypeFromRoute($request);
                        if ($type !== 2) {
                                return response()->json(['status' => false, 'message' => 'Invalid route for validation'], 400);
                        }


                        $data = $request->validate([
                            'status' => ['required', \Illuminate\Validation\Rule::in(['approved', 'rejected', '1', '2', '3', '4', 1, 2, 3, 4])], 
                            'note'   => 'nullable|string'
                        ]);

                        $mail = $this->service->validateOutgoingMail($id, $data);

                        if (!$mail) {
                                return response()->json(['status' => false, 'message' => 'Mail not found'], 404);
                        }

                        Log::info('[MAIL] VALIDATE: Surat keluar berhasil divalidasi', ['id' => $id, 'user_id' => Auth::id(), 'status' => $data['status']]);
                        return response()->json(['status' => true, 'data' => new MailResource($mail)]);
                } catch (Throwable $e) {
                        Log::error('[MAIL] VALIDATE: Gagal memvalidasi surat', ['msg' => $e->getMessage()]);
                        return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
                }
        }

        public function progress() {}
}
