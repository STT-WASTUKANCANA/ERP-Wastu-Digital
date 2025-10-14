import { InputProps } from "@/types/ui-props";
import * as React from "react";

export const Input: React.FC<InputProps> = ({
        label,
        type = "text",
        placeholder,
        width = "w-full",
        className = "",
        border = "border border-secondary/20",
        id,
        ...props
}) => {
        const inputId = id || React.useId();

        return (
                <div className={`${width} flex flex-col gap-4`}>
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
                                className={`rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-foreground ${border} py-2 px-3 text-sm ${className}`}
                                {...props}
                        />
                </div>
        );
};
