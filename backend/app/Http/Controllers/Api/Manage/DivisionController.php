<?php

namespace App\Http\Controllers\Api\Manage;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Manage\DivisionRequest;
use App\Http\Resources\Api\Master\DivisionResource;
use App\Models\Division;
use App\Services\Api\Master\DivisionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;
use App\Exports\DivisionExport;
use Maatwebsite\Excel\Facades\Excel;

class DivisionController extends Controller
{
    private DivisionService $service;

    public function __construct(DivisionService $service)
    {
        $this->service = $service;
    }

    // Menampilkan daftar divisi
    public function index()
    {
        $divisions = $this->service->all();

        Log::info('[MANAGE] DIVISI LIST: Mengambil daftar divisi', [
            'count' => $divisions->count(),
            'user_id' => auth()->id() // jika ada auth
        ]);

        return response()->json([
            'status' => true,
            'data' => DivisionResource::collection($divisions)
        ]);
    }

    // Membuat divisi baru
    public function store(DivisionRequest $request)
    {
        try {
            $data = $request->validated();
            $division = $this->service->create($data);

            Log::info('[MANAGE] DIVISI CREATE: Divisi berhasil dibuat', ['division_id' => $division->id, 'user_id' => auth()->id()]);

            return response()->json([
                'status' => true,
                'data' => new DivisionResource($division)
            ], 201);
        } catch (Throwable $e) {
            Log::error('[MANAGE] DIVISI CREATE: Gagal membuat divisi', ['error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // Menampilkan detail divisi
    public function show($id)
    {
        try {
            $division = Division::findOrFail($id);
            return new DivisionResource($division);
        } catch (Throwable $e) {
            return response()->json(['status' => false, 'message' => 'Division not found.'], 404);
        }
    }

    // Memperbarui data divisi
    public function update(DivisionRequest $request, $id)
    {
        try {
            $division = Division::findOrFail($id);

            $updatedDivision = $this->service->update($division, $request->validated());

            Log::info('[MANAGE] DIVISI UPDATE: Divisi berhasil diperbarui', ['division_id' => $updatedDivision->id, 'user_id' => auth()->id()]);

            return response()->json([
                'status' => true,
                'data' => new DivisionResource($updatedDivision)
            ]);
        } catch (Throwable $e) {
            Log::error('[MANAGE] DIVISI UPDATE: Gagal memperbarui divisi', ['division_id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => 'Update failed or division not found.'], 500);
        }
    }

    // Menghapus divisi
    public function destroy($id)
    {
        try {
            $division = Division::findOrFail($id);
            $this->service->delete($division);

            Log::info('[MANAGE] DIVISI DELETE: Divisi berhasil dihapus', ['division_id' => $id, 'user_id' => auth()->id()]);

            return response()->json(['status' => true, 'message' => 'Division deleted successfully'], 200);
        } catch (Throwable $e) {
            Log::error('[MANAGE] DIVISI DELETE: Gagal menghapus divisi', ['division_id' => $id, 'error' => $e->getMessage()]);
            return response()->json(['status' => false, 'message' => 'Delete failed or division not found.'], 500);
        }
    }

    // Export Data Divisi
    public function export(Request $request)
    {
        $filters = $request->all();
        $date = now()->format('Y-m-d');

        $format = $request->input('format', 'excel');

        if ($format === 'pdf') {
            return Excel::download(new DivisionExport($filters), "divisi_$date.pdf", \Maatwebsite\Excel\Excel::DOMPDF);
        }

        return Excel::download(new DivisionExport($filters), "divisi_$date.xlsx");
    }
}
