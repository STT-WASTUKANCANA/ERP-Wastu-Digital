import React from 'react';
import { IncomingMail } from '@/types/features/mail/incoming';
import { OutgoingMail } from '@/types/features/mail/outgoing';
import { DecisionMail } from '@/types/features/mail/decision';
import { statusMap, outgoingStatusMap } from '@/lib/constants/mail';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';

export const getMailDetailItems = (type: string, selectedMail: any) => {
    let title = "Detail Surat";
    let items: { label: string; value: React.ReactNode }[] = [];

    if (!selectedMail) return { title, items };

    if (type === "incoming") {
        const mail = selectedMail as IncomingMail;
        title = "Detail Surat Masuk";

        const getBadge = (s: number, f: number) => {
            if (s === 2 && f === 2) return { label: "Proses", color: "bg-yellow-100 text-yellow-800" };
            // statusMap keys are numbers, map keys should be strings for consistency or handled gracefully
            // The existing logic used hardcoded map in MailTable, refactoring it here
            const m: any = {
                1: { l: statusMap[1], c: "bg-secondary text-white" },
                2: { l: statusMap[2], c: "bg-blue-100 text-blue-800" },
                3: { l: statusMap[3], c: "bg-green-100 text-green-800" }
            };
            const d = m[s] || { l: "Unknown", c: "bg-gray-100 text-gray-800" };
            return { label: d.l, color: d.c };
        };

        const b = getBadge(mail.status, mail.follow_status);

        items = [
            { label: "Nomor Surat", value: mail.number },
            { label: "Tanggal", value: formatDate(mail.date) },
            { label: "Kategori", value: mail.category_name },
            { label: "Oleh", value: mail.user_name || '-' },
            { label: "Status", value: <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.color}`}>{b.label}</span> },
            { label: "Divisi", value: mail.division_name || '-' },
            { label: "Perihal", value: mail.desc }
        ];

    } else if (type === "outgoing") {
        const mail = selectedMail as OutgoingMail;
        title = "Detail Surat Keluar";
        items = [
            { label: "Nomor Surat", value: mail.number },
            { label: "Tanggal", value: formatDate(mail.date) },
            { label: "Kategori", value: mail.category_name },
            { label: "Oleh", value: mail.user_name },
            { label: "Instansi", value: mail.institute },
            { label: "Alamat", value: mail.address },
            { label: "Status", value: <StatusBadge value={String(mail.status)} map={outgoingStatusMap} /> },
            { label: "Tujuan", value: mail.purpose },
            { label: "Perihal", value: mail.desc }
        ];

    } else if (type === "decision") {
        const mail = selectedMail as DecisionMail;
        title = "Detail Surat Keputusan";
        items = [
            { label: "Nomor Surat", value: mail.number },
            { label: "Tanggal", value: formatDate(mail.date) },
            { label: "Kategori", value: mail.category_name },
            { label: "Oleh", value: mail.user_name || '-' },
            { label: "Judul", value: mail.title },
            { label: "Deskripsi", value: mail.desc }
        ];
    }

    return { title, items };
};
