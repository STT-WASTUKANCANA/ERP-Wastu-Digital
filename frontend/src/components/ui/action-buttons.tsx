"use client";

import { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FiDownload, FiEdit, FiTrash2 } from 'react-icons/fi';
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
}

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
}: ActionButtonsProps) {
    return (
        <div className="flex justify-start items-center gap-2">
            {showView && (
                <Button
                    rounded="rounded-md"
                    onClick={(e) => onAction(e, viewLabel, id, roleId ?? undefined)}
                    className="px-3 py-1.5 text-background bg-background hover:bg-muted border border-secondary/20 cursor-pointer flex items-center gap-2"
                >
                    <BsEye className="w-3.5 h-3.5 text-background" />
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
        </div>
    );
}
