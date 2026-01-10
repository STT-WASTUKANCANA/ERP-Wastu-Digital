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
        const accessToken = cookieStore.get('access_token')?.value;

        const headers: Record<string, string> = {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
        };

        if (!(options.body instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
        }

        // 1. Percobaan Pertama: Request Normal
        let res = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                        ...headers,
                        ...options.headers,
                },
        });

        // 2. Intercept 401 (Unauthorized)
        if (res.status === 401) {
                const refreshToken = cookieStore.get('refresh_token')?.value;

                if (refreshToken) {
                        try {
                                // 3. Mencoba Refresh Token
                                // Kita HARUS mengirim cookie 'refresh_token' secara manual di header
                                const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
                                        method: 'POST',
                                        headers: {
                                                'Content-Type': 'application/json',
                                                'Accept': 'application/json',
                                                'Cookie': `refresh_token=${refreshToken}`,
                                        },
                                });

                                if (refreshRes.ok) {
                                        const refreshData = await refreshRes.json();
                                        const newAccessToken = refreshData.access_token;

                                        // 4. Update Cookies
                                        // Update cookie di browser menggunakan server actions
                                        if (newAccessToken) {
                                                cookieStore.set('access_token', newAccessToken, {
                                                        httpOnly: true,
                                                        secure: process.env.NODE_ENV === 'production',
                                                        sameSite: 'strict',
                                                        maxAge: refreshData.expires_in
                                                });

                                                // Ulangi Request Asli dengan Token BARU
                                                const newHeaders = {
                                                        ...headers,
                                                        ...options.headers,
                                                        Authorization: `Bearer ${newAccessToken}`
                                                };

                                                res = await fetch(`${API_URL}${endpoint}`, {
                                                        ...options,
                                                        headers: newHeaders
                                                });
                                        }
                                } else {
                                        // Refresh Gagal (Token kadaluwarsa atau tidak valid)
                                        // Hapus semua sesi untuk memaksa login ulang
                                        cookieStore.delete('access_token');
                                        cookieStore.delete('refresh_token');
                                }
                        } catch (error) {
                                console.error("[API] Gagal melakukan refresh token:", error);
                        }
                }
        }

        if (res.status === 204) {
                return { ok: res.ok, status: res.status, data: null };
        }

        const data = await res.json().catch(() => ({}));
        return { ok: res.ok, status: res.status, data };
}
