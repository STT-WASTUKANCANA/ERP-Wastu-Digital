"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
import { Input } from '@/components/ui/input';
import { TbColumns2, TbDotsVertical } from 'react-icons/tb';
import { IoChevronDown } from 'react-icons/io5';
import { GoFilter } from 'react-icons/go';
import { TableContainerProps } from '@/types/ui-props';

export const TableContainer = ({
        onSearchChange,
        onFilterClick,
        onModifyColumnClick,
        onEntriesChange,
        children,
}: TableContainerProps) => {
        const [toolsDropdown, setToolsDropdown] = useState(false);

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
                </div>
        );
};