'use server';

import { cookies } from 'next/headers';
import { DivisionExportFilters } from '@/components/features/manage/divisions/division-export-modal';
import { UserExportFilters } from '@/components/features/manage/users/user-export-modal';

export async function exportDivision(type: 'excel' | 'pdf', filters: DivisionExportFilters) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams();
    queryParams.append('format', type);

    if (filters.status) queryParams.append('status', filters.status);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manage/division/export?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Export failed: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = type === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const extension = type === 'pdf' ? 'pdf' : 'xlsx';

    return {
        data: buffer.toString('base64'),
        contentType,
        filename: `divisi_${new Date().toISOString().split('T')[0]}.${extension}`
    };
}

export async function exportUsers(type: 'excel' | 'pdf', filters: UserExportFilters) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams();
    queryParams.append('format', type);

    if (filters.role) queryParams.append('role', filters.role);
    if (filters.division) queryParams.append('division', filters.division);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manage/users/export?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Export failed: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = type === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const extension = type === 'pdf' ? 'pdf' : 'xlsx';

    return {
        data: buffer.toString('base64'),
        contentType,
        filename: `users_${new Date().toISOString().split('T')[0]}.${extension}`
    };
}
