"use client";

import { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { IncomingMail } from '@/types/features/mail/incoming';
import { statusMap } from '@/lib/constants/mail';
import { ColumnDef } from '@/types/shared/ui';
import { getStorageUrl, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/status-badge';
import { BsEye } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import { ActionButtons } from '@/components/ui/action-buttons';

type HandleActionClickFn = (e: MouseEvent, action: string, mailId: string, roleId?: number) => void;

export const getIncomingMailColumns = (
        handleActionClick: HandleActionClickFn,
        roleId: number | null,
        userId: string | null
): ColumnDef<IncomingMail>[] => {

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
                        mobile: false,
                        cell: (row) => {
                                let val: string | number = row.status;
                                let color = "bg-gray-100 text-gray-800";
                                let label = statusMap[row.status] || "Unknown";

                                if (row.status == 1) {
                                        color = "bg-orange-100 text-orange-800"; // Menunggu / Peninjauan
                                } else if (row.status == 2) {
                                        if (row.follow_status == 2) {
                                                val = "Proses";
                                                label = "Proses";
                                                color = "bg-yellow-100 text-yellow-800";
                                        } else {
                                                color = "bg-blue-100 text-blue-800"; // Disposisi
                                        }
                                } else if (row.status == 3) {
                                        label = "Selesai";
                                        color = "bg-green-100 text-green-800";
                                }

                                return <StatusBadge
                                        value={val}
                                        map={{
                                                [val]: { label, color }
                                        }}
                                />;
                        },
                },
                {
                        header: 'Divisi',
                        accessorKey: 'division_name',
                        cell: (row) => row.division_name || <span className="text-gray-400 italic text-xs">Belum ditentukan</span>,
                },
                {
                        header: 'Dilihat',
                        accessorKey: 'user_view_id',
                        cell: (row) => {
                                if (row.user_view_id) {
                                        return <span className="text-green-600 italic text-xs">Sudah Dilihat</span>;
                                }
                                return <span className="text-gray-400 italic text-xs">Belum Dilihat</span>;
                        }
                },
                {
                        header: '',
                        id: 'actions',
                        cell: (row) => {
                                const mail = row;
                                const isCreator = String(mail.user_id) === String(userId);

                                const showReview = roleId === 2 && (mail.status == 1 || mail.status == 2);
                                const showDivisionReview = roleId === 4 && (mail.follow_status == 1 || mail.follow_status == 2);

                                const canEdit = !showReview && (roleId === 1 && mail.status == 1);
                                const canDelete = mail.status == 1 && isCreator;

                                return (
                                        <div className="flex justify-start items-center gap-2">
                                                {showReview && (
                                                        <Button
                                                                rounded="rounded-md"
                                                                onClick={(e) => handleActionClick(e, 'Review', mail.id.toString())}
                                                                className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer flex items-center gap-2"
                                                        >
                                                                {mail.status == 2 ? (
                                                                        <FiEdit className="w-3.5 h-3.5 text-primary" />
                                                                ) : (
                                                                        <BsEye className="w-3.5 h-3.5 text-primary" />
                                                                )}

                                                        </Button>
                                                )}

                                                {showDivisionReview && (
                                                        <Button
                                                                rounded="rounded-md"
                                                                onClick={(e) => handleActionClick(e, 'Division Review', mail.id.toString())}
                                                                className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer flex items-center gap-2"
                                                        >
                                                                {mail.follow_status == 2 ? (
                                                                        <FiEdit className="w-3.5 h-3.5 text-primary" />
                                                                ) : (
                                                                        <BsEye className="w-3.5 h-3.5 text-primary" />
                                                                )}
                                                        </Button>
                                                )}

                                                <ActionButtons
                                                        id={mail.id.toString()}
                                                        onAction={handleActionClick}
                                                        roleId={roleId}
                                                        showEdit={canEdit}
                                                        showDelete={canDelete}
                                                        showDownload={!!mail.attachment}
                                                        downloadUrl={mail.attachment ? getStorageUrl(mail.attachment) : undefined}
                                                        showView={false}
                                                />
                                        </div>
                                );
                        },
                },
        ];
};

