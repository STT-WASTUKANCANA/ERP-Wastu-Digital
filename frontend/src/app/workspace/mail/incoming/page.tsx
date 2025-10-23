import { RoleProvider } from "@/contexts/role";
import { getUserRoleId } from "@/lib/role";
import IncomingMailsClient from "./incoming-mails-client";

export default function IncomingMailsPage() {
  const roleId = getUserRoleId();

  return (
    <RoleProvider roleId={roleId}>
      <IncomingMailsClient />
    </RoleProvider>
  );
}