import { useMemo, useState } from "react";
import { X, FileText, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { format, parse } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAlert } from "../../context/AlertContext";
import { DatePickerInput } from "../../components/DatePickerInput";
import { DataTable } from "../../components/DataTable";
import Pagination from "../../components/Pagination";
import ProbationDialog from "./ProbationDailog";

type ProbationRecord = {
    id: string;
    empId: string;
    employee: string,
    designation: string;
    joiningDate: string;
    probationEndDate: string;
    reviewer: string;
    status: string;
    extensionFromDate?: string;
    extensionToDate?: string;
};

const probationData: ProbationRecord[] = [
    {
        id: "1",
        empId: "EMP001",
        employee: "Anthony Lewis",
        designation: "UI/UX Designer",
        joiningDate: "10-10-2024",
        probationEndDate: "10-01-2025",
        reviewer: "Admin User",
        status: "In Review",
    },
    {
        id: "2",
        empId: "EMP002",
        employee: "Brian Villalobos",
        designation: "Frontend Developer",
        joiningDate: "15-08-2024",
        probationEndDate: "15-11-2024",
        reviewer: "HR Manager",
        status: "Completed",
    },
    {
        id: "3",
        empId: "EMP003",
        employee: "Harvey Smith",
        designation: "Product Manager",
        joiningDate: "01-11-2024",
        probationEndDate: "01-02-2025",
        reviewer: "Director",
        status: "Pending",
    },
    {
        id: "4",
        empId: "EMP004",
        employee: "Steaven Smith",
        designation: "IT Manager",
        joiningDate: "05-11-2024",
        probationEndDate: "05-02-2025",
        reviewer: "Director",
        status: "Failed",
    },
    {
        id: "5",
        empId: "EMP005",
        employee: "Karthik",
        designation: "Product Manager",
        joiningDate: "01-11-2024",
        probationEndDate: "01-02-2025",
        reviewer: "Director",
        status: "Extended",
    },
];

export default function Probation() {
    const { showAlert } = useAlert();

    const [data] = useState(probationData);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [isDateFiltered, setIsDateFiltered] = useState(false);
    const [search, setSearch] = useState("");

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<ProbationRecord | null>(null);

    const isDateValid = Boolean(fromDate && toDate);

    const columns = useMemo<ColumnDef<ProbationRecord>[]>(
        () => [
            {
                accessorKey: "empId",
                header: "Emp ID",
            },
            {
                accessorKey: "employee",
                header: "Employee",
            },
            {
                accessorKey: "designation",
                header: "Designation",
            },
            {
                accessorKey: "joiningDate",
                header: "Joining Date",
                cell: (info) =>
                    format(parse(info.getValue() as string, "dd-MM-yyyy", new Date()), "dd-MM-yyyy"),
            },
            {
                accessorKey: "probationEndDate",
                header: "Probation End Date",
                cell: (info) =>
                    format(parse(info.getValue() as string, "dd-MM-yyyy", new Date()), "dd-MM-yyyy"),
            },
            {
                accessorKey: "reviewer",
                header: "Reviewer",
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: (info) => {
                    const status = info.getValue() as string;
                    const variants: Record<string, string> = {
                        'Completed': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30',
                        'Pending': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
                        'In Review': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
                        'Failed': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30',
                        'Extended': 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
                    };
                    return (
                        <Badge variant="outline" className={`${variants[status]} border font-bold text-[10px]`}>
                            {status}
                        </Badge>
                    );
                },
            },
            {
                id: "actions",
                // header: "Actions",
                cell: ({ row }) => (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                            setSelectedRecord(row.original);
                            setDialogOpen(true);
                        }}
                    >
                        <Edit size={16} />
                    </Button>
                ),
            },
        ],
        []
    );

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            // Search employee name or empId
            if (search && !row.employee.toLowerCase().includes(search.toLowerCase()) && !row.empId.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }

            // Status filter
            if (statusFilter && statusFilter !== "all" && row.status !== statusFilter) {
                return false;
            }

            // Manual date range filter (based on probationEndDate)
            if (isDateFiltered && (fromDate || toDate)) {
                const rowDate = parse(row.probationEndDate, "dd-MM-yyyy", new Date());
                const from = fromDate ? parse(fromDate, "dd-MM-yyyy", new Date()) : null;
                const to = toDate ? parse(toDate, "dd-MM-yyyy", new Date()) : null;

                return (
                    (!from || rowDate >= from) &&
                    (!to || rowDate <= to)
                );
            }

            return true;
        });
    }, [data, search, fromDate, toDate, isDateFiltered]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleExportPDF = () => {
        if (filteredData.length === 0) {
            showAlert({
                title: 'No Data',
                description: "No data available to export.",
                variant: 'info',
            });
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Probation Management Report", 14, 15);

        const tableData = filteredData.map((item) => [
            item.empId,
            item.employee,
            item.designation,
            item.joiningDate,
            item.probationEndDate,
            item.reviewer,
            item.status,
        ]);

        autoTable(doc, {
            startY: 25,
            head: [[
                "Emp ID", "Employee", "Designation", "Joining Date",
                "Probation End Date", "Reviewer", "Status"
            ]],
            body: tableData,
            styles: { fontSize: 8 },
        });

        doc.save("Probation_Report.pdf");
    };

    const handleDialogSubmit = (data: any) => {
        if (selectedRecord) {
            console.log("Updating record:", data);
            showAlert({
                title: "Success",
                description: "Probation record updated successfully.",
                variant: "success",
            });
        } else {
            console.log("Adding record:", data);
            showAlert({
                title: "Success",
                description: "Probation record added successfully.",
                variant: "success",
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-[#202C4B] dark:text-white">Probation Management</h1>
                <div className="flex flex-1 justify-end gap-2 ml-2">
                    <Button
                        variant="outline"
                        onClick={handleExportPDF}
                        className="flex items-center gap-2"
                    >
                        Export PDF
                        <FileText className="w-4 h-4" />
                    </Button>
                    <button
                        className="px-4 py-2 rounded-sm bg-[#F26522] text-white text-sm font-medium"
                        onClick={() => {
                            setSelectedRecord(null);
                            setDialogOpen(true);
                        }}
                    >
                        Add Probation
                    </button>
                </div>
            </div>

            <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
                <div className="flex items-center justify-between flex-wrap border-b dark:border-gray-700 gap-4 pb-4">
                    <div className="text-lg font-semibold">Probation List</div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* from date */}
                        <DatePickerInput
                            value={fromDate}
                            onChange={setFromDate}
                            placeholder="From Date"
                        />

                        {/* to date */}
                        <DatePickerInput
                            value={toDate}
                            onChange={setToDate}
                            placeholder="To Date"
                        />

                        <div className="flex items-center flex-wrap gap-2">
                            <div className="relative">
                                <Input
                                    placeholder="Search Employee Name"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className=""
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <Select value={statusFilter ?? ""} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-35">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="In Review">In Review</SelectItem>
                                    <SelectItem value="Failed">Failed</SelectItem>
                                    <SelectItem value="Extended">Extended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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
                    pageIndex={0}
                    setPageIndex={() => { }}
                    isNextDisabled={false}
                />
            </Card>

            <ProbationDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={selectedRecord}
                onSubmit={handleDialogSubmit}
            />
        </div>
    );
}