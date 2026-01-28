'use server';

import { cookies } from 'next/headers';
import { DivisionExportFilters } from '@/components/features/manage/divisions/division-export-modal';
import { UserExportFilters } from '@/components/features/manage/users/user-export-modal';

export async function exportDivision(type: 'excel', filters: DivisionExportFilters) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams();

    if (filters.status) queryParams.append('status', filters.status);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manage/division/export?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json', // Or application/vnd.openxmlformats...
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Export failed: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
        data: buffer.toString('base64'),
        contentType: response.headers.get('content-type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: `divisi_${new Date().toISOString().split('T')[0]}.xlsx`
    };
}

export async function exportUsers(type: 'excel', filters: UserExportFilters) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams();

    if (filters.role) queryParams.append('role', filters.role);
    if (filters.division) queryParams.append('division', filters.division);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/manage/users/export?${queryParams.toString()}`, {
        method: 'GET', // Changed to GET as per route definition
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

    return {
        data: buffer.toString('base64'),
        contentType: response.headers.get('content-type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: `users_${new Date().toISOString().split('T')[0]}.xlsx`
    };
}
