"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { SearchableSelect } from "../ui/searchable-select";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { showToast } from "@/lib/sweetalert";

export interface MailExportFilters {
    category_id?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
    view_status?: string;
    destination?: string;
}

interface MailExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (type: 'excel' | 'pdf', filters: MailExportFilters) => Promise<void>;
    type: "incoming" | "outgoing" | "decision";
    categories: { label: string; value: string }[];
    title?: string;
}

export const MailExportModal: React.FC<MailExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    type,
    categories,
    title = "Export Data"
}) => {
    const [exportType, setExportType] = useState<'excel' | 'pdf'>('excel');
    const [loading, setLoading] = useState(false);

    // Filter States
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [status, setStatus] = useState("");
    const [viewStatus, setViewStatus] = useState("");
    const [destination, setDestination] = useState("");

    const exportTypeOptions = [
        { value: 'excel', label: 'Excel (.xlsx)' },
        { value: 'pdf', label: 'PDF (.pdf)' }
    ];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const filters: MailExportFilters = {
                category_id: selectedCategory || undefined,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
                status: status || undefined,
                view_status: viewStatus || undefined,
                destination: destination || undefined,
            };

            await onExport(exportType, filters);
            onClose();
        } catch (error) {
            console.error("Export error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setSelectedCategory("");
        setStatus("");
        setViewStatus("");
        setDestination("");
        setExportType("excel");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Tanggal Awal</label>
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Tanggal Akhir</label>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>

                <Select
                    label="Kategori"
                    options={categories}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    placeholder="Semua Kategori"
                />

                {type === 'incoming' && (
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Status"
                            options={[
                                { label: 'Peninjauan', value: '1' },
                                { label: 'Disposisi', value: '2' },
                                { label: 'Selesai', value: '3' },
                            ]}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            placeholder="Semua Status"
                        />
                        <Select
                            label="Status Dilihat"
                            options={[
                                { label: 'Sudah Dilihat', value: '1' },
                                { label: 'Belum Dilihat', value: '0' },
                            ]}
                            value={viewStatus}
                            onChange={(e) => setViewStatus(e.target.value)}
                            placeholder="Semua Status Dilihat"
                        />
                    </div>
                )}

                {type === 'outgoing' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Instansi Tujuan</label>
                            <Input
                                placeholder="Contoh: Dinas Kesehatan"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                        <Select
                            label="Status"
                            options={[
                                { label: 'Verifikasi Sekum', value: '1' },
                                { label: 'Perlu Perbaikan', value: '2' },
                                { label: 'Disetujui', value: '3' },
                                { label: 'Ditolak', value: '4' },
                            ]}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            placeholder="Semua Status"
                        />
                    </div>
                )}

                <div className="pt-4 border-t border-secondary/20">
                    <SearchableSelect
                        label="Pilih Format Export"
                        options={exportTypeOptions}
                        value={exportType}
                        onChange={(value) => setExportType(value as 'excel' | 'pdf')}
                        placeholder="Pilih format"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        onClick={handleReset}
                        className="px-4 py-2 bg-background border border-zinc-200 text-foreground hover:bg-zinc-100"
                    >
                        Reset Filter
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-primary text-white"
                        disabled={loading}
                    >
                        {loading ? "Mengexport..." : "Export"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
