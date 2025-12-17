import { fetchWithAuth } from "../api";
import { DivisionFormData } from "@/types/division-props.ts";

export async function getDivisionList() {
        return await fetchWithAuth('/master/division', { method: "GET" });
}

export async function getDivision(id: string) {
        return await fetchWithAuth(`/master/division/${id}`, { method: "GET" });
}

export async function createDivision(data: DivisionFormData) {
        return await fetchWithAuth('/master/division', {
                method: "POST",
                body: JSON.stringify(data),
        });
}

export async function updateDivision(id: string, data: DivisionFormData) {
        return await fetchWithAuth(`/master/division/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
        });
}

export async function deleteDivision(id: string) {
        return await fetchWithAuth(`/master/division/${id}`, { method: "DELETE" });
}