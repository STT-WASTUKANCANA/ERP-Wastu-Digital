"use client";

import { MouseEvent } from 'react';
import { User } from '@/types/features/user';
import { ColumnDef } from '@/types/shared/ui';
import { ActionButtons } from '@/components/ui/action-buttons';

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
            header: 'Role',
            accessorKey: 'role_name',
            mobile: true,
            cell: (row) => row.role_name || 'Administrator',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Divisi',
            accessorKey: 'division_name',
            cell: (row) => row.division_name || <span className="text-gray-400 italic">Belum ditentukan</span>,
        },
        {
            header: '',
            id: 'actions',
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
};
