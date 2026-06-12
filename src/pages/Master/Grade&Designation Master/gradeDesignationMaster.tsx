import { useEffect, useMemo, useState } from "react";
import { Trophy, Briefcase, ListOrdered, Search, SlidersHorizontal, Upload, Download, Plus, Edit2, Trash2, X, LayoutGrid, List, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useAlert } from "@/context/AlertContext";
import GradeDesignationDialog from "./GradeDesignationDialog";
import { DataTable } from "@/components/DataTable";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Define the Grade/Designation record type
type MasterRecord = {
    id: string;
    type: "Grade" | "Designation";
    code: string;
    shortName: string;
    description: string;
    active: boolean;
    sortOrder: number;
    exempted: boolean;
    addInDaily: boolean;
};

// Initial static data matching the mockup screenshot
const initialGrades: MasterRecord[] = [
    { id: "g1", type: "Grade", code: "ST", shortName: "ST", description: "Software Tester", active: true, sortOrder: 20, exempted: false, addInDaily: false },
    { id: "g2", type: "Grade", code: "TR_SD", shortName: "TR_CD", description: "Junior Software Developer", active: true, sortOrder: 18, exempted: false, addInDaily: true },
    { id: "g3", type: "Grade", code: "Trainee", shortName: "TDEVE", description: "TRAINEE SOFTWARE DEVELOPER", active: true, sortOrder: 41, exempted: false, addInDaily: false },
    { id: "g4", type: "Grade", code: "ADMIN", shortName: "ADMIN", description: "FRONTDESK ADMIN", active: true, sortOrder: 24, exempted: false, addInDaily: false },
    { id: "g5", type: "Grade", code: "SH.TECH", shortName: "TEACHER", description: "SCHOOL TEACHER", active: true, sortOrder: 28, exempted: true, addInDaily: true },
];

const initialDesignations: MasterRecord[] = [
    { id: "d1", type: "Designation", code: "TEST", shortName: "TEST", description: "TEST", active: true, sortOrder: 30, exempted: false, addInDaily: false },
    { id: "d2", type: "Designation", code: "TSD", shortName: "TSD", description: "TRAINEE PL/SQL DEVELOPER", active: true, sortOrder: 31, exempted: false, addInDaily: false },
    { id: "d3", type: "Designation", code: "T1", shortName: "T1", description: "Tester1", active: true, sortOrder: 32, exempted: false, addInDaily: false },
    { id: "d4", type: "Designation", code: "T2", shortName: "T2", description: "Tester2", active: true, sortOrder: 33, exempted: false, addInDaily: false },
    { id: "d5", type: "Designation", code: "ACS", shortName: "ACS", description: "ASSOCIATE CYBER SECURITY OFFICER", active: true, sortOrder: 34, exempted: false, addInDaily: false },
];

const completeMockData: MasterRecord[] = [
    ...initialGrades,
    ...initialDesignations,
];


