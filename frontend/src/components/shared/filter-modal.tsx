"use client";

import { ReactNode, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { HiOutlineUpload } from "react-icons/hi";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
    onReset: () => void;
    onExport?: (type: 'excel' | 'pdf') => Promise<void>;
    children: ReactNode;
    title?: string;
}

export const FilterModal = ({
    isOpen,
    onClose,
    onApply,
    onReset,
    onExport,
    children,
    title = "Filter Data"
}: FilterModalProps) => {
    const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');
    const [isExporting, setIsExporting] = useState(false);

    const exportOptions = [
        { value: 'excel', label: 'Excel (.xlsx)' },
        { value: 'pdf', label: 'PDF (.pdf)' }
    ];

    const handleExport = async () => {
        if (!onExport) return;

        setIsExporting(true);
        try {
            await onExport(exportFormat);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="lg"
            footer={
                <div className="flex flex-col gap-4 w-full">
                    {/* Export Section */}
                    {onExport && (
                        <div className="flex items-end gap-2 pb-4 border-b border-secondary/20">
                            <div className="flex-1">
                                <SearchableSelect
                                    label="Format Export"
                                    options={exportOptions}
                                    value={exportFormat}
                                    onChange={(value) => setExportFormat(value as 'excel' | 'pdf')}
                                    placeholder="Pilih format"
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={handleExport}
                                disabled={isExporting}
                                className="bg-green-600 text-white px-4 py-2 text-sm rounded-md hover:bg-green-700 flex items-center gap-2"
                            >
                                <HiOutlineUpload />
                                {isExporting ? 'Mengexport...' : 'Export'}
                            </Button>
                        </div>
                    )}

                    {/* Filter Action Buttons */}
                    <div className="flex justify-end gap-2 w-full">
                        <Button
                            type="button"
                            onClick={onReset}
                            className="bg-background border border-zinc-200 text-foreground hover:bg-zinc-100 px-4 py-2 text-sm rounded-md"
                        >
                            Reset
                        </Button>
                        <Button
                            type="button"
                            onClick={onApply}
                            className="bg-primary text-background px-4 py-2 text-sm rounded-md hover:bg-primary/90"
                        >
                            Terapkan
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-4 py-2">
                {children}
            </div>
        </Modal>
    );
};
