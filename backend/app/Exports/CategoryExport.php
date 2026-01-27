<?php

namespace App\Exports;

use App\Models\Workspace\Mails\MailCategory;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class CategoryExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $type;

    public function __construct($type = null)
    {
        $this->type = $type;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $query = MailCategory::query();

        if ($this->type) {
            $query->where('type', $this->type);
        }

        $categories = $query->get();

        // Add row numbering
        return $categories->map(function ($category, $index) {
            return [
                'no' => $index + 1,
                'name' => $category->name,
                'description' => $category->description,
                'type' => $category->type == 1 ? 'Surat Masuk' : ($category->type == 2 ? 'Surat Keluar' : 'Surat Keputusan'),
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Kategori',
            'Deskripsi',
            'Jenis Surat',
        ];
    }
}
