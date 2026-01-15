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

import { User } from "@/types/user-props";
import { UserOffcanvasDetail } from "./offcanvas-detail";

import { ColumnSelectorModal } from "@/components/shared/column-selector-modal";

const UserTable = ({ users, onUserUpdated, isLoading }: UserTableProps) => {
    const router = useRouter();

    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [showColumnModal, setShowColumnModal] = useState(false);

    const handleActionClick = async (e: MouseEvent, action: string, userId: string) => {
        e?.stopPropagation();

        if (action === "Edit") {
            sessionStorage.setItem(`editingUserId`, userId);
            router.push(`/workspace/manage/user/edit`);
            setSelectedUser(null);
            return;
        }

        if (action === "Delete") {
            if (confirm("Yakin ingin menghapus user ini?")) {
                try {
                    await deleteUser(Number(userId));
                    onUserUpdated();
                    setSelectedUser(null);
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

    const visibleColumns = useMemo(() => {
        return columns.filter((col) => {
            const key = (col.accessorKey || col.id || col.header) as string;
            return !hiddenColumns.includes(key);
        });
    }, [columns, hiddenColumns]);

    const allColumnsForModal = useMemo(() => {
        return columns.map(col => ({
            key: (col.accessorKey || col.id || col.header) as string,
            label: (col.header as string) || "Aksi"
        })).filter(c => c.label !== "");
    }, [columns]);

    const handleSaveColumns = (newHidden: string[]) => {
        setHiddenColumns(newHidden);
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lower = searchTerm.toLowerCase();
        return users.filter((user) =>
            user.name.toLowerCase().includes(lower) ||
            user.email.toLowerCase().includes(lower) ||
            (user.role_name && user.role_name.toLowerCase().includes(lower)) ||
            (user.division_name && user.division_name.toLowerCase().includes(lower))
        );
    }, [users, searchTerm]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * entries;
        const end = start + entries;
        return filteredUsers.slice(start, end);
    }, [filteredUsers, entries, currentPage]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleEntriesChange = (value: number) => {
        setEntries(value);
        setCurrentPage(1);
    };

    const handleRowClick = (user: User) => {
        if (window.innerWidth < 1024) {
            setSelectedUser(user);
        }
    };

    return (
        <>
            <PageHeader
                title="Manajemen Pengguna"
                description="Kelola semua pengguna sistem dengan efisien."
            >
                <Button className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
                    <HiOutlineUpload />
                    <span>Ekspor</span>
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
                onModifyColumnClick={() => setShowColumnModal(true)}
                onEntriesChange={handleEntriesChange}
                page={currentPage}
                total={filteredUsers.length}
                pageSize={entries}
                onPageChange={setCurrentPage}
            >
                <DataTable
                    columns={visibleColumns}
                    data={paginatedData}
                    emptyStateMessage="Tidak ada data pengguna."
                    isLoading={isLoading}
                    onRowClick={handleRowClick}
                />
            </TableContainer>

            <ColumnSelectorModal
                isOpen={showColumnModal}
                onClose={() => setShowColumnModal(false)}
                columns={allColumnsForModal}
                hiddenColumns={hiddenColumns}
                mandatoryColumns={["name", "role_name"]}
                onSave={handleSaveColumns}
            />

            {selectedUser && (
                <UserOffcanvasDetail
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onAction={handleActionClick}
                />
            )}
        </>
    );
};

export default UserTable;
