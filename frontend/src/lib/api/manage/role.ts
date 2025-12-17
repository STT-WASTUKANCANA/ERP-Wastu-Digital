import { fetchWithAuth } from "../api";

export async function getRoleList() {
    return await fetchWithAuth('/manage/role', { method: "GET" });
}
