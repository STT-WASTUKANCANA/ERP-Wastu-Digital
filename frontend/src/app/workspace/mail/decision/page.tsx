import { RoleProvider } from "@/contexts/role";
import { getUserRoleId } from "@/lib/role";
import MailsClient from "../mails-client";

export default function OutgoingMailsPage() {
        const roleId = getUserRoleId();

        return (
                <RoleProvider roleId={roleId}>
                        <MailsClient />
                </RoleProvider>
        );
}