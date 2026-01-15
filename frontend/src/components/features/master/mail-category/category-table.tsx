"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getMailCategoryList, deleteMailCategory, MailCategory } from "@/lib/api/master/mail-category";
import { getMailCategoryColumns } from "./category-columns";
import { DataTable } from "@/components/shared/datatable";
import { PageHeader } from "@/components/shared/page-header";
import { TableContainer } from "@/components/shared/table-container";
import { Button } from "@/components/ui/button";

import { CategoryOffcanvasDetail } from "./offcanvas-detail";
import { HiOutlineUpload } from "react-icons/hi";

import { ColumnSelectorModal } from "@/components/shared/column-selector-modal";
import { FilterModal } from "@/components/shared/filter-modal";
import { Select } from "@/components/ui/select";

export default function CategoryTable() {
    const router = useRouter();
    const [filteredData, setFilteredData] = useState<MailCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<MailCategory | null>(null);

    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [showColumnModal, setShowColumnModal] = useState(false);

    // Filter States
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [selectedType, setSelectedType] = useState(""); // Active filter
    const [modalType, setModalType] = useState(""); // Temp modal state

    // Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch Data (Server Side Filtering)
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getMailCategoryList(selectedType, debouncedTerm);
            if (res?.ok && res?.data) {
                // API returns { status: true, data: [...] }
                const items = res.data.data || [];
                setFilteredData(items);
            } else {
                setFilteredData([]);
            }
        } catch (error) {
            console.error(error);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setCurrentPage(1); // Reset page on filter change
    }, [debouncedTerm, selectedType]);

    // Client-side pagination of server filtered results
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * entries;
        const end = start + entries;
        return filteredData.slice(start, end);
    }, [filteredData, entries, currentPage]);

    const handleEntriesChange = (value: number) => {
        setEntries(value);
        setCurrentPage(1);
    };

    const handleActionClick = async (e: React.MouseEvent, action: string, id: string) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (action === "Edit") {
            sessionStorage.setItem("editingCategoryId", id);
            router.push(`/workspace/master/mail-category/edit`);
            setSelectedCategory(null);
        } else if (action === "Delete") {
            const confirmed = window.confirm("Hapus Kategori? Data yang dihapus tidak dapat dikembalikan.");

            if (confirmed) {
                try {
                    const res = await deleteMailCategory(id);
                    if (res?.data?.status) {
                        alert("Kategori berhasil dihapus");
                        fetchData();
                        setSelectedCategory(null);
                    } else {
                        alert(res?.data?.message || "Terjadi kesalahan");
                    }
                } catch (error) {
                    alert("Error menghubungi server");
                }
            }
        }
    };

    const handleRowClick = (item: MailCategory) => {
        if (window.innerWidth < 1024) {
            setSelectedCategory(item);
        }
    };

    const columns = useMemo(() => getMailCategoryColumns(handleActionClick), []);

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

    // Filter Handlers
    const typeOptions = useMemo(() => [
        { label: "Surat Masuk", value: "1" },
        { label: "Surat Keluar", value: "2" },
        { label: "Surat Keputusan", value: "3" },
    ], []);

    const handleOpenFilter = () => {
        setModalType(selectedType);
        setShowFilterModal(true);
    };

    const handleApplyFilter = () => {
        setSelectedType(modalType);
        setShowFilterModal(false);
    };

    const handleResetFilter = () => {
        setModalType("");
        setSelectedType("");
        setShowFilterModal(false);
    };

    return (
        <>
            <PageHeader title="Kategori Surat" description="Kelola kategori surat masuk, keluar, dan keputusan.">
                <Button className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
                    <HiOutlineUpload />
                    <span>Ekspor</span>
                </Button>
                <Button
                    className="bg-primary text-background text-sm px-4 py-2"
                    onClick={() => router.push("/workspace/master/mail-category/create")}
                >
                    +
                </Button>
            </PageHeader>

            <TableContainer
                onSearchChange={setSearchTerm}
                onModifyColumnClick={() => setShowColumnModal(true)}
                onFilterClick={handleOpenFilter}
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
                    emptyStateMessage="Belum ada kategori surat"
                    onRowClick={handleRowClick}
                />
            </TableContainer>

            <FilterModal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
                title="Filter Kategori"
            >
                <Select
                    label="Jenis Surat"
                    placeholder="Semua Jenis"
                    options={typeOptions}
                    value={modalType}
                    onChange={(e) => setModalType(e.target.value)}
                />
            </FilterModal>

            <ColumnSelectorModal
                isOpen={showColumnModal}
                onClose={() => setShowColumnModal(false)}
                columns={allColumnsForModal}
                hiddenColumns={hiddenColumns}
                mandatoryColumns={["name", "type_label"]}
                onSave={handleSaveColumns}
            />

            {selectedCategory && (
                <CategoryOffcanvasDetail
                    category={selectedCategory}
                    onClose={() => setSelectedCategory(null)}
                    onAction={handleActionClick}
                />
            )}
        </>
    );
}
