import { fetchWithAuth } from "../api";

export interface MailCategory {
    id: number;
    name: string;
    type: number; // 1: Incoming, 2: Outgoing, 3: Decision
    type_label: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface MailCategoryFormData {
    name: string;
    type: string; // Form handling usually uses string for Select
    description: string;
}

export async function getMailCategoryList(type?: number, search?: string) {
    const params = new URLSearchParams();
    if (type) params.append('type', String(type));
    if (search) params.append('search', search);

    const queryString = params.toString();
    const url = `/master/mail-category${queryString ? `?${queryString}` : ''}`;

    return await fetchWithAuth(url, { method: "GET" });
}

export async function getMailCategory(id: string) {
    return await fetchWithAuth(`/master/mail-category/${id}`, { method: "GET" });
}

export async function createMailCategory(data: MailCategoryFormData) {
    return await fetchWithAuth('/master/mail-category', {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateMailCategory(id: string, data: MailCategoryFormData) {
    return await fetchWithAuth(`/master/mail-category/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteMailCategory(id: string) {
    return await fetchWithAuth(`/master/mail-category/${id}`, { method: "DELETE" });
}
