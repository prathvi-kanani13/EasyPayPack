import { useState } from "react";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";



interface DatePickerInputProps {
    /** Currently selected date string, or empty string for no selection */
    value: string;
    /** Called with the formatted string on selection */
    onChange: (date: string) => void;
    /** The format of the `value` string. Defaults to "dd-MM-yyyy" */
    valueFormat?: string;
    /** Placeholder text shown when no date is selected */
    displayFormat?: string;
    /** Placeholder text shown when no date is selected */
    placeholder?: string;
    /** Optional className overrides on the trigger button */
    className?: string;
    /** Popover alignment relative to trigger */
    align?: "start" | "center" | "end";
    /** If true, disables selection of dates before today */
    disablePastDates?: boolean;
    /** If true, disables the input altogether */
    disabled?: boolean;
}

export function DatePickerInput({
    value,
    onChange,
    valueFormat = "dd-MM-yyyy",
    displayFormat = "dd-MM-yyyy",
    placeholder = "Select Date",
    className = "",
    align = "start",
    disablePastDates = false,
    disabled = false,
}: DatePickerInputProps) {
    const [open, setOpen] = useState(false);

    const parsed = value ? parse(value, valueFormat, new Date()) : undefined;

    return (
        <Popover open={disabled ? false : open} onOpenChange={disabled ? () => { } : setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={`w-40 h-8 justify-start text-left font-normal border-input ${!value ? "text-muted-foreground" : ""} ${className}`}
                >
                    {value && parsed && !isNaN(parsed.getTime()) ? format(parsed, displayFormat) : <span>{placeholder}</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align={align} className="p-0">
                <Calendar
                    mode="single"
                    selected={parsed}
                    onSelect={(date) => {
                        onChange(date ? format(date, valueFormat) : "");
                        setOpen(false);
                    }}
                    disabled={disablePastDates ? { before: new Date() } : undefined}
                    captionLayout="dropdown"
                    className="w-full"
                />
            </PopoverContent>
        </Popover>
    );
}
