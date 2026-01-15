'use client';

import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { Button } from '@/components/ui/button';
import { IconType } from 'react-icons';

export interface DataDetailItem {
    label: string;
    value: React.ReactNode | string;
}

// Definisi tipe aksi tombol
export interface DataDetailAction {
    label: string;
    onClick: (e: React.MouseEvent) => void;
    icon?: IconType;
    variant?: 'primary' | 'danger' | 'default' | 'outline';
}

interface DataDetailSheetProps {
    title: string;
    items: DataDetailItem[];
    actions?: DataDetailAction[];
    attachment?: {
        url: string;
        fileName?: string;
    };
    extraFooter?: React.ReactNode;
    onClose: () => void;
}

export const DataDetailSheet = ({ title, items, actions, attachment, extraFooter, onClose }: DataDetailSheetProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            onClick={handleClose}
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden
            ${isVisible ? "opacity-100" : "opacity-0"}`}
            aria-modal="true"
            role="dialog"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`fixed top-0 right-0 h-[100dvh] w-[280px] max-w-[80vw] bg-background shadow-2xl z-50
                flex flex-col transform transition-transform duration-300 ease-in-out
                ${isVisible ? "translate-x-0" : "translate-x-full"}`}
            >
                <header className="flex justify-between items-center p-5 border-b border-secondary/20">
                    <div className="text-lg font-semibold">{title}</div>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full text-foreground/70 hover:bg-muted hover:text-foreground"
                    >
                        <IoClose size={24} />
                    </button>
                </header>

                <main className="flex-grow overflow-y-auto p-5">
                    <div className="space-y-4 text-sm">
                        {items.map((item, idx) => (
                            <div key={idx}>
                                <p className="text-secondary text-xs mb-1 font-medium">{item.label}</p>
                                <div className="text-foreground font-medium break-words">{item.value || '-'}</div>
                            </div>
                        ))}
                    </div>
                </main>

                <footer className="flex-shrink-0 p-4 border-t border-secondary/20 space-y-3">
                    {/* Footer Tambahan (Custom) */}
                    {extraFooter}

                    {attachment && (
                        <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
                            text-foreground bg-background hover:bg-muted border border-secondary/20 rounded-lg transition-colors"
                        >
                            <FiDownload className="w-4 h-4" />
                            <span>{attachment.fileName || 'Download Attachment'}</span>
                        </a>
                    )}

                    {actions && actions.length > 0 && (
                        <div className="flex gap-3">
                            {actions.map((action, idx) => (
                                <Button
                                    key={idx}
                                    onClick={action.onClick}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                    ${action.variant === 'danger' ? 'bg-danger text-white hover:bg-danger/90' :
                                            action.variant === 'primary' ? 'bg-primary text-background hover:bg-primary/90' :
                                                'bg-secondary/10 text-foreground hover:bg-secondary/20'}`}
                                >
                                    {action.icon && <action.icon className="w-4 h-4" />}
                                    <span>{action.label}</span>
                                </Button>
                            ))}
                        </div>
                    )}
                </footer>
            </div>
        </div>
    )
}
