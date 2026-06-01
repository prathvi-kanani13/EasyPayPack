import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DatePickerInput } from "@/components/DatePickerInput";
import { DataTable } from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import { getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Eye, FileText, Search, X, MoreVertical } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Employee {
    id: string;
    code: string;
    name: string;
    email: string;
    mobile: string;
    designation: string;
    department: string;
    location: string;
    doj: string;
    status: string;
    reportingManager: string;
    gender: string;
    bloodGroup: string;
    employeeType: string;
    workStatus: string;
}

const employeeData: Employee[] = [
    {
        id: "1",
        code: "EMP248",
        name: "Rohan Mehta",
        email: "rohan.mehta@easypaypack.com",
        mobile: "9876543210",
        designation: "Senior Software Engineer",
        department: "Engineering",
        location: "Noida",
        doj: "15-05-2025",
        status: "Active",
        reportingManager: "John Doe",
        gender: "Male",
        bloodGroup: "O+",
        employeeType: "Full Time",
        workStatus: "Active",
    },
    {
        id: "2",
        code: "EMP247",
        name: "Sneha Kapoor",
        email: "sneha.kapoor@easypaypack.com",
        mobile: "9876543211",
        designation: "HR Executive",
        department: "Human Resources",
        location: "Delhi",
        doj: "14-05-2025",
        status: "Active",
        reportingManager: "Sarah Smith",
        gender: "Female",
        bloodGroup: "B+",
        employeeType: "Full Time",
        workStatus: "Active",
    },
    {
        id: "3",
        code: "EMP246",
        name: "Arjun Verma",
        email: "arjun.verma@easypaypack.com",
        mobile: "9876543212",
        designation: "Data Analyst",
        department: "Analytics",
        location: "Bangalore",
        doj: "12-05-2025",
        status: "Active",
        reportingManager: "Mike Johnson",
        gender: "Male",
        bloodGroup: "A+",
        employeeType: "Full Time",
        workStatus: "Active",
    },
    {
        id: "4",
        code: "EMP245",
        name: "Neha Singh",
        email: "neha.singh@easypaypack.com",
        mobile: "9876543213",
        designation: "UI/UX Designer",
        department: "Design",
        location: "Noida",
        doj: "10-05-2025",
        status: "Active",
        reportingManager: "Emma Wilson",
        gender: "Female",
        bloodGroup: "O-",
        employeeType: "Full Time",
        workStatus: "Active",
    },
    {
        id: "5",
        code: "EMP244",
        name: "Vikram Patel",
        email: "vikram.patel@easypaypack.com",
        mobile: "9876543214",
        designation: "DevOps Engineer",
        department: "Engineering",
        location: "Pune",
        doj: "08-05-2025",
        status: "Active",
        reportingManager: "David Brown",
        gender: "Male",
        bloodGroup: "B-",
        employeeType: "Full Time",
        workStatus: "Active",
    },
];

