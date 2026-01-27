<?php

namespace App\Exports;

use App\Models\Workspace\Mails\IncomingMail;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class IncomingMailExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = IncomingMail::with(['mail_category']);

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

        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (!empty($this->filters['view_status'])) {
            if ($this->filters['view_status'] == '1') {
                $query->whereNotNull('user_view_id');
            } else {
                $query->whereNull('user_view_id');
            }
        }

        $mails = $query->orderBy('date', 'desc')->get();

        return $mails->map(function ($mail, $index) {
            $statusLabels = [
                1 => 'Peninjauan',
                2 => 'Disposisi', 
                3 => 'Selesai'
            ];

            return [
                'no' => $index + 1,
                'number' => $mail->number,
                'subject' => $mail->subject,
                'origin' => $mail->origin,
                'category' => $mail->mail_category?->name ?? '-',
                'date' => $mail->date?->format('Y-m-d') ?? '-',
                'status' => $statusLabels[$mail->status] ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Nomor Surat',
            'Perihal',
            'Pengirim',
            'Kategori',
            'Tanggal Surat',
            'Status',
        ];
    }
}
