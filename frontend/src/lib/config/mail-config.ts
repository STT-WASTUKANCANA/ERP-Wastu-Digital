import { getIncomingMailColumns } from "@/components/features/mails/incoming-mail/column";
import { getOutgoingMailColumns } from "@/components/features/mails/outgoing-mail/column";
import { deleteIncomingMail, getMailCategories as getIncomingCategories } from "@/lib/api/mails/incoming";
import { deleteOutgoingMail, getMailCategories as getOutgoingCategories } from "@/lib/api/mails/outgoing";
import { deleteDecisionMail, getMailCategories as getDecisionCategories } from "@/lib/api/mails/decision";
import { DataDetailAction, ColumnDef } from "@/types/shared/ui";
import { getDecisionMailColumns } from "@/components/features/mails/decision-mail/column";
import { FiEdit, FiTrash2, FiDownload } from "react-icons/fi";
import { BsEye } from "react-icons/bs";

export const mailConfig = {
        incoming: {
                title: "Surat Masuk",
                description: "Kelola semua surat masuk dengan efisien.",
                createPath: "/workspace/mail/incoming/create",
                editPath: "/workspace/mail/incoming/edit",
                reviewPath: "/workspace/mail/incoming/review",
                divisionReviewPath: "/workspace/mail/incoming/division-review",
                getColumns: (
                        handler: (e: any, action: string, id: string, roleId?: number) => void,
                        roleId: number | null,
                        userId: string | null
                ): ColumnDef<any>[] => getIncomingMailColumns(handler, roleId, userId),
                delete: (id: number) => deleteIncomingMail(id),
                getCategories: () => getIncomingCategories(),
                getActions: (
                        mail: any,
                        roleId: number | null,
                        userId: string | null,
                        handler: (e: any, action: string, id: string) => void
                ): DataDetailAction[] => {
                        const isCreator = String(mail.user_id) === String(userId);
                        const showReview = roleId === 2 && (mail.status == 1 || mail.status == 2);
                        const showDivisionReview = roleId === 4 && (mail.follow_status == 1 || mail.follow_status == 2);
                        const canEdit = !showReview && (roleId === 1 && mail.status == 1);
                        const canDelete = mail.status == 1 && isCreator;

                        const actions: DataDetailAction[] = [];

                        if (showReview) {
                                actions.push({
                                        label: "Review",
                                        onClick: (e) => handler(e, "Review", String(mail.id)),
                                        icon: mail.status == 2 ? FiEdit : BsEye,
                                        variant: "primary"
                                });
                        }

                        if (showDivisionReview) {
                                actions.push({
                                        label: "Division Review",
                                        onClick: (e) => handler(e, "Division Review", String(mail.id)),
                                        icon: mail.follow_status == 2 ? FiEdit : BsEye,
                                        variant: "primary"
                                });
                        }

                        if (canEdit) {
                                actions.push({
                                        label: "Edit",
                                        onClick: (e) => handler(e, "Edit", String(mail.id)),
                                        icon: FiEdit,
                                        variant: "primary"
                                });
                        }

                        if (canDelete) {
                                actions.push({
                                        label: "Delete",
                                        onClick: (e) => handler(e, "Delete", String(mail.id)),
                                        icon: FiTrash2,
                                        variant: "danger"
                                });
                        }

                        return actions;
                },
        },

        outgoing: {
                title: "Surat Keluar",
                description: "Kelola semua surat keluar dengan efisien.",
                createPath: "/workspace/mail/outgoing/create",
                editPath: "/workspace/mail/outgoing/edit",
                reviewPath: "/workspace/mail/outgoing/review",
                divisionReviewPath: "/workspace/mail/outgoing/division-review",
                getColumns: (
                        handler: (e: any, action: string, id: string, roleId?: number) => void,
                        roleId: number | null,
                        userId: string | null
                ): ColumnDef<any>[] => getOutgoingMailColumns(handler, roleId, userId),
                delete: (id: number) => deleteOutgoingMail(id),
                getCategories: () => getOutgoingCategories(),
                getActions: (
                        mail: any,
                        roleId: number | null,
                        userId: string | null,
                        handler: (e: any, action: string, id: string) => void
                ): DataDetailAction[] => {
                        const isSekum = roleId === 2;
                        const isVerificationNeeded = String(mail.status) === '1';
                        const isCreator = String(mail.user_id) === String(userId);

                        // Sekum verification view (treated as Review/Edit action)
                        const showVerificationView = isSekum && isVerificationNeeded;
                        const showEdit = isSekum ? !isVerificationNeeded : isCreator;
                        const showDelete = isSekum || (isVerificationNeeded && isCreator);

                        const actions: DataDetailAction[] = [];

                        if (showVerificationView) {
                                actions.push({
                                        label: "Edit", // Using Edit label as per column logic
                                        onClick: (e) => handler(e, "Edit", String(mail.id)),
                                        icon: BsEye, // Eye icon for verification
                                        variant: "primary"
                                });
                        } else if (showEdit) {
                                actions.push({
                                        label: "Edit",
                                        onClick: (e) => handler(e, "Edit", String(mail.id)),
                                        icon: FiEdit,
                                        variant: "primary"
                                });
                        }

                        if (showDelete) {
                                actions.push({
                                        label: "Delete",
                                        onClick: (e) => handler(e, "Delete", String(mail.id)),
                                        icon: FiTrash2,
                                        variant: "danger"
                                });
                        }

                        return actions;
                },
        },

        decision: {
                title: "Surat Keputusan",
                description: "Kelola semua surat keputusan dengan efisien.",
                createPath: "/workspace/mail/decision/create",
                editPath: "/workspace/mail/decision/edit",
                reviewPath: "/workspace/mail/decision/review",
                divisionReviewPath: "/workspace/mail/decision/division-review",
                getColumns: (
                        handler: (e: any, action: string, id: string, roleId?: number) => void,
                        roleId: number | null,
                        userId: string | null
                ): ColumnDef<any>[] => getDecisionMailColumns(handler, roleId, userId),
                delete: (id: number) => deleteDecisionMail(id),
                getCategories: () => getDecisionCategories(),
                getActions: (
                        mail: any,
                        roleId: number | null,
                        userId: string | null,
                        handler: (e: any, action: string, id: string) => void
                ): DataDetailAction[] => {
                        const isCreator = String(mail.user_id) === String(userId);
                        const canEdit = roleId === 2 || (roleId === 3 && isCreator);

                        const actions: DataDetailAction[] = [];

                        if (canEdit) {
                                actions.push({
                                        label: "Edit",
                                        onClick: (e) => handler(e, "Edit", String(mail.id)),
                                        icon: FiEdit,
                                        variant: "primary"
                                });
                        }

                        if (isCreator) {
                                actions.push({
                                        label: "Delete",
                                        onClick: (e) => handler(e, "Delete", String(mail.id)),
                                        icon: FiTrash2,
                                        variant: "danger"
                                });
                        }

                        return actions;
                },
        },
};
