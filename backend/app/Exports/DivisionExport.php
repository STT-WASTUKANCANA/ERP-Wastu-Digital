<?php

namespace App\Exports;

use App\Models\Division;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class DivisionExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Division::with(['leader']);

        // Apply filters
        if (isset($this->filters['status']) && $this->filters['status'] !== '') {
            $query->where('active', $this->filters['status']);
        }



        $divisions = $query->orderBy('name', 'asc')->get();

        return $divisions->map(function ($division, $index) {
            return [
                'no' => $index + 1,
                'name' => $division->name,
                'leader' => $division->leader ? $division->leader->name : '-',
                'description' => $division->description ?? '-',
                'status' => $division->active ? 'Aktif' : 'Nonaktif',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Divisi',
            'Kepala Bidang',
            'Deskripsi',
            'Status',
        ];
    }
}
