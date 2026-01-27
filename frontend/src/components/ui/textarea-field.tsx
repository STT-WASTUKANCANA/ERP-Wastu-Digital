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
    error?: string;
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
    error,
}: TextareaFieldProps) {
    const inputId = id || name;
    const bgClass = disabled ? "bg-accent" : "bg-background";
    const borderClass = error ? "border-red-500 border-2" : "border border-secondary/20";

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
                className={`mt-4 block w-full rounded-md ${borderClass} p-2 text-sm ${bgClass}`}
            />
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
}
