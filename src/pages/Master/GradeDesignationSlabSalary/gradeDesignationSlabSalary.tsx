import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layers, Plus, Search, Trash2, Info, RefreshCw, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlert } from "@/context/AlertContext";
import { Separator } from "@/components/ui/separator";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";

interface SlabRow {
    id: string;
    year: number | string;
    increment: number | string;
    basicSalary: number | string;
    basicSalaryAfterIncrement: number | string;
    efficiencyBar: boolean;
    stagnationCounter: string;
}

const initialSlabs: SlabRow[] = [
    { id: "s0", year: 0, increment: "0.00", basicSalary: "20,000.00", basicSalaryAfterIncrement: "20,000.00", efficiencyBar: false, stagnationCounter: "" },
    { id: "s1", year: 1, increment: "2,800.00", basicSalary: "22,800.00", basicSalaryAfterIncrement: "25,992.00", efficiencyBar: false, stagnationCounter: "" },
    { id: "s2", year: 2, increment: "3,192.00", basicSalary: "25,992.00", basicSalaryAfterIncrement: "29,630.88", efficiencyBar: false, stagnationCounter: "" },
    { id: "s3", year: 3, increment: "3,638.88", basicSalary: "29,630.88", basicSalaryAfterIncrement: "33,779.20", efficiencyBar: false, stagnationCounter: "" },
    { id: "s4", year: 4, increment: "4,148.32", basicSalary: "33,779.20", basicSalaryAfterIncrement: "38,508.29", efficiencyBar: false, stagnationCounter: "" },
    { id: "s5", year: 5, increment: "4,729.09", basicSalary: "38,508.29", basicSalaryAfterIncrement: "43,899.45", efficiencyBar: false, stagnationCounter: "" },
    { id: "s6", year: 6, increment: "5,391.16", basicSalary: "43,899.45", basicSalaryAfterIncrement: "50,045.37", efficiencyBar: false, stagnationCounter: "" },
    { id: "s7", year: 7, increment: "6,145.92", basicSalary: "50,045.37", basicSalaryAfterIncrement: "57,051.72", efficiencyBar: false, stagnationCounter: "" }
];

