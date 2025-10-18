"use client";

import { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';
import { IncomingMail } from '@/types/mail-props';
import { ColumnDef } from '@/types/ui-props';
import { getStorageUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type HandleActionClickFn = (e: MouseEvent, action: string, mailId: string) => void;

const statusMap: Record<number, string> = {
        1: 'Pending',
        2: 'In Progress',
        3: 'Done',
};

export const getIncomingMailColumns = (handleActionClick: HandleActionClickFn): ColumnDef<IncomingMail>[] => [
        {
                header: 'Mail Number',
                accessorKey: 'number',
        },
        {
                header: 'Status',
                accessorKey: 'status',
                cell: (row) => {
                        const badgeMap = {
                                1: { label: statusMap[1], color: "bg-secondary text-white" },
                                2: { label: statusMap[2], color: "bg-blue-100 text-blue-800" },
                                3: { label: statusMap[3], color: "bg-green-100 text-green-800" },
                        };
                        return <Badge value={row.status} map={badgeMap} />;
                },
        },
        {
                header: 'Date',
                accessorKey: 'date',
        },
        {
                header: 'Category',
                accessorKey: 'category_name',
        },
        {
                header: 'User',
                accessorKey: 'user_name',
                cell: (row) => row.user_name,
        },
        {
                header: 'Actions',
                id: 'actions',
                cell: (row) => {
                        const mail = row;
                        const fileUrl = getStorageUrl(mail.attachment);

                        return (
                                <div className="flex justify-start items-center gap-2">
                                        {mail.attachment && (
                                                <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                >
                                                        <Button
                                                                rounded="rounded-md"
                                                                className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer"
                                                        >
                                                                <FiDownload className="w-3.5 h-3.5 text-foreground/80" />
                                                        </Button>
                                                </a>
                                        )}

                                        <Button
                                                rounded="rounded-md"
                                                onClick={(e) => handleActionClick(e, 'Edit', mail.id.toString())}
                                                className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer"
                                        >
                                                <FiEdit className="w-3.5 h-3.5 text-primary" />
                                        </Button>

                                        <Button
                                                rounded="rounded-md"
                                                onClick={(e) => handleActionClick(e, 'Delete', mail.id.toString())}
                                                className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer"
                                        >
                                                <FiTrash2 className="w-3.5 h-3.5 text-red-600" />
                                        </Button>
                                </div>
                        );
                },
        },
];