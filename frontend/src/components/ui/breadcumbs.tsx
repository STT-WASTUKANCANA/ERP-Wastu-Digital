import { usePathname } from 'next/navigation';
import React from 'react'

export const Breadcumbs = () => {
        const pathname = usePathname();
        const segments = pathname.split("/").filter(Boolean);
        
        const formatSegment = (segment: string) => segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
        
        return (
                <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
                        <ol className="list-none p-0 inline-flex">
                                {segments.map((segment, idx) => (
                                        <li key={idx} className="flex items-center">
                                                {idx === 0 ? (
                                                        <span className="text-gray-700">{formatSegment(segment)}</span>
                                                ) : idx === segments.length - 1 ? (
                                                        <span className="text-gray-700">{formatSegment(segment)}</span>
                                                ) : (
                                                        <a
                                                                href={"/" + segments.slice(0, idx + 1).join("/")}
                                                                className="text-gray-400 hover:text-gray-700"
                                                        >
                                                                {formatSegment(segment)}
                                                        </a>
                                                )}

                                                {idx < segments.length - 1 && <span className="mx-2">/</span>}
                                        </li>
                                ))}
                        </ol>
                </nav>
        )
}
