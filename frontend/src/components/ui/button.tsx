"use client";

import { ButtonProps } from "@/types/ui-props";
import { useRouter } from "next/navigation";
import * as React from "react";

export const Button: React.FC<ButtonProps> = ({
        children,
        size = "w-full",
        color = "",
        className = "",
        route,
        disabled = false,
        onClick,
        rounded = "rounded-md",
        type = "button",
}) => {
        const router = useRouter();

        const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
                if (disabled) return;
                onClick?.(e);
                if (route) router.push(route);
        };

        return (
                <button
                        type={type}
                        onClick={handleClick}
                        disabled={disabled}
                        className={`
                                ${size} ${color} ${rounded} ${className}
                                font-medium
                                transition-all duration-150
                                hover:opacity-90 active:scale-95
                                disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                >
                        {children}
                </button>
        );
};
