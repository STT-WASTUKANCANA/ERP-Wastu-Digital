"use client";

import { useState, type ReactNode } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface CollapseProps {
        title: string;
        children: ReactNode;
        className?: string;
}

export const Collapse = ({ title, children, className }: CollapseProps) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
                <div className={`w-full space-y-2 ${className}`}>
                        <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full flex justify-between items-center bg-accent text-gray-800 border border-secondary/20 p-4 rounded-md font-medium text-sm cursor-pointer"
                        >
                                <span>{title}</span>
                                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {isOpen && (
                                <div className="border p-2 rounded-md animate-fade-in">
                                        {children}
                                </div>
                        )}
                </div>
        );
};