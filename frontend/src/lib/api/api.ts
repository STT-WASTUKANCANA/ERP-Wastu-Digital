'use server';
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
        headers?: Record<string, string>;
}

export async function fetchWithAuth(endpoint: string, options: FetchOptions = {}) {
        if (!API_URL) {
                throw new Error("API URL is not defined");
        }

        // 1. Prioritaskan token dari Headers (yang dikirim oleh Middleware jika baru direfresh)
        // Middleware menaruh 'Authorization: Bearer <token>'
        const headerStore = await headers();
        let accessToken = headerStore.get('authorization')?.split(' ')[1];

        // 2. Jika tidak ada di header, ambil dari Cookie biasa
        if (!accessToken) {
                const cookieStore = await cookies();
                accessToken = cookieStore.get('access_token')?.value;
        }

        const reqHeaders: Record<string, string> = {
                Accept: 'application/json',
        };

        if (accessToken) {
                reqHeaders['Authorization'] = `Bearer ${accessToken}`;
        }

        if (!(options.body instanceof FormData)) {
                reqHeaders['Content-Type'] = 'application/json';
        }

        const res = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                        ...reqHeaders,
                        ...options.headers,
                },
        });

        // Jika 401, berarti Access Token expired DAN Refresh Token juga gagal/expired (karena Middleware sudah lolos)
        // Atau token dicabut di server.
        // Kita tidak bisa refresh di sini tanpa crash (Server Component readonly cookie).
        // Jadi kita biarkan error atau redirect.
        if (res.status === 401) {
                console.error("[fetchWithAuth] Unauthorized (401). Token likely invalid or expired beyond refresh.");
                // Opsional: Throw error atau biarkan UI menangani
        }

        if (res.status === 204) {
                return { ok: res.ok, status: res.status, data: null };
        }

        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, data };
}
