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
        status: string;
        date: string;
        attachment: string;
};
export interface IncomingCreateModalProps {
        isOpen: boolean;
        onClose: () => void;
        onSuccess: () => void;
}

export interface IncomingMailTableProps {
        incomingMails: IncomingMail[];
        onMailCreated: () => void;
        isLoading: boolean;
}

export interface IncomingOffcanvasDetailProps {
  mail: IncomingMail;
  onClose: () => void;
  onAction: (e: React.MouseEvent, action: string, mailId: string) => void | Promise<void>;
}