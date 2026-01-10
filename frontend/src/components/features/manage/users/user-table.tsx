"use client";

import { useMemo, MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TableContainer } from "@/components/shared/table-container";
import { DataTable } from "@/components/shared/datatable";
import { UserTableProps } from "@/types/user-props";
import { getUserColumns } from "./column";
import { deleteUser } from "@/lib/api/manage/users";
import { HiOutlineUpload } from "react-icons/hi";

const UserTable = ({ users, onUserUpdated, isLoading }: UserTableProps) => {
    const router = useRouter();

    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

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
                    onUserUpdated();
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

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * entries;
        const end = start + entries;
        return users.slice(start, end);
    }, [users, entries, currentPage]);

    const handleEntriesChange = (value: number) => {
        setEntries(value);
        setCurrentPage(1);
    };

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
                onSearchChange={(v) => console.log(v)}
                onEntriesChange={handleEntriesChange}
                page={currentPage}
                total={users.length}
                pageSize={entries}
                onPageChange={setCurrentPage}
            >
                <DataTable
                    columns={columns}
                    data={paginatedData}
                    emptyStateMessage="Tidak ada data pengguna."
                    isLoading={isLoading}
                />
            </TableContainer>
        </>
    );
};

export default UserTable;
