"use client";

import { useState, useEffect, useMemo, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TableContainer } from "@/components/shared/table-container";
import { DataTable } from "@/components/shared/datatable";
import { User } from "@/types/user-props";
import { getUserColumns } from "./column";
import { deleteUser, getUserList } from "@/lib/api/manage/users";
import { HiOutlineUpload } from "react-icons/hi";

const UserTable = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const fetchData = async (search: string = "") => {
        setLoading(true);
        try {
            const res = await getUserList(search); // Assuming getUserList returns response object
            if (res?.data?.data) { // Check structure based on getUserList return
                // getUserList returns the raw fetchWithAuth result. 
                // Usually { data: { data: [...] } } or similar based on backend.
                // UserService::all returns collection.
                // UserController::index returns Resource::collection.
                // So res.data.data is the array.
                const data = res.data.data || [];
                setUsers(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(debouncedSearchQuery);
    }, [debouncedSearchQuery]);

    const handleSearch = (term: string) => {
        setSearchQuery(term);
    };

    const paginatedData = useMemo(() => {
        return users.slice(0, entries);
    }, [users, entries]);

    const handleActionClick = async (e: MouseEvent, action: string, userId: string) => {
        e.stopPropagation();

        if (action === "Edit") {
            sessionStorage.setItem(`editingUserId`, userId);
            router.push(`/workspace/manage/user/edit`);
            return;
        }

        if (action === "Delete") {
            if (confirm("Yakin ingin menghapus user ini?")) {
                try {
                    await deleteUser(Number(userId));
                    fetchData(debouncedSearchQuery);
                } catch (error) {
                    console.error("Failed to delete user:", error);
                    alert("Gagal menghapus user");
                }
            }
        }
    };

    const columns = useMemo(
        () => getUserColumns(handleActionClick),
        []
    );

    return (
        <>
            <PageHeader
                title="Manajemen Pengguna"
                description="Kelola semua pengguna sistem dengan efisien."
            >
                <Button className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
                    <HiOutlineUpload />
                    <span>Export</span>
                </Button>
                <Button
                    className="bg-primary text-background text-sm px-4 py-2"
                    onClick={() => router.push("/workspace/manage/user/create")}
                >
                    +
                </Button>
            </PageHeader>

            <TableContainer
                onSearchChange={handleSearch}
                onEntriesChange={setEntries}
            >
                <DataTable
                    columns={columns}
                    data={paginatedData}
                    emptyStateMessage="Tidak ada data pengguna."
                    isLoading={loading}
                />
            </TableContainer>
        </>
    );
};

export default UserTable;
