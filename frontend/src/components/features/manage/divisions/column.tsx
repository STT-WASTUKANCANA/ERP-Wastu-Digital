"use client";

import { ColumnDef } from "@/types/ui-props";
import { Division } from "@/types/division-props";
import { ActionButtons } from "@/components/ui/action-buttons";

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
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.active === 1 || row.active === true
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {row.active === 1 || row.active === true ? "Aktif" : "Nonaktif"}
                </div>
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
