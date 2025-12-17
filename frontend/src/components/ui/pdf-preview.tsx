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
            <Collapse title={title}>
                <embed
                    src={getStorageUrl(attachment)}
                    type="application/pdf"
                    width="100%"
                    className="h-[400px] lg:h-[600px]"
                />
            </Collapse>
        </div>
    );
}
