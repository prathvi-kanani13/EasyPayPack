import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Receipt, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FieldOption {
    value: string;
    label: string;
}

interface FieldConfig {
    key: string;
    type: "text" | "number" | "date" | "checkbox" | "select";
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    options?: FieldOption[];
    defaultValue?: string;
    defaultChecked?: boolean;
}

export default function PaySlipTab() {
    const [dateValues, setDateValues] = useState<Record<string, string>>({});

    const payslipFields: FieldConfig[] = [
        {
            key: "flag",
            type: "select",
            label: "Flag*",
            defaultValue: "New",
            options: [
                { value: "New", label: "New" },
                { value: "Old", label: "Old" },
                { value: "Transfer", label: "Transfer" },
            ],
        },

        {
            key: "category",
            type: "select",
            label: "Category*",
            defaultValue: "W",
            options: [
                { value: "W", label: "W" },
                { value: "M", label: "M" },
                { value: "S", label: "S" },
            ],
        },

        {
            key: "hrCompany",
            type: "select",
            label: "HR Company*",
            defaultValue: "THE GANDHIDHAM MERCANTILE CO. OP.",
            options: [
                { value: "THE GANDHIDHAM MERCANTILE CO. OP.", label: "THE GANDHIDHAM MERCANTILE CO. OP." },
                { value: "BANKAI INFORMATICS PVT. LTD.", label: "BANKAI INFORMATICS PVT. LTD." },
            ],
        },

        {
            key: "branch",
            type: "select",
            label: "Branch*",
            defaultValue: "Gandhidham HO",
            options: [
                { value: "Gandhidham HO", label: "Gandhidham HO" },
                { value: "Adipur Branch", label: "Adipur Branch" },
            ],
        },

        {
            key: "accountCompany",
            type: "select",
            label: "Account Company*",
            defaultValue: "BANKAI INFORMATICS PVT. LTD.",
            options: [
                { value: "BANKAI INFORMATICS PVT. LTD.", label: "BANKAI INFORMATICS PVT. LTD." },
                { value: "THE GANDHIDHAM MERCANTILE CO. OP.", label: "THE GANDHIDHAM MERCANTILE CO. OP." },
            ],
        },

        {
            key: "department",
            type: "select",
            label: "Department*",
            defaultValue: "GENERAL",
            options: [
                { value: "GENERAL", label: "GENERAL" },
                { value: "HR", label: "HR" },
                { value: "FINANCE", label: "FINANCE" },
                { value: "IT", label: "IT" },
            ],
        },

        {
            key: "incrementDt",
            type: "date",
            label: "Increment Dt.*",
            placeholder: "Select Date",
        },

        {
            key: "designation",
            type: "select",
            label: "Designation*",
            defaultValue: "OFF",
            options: [
                { value: "OFF", label: "OFF" },
                { value: "MGR", label: "MGR" },
                { value: "CLK", label: "CLK" },
            ],
        },

        {
            key: "promotionDt",
            type: "date",
            label: "Promotion Dt.",
            placeholder: "Select Date",
        },

        {
            key: "grade",
            type: "select",
            label: "Grade*",
            defaultValue: "OFF",
            options: [
                { value: "OFF", label: "OFF" },
                { value: "A", label: "A" },
                { value: "B", label: "B" },
            ],
        },

        {
            key: "reasonOfChange",
            type: "select",
            label: "Reason Of Change",
            placeholder: "Select reason",
            options: [
                { value: "Promotion", label: "Promotion" },
                { value: "Increment", label: "Increment" },
                { value: "Transfer", label: "Transfer" },
            ],
        },

        {
            key: "incrementTemplate",
            type: "select",
            label: "Increment Template*",
            placeholder: "Select template",
            options: [
                { value: "Template A", label: "Template A" },
                { value: "Template B", label: "Template B" },
            ],
        },

        {
            key: "fromDt",
            type: "date",
            label: "From Dt.*",
            placeholder: "Select Date",
        },

        {
            key: "incrementTemplCounter",
            type: "text",
            label: "Increment Templ. Counter*",
            defaultValue: "0",
        },

        {
            key: "tillDate",
            type: "date",
            label: "Till Date",
            placeholder: "Select Date",
        },

        {
            key: "active",
            type: "checkbox",
            label: "Active*",
            defaultChecked: true,
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <Card className="p-4 gap-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
                {/* Title and Icon */}
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-theme/10 rounded-lg">
                        <Receipt className="w-5 h-5 text-theme" />
                    </div>
                    <h2 className="text-base font-bold text-[#202C4B] dark:text-white">
                        Pay Slip Information
                    </h2>
                </div>

                {/* 4-Column Responsive Grid matching the screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mb-6 gap-x-6 gap-y-4">
                    {payslipFields.map((field) => {
                        return (
                            <div key={field.key} className="flex flex-col gap-1.5">
                                {field.type === "checkbox" ? (
                                    <div className="flex flex-col gap-2 justify-end pb-1 h-full">
                                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {field.label}
                                        </Label>
                                        <Checkbox
                                            id={field.key}
                                            defaultChecked={field.defaultChecked}
                                            className="w-5 h-5 border-gray-300 rounded"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {field.label}
                                        </Label>

                                        {field.type === "select" ? (
                                            <Select defaultValue={field.defaultValue}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={field.placeholder} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {field.options?.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : field.type === "date" ? (
                                            <DatePickerInput
                                                value={dateValues[field.key] || ""}
                                                onChange={(val) => setDateValues((p) => ({ ...p, [field.key]: val }))}
                                                placeholder={field.placeholder}
                                                className="w-full"
                                                disabled={field.disabled}
                                            />
                                        ) : (
                                            <Input
                                                type={field.type}
                                                defaultValue={field.defaultValue}
                                                placeholder={field.placeholder}
                                                disabled={field.disabled}
                                                className="w-full"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                <Separator variant="light" />

                {/* Footer Navigation Buttons */}
                <div className="flex items-center justify-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-600 dark:text-gray-400 cursor-pointer"
                    >
                        <ChevronsLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-600 dark:text-gray-400 cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-600 dark:text-gray-400 cursor-pointer"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-600 dark:text-gray-400 cursor-pointer"
                    >
                        <ChevronsRight className="w-5 h-5" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}