import { fetchWithAuth } from "@/lib/utils/fetch-with-auth";

export interface DashboardStats {
    mail_trend: {
        labels: string[];
        incoming: number[];
        outgoing: number[];
        decision: number[];
    };
    mail_status: any; // Will define later
    mail_category: any;
    entity_counts: {
        users: number;
        divisions: number;
    };
}

export async function getDashboardStats(year?: number) {
    const query = year ? `?year=${year}` : '';
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats${query}`, {
        method: "GET",
    });

    return res; // fetchWithAuth returns { ok, data, status }
}
