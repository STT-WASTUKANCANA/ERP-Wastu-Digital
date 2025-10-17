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