export default function EmployeeMaster() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [designationFilter, setDesignationFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [employeeTypeFilter, setEmployeeTypeFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reportingManagerFilter, setReportingManagerFilter] = useState("");
    const [genderFilter, setGenderFilter] = useState("");
    const [bloodGroupFilter, setBloodGroupFilter] = useState("");
    const [workStatusFilter, setWorkStatusFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const filteredData = useMemo(() => {
        return employeeData.filter((item) => {
            const searchTerm = search.trim().toLowerCase();
            const matchesSearch =
                !searchTerm ||
                item.code.toLowerCase().includes(searchTerm) ||
                item.name.toLowerCase().includes(searchTerm) ||
                item.email.toLowerCase().includes(searchTerm) ||
                item.mobile.toLowerCase().includes(searchTerm);

            const matchesStatus =
                !statusFilter || item.status === statusFilter;

            const matchesDepartment =
                !departmentFilter || item.department === departmentFilter;

            const matchesDesignation =
                !designationFilter || item.designation === designationFilter;

            const matchesLocation =
                !locationFilter || item.location === locationFilter;

            const matchesEmployeeType =
                !employeeTypeFilter || item.employeeType === employeeTypeFilter;

            const matchesReportingManager =
                !reportingManagerFilter || item.reportingManager === reportingManagerFilter;

            const matchesGender =
                !genderFilter || item.gender === genderFilter;

            const matchesBloodGroup =
                !bloodGroupFilter || item.bloodGroup === bloodGroupFilter;

            const matchesWorkStatus =
                !workStatusFilter || item.workStatus === workStatusFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesDepartment &&
                matchesDesignation &&
                matchesLocation &&
                matchesEmployeeType &&
                matchesReportingManager &&
                matchesGender &&
                matchesBloodGroup &&
                matchesWorkStatus
            );
        });
    }, [search, statusFilter, departmentFilter, designationFilter, locationFilter, employeeTypeFilter, reportingManagerFilter, genderFilter, bloodGroupFilter, workStatusFilter]);

    const columns = useMemo<ColumnDef<Employee>[]>(
        () => [
            {
                accessorKey: "code",
                header: "EMPLOYEE CODE",
            },
            {
                accessorKey: "name",
                header: "EMPLOYEE NAME",
            },
            {
                accessorKey: "email",
                header: "EMAIL",
            },
            {
                accessorKey: "mobile",
                header: "MOBILE",
            },
            {
                accessorKey: "designation",
                header: "DESIGNATION",
            },
            {
                accessorKey: "department",
                header: "DEPARTMENT",
            },
            {
                accessorKey: "location",
                header: "LOCATION",
            },
            {
                accessorKey: "employeeType",
                header: "EMPLOYEE TYPE",
            },
            {
                accessorKey: "doj",
                header: "DOJ",
            },
            {
                accessorKey: "reportingManager",
                header: "REPORTING MANAGER",
            },
            {
                accessorKey: "gender",
                header: "GENDER",
            },
            {
                accessorKey: "bloodGroup",
                header: "BLOOD GROUP",
            },
            {
                accessorKey: "workStatus",
                header: "WORK STATUS",
            },
            {
                accessorKey: "status",
                header: "STATUS",
                cell: ({ row }) => (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {row.getValue("status")}
                    </Badge>
                ),
            },
            {
                id: "actions",
                header: "ACTIONS",
                cell: () => (
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical size={16} />
                        </Button>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onPaginationChange: (newPagination) => {
            if (typeof newPagination === "function") {
                const next = newPagination({ pageIndex, pageSize });
                setPageIndex(next.pageIndex);
                setPageSize(next.pageSize);
            } else {
                setPageIndex(newPagination.pageIndex);
                setPageSize(newPagination.pageSize);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const hasActiveFilters =
        search ||
        statusFilter !== "" ||
        departmentFilter !== "All" ||
        designationFilter !== "All" ||
        locationFilter !== "All" ||
        employeeTypeFilter !== "All" ||
        fromDate ||
        toDate ||
        reportingManagerFilter !== "All" ||
        genderFilter !== "All" ||
        bloodGroupFilter !== "All" ||
        workStatusFilter !== "All";

    const clearAll = () => {
        setSearch("");
        setStatusFilter("");
        setDepartmentFilter("");
        setDesignationFilter("");
        setLocationFilter("");
        setEmployeeTypeFilter("");
        setFromDate("");
        setToDate("");
        setReportingManagerFilter("");
        setGenderFilter("");
        setBloodGroupFilter("");
        setWorkStatusFilter("");
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center flex-wrap gap-4">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-6 h-6 text-[#202C4B] dark:text-white" />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-[#202C4B] dark:text-white">Employee Master</h1>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Manage and maintain all employee records here.
                        </span>
                    </div>
                </div>

                <div className="flex flex-1 justify-end gap-2">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        Export PDF
                        <FileText className="w-4 h-4" />
                    </Button>
                    <Button className="text-white rounded-sm" onClick={() => navigate("/employee/add")}>
                        Add Employee
                    </Button>
                </div>
            </div>

            <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
                <div className="flex flex-col gap-4">

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8">
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Status
                            </Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Department
                            </Label>
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                                    <SelectItem value="Analytics">Analytics</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Designation
                            </Label>
                            <Select value={designationFilter} onValueChange={setDesignationFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Designation" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Senior Software Engineer">Senior Software Engineer</SelectItem>
                                    <SelectItem value="HR Executive">HR Executive</SelectItem>
                                    <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                                    <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Location
                            </Label>
                            <Select value={locationFilter} onValueChange={setLocationFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Noida">Noida</SelectItem>
                                    <SelectItem value="Delhi">Delhi</SelectItem>
                                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                                    <SelectItem value="Pune">Pune</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Employee Type
                            </Label>
                            <Select value={employeeTypeFilter} onValueChange={setEmployeeTypeFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Employee Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Full Time">Full Time</SelectItem>
                                    <SelectItem value="Part Time">Part Time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8">
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Date of Joining
                            </Label>
                            <DatePickerInput
                                value={fromDate}
                                onChange={setFromDate}
                                placeholder="Select Date"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Reporting Manager
                            </Label>
                            <Select value={reportingManagerFilter} onValueChange={setReportingManagerFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Reporting Manager" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="John Doe">John Doe</SelectItem>
                                    <SelectItem value="Sarah Smith">Sarah Smith</SelectItem>
                                    <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Gender
                            </Label>
                            <Select value={genderFilter} onValueChange={setGenderFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Blood Group
                            </Label>
                            <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Blood Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                Work Status
                            </Label>
                            <Select value={workStatusFilter} onValueChange={setWorkStatusFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Work Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="relative max-w-xl w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                            <Input
                                placeholder="Search by Employee Code, Name, Email, Mobile..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-10 w-full"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button className="gap-2 bg-theme text-white dark:bg-theme dark:text-white">
                                Filters
                            </Button>
                            {hasActiveFilters && (
                                <Button onClick={clearAll} variant="outline" className="gap-2">
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total Employees: <span className="font-semibold text-theme">{filteredData.length}</span>
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
                </div>
            </Card>
        </div>
    );
}
