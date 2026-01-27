"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Select } from "../ui/select";

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
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <div>
                    <Select
                        label="Jenis Surat"
                        name="mailType"
                        value={mailType}
                        onChange={(e) => setMailType(e.target.value)}
                    >
                        <option value="">Semua Jenis</option>
                        <option value="1">Surat Masuk</option>
                        <option value="2">Surat Keluar</option>
                        <option value="3">Surat Keputusan</option>
                    </Select>
                </div>

                <div>
                    <Select
                        label="Pilih Format Export"
                        name="exportType"
                        value={exportType}
                        onChange={(e) => setExportType(e.target.value as 'excel' | 'pdf')}
                    >
                        <option value="excel">Excel (.xlsx)</option>
                        <option value="pdf">PDF (.pdf)</option>
                    </Select>
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
