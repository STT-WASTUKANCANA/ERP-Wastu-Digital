"use client";

import { MouseEvent } from 'react';
import { DecisionMail } from '@/types/features/mail/decision';
import { ColumnDef } from '@/types/shared/ui';
import { getStorageUrl, formatDate } from '@/lib/utils';
import { ActionButtons } from '@/components/ui/action-buttons';

type HandleActionClickFn = (e: MouseEvent, action: string, mailId: string, roleId?: number) => void;

export const getDecisionMailColumns = (
        handleActionClick: HandleActionClickFn,
        roleId: number | null,
        userId: string | null
): ColumnDef<DecisionMail>[] => [
                {
                        header: 'Nomor Surat',
                        accessorKey: 'number',
                        mobile: true,
                },
                {
                        header: 'Tanggal',
                        accessorKey: 'date',
                        mobile: true,
                        cell: (row) => formatDate(row.date),
                },
                {
                        header: 'Kategori',
                        accessorKey: 'category_name',
                },
                {
                        header: 'Oleh',
                        accessorKey: 'user_name',
                        cell: (row) => row.user_name,
                },
                {
                        header: 'Judul',
                        accessorKey: 'title',
                },
                {
                        header: '',
                        id: 'actions',
                        cell: (row) => {
                                const isCreator = String(row.user_id) === String(userId);
                                const canEdit = roleId === 2 || (roleId === 3 && isCreator);

                                return (
                                        <ActionButtons
                                                id={row.id.toString()}
                                                onAction={handleActionClick}
                                                roleId={roleId}
                                                showEdit={canEdit}
                                                showDelete={isCreator}
                                                showDownload={!!row.attachment}
                                                downloadUrl={row.attachment ? getStorageUrl(row.attachment) : undefined}
                                        />
                                );
                        },
                },
        ];
