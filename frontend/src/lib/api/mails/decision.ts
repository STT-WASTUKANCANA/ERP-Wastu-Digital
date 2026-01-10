import { fetchWithAuth } from "../api";

export async function getDecisionMailSummary() {
        return await fetchWithAuth('/mails/decision/summary', { method: "GET" });
}

export async function getDecisionMailList(search?: string) {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return await fetchWithAuth(`/mails/decision${query}`, { method: "GET" });
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