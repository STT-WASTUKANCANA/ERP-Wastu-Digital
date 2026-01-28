"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getDivisionList, deleteDivision, updateDivision } from "@/lib/api/manage/division";
import { Division } from "@/types/features/division";
import { getDivisionColumns } from "./column";
import { DataTable } from "@/components/shared/datatable";
import { PageHeader } from "@/components/shared/page-header";
import { TableContainer } from "@/components/shared/table-container";
import { Button } from "@/components/ui/button";
import { HiOutlineUpload } from "react-icons/hi";
import { DataDetailSheet } from "@/components/shared/data-detail-sheet";
import { FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";

import { ColumnSelectorModal } from "@/components/shared/column-selector-modal";
import { showConfirm, showToast } from "@/lib/sweetalert";
import { DivisionExportModal, DivisionExportFilters } from "./division-export-modal";
import { exportDivision } from "@/lib/actions/manage-export";

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
    const [showExportModal, setShowExportModal] = useState(false);

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
            const confirmed = await showConfirm(
                "Hapus Divisi?",
                "Data yang dihapus tidak dapat dikembalikan."
            );

            if (confirmed.isConfirmed) {
                try {
                    const res = await deleteDivision(id);
                    if (res?.data?.status) {
                        showToast("success", "Divisi berhasil dihapus");
                        fetchData();
                        setSelectedDivision(null);
                    } else {
                        showToast("error", res?.data?.message || "Terjadi kesalahan");
                    }
                } catch (error) {
                    showToast("error", "Error menghubungi server");
                }
            }
        } else if (action === "Activate" || action === "Deactivate") {
            const isActivate = action === "Activate";
            const confirmMsg = isActivate ? "Aktifkan Divisi ini?" : "Nonaktifkan Divisi ini?";
            const confirmText = isActivate ? "Divisi akan dapat digunakan kembali." : "Divisi tidak akan muncul dalam pilihan.";

            const confirmed = await showConfirm(
                confirmMsg,
                confirmText
            );

            if (confirmed.isConfirmed) {
                try {
                    // Prepare data for update.
                    const item = originalData.find(d => String(d.id) === id);
                    if (!item) {
                        showToast("error", `Error: Item with ID ${id} not found in local data.`);
                        console.error('Item not found', { id, originalDataLength: originalData.length });
                    }
                    if (item) {
                        // Only send the active field
                        const payload: any = {
                            active: isActivate
                        };

                        const res = await updateDivision(id, payload);
                        if (res?.data?.status) {
                            showToast("success", `Divisi berhasil ${isActivate ? 'diaktifkan' : 'dinonaktifkan'}`);
                            fetchData();
                            // If sidebar/modal is open, close it or re-fetch?
                            // logic: fetchData updates list.
                        } else {
                            console.error("Update failed:", res);
                            showToast("error", res?.data?.message || "Gagal memperbarui status");
                        }
                    }
                } catch (error) {
                    console.error(error);
                    showToast("error", "Error updating status");
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

    const handleExport = async (format: 'excel' | 'pdf', filters: DivisionExportFilters) => {
        try {
            const result = await exportDivision(format, filters);

            const binaryString = atob(result.data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: result.contentType });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = result.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showToast('success', 'Data berhasil diexport');
        } catch (error: any) {
            console.error('Export failed:', error);
            showToast('error', `Export gagal: ${error.message || 'Unknown error'}`);
        }
    };

    return (
        <>
            <PageHeader title="Manajemen Divisi" description="Kelola data divisi dan kepala bidang dengan efisien.">
                <Button
                    onClick={() => setShowExportModal(true)}
                    className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background"
                >
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

            <DivisionExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={handleExport}
            />
        </>
    );
}
