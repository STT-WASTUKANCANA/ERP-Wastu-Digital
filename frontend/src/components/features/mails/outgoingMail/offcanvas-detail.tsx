"use client";

import React, { useEffect, useState } from 'react';
import { OutgoingMail, outgoingStatusMap } from '@/types/mail-props';
import { IoClose } from "react-icons/io5";
import { FiEdit, FiTrash2, FiDownload, FiSave } from "react-icons/fi";
import { getStorageUrl, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
} from "@/components/ui/select";
import { validateOutgoingMail } from '@/lib/api/mails/outgoing';
import { useRole } from '@/contexts/role';
import { useRouter } from 'next/navigation';

interface OutgoingOffcanvasDetailProps {
    mail: OutgoingMail;
    onClose: () => void;
    onAction: (e: React.MouseEvent, action: string, mailId: string) => void;
}

export const OutgoingOffcanvasDetail = ({ mail, onClose, onAction }: OutgoingOffcanvasDetailProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const { roleId } = useRole();
    const router = useRouter();
    const [validationStatus, setValidationStatus] = useState<string>('');
    const fileUrl = mail.attachment ? (mail.attachment.startsWith('http') ? mail.attachment : getStorageUrl(mail.attachment)) : '#';

    // Check if attachment is a Link (starts with http/https) or file path
    const isLink = mail.attachment && (mail.attachment.startsWith('http://') || mail.attachment.startsWith('https://'));

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleValidation = async () => {
        if (!validationStatus) return;

        if (confirm(`Apakah Anda yakin ingin mengubah status menjadi ${outgoingStatusMap[validationStatus]?.label}?`)) {
            const res = await validateOutgoingMail(Number(mail.id), validationStatus);
            if (res.ok) {
                alert(`Status surat berhasil diperbarui.`);
                window.location.reload();
            } else {
                alert('Gagal memvalidasi surat.');
            }
        }
    };

    const canValidate = roleId === 2 && mail.status === '1'; // Sekum can validate if status is 'Verifikasi Sekum'

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
                    <div className="text-lg font-semibold">Detail Surat Keluar</div>
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
                            <p className="text-secondary text-xs mb-1 font-medium">Nomor Surat</p>
                            <p className="font-medium text-foreground">{mail.number}</p>
                        </div>
                        <div>
                            <p className="text-secondary text-xs mb-1 font-medium">Tanggal</p>
                            <p className="text-foreground">{formatDate(mail.date)}</p>
                        </div>
                        <div>
                            <p className="text-secondary text-xs mb-1 font-medium">Kategori</p>
                            <p className="text-foreground">{mail.category_name}</p>
                        </div>
                        <div>
                            <p className="text-secondary text-xs mb-1 font-medium">Oleh</p>
                            <p className="text-foreground">{mail.user_name}</p>
                        </div>
                        <div>
                            <p className="text-secondary text-xs mb-1 font-medium">Instansi</p>
                            <p className="text-foreground">{mail.institute}</p>
                        </div>
                        <div>
                            <p className="text-secondary text-xs mb-1 font-medium">Alamat</p>
                            <p className="text-foreground">{mail.address}</p>
                        </div>
                        <div>
                            <p className="text-secondary text-xs mb-1 font-medium">Status</p>
                            <Badge value={String(mail.status)} map={outgoingStatusMap} />
                        </div>
                        <div>
                            <p className="text-secondary text-xs mb-1 font-medium">Tujuan</p>
                            <p className="text-foreground">{mail.purpose}</p>
                        </div>
                        {mail.desc && (
                            <div>
                                <p className="text-secondary text-xs mb-1 font-medium">Perihal</p>
                                <p className="text-foreground">{mail.desc}</p>
                            </div>
                        )}
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
                            <span>{isLink ? 'Buka Link Drive' : 'Download Lampiran'}</span>
                        </a>
                    )}

                    {canValidate && (
                        <div className="flex flex-col gap-2 mb-2 p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                            <p className="text-xs font-semibold text-secondary">Validasi Sekum</p>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Select
                                        options={[
                                            { value: '2', label: 'Perlu Perbaikan' },
                                            { value: '3', label: 'Disetujui' },
                                            { value: '4', label: 'Ditolak' }
                                        ]}
                                        value={validationStatus}
                                        onChange={(e) => setValidationStatus(e.target.value)}
                                        placeholder="Pilih Status"
                                        width="w-full"
                                        className="text-xs h-9 py-1"
                                    />
                                </div>
                                <Button
                                    onClick={handleValidation}
                                    disabled={!validationStatus}
                                    className="bg-primary text-white hover:bg-primary/90 text-xs h-9 px-3"
                                >
                                    <FiSave className="mr-1" /> Simpan
                                </Button>
                            </div>
                        </div>
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
                            <span>Hapus</span>
                        </Button>
                    </div>
                </footer>
            </div>
        </div>
    );
};
