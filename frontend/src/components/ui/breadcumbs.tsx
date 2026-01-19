import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const pathMap: { [key: string]: string } = {
        workspace: "Dasbor",
        mail: "Surat",
        incoming: "Surat Masuk",
        outgoing: "Surat Keluar",
        decision: "Surat Keputusan",
        master: "Master Data",
        "mail-category": "Kategori Surat",
        "division-review": "Verifikasi Bidang",
        manage: "Manajemen",
        division: "Divisi",
        user: "Pengguna",
        overview: "Ikhtisar",
        create: "Buat Baru",
        edit: "Edit",
};

// Valid base routes that are clickable
const validRoutes = [
        "/workspace/overview",
        "/workspace/mail/incoming",
        "/workspace/mail/outgoing",
        "/workspace/mail/decision",
        "/workspace/master/mail-category",
        "/workspace/manage/division",
        "/workspace/manage/user",
];

export const Breadcumbs = () => {
        const pathname = usePathname();
        const segments = pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1] || "Home";

        const formatSegment = (segment: string) => {
                const lowerSegment = segment.toLowerCase();
                return pathMap[lowerSegment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
        };

        return (
                <nav aria-label="Breadcrumb">
                        <h4 className="text-foreground text-md flex lg:hidden">
                                {formatSegment(lastSegment)}
                        </h4>

                        <ol className="list-none p-0 hidden lg:flex text-sm text-gray-500">
                                {segments.map((segment, idx) => {
                                        const currentPath = "/" + segments.slice(0, idx + 1).join("/");
                                        const isLast = idx === segments.length - 1;

                                        // Actually simpler: validRoutes list contains the pages we CAN land on from a breadcrumb click.
                                        const isClickable = !isLast && validRoutes.includes(currentPath);

                                        return (
                                                <li key={idx} className="flex items-center">
                                                        {idx === 0 ? (
                                                                <div className={isClickable ? "text-gray-500 hover:text-blue-600 cursor-pointer translate-y-[1px]" : "text-gray-400"}>
                                                                        {isClickable ? (
                                                                                <Link href={currentPath}>{formatSegment(segment)}</Link>
                                                                        ) : (
                                                                                formatSegment(segment)
                                                                        )}
                                                                </div>
                                                        ) : (
                                                                <>
                                                                        {isClickable ? (
                                                                                <Link
                                                                                        href={currentPath}
                                                                                        className="text-gray-500 hover:text-blue-600 hover:underline transition-colors"
                                                                                >
                                                                                        {formatSegment(segment)}
                                                                                </Link>
                                                                        ) : (
                                                                                <span className={isLast ? "text-foreground font-medium" : "text-gray-400 cursor-default"}>
                                                                                        {formatSegment(segment)}
                                                                                </span>
                                                                        )}
                                                                </>
                                                        )}

                                                        {idx < segments.length - 1 && <span className="mx-2 text-gray-400">/</span>}
                                                </li>
                                        );
                                })}
                        </ol>
                </nav>
        );
};
