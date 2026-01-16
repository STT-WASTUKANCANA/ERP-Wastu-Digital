"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getDivisionList, deleteDivision, updateDivision } from "@/lib/api/manage/division";
import { Division } from "@/types/division-props";
import { getDivisionColumns } from "./column";
import { DataTable } from "@/components/shared/datatable";
import { PageHeader } from "@/components/shared/page-header";
import { TableContainer } from "@/components/shared/table-container";
import { Button } from "@/components/ui/button";
import { HiOutlineUpload } from "react-icons/hi";
import { DataDetailSheet } from "@/components/shared/data-detail-sheet";
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";

import { ColumnSelectorModal } from "@/components/shared/column-selector-modal";

export default function DivisionTable() {
    const router = useRouter();
    const [originalData, setOriginalData] = useState<Division[]>([]);
    const [filteredData, setFilteredData] = useState<Division[]>([]);
    const [loading, setLoading] = useState(true);

    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);

    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [showColumnModal, setShowColumnModal] = useState(false);

    // Ambil data divisi dari API
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getDivisionList();
            if (res?.ok && res?.data?.status) {
                setOriginalData(res.data.data);
                setFilteredData(res.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Pencarian sisi klien (local filtering)
    const handleSearch = (term: string) => {
        if (!term) {
            setFilteredData(originalData);
            return;
        }
        const lower = term.toLowerCase();
        const filtered = originalData.filter(
            (item) =>
                item.name.toLowerCase().includes(lower) ||
                (item.leader_name && item.leader_name.toLowerCase().includes(lower))
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * entries;
        const end = start + entries;
        return filteredData.slice(start, end);
    }, [filteredData, entries, currentPage]);

    const handleEntriesChange = (value: number) => {
        setEntries(value);
        setCurrentPage(1);
    };

    // Penanganan aksi tombol (Edit/Delete)
    const handleActionClick = async (e: React.MouseEvent, action: string, id: string) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (action === "Edit") {
            sessionStorage.setItem("editingDivisionId", id);
            router.push(`/workspace/manage/division/edit`);
            setSelectedDivision(null);
        } else if (action === "Delete") {
            const confirmed = window.confirm("Hapus Divisi? Data yang dihapus tidak dapat dikembalikan.");

            if (confirmed) {
                try {
                    const res = await deleteDivision(id);
                    if (res?.data?.status) {
                        alert("Divisi berhasil dihapus");
                        fetchData();
                        setSelectedDivision(null);
                    } else {
                        alert(res?.data?.message || "Terjadi kesalahan");
                    }
                } catch (error) {
                    alert("Error menghubungi server");
                }
            }
        } else if (action === "Activate" || action === "Deactivate") {
            const isActivate = action === "Activate";
            const confirmMsg = isActivate ? "Aktifkan Divisi ini?" : "Nonaktifkan Divisi ini?";

            if (window.confirm(confirmMsg)) {
                try {
                    // Prepare data for update. Ideally we should fetch full data first or just send partial if allowed.
                    // Assuming we need to send full body or at least required fields.
                    // Since we don't have full data here easily without fetching, 
                    // and update usually requires full body validation in this app's pattern,
                    // let's try to find the item in local state first.
                    const item = originalData.find(d => String(d.id) === id);
                    if (!item) {
                        alert(`Error: Item with ID ${id} not found in local data.`);
                        console.error('Item not found', { id, originalDataLength: originalData.length });
                    }
                    if (item) {
                        // Only send the active field to avoid validation errors on other fields (e.g. leader_id)
                        const payload: any = {
                            active: isActivate
                        };

                        // alert(`Debug: Updating ID ${id} to active=${isActivate}`);

                        const res = await updateDivision(id, payload);
                        if (res?.data?.status) {
                            alert(`Divisi berhasil ${isActivate ? 'diaktifkan' : 'dinonaktifkan'}`);
                            fetchData();
                        } else {
                            console.error("Update failed:", res);
                            alert(res?.data?.message || "Gagal memperbarui status");
                        }
                    }
                } catch (error) {
                    console.error(error);
                    alert("Error updating status");
                }
            }
        }
    };

    const handleRowClick = (item: Division) => {
        if (window.innerWidth < 1024) {
            setSelectedDivision(item);
        }
    };

    const columns = useMemo(() => getDivisionColumns(handleActionClick), [handleActionClick]);

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

    return (
        <>
            <PageHeader title="Manajemen Divisi" description="Kelola data divisi dan kepala bidang dengan efisien.">
                <Button className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
                    <HiOutlineUpload />
                    <span>Ekspor</span>
                </Button>

                <Button
                    className="bg-primary text-background text-sm px-4 py-2"
                    onClick={() => router.push("/workspace/manage/division/create")}
                >
                    +
                </Button>
            </PageHeader>

            <TableContainer
                onSearchChange={handleSearch}
                onModifyColumnClick={() => setShowColumnModal(true)}
                onEntriesChange={handleEntriesChange}
                page={currentPage}
                total={filteredData.length}
                pageSize={entries}
                onPageChange={setCurrentPage}
            >
                <DataTable
                    columns={visibleColumns}
                    data={paginatedData}
                    isLoading={loading}
                    emptyStateMessage="Belum ada data divisi"
                    onRowClick={handleRowClick}
                />
            </TableContainer>

            <ColumnSelectorModal
                isOpen={showColumnModal}
                onClose={() => setShowColumnModal(false)}
                columns={allColumnsForModal}
                hiddenColumns={hiddenColumns}
                mandatoryColumns={["name", "leader_name"]}
                onSave={handleSaveColumns}
            />

            {selectedDivision && (
                <DataDetailSheet
                    title="Detail Divisi"
                    onClose={() => setSelectedDivision(null)}
                    items={[
                        { label: "Nama Divisi", value: selectedDivision.name },
                        {
                            label: "Kepala Bidang",
                            value: selectedDivision.leader_name || <span className="text-gray-400 italic">Belum ditentukan</span>
                        },
                        { label: "Deskripsi", value: selectedDivision.description || "-" },
                        {
                            label: "Status",
                            value: (selectedDivision.active === 1 || selectedDivision.active === true)
                                ? <span className="text-emerald-600 font-bold">Aktif</span>
                                : <span className="text-red-600 font-bold">Nonaktif</span>
                        }
                    ]}
                    actions={[
                        { label: "Edit", onClick: (e) => handleActionClick(e, 'Edit', String(selectedDivision.id)), variant: 'primary', icon: FiEdit },

                        // Condition for Activate
                        ...((selectedDivision.active === 0 || selectedDivision.active === false) ? [{
                            label: "Aktifkan",
                            onClick: (e: any) => handleActionClick(e, 'Activate', String(selectedDivision.id)),
                            variant: 'outline' as const,
                            icon: FiCheckCircle
                        }] : []),

                        // Condition for Deactivate
                        ...((selectedDivision.active === 1 || selectedDivision.active === true) ? [{
                            label: "Nonaktifkan",
                            onClick: (e: any) => handleActionClick(e, 'Deactivate', String(selectedDivision.id)),
                            variant: 'outline' as const,
                            icon: FiXCircle
                        }] : []),

                        { label: "Hapus", onClick: (e) => handleActionClick(e, 'Delete', String(selectedDivision.id)), variant: 'danger', icon: FiTrash2 }
                    ]}
                />
            )}
        </>
    );
}
