'use server';
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
        headers?: Record<string, string>;
}

export async function fetchWithAuth(endpoint: string, options: FetchOptions = {}) {

        if (!API_URL) {
                throw new Error("API URL is not defined");
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        const headers: Record<string, string> = {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
        };

        if (!(options.body instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
        }

        const res = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                        ...headers,
                        ...options.headers,
                },
        });

        if (res.status === 204) {
                return { ok: res.ok, status: res.status, data: null };
        }

        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, data };
}