export default function GradeDesignationMaster() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    // State Management
    const [data, setData] = useState<MasterRecord[]>(completeMockData);
    const [activeTab, setActiveTab] = useState<"All" | "Grade" | "Designation">("All");
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    // Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MasterRecord | null>(null);



    // Derived counts for Stats Cards
    const totalGrades = useMemo(() => data.filter((item) => item.type === "Grade" && item.active).length, [data]);
    const totalDesignations = useMemo(() => data.filter((item) => item.type === "Designation" && item.active).length, [data]);

    const statsCards = useMemo(() => [
        {
            title: "Total Grades",
            value: totalGrades,
            subtitle: "Active",
            icon: Trophy,
            bgClass: "bg-[#F7F5FF] dark:bg-purple-950/10",
            borderClass: "border-[#ECE7FF] dark:border-purple-900/20",
            iconBgClass: "bg-[#EFEAFF] dark:bg-purple-900/40",
            iconTextClass: "text-[#7C3AED] dark:text-purple-400",
            alignStart: false,
        },
        {
            title: "Total Designations",
            value: totalDesignations,
            subtitle: "Active",
            icon: Briefcase,
            bgClass: "bg-[#F3F7FF] dark:bg-blue-950/10",
            borderClass: "border-[#E1ECFF] dark:border-blue-900/20",
            iconBgClass: "bg-[#E8F0FF] dark:bg-blue-900/40",
            iconTextClass: "text-[#2563EB] dark:text-blue-400",
            alignStart: false,
        },
        {
            title: "Sorting Order",
            description: "This order will be applied in Payslip, Salary Register and other salary processes.",
            icon: ListOrdered,
            bgClass: "bg-[#FFF8F5] dark:bg-orange-950/10",
            borderClass: "border-[#FFE9E0] dark:border-orange-900/20",
            iconBgClass: "bg-[#FFEEE5] dark:bg-orange-900/40",
            iconTextClass: "text-[#EA580C] dark:text-orange-400",
            alignStart: true,
        }
    ], [totalGrades, totalDesignations]);

    // Handle Tab Switch (reset page index to 0 when filter changes)
    const handleTabChange = (tab: "All" | "Grade" | "Designation") => {
        setActiveTab(tab);
        setPageIndex(0);
    };

    // Inline Handlers for quick updates
    const handleActiveToggle = (id: string, checked: boolean) => {
        setData((prev) =>
            prev.map((item) => (item.id === id ? { ...item, active: checked } : item))
        );
        // showAlert({
        //     title: "Updated",
        //     description: "Status changed successfully.",
        //     variant: "success",
        // });
    };

    const handleCheckboxChange = (id: string, field: "exempted" | "addInDaily", checked: boolean) => {
        setData((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: checked } : item))
        );
    };

    const handleSortOrderChange = (id: string, value: string) => {
        const num = parseInt(value, 10);
        if (!isNaN(num)) {
            setData((prev) =>
                prev.map((item) => (item.id === id ? { ...item, sortOrder: num } : item))
            );
        }
    };

    // Open Dialog for Add
    const handleAddNew = () => {
        setSelectedRecord(null);
        setDialogOpen(true);
    };

    // Open Dialog for Edit
    const handleEdit = (record: MasterRecord) => {
        setSelectedRecord(record);
        setDialogOpen(true);
    };

    // Form Submit Handler
    const handleFormSubmit = (formData: Omit<MasterRecord, "id">) => {
        if (selectedRecord) {
            // Edit mode
            setData((prev) =>
                prev.map((item) =>
                    item.id === selectedRecord.id ? { ...item, ...formData } : item
                )
            );
            showAlert({
                title: "Success",
                description: `${formData.type} updated successfully.`,
                variant: "success",
            });
        } else {
            // Add mode
            const newRecord: MasterRecord = {
                id: Date.now().toString(),
                ...formData,
            };
            setData((prev) => [newRecord, ...prev]);
            setPageIndex(0);
            showAlert({
                title: "Success",
                description: `New ${formData.type} added successfully.`,
                variant: "success",
            });
        }
        setDialogOpen(false);
    };

    // Delete Handler
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

    // Filter and Paginate Data
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Tab filter
            if (activeTab === "Grade" && item.type !== "Grade") return false;
            if (activeTab === "Designation" && item.type !== "Designation") return false;

            // Search filter
            if (search) {
                const query = search.toLowerCase();
                return (
                    item.code.toLowerCase().includes(query) ||
                    item.shortName.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [data, activeTab, search]);

    // Sort: always list Grades first, then Designations (to match visual groupings)
    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === "Grade" ? -1 : 1;
            }
            return a.sortOrder - b.sortOrder;
        });
    }, [filteredData]);

    const totalPages = useMemo(() => {
        return Math.ceil(sortedData.length / pageSize);
    }, [sortedData, pageSize]);

    useEffect(() => {
        if (pageIndex >= totalPages && totalPages > 0) {
            setPageIndex(totalPages - 1);
        }
    }, [totalPages, pageIndex]);

    const paginatedData = useMemo(() => {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        return sortedData.slice(start, end);
    }, [sortedData, pageIndex, pageSize]);

    const columns = useMemo<ColumnDef<MasterRecord>[]>(
        () => [
            {
                id: "index",
                header: "sr no.",
                cell: ({ row }) => {
                    const originalIndex = sortedData.findIndex(d => d.id === row.original.id) + 1;
                    return originalIndex;
                },
            },
            {
                accessorKey: "type",
                header: "type",
                cell: ({ getValue }) => {
                    const type = getValue() as string;
                    const variant = type === "Grade"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30";
                    return (
                        <Badge variant="outline" className={`${variant} border font-bold text-[10px]`}>
                            {type}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "code",
                header: "code",
            },
            {
                accessorKey: "shortName",
                header: "short name",
            },
            {
                accessorKey: "description",
                header: "description",
            },
            {
                accessorKey: "active",
                header: "Active",
                cell: ({ getValue }) => {
                    const active = getValue() as boolean;
                    const variant = active
                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-500/30";
                    return (
                        <Badge variant="outline" className={`${variant} border font-bold text-[10px]`}>
                            {active ? "Active" : "Inactive"}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "sortOrder",
                header: "Sort Order",
            },
            {
                accessorKey: "exempted",
                header: "Exempted",
                cell: ({ getValue }) => (getValue() as boolean ? "Yes" : "No"),
            },
            {
                accessorKey: "addInDaily",
                header: "Add in Daily",
                cell: ({ getValue }) => (getValue() as boolean ? "Yes" : "No"),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleEdit(row.original)}
                            className="h-8 w-8 text-slate-500 hover:text-theme dark:hover:bg-slate-800"
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => confirmDelete(row.original.id)}
                            className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [sortedData]
    );

    const tableInstance = useReactTable({
        data: paginatedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex flex-col gap-4">

            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-6 h-6 text-[#202C4B] dark:text-white" />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-[#202C4B] dark:text-white">
                            Grade & Designation Master
                        </h1>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Maintain grade and designation in single order. Sorting order will be used in Payslip and Salary Register.
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:self-end">
                    <Button variant="outline" size="sm" className="h-9 px-4 text-slate-600 dark:text-slate-300 gap-1.5 border-slate-200 dark:border-gray-700">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filters
                        <span className="text-[10px] text-slate-400">▼</span>
                    </Button>

                    <Button variant="outline" size="sm" className="h-9 px-4 text-slate-600 dark:text-slate-300 gap-1.5 border-slate-200 dark:border-gray-700">
                        <Upload className="w-3.5 h-3.5" />
                        Import
                        <span className="text-[10px] text-slate-400">▼</span>
                    </Button>

                    <Button onClick={handleAddNew} size="sm" className="h-9 px-4 bg-theme hover:bg-theme/90 text-white gap-1.5 rounded-lg shadow-sm">
                        <Plus className="w-4 h-4" />
                        Add New
                    </Button>

                    <Button variant="outline" size="sm" className="h-9 px-4 text-slate-600 dark:text-slate-300 gap-1.5 border-slate-200 dark:border-gray-700">
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </Button>
                </div>
            </div>

            {/* 2. Top Statistic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statsCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <Card
                            key={idx}
                            className={`flex flex-row ${card.alignStart ? "items-start" : "items-center"} gap-4 p-5 ${card.bgClass} border ${card.borderClass} rounded-sm shadow-none`}
                        >
                            <div className={`flex items-center justify-center w-14 h-14 ${card.iconBgClass} ${card.iconTextClass} rounded-xl shrink-0`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-[#3B4A6F] dark:text-slate-300">{card.title}</span>
                                {card.description ? (
                                    <p className="text-xs text-[#7B87A0] dark:text-slate-400 mt-1.5 leading-relaxed">
                                        {card.description}
                                    </p>
                                ) : (
                                    <>
                                        <span className="text-2xl font-extrabold text-[#1A253C] dark:text-white mt-1">
                                            {card.value}
                                        </span>
                                        <span className="text-xs text-[#8F9BBA] dark:text-slate-400 mt-0.5">{card.subtitle}</span>
                                    </>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* 3. Filter Toolbar Card */}
            <Card className="bg-white dark:bg-background border dark:border-gray-700 shadow-sm overflow-hidden rounded-sm p-4">
                <div className="pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-gray-700">

                    {/* Segmented Filter Control */}
                    <Tabs
                        value={activeTab}
                        onValueChange={(val) => handleTabChange(val as "All" | "Grade" | "Designation")}
                        className="w-fit"
                    >
                        <TabsList className="bg-slate-100/80 dark:bg-gray-800 p-1 rounded-sm h-auto border-none shadow-none gap-0 flex items-center">
                            <TabsTrigger
                                value="All"
                                className="px-4 py-1.5 text-xs font-bold rounded-sm data-[state=active]:bg-theme! data-[state=active]:text-white! data-[state=active]:shadow-sm shadow-none border-none bg-transparent cursor-pointer"
                            >
                                All ({data.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="Grade"
                                className="px-4 py-1.5 text-xs font-bold rounded-sm data-[state=active]:bg-theme! data-[state=active]:text-white! data-[state=active]:shadow-sm shadow-none border-none bg-transparent cursor-pointer"
                            >
                                Grade ({data.filter(d => d.type === "Grade").length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="Designation"
                                className="px-4 py-1.5 text-xs font-bold rounded-sm data-[state=active]:bg-theme! data-[state=active]:text-white! data-[state=active]:shadow-sm shadow-none border-none bg-transparent cursor-pointer"
                            >
                                Designation ({data.filter(d => d.type === "Designation").length})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex flex-wrap items-center gap-3 md:flex-1 md:justify-end">
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
                                <SelectTrigger className="w-20 h-9 border-slate-200 dark:border-gray-700 bg-transparent">
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
                        <div className="flex items-center border border-slate-200 dark:border-gray-700 rounded-lg p-0.5 bg-slate-50 dark:bg-gray-800">
                            <Button
                                size="icon-sm"
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                onClick={() => setViewMode("grid")}
                                className={`h-7 w-7 p-0 rounded-md ${viewMode === "grid" ? "bg-theme text-white" : "text-slate-500"
                                    }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                size="icon-sm"
                                variant={viewMode === "list" ? "default" : "ghost"}
                                onClick={() => setViewMode("list")}
                                className={`h-7 w-7 p-0 rounded-md ${viewMode === "list" ? "bg-theme text-white" : "text-slate-500"
                                    }`}
                            >
                                <List className="w-3.5 h-3.5" />
                            </Button>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full max-w-[280px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Search grade or designation..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPageIndex(0);
                                }}
                                className="pl-9 pr-8 h-9 text-xs rounded-xl border-slate-200 dark:border-gray-700 focus:ring-1 focus:ring-theme bg-transparent dark:bg-background"
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

                {/* 4. Interactive Data Table (Grid or List View) */}
                {viewMode === "grid" ? (
                    // Grid View UI
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]">
                        {paginatedData.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-500 dark:text-slate-400">
                                No matching records found.
                            </div>
                        ) : (
                            paginatedData.map((item) => (
                                <Card
                                    key={item.id}
                                    className={`p-4 border dark:border-gray-700 rounded-xl shadow-xs flex flex-col justify-between gap-3 bg-white dark:bg-background relative ${item.type === "Grade" ? "border-l-4 border-l-purple-500 dark:border-l-purple-400" : "border-l-4 border-l-blue-500 dark:border-l-blue-400"
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Badge
                                                className={`text-[10px] px-2 py-0.5 font-bold ${item.type === "Grade"
                                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400"
                                                    : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                                                    }`}
                                            >
                                                {item.type}
                                            </Badge>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-2 flex items-center gap-1.5">
                                                {item.code}
                                                <span className="text-xs font-normal text-slate-400">({item.shortName})</span>
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon-sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(item)}
                                                className="h-7 w-7 text-slate-400 hover:text-theme hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                size="icon-sm"
                                                variant="ghost"
                                                onClick={() => confirmDelete(item.id)}
                                                className="h-7 w-7 text-slate-400 hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-gray-700 pt-3 text-[11px]">
                                        <div className="flex items-center justify-between pr-2 border-r border-slate-100 dark:border-gray-700">
                                            <span className="text-slate-400">Sort Order</span>
                                            <input
                                                type="number"
                                                value={item.sortOrder}
                                                onChange={(e) => handleSortOrderChange(item.id, e.target.value)}
                                                className="w-10 text-center py-0.5 rounded border border-slate-200 dark:border-gray-700 bg-transparent text-[11px] font-medium"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between pl-2">
                                            <span className="text-slate-400">Active</span>
                                            <Switch
                                                size="sm"
                                                checked={item.active}
                                                onCheckedChange={(checked) => handleActiveToggle(item.id, checked)}
                                                className="scale-90 data-checked:bg-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-slate-50 dark:bg-gray-800/40 p-2 rounded-lg text-[10px] mt-1">
                                        <div className="flex items-center gap-1.5">
                                            <Checkbox
                                                id={`ex-grid-${item.id}`}
                                                checked={item.exempted}
                                                onCheckedChange={(checked) => handleCheckboxChange(item.id, "exempted", !!checked)}
                                                className="scale-90"
                                            />
                                            <label htmlFor={`ex-grid-${item.id}`} className="text-slate-500 font-medium cursor-pointer">Exempted</label>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <Checkbox
                                                id={`daily-grid-${item.id}`}
                                                checked={item.addInDaily}
                                                onCheckedChange={(checked) => handleCheckboxChange(item.id, "addInDaily", !!checked)}
                                                className="scale-90"
                                            />
                                            <label htmlFor={`daily-grid-${item.id}`} className="text-slate-500 font-medium cursor-pointer">Add in Daily</label>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                ) : (
                    // List/Table View UI Using Reusable DataTable
                    <DataTable
                        table={tableInstance}
                        isLoading={false}
                        isError={false}
                        columnCount={columns.length}
                        errorMessage="No matching records found."
                        className="dark:bg-background"
                    />
                )}

                <Pagination
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    isNextDisabled={pageIndex >= totalPages - 1 || totalPages === 0}
                />
            </Card>

            {/* 6. Add / Edit Record Modal Dialog */}
            <GradeDesignationDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={selectedRecord}
                onSubmit={handleFormSubmit}
                suggestedSortOrder={data.length > 0 ? Math.max(...data.map(d => d.sortOrder)) + 1 : 1}
            />

        </div>
    );
}