export default function GradeDesignationSlabSalary() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showAlert } = useAlert();

    const stateData = location.state || {};

    // Retrieval Filters
    const [effectiveDate, setEffectiveDate] = useState(stateData.effectiveDate || "01-01-2026");
    const [grade, setGrade] = useState(stateData.grade || "Officer");
    const [designation, setDesignation] = useState(stateData.designation || "Software Developer");
    const [status, setStatus] = useState(stateData.status || "Active");

    // Applied Filters for Notice Banner
    const [appliedFilters, setAppliedFilters] = useState({
        effectiveDate: stateData.effectiveDate || "01-01-2026",
        grade: stateData.grade || "Officer",
        designation: stateData.designation || "Software Developer",
        status: stateData.status || "Active"
    });

    // List of slab rows (holding increments and other properties)
    const [slabs, setSlabs] = useState<SlabRow[]>(initialSlabs);

    // Handle Retrieve
    const handleRetrieve = () => {
        setAppliedFilters({
            effectiveDate,
            grade,
            designation,
            status
        });
        showAlert({
            title: "Success",
            description: `Data successfully retrieved for Grade: ${grade}, Designation: ${designation}.`,
            variant: "success"
        });
    };

    // Handle Clear
    const handleClear = () => {
        setEffectiveDate("01-01-2026");
        setGrade("Officer");
        setDesignation("Software Developer");
        setStatus("Active");
    };

    // Update cell values
    const updateSlabCell = (id: string, field: keyof SlabRow, value: any) => {
        setSlabs(prev => prev.map(row => {
            if (row.id === id) {
                return { ...row, [field]: value };
            }
            return row;
        }));
    };

    // Add new slab row
    const handleAddRow = () => {
        const nextYear = slabs.length;
        const newRow: SlabRow = {
            id: `s-${Date.now()}`,
            year: nextYear,
            increment: "0.00",
            basicSalary: "0.00",
            basicSalaryAfterIncrement: "0.00",
            efficiencyBar: false,
            stagnationCounter: ""
        };
        setSlabs(prev => [...prev, newRow]);
    };

    // Delete a slab row
    const handleDeleteRow = (id: string, year: number | string) => {
        if (year === 0 || year === "0") {
            showAlert({
                title: "Warning",
                description: "Cannot delete the starting row (Year 0).",
                variant: "warning"
            });
            return;
        }

        showAlert({
            title: "Confirm Delete",
            description: `Are you sure you want to delete slab row?`,
            variant: "danger",
            confirmation: true,
            buttonText: "Delete"
        }).then((result) => {
            if (result.isConfirmed) {
                setSlabs(prev => {
                    const filtered = prev.filter(row => row.id !== id);
                    return filtered.map((row, idx) => ({
                        ...row,
                        year: idx
                    }));
                });
                showAlert({
                    title: "Success",
                    description: "Slab row deleted successfully.",
                    variant: "success"
                });
            }
        });
    };

    // New Slab initialization
    const handleNewSlab = () => {
        showAlert({
            title: "Confirm Reset",
            description: "Are you sure you want to initialize a new slab? All current slab rows will be reset.",
            variant: "warning",
            confirmation: true,
            buttonText: "Initialize"
        }).then((result) => {
            if (result.isConfirmed) {
                setSlabs([{ id: "s0", year: 0, increment: "0.00", basicSalary: "20,000.00", basicSalaryAfterIncrement: "20,000.00", efficiencyBar: false, stagnationCounter: "" }]);
                showAlert({
                    title: "Success",
                    description: "New slab initialized.",
                    variant: "success"
                });
            }
        });
    };

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                id: "srNo",
                header: () => <div className="text-left w-12 text-slate-500 font-bold uppercase tracking-wider text-xs">Sr. No.</div>,
                cell: ({ row }) => {
                    return (
                        <span className="font-bold text-red-500 pl-2">
                            {`${row.index + 1}.`}
                        </span>
                    );
                }
            },
            {
                accessorKey: "year",
                header: () => <div className="text-center w-32 text-slate-500 font-bold uppercase tracking-wider text-xs">Increment After (Year) <span className="text-red-500">*</span></div>,
                cell: ({ row }) => {
                    return (
                        <Input
                            type="text"
                            value={row.original.year}
                            onChange={(e) => updateSlabCell(row.original.id, "year", e.target.value)}
                            className="h-8 text-center text-xs border-slate-200 dark:border-gray-800 focus-visible:ring-theme w-32 mx-auto rounded-md bg-white text-slate-800 dark:bg-background dark:text-white"
                        />
                    );
                }
            },
            {
                accessorKey: "increment",
                header: () => <div className="text-center w-32 text-slate-500 font-bold uppercase tracking-wider text-xs">Amount of Increment <span className="text-red-500">*</span></div>,
                cell: ({ row }) => {
                    return (
                        <Input
                            type="text"
                            value={row.original.increment}
                            onChange={(e) => updateSlabCell(row.original.id, "increment", e.target.value)}
                            className="h-8 text-right text-xs border-slate-200 dark:border-gray-800 focus-visible:ring-theme w-32 mx-auto rounded-md font-medium bg-white text-slate-800 dark:bg-background dark:text-white"
                        />
                    );
                }
            },
            {
                accessorKey: "basicSalary",
                header: () => <div className="text-center w-32 text-slate-500 font-bold uppercase tracking-wider text-xs">Basic Salary <span className="text-red-500">*</span></div>,
                cell: ({ row }) => {
                    return (
                        <Input
                            type="text"
                            value={row.original.basicSalary}
                            onChange={(e) => updateSlabCell(row.original.id, "basicSalary", e.target.value)}
                            className="h-8 text-right text-xs border-slate-200 dark:border-gray-800 focus-visible:ring-theme w-32 mx-auto rounded-md font-semibold bg-white text-slate-800 dark:bg-background dark:text-white"
                        />
                    );
                }
            },
            {
                accessorKey: "basicSalaryAfterIncrement",
                header: () => <div className="text-center w-32 text-slate-500 font-bold uppercase tracking-wider text-xs">Basic Salary After Increment <span className="text-red-500">*</span></div>,
                cell: ({ row }) => {
                    return (
                        <Input
                            type="text"
                            value={row.original.basicSalaryAfterIncrement}
                            onChange={(e) => updateSlabCell(row.original.id, "basicSalaryAfterIncrement", e.target.value)}
                            className="h-8 text-right text-xs border-slate-200 dark:border-gray-800 focus-visible:ring-theme w-32 mx-auto rounded-md font-semibold bg-white text-slate-800 dark:bg-background dark:text-white"
                        />
                    );
                }
            },
            {
                accessorKey: "efficiencyBar",
                header: () => <div className="text-center w-24 text-slate-500 font-bold uppercase tracking-wider text-xs">Efficiency Bar</div>,
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center justify-center">
                            <Checkbox
                                checked={row.original.efficiencyBar}
                                onCheckedChange={(checked) => updateSlabCell(row.original.id, "efficiencyBar", !!checked)}
                                className="border-slate-300 dark:border-gray-700 h-4 w-4"
                            />
                        </div>
                    );
                }
            },
            {
                accessorKey: "stagnationCounter",
                header: () => <div className="text-center w-32 text-slate-500 font-bold uppercase tracking-wider text-xs">Stagnation Counter</div>,
                cell: ({ row }) => {
                    return (
                        <Input
                            type="text"
                            value={row.original.stagnationCounter}
                            placeholder=""
                            onChange={(e) => updateSlabCell(row.original.id, "stagnationCounter", e.target.value)}
                            className="h-8 text-center text-xs border-slate-200 dark:border-gray-800 focus-visible:ring-theme w-32 mx-auto rounded-md bg-white text-slate-800 dark:bg-background dark:text-white"
                        />
                    );
                }
            },
            {
                id: "actions",
                header: () => <div className="text-center w-20 text-slate-500 font-bold uppercase tracking-wider text-xs">Actions</div>,
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center justify-center gap-1.5 font-sans">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => showAlert({ title: "Edit Info", description: "You can directly edit fields inside the table cells.", variant: "info" })}
                                className="h-7 w-7 text-slate-400 hover:text-theme hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                            >
                                <Layers className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteRow(row.original.id, row.original.year)}
                                className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    );
                }
            }
        ],
        []
    );

    const tableInstance = useReactTable({
        data: slabs,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <div className="flex flex-col gap-4">

            {/* 1. Header Area */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/grade-designation/slab-list")}>
                    <ArrowLeft className="w-6 h-6 text-[#202C4B] dark:text-white" />

                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-2xl font-bold text-[#202C4B] dark:text-white flex items-center gap-2">
                            Grade / Designation wise slab salary (MST/069)
                        </h1>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Define slab structure for each Grade / Designation. This will be used in Payslip and Salary Register.
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNewSlab}
                        className="h-9 border-theme text-theme hover:bg-theme hover:text-white gap-1.5 font-semibold text-xs rounded-sm cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New Slab
                    </Button>
                </div>
            </div>

            {/* 2. Retrieval / Filter Options Card */}
            <Card className="bg-white dark:bg-background border border-gray-200 dark:border-gray-800 shadow-sm rounded-sm p-4 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-theme">Retrieval / Filter Options</h3>

                <Separator variant="light" />

                <div className="flex flex-wrap items-end gap-4">
                    {/* Effective Date */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Effective Date <span className="text-red-500">*</span>
                        </label>
                        <DatePickerInput
                            value={effectiveDate}
                            onChange={setEffectiveDate}
                            placeholder="Select Effective Date"
                            className="w-full border-slate-200 dark:border-gray-800 h-9"
                        />
                    </div>

                    {/* Grade */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Grade <span className="text-red-500">*</span>
                        </label>
                        <Select value={grade} onValueChange={setGrade}>
                            <SelectTrigger className="w-full border-slate-200 dark:border-gray-800 h-9">
                                <SelectValue placeholder="Select Grade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Officer" className="cursor-pointer">Officer</SelectItem>
                                <SelectItem value="Manager" className="cursor-pointer">Manager</SelectItem>
                                <SelectItem value="Executive" className="cursor-pointer">Executive</SelectItem>
                                <SelectItem value="Staff" className="cursor-pointer">Staff</SelectItem>
                                <SelectItem value="Trainee" className="cursor-pointer">Trainee</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Designation */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Designation <span className="text-red-500">*</span>
                        </label>
                        <Select value={designation} onValueChange={setDesignation}>
                            <SelectTrigger className="w-full border-slate-200 dark:border-gray-800 h-9">
                                <SelectValue placeholder="Select Designation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Software Developer" className="cursor-pointer">Software Developer</SelectItem>
                                <SelectItem value="Quality Analyst" className="cursor-pointer">Quality Analyst</SelectItem>
                                <SelectItem value="HR Executive" className="cursor-pointer">HR Executive</SelectItem>
                                <SelectItem value="Accountant" className="cursor-pointer">Accountant</SelectItem>
                                <SelectItem value="System Administrator" className="cursor-pointer">System Administrator</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full border-slate-200 dark:border-gray-800 h-9">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active" className="cursor-pointer">Active</SelectItem>
                                <SelectItem value="Inactive" className="cursor-pointer">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            onClick={handleRetrieve}
                            className="bg-theme hover:bg-theme/90 text-white h-9 px-4 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                        >
                            <Search className="w-3.5 h-3.5" />
                            Retrieve Data
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleClear}
                            className="border-slate-200 dark:border-gray-800 text-slate-600 dark:text-slate-300 h-9 px-4 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Clear
                        </Button>
                    </div>
                </div>

                {/* Info alert banner showing currently applied filters */}
                <div className="w-fit flex items-center gap-2 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-950 px-4 py-2.5 rounded-sm text-xs text-blue-700 dark:text-blue-400 mt-2 font-medium">
                    <Info className="w-4 h-4 shrink-0 text-blue-500" />
                    <span>
                        Data retrieved for Effective Date : <strong className="font-semibold text-blue-800 dark:text-blue-300">{appliedFilters.effectiveDate}</strong> , Grade : <strong className="font-semibold text-blue-800 dark:text-blue-300">{appliedFilters.grade}</strong> , Designation : <strong className="font-semibold text-blue-800 dark:text-blue-300">{appliedFilters.designation}</strong> , Status : <strong className="font-semibold text-blue-800 dark:text-blue-300">{appliedFilters.status}</strong>
                    </span>
                </div>
            </Card>

            {/* 3. Slab Details & Sidebar (Two column layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Left Side: Slab Table (3 columns) */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <Card className="bg-white dark:bg-background border border-gray-200 dark:border-gray-800 shadow-sm rounded-sm p-4 overflow-hidden flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-theme">Slab Structure Details</h3>

                        <DataTable
                            table={tableInstance}
                            isLoading={false}
                            columnCount={columns.length}
                            showHeader={true}
                        />

                        {/* Footer details of Slab table */}
                        <div className="flex items-center justify-between border-t dark:border-gray-800 pt-4 flex-wrap gap-3">
                            <Button
                                onClick={handleAddRow}
                                className="bg-theme"
                            >
                                <Plus className="w-3.5 h-3.5 mr-2" />
                                Add Row
                            </Button>

                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Total Slabs : {slabs.length}
                            </span>
                        </div>

                        {/* Table bottom Note */}
                        <div className="flex items-center gap-2 bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-950/30 px-3 py-2 rounded-lg text-[11px] text-blue-600 dark:text-blue-400 mt-2 font-medium">
                            <Info className="w-3.5 h-3.5 text-blue-500" />
                            <span>Note: Slab order is based on "Increment After Jan. Date (Year)" in ascending order.</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
