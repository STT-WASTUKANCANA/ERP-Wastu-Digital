import { fetchWithAuth } from "../api";

export async function getOutgoingMailSummary() {
        return await fetchWithAuth('/mails/outgoing/summary', { method: "GET" });
}

export async function getOutgoingMailList() {
        return await fetchWithAuth('/mails/outgoing', { method: "GET" });
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