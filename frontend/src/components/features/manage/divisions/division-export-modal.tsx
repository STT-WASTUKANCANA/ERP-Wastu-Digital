"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";

export interface DivisionExportFilters {

    status?: string;
}

interface DivisionExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: 'excel', filters: DivisionExportFilters) => Promise<void>;
    title?: string;
}

export const DivisionExportModal: React.FC<DivisionExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    title = "Export Data Divisi"
}) => {
    const [loading, setLoading] = useState(false);

    // Filter States

    const [status, setStatus] = useState("");

    // Format is always excel for now based on Backend implementation using Maatwebsite
    // Only Excel is implemented in the backend controller (Excel::download)
    const exportFormat = 'excel';

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const filters: DivisionExportFilters = {
                status: status || undefined,
            };

            await onExport(exportFormat, filters);
            onClose();
        } catch (error) {
            console.error("Export error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {

        setStatus("");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
            <div className="space-y-4">


                <SearchableSelect
                    label="Status"
                    options={[
                        { label: 'Aktif', value: '1' },
                        { label: 'Nonaktif', value: '0' },
                    ]}
                    value={status}
                    onChange={(val) => setStatus(val)}
                    placeholder="Semua Status"
                />

                <div className="flex justify-end gap-2 pt-4 border-t border-secondary/20">
                    <Button
                        onClick={handleReset}
                        className="px-4 py-2 bg-background border border-zinc-200 text-foreground hover:bg-zinc-100"
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-primary text-white"
                        disabled={loading}
                    >
                        {loading ? "Mengexport..." : "Export Excel"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
