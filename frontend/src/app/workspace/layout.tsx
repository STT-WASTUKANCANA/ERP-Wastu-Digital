import { getUserData } from "@/lib/role";
import ClientLayout from "./client-layout";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
        const user = await getUserData();
        return <ClientLayout user={user}>{children}</ClientLayout>;
}
