"use client";

import React, { useEffect, useState } from 'react';
import { Division } from '@/types/division-props';
import { IoClose } from "react-icons/io5";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Button } from '@/components/ui/button';

interface DivisionOffcanvasDetailProps {
    division: Division;
    onClose: () => void;
    onAction: (e: React.MouseEvent, action: string, id: string) => void;
}

export const DivisionOffcanvasDetail = ({ division, onClose, onAction }: DivisionOffcanvasDetailProps) => {
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
                    <div className="text-lg font-semibold">Detail Divisi</div>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full text-foreground/70 hover:bg-muted hover:text-foreground"
                    >
                        <IoClose size={24} />
                    </button>
                </header>

                <main className="flex-grow overflow-y-auto p-5">
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="text-secondary text-xs mb-1 font-medium">Nama Divisi</p>
                            <p className="font-medium text-foreground">{division.name}</p>
                        </div>
                        <div>
                            <p className="text-secondary text-xs mb-1 font-medium">Kepala Bidang</p>
                            <p className="text-foreground">
                                {division.leader_name || <span className="text-gray-400 italic">Belum ditentukan</span>}
                            </p>
                        </div>
                        <div>
                            <p className="text-secondary text-xs mb-1 font-medium">Deskripsi</p>
                            <p className="text-foreground">{division.description || "-"}</p>
                        </div>
                    </div>
                </main>

                <footer className="flex-shrink-0 p-4 border-t border-secondary/20 space-y-3">
                    <div className="flex gap-3">
                        <Button
                            onClick={(e) => onAction(e, 'Edit', division.id.toString())}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
              text-background bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                        >
                            <FiEdit className="w-4 h-4" />
                            <span>Edit</span>
                        </Button>

                        <Button
                            onClick={(e) => onAction(e, 'Delete', division.id.toString())}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
              text-white bg-danger hover:bg-danger/90 rounded-lg transition-colors"
                        >
                            <FiTrash2 className="w-4 h-4" />
                            <span>Hapus</span>
                        </Button>
                    </div>
                </footer>
            </div>
        </div>
    );
};
