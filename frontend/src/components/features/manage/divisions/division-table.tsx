"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getDivisionList, deleteDivision } from "@/lib/api/manage/division";
import { Division } from "@/types/division-props";
import { getDivisionColumns } from "./division-column";
import { DataTable } from "@/components/shared/datatable";
import { PageHeader } from "@/components/shared/page-header";
import { TableContainer } from "@/components/shared/table-container";
import { Button } from "@/components/ui/button";
import { HiOutlineUpload } from "react-icons/hi";

export default function DivisionTable() {
    const router = useRouter();
    const [divisions, setDivisions] = useState<Division[]>([]);
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
            const res = await getDivisionList(search);
            if (res?.ok && res?.data?.status) {
                setDivisions(res.data.data);
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
        return divisions.slice(0, entries);
    }, [divisions, entries]);

    const handleActionClick = async (e: React.MouseEvent, action: string, id: string) => {
        e.preventDefault();

        if (action === "Edit") {
            sessionStorage.setItem("editingDivisionId", id);
            router.push(`/workspace/manage/division/edit`);
        } else if (action === "Delete") {
            const confirmed = window.confirm("Hapus Divisi? Data yang dihapus tidak dapat dikembalikan.");

            if (confirmed) {
                try {
                    const res = await deleteDivision(id);
                    if (res?.data?.status) {
                        alert("Divisi berhasil dihapus");
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

    const columns = useMemo(() => getDivisionColumns(handleActionClick), []);

    return (
        <>
            <PageHeader title="Manajemen Divisi" description="Kelola data divisi dan kepala bidang dengan efisien.">
                <Button className="text-foreground/70 text-sm cursor-pointer px-8 py-2 flex justify-center items-center gap-2 border border-secondary/20 bg-background">
                    <HiOutlineUpload />
                    <span>Export</span>
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
                onEntriesChange={setEntries}
            >
                <DataTable
                    columns={columns}
                    data={paginatedData}
                    isLoading={loading}
                    emptyStateMessage="Belum ada data divisi"
                />
            </TableContainer>
        </>
    );
}
