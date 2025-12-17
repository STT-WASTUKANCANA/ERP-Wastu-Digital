"use client";

import React, { useEffect, useState, MouseEvent } from 'react';
import { IncomingMail, IncomingOffcanvasDetailProps, statusMap } from '@/types/mail-props';
import { IoClose } from "react-icons/io5";
import { FiEdit, FiTrash2, FiDownload } from "react-icons/fi";
import { getStorageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const badgeMap = {
        1: { label: statusMap[1], color: "bg-secondary text-white" },
        2: { label: statusMap[2], color: "bg-blue-100 text-blue-800" },
        3: { label: statusMap[3], color: "bg-green-100 text-green-800" },
};

export const OffcanvasDetail = ({ mail, onClose, onAction }: IncomingOffcanvasDetailProps) => {
        const [isVisible, setIsVisible] = useState(false);
        const fileUrl = getStorageUrl(mail.attachment);

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
                                className={`fixed top-0 right-0 h-full w-[280px] max-w-[80vw] bg-background shadow-2xl z-50
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${isVisible ? "translate-x-0" : "translate-x-full"}`}
                        >
                                <header className="flex justify-between items-center p-5 border-b border-secondary/20">
                                        <h5>Mail Detail</h5>
                                        <button
                                                onClick={handleClose}
                                                className="p-1 rounded-full text-foreground/70 hover:bg-muted hover:text-foreground"
                                        >
                                                <IoClose size={24} />
                                        </button>
                                </header>

                                <main className="flex-grow overflow-y-auto p-5">
                                        <div className="space-y-5 text-sm">
                                                <div>
                                                        <p className="text-secondary text-xs mb-1 font-medium">Mail Number</p>
                                                        <p>{mail.number}</p>
                                                </div>
                                                <div>
                                                        <p className="text-secondary text-xs mb-1 font-medium">Date</p>
                                                        <p>{mail.date}</p>
                                                </div>
                                                <div>
                                                        <p className="text-secondary text-xs mb-1 font-medium">Category</p>
                                                        <p>{mail.category_name}</p>
                                                </div>
                                                <div>
                                                        <p className="text-secondary text-xs mb-1 font-medium">Enhancer</p>
                                                        <p>{mail.user_name}</p>
                                                </div>
                                                <div>
                                                        <p className="text-secondary text-xs mb-1 font-medium">Status</p>
                                                        <Badge value={mail.status} map={badgeMap} />
                                                </div>

                                        </div>
                                </main>

                                <footer className="flex-shrink-0 p-4 border-t border-secondary/20 space-y-3">
                                        {mail.attachment && (
                                                <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
              text-foreground bg-background hover:bg-muted border border-secondary/20 rounded-lg transition-colors"
                                                >
                                                        <FiDownload className="w-4 h-4" />
                                                        <span>Download Attachment</span>
                                                </a>
                                        )}

                                        <div className="flex gap-3">
                                                <Button
                                                        onClick={(e) => onAction(e, 'Edit', mail.id.toString())}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
              text-background bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                                                >
                                                        <FiEdit className="w-4 h-4" />
                                                        <span>Edit</span>
                                                </Button>

                                                <Button
                                                        onClick={(e) => onAction(e, 'Delete', mail.id.toString())}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
              text-white bg-danger hover:bg-danger/90 rounded-lg transition-colors"
                                                >
                                                        <FiTrash2 className="w-4 h-4" />
                                                        <span>Delete</span>
                                                </Button>
                                        </div>
                                </footer>
                        </div>
                </div>
        );
};
