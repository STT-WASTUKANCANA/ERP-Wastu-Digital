"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getMailCategoryList, deleteMailCategory, MailCategory } from "@/lib/api/master/mail-category";
import { getMailCategoryColumns } from "./category-columns";
import { DataTable } from "@/components/shared/datatable";
import { PageHeader } from "@/components/shared/page-header";
import { TableContainer } from "@/components/shared/table-container";
import { Button } from "@/components/ui/button";

export default function CategoryTable() {
    const router = useRouter();
    const [categories, setCategories] = useState<MailCategory[]>([]);
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
            const res = await getMailCategoryList(undefined, search);
            if (res?.ok && res?.data?.status) {
                setCategories(res.data.data);
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
        return categories.slice(0, entries);
    }, [categories, entries]);

    const handleActionClick = async (e: React.MouseEvent, action: string, id: string) => {
        e.preventDefault();

        if (action === "Edit") {
            sessionStorage.setItem("editingCategoryId", id);
            router.push(`/workspace/master/mail-category/edit`);
        } else if (action === "Delete") {
            const confirmed = window.confirm("Hapus Kategori? Data yang dihapus tidak dapat dikembalikan.");

            if (confirmed) {
                try {
                    const res = await deleteMailCategory(id);
                    if (res?.data?.status) {
                        alert("Kategori berhasil dihapus");
                        fetchData();
                    } else {
                        alert(res?.data?.message || "Terjadi kesalahan");
                    }
                } catch (error) {
                    alert("Error menghubungi server");
                }
            }
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
                onEntriesChange={setEntries}
            >
                <DataTable
                    columns={columns}
                    data={paginatedData}
                    isLoading={loading}
                    emptyStateMessage="Belum ada kategori surat"
                />
            </TableContainer>
        </>
    );
}
