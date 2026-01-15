import { fetchWithAuth } from "../api";

export async function getOutgoingMailSummary() {
        return await fetchWithAuth('/mails/outgoing/summary', { method: "GET" });
}

export interface OutgoingMailFilterParams {
        search?: string;
        start_date?: string;
        end_date?: string;
        category_id?: string;
        status?: string;
        destination?: string;
}

export async function getOutgoingMailList(params?: OutgoingMailFilterParams) {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append('search', params.search);
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);
        if (params?.category_id) queryParams.append('category_id', params.category_id);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.destination) queryParams.append('destination', params.destination);

        const queryString = queryParams.toString();
        const url = `/mails/outgoing${queryString ? `?${queryString}` : ''}`;
        return await fetchWithAuth(url, { method: "GET" });
}

export async function getMailCategories() {
        return await fetchWithAuth('/mails/outgoing/category', { method: "GET" });
}

export async function createOutgoingMail(payload: FormData) {

        return await fetchWithAuth('/mails/outgoing', {
                method: "POST",
                body: payload,
        });
}

export async function detailOutgoingMail(id: number) {
        return await fetchWithAuth(`/mails/outgoing/${id}`, {
                method: "GET",
        });
}

export async function updateOutgoingMail(payload: FormData, id: number) {

        return await fetchWithAuth(`/mails/outgoing/${id}`, {
                method: "POST",
                body: payload,
        });
}

export async function deleteOutgoingMail(id: number) {
        return await fetchWithAuth(`/mails/outgoing/${id}`, {
                method: "DELETE",
        });
}

export async function validateOutgoingMail(id: number, status: string, note?: string) {
        return await fetchWithAuth(`/mails/outgoing/validate/${id}`, {
                method: "PUT",
                headers: {
                        "Content-Type": "application/json",
                },
                body: JSON.stringify({ status, note }),
        });
}