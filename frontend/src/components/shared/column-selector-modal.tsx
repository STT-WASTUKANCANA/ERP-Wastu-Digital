"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { showAlert } from "@/lib/sweetalert";
// Checking if Checkbox exists first is better, but for now I'll use standard input type="checkbox" styled with Tailwind if specific component missing, 
// OR I check for Checkbox component. 
// Let's assume standard input for reliability or check first? 
// I'll stick to standard input with tailwind for now to avoid blocking, or check `components/ui` quickly.
// Actually, looking at previous file lists, I didn't see Checkbox. 
// I will use standard HTML input for now to be safe, styled nicely.

interface ColumnSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    columns: { key: string; label: string }[];
    hiddenColumns: string[];
    mandatoryColumns?: string[];
    onSave: (hiddenColumns: string[]) => void;
}

export const ColumnSelectorModal = ({
    isOpen,
    onClose,
    columns,
    hiddenColumns,
    mandatoryColumns = [],
    onSave,
}: ColumnSelectorModalProps) => {
    const [tempHidden, setTempHidden] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Ensure mandatory columns are NOT in the hidden list when opening
            const cleanedHidden = hiddenColumns.filter(key => !mandatoryColumns.includes(key));
            setTempHidden(cleanedHidden);
        }
    }, [isOpen, hiddenColumns, mandatoryColumns]);

    const handleToggle = (key: string) => {
        if (mandatoryColumns.includes(key)) return;

        setTempHidden((prev) => {
            if (prev.includes(key)) {
                return prev.filter((k) => k !== key); // Unhide (Show)
            } else {
                return [...prev, key]; // Hide
            }
        });
    };

    const handleSave = () => {
        // Validation: Ensure at least one column is visible
        if (tempHidden.length === columns.length) {
            showAlert("warning", "Minimal satu kolom harus ditampilkan.", "Silakan pilih setidaknya satu kolom untuk ditampilkan pada tabel.");
            return;
        }
        onSave(tempHidden);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Atur Kolom Tabel"
            size="lg"
            footer={
                <Button onClick={handleSave} className="bg-primary text-background px-4 py-2 text-sm">Simpan</Button>
            }
        >
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <p className="text-sm text-muted-foreground">
                    Pilih kolom yang ingin ditampilkan pada tabel.
                </p>
                <div className="space-y-2">
                    {columns.map((col) => {
                        const isMandatory = mandatoryColumns.includes(col.key);
                        const isHidden = tempHidden.includes(col.key);
                        const isChecked = !isHidden;

                        return (
                            <label
                                key={col.key}
                                className={`flex items-center space-x-3 p-2 rounded cursor-pointer border border-transparent transition-colors ${isMandatory ? "opacity-70 cursor-not-allowed" : "hover:bg-muted/50 hover:border-secondary/10"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50"
                                    checked={isChecked}
                                    onChange={() => handleToggle(col.key)}
                                    disabled={isMandatory}
                                />
                                <span className="text-sm font-medium text-foreground">
                                    {col.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};
