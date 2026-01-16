"use client";

import { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';

import { BsEye } from 'react-icons/bs';

export interface ActionButtonsProps {
    id: string;
    onAction: (e: MouseEvent, action: string, id: string, roleId?: number) => void;
    roleId?: number | null;
    showEdit?: boolean;
    showDelete?: boolean;
    showDownload?: boolean;
    showView?: boolean;
    downloadUrl?: string;
    viewLabel?: string;
    showActivate?: boolean;
    showDeactivate?: boolean;
}
import { FiDownload, FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export function ActionButtons({
    id,
    onAction,
    roleId,
    showEdit = true,
    showDelete = true,
    showDownload = false,
    showView = false,
    downloadUrl,
    viewLabel = 'View',
    showActivate = false,
    showDeactivate = false,
}: ActionButtonsProps) {
    return (
        <div className="flex justify-start items-center gap-2">
            {showView && (
                <Button
                    rounded="rounded-md"
                    onClick={(e) => onAction(e, viewLabel, id, roleId ?? undefined)}
                    className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer flex items-center gap-2"
                >
                    <BsEye className="w-3.5 h-3.5 text-primary" />
                </Button>
            )}

            {showDownload && downloadUrl && (
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                        rounded="rounded-md"
                        className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer"
                    >
                        <FiDownload className="w-3.5 h-3.5 text-foreground/80" />
                    </Button>
                </a>
            )}

            {showEdit && (
                <Button
                    rounded="rounded-md"
                    onClick={(e) => onAction(e, 'Edit', id, roleId ?? undefined)}
                    className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer"
                >
                    <FiEdit className="w-3.5 h-3.5 text-primary" />
                </Button>
            )}

            {showDelete && (
                <Button
                    rounded="rounded-md"
                    onClick={(e) => onAction(e, 'Delete', id)}
                    className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer"
                >
                    <FiTrash2 className="w-3.5 h-3.5 text-red-600" />
                </Button>
            )}
            {showActivate && (
                <Button
                    rounded="rounded-md"
                    onClick={(e) => onAction(e, 'Activate', id)}
                    className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    title="Aktifkan"
                >
                    <FiCheckCircle className="w-3.5 h-3.5" />
                </Button>
            )}

            {showDeactivate && (
                <Button
                    rounded="rounded-md"
                    onClick={(e) => onAction(e, 'Deactivate', id)}
                    className="p-2 bg-background hover:bg-muted border border-secondary/20 cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    title="Nonaktifkan"
                >
                    <FiXCircle className="w-3.5 h-3.5" />
                </Button>
            )}
        </div>
    );
}
