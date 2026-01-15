import { fetchWithAuth } from "../api";

export async function getIncomingMailSummary() {
        return await fetchWithAuth('/mails/incoming/summary', { method: "GET" });
}

export interface MailFilterParams {
        search?: string;
        start_date?: string;
        end_date?: string;
        category_id?: string;
        status?: string;
        destination?: string; // For outgoing
        user_view_id?: string; // For incoming 'dilihat' (using existing column logic? or specific param)
}

export async function getIncomingMailList(params?: MailFilterParams) {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append('search', params.search);
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);
        if (params?.category_id) queryParams.append('category_id', params.category_id);
        if (params?.status) queryParams.append('status', params.status);
        // 'dilihat' usually maps to a boolean or specific status in backend.
        // User said "dilihat". Assuming backend handles 'is_viewed' or similar?
        // Or maybe 'view_status'? I will use 'is_read' or similar if I don't know the backend.
        // Wait, the table column uses `user_view_id`.
        // Let's pass `is_viewed` '1' or '0'? Or `view_status`?
        // I will use `view_status` as it is generic.
        if (params?.user_view_id) queryParams.append('view_status', params.user_view_id);

        const queryString = queryParams.toString();
        const url = `/mails/incoming${queryString ? `?${queryString}` : ''}`;

        return await fetchWithAuth(url, { method: "GET" });
}

export async function getMailCategories() {
        return await fetchWithAuth('/mails/incoming/category', { method: "GET" });
}

export async function createIncomingMail(payload: FormData) {

        return await fetchWithAuth('/mails/incoming', {
                method: "POST",
                body: payload,
        });
}

export async function detailIncomingMail(id: number) {
        return await fetchWithAuth(`/mails/incoming/${id}`, {
                method: "GET",
        });
}

export async function updateIncomingMail(payload: FormData, id: number) {

        return await fetchWithAuth(`/mails/incoming/${id}`, {
                method: "POST",
                body: payload,
        });
}

export async function deleteIncomingMail(id: number) {
        return await fetchWithAuth(`/mails/incoming/${id}`, {
                method: "DELETE",
        });
}

export async function reviewIncomingMail(payload: FormData, id: number) {

        return await fetchWithAuth(`/mails/incoming/review/${id}`, {
                method: "POST",
                body: payload,
        });
}

export async function divisionReviewIncomingMail(payload: FormData, id: number) {

        return await fetchWithAuth(`/mails/incoming/division-review/${id}`, {
                method: "POST",
                body: payload,
        });
}