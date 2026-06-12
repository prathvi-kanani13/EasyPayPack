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
import { useAlert } from "@/context/AlertContext";
import { DatePickerInput } from "@/components/DatePickerInput";
import { DataTable } from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import NoticePeriodDialog from "./NoticePeriodDailog";

type NoticePeriodRecord = {
    id: string;
    empId: string;
    employee: string;
    designation: string;
    startDate: string;
    endDate: string;
    totalDays: string;
    completedDays: string;
    remainingDays: string;
    status: string;
};

const noticePeriodData: NoticePeriodRecord[] = [
    {
        id: "1",
        empId: "EMP001",
        employee: "Anthony Lewis",
        designation: "UI/UX Designer",
        startDate: "01-05-2026",
        endDate: "01-08-2026",
        totalDays: "92",
        completedDays: "15",
        remainingDays: "77",
        status: "active",
    },
    {
        id: "2",
        empId: "EMP002",
        employee: "Brian Villalobos",
        designation: "Frontend Developer",
        startDate: "15-06-2026",
        endDate: "15-09-2026",
        totalDays: "92",
        completedDays: "89",
        remainingDays: "92",
        status: "closing soon",
    },
    {
        id: "3",
        empId: "EMP003",
        employee: "Harvey Smith",
        designation: "Product Manager",
        startDate: "01-02-2026",
        endDate: "01-05-2026",
        totalDays: "89",
        completedDays: "89",
        remainingDays: "0",
        status: "completed",
    },
];

export default function NoticePeriod() {
    const { showAlert } = useAlert();

    const [data] = useState(noticePeriodData);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [isDateFiltered, setIsDateFiltered] = useState(false);
    const [search, setSearch] = useState("");

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<NoticePeriodRecord | null>(null);

    const isDateValid = Boolean(fromDate && toDate);

    const columns = useMemo<ColumnDef<NoticePeriodRecord>[]>(
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
                accessorKey: "startDate",
                header: "Start Date",
                cell: (info) =>
                    format(parse(info.getValue() as string, "dd-MM-yyyy", new Date()), "dd-MM-yyyy"),
            },
            {
                accessorKey: "endDate",
                header: "End Date",
                cell: (info) =>
                    format(parse(info.getValue() as string, "dd-MM-yyyy", new Date()), "dd-MM-yyyy"),
            },
            {
                accessorKey: "totalDays",
                header: "Total Days",
            },
            {
                accessorKey: "completedDays",
                header: "Completed",
            },
            {
                accessorKey: "remainingDays",
                header: "Remaining",
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: (info) => {
                    const status = info.getValue() as string;
                    const variants: Record<string, string> = {
                        'active': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
                        'completed': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30',
                        'closing soon': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30',
                    };
                    return (
                        <Badge variant="outline" className={`${variants[status]} border font-bold text-[10px] capitalize`}>
                            {status}
                        </Badge>
                    );
                },
            },
            {
                id: "actions",
                cell: ({ row }) => (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-yellow-600 hover:text-yellow-600"
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
            if (search && !row.employee.toLowerCase().includes(search.toLowerCase()) && !row.empId.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }

            if (statusFilter && statusFilter !== "all" && row.status !== statusFilter) {
                return false;
            }

            if (isDateFiltered && (fromDate || toDate)) {
                const rowDate = parse(row.endDate, "dd-MM-yyyy", new Date());
                const from = fromDate ? parse(fromDate, "dd-MM-yyyy", new Date()) : null;
                const to = toDate ? parse(toDate, "dd-MM-yyyy", new Date()) : null;

                return (
                    (!from || rowDate >= from) &&
                    (!to || rowDate <= to)
                );
            }

            return true;
        });
    }, [data, search, fromDate, toDate, isDateFiltered, statusFilter]);

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
        doc.text("Resignation / Notice Period Report", 14, 15);

        const tableData = filteredData.map((item) => [
            item.empId,
            item.employee,
            item.designation,
            item.startDate,
            item.endDate,
            item.totalDays,
            item.completedDays,
            item.remainingDays,
            item.status,
        ]);

        autoTable(doc, {
            startY: 25,
            head: [[
                "Emp ID", "Employee", "Designation", "Start Date",
                "End Date", "Total Days", "Completed", "Remaining", "Status"
            ]],
            body: tableData,
            styles: { fontSize: 8 },
        });

        doc.save("Notice_Period_Report.pdf");
    };

    const handleDialogSubmit = (data: any) => {
        if (selectedRecord) {
            console.log("Updating record:", data);
            showAlert({
                title: "Success",
                description: "Notice period record updated successfully.",
                variant: "success",
            });
        } else {
            console.log("Adding record:", data);
            showAlert({
                title: "Success",
                description: "Notice period record added successfully.",
                variant: "success",
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-[#202C4B] dark:text-white">Resignation / Notice Period Tracker</h1>
                <div className="flex flex-1 justify-end gap-2 ml-2">
                    <Button
                        variant="outline"
                        onClick={handleExportPDF}
                        className="flex items-center gap-2"
                    >
                        Export PDF
                        <FileText className="w-4 h-4" />
                    </Button>
                    <Button
                        className="px-4 py-2 rounded-sm text-white text-sm font-medium"
                        onClick={() => {
                            setSelectedRecord(null);
                            setDialogOpen(true);
                        }}
                    >
                        Add Notice Period
                    </Button>
                </div>
            </div>

            <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
                <div className="flex items-center justify-between flex-wrap border-b dark:border-gray-700 gap-4 pb-4">
                    <div className="text-lg font-semibold">Employee List</div>
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

                        <div className="flex items-center flex-wrap gap-2">
                            <div className="relative">
                                <Input
                                    placeholder="Search Employee"
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
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="closing soon">Closing Soon</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
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

            <NoticePeriodDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={selectedRecord}
                onSubmit={handleDialogSubmit}
            />
        </div>
    );
}