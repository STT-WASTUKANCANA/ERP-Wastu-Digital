'use server';

import { cookies } from 'next/headers';

export async function exportMailCategories(type: 'excel' | 'pdf', mailType?: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        throw new Error('No authentication token found');
    }

    const body: any = { type };
    if (mailType) {
        body.mail_type = mailType;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/master/mail-category/export`, {
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
    
    return {
        data: buffer.toString('base64'),
        contentType: response.headers.get('content-type') || 'application/octet-stream',
        filename: response.headers.get('content-disposition')?.split('filename=')[1] || `export.${type === 'pdf' ? 'pdf' : 'xlsx'}`
    };
}
