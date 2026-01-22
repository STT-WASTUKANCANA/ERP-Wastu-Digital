
import { MouseEvent } from 'react';
import { OutgoingMail } from '@/types/features/mail/outgoing';
import { outgoingStatusMap } from '@/lib/constants/mail';
import { ColumnDef } from '@/types/shared/ui';
import { getStorageUrl, formatDate } from '@/lib/utils';
import { ActionButtons } from '@/components/ui/action-buttons';
import { StatusBadge } from '@/components/ui/status-badge';

type HandleActionClickFn = (e: MouseEvent, action: string, mailId: string, roleId?: number) => void;

export const getOutgoingMailColumns = (
        handleActionClick: HandleActionClickFn,
        roleId: number | null,
        userId: string | null
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
                        header: 'Tujuan Surat / PIC',
                        accessorKey: 'institute',
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
                        cell: (row) => <StatusBadge value={String(row.status)} map={outgoingStatusMap} />,
                },
                {
                        header: '',
                        id: 'actions',
                        cell: (row) => {
                                const isSekum = roleId === 2;
                                // Verification is needed only if status is 1 (Pending/Verifikasi Sekum)
                                const isVerificationNeeded = String(row.status) === '1';
                                const isCreator = String(row.user_id) === String(userId);

                                // Sekum uses "View" (Eye) for verification (Status 1)
                                // For other statuses (Approved/Rejected/Revision), Sekum can use normal "Edit"
                                const showVerificationView = isSekum && isVerificationNeeded;

                                // Show Edit:
                                // 1. If Sekum: Can edit if verification is NOT needed (already verified/rejected/revision)
                                // 2. If Others (including Admin): Can edit ONLY if they are the creator
                                const showEdit = isSekum ? !isVerificationNeeded : isCreator;

                                // Delete logic:
                                // Sekum can always delete.
                                // Users (Creators) can only delete if status is 1 (Pending/Not yet verified) AND they are the creator.
                                // Once verified (Status != 1), user cannot delete.
                                const showDelete = isSekum || (isVerificationNeeded && isCreator);

                                return (
                                        <ActionButtons
                                                id={row.id.toString()}
                                                onAction={handleActionClick}
                                                roleId={roleId}
                                                showEdit={showEdit}
                                                showDelete={showDelete}
                                                showView={showVerificationView}
                                                viewLabel="Edit" // Reuse Edit action to open the form
                                                showDownload={!!row.attachment}
                                                downloadUrl={row.attachment ? getStorageUrl(row.attachment) : undefined}
                                        />
                                );
                        },
                },
        ];
};