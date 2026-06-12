import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import {
    ArrowLeft,
    Eye,
    Edit2,
    Search,
    Plus,
    Wallet,
    ArrowDownToLine,
    Shield,
    MinusCircle,
    Trash2,
    LayoutGrid,
    List,
    X,
} from "lucide-react";
import { useAlert } from "@/context/AlertContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SalaryHeadCategory = "Earnings" | "Deductions" | "Statutory";

type SalaryHeadRecord = {
    id: string;
    name: string;
    code: string;
    shortName: string;
    category: SalaryHeadCategory;
    displayOrder: number;
    status: "Active" | "Inactive";
    description: string;
    group: string;
    displayInPayslip: boolean;
    displayInSalaryRegister: boolean;
    lastModified: string;
};

const initialSalaryHeads: SalaryHeadRecord[] = [
    { id: "1", name: "Basic Pay", code: "BASIC", shortName: "BASIC", category: "Earnings", displayOrder: 1, status: "Active", description: "Basic salary of employee.", group: "Basic Components", displayInPayslip: true, displayInSalaryRegister: true, lastModified: "28 May 2026" },
    { id: "2", name: "Dearness Allowance", code: "DA", shortName: "DA", category: "Earnings", displayOrder: 2, status: "Active", description: "Cost of living allowance.", group: "Allowance", displayInPayslip: true, displayInSalaryRegister: true, lastModified: "26 May 2026" },
    { id: "3", name: "House Rent Allowance", code: "HRA", shortName: "HRA", category: "Earnings", displayOrder: 3, status: "Active", description: "House rent allowance component.", group: "Allowance", displayInPayslip: true, displayInSalaryRegister: true, lastModified: "24 May 2026" },
    { id: "4", name: "Conveyance Allowance", code: "CONV", shortName: "CONV", category: "Earnings", displayOrder: 4, status: "Active", description: "Travel allowance component.", group: "Allowance", displayInPayslip: true, displayInSalaryRegister: true, lastModified: "23 May 2026" },
    { id: "5", name: "Special Allowance", code: "SPL", shortName: "SPL", category: "Earnings", displayOrder: 5, status: "Active", description: "Special allowance component.", group: "Allowance", displayInPayslip: true, displayInSalaryRegister: true, lastModified: "22 May 2026" },
    { id: "6", name: "Provident Fund - Employee", code: "PFEMP", shortName: "PFEMP", category: "Deductions", displayOrder: 10, status: "Active", description: "Employee PF deduction.", group: "Statutory", displayInPayslip: true, displayInSalaryRegister: true, lastModified: "21 May 2026" },
    { id: "7", name: "Provident Fund - Employer", code: "PFEMPLOY", shortName: "PFEMPLOY", category: "Deductions", displayOrder: 11, status: "Active", description: "Employer PF contribution.", group: "Statutory", displayInPayslip: true, displayInSalaryRegister: true, lastModified: "20 May 2026" },
    { id: "8", name: "ESIC - Employee", code: "ESIC", shortName: "ESIC", category: "Deductions", displayOrder: 12, status: "Active", description: "Employee state insurance.", group: "Statutory", displayInPayslip: true, displayInSalaryRegister: true, lastModified: "19 May 2026" },
    { id: "9", name: "Professional Tax", code: "PTAX", shortName: "PTAX", category: "Deductions", displayOrder: 13, status: "Active", description: "State professional tax.", group: "Statutory", displayInPayslip: true, displayInSalaryRegister: true, lastModified: "18 May 2026" },
    { id: "10", name: "TDS", code: "TDS", shortName: "TDS", category: "Deductions", displayOrder: 14, status: "Active", description: "Tax deducted at source.", group: "Statutory", displayInPayslip: true, displayInSalaryRegister: true, lastModified: "17 May 2026" },
    { id: "11", name: "Leave Encashment", code: "LEAVE", shortName: "LEAV", category: "Statutory", displayOrder: 15, status: "Inactive", description: "Leave encashment amount.", group: "Statutory", displayInPayslip: false, displayInSalaryRegister: false, lastModified: "15 May 2026" },
];

