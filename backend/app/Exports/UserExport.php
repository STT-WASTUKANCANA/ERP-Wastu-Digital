<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class UserExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = User::with(['role', 'division']);

        // Filter Role
        if (!empty($this->filters['role'])) {
            // Asumsikan filter mengirim role_name atau role_id. 
            // Jika role_name string:
            $query->whereHas('role', function ($q) {
                $q->where('name', $this->filters['role']);
            });
        }

        // Filter Division
        if (!empty($this->filters['division'])) {
            // Asumsikan filter mengirim division_name string
            $query->whereHas('division', function ($q) {
                $q->where('name', $this->filters['division']);
            });
        }



        $users = $query->orderBy('name', 'asc')->get();

        return $users->map(function ($user, $index) {
            return [
                'no' => $index + 1,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ? $user->role->name : '-',
                'division' => $user->division ? $user->division->name : '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama',
            'Email',
            'Role',
            'Divisi',
        ];
    }
}
