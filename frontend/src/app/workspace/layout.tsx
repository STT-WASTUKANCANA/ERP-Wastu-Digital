import { getUserRoleId } from "@/lib/role";
import ClientLayout from "./client-layout";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
        const roleId = await getUserRoleId();
        return <ClientLayout roleId={roleId}>{children}</ClientLayout>;
}
