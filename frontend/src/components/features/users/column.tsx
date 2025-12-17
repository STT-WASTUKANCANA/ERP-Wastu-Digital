"use client";

import { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { User } from '@/types/user-props';
import { ColumnDef } from '@/types/ui-props';

type HandleActionClickFn = (e: MouseEvent, action: string, userId: string) => void;

export const getUserColumns = (
    handleActionClick: HandleActionClickFn
): ColumnDef<User>[] => {
    return [
        {
            header: 'Nama',
            accessorKey: 'name',
            mobile: true,
        },
        {
            header: 'Email',
            accessorKey: 'email',
            mobile: true,
        },
        {
            header: 'Role',
            accessorKey: 'role_name',
            cell: (row) => row.role_name || 'Administrator',
        },
        {
            header: 'Divisi',
            accessorKey: 'division_name',
            cell: (row) => row.division_name || '-',
        },
        {
            header: '',
            id: 'actions',
            cell: (row) => {
                return (
                    <div className="flex justify-start items-center gap-2">
                        <Button
                            rounded="rounded-md"
                            onClick={(e) => handleActionClick(e, 'Edit', row.id.toString())}
                            className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer"
                        >
                            <FiEdit className="w-3.5 h-3.5 text-primary" />
                        </Button>

                        <Button
                            rounded="rounded-md"
                            onClick={(e) => handleActionClick(e, 'Delete', row.id.toString())}
                            className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer"
                        >
                            <FiTrash2 className="w-3.5 h-3.5 text-red-600" />
                        </Button>
                    </div>
                );
            },
        },
    ];
};
