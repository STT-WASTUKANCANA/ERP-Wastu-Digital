<?php

namespace App\Exports;

use App\Models\Workspace\Mails\DecisionLetter;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class DecisionLetterExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = DecisionLetter::with(['mail_category']);

        // Apply filters
        if (!empty($this->filters['category_id'])) {
            $query->where('category_id', $this->filters['category_id']);
        }

        if (!empty($this->filters['start_date'])) {
            $query->whereDate('date', '>=', $this->filters['start_date']);
        }

        if (!empty($this->filters['end_date'])) {
            $query->whereDate('date', '<=', $this->filters['end_date']);
        }

        $mails = $query->orderBy('date', 'desc')->get();

        return $mails->map(function ($mail, $index) {
            return [
                'no' => $index + 1,
                'number' => $mail->number ?? '-',
                'subject' => $mail->subject,
                'category' => $mail->mail_category?->name ?? '-',
                'date' => $mail->date ? date('Y-m-d', strtotime($mail->date)) : '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Nomor Surat',
            'Perihal',
            'Kategori',
            'Tanggal Surat',
        ];
    }
}
