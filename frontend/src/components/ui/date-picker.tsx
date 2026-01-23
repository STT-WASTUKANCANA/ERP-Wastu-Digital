"use client"

import * as React from "react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { IoCalendar, IoChevronBack, IoChevronForward } from "react-icons/io5"
import { cn } from "@/lib/utils"

interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    label,
    placeholder = "Pilih tanggal",
    error,
    disabled = false,
    className,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (date: Date | undefined) => {
        onChange(date);
        setIsOpen(false);
    };

    return (
        <div className={cn("flex flex-col gap-2", className)} ref={containerRef}>
            {label && (
                <label className="text-sm font-medium text-foreground">
                    {label}
                </label>
            )}
            <div className="relative">
                <div
                    className={cn(
                        "w-full min-h-[42px] px-3 py-2 text-sm rounded-md flex items-center justify-between border cursor-pointer bg-background transition-colors",
                        error ? "border-red-500" : "border-secondary/20 hover:bg-accent/50",
                        disabled && "opacity-50 cursor-not-allowed bg-accent",
                        isOpen && "ring-1 ring-foreground"
                    )}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <span className={cn("flex items-center gap-2", !value && "text-secondary/50")}>
                        <IoCalendar className="w-4 h-4 text-secondary" />
                        {value ? format(value, "dd MMMM yyyy", { locale: idLocale }) : placeholder}
                    </span>
                </div>

                {isOpen && !disabled && (
                    <div className="absolute z-50 mt-1 p-3 bg-background border border-secondary/20 rounded-md shadow-lg w-auto min-w-[280px]">
                        <DayPicker
                            mode="single"
                            selected={value}
                            onSelect={handleSelect}
                            locale={idLocale}
                            showOutsideDays
                            className="p-0 border-0"
                            classNames={{
                                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                month: "space-y-4",
                                caption: "flex justify-center pt-1 relative items-center",
                                caption_label: "text-sm font-medium",
                                nav: "space-x-1 flex items-center",
                                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center rounded-md border border-secondary/20 hover:bg-secondary/10",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell: "text-secondary rounded-md w-9 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md flex items-center justify-center cursor-pointer",
                                day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
                                day_today: "bg-accent text-foreground",
                                day_outside: "text-secondary opacity-50",
                                day_disabled: "text-secondary opacity-50",
                                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                day_hidden: "invisible",
                            }}
                            components={{
                                IconLeft: () => <IoChevronBack className="h-4 w-4" />,
                                IconRight: () => <IoChevronForward className="h-4 w-4" />,
                            }}
                        />
                    </div>
                )}
            </div>
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    )
}
