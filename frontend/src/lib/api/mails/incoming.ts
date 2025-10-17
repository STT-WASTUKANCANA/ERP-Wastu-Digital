import { fetchWithAuth } from "../api";

export async function getIncomingMailSummary() {
        return await fetchWithAuth('/mails/incoming/summary', { method: "GET" });
}

export async function getIncomingMailList() {
        return await fetchWithAuth('/mails/incoming', { method: "GET" });
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

export async function deleteIncomingMail(id: number) {
        return await fetchWithAuth(`/mails/incoming/${id}`, {
                method: "DELETE",
        });
}
