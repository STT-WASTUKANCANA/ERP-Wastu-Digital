'use server';

import { cookies } from 'next/headers';

interface ExportFilters {
    category_id?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
    view_status?: string;
    destination?: string;
}

export async function exportIncomingMail(type: 'excel' | 'pdf', filters: ExportFilters = {}) {
    return exportMail('incoming', type, filters);
}

export async function exportOutgoingMail(type: 'excel' | 'pdf', filters: ExportFilters = {}) {
    return exportMail('outgoing', type, filters);
}

export async function exportDecisionLetter(type: 'excel' | 'pdf', filters: ExportFilters = {}) {
    return exportMail('decision', type, filters);
}

async function exportMail(mailType: 'incoming' | 'outgoing' | 'decision', type: 'excel' | 'pdf', filters: ExportFilters) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        throw new Error('No authentication token found');
    }

    const body: any = { type, ...filters };

    // Remove empty values
    Object.keys(body).forEach(key => {
        if (body[key] === '' || body[key] === undefined || body[key] === null) {
            delete body[key];
        }
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mails/${mailType}/export`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Export failed: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mailTypeNames: Record<string, string> = {
        incoming: 'surat_masuk',
        outgoing: 'surat_keluar',
        decision: 'surat_keputusan'
    };

    return {
        data: buffer.toString('base64'),
        contentType: response.headers.get('content-type') || 'application/octet-stream',
        filename: `${mailTypeNames[mailType]}_${new Date().getTime()}.${type === 'pdf' ? 'pdf' : 'xlsx'}`
    };
}
