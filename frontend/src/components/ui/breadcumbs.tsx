import { usePathname } from 'next/navigation';
import React from 'react';

export const Breadcumbs = () => {
        const pathname = usePathname();
        const segments = pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1] || "Home";

        const formatSegment = (segment: string) =>
                segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");

        return (
                <nav aria-label="Breadcrumb">
                        <h4 className="text-foreground text-md flex lg:hidden">
                                {formatSegment(lastSegment)}
                        </h4>

                        <ol className="list-none p-0 hidden lg:flex text-sm text-gray-500">
                                {segments.map((segment, idx) => (
                                        <li key={idx} className="flex items-center">
                                                {idx === 0 ? (
                                                        <div className="text-gray-400">{formatSegment(segment)}</div>
                                                ) : idx === segments.length - 1 ? (
                                                        <span className="text-foreground">{formatSegment(segment)}</span>
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
        );
};