export default function SalaryHeadMaster() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [data, setData] = useState<SalaryHeadRecord[]>(initialSalaryHeads);
    const [activeTab, setActiveTab] = useState<"All" | "Earnings" | "Deductions" | "Statutory" | "Inactive">("All");
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [selectedHead, setSelectedHead] = useState<SalaryHeadRecord | null>(null);
    const [editingHead, setEditingHead] = useState<SalaryHeadRecord | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const allCount = useMemo(() => data.length, [data]);
    const earningsCount = useMemo(
        () => data.filter((item) => item.category === "Earnings" && item.status === "Active").length,
        [data]
    );
    const deductionsCount = useMemo(
        () => data.filter((item) => item.category === "Deductions" && item.status === "Active").length,
        [data]
    );
    const statutoryCount = useMemo(
        () => data.filter((item) => item.category === "Statutory" && item.status === "Active").length,
        [data]
    );
    const inactiveCount = useMemo(
        () => data.filter((item) => item.status === "Inactive").length,
        [data]
    );

    useEffect(() => {
        if (selectedHead) {
            setEditingHead({ ...selectedHead });
        } else {
            setEditingHead(null);
        }
    }, [selectedHead]);

    const handleUpdate = () => {
        if (!editingHead) return;
        setData((prev) =>
            prev.map((item) => (item.id === editingHead.id ? editingHead : item))
        );
        setSelectedHead(editingHead);
        setIsSidebarOpen(false);
        showAlert({
            title: "Success",
            description: "Salary Head updated successfully.",
            variant: "success",
        });
    };

    const confirmDelete = (id: string) => {
        showAlert({
            title: "Confirm Delete",
            description: "Are you sure you want to delete this record? This action cannot be undone.",
            variant: "danger",
            confirmation: true,
            buttonText: "Delete",
        }).then((result) => {
            if (result.isConfirmed) {
                setData((prev) => prev.filter((item) => item.id !== id));
                showAlert({
                    title: "Deleted",
                    description: "Record deleted successfully.",
                    variant: "success",
                });
            }
        });
    };

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            if (activeTab === "Inactive") {
                if (item.status !== "Inactive") return false;
            } else if (activeTab !== "All") {
                if (item.category !== activeTab || item.status !== "Active") return false;
            }

            if (search.trim()) {
                const query = search.toLowerCase();
                return (
                    item.name.toLowerCase().includes(query) ||
                    item.code.toLowerCase().includes(query) ||
                    item.shortName.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [activeTab, data, search]);

    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => a.displayOrder - b.displayOrder);
    }, [filteredData]);

    const totalPages = useMemo(() => Math.ceil(sortedData.length / pageSize), [sortedData.length, pageSize]);

    useEffect(() => {
        if (pageIndex >= totalPages && totalPages > 0) {
            setPageIndex(totalPages - 1);
        }
    }, [pageIndex, totalPages]);

    const paginatedData = useMemo(() => {
        const start = pageIndex * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, pageIndex, pageSize]);

    const columns = useMemo<ColumnDef<SalaryHeadRecord>[]>(
        () => [
            {
                id: "sr",
                header: "Sr. No.",
                cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
            },
            {
                accessorKey: "name",
                header: "Salary Head Name",
            },
            {
                accessorKey: "group",
                header: "Group",
            },
            {
                accessorKey: "code",
                header: "Code",
            },
            {
                accessorKey: "category",
                header: "Type",
                cell: ({ getValue }) => {
                    const category = getValue() as SalaryHeadCategory;
                    const variants: Record<string, string> = {
                        'Earnings': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30',
                        'Deductions': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30',
                        'Statutory': 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
                    };
                    return (
                        <Badge variant="outline" className={`${variants[category] || ""} border font-bold text-[10px]`}>
                            {category}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "displayOrder",
                header: "Display Order",
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ getValue }) => {
                    const status = getValue() as "Active" | "Inactive";
                    const variants: Record<string, string> = {
                        'Active': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30',
                        'Inactive': 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-500/30',
                    };
                    return (
                        <Badge variant="outline" className={`${variants[status] || ""} border font-bold text-[10px]`}>
                            {status}
                        </Badge>
                    );
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            className="h-8 w-8 text-slate-500 hover:text-theme dark:hover:bg-slate-800"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedHead(row.original);
                                setIsEditMode(false);
                                setIsSidebarOpen(true);
                            }}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            className="h-8 w-8 text-slate-500 hover:text-theme dark:hover:bg-slate-800"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedHead(row.original);
                                setIsEditMode(true);
                                setIsSidebarOpen(true);
                            }}
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(row.original.id);
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [pageIndex, pageSize, data]
    );

    const table = useReactTable({
        data: paginatedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/master")}>
                    <ArrowLeft className="w-6 h-6 text-[#202C4B] dark:text-white" />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-[#202C4B] dark:text-white">Salary Head Master</h1>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Manage earnings, deductions, statutory and inactive salary heads.</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <Button onClick={() => navigate("/salary-head/add")} size="sm" className="h-9 px-4 bg-theme hover:bg-theme/90 text-white gap-1.5 rounded-lg shadow-sm"><Plus className="w-4 h-4" />Create Salary Head</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    {
                        title: "Earnings",
                        count: earningsCount,
                        badgeClass: "bg-[#EAFDF5] text-[#10B981] dark:bg-emerald-950/40 dark:text-emerald-400",
                        cardClass: "bg-[#F4FDF9] dark:bg-emerald-950/10 border-[#D1FAE5] dark:border-emerald-900/20"
                    },
                    {
                        title: "Deductions",
                        count: deductionsCount,
                        badgeClass: "bg-[#FDF2F2] text-[#EF4444] dark:bg-red-950/40 dark:text-red-400",
                        cardClass: "bg-[#FDF8F8] dark:bg-red-950/10 border-[#FDE8E8] dark:border-red-900/20"
                    },
                    {
                        title: "Statutory",
                        count: statutoryCount,
                        badgeClass: "bg-[#F5F3FF] text-[#8B5CF6] dark:bg-purple-950/40 dark:text-purple-400",
                        cardClass: "bg-[#FAF9FF] dark:bg-purple-950/10 border-[#EDE9FE] dark:border-purple-900/20"
                    },
                    {
                        title: "Inactive",
                        count: inactiveCount,
                        badgeClass: "bg-[#F1F5F9] text-[#64748B] dark:bg-slate-800 dark:text-slate-400",
                        cardClass: "bg-[#F8FAFC] dark:bg-slate-900/10 border-[#E2E8F0] dark:border-slate-800/40"
                    },
                ].map((card) => {
                    const Icon = card.title === "Earnings" ? Wallet : card.title === "Deductions" ? ArrowDownToLine : card.title === "Statutory" ? Shield : MinusCircle;
                    return (
                        <Card key={card.title} className={`flex flex-row items-center gap-4 p-5 ${card.cardClass} border rounded-sm shadow-none`}>
                            <div className={`flex items-center justify-center w-14 h-14 ${card.badgeClass} rounded-xl shrink-0`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-[#3B4A6F] dark:text-slate-300">{card.title}</span>
                                <span className="text-2xl font-extrabold text-[#1A253C] dark:text-white mt-1">
                                    {card.count}
                                </span>
                                <span className="text-xs text-[#8F9BBA] dark:text-slate-400 mt-0.5">Heads</span>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Main Table/Grid Area */}
                <div className={`flex-1 transition-all duration-300 ${isSidebarOpen && selectedHead ? 'lg:w-2/3' : 'w-full'}`}>
                    <Card className="bg-white dark:bg-background border dark:border-gray-700 shadow-sm overflow-hidden rounded-sm p-4">
                        <div className="pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b dark:border-slate-800">
                            <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value as any); setPageIndex(0); }} className="w-fit">
                                <TabsList className="bg-slate-100 dark:bg-gray-800 p-1 rounded-sm gap-0 flex flex-wrap h-auto">
                                    {(["All", "Earnings", "Deductions", "Statutory", "Inactive"] as const).map((tab) => (
                                        <TabsTrigger key={tab} value={tab} className="px-4 py-2 text-xs font-semibold rounded-sm data-[state=active]:bg-theme! data-[state=active]:text-white! data-[state=active]:shadow-sm border-none bg-transparent cursor-pointer">
                                            {tab} ({tab === "All" ? allCount : tab === "Inactive" ? inactiveCount : tab === "Earnings" ? earningsCount : tab === "Deductions" ? deductionsCount : statutoryCount})
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>

                            <div className="flex flex-wrap items-center gap-3 lg:flex-1 lg:justify-end">
                                {/* Row Per Page Selector */}
                                <div className="flex items-center gap-2 mr-2">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Row Per Page</div>
                                    <Select
                                        value={pageSize.toString()}
                                        onValueChange={(val) => {
                                            setPageSize(Number(val));
                                            setPageIndex(0);
                                        }}
                                    >
                                        <SelectTrigger className="w-20 h-9 border-slate-200 dark:border-slate-700 bg-transparent">
                                            <SelectValue placeholder={pageSize.toString()} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5" className="cursor-pointer">5</SelectItem>
                                            <SelectItem value="10" className="cursor-pointer">10</SelectItem>
                                            <SelectItem value="20" className="cursor-pointer">20</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Grid/List toggles */}
                                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-gray-800">
                                    <Button
                                        size="icon-sm"
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        onClick={() => setViewMode("grid")}
                                        className={`h-7 w-7 p-0 rounded-md ${viewMode === "grid" ? "bg-theme text-white" : "text-slate-500"}`}
                                    >
                                        <LayoutGrid className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                        size="icon-sm"
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        onClick={() => setViewMode("list")}
                                        className={`h-7 w-7 p-0 rounded-md ${viewMode === "list" ? "bg-theme text-white" : "text-slate-500"}`}
                                    >
                                        <List className="w-3.5 h-3.5" />
                                    </Button>
                                </div>

                                {/* Search Input */}
                                <div className="relative w-full max-w-[280px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search Salary Head by name or code..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setPageIndex(0);
                                        }}
                                        className="pl-9 pr-8 h-9 text-xs rounded-xl border-slate-200 dark:border-slate-750 focus:ring-1 focus:ring-theme bg-transparent dark:bg-background"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => {
                                                setSearch("");
                                                setPageIndex(0);
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px] mt-4">
                                {paginatedData.length === 0 ? (
                                    <div className="col-span-full py-20 text-center text-slate-500 dark:text-slate-400">
                                        No matching salary heads found.
                                    </div>
                                ) : (
                                    paginatedData.map((item) => {
                                        const categoryColor = item.category === "Earnings"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                            : item.category === "Deductions"
                                                ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                                : "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400";
                                        return (
                                            <Card
                                                key={item.id}
                                                className={`p-4 border dark:border-gray-700 rounded-xl shadow-xs flex flex-col justify-between gap-3 bg-white dark:bg-background relative border-l-4 ${item.category === "Earnings"
                                                    ? "border-l-emerald-500 dark:border-l-emerald-400"
                                                    : item.category === "Deductions"
                                                        ? "border-l-red-500 dark:border-l-red-400"
                                                        : "border-l-purple-500 dark:border-l-purple-400"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1 flex-1">
                                                        <Badge className={`${categoryColor} text-[10px] px-2 py-0.5 font-bold border-none`}>
                                                            {item.category}
                                                        </Badge>
                                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-2 flex items-center gap-1.5">
                                                            {item.name}
                                                            <span className="text-xs font-normal text-slate-400">({item.code})</span>
                                                        </h4>
                                                        <p className="text-xs text-slate-500 line-clamp-2">{item.description || "No description provided."}</p>
                                                        <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1">Group: {item.group}</p>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="icon-sm"
                                                            variant="ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedHead(item);
                                                                setIsEditMode(false);
                                                                setIsSidebarOpen(true);
                                                            }}
                                                            className="h-7 w-7 text-slate-400 hover:text-theme hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon-sm"
                                                            variant="ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedHead(item);
                                                                setIsEditMode(true);
                                                                setIsSidebarOpen(true);
                                                            }}
                                                            className="h-7 w-7 text-slate-400 hover:text-theme hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon-sm"
                                                            variant="ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                confirmDelete(item.id);
                                                            }}
                                                            className="h-7 w-7 text-slate-400 hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-gray-700 pt-3 text-[11px]">
                                                    <div className="flex items-center justify-between pr-2 border-r border-slate-100 dark:border-gray-700">
                                                        <span className="text-slate-400">Display Order</span>
                                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{item.displayOrder}</span>
                                                    </div>

                                                    <div className="flex items-center justify-between pl-2">
                                                        <span className="text-slate-400">Status</span>
                                                        <Badge className={`text-[10px] px-2 py-0.5 font-semibold border-none ${item.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                                            }`}>
                                                            {item.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })
                                )}
                            </div>
                        ) : (
                            <div className="mt-4">
                                <DataTable table={table} isLoading={false} columnCount={columns.length} errorMessage="No matching salary heads found." />
                            </div>
                        )}

                        <div className="mt-4">
                            <Pagination pageIndex={pageIndex} setPageIndex={setPageIndex} isNextDisabled={pageIndex >= totalPages - 1 || totalPages === 0} />
                        </div>
                    </Card>
                </div>

                {isSidebarOpen && selectedHead && editingHead && (
                    <div className="w-full lg:w-[400px] animate-in slide-in-from-right duration-300 mb-2">
                        <Card className="bg-white dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm">
                            <CardContent className="p-0 flex flex-col h-full">
                                <div className="p-4 border-b dark:border-slate-800 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Salary Head Details</h3>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsSidebarOpen(false)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                <ScrollArea className="flex-1 p-4">
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Salary Head Name</Label>
                                            <Input
                                                value={editingHead.name}
                                                onChange={(e) => setEditingHead(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                className="h-10 border-slate-200 dark:border-slate-800 dark:text-white"
                                                disabled={!isEditMode}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Short Name</Label>
                                            <Input
                                                value={editingHead.shortName}
                                                onChange={(e) => setEditingHead(prev => prev ? { ...prev, shortName: e.target.value } : null)}
                                                className="h-10 border-slate-200 dark:border-slate-800 dark:text-white"
                                                disabled={!isEditMode}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Code</Label>
                                            <Input
                                                value={editingHead.code}
                                                onChange={(e) => setEditingHead(prev => prev ? { ...prev, code: e.target.value } : null)}
                                                className="h-10 border-slate-200 dark:border-slate-800 dark:text-white"
                                                disabled={!isEditMode}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Type (Category)</Label>
                                            <Select
                                                value={editingHead.category}
                                                onValueChange={(val: any) => setEditingHead(prev => prev ? { ...prev, category: val } : null)}
                                                disabled={!isEditMode}
                                            >
                                                <SelectTrigger className="w-full h-10 border-slate-200 dark:border-slate-800 dark:text-white">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Earnings">Earnings</SelectItem>
                                                    <SelectItem value="Deductions">Deductions</SelectItem>
                                                    <SelectItem value="Statutory">Statutory</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Display Order</Label>
                                            <Input
                                                type="number"
                                                value={editingHead.displayOrder}
                                                onChange={(e) => setEditingHead(prev => prev ? { ...prev, displayOrder: parseInt(e.target.value) || 0 } : null)}
                                                className="h-10 border-slate-200 dark:border-slate-800 dark:text-white"
                                                disabled={!isEditMode}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Group</Label>
                                            <Input
                                                value={editingHead.group}
                                                onChange={(e) => setEditingHead(prev => prev ? { ...prev, group: e.target.value } : null)}
                                                className="h-10 border-slate-200 dark:border-slate-800 dark:text-white"
                                                disabled={!isEditMode}
                                            />
                                        </div>

                                        <div className="col-span-1 flex flex-col justify-between border dark:border-slate-850 rounded-lg p-2.5 bg-slate-50/50 dark:bg-slate-900/50 gap-1.5">
                                            <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Status</Label>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold dark:text-slate-200">{editingHead.status}</span>
                                                <Switch
                                                    checked={editingHead.status === 'Active'}
                                                    onCheckedChange={(checked) => setEditingHead(prev => prev ? { ...prev, status: checked ? 'Active' : 'Inactive' } : null)}
                                                    className="data-checked:bg-emerald-500 scale-90"
                                                    disabled={!isEditMode}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-1 flex flex-col justify-between border dark:border-slate-850 rounded-lg p-2.5 bg-slate-50/50 dark:bg-slate-900/50 gap-1.5">
                                            <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Display in Payslip</Label>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold dark:text-slate-200">{editingHead.displayInPayslip ? 'Yes' : 'No'}</span>
                                                <Switch
                                                    checked={editingHead.displayInPayslip}
                                                    onCheckedChange={(checked) => setEditingHead(prev => prev ? { ...prev, displayInPayslip: checked } : null)}
                                                    className="data-checked:bg-emerald-500 scale-90"
                                                    disabled={!isEditMode}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex items-center justify-between border dark:border-slate-850 rounded-lg p-2.5 bg-slate-50/50 dark:bg-slate-900/50">
                                            <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Display in Salary Register</Label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold dark:text-slate-200">{editingHead.displayInSalaryRegister ? 'Yes' : 'No'}</span>
                                                <Switch
                                                    checked={editingHead.displayInSalaryRegister}
                                                    onCheckedChange={(checked) => setEditingHead(prev => prev ? { ...prev, displayInSalaryRegister: checked } : null)}
                                                    className="data-checked:bg-emerald-500 scale-90"
                                                    disabled={!isEditMode}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-2 space-y-1.5">
                                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Description</Label>
                                            <Textarea
                                                value={editingHead.description || ""}
                                                onChange={(e) => setEditingHead(prev => prev ? { ...prev, description: e.target.value } : null)}
                                                className="min-h-[80px] border-slate-200 dark:border-slate-800 resize-none text-xs dark:text-white"
                                                placeholder="Enter description..."
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                    </div>
                                </ScrollArea>

                                <div className="p-5 border-t dark:border-slate-800 grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="h-10 font-bold text-slate-600 border-slate-200 dark:border-slate-800 cursor-pointer" onClick={() => setIsSidebarOpen(false)}>Cancel</Button>
                                    <Button className="h-10 bg-theme text-white font-bold cursor-pointer" onClick={handleUpdate} disabled={!isEditMode}>Update</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
