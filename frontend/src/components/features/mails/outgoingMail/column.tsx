
import { MouseEvent } from 'react';
import { OutgoingMail, outgoingStatusMap } from '@/types/mail-props';
import { ColumnDef } from '@/types/ui-props';
import { getStorageUrl, formatDate } from '@/lib/utils';
import { ActionButtons } from '@/components/ui/action-buttons';
import { Badge } from '@/components/ui/badge';

type HandleActionClickFn = (e: MouseEvent, action: string, mailId: string, roleId?: number) => void;

export const getOutgoingMailColumns = (
        handleActionClick: HandleActionClickFn,
        roleId: number | null
): ColumnDef<OutgoingMail>[] => {

        return [
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
                        header: 'Status',
                        accessorKey: 'status',
                        cell: (row) => <Badge value={String(row.status)} map={outgoingStatusMap} />,
                },
                {
                        header: '',
                        id: 'actions',
                        cell: (row) => {
                                const canEdit = true; // Access control is handled in the edit page

                                return (
                                        <ActionButtons
                                                id={row.id.toString()}
                                                onAction={handleActionClick}
                                                roleId={roleId}
                                                showEdit={canEdit}
                                                showDelete={true}
                                                showDownload={!!row.attachment}
                                                downloadUrl={row.attachment ? getStorageUrl(row.attachment) : undefined}
                                        />
                                );
                        },
                },
        ];
};