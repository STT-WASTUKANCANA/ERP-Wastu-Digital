"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserList } from "@/lib/api/manage/users";
import { User } from "@/types/user-props";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getUserList();

            const userData = response.data?.data || [];

            setUsers(Array.isArray(userData) ? userData : []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return { users, isLoading, refetch: fetchUsers };
}
