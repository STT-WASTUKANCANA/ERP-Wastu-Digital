import { getIncomingMailColumns } from "@/components/features/mails/incoming-mail/column";
import { getOutgoingMailColumns } from "@/components/features/mails/outgoing-mail/column";
import { deleteIncomingMail, getMailCategories as getIncomingCategories } from "@/lib/api/mails/incoming";
import { deleteOutgoingMail, getMailCategories as getOutgoingCategories } from "@/lib/api/mails/outgoing";
import { deleteDecisionMail, getMailCategories as getDecisionCategories } from "@/lib/api/mails/decision";
import { ColumnDef } from "@/types/ui-props";
import { getDecisionMailColumns } from "@/components/features/mails/decision-mail/column";

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
        },
};
