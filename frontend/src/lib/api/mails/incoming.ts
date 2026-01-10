import { fetchWithAuth } from "../api";

export async function getIncomingMailSummary() {
        return await fetchWithAuth('/mails/incoming/summary', { method: "GET" });
}

export async function getIncomingMailList(search?: string) {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return await fetchWithAuth(`/mails/incoming${query}`, { method: "GET" });
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