import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Eye, Edit2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlert } from "@/context/AlertContext";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef
} from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import { format } from "date-fns";
import GradeDesignationSlabDialog from "./GradeDesignationSlabDialog";

interface SlabListRow {
    id: string;
    grade: string;
    designation: string;
    effectiveDate: string;
    totalSlabs: number;
    status: "Active" | "Inactive";
}

const initialSlabListData: SlabListRow[] = [
    { id: "1", grade: "Officer", designation: "Software Developer", effectiveDate: "01-01-2026", totalSlabs: 8, status: "Active" },
    { id: "2", grade: "Manager", designation: "Quality Analyst", effectiveDate: "01-01-2026", totalSlabs: 6, status: "Active" },
    { id: "3", grade: "Executive", designation: "HR Executive", effectiveDate: "01-01-2026", totalSlabs: 5, status: "Active" },
    { id: "4", grade: "Staff", designation: "Accountant", effectiveDate: "15-02-2026", totalSlabs: 4, status: "Active" },
    { id: "5", grade: "Trainee", designation: "System Administrator", effectiveDate: "01-01-2026", totalSlabs: 3, status: "Inactive" },
    { id: "6", grade: "Officer", designation: "Accountant", effectiveDate: "01-04-2026", totalSlabs: 5, status: "Active" },
    { id: "7", grade: "Manager", designation: "Software Developer", effectiveDate: "01-01-2026", totalSlabs: 10, status: "Active" },
    { id: "8", grade: "Executive", designation: "Quality Analyst", effectiveDate: "01-01-2026", totalSlabs: 4, status: "Inactive" }
];

