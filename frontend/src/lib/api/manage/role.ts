import { fetchWithAuth } from "../api";

export async function getRoleList() {
    return await fetchWithAuth('/master/role', { method: "GET" });
}
