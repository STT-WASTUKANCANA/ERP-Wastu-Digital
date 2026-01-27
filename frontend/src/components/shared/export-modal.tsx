"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { SearchableSelect } from "../ui/searchable-select";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (type: 'excel' | 'pdf', mailType?: string) => Promise<void>;
    title?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    title = "Export Data"
}) => {
    const [exportType, setExportType] = useState<'excel' | 'pdf'>('excel');
    const [mailType, setMailType] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const mailTypeOptions = [
        { value: '', label: 'Semua Jenis' },
        { value: '1', label: 'Surat Masuk' },
        { value: '2', label: 'Surat Keluar' },
        { value: '3', label: 'Surat Keputusan' }
    ];

    const exportTypeOptions = [
        { value: 'excel', label: 'Excel (.xlsx)' },
        { value: 'pdf', label: 'PDF (.pdf)' }
    ];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onExport(exportType, mailType || undefined);
            onClose();
        } catch (error) {
            console.error("Export error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
            <div className="space-y-4">
                <div>
                    <SearchableSelect
                        label="Jenis Surat"
                        options={mailTypeOptions}
                        value={mailType}
                        onChange={(value) => setMailType(value)}
                        placeholder="Pilih jenis surat"
                    />
                </div>

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
                        onClick={handleSubmit}
                        color="bg-primary"
                        className="px-4 py-2 text-white"
                        disabled={loading}
                    >
                        {loading ? "Mengexport..." : "Export"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
