"use client";

import React from "react";

type StatusBadgeProps = {
    value: number | string | boolean;
    map: Record<string, { label: string; color: string }>;
    className?: string;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ value, map, className = "" }) => {
    const key = String(value);
    const info = map[key] || { label: `Unknown (${key})`, color: "bg-gray-100 text-gray-800" };

    return (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.color} ${className}`}>
            {info.label}
        </div>
    );
};