export default function GradeDesignationSlabList() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [data, setData] = useState<SlabListRow[]>(initialSlabListData);
    const [globalFilter, setGlobalFilter] = useState("");
    const [gradeFilter, setGradeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<SlabListRow | null>(null);

    // Handle Clear Filters
    const handleClearFilters = () => {
        setGlobalFilter("");
        setGradeFilter("");
        setStatusFilter("");
        setPageIndex(0);
    };

    const handleDialogSubmit = (formData: any) => {
        if (selectedRecord) {
            // Update
            setData((prev) =>
                prev.map((row) =>
                    row.id === selectedRecord.id
                        ? {
                            ...row,
                            grade: formData.grade,
                            designation: formData.designation,
                            status: formData.status,
                            effectiveDate: formData.effectiveDate || row.effectiveDate,
                            totalSlabs: Number(formData.totalSlabs) || row.totalSlabs,
                        }
                        : row
                )
            );
            showAlert({
                title: "Success",
                description: "Slab configuration updated successfully.",
                variant: "success",
            });
        } else {
            // Add new
            const newRecord: SlabListRow = {
                id: `slab-${Date.now()}`,
                grade: formData.grade,
                designation: formData.designation,
                status: formData.status,
                effectiveDate: formData.effectiveDate || format(new Date(), "dd-MM-yyyy"),
                totalSlabs: Number(formData.totalSlabs) || 1,
            };
            setData((prev) => [...prev, newRecord]);
            showAlert({
                title: "Success",
                description: "Slab configuration added successfully.",
                variant: "success",
            });
        }
    };

    // Filtered data based on search and drop-downs
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Grade filter
            if (gradeFilter && gradeFilter !== "all" && item.grade.toLowerCase() !== gradeFilter.toLowerCase()) {
                return false;
            }

            // Status filter
            if (statusFilter && statusFilter !== "all" && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
                return false;
            }

            // Search filter
            if (globalFilter) {
                const searchLower = globalFilter.toLowerCase();
                const matchesSearch =
                    item.grade.toLowerCase().includes(searchLower) ||
                    item.designation.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            return true;
        });
    }, [data, gradeFilter, statusFilter, globalFilter]);

    // Columns Definition
    const columns = useMemo<ColumnDef<SlabListRow>[]>(
        () => [
            {
                accessorKey: "grade",
                header: "Grade",
            },
            {
                accessorKey: "designation",
                header: "Designation",
            },
            {
                accessorKey: "effectiveDate",
                header: "Effective Date",
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: (info) => {
                    const status = info.getValue() as string;
                    const variants: Record<string, string> = {
                        'Active': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30',
                        'Inactive': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30',
                    };
                    return (
                        <Badge variant="outline" className={`${variants[status]} border font-bold text-[10px]`}>
                            {status}
                        </Badge>
                    );
                }
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-theme hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                            onClick={() => navigate("/grade-designation/slab-salary", { state: { grade: row.original.grade, designation: row.original.designation, status: row.original.status, effectiveDate: row.original.effectiveDate, mode: "view" } })}
                            title="View Details"
                        >
                            <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-theme hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                            onClick={() => {
                                setSelectedRecord(row.original);
                                setDialogOpen(true);
                            }}
                            title="Edit Master"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                )
            }
        ],
        [data, navigate]
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const nextState = updater({ pageIndex, pageSize });
                setPageIndex(nextState.pageIndex);
                setPageSize(nextState.pageSize);
            }
        },
    });

    return (
        <div className="flex flex-col gap-4">

            {/* 1. Header Area */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/master")}>
                    <ArrowLeft className="w-6 h-6 text-[#202C4B] dark:text-white" />
                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-2xl font-bold text-[#202C4B] dark:text-white flex items-center gap-2">
                            Grade / Designation wise slab list
                        </h1>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            View and manage slab structures configured for Grade and Designations.
                        </span>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-2 ml-2">
                    <Button
                        className="px-4 py-2 rounded-sm text-white text-sm font-medium"
                        onClick={() => {
                            setSelectedRecord(null);
                            setDialogOpen(true);
                        }}
                    >
                        <Plus className="w-3.5 h-3.5 mr-2" />Add New Slab
                    </Button>
                </div>
            </div>

            {/* 2. Table and Filters Panel - Probation Style */}
            <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
                <div className="flex items-center justify-between flex-wrap border-b dark:border-gray-700 gap-4 pb-4">
                    <div className="text-lg font-semibold">Slab List</div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Search Designation */}
                        <div className="relative">
                            <Input
                                placeholder="Search Designation"
                                value={globalFilter}
                                onChange={(e) => {
                                    setGlobalFilter(e.target.value);
                                    setPageIndex(0);
                                }}
                                className=""
                            />
                            {globalFilter && (
                                <button
                                    onClick={() => {
                                        setGlobalFilter("");
                                        setPageIndex(0);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Grade Dropdown Filter */}
                        <Select value={gradeFilter} onValueChange={(val) => {
                            setGradeFilter(val);
                            setPageIndex(0);
                        }}>
                            <SelectTrigger className="w-35">
                                <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Grades</SelectItem>
                                <SelectItem value="Officer">Officer</SelectItem>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Executive">Executive</SelectItem>
                                <SelectItem value="Staff">Staff</SelectItem>
                                <SelectItem value="Trainee">Trainee</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Dropdown Filter */}
                        <Select value={statusFilter} onValueChange={(val) => {
                            setStatusFilter(val);
                            setPageIndex(0);
                        }}>
                            <SelectTrigger className="w-35">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Reset Button */}
                        <Button
                            size="sm"
                            onClick={handleClearFilters}
                        >
                            Clear
                        </Button>
                    </div>

                    {/* Rows Per Page */}
                    <div className="flex flex-1 items-center gap-2 justify-end">
                        <div className="text-sm text-gray-600">Row Per Page</div>
                        <Select onValueChange={(val) => table.setPageSize(Number(val))} defaultValue="5">
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DataTable
                    table={table}
                    isLoading={false}
                    isError={false}
                    columnCount={columns.length}
                    errorMessage="No Data Found"
                />

                <Pagination
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    isNextDisabled={!table.getCanNextPage()}
                />
            </Card>

            <GradeDesignationSlabDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={selectedRecord}
                onSubmit={handleDialogSubmit}
            />

        </div>
    );
}