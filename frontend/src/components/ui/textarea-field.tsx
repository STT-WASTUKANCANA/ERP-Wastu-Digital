"use client";

import React from 'react';

interface TextareaFieldProps {
    label: string;
    id?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    className?: string;
}

export function TextareaField({
    label,
    id,
    name,
    value,
    onChange,
    placeholder = "",
    rows = 4,
    disabled = false,
    className = "",
}: TextareaFieldProps) {
    const inputId = id || name;
    const bgClass = disabled ? "bg-accent" : "bg-background";

    return (
        <div className={className}>
            <label htmlFor={inputId} className="text-sm font-medium text-foreground">
                {label}
            </label>
            <textarea
                id={inputId}
                name={name}
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`mt-4 block w-full rounded-md border border-gray-300 p-2 text-sm ${bgClass}`}
            />
        </div>
    );
}
