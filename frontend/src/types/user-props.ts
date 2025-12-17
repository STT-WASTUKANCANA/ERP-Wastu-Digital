export interface User {
    id: number;
    name: string;
    email: string;
    role_id: number | null;
    role_name: string | null;
    division_id: number | null;
    division_name: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface Division {
    id: number;
    name: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    role_id: number | null;
    division_id: number | null;
}

export interface UserTableProps {
    users: User[];
    onUserUpdated: () => void;
    isLoading: boolean;
}
