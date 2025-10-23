import { fetchWithAuth } from "../api";

export async function getDivisionList() {
        return await fetchWithAuth('/master/division', { method: "GET" });
}