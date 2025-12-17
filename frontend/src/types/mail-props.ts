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
        status: number;
        follow_status: number;
        date: string;
        attachment: string;
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
        1: 'Peninjauan',
        2: 'Disposisi',
        3: 'Selesai',
};
