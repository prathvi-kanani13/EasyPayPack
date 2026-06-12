/* eslint-disable react-hooks/incompatible-library */
import {
    Search,
    FileText,
    UserCheck,
    UserMinus,
    Building2,
    Eye,
    PenTool,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useMemo, useState } from 'react';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef
} from "@tanstack/react-table";
import { DataTable } from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { useRef } from 'react';
import { useAlert } from '@/context/AlertContext';
import { useNavigate } from 'react-router-dom';
import SignatureCard from './Components/SignatureCard';
import type { Signature } from './TypeSignature';
import { useLayoutWidth } from '@/layout/Layout';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Mock Data
const signatureData = [
    {
        id: 1,
        authorityName: 'Rahul Sharma',
        designation: 'HR Manager',
        department: 'HR',
        effectiveFrom: '01 Jan 2025',
        effectiveTo: '',
        status: 'Active',
        signatureUrl: '/signature1.png',
        description: 'Authorized signature for HR department letters and reports.'
    },
    {
        id: 2,
        authorityName: 'Neha Verma',
        designation: 'Payroll Head',
        department: 'Payroll',
        effectiveFrom: '01 Jan 2025',
        effectiveTo: '',
        status: 'Active',
        signatureUrl: '/signature2.png',
        description: ''
    },
    {
        id: 3,
        authorityName: 'Sandeep Patel',
        designation: 'Finance Manager',
        department: 'Finance',
        effectiveFrom: '15 Feb 2025',
        effectiveTo: '',
        status: 'Active',
        signatureUrl: '/signature3.png',
        description: ''
    },
    {
        id: 4,
        authorityName: 'Anita Singh',
        designation: 'Compliance Head',
        department: 'Compliance',
        effectiveFrom: '01 Mar 2025',
        effectiveTo: '',
        status: 'Active',
        signatureUrl: '/signature4.png',
        description: ''
    },
    {
        id: 5,
        authorityName: 'Vikram Mehta',
        designation: 'Operations Head',
        department: 'Operations',
        effectiveFrom: '01 Jan 2025',
        effectiveTo: '',
        status: 'Active',
        signatureUrl: '/signature5.png',
        description: ''
    },
    {
        id: 6,
        authorityName: 'Pooja Nair',
        designation: 'Admin Manager',
        department: 'Administration',
        effectiveFrom: '10 Feb 2025',
        effectiveTo: '',
        status: 'Inactive',
        signatureUrl: '/signature6.png',
        description: ''
    },
    {
        id: 7,
        authorityName: 'Karan Malhotra',
        designation: 'IT Manager',
        department: 'IT',
        effectiveFrom: '01 Jan 2025',
        effectiveTo: '',
        status: 'Active',
        signatureUrl: '/signature7.png',
        description: ''
    },
    {
        id: 8,
        authorityName: 'Meera Joshi',
        designation: 'Legal Advisor',
        department: 'Legal',
        effectiveFrom: '20 Jan 2025',
        effectiveTo: '',
        status: 'Inactive',
        signatureUrl: '/signature8.png',
        description: ''
    },
];

