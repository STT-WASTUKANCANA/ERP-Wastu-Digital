import { fetchWithAuth } from "../api";
import { DivisionFormData } from "@/types/division-props";

export async function getDivisionList() {
        return await fetchWithAuth('/manage/division', {
                method: "GET",
                cache: "no-store"
        });
}

export async function getDivision(id: string) {
        return await fetchWithAuth(`/manage/division/${id}`, { method: "GET" });
}

export async function createDivision(data: DivisionFormData) {
        return await fetchWithAuth('/manage/division', {
                method: "POST",
                body: JSON.stringify(data),
        });
}

export async function updateDivision(id: string, data: DivisionFormData) {
        return await fetchWithAuth(`/manage/division/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
        });
}

export async function deleteDivision(id: string) {
        return await fetchWithAuth(`/manage/division/${id}`, { method: "DELETE" });
}