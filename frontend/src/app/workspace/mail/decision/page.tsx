import { RoleProvider } from "@/contexts/role";
import { getUserRoleId } from "@/lib/role";
import MailsClient from "../mails-client";

export default async function DecisionMailsPage() {
        const roleId = await getUserRoleId();

        return (
                <RoleProvider roleId={roleId}>
                        <MailsClient />
                </RoleProvider>
        );
}