export const statusMap: Record<number, string> = {
    1: 'Peninjauan', // Incoming: Sekum Review
    2: 'Disposisi', // Incoming: Division Follow Up
    3: 'Selesai', // Incoming: Done
};

export const outgoingStatusMap: Record<string, { label: string, color: string }> = {
    '1': { label: 'Verifikasi Sekum', color: 'bg-yellow-100 text-yellow-800' },
    '2': { label: 'Perlu Perbaikan', color: 'bg-orange-100 text-orange-800' },
    '3': { label: 'Disetujui', color: 'bg-green-100 text-green-800' },
    '4': { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
};
