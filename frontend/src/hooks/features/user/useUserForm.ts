"use client";

import { useState, useEffect } from "react";
import { detailUser } from "@/lib/api/master/users";
import { getRoleList } from "@/lib/api/master/role";
import { getDivisionList } from "@/lib/api/master/division";
import { Role, Division, User } from "@/types/user-props";

interface UseUserFormOptions {
    userId?: string | null;
    isEdit?: boolean;
}

export function useUserForm({ userId, isEdit = false }: UseUserFormOptions = {}) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const promises: Promise<any>[] = [getRoleList(), getDivisionList()];

                if (isEdit && userId) {
                    promises.push(detailUser(Number(userId)));
                }

                const [rolesRes, divisionsRes, userRes] = await Promise.all(promises);

                setRoles(rolesRes.data?.data || rolesRes.data || []);
                setDivisions(divisionsRes.data?.data || divisionsRes.data || []);

                if (userRes) {
                    setUser(userRes.data?.data || userRes.data || null);
                }
            } catch (error) {
                console.error("Failed to fetch form data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId, isEdit]);

    return { roles, divisions, user, isLoading };
}
