import { InputProps } from "@/types/shared/ui";
import * as React from "react";

export const Input: React.FC<InputProps> = ({
        label,
        type = "text",
        placeholder,
        width = "w-full",
        className = "",
        border = "border border-secondary/20",
        id,
        error,
        ...props
}) => {
        const inputId = id || React.useId();

        return (
                <div className={`${width} flex flex-col gap-2`}>
                        {label && (
                                <label
                                        htmlFor={inputId}
                                        className="text-sm font-medium text-foreground"
                                >
                                        {label}
                                </label>
                        )}
                        <input
                                id={inputId}
                                type={type}
                                placeholder={placeholder}
                                className={`rounded-md ${props.disabled ? 'bg-accent' : 'bg-background'} focus:outline-none focus:ring-1 focus:ring-foreground ${error ? 'border-red-500 border-2' : border} py-2 px-3 text-sm ${className}`}
                                {...props}
                                autoComplete="off"
                        />
                        {error && (
                                <span className="text-xs text-red-500">{error}</span>
                        )}
                </div>
        );
};

