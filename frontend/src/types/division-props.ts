export type Division = {
    id: number;
    name: string;
    description: string;
    leader_id: number | null;
    leader_name: string | null;
    created_at?: string;
    updated_at?: string;
};

export type DivisionFormData = {
    name: string;
    description: string;
    leader_id: string | number;
};
