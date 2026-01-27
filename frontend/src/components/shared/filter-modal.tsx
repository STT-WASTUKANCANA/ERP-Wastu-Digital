"use client";

import { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
    onReset: () => void;
    children: ReactNode;
    title?: string;
}

export const FilterModal = ({
    isOpen,
    onClose,
    onApply,
    onReset,
    children,
    title = "Filter Data"
}: FilterModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="lg"
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button
                        type="button"
                        onClick={onReset}
                        className="bg-background border border-zinc-200 text-foreground hover:bg-zinc-100 px-4 py-2 text-sm rounded-md"
                    >
                        Reset
                    </Button>
                    <Button
                        type="button"
                        onClick={onApply}
                        className="bg-primary text-background px-4 py-2 text-sm rounded-md hover:bg-primary/90"
                    >
                        Terapkan
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-4 py-2">
                {children}
            </div>
        </Modal>
    );
};
