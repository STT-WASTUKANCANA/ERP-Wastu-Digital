"use client";

import { ColumnDef } from "@/types/ui-props";
import { Division } from "@/types/division-props";
import { ActionButtons } from "@/components/ui/action-buttons";
import { StatusBadge } from "@/components/ui/status-badge";

export const getDivisionColumns = (
    handleActionClick: (e: React.MouseEvent, action: string, id: string) => void
): ColumnDef<Division>[] => [
        {
            header: "Nama Divisi",
            accessorKey: "name",
            mobile: true,
        },
        {
            header: "Status",
            accessorKey: "active",
            cell: (row) => (
                <StatusBadge
                    value={row.active}
                    map={{
                        "true": { label: "Aktif", color: "bg-emerald-100 text-emerald-800" },
                        "1": { label: "Aktif", color: "bg-emerald-100 text-emerald-800" },
                        "false": { label: "Nonaktif", color: "bg-red-100 text-red-800" },
                        "0": { label: "Nonaktif", color: "bg-red-100 text-red-800" }
                    }}
                />
            ),
        },
        {
            header: "Kepala Bidang",
            accessorKey: "leader_name",
            mobile: true,
            cell: (row) => row.leader_name || <span className="text-gray-400 italic">Belum ditentukan</span>,
        },
        {
            header: "Deskripsi",
            accessorKey: "description",
            cell: (row) => row.description || <span className="text-gray-400 italic">Tidak ada deskripsi</span>,
        },
        {
            header: "",
            id: "actions",
            cell: (row) => (
                <ActionButtons
                    id={row.id.toString()}
                    onAction={handleActionClick}
                    showEdit={true}
                    showDelete={true}
                    showActivate={row.active === 0 || row.active === false}
                    showDeactivate={row.active === 1 || row.active === true}
                />
            ),
        },
    ];
