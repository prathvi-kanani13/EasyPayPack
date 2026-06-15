import { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/DataTable";
import { createColumnHelper, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface MappingRow {
    id: number;
    bank: string;
    branch: string;
    type: string;
    code: string;
    code1: string;
    code2: string;
}

export default function SalaryHead() {
    const navigate = useNavigate();

    // Card 1 States
    const [shortName, setShortName] = useState("");
    const [description, setDescription] = useState("");
    const [active, setActive] = useState(true);
    const [financialAccCode, setFinancialAccCode] = useState("");
    const [roundingBaseAmount, setRoundingBaseAmount] = useState("");
    const [crDr, setCrDr] = useState("");
    const [displayOrder, setDisplayOrder] = useState("");
    const [groupOn, setGroupOn] = useState("");

    // Card 2 States
    const [earningDeduction, setEarningDeduction] = useState("Earning");
    const [otherIntegration, setOtherIntegration] = useState(true);
    const [roundOff, setRoundOff] = useState(true);
    const [considerItax, setConsiderItax] = useState(false);
    const [loanHead, setLoanHead] = useState(false);
    const [componentCalculation, setComponentCalculation] = useState(false);
    const [statutoryDeduction, setStatutoryDeduction] = useState(false);
    const [ctcHead, setCtcHead] = useState(false);
    const [displayInPayslip, setDisplayInPayslip] = useState(true);

    // Card 3 States
    const [rows, setRows] = useState<MappingRow[]>([
        { id: 1, bank: "801", branch: "1001", type: "GL", code: "000111", code1: "801", code2: "1001" },
        { id: 2, bank: "801", branch: "1002", type: "GL", code: "000111", code1: "801", code2: "1002" },
        { id: 3, bank: "801", branch: "1003", type: "GL", code: "000111", code1: "801", code2: "1003" },
        { id: 4, bank: "801", branch: "9999", type: "GL", code: "000111", code1: "801", code2: "9999" },
    ]);

    const addRow = useCallback(() => {
        setRows(prev => [
            ...prev,
            {
                id: Date.now(),
                bank: "",
                branch: "",
                type: "GL",
                code: "",
                code1: "",
                code2: ""
            }
        ]);
    }, []);

    const updateRow = useCallback((id: number, key: keyof MappingRow, value: string) => {
        setRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row));
    }, []);

    const deleteRow = useCallback((id: number) => {
        setRows(prev => prev.filter(row => row.id !== id));
    }, []);

    const handlePopulate = () => {
        setRows([
            { id: Date.now() + 1, bank: "801", branch: "1001", type: "GL", code: "000111", code1: "801", code2: "1001" },
            { id: Date.now() + 2, bank: "801", branch: "1002", type: "GL", code: "000111", code1: "801", code2: "1002" },
            { id: Date.now() + 3, bank: "801", branch: "1003", type: "GL", code: "000111", code1: "801", code2: "1003" },
            { id: Date.now() + 4, bank: "801", branch: "9999", type: "GL", code: "000111", code1: "801", code2: "9999" }
        ]);
    };

    const payrollTypeOptions = [
        { id: "earning", value: "Earning", label: "Earning" },
        { id: "deduction", value: "Deduction", label: "Deduction" },
    ];

    const payrollCheckboxItems = [
        { id: "otherIntegration", label: "Other Integration", checked: otherIntegration, setChecked: setOtherIntegration },
        { id: "roundOff", label: "Round Off", checked: roundOff, setChecked: setRoundOff, required: true },
        { id: "considerItax", label: "Consider ITAX", checked: considerItax, setChecked: setConsiderItax },
        { id: "loanHead", label: "Loan Head", checked: loanHead, setChecked: setLoanHead },
        { id: "componentCalculation", label: "Component Calculation", checked: componentCalculation, setChecked: setComponentCalculation },
        { id: "statutoryDeduction", label: "Statutory Deduction", checked: statutoryDeduction, setChecked: setStatutoryDeduction },
        { id: "ctcHead", label: "CTC Head", checked: ctcHead, setChecked: setCtcHead },
        { id: "displayInPayslip", label: "Display In Payslip", checked: displayInPayslip, setChecked: setDisplayInPayslip },
    ];

    const columnHelper = createColumnHelper<MappingRow>();
    const columns = useMemo<ColumnDef<MappingRow, any>[]>(
        () => [
            columnHelper.display({
                id: "index",
                header: "#",
                cell: (info) => (
                    <span className="font-bold text-red-500">{info.row.index + 1}.</span>
                ),
            }),
            columnHelper.accessor("bank", {
                header: "Bank",
                cell: (info) => (
                    <Input
                        value={String(info.getValue())}
                        onChange={(e) => updateRow(info.row.original.id, "bank", e.target.value)}
                        className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white"
                    />
                ),
            }),
            columnHelper.accessor("branch", {
                header: "Branch",
                cell: (info) => (
                    <Input
                        value={String(info.getValue())}
                        onChange={(e) => updateRow(info.row.original.id, "branch", e.target.value)}
                        className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white"
                    />
                ),
            }),
            columnHelper.accessor("type", {
                header: "Type",
                cell: (info) => (
                    <Select
                        value={String(info.getValue())}
                        onValueChange={(val) => updateRow(info.row.original.id, "type", val)}
                    >
                        <SelectTrigger className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="GL" className="cursor-pointer">GL</SelectItem>
                            <SelectItem value="SL" className="cursor-pointer">SL</SelectItem>
                        </SelectContent>
                    </Select>
                ),
            }),
            columnHelper.accessor("code", {
                header: "Code",
                cell: (info) => (
                    <Input
                        value={String(info.getValue())}
                        onChange={(e) => updateRow(info.row.original.id, "code", e.target.value)}
                        className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white"
                    />
                ),
            }),
            columnHelper.display({
                id: "mappingCodes",
                header: "Mapping Codes",
                cell: (info) => (
                    <div className="flex gap-2">
                        <Input
                            value={info.row.original.code1}
                            onChange={(e) => updateRow(info.row.original.id, "code1", e.target.value)}
                            className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white w-1/2"
                        />
                        <Input
                            value={info.row.original.code2}
                            onChange={(e) => updateRow(info.row.original.id, "code2", e.target.value)}
                            className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white w-1/2"
                        />
                    </div>
                ),
            }),
            columnHelper.display({
                id: "actions",
                header: "Action",
                cell: (info) => (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                        onClick={() => deleteRow(info.row.original.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                ),
            }),
        ],
        [deleteRow, updateRow]
    );

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleSave = () => {
        navigate("/salary-head/master");
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header section with Breadcrumbs */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate("/salary-head/master")}
                >
                    <ArrowLeft className="w-6 h-6 text-[#202C4B] dark:text-white mt-0.5" />
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-[#202C4B] dark:text-white leading-tight">Edit Salary Head</h1>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Master Data &gt; Salary Head Master &gt; Edit Salary Head
                        </span>
                    </div>
                </div>

                {/* Top Action buttons */}
                <div className="flex flex-1 justify-end gap-2 ml-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/salary-head/master")}
                        className="h-10 text-xs font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="h-10 text-xs font-bold bg-[#3F00E1] hover:bg-[#3200b8] text-white"
                    >
                        Save
                    </Button>
                </div>
            </div>

            {/* Form Containers: Stacked line by line */}
            <div className="flex flex-col gap-6">

                {/* Card 1: Basic Information */}
                <Card className="bg-white dark:bg-background border dark:border-slate-800 rounded-sm shadow-sm">
                    <CardContent className="p-4 space-y-6">
                        <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider border-b dark:border-slate-800 pb-3">
                            1. Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                                    Short Name<span className="text-red-500 ml-0.5">*</span>
                                </Label>
                                <Input
                                    value={shortName}
                                    onChange={(e) => setShortName(e.target.value)}
                                    className="h-10 border-slate-200 dark:border-slate-800 text-xs dark:text-white"
                                    placeholder="Enter short name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                                    Description<span className="text-red-500 ml-0.5">*</span>
                                </Label>
                                <Input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="h-10 border-slate-200 dark:border-slate-800 text-xs dark:text-white"
                                    placeholder="Enter description"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                                    Financial Acc. Code
                                </Label>
                                <Input
                                    value={financialAccCode}
                                    onChange={(e) => setFinancialAccCode(e.target.value)}
                                    className="h-10 border-slate-200 dark:border-slate-800 text-xs dark:text-white"
                                    placeholder="Enter account code"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                                    Rounding Base Amount
                                </Label>
                                <Input
                                    value={roundingBaseAmount}
                                    onChange={(e) => setRoundingBaseAmount(e.target.value)}
                                    className="h-10 border-slate-200 dark:border-slate-800 text-xs dark:text-white text-right font-mono"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                                    Cr./Dr.<span className="text-red-500 ml-0.5">*</span>
                                </Label>
                                <Select value={crDr} onValueChange={setCrDr}>
                                    <SelectTrigger className="w-full" size="lg">
                                        <SelectValue placeholder="Select Cr./Dr." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Credit" className="cursor-pointer">Credit</SelectItem>
                                        <SelectItem value="Debit" className="cursor-pointer">Debit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                                    Display Order
                                </Label>
                                <Input
                                    type="number"
                                    value={displayOrder}
                                    onChange={(e) => setDisplayOrder(e.target.value)}
                                    placeholder="0"
                                    className="h-10 border-slate-200 dark:border-slate-800 text-xs dark:text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                                    Group On<span className="text-red-500 ml-0.5">*</span>
                                </Label>
                                <Select value={groupOn} onValueChange={setGroupOn}>
                                    <SelectTrigger className="w-full" size="lg">
                                        <SelectValue placeholder="Select Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="be esic" className="cursor-pointer">be esic</SelectItem>
                                        <SelectItem value="pf" className="cursor-pointer">pf</SelectItem>
                                        <SelectItem value="pt" className="cursor-pointer">pt</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2 md:pt-7">
                                <Checkbox
                                    id="active"
                                    checked={active}
                                    onCheckedChange={(checked) => setActive(!!checked)}
                                />
                                <Label htmlFor="active" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    Active
                                </Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2: Payroll Configuration */}
                <Card className="bg-white dark:bg-background border dark:border-slate-800 rounded-sm shadow-sm">
                    <CardContent className="p-4 space-y-6">
                        <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider border-b dark:border-slate-800 pb-3">
                            2. Payroll Configuration
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
                                    Earning/Deduction<span className="text-red-500 ml-0.5">*</span>
                                </Label>
                                <RadioGroup
                                    value={earningDeduction}
                                    onValueChange={setEarningDeduction}
                                    className="flex gap-4"
                                >
                                    {payrollTypeOptions.map((option) => (
                                        <div key={option.id} className="flex items-center gap-2 cursor-pointer">
                                            <RadioGroupItem value={option.value} id={option.id} />
                                            <Label htmlFor={option.id} className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                                {option.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {payrollCheckboxItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-center gap-2.5 ${item.id === "otherIntegration" || item.id === "roundOff" ? "md:pt-6" : ""}`}
                                >
                                    <Checkbox
                                        id={item.id}
                                        checked={item.checked}
                                        onCheckedChange={(checked) => item.setChecked(!!checked)}
                                    />
                                    <Label htmlFor={item.id} className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                        {item.label}{item.required ? <span className="text-red-500 ml-0.5">*</span> : null}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: Branch / Accounts (Bank) Mapping */}
                <Card className="bg-white dark:bg-background border dark:border-slate-800 rounded-sm shadow-sm">
                    <CardContent className="p-4 space-y-6">
                        <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider border-b dark:border-slate-800 pb-3">
                            3. Branch / Accounts (Bank) Mapping
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-start">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePopulate}
                                    className="text-xs font-bold border-theme text-theme hover:bg-theme/5 h-9 cursor-pointer"
                                >
                                    Populate Branch/Accounts (Bank)
                                </Button>
                            </div>

                            <div className="rounded-lg border dark:border-slate-800">
                                <DataTable
                                    table={table}
                                    isLoading={false}
                                    isError={false}
                                    columnCount={columns.length}
                                    errorMessage="No mapping rows found."
                                />
                            </div>

                            <div className="flex justify-start">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addRow}
                                    className="text-xs font-bold border-theme text-theme hover:bg-theme/5 h-9 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Row
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}