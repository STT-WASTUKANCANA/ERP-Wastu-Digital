"use client";

import { ColumnDef } from "@/types/shared/ui";
import { MailCategory } from "@/lib/api/master/mail-category";
import { ActionButtons } from "@/components/ui/action-buttons";

export const getMailCategoryColumns = (
    handleActionClick: (e: React.MouseEvent, action: string, id: string) => void
): ColumnDef<MailCategory>[] => [
        {
            accessorKey: "name",
            header: "Nama Kategori",
            mobile: true,
        },
        {
            accessorKey: "type_label",
            header: "Jenis Surat",
            mobile: true,
            cell: (row) => (
                <div className="badge badge-outline">{row.type_label}</div>
            ),
        },
        {
            accessorKey: "description",
            header: "Deskripsi",
            cell: (row) => <div>{row.description || <span className="text-gray-400 italic">Tidak ada deskripsi</span>}</div>,
        },
        {
            id: "actions",
            header: "Aksi",
            cell: (row) => (
                <ActionButtons
                    id={row.id.toString()}
                    showEdit={true}
                    showDelete={true}
                    onAction={handleActionClick}
                />
            ),
        },
    ];
