"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";


export interface UserExportFilters {

    role?: string;
    division?: string;
}

interface UserExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: 'excel', filters: UserExportFilters) => Promise<void>;
    roles: { label: string; value: string }[];
    divisions: { label: string; value: string }[];
    title?: string;
}

export const UserExportModal: React.FC<UserExportModalProps> = ({
    isOpen,
    onClose,
    onExport,
    roles,
    divisions,
    title = "Export Data Pengguna"
}) => {
    const [loading, setLoading] = useState(false);

    // Filter States

    const [selectedRole, setSelectedRole] = useState("");
    const [selectedDivision, setSelectedDivision] = useState("");

    const exportFormat = 'excel';

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const filters: UserExportFilters = {
                role: selectedRole || undefined,
                division: selectedDivision || undefined,
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

        setSelectedRole("");
        setSelectedDivision("");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
            <div className="space-y-4">


                <SearchableSelect
                    label="Role"
                    options={roles}
                    value={selectedRole}
                    onChange={(val) => setSelectedRole(val)}
                    placeholder="Semua Role"
                />

                <SearchableSelect
                    label="Divisi"
                    options={divisions}
                    value={selectedDivision}
                    onChange={(val) => setSelectedDivision(val)}
                    placeholder="Semua Divisi"
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
