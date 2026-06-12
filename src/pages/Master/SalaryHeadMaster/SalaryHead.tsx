import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    const [shortName, setShortName] = useState("BE ESIC");
    const [description, setDescription] = useState("BANK ESIC");
    const [active, setActive] = useState(true);
    const [financialAccCode, setFinancialAccCode] = useState("1");
    const [roundingBaseAmount, setRoundingBaseAmount] = useState("2222222222.22");
    const [crDr, setCrDr] = useState("Credit");
    const [displayOrder, setDisplayOrder] = useState("31");
    const [groupOn, setGroupOn] = useState("be esic");

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

    const addRow = () => {
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
    };

    const updateRow = (id: number, key: keyof MappingRow, value: string) => {
        setRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row));
    };

    const deleteRow = (id: number) => {
        setRows(prev => prev.filter(row => row.id !== id));
    };

    const handlePopulate = () => {
        setRows([
            { id: Date.now() + 1, bank: "801", branch: "1001", type: "GL", code: "000111", code1: "801", code2: "1001" },
            { id: Date.now() + 2, bank: "801", branch: "1002", type: "GL", code: "000111", code1: "801", code2: "1002" },
            { id: Date.now() + 3, bank: "801", branch: "1003", type: "GL", code: "000111", code1: "801", code2: "1003" },
            { id: Date.now() + 4, bank: "801", branch: "9999", type: "GL", code: "000111", code1: "801", code2: "9999" }
        ]);
    };

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
                                    placeholder="e.g. BE ESIC"
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
                                    placeholder="e.g. BANK ESIC"
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
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select" />
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
                                    className="h-10 border-slate-200 dark:border-slate-800 text-xs dark:text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                                    Group On<span className="text-red-500 ml-0.5">*</span>
                                </Label>
                                <Select value={groupOn} onValueChange={setGroupOn}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select" />
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
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <RadioGroupItem value="Earning" id="earning" />
                                        <Label htmlFor="earning" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                            Earning
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <RadioGroupItem value="Deduction" id="deduction" />
                                        <Label htmlFor="deduction" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                            Deduction
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="flex items-center gap-2.5 md:pt-6">
                                <Checkbox
                                    id="otherIntegration"
                                    checked={otherIntegration}
                                    onCheckedChange={(checked) => setOtherIntegration(!!checked)}
                                />
                                <Label htmlFor="otherIntegration" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    Other Integration
                                </Label>
                            </div>

                            <div className="flex items-center gap-2.5 md:pt-6">
                                <Checkbox
                                    id="roundOff"
                                    checked={roundOff}
                                    onCheckedChange={(checked) => setRoundOff(!!checked)}
                                />
                                <Label htmlFor="roundOff" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    Round Off<span className="text-red-500 ml-0.5">*</span>
                                </Label>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="considerItax"
                                    checked={considerItax}
                                    onCheckedChange={(checked) => setConsiderItax(!!checked)}
                                />
                                <Label htmlFor="considerItax" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    Consider ITAX
                                </Label>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="loanHead"
                                    checked={loanHead}
                                    onCheckedChange={(checked) => setLoanHead(!!checked)}
                                />
                                <Label htmlFor="loanHead" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    Loan Head
                                </Label>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="componentCalculation"
                                    checked={componentCalculation}
                                    onCheckedChange={(checked) => setComponentCalculation(!!checked)}
                                />
                                <Label htmlFor="componentCalculation" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    Component Calculation
                                </Label>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="statutoryDeduction"
                                    checked={statutoryDeduction}
                                    onCheckedChange={(checked) => setStatutoryDeduction(!!checked)}
                                />
                                <Label htmlFor="statutoryDeduction" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    Statutory Deduction
                                </Label>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="ctcHead"
                                    checked={ctcHead}
                                    onCheckedChange={(checked) => setCtcHead(!!checked)}
                                />
                                <Label htmlFor="ctcHead" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    CTC Head
                                </Label>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="displayInPayslip"
                                    checked={displayInPayslip}
                                    onCheckedChange={(checked) => setDisplayInPayslip(!!checked)}
                                />
                                <Label htmlFor="displayInPayslip" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    Display In Payslip
                                </Label>
                            </div>
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

                            <div className="overflow-x-auto w-full border dark:border-slate-800 rounded-lg">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                                            <th className="p-3 w-12 text-center">#</th>
                                            <th className="p-3 min-w-[120px]">Bank</th>
                                            <th className="p-3 min-w-[120px]">Branch</th>
                                            <th className="p-3 min-w-[100px]">Type</th>
                                            <th className="p-3 min-w-[120px]">Code</th>
                                            <th className="p-3 min-w-[180px]">Mapping Codes</th>
                                            <th className="p-3 w-16 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {rows.map((row, index) => (
                                            <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                                                <td className="p-3 text-center font-bold text-red-500">{index + 1}.</td>
                                                <td className="p-3">
                                                    <Input
                                                        value={row.bank}
                                                        onChange={(e) => updateRow(row.id, "bank", e.target.value)}
                                                        className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <Input
                                                        value={row.branch}
                                                        onChange={(e) => updateRow(row.id, "branch", e.target.value)}
                                                        className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <Select
                                                        value={row.type}
                                                        onValueChange={(val) => updateRow(row.id, "type", val)}
                                                    >
                                                        <SelectTrigger className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="GL" className="cursor-pointer">GL</SelectItem>
                                                            <SelectItem value="SL" className="cursor-pointer">SL</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="p-3">
                                                    <Input
                                                        value={row.code}
                                                        onChange={(e) => updateRow(row.id, "code", e.target.value)}
                                                        className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white"
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={row.code1}
                                                            onChange={(e) => updateRow(row.id, "code1", e.target.value)}
                                                            className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white w-1/2"
                                                        />
                                                        <Input
                                                            value={row.code2}
                                                            onChange={(e) => updateRow(row.id, "code2", e.target.value)}
                                                            className="h-9 text-xs border-slate-200 dark:border-slate-800 bg-transparent dark:text-white w-1/2"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                                                        onClick={() => deleteRow(row.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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