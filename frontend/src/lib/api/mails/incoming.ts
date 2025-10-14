'use server'
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getIncomingMailSummary() {
        if (!API_URL) {
                throw new Error("API URL is not defined");
        }

        try {
                const cookieStore = cookies();
                const token = cookieStore.get('access_token')?.value;

                const res = await fetch(`${API_URL}/mails/incoming/summary`, {
                        method: "GET",
                        headers: {
                                Accept: "application/json",
                                'Authorization': `Bearer ${token}`,
                        },
                });

                const data = await res.json();

                // console.log("Response OK?:", res.ok);
                // console.log("Response Status:", res.status);
                // console.log("Response Data:", JSON.stringify(data, null, 2));

                return { ok: res.ok, data };

        } catch (error) {
                console.error("Fetch failed:", error);
                return { ok: false, data: null, error: error };
        }
}

export async function getIncomingMailList() {
        if (!API_URL) {
                throw new Error("API URL is not defined");
        }

        try {
                const cookieStore = cookies();
                const token = cookieStore.get('access_token')?.value;

                const res = await fetch(`${API_URL}/mails/incoming`, {
                        method: "GET",
                        headers: {
                                Accept: "application/json",
                                'Authorization': `Bearer ${token}`,
                        },
                });

                const data = await res.json();

                console.log("Response OK?:", res.ok);
                console.log("Response Status:", res.status);
                console.log("Response Data:", JSON.stringify(data, null, 2));

                return { ok: res.ok, data };

        } catch (error) {
                console.error("Fetch failed:", error);
                return { ok: false, data: null, error: error };
        }
}