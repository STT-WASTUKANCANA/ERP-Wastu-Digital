export interface MailCategory {
        id: number;
        name: string;
        type: string;
        type_name: string;
}

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
};

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
};

export type DecisionMail = {
        id: string;
        number: string;
        user_id: string;
        user_name?: string;
        category_name: string;
        date: string;
        attachment: string;
        title: string;
        desc?: string;
};

export interface IncomingCreateModalProps {
        isOpen: boolean;
        onClose: () => void;
        onSuccess: () => void;
}

export interface MailTableProps<T> {
        mails: T[];
        onMailCreated: () => void;
        isLoading: boolean;
        type: 'incoming' | 'outgoing' | 'decision';
        onSearch?: (query: string) => void;
}

export type IncomingMailTableProps = MailTableProps<IncomingMail>;
export type OutgoingMailTableProps = MailTableProps<OutgoingMail>;
export type DecisionMailTableProps = MailTableProps<DecisionMail>;

export interface IncomingOffcanvasDetailProps {
        mail: IncomingMail;
        onClose: () => void;
        onAction: (e: React.MouseEvent, action: string, mailId: string) => void | Promise<void>;
}

export interface DecisionOffcanvasDetailProps {
        mail: DecisionMail;
        onClose: () => void;
        onAction: (e: React.MouseEvent, action: string, mailId: string) => void | Promise<void>;
}

export const statusMap: Record<number, string> = {
        1: 'Peninjauan', // Incoming: Sekum Review
        2: 'Disposisi', // Incoming: Division Follow Up
        3: 'Selesai', // Incoming: Done
};

export const outgoingStatusMap: Record<string, { label: string, color: string }> = {
        '1': { label: 'Verifikasi Sekum', color: 'bg-yellow-100 text-yellow-800' },
        '2': { label: 'Perlu Perbaikan', color: 'bg-orange-100 text-orange-800' },
        '3': { label: 'Disetujui', color: 'bg-green-100 text-green-800' },
        '4': { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
};
