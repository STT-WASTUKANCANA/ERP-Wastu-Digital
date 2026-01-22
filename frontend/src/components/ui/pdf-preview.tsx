"use client";

import { Collapse } from '@/components/ui/collapse';
import { getStorageUrl } from '@/lib/utils';

interface PdfPreviewProps {
    attachment: string;
    title?: string;
    className?: string;
}

export function PdfPreview({
    attachment,
    title = "Tampilkan Surat",
    className = "",
}: PdfPreviewProps) {
    if (!attachment) return null;

    return (
        <div className={className}>
            {attachment.startsWith("http") ? (
                <div className="p-4 bg-secondary/10 rounded-md border border-secondary/20 flex flex-col items-center justify-center gap-2">
                    <p className="text-sm text-foreground/70">Lampiran tersedia via Tautan Eksternal:</p>
                    <a
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium break-all"
                    >
                        {attachment}
                    </a>
                    <a
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
                    >
                        Buka Lampiran ↗
                    </a>
                </div>
            ) : (
                <Collapse title={title}>
                    <embed
                        src={getStorageUrl(attachment)}
                        type="application/pdf"
                        width="100%"
                        className="h-[400px] lg:h-[600px]"
                    />
                </Collapse>
            )}
        </div>
    );
}
