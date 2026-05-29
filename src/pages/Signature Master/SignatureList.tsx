import {
    Search,
    FileText,
    UserCheck,
    UserMinus,
    Building2,
    Eye,
    Edit2,
    X,
    Calendar as CalendarIcon,
    Trash2,
    RotateCcw,
    PenTool,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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

    const [selectedSignature, setSelectedSignature] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
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

    const columns = useMemo<ColumnDef<any>[]>(
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
                // header: "Actions",
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
                                setIsEditMode(false);
                            }}
                        >
                            <Eye size={16} />
                        </Button>
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
                                setIsEditMode(true);
                            }}
                        >
                            <Edit2 size={16} />
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
                        <CardContent className="p-4">
                            {/* Toolbar */}
                            <div className="p-4 border-b dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-3 flex-1">
                                    <div className="relative w-full max-w-[300px]">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <Input
                                            placeholder="Search by name, designation..."
                                            value={globalFilter}
                                            onChange={(e) => setGlobalFilter(e.target.value)}
                                            className="pl-10 h-10 border-slate-200 dark:border-slate-800 focus:ring-[#FF6B00]"
                                        />
                                    </div>
                                    <Select value={deptFilter} onValueChange={setDeptFilter}>
                                        <SelectTrigger className="w-[170px] h-10 border-slate-200 dark:border-slate-800 focus:ring-[#FF6B00]">
                                            <SelectValue placeholder="Select Departments" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="hr">HR</SelectItem>
                                            <SelectItem value="it">IT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[130px] h-10 border-slate-200 dark:border-slate-800 focus:ring-[#FF6B00]">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

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
                {isSidebarOpen && selectedSignature && (
                    <div className="w-full lg:w-[400px] animate-in slide-in-from-right duration-300 mb-2">
                        <Card className="dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm">
                            <CardContent className="p-0 flex flex-col h-full">
                                <div className="p-4 border-b dark:border-slate-800 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Signature Details</h3>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
                                        <X size={18} />
                                    </Button>
                                </div>

                                <ScrollArea className="flex-1 p-4">
                                    <div key={selectedSignature.id} className="space-y-6">
                                        {/* Preview */}
                                        <div className="space-y-3">
                                            <div className="w-full h-30 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center overflow-hidden">
                                                {isRemoved ? (
                                                    <div className="flex flex-col items-center gap-2 opacity-50">
                                                        <h1 className="text-sm font-semibold dark:text-white">Not Uploaded any Signature</h1>
                                                    </div>
                                                ) : signatureImage ? (
                                                    <img
                                                        src={signatureImage}
                                                        alt="Signature"
                                                        className="max-h-[90%] max-w-[90%] object-contain"
                                                        onError={() => setSignatureImage(null)}
                                                    />
                                                ) : (
                                                    <>
                                                        <div className="text-4xl font-serif text-slate-900 dark:text-white italic opacity-80 select-none">
                                                            {selectedSignature.authorityName}
                                                        </div>
                                                        <div className="w-4/5 h-[1px] bg-slate-900 dark:bg-white/50 mt-1"></div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    className="flex-1 bg-theme text-white text-xs font-bold gap-2 h-9 rounded-md"
                                                    disabled={!isEditMode}
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <RotateCcw size={14} />
                                                    Change Signature
                                                </Button>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={handleSignatureUpload}
                                                />
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 text-xs font-bold gap-2 h-9 rounded-md"
                                                    disabled={!isEditMode}
                                                    onClick={handleClearSignature}
                                                >
                                                    <Trash2 size={14} />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Authority Name</Label>
                                                <Input defaultValue={selectedSignature.authorityName} className="h-10 border-slate-200 dark:border-slate-800" disabled={!isEditMode} />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Designation</Label>
                                                <Input defaultValue={selectedSignature.designation} className="h-10 border-slate-200 dark:border-slate-800" disabled={!isEditMode} />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Department</Label>
                                                <Select defaultValue={selectedSignature.department.toLowerCase()} disabled={!isEditMode}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="hr">HR</SelectItem>
                                                        <SelectItem value="payroll">Payroll</SelectItem>
                                                        <SelectItem value="finance">Finance</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Effective From</Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild disabled={!isEditMode}>
                                                            <Button variant="outline" className="w-full justify-between h-10 border-slate-200 dark:border-slate-800 font-normal text-slate-400" disabled={!isEditMode}>
                                                                Select Date
                                                                <CalendarIcon size={14} />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar mode="single" />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Effective To</Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild disabled={!isEditMode}>
                                                            <Button variant="outline" className="w-full justify-between h-10 border-slate-200 dark:border-slate-800 font-normal text-slate-400" disabled={!isEditMode}>
                                                                Select date
                                                                <CalendarIcon size={14} />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar mode="single" />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Status</Label>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={localStatus === 'Active'}
                                                        disabled={!isEditMode}
                                                        onCheckedChange={(checked) => setLocalStatus(checked ? 'Active' : 'Inactive')}
                                                    />
                                                    <span className={`text-xs font-bold`}>
                                                        {localStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Description</Label>
                                                <Textarea
                                                    placeholder="Authorized signature for..."
                                                    className="min-h-[80px] border-slate-200 dark:border-slate-800 resize-none text-xs"
                                                    defaultValue={selectedSignature.description}
                                                    disabled={!isEditMode}
                                                />
                                            </div>
                                            {/* <div>
                                                <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300 mb-2">Allowed Departments</p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="text-[11px] border-[#FF6B00] text-[#FF6B00] bg-orange-50 dark:bg-orange-950/20">HR</Badge>
                                                    <Badge variant="outline" className="text-[11px] border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-950/20">Payroll</Badge>
                                                    <Badge variant="outline" className="text-[11px] border-purple-600 text-purple-600 bg-purple-50 dark:bg-purple-950/20">Finance</Badge>
                                                    <Badge variant="outline" className="text-[11px] border-slate-300 text-slate-600 bg-slate-50 dark:bg-slate-800">+2 more</Badge>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Allowed Templates</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="text-[11px] border-[#FF6B00] text-[#FF6B00] bg-orange-50 dark:bg-orange-950/20">Experience Letter</Badge>
                                                    <Badge variant="outline" className="text-[11px] border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-950/20">Offer Letter</Badge>
                                                    <Badge variant="outline" className="text-[11px] border-purple-600 text-purple-600 bg-purple-50 dark:bg-purple-950/20">Salary Certificate</Badge>
                                                    <Badge variant="outline" className="text-[11px] border-slate-300 text-slate-600 bg-slate-50 dark:bg-slate-800">+2 more</Badge>
                                                </div>
                                            </div> */}
                                            <div className="grid grid-cols-2 gap-6 pt-2">
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Created By</p>
                                                    <p className="text-xs font-bold text-slate-700 mt-1">Admin User</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">01 Jan 2025 10:30 AM</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Updated By</p>
                                                    <p className="text-xs font-bold text-slate-700 mt-1">Admin User</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">05 May 2025 04:15 PM</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>

                                <div className="p-5 border-t dark:border-slate-800 grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="h-10 font-bold text-slate-600 border-slate-200 dark:border-slate-800" onClick={() => setIsSidebarOpen(false)}>Cancel</Button>
                                    <Button className="h-10 bg-theme text-white font-bold" disabled={!isEditMode}>Update</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
