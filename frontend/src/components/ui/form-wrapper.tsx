"use client";

import React from 'react';

interface FormWrapperProps {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    className?: string;
}

export function FormWrapper({ children, onSubmit, className = '' }: FormWrapperProps) {
    return (
        <form onSubmit={onSubmit}>
            <div className={`bg-white p-8 rounded-lg shadow space-y-8 ${className}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
                    {children}
                </div>
            </div>
        </form>
    );
}
