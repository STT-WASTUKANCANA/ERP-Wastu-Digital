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
            header: "Deskripsi",
            accessorKey: "description",
            cell: (row) => row.description || "-",
        },
        {
            header: "Kepala Bidang",
            accessorKey: "leader_name",
            mobile: true,
            cell: (row) => row.leader_name || <span className="text-gray-400 italic">Belum ditentukan</span>,
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
                />
            ),
        },
    ];
