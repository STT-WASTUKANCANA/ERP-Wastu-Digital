import { MailTableProps } from "./common";

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

export type DecisionMailTableProps = MailTableProps<DecisionMail>;

export interface DecisionOffcanvasDetailProps {
    mail: DecisionMail;
    onClose: () => void;
    onAction: (e: React.MouseEvent, action: string, mailId: string) => void | Promise<void>;
}
