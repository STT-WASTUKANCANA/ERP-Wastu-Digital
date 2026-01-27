<?php

namespace App\Exports;

use App\Models\Workspace\Mails\OutgoingMail;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class OutgoingMailExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = OutgoingMail::with(['mail_category']);

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

        if (!empty($this->filters['destination'])) {
            $query->where('destination', 'like', '%' . $this->filters['destination'] . '%');
        }

        $mails = $query->orderBy('date', 'desc')->get();

        return $mails->map(function ($mail, $index) {
            $statusLabels = [
                1 => 'Verifikasi Sekum',
                2 => 'Perlu Perbaikan',
                3 => 'Disetujui',
                4 => 'Ditolak'
            ];

            return [
                'no' => $index + 1,
                'number' => $mail->number ?? '-',
                'subject' => $mail->subject,
                'destination' => $mail->destination,
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
            'Tujuan',
            'Kategori',
            'Tanggal Surat',
            'Status',
        ];
    }
}
