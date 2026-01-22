import { MailTableProps } from "./common";

export type IncomingMail = {
    id: string;
    number: string;
    user_id: string;
    user_name?: string;
    category_name: string;
    division_name?: string;
    status: number;
    follow_status: number;
    date: string;
    attachment: string;
    user_view_id?: number | null;
    desc?: string;
    sekum_desc?: string;
    division_desc?: string;
    divisions?: {
        id: string | number;
        name: string;
        is_read: boolean;
    }[];
};

export interface IncomingCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export type IncomingMailTableProps = MailTableProps<IncomingMail>;

export interface IncomingOffcanvasDetailProps {
    mail: IncomingMail;
    onClose: () => void;
    onAction: (e: React.MouseEvent, action: string, mailId: string) => void | Promise<void>;
}

export interface IncomingFormProps {
    categories: any[]; // Consider using MailCategory[] if no circular dependency issues
    divisions?: any[];
    initialData?: any;
    mode?: "create" | "edit" | "review" | "division_review";
    roleId?: number;
}
