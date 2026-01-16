"use client";

import UserTable from "@/components/features/manage/users/user-table";
import { useUsers } from "@/hooks/features/user/use-users";

export default function UsersPage() {
    const { users, isLoading, refetch } = useUsers();

    return (
        <UserTable
            users={users}
            onUserUpdated={refetch}
            isLoading={isLoading}
        />
    );
}
