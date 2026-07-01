/* eslint-disable react-hooks/incompatible-library */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Plus, Trash, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { parse } from "date-fns";
import { useAlert } from "@/context/AlertContext";
import { DatePickerInput } from "@/components/DatePickerInput";
import { DataTable } from "@/components/DataTable";
import Pagination from "@/components/Pagination";

type PTAXConfigRecord = {
    id: string;
    effectiveDate: string;
    company: string;
    branch: string;
    salaryHead: string;
    gender: string;
    slabs: string;
    status: string;
};

const ptaxConfigData: PTAXConfigRecord[] = [
    {
        id: "1",
        effectiveDate: "01-04-2026",
        company: "EasyPay Pack Pvt Ltd",
        branch: "Maharashtra Branch",
        salaryHead: "Professional Tax",
        gender: "All",
        slabs: "3 Slabs",
        status: "Active",
    },
    {
        id: "2",
        effectiveDate: "01-04-2026",
        company: "EasyPay Pack Pvt Ltd",
        branch: "Gujarat Branch",
        salaryHead: "Professional Tax",
        gender: "All",
        slabs: "2 Slabs",
        status: "Active",
    },
    {
        id: "3",
        effectiveDate: "01-04-2026",
        company: "EasyPay Pack Pvt Ltd",
        branch: "Karnataka Branch",
        salaryHead: "Professional Tax",
        gender: "All",
        slabs: "2 Slabs",
        status: "Active",
    },
    {
        id: "4",
        effectiveDate: "01-04-2025",
        company: "EasyPay Pack Pvt Ltd",
        branch: "Maharashtra Branch",
        salaryHead: "Professional Tax",
        gender: "Female",
        slabs: "4 Slabs",
        status: "Inactive",
    },
    {
        id: "5",
        effectiveDate: "01-06-2026",
        company: "EasyPay Pack Pvt Ltd",
        branch: "West Bengal Branch",
        salaryHead: "Professional Tax",
        gender: "All",
        slabs: "3 Slabs",
        status: "Active",
    }
];