const stats = [
    { label: 'Total Signatures', value: 24, sub: 'All signatures', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Active Signatures', value: 20, sub: 'Currently active', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Inactive Signatures', value: 4, sub: 'Not in use', icon: UserMinus, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Departments', value: 8, sub: 'With signatures', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
];

export default function SignatureList() {

    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const width = useLayoutWidth();

    const isMobile = width <= 768;

    const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);
    const [isRemoved, setIsRemoved] = useState(false);
    const [localStatus, setLocalStatus] = useState<string>(signatureData[0].status);
    const [globalFilter, setGlobalFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize] = useState(10);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = (file: File) => {
        if (file.size <= 2 * 1024 * 1024) {
            const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
            if (supportedFormats.includes(file.type)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSignatureImage(reader.result as string);
                    setIsRemoved(false);
                };
                reader.readAsDataURL(file);
            } else {
                showAlert({
                    title: 'Invalid Format',
                    description: 'Unsupported file format. Please upload PNG, JPG, JPEG, or SVG.',
                    variant: 'error',
                });
            }
        } else {
            showAlert({
                title: 'File Too Large',
                description: 'File size exceeds 2 MB limit.',
                variant: 'error',
            });
        }
    };

    const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleClearSignature = () => {
        setSignatureImage(null);
        setIsRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const filteredData = useMemo(() => {
        return signatureData.filter((item) => {
            const matchesDept = !deptFilter || deptFilter === 'all' || item.department.toLowerCase() === deptFilter.toLowerCase();
            const matchesStatus = !statusFilter || statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesDept && matchesStatus;
        });
    }, [deptFilter, statusFilter]);

    const columns = useMemo<ColumnDef<Signature>[]>(
        () => [
            {
                accessorKey: "authorityName",
                header: "Authority Name",
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-10 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                            <PenTool size={18} className="text-slate-400 opacity-30" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{row.original.authorityName}</p>
                            <p className="text-[11px] text-slate-500">{row.original.designation}</p>
                        </div>
                    </div>
                )
            },
            { accessorKey: "designation", header: "Designation" },
            { accessorKey: "department", header: "Department" },
            { accessorKey: "effectiveFrom", header: "Effective From" },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => (
                    <Badge className={`${row.original.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'} border-none px-3 py-1 font-bold text-[10px]`}>
                        {row.original.status}
                    </Badge>
                )
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-theme"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSignature(row.original);
                                setSignatureImage(row.original.signatureUrl);
                                setLocalStatus(row.original.status);
                                setIsRemoved(false);
                                setIsSidebarOpen(true);
                            }}
                        >
                            <Eye size={16} />
                        </Button>
                    </div>
                )
            }
        ],
        []
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        // onGlobalFilterChange: setGlobalFilter,
        // onPaginationChange: (updater) => {
        //     if (typeof updater === 'function') {
        //         const nextState = updater({ pageIndex, pageSize });
        //         setPageIndex(nextState.pageIndex);
        //     }
        // },
    });

    return (
        <div className="min-h-screen">

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant={'ghost'}
                        onClick={() => navigate(-1)}
                        size={'icon-sm'}
                    >
                        <ArrowLeft className="text-[#202C4B] dark:text-white" style={{ height: '24px', width: '24px' }} />
                    </Button>
                    <h1 className="text-xl md:text-2xl font-bold text-[#202C4B] dark:text-white">
                        Signature List
                    </h1>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="overflow-hidden bg-background rounded-lg border dark:border-gray-700 shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5 dark:text-slate-400">{stat.sub}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Main Table Area */}
                <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:w-2/3' : 'w-full'}`}>
                    <Card className="dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm">
                        {/* Toolbar */}
                        <CardHeader className="p-4 border-b dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center justify-end gap-3 flex-1">
                                <div className="relative w-full max-w-75">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <Input
                                        placeholder="Search by name, designation"
                                        value={globalFilter}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="pl-10 h-10 border-slate-200 dark:border-slate-800 focus:ring-[#FF6B00]"
                                    />
                                </div>
                                <Select value={deptFilter} onValueChange={setDeptFilter}>
                                    <SelectTrigger size="lg" className="w-42.5 border-slate-200 dark:border-slate-800 focus:ring-[#FF6B00]">
                                        <SelectValue placeholder="Select Departments" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="hr">HR</SelectItem>
                                        <SelectItem value="it">IT</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger size="lg" className="w-32.5 border-slate-200 dark:border-slate-800 focus:ring-[#FF6B00]">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4">
                            {/* Table */}
                            <DataTable
                                table={table}
                                isLoading={false}
                                columnCount={columns.length}
                            />

                            <div className="p-4 border-t dark:border-slate-800">
                                <Pagination
                                    pageIndex={pageIndex}
                                    setPageIndex={setPageIndex}
                                    isNextDisabled={!table.getCanNextPage()}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Details Sidebar */}
                {isSidebarOpen && selectedSignature && (isMobile ?
                    (
                        <Dialog open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <DialogContent className="max-h-130 overflow-auto p-0 gap-0">
                                <SignatureCard
                                    selectedSignature={selectedSignature}
                                    signatureImage={signatureImage}
                                    isRemoved={isRemoved}
                                    localStatus={localStatus}
                                    fileInputRef={fileInputRef}
                                    setIsSidebarOpen={setIsSidebarOpen}
                                    setSignatureImage={setSignatureImage}
                                    setLocalStatus={setLocalStatus}
                                    handleSignatureUpload={handleSignatureUpload}
                                    handleClearSignature={handleClearSignature}
                                    isMobile={isMobile}
                                />
                            </DialogContent>
                        </Dialog>
                    ) :
                    (
                        <div className="w-full lg:w-100 animate-in slide-in-from-right duration-300 mb-2">
                            <Card className="dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm">
                                <CardContent className="p-0 flex flex-col h-full">
                                    <SignatureCard
                                        selectedSignature={selectedSignature}
                                        signatureImage={signatureImage}
                                        isRemoved={isRemoved}
                                        localStatus={localStatus}
                                        fileInputRef={fileInputRef}
                                        setIsSidebarOpen={setIsSidebarOpen}
                                        setSignatureImage={setSignatureImage}
                                        setLocalStatus={setLocalStatus}
                                        handleSignatureUpload={handleSignatureUpload}
                                        handleClearSignature={handleClearSignature}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
