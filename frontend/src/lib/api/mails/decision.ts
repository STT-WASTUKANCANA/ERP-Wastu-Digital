import { fetchWithAuth } from "../api";

export async function getDecisionMailSummary() {
        return await fetchWithAuth('/mails/decision/summary', { method: "GET" });
}

export interface DecisionMailFilterParams {
        search?: string;
        start_date?: string;
        end_date?: string;
        category_id?: string;
}

export async function getDecisionMailList(params?: DecisionMailFilterParams) {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append('search', params.search);
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);
        if (params?.category_id) queryParams.append('category_id', params.category_id);

        const queryString = queryParams.toString();
        const url = `/mails/decision${queryString ? `?${queryString}` : ''}`;
        return await fetchWithAuth(url, { method: "GET" });
}

export async function getMailCategories() {
        return await fetchWithAuth('/mails/decision/category', { method: "GET" });
}

export async function createDecisionMail(payload: FormData) {

        return await fetchWithAuth('/mails/decision', {
                method: "POST",
                body: payload,
        });
}

export async function detailDecisionMail(id: number) {
        return await fetchWithAuth(`/mails/decision/${id}`, {
                method: "GET",
        });
}

export async function updateDecisionMail(payload: FormData, id: number) {

        return await fetchWithAuth(`/mails/decision/${id}`, {
                method: "POST",
                body: payload,
        });
}

export async function deleteDecisionMail(id: number) {
        return await fetchWithAuth(`/mails/decision/${id}`, {
                method: "DELETE",
        });
}

export async function getLatestDecisionNumber(date: string) {
        return await fetchWithAuth(`/mails/decision/latest-number?date=${date}`, {
                method: "GET",
        });
}