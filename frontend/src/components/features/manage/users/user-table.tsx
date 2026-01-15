"use client";

import { useMemo, MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TableContainer } from "@/components/shared/table-container";
import { DataTable } from "@/components/shared/datatable";
import { UserTableProps, User } from "@/types/user-props";
import { getUserColumns } from "./column";
import { deleteUser } from "@/lib/api/manage/users";
import { HiOutlineUpload } from "react-icons/hi";

import { DataDetailSheet } from "@/components/shared/data-detail-sheet";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import { ColumnSelectorModal } from "@/components/shared/column-selector-modal";
import { FilterModal } from "@/components/shared/filter-modal";
import { Select } from "@/components/ui/select";

const UserTable = ({ users, onUserUpdated, isLoading }: UserTableProps) => {
    const router = useRouter();

    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [showColumnModal, setShowColumnModal] = useState(false);

    // State untuk filter
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedDivision, setSelectedDivision] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);

    // State sementara untuk modal filter
    const [modalRole, setModalRole] = useState("");
    const [modalDivision, setModalDivision] = useState("");

    // Penanganan aksi tombol (Edit/Delete)
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
        let data = users;

        // Pencarian
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            data = data.filter((user) =>
                user.name.toLowerCase().includes(lower) ||
                user.email.toLowerCase().includes(lower) ||
                (user.role_name && user.role_name.toLowerCase().includes(lower)) ||
                (user.division_name && user.division_name.toLowerCase().includes(lower))
            );
        }

        // Filter berdasarkan Role
        if (selectedRole) {
            data = data.filter(user => user.role_name === selectedRole);
        }

        // Filter berdasarkan Divisi
        if (selectedDivision) {
            data = data.filter(user => user.division_name === selectedDivision);
        }

        return data;
    }, [users, searchTerm, selectedRole, selectedDivision]);

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

    // Opsi dan penanganan filter
    const roleOptions = useMemo(() => {
        const unique = new Set(users.map(u => u.role_name).filter(Boolean));
        return Array.from(unique).map(r => ({ label: r as string, value: r as string }));
    }, [users]);

    const divisionOptions = useMemo(() => {
        const unique = new Set(users.map(u => u.division_name).filter(Boolean));
        return Array.from(unique).map(d => ({ label: d as string, value: d as string }));
    }, [users]);

    const handleOpenFilter = () => {
        setModalRole(selectedRole);
        setModalDivision(selectedDivision);
        setShowFilterModal(true);
    };

    const handleApplyFilter = () => {
        setSelectedRole(modalRole);
        setSelectedDivision(modalDivision);
        setShowFilterModal(false);
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setModalRole("");
        setModalDivision("");
        setSelectedRole("");
        setSelectedDivision("");
        setShowFilterModal(false);
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
                onFilterClick={handleOpenFilter}
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

            <FilterModal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
                title="Filter Pengguna"
            >
                <div className="flex flex-col gap-4">
                    <Select
                        label="Role"
                        placeholder="Semua Role"
                        options={roleOptions}
                        value={modalRole}
                        onChange={(e) => setModalRole(e.target.value)}
                    />
                    <Select
                        label="Divisi"
                        placeholder="Semua Divisi"
                        options={divisionOptions}
                        value={modalDivision}
                        onChange={(e) => setModalDivision(e.target.value)}
                    />
                </div>
            </FilterModal>

            <ColumnSelectorModal
                isOpen={showColumnModal}
                onClose={() => setShowColumnModal(false)}
                columns={allColumnsForModal}
                hiddenColumns={hiddenColumns}
                mandatoryColumns={["name", "role_name"]}
                onSave={handleSaveColumns}
            />

            {selectedUser && (
                <DataDetailSheet
                    title="Detail Pengguna"
                    onClose={() => setSelectedUser(null)}
                    items={[
                        { label: "Nama", value: selectedUser.name },
                        { label: "Email", value: selectedUser.email },
                        { label: "Role", value: selectedUser.role_name || 'Administrator' },
                        { label: "Divisi", value: selectedUser.division_name || '-' },
                    ]}
                    actions={[
                        { label: "Edit", onClick: (e) => handleActionClick(e, 'Edit', String(selectedUser.id)), variant: 'primary', icon: FiEdit },
                        { label: "Hapus", onClick: (e) => handleActionClick(e, 'Delete', String(selectedUser.id)), variant: 'danger', icon: FiTrash2 }
                    ]}
                />
            )}
        </>
    );
};

export default UserTable;
