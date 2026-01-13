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

export default function CategoryTable() {
    const router = useRouter();
    const [originalData, setOriginalData] = useState<MailCategory[]>([]);
    const [filteredData, setFilteredData] = useState<MailCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<MailCategory | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getMailCategoryList();
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

    const handleSearch = (term: string) => {
        if (!term) {
            setFilteredData(originalData);
            return;
        }
        const lower = term.toLowerCase();
        const filtered = originalData.filter(
            (item) =>
                item.name.toLowerCase().includes(lower) ||
                item.type_label.toLowerCase().includes(lower)
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

    const handleActionClick = async (e: React.MouseEvent, action: string, id: string) => {
        e?.preventDefault();
        e?.stopPropagation(); // Prevent row click

        if (action === "Edit") {
            sessionStorage.setItem("editingCategoryId", id);
            router.push(`/workspace/master/mail-category/edit`);
            setSelectedCategory(null); // Close offcanvas
        } else if (action === "Delete") {
            const confirmed = window.confirm("Hapus Kategori? Data yang dihapus tidak dapat dikembalikan.");

            if (confirmed) {
                try {
                    const res = await deleteMailCategory(id);
                    if (res?.data?.status) {
                        alert("Kategori berhasil dihapus");
                        fetchData();
                        setSelectedCategory(null); // Close offcanvas
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

    return (
        <>
            <PageHeader title="Master Kategori Surat" description="Kelola kategori surat masuk, keluar, dan keputusan.">
                <Button
                    className="bg-primary text-background text-sm px-4 py-2"
                    onClick={() => router.push("/workspace/master/mail-category/create")}
                >
                    +
                </Button>
            </PageHeader>

            <TableContainer
                onSearchChange={handleSearch}
                onEntriesChange={handleEntriesChange}
                page={currentPage}
                total={filteredData.length}
                pageSize={entries}
                onPageChange={setCurrentPage}
            >
                <DataTable
                    columns={columns}
                    data={paginatedData}
                    isLoading={loading}
                    emptyStateMessage="Belum ada kategori surat"
                    onRowClick={handleRowClick}
                />
            </TableContainer>

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
