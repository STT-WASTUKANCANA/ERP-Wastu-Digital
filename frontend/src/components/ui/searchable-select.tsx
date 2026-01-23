import * as React from "react";
import { IoChevronDown, IoSearch, IoClose } from "react-icons/io5";

export interface SearchableSelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

export interface SearchableSelectProps {
    label?: string;
    options: SearchableSelectOption[];
    value: string | number | null | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
    border?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    label,
    options = [],
    value,
    onChange,
    placeholder = "Pilih opsi",
    searchPlaceholder = "Cari...",
    error,
    className = "",
    disabled = false,
    border = "border border-secondary/20",
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Close dropdown when clicking outside
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

    // Focus input when opened
    React.useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Reset search when closed
    React.useEffect(() => {
        if (!isOpen) {
            setSearchTerm("");
        }
    }, [isOpen]);

    const filteredOptions = React.useMemo(() => {
        if (!searchTerm) return options;
        const lowerTerm = searchTerm.toLowerCase();
        return options.filter(
            (opt) => opt.label.toLowerCase().includes(lowerTerm)
        );
    }, [options, searchTerm]);

    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    const handleSelect = (val: string | number) => {
        onChange(String(val));
        setIsOpen(false);
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`} ref={containerRef}>
            {label && (
                <label className="text-sm font-medium text-foreground">
                    {label}
                </label>
            )}
            <div className="relative w-full">
                {/* Trigger Button */}
                <div
                    className={`
                        w-full min-h-[42px] px-3 py-2 text-sm rounded-md flex items-center justify-between
                        ${disabled ? 'bg-accent pointer-events-none' : 'bg-background cursor-pointer'}
                        ${error ? 'border-red-500 border-2' : border}
                        focus:outline-none focus:ring-1 focus:ring-foreground
                    `}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <span className={`block truncate ${!selectedOption ? 'text-secondary/50' : 'text-foreground'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <IoChevronDown className={`w-4 h-4 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Content */}
                {isOpen && !disabled && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-secondary/20 rounded-md shadow-lg overflow-hidden">
                        {/* Search Input */}
                        <div className="p-2 border-b border-secondary/10 bg-accent/30">
                            <div className="relative">
                                <IoSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full pl-9 pr-3 py-1.5 text-sm bg-background border border-secondary/20 rounded-md focus:outline-none focus:border-primary"
                                    placeholder={searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-60 overflow-y-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`
                                            px-3 py-2 text-sm cursor-pointer hover:bg-secondary/5
                                            ${String(value) === String(option.value) ? 'bg-primary/5 text-primary font-medium' : 'text-foreground'}
                                        `}
                                        onClick={() => handleSelect(option.value)}
                                    >
                                        {option.label}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-4 text-center text-sm text-secondary">
                                    Tidak ada hasil.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
};
