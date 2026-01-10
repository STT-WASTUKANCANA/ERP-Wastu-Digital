"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
import { Input } from '@/components/ui/input';
import { TbColumns2, TbDotsVertical } from 'react-icons/tb';
import { IoChevronDown } from 'react-icons/io5';
import { GoFilter } from 'react-icons/go';
import { TableContainerProps } from '@/types/ui-props';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const TableContainer = ({
        onSearchChange,
        onFilterClick,
        onModifyColumnClick,
        onEntriesChange,
        children,
        page = 1,
        total = 0,
        pageSize = 10,
        onPageChange,
}: TableContainerProps) => {
        const [toolsDropdown, setToolsDropdown] = useState(false);

        const totalPages = Math.ceil(total / pageSize);
        const startEntry = (page - 1) * pageSize + 1;
        const endEntry = Math.min(page * pageSize, total);

        return (
                <div className="relative w-full rounded-lg border border-secondary/20 p-4 lg:p-8 bg-background">
                        <div className="flex justify-between items-center gap-2 mb-4 flex-row lg:flex-row-reverse">
                                <div className="flex items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
                                        <Input
                                                placeholder="🔍︎  Masukan kata kunci..."
                                                className="w-[80%] sm:w-[250px] lg:w-[300px]"
                                                onChange={(e) => onSearchChange?.(e.target.value)}
                                        />
                                        <div className="hidden lg:flex items-center gap-2 text-sm">
                                                <div className="relative">
                                                        <select
                                                                id="entries"
                                                                className="appearance-none bg-background border border-secondary/20 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                                onChange={(e) => onEntriesChange?.(Number(e.target.value))}
                                                                defaultValue={pageSize}
                                                        >
                                                                <option value={10}>10</option>
                                                                <option value={25}>25</option>
                                                                <option value={50}>50</option>
                                                                <option value={100}>100</option>
                                                        </select>
                                                        <IoChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary" />
                                                </div>
                                        </div>
                                </div>

                                <div className="flex items-center gap-2 justify-end lg:justify-start">
                                        <Button
                                                onClick={onFilterClick}
                                                className="text-foreground/70 text-sm cursor-pointer px-4 py-2 hidden lg:flex justify-center items-center gap-2 border border-secondary/20 bg-background"
                                        >
                                                <GoFilter />
                                                <span>Filter</span>
                                        </Button>
                                        <Button
                                                onClick={onModifyColumnClick}
                                                className="text-foreground/70 text-sm cursor-pointer px-4 py-2 hidden lg:flex justify-center items-center gap-2 border border-secondary/20 bg-background"
                                        >
                                                <TbColumns2 />
                                                <span>Modify Column</span>
                                        </Button>
                                        <Button
                                                size=""
                                                className="flex justify-center items-center px-3 py-2 border border-secondary/20 gap-2 lg:hidden"
                                                onClick={() => setToolsDropdown(!toolsDropdown)}
                                        >
                                                <TbDotsVertical />
                                        </Button>
                                        {toolsDropdown && (
                                                <Dropdown position="right-0 top-15" shadow="shadow-lg">
                                                </Dropdown>
                                        )}
                                </div>
                        </div>

                        <div className="overflow-x-auto">{children}</div>

                        {onPageChange && total > 0 && totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm text-muted-foreground w-full">
                                        <div className="order-2 sm:order-1">
                                                Menampilkan {startEntry} - {endEntry} dari {total} data
                                        </div>
                                        <div className="flex items-center gap-1 order-1 sm:order-2">
                                                <Button
                                                        onClick={() => onPageChange(page - 1)}
                                                        disabled={page === 1}
                                                        className="px-3 py-1 h-8 bg-background border border-secondary/20 hover:bg-secondary/10 disabled:opacity-50 text-foreground text-xs font-medium"
                                                >
                                                        <FaChevronLeft />
                                                </Button>

                                                {(() => {
                                                        const items = [];
                                                        // Always show first
                                                        items.push(1);

                                                        if (page > 3) {
                                                                items.push('...');
                                                        }

                                                        // Neighbors
                                                        const start = Math.max(2, page - 1);
                                                        const end = Math.min(totalPages - 1, page + 1);

                                                        for (let i = start; i <= end; i++) {
                                                                items.push(i);
                                                        }

                                                        if (page < totalPages - 2) {
                                                                items.push('...');
                                                        }

                                                        // Always show last if > 1
                                                        if (totalPages > 1) {
                                                                items.push(totalPages);
                                                        }

                                                        // Handle simple cases where logic above duplicates or misses (small totalPages)
                                                        // Simplified logic for small numbers:
                                                        // If totalPages <= 5, show all.

                                                        let finalItems = [];
                                                        if (totalPages <= 5) {
                                                                finalItems = Array.from({ length: totalPages }, (_, i) => i + 1);
                                                        } else {
                                                                finalItems = items;
                                                                // Deduplicate just in case logic overlaps
                                                                finalItems = [...new Set(items)];
                                                        }

                                                        return finalItems.map((item, idx) => (
                                                                <Button
                                                                        key={idx}
                                                                        onClick={() => typeof item === 'number' ? onPageChange(item) : undefined}
                                                                        disabled={item === '...'}
                                                                        className={`px-3 py-1 h-8 min-w-[32px] rounded-md text-xs font-medium transition-colors border
                                                                                ${item === page
                                                                                        ? "bg-primary text-background border-primary hover:bg-primary/90"
                                                                                        : "bg-background text-foreground border-secondary/20 hover:bg-secondary/10"
                                                                                }
                                                                                ${item === '...' ? 'cursor-default hover:bg-background border-none' : ''}
                                                                        `}
                                                                >
                                                                        {item}
                                                                </Button>
                                                        ));
                                                })()}

                                                <Button
                                                        onClick={() => onPageChange(page + 1)}
                                                        disabled={page === totalPages}
                                                        className="px-3 py-1 h-8 bg-background border border-secondary/20 hover:bg-secondary/10 disabled:opacity-50 text-foreground text-xs font-medium"
                                                >
                                                        <FaChevronRight />
                                                </Button>
                                        </div>
                                </div>
                        )}
                </div>
        );
};