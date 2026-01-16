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

        // 1. Ambil token dari Header (prioritas)
        const headerStore = await headers();
        let accessToken = headerStore.get('authorization')?.split(' ')[1];

        // 2. Ambil dari Cookie jika header kosong
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

        // Tangani 401: Token kadaluarsa atau tidak valid
        if (res.status === 401) {
                console.error("[fetchWithAuth] Unauthorized (401). Token likely invalid or expired beyond refresh.");
        }

        if (res.status === 204) {
                return { ok: res.ok, status: res.status, data: null };
        }

        const data = await res.json().catch(() => ({}));

        return { ok: res.ok, status: res.status, data };
}
