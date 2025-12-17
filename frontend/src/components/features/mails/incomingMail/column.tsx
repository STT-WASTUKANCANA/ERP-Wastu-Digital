"use client";

import { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { IncomingMail, statusMap } from '@/types/mail-props';
import { ColumnDef } from '@/types/ui-props';
import { getStorageUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BsEye } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import { ActionButtons } from '@/components/ui/action-buttons';

type HandleActionClickFn = (e: MouseEvent, action: string, mailId: string, roleId?: number) => void;

export const getIncomingMailColumns = (
        handleActionClick: HandleActionClickFn,
        roleId: number | null
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
                        mobile: true,
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
                        header: '',
                        id: 'actions',
                        cell: (row) => {
                                const mail = row;

                                const showReview = roleId === 2 && (mail.status == 1 || mail.status == 2);
                                const showDivisionReview = roleId === 4 && mail.follow_status == 1;

                                const canEdit = !showReview && (roleId === 1 && mail.status == 1);

                                return (
                                        <div className="flex justify-start items-center gap-2">
                                                {showReview && (
                                                        <Button
                                                                rounded="rounded-md"
                                                                onClick={(e) => handleActionClick(e, 'Review', mail.id.toString())}
                                                                className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer flex items-center gap-2"
                                                        >
                                                                {mail.status == 2 ? (
                                                                        <FiEdit className="w-3.5 h-3.5 text-foreground" />
                                                                ) : (
                                                                        <BsEye className="w-3.5 h-3.5 text-foreground" />
                                                                )}

                                                        </Button>
                                                )}

                                                {showDivisionReview && (
                                                        <Button
                                                                color='bg-primary'
                                                                rounded="rounded-md"
                                                                onClick={(e) => handleActionClick(e, 'Division Review', mail.id.toString())}
                                                                className="p-2 bg-primary hover:bg-primary/80 cursor-pointer flex items-center gap-2"
                                                        >
                                                                <BsEye className="w-3.5 h-3.5 text-white" />
                                                        </Button>
                                                )}

                                                <ActionButtons
                                                        id={mail.id.toString()}
                                                        onAction={handleActionClick}
                                                        roleId={roleId}
                                                        showEdit={canEdit}
                                                        showDelete={true}
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

