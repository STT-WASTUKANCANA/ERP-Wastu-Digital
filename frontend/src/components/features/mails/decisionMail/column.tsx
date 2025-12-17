import { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';
import { ColumnDef } from '@/types/ui-props';
import { getStorageUrl } from '@/lib/utils';

export type DecisionMail = {
        id: string;
        number: string;
        user_id: string;
        user_name?: string;
        category_name: string;
        date: string;
        attachment: string;
        title: string;
        desc: string;
};

type HandleActionClickFn = (e: MouseEvent, action: string, mailId: string, roleId?: number) => void;

export const getDecisionMailColumns = (
        handleActionClick: HandleActionClickFn,
        roleId: number | null
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
                // {
                //         header: 'Deskripsi',
                //         accessorKey: 'desc',
                // },
                {
                        header: '',
                        id: 'actions',
                        cell: (row) => {
                                const mail = row;
                                
                                const fileUrl = getStorageUrl(mail.attachment);
                                const canEdit = roleId === 2;

                                return (
                                        <div className="flex justify-start items-center gap-2">
                                                {mail.attachment && (
                                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                                                <Button
                                                                        rounded="rounded-md"
                                                                        className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer"
                                                                >
                                                                        <FiDownload className="w-3.5 h-3.5 text-foreground/80" />
                                                                </Button>
                                                        </a>
                                                )}

                                                {canEdit && (
                                                        <Button
                                                                rounded="rounded-md"
                                                                onClick={(e) => handleActionClick(e, 'Edit', mail.id.toString(), roleId)}
                                                                className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer"
                                                        >
                                                                <FiEdit className="w-3.5 h-3.5 text-primary" />
                                                        </Button>
                                                )}

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