export default function ConfigList() {
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const [data, setData] = useState(ptaxConfigData);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [branchFilter, setBranchFilter] = useState<string>("");
    const [salaryHeadFilter, setSalaryHeadFilter] = useState<string>("");
    const [effectiveDateFilter, setEffectiveDateFilter] = useState<string>("");
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [isDateFiltered, setIsDateFiltered] = useState(false);
    const [search, setSearch] = useState("");

    const isDateValid = Boolean(fromDate && toDate);

    // Extract unique filter options from active data
    const branches = useMemo(() => Array.from(new Set(data.map((item) => item.branch))), [data]);
    const salaryHeads = useMemo(() => Array.from(new Set(data.map((item) => item.salaryHead))), [data]);
    const statuses = useMemo(() => Array.from(new Set(data.map((item) => item.status))), [data]);
    const effectiveDates = useMemo(() => Array.from(new Set(data.map((item) => item.effectiveDate))), [data]);

    const columns = useMemo<ColumnDef<PTAXConfigRecord>[]>(
        () => [
            {
                id: "srNo",
                header: "Sr. No.",
                cell: (info) => info.row.index + 1,
            },
            {
                accessorKey: "effectiveDate",
                header: "Effective Date",
            },
            {
                accessorKey: "company",
                header: "Company",
            },
            {
                accessorKey: "branch",
                header: "Branch",
            },
            {
                accessorKey: "salaryHead",
                header: "Salary Head",
            },
            {
                accessorKey: "gender",
                header: "Gender",
            },
            {
                accessorKey: "slabs",
                header: "Slabs",
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.original.status;
                    return (
                        <Badge className={`${status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                            } border-none`}>
                            {status}
                        </Badge>
                    );
                },
            },
            {
                id: "actions",
                herder: 'Actions',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigate(`/ptax/view/${row.original.id}`)}
                        >
                            <Eye size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-yellow-600 hover:text-yellow-600"
                            onClick={() => navigate(`/ptax/edit/${row.original.id}`)}
                        >
                            <Edit size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-600"
                            onClick={() => {
                                setData(prev => prev.filter(item => item.id !== row.original.id));
                                showAlert({
                                    title: "Deleted",
                                    description: "PTAX Configuration deleted successfully.",
                                    variant: "success",
                                });
                            }}
                        >
                            <Trash size={16} />
                        </Button>
                    </div>
                ),
            },
        ],
        [navigate, showAlert]
    );

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            if (search &&
                !row.branch.toLowerCase().includes(search.toLowerCase()) &&
                !row.company.toLowerCase().includes(search.toLowerCase()) &&
                !row.salaryHead.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }

            if (statusFilter && statusFilter !== "all" && row.status !== statusFilter) {
                return false;
            }

            if (branchFilter && branchFilter !== "all" && row.branch !== branchFilter) {
                return false;
            }

            if (salaryHeadFilter && salaryHeadFilter !== "all" && row.salaryHead !== salaryHeadFilter) {
                return false;
            }

            if (effectiveDateFilter && effectiveDateFilter !== "all" && row.effectiveDate !== effectiveDateFilter) {
                return false;
            }

            if (isDateFiltered && (fromDate || toDate)) {
                const rowDate = parse(row.effectiveDate, "dd-MM-yyyy", new Date());
                const from = fromDate ? parse(fromDate, "dd-MM-yyyy", new Date()) : null;
                const to = toDate ? parse(toDate, "dd-MM-yyyy", new Date()) : null;

                return (
                    (!from || rowDate >= from) &&
                    (!to || rowDate <= to)
                );
            }

            return true;
        });
    }, [data, search, statusFilter, branchFilter, salaryHeadFilter, effectiveDateFilter, isDateFiltered, fromDate, toDate]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            }
        }
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-[#202C4B] dark:text-white">PTAX Master</h1>
                <div className="flex flex-1 justify-end gap-2 ml-2">
                    <Button
                        className="px-4 py-2 rounded-sm text-white text-sm font-medium"
                        onClick={() => navigate("/ptax/add")}
                    >
                        <Plus /> PTAX Configuration
                    </Button>
                </div>
            </div>

            <Card className="p-4 gap-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
                <div className="flex items-center justify-between flex-wrap border-b dark:border-gray-700 gap-4 pb-4">
                    <div className="text-lg font-semibold">PTAX Configuration List</div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <DatePickerInput
                            value={fromDate}
                            onChange={setFromDate}
                            placeholder="From Date"
                        />
                        <DatePickerInput
                            value={toDate}
                            onChange={setToDate}
                            placeholder="To Date"
                        />

                        <Select value={branchFilter || "all"} onValueChange={setBranchFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Branches" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Branches</SelectItem>
                                {branches.map((b) => (
                                    <SelectItem key={b} value={b}>{b}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={salaryHeadFilter || "all"} onValueChange={setSalaryHeadFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Salary Head" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Salary Heads</SelectItem>
                                {salaryHeads.map((sh) => (
                                    <SelectItem key={sh} value={sh}>{sh}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                {statuses.map((st) => (
                                    <SelectItem key={st} value={st}>{st}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={effectiveDateFilter || "all"} onValueChange={setEffectiveDateFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Effective Date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Effective Dates</SelectItem>
                                {effectiveDates.map((ed) => (
                                    <SelectItem key={ed} value={ed}>{ed}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Search Branch/Company"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-auto"
                        />

                        <Button
                            size="sm"
                            disabled={!isDateValid && !isDateFiltered}
                            onClick={() => {
                                if (fromDate && toDate) {
                                    const from = parse(fromDate, "dd-MM-yyyy", new Date());
                                    const to = parse(toDate, "dd-MM-yyyy", new Date());
                                    if (from > to) {
                                        showAlert({
                                            title: 'Invalid Date Range',
                                            description: "From Date cannot be greater than To Date",
                                            variant: 'error',
                                        })
                                        return;
                                    }
                                }

                                if (isDateFiltered) {
                                    setFromDate("");
                                    setToDate("");
                                    setIsDateFiltered(false);
                                } else {
                                    setIsDateFiltered(true);
                                }
                            }}
                        >
                            {isDateFiltered ? "Clear" : "Filter"}
                        </Button>
                    </div>

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
                    pageIndex={table.getState().pagination.pageIndex}
                    setPageIndex={(updater) => {
                        if (typeof updater === "function") {
                            table.setPageIndex(updater(table.getState().pagination.pageIndex));
                        } else {
                            table.setPageIndex(updater);
                        }
                    }}
                    isNextDisabled={!table.getCanNextPage()}
                />
            </Card>
        </div>
    );
}