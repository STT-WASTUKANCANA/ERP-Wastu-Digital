import { RoleProvider } from "@/contexts/role";
import { getUserRoleId, getUserId } from "@/lib/role";
import MailsClient from "../mails-client";

export default async function OutgoingMailsPage() {
        const roleId = await getUserRoleId();
        const userId = await getUserId();

        return (
                <RoleProvider roleId={roleId} userId={userId}>
                        <MailsClient />
                </RoleProvider>
        );
}