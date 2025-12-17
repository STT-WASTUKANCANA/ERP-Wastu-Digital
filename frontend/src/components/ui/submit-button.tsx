"use client";

import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
    loading: boolean;
    loadingText?: string;
    submitText: string;
    className?: string;
}

export function SubmitButton({
    loading,
    loadingText = "Memproses...",
    submitText,
    className = "w-full",
}: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            disabled={loading}
            className={`${className} bg-primary text-white px-4 py-2 rounded-md hover:brightness-90 transition`}
        >
            {loading ? loadingText : submitText}
        </Button>
    );
}
