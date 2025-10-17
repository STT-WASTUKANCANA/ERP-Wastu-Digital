import * as React from "react";
import { IoChevronDown } from 'react-icons/io5';

export interface SelectOption {
        value: string | number;
        label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
        label?: string;
        width?: string;
        border?: string;
        options: SelectOption[];
        placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
        label,
        options = [],
        placeholder,
        width = "w-full",
        className = "",
        border = "border border-secondary/20",
        id,
        ...props
}) => {
        const selectId = id || React.useId();

        return (
                <div className={`${width} flex flex-col gap-4`}>
                        {label && (
                                <label
                                        htmlFor={selectId}
                                        className="text-sm font-medium text-foreground"
                                >
                                        {label}
                                </label>
                        )}
                        <div className="relative w-full">
                                <select
                                        id={selectId}
                                        className={`
            appearance-none
            w-full rounded-md bg-background 
            focus:outline-none focus:ring-1 focus:ring-foreground 
            ${border} py-2 pl-3 pr-8 cursor-pointer
            text-sm ${className}
          `}
                                        {...props}
                                >
                                        {placeholder && (
                                                <option value="" disabled>
                                                        {placeholder}
                                                </option>
                                        )}
                                        {options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                        {option.label}
                                                </option>
                                        ))}
                                </select>
                                <IoChevronDown
                                        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary"
                                />
                        </div>
                </div>
        );
};