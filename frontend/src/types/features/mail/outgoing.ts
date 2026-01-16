import { MailTableProps } from "./common";

export type OutgoingMail = {
    id: string;
    number: string;
    user_id: string;
    user_name?: string;
    category_name: string;
    date: string;
    attachment: string;
    institute: string;
    address: string;
    purpose: string;
    status: string; // 'pending' | 'approved' | 'rejected'
    desc?: string;
    validation_note?: string; // Added missing prop based on usage
};

export type OutgoingMailTableProps = MailTableProps<OutgoingMail>;

export interface OutgoingFormProps {
    categories: any[];
    divisions?: any[];
    initialData?: any;
    mode?: "create" | "edit";
    roleId?: number;
}
