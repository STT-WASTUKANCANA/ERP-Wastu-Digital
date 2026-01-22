import * as React from "react";
import { IoChevronDown, IoClose } from "react-icons/io5";

export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

export interface MultiSelectProps {
    label?: string;
    options: SelectOption[];
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    placeholder?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    label,
    options = [],
    value = [],
    onChange,
    placeholder = "Select options",
    error,
    className = "",
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleOption = (optionValue: string | number) => {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    const removeValue = (e: React.MouseEvent, valToRemove: string | number) => {
        e.stopPropagation();
        onChange(value.filter((v) => v !== valToRemove));
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`} ref={containerRef}>
            {label && (
                <label className="text-sm font-medium text-foreground">
                    {label}
                </label>
            )}
            <div className="relative w-full">
                <div
                    className={`min-h-[42px] w-full rounded-md ${disabled ? 'bg-accent pointer-events-none' : 'bg-background cursor-pointer'} border ${error ? 'border-red-500 border-2' : 'border-secondary/20'} py-1.5 px-3 flex flex-wrap gap-2 items-center justify-between`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <div className="flex flex-wrap gap-2 flex-1">
                        {value.length > 0 ? (
                            value.map((val) => {
                                const option = options.find((o) => o.value == val); // loose equality for string/number match
                                return (
                                    <span
                                        key={val}
                                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md flex items-center gap-1 border border-primary/20"
                                    >
                                        {option?.label || val}
                                        <IoClose
                                            className="w-3 h-3 hover:text-red-500 cursor-pointer"
                                            onClick={(e) => removeValue(e, val)}
                                        />
                                    </span>
                                );
                            })
                        ) : (
                            <span className="text-secondary/50 text-sm">{placeholder}</span>
                        )}
                    </div>
                    <IoChevronDown className={`w-4 h-4 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {isOpen && !disabled && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-secondary/20 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {options.length > 0 ? (
                            options.map((option) => (
                                <div
                                    key={option.value}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-secondary/5 flex items-center gap-2 ${value.includes(option.value) ? 'bg-primary/5 text-primary font-medium' : 'text-foreground'}`}
                                    onClick={() => toggleOption(option.value)}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${value.includes(option.value) ? 'bg-primary border-primary' : 'border-secondary/30'}`}>
                                        {value.includes(option.value) && <IoChevronDown className="w-3 h-3 text-white" />}
                                    </div>
                                    <span>{option.label}</span>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-secondary">No options available</div>
                        )}
                    </div>
                )}
            </div>
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
};
