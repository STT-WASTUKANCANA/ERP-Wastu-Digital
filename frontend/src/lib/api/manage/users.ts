import { fetchWithAuth } from "../api";

export async function getUserList(search?: string, role?: string, division?: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (division) params.append('division', division);

    return await fetchWithAuth(`/manage/users?${params.toString()}`, { method: "GET" });
}

export async function detailUser(id: number) {
    return await fetchWithAuth(`/manage/users/${id}`, {
        method: "GET",
    });
}

export async function createUser(payload: any) {
    return await fetchWithAuth('/manage/users', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}

export async function updateUser(payload: any, id: number) {
    return await fetchWithAuth(`/manage/users/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
}

export async function deleteUser(id: number) {
    return await fetchWithAuth(`/manage/users/${id}`, {
        method: "DELETE",
    });
}
