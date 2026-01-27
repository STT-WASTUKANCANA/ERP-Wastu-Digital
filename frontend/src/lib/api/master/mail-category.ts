import { fetchWithAuth } from "../api";

export interface MailCategory {
    id: number;
    name: string;
    description: string;
    type: number;
    type_label?: string;
    created_at: string;
    updated_at: string;
}

export const getCategories = () => fetchWithAuth("/master/mail-category", { method: "GET" });

export const getMailCategoryList = async (type?: string, search?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (search) params.append('search', search);
    
    return await fetchWithAuth(`/master/mail-category?${params.toString()}`, { method: "GET" });
};

export const createCategory = (data: { name: string; description: string; type: number }) =>
    fetchWithAuth("/master/mail-category", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const updateCategory = (id: number, data: { name: string; description: string; type: number }) =>
    fetchWithAuth(`/master/mail-category/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });

export const deleteCategory = (id: number) => fetchWithAuth(`/master/mail-category/${id}`, { method: "DELETE" });
export const deleteMailCategory = (id: string) => fetchWithAuth(`/master/mail-category/${id}`, { method: "DELETE" });

// Export is handled by server action
// See /lib/actions/export.ts
export { exportMailCategories as exportCategories } from '@/lib/actions/export';
