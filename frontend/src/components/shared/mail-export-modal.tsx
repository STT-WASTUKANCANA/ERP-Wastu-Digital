"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { SearchableSelect } from "../ui/searchable-select";

interface MailExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (type: 'excel' | 'pdf') => Promise<void>;
    title?: string;
}

export const MailExportModal: React.FC<MailExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    title = "Export Data"
}) => {
    const [exportType, setExportType] = useState<'excel' | 'pdf'>('excel');
    const [loading, setLoading] = useState(false);

    const exportTypeOptions = [
        { value: 'excel', label: 'Excel (.xlsx)' },
        { value: 'pdf', label: 'PDF (.pdf)' }
    ];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onExport(exportType);
            onClose();
        } catch (error) {
            console.error("Export error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
            <div className="space-y-4">
                <p className="text-sm text-foreground/70">
                    Data yang diexport akan mengikuti filter yang sedang aktif di tabel.
                </p>

                <div>
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
                        onClick={onClose}
                        className="px-4 py-2 bg-background border border-zinc-200 text-foreground hover:bg-zinc-100"
                    >
                        Batal
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
