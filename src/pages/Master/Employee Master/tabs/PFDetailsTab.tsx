import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FieldConfig {
    key: string;
    type: "text" | "number" | "email" | "date" | "checkbox" | "select";
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    options?: string[];
    defaultValue?: string;
    defaultChecked?: boolean;
    className?: string;
}

export default function PFDetailsTab() {
    const [dateValues, setDateValues] = useState<Record<string, string>>({});
    const [notProperDate, setNotProperDate] = useState(false);

    const stateOptions = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
    ];

    const bankFields: FieldConfig[] = [
        { key: "bankName", type: "text", label: "Bank Name*", placeholder: "Enter Bank Name" },
        { key: "branchName", type: "text", label: "Branch Name*", placeholder: "Enter Branch Name" },
        { key: "add1", type: "text", label: "Add1", placeholder: "Enter Address Line 1" },
        { key: "add2", type: "text", label: "Add2", placeholder: "Enter Address Line 2" },
        { key: "city", type: "text", label: "City*", placeholder: "Enter City" },
        { key: "district", type: "text", label: "District*", placeholder: "Enter District" },
        { key: "state", type: "select", label: "State*", placeholder: "Select State", options: stateOptions },
        { key: "pin", type: "text", label: "Pin*", placeholder: "Enter PIN Code" },
        { key: "email", type: "email", label: "E-Mail", placeholder: "Enter Email Address" }
    ];

    const personalFields: FieldConfig[] = [
        // Row 1 (4 fields)
        { key: "uanNo", type: "text", label: "UAN No.", placeholder: "Enter UAN Number" },
        { key: "rationCardNo", type: "text", label: "Ration Card No.", placeholder: "Enter Ration Card Number" },
        { key: "physicallyHandiCat", type: "text", label: "Physically Handi Cat.", placeholder: "Enter Category" },
        { key: "educationQua", type: "text", label: "Education Qua.", placeholder: "Enter Qualification" },

        // Row 2 (4 fields)
        { key: "nationalPopulation", type: "text", label: "National Population", placeholder: "Enter National Population" },
        { key: "aadharNo", type: "text", label: "Aadhar No.", placeholder: "Enter Aadhar Number" },
        { key: "passportNo", type: "text", label: "Passport No.", placeholder: "Enter Passport Number" },
        { key: "passportExpDate", type: "date", label: "Passport Exp. Date", placeholder: "Select Date" },

        // Row 3 (4 fields)
        { key: "drivingLicenseNo", type: "text", label: "Driving License No.", placeholder: "Enter Driving License No." },
        { key: "licenseExpDate", type: "date", label: "License Exp. Date", placeholder: "Select Date" },
        { key: "electionCardNo", type: "text", label: "Election Card No.", placeholder: "Enter Election Card Number" },
        { key: "pfUpperLimit", type: "text", label: "PF Upper Limit", placeholder: "0.00" },

        // Row 4 (4 fields)
        { key: "panCardName", type: "text", label: "PAN Card Name", placeholder: "Enter PAN Card Name" },
        { key: "aadharName", type: "text", label: "Aadhar Name", placeholder: "Enter Aadhar Name" },
        { key: "aadharDob", type: "date", label: "Aadhar DOB", placeholder: "Select Date" },
        { key: "notProperDate", type: "checkbox", label: "Not Proper Date" },

        // Row 5 (3 fields)
        { key: "year", type: "text", label: "Year", placeholder: "Enter Year" },
        { key: "pfName", type: "text", label: "PF Name", placeholder: "Enter PF Name" },
        { key: "fatherNameAadhar", type: "text", label: "Father Name as per Aadhar Card", placeholder: "Enter Father Name as per Aadhar Card" }
    ];

    const renderField = (field: FieldConfig) => {
        return (
            <div key={field.key} className="flex flex-col gap-1.5">
                {field.type === "checkbox" ? (
                    <div className="flex flex-col gap-2 justify-end pb-1 h-full">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            {field.label}
                        </Label>
                        <Checkbox
                            id={field.key}
                            checked={notProperDate}
                            onCheckedChange={(checked) => setNotProperDate(!!checked)}
                            className="w-5 h-5 border-gray-300 rounded"
                        />
                    </div>
                ) : (
                    <>
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {field.label}
                        </Label>

                        {field.type === "select" ? (
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                            {opt}
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
                            />
                        ) : (
                            <Input
                                type={field.type}
                                placeholder={field.placeholder}
                                className="w-full"
                            />
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <Card className="p-4 gap-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
                {/* Card Title & Icon */}
                <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-theme/10 rounded-lg mt-0.5">
                        <ShieldCheck className="w-5 h-5 text-theme" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-base font-bold text-[#202C4B] dark:text-white leading-tight">
                            PF Details
                        </h2>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Provident Fund related information
                        </span>
                    </div>
                </div>

                <Separator variant="light" />

                {/* Bank Details Section */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-theme mb-5">
                        Bank Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-4">
                        {bankFields.map(renderField)}
                    </div>
                </div>

                <Separator variant="light" />

                {/* Personal Details Section */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-theme mb-5">
                        Personal Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-4">
                        {personalFields.map(renderField)}
                    </div>
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