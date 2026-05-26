import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { Upload, User, Settings, Calendar as CalendarIcon, Info, Save, X, Clock, LayoutList, Briefcase, PenTool, ArrowLeft } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
    authorityName: yup.string().required('Authority name is required'),
    employee: yup.string().required('Employee is required'),
    designation: yup.string().required('Designation is required'),
    department: yup.string().required('Department is required'),
    signatureCode: yup.string().required('Signature code is required'),
    status: yup.string().required('Status is required'),
    effectiveFrom: yup.string().required('Effective from date is required'),
    effectiveTo: yup.string(),
    description: yup.string().max(250, 'Maximum 250 characters allowed'),
});

interface AllowedItem {
    id: string;
    name: string;
    checked: boolean;
}

export default function AddSignature() {

    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [signatureImage, setSignatureImage] = useState<string | null>(null);
    const [signatureFile, setSignatureFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [allowedDepts, setAllowedDepts] = useState<AllowedItem[]>([
        { id: '1', name: 'HR', checked: true },
        { id: '2', name: 'Payroll', checked: true },
        { id: '3', name: 'Finance', checked: false },
        { id: '4', name: 'Accounts', checked: false },
        { id: '5', name: 'Administration', checked: false },
    ]);

    const [allowedTemplates, setAllowedTemplates] = useState<AllowedItem[]>([
        { id: '1', name: 'Experience Letter', checked: true },
        { id: '2', name: 'Offer Letter', checked: true },
        { id: '3', name: 'Salary Certificate', checked: false },
        { id: '4', name: 'Relieving Letter', checked: true },
        { id: '5', name: 'Appointment Letter', checked: false },
    ]);

    const [signatureSettings, setSignatureSettings] = useState<AllowedItem[]>([
        { id: 'active', name: 'Active Signature', checked: false },
        { id: 'show-name', name: 'Show Name Below Signature', checked: false },
        { id: 'transparent', name: 'Use Transparent Background', checked: false },
        { id: 'show-desig', name: 'Show Designation Below Signature', checked: false },
        { id: 'auto-scale', name: 'Allow Auto Scaling', checked: false },
    ]);

    const [signatureSourceType, setSignatureSourceType] = useState<string>('uploaded');

    const {
        register,
        handleSubmit,
        control,
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            status: 'Active',
        },
    });

    const processFile = (file: File) => {
        if (file.size <= 2 * 1024 * 1024) {
            const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
            if (supportedFormats.includes(file.type)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSignatureImage(reader.result as string);
                    setSignatureFile(file);
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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleClearSignature = () => {
        setSignatureImage(null);
        setSignatureFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const toggleAllDepts = (checked: boolean) => {
        setAllowedDepts(allowedDepts.map(d => ({ ...d, checked })));
    };

    const toggleAllTemplates = (checked: boolean) => {
        setAllowedTemplates(allowedTemplates.map(t => ({ ...t, checked })));
    };

    const makeImageTransparent = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imgData.data;

                        for (let i = 0; i < data.length; i += 4) {
                            const r = data[i];
                            const g = data[i + 1];
                            const b = data[i + 2];

                            // Threshold for white background
                            if (r > 240 && g > 240 && b > 240) {
                                data[i + 3] = 0; // Set alpha to 0
                            }
                        }
                        ctx.putImageData(imgData, 0, 0);
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", { type: 'image/png' });
                                resolve(newFile);
                            } else {
                                resolve(file);
                            }
                        }, 'image/png');
                    } else {
                        resolve(file);
                    }
                };
            };
            reader.readAsDataURL(file);
        });
    };

    const scaleImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 300;
                    const MAX_HEIGHT = 150;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const newFile = new File([blob], file.name, { type: file.type });
                                resolve(newFile);
                            } else {
                                resolve(file);
                            }
                        }, file.type);
                    } else {
                        resolve(file);
                    }
                };
            };
            reader.readAsDataURL(file);
        });
    };

    const addDetailsToSignature = (file: File, name: string, designation: string, showName: boolean, showDesig: boolean): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        const padding = 20;
                        const fontSize = 16;
                        const lineDelta = 20;

                        let extraHeight = 0;
                        if (showName) extraHeight += fontSize + padding;
                        if (showDesig) extraHeight += fontSize + (showName ? lineDelta : padding);

                        canvas.width = img.width;
                        canvas.height = img.height + extraHeight;

                        ctx.drawImage(img, 0, 0);

                        ctx.font = `${fontSize}px Arial`;
                        ctx.fillStyle = 'black';
                        ctx.textAlign = 'center';

                        let currentY = img.height + fontSize;

                        if (showName) {
                            ctx.fillText(name, canvas.width / 2, currentY);
                            currentY += lineDelta;
                        }

                        if (showDesig) {
                            ctx.fillText(designation, canvas.width / 2, currentY);
                        }

                        canvas.toBlob((blob) => {
                            if (blob) {
                                const newFile = new File([blob], file.name, { type: file.type });
                                resolve(newFile);
                            } else {
                                resolve(file);
                            }
                        }, file.type);
                    } else {
                        resolve(file);
                    }
                };
            };
            reader.readAsDataURL(file);
        });
    };

    const onSubmit = async (data: any) => {
        let fileToSave = signatureFile;
        const isTransparentChecked = signatureSettings.find(s => s.id === 'transparent')?.checked ?? false;
        const isAutoScaleChecked = signatureSettings.find(s => s.id === 'auto-scale')?.checked ?? false;
        const isActiveChecked = signatureSettings.find(s => s.id === 'active')?.checked ?? false;
        const isShowNameChecked = signatureSettings.find(s => s.id === 'show-name')?.checked ?? false;
        const isShowDesigChecked = signatureSettings.find(s => s.id === 'show-desig')?.checked ?? false;

        if (fileToSave && isTransparentChecked && (fileToSave.type === 'image/jpeg' || fileToSave.type === 'image/jpg' || fileToSave.type === 'image/png')) {
            fileToSave = await makeImageTransparent(fileToSave);
        }

        if (fileToSave && isAutoScaleChecked) {
            fileToSave = await scaleImage(fileToSave);
        }

        if (fileToSave && (isShowNameChecked || isShowDesigChecked)) {
            fileToSave = await addDetailsToSignature(
                fileToSave,
                data.authorityName,
                data.designation,
                isShowNameChecked,
                isShowDesigChecked
            );
        }

        console.log('Form Data:', {
            ...data,
            isActive: isActiveChecked,
            status: isActiveChecked ? 'Active' : data.status,
            signatureFile: fileToSave,
            allowedDepts: allowedDepts.filter((d) => d.checked),
            allowedTemplates: allowedTemplates.filter((t) => t.checked),
            signatureSourceType,
            signatureSettings,
        });
    };

    return (
        <div className="min-h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-4 ">

                {/* Header */}
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
                            Add Signature
                        </h1>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-8 space-y-4">

                        {/* 1. Authority Details */}
                        <section className="bg-white dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm p-4 md:p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <User className="text-theme" size={18} />
                                <h2 className="text-base font-bold text-[#1E293B] dark:text-white">
                                    1. Authority Details
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-white">
                                        Authority Name
                                    </Label>
                                    <Input
                                        {...register('authorityName')}
                                        placeholder="Enter authority name"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-white">
                                        Employee
                                    </Label>
                                    <Controller
                                        name="employee"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Employee" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="EMP001">EMP001 - Rahul Sharma</SelectItem>
                                                    <SelectItem value="EMP002">EMP002 - John Doe</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-white">
                                        Designation
                                    </Label>
                                    <Input
                                        {...register('designation')}
                                        placeholder="Enter designation"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-white">
                                        Department
                                    </Label>
                                    <Controller
                                        name="department"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="HR">HR</SelectItem>
                                                    <SelectItem value="IT">IT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-white">
                                        Signature Code
                                    </Label>
                                    <Input
                                        {...register('signatureCode')}
                                        placeholder="Enter signature code"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-white">
                                        Status
                                    </Label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 2. Signature Upload */}
                        <section className="bg-white dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm p-4 md:p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <PenTool className="text-theme" size={18} />
                                <h2 className="text-base font-bold text-[#1E293B] dark:text-white">
                                    2. Signature Upload
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Upload Zone */}
                                <div className="space-y-4">
                                    <div
                                        className="border border-dashed border dark:border-slate-500 rounded-lg p-6 flex flex-col items-center justify-center dark:bg-background h-[180px] cursor-pointer bg-slate-50"
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3">
                                            <Upload className="text-slate-400 dark:text-slate-300" size={28} />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                            Drag & drop signature here
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mb-4 font-medium">or</p>
                                        <Button className="bg-theme text-white dark:bg-theme h-8 px-6 text-xs font-bold rounded shadow-sm">
                                            Upload File
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleSignatureUpload}
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                                            Supported Formats: PNG, JPG, JPEG and SVG
                                        </p>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                                            Max File Size: 2 MB
                                        </p>
                                    </div>
                                </div>

                                {/* Preview Zone */}
                                <div className="space-y-4">
                                    <Label className="text-xs font-semibold dark:text-white">
                                        Signature Preview
                                    </Label>
                                    <div className="rounded-lg h-[145px] flex items-center justify-center bg-white dark:bg-background overflow-hidden border dark:border-gray-700 shadow-inner p-4 relative group">
                                        {signatureImage ? (
                                            <img src={signatureImage} alt="Preview" className="max-h-full max-w-full object-contain" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 opacity-50">
                                                <h1 className="text-sm font-semibold dark:text-white">Not Uploaded any Signature</h1>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-center">
                                        <Button
                                            type="button"
                                            onClick={handleClearSignature}
                                            variant="ghost"
                                            className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8"
                                        >
                                            Clear Signature
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Signature Settings */}
                        <section className="bg-white dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm p-4 md:p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Settings className="text-theme" size={18} />
                                <h2 className="text-base font-bold text-[#1E293B] dark:text-white">
                                    3. Signature Settings
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                {signatureSettings.map((setting) => (
                                    <div key={setting.id} className="flex items-center gap-2.5">
                                        <Checkbox
                                            id={setting.id}
                                            checked={setting.checked}
                                            onCheckedChange={(checked) => {
                                                setSignatureSettings(signatureSettings.map(s => s.id === setting.id ? { ...s, checked: !!checked } : s));
                                            }}
                                        />
                                        <Label
                                            htmlFor={setting.id}
                                            className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                                        >
                                            {setting.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. Validity & 5. Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 4. Validity */}
                            <section className="bg-white dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm p-4 md:p-6 h-full">
                                <div className="flex items-center gap-2 mb-6">
                                    <Clock className="text-theme" size={18} />
                                    <h2 className="text-base font-bold text-[#1E293B] dark:text-white">
                                        4. Validity
                                    </h2>
                                </div>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="grid col-span-6 max-sm:col-span-12 gap-2">
                                        <Label className="text-sm font-semibold text-slate-700 dark:text-white">
                                            Effective From
                                        </Label>
                                        <Controller
                                            name="effectiveFrom"
                                            control={control}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-between font-normal text-gray-600"
                                                        >
                                                            {field.value ? field.value : "Select Date"}
                                                            <CalendarIcon className="h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <CalendarComponent
                                                            mode="single"
                                                            selected={field.value ? parse(field.value, "dd-MM-yyyy", new Date()) : undefined}
                                                            onSelect={(date) => {
                                                                field.onChange(date ? format(date, "dd-MM-yyyy") : "");
                                                            }}
                                                            captionLayout="dropdown"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                    </div>
                                    <div className="grid col-span-6 max-sm:col-span-12 gap-2">
                                        <Label className="text-sm font-semibold text-slate-700 dark:text-white">
                                            Effective To
                                        </Label>
                                        <Controller
                                            name="effectiveTo"
                                            control={control}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-between font-normal text-gray-600"                                                        >
                                                            {field.value ? field.value : "Select Date"}
                                                            <CalendarIcon className="h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <CalendarComponent
                                                            mode="single"
                                                            selected={field.value ? parse(field.value, "dd-MM-yyyy", new Date()) : undefined}
                                                            onSelect={(date) => {
                                                                field.onChange(date ? format(date, "dd-MM-yyyy") : "");
                                                            }}
                                                            captionLayout="dropdown"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* 5. Description / Notes */}
                            <section className="bg-white dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm p-4 md:p-6 h-full">
                                <div className="flex items-center gap-2 mb-6">
                                    <LayoutList className="text-theme" size={18} />
                                    <h2 className="text-base font-bold text-[#1E293B] dark:text-white">
                                        5. Description / Notes
                                    </h2>
                                </div>

                                <div className="flex-1 flex flex-col space-y-2">
                                    <Textarea
                                        {...register('description')}
                                        className="h-[75px] overflow-y-auto dark:bg-background rounded-md text-sm resize-none"
                                        placeholder="Authorized signature for HR department letters and reports."
                                    />
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Right Column (Allowed Usage, Source Type, Additional Info) - Span 4 */}
                    <div className="lg:col-span-4 space-y-4">

                        {/* 6. Allowed Usage */}
                        <section className="bg-white dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm p-4 md:p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Briefcase className="text-theme" size={18} />
                                <h2 className="text-base font-bold text-[#1E293B] dark:text-white">
                                    6. Allowed Usage
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {/* Departments */}
                                <div className='mb-2 pb-3 border-b border-slate-300 dark:border-slate-700'>
                                    <div className="flex items-center justify-between mb-2 px-0.5">
                                        <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">Departments</Label>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="sel-all-dept"
                                                onCheckedChange={(checked) => toggleAllDepts(!!checked)}
                                                checked={allowedDepts.every(d => d.checked)}
                                                className="w-4 h-4 border-slate-300"
                                            />
                                            <Label htmlFor="sel-all-dept" className="text-[11px] font-bold text-slate-500 cursor-pointer">Select All</Label>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5 p-3 rounded-lg dark:bg-background">
                                        {allowedDepts.map(dept => (
                                            <div key={dept.id} className="flex items-center gap-3 group">
                                                <Checkbox
                                                    id={`dept-${dept.id}`}
                                                    checked={dept.checked}
                                                    onCheckedChange={(checked) => {
                                                        setAllowedDepts(allowedDepts.map(d => d.id === dept.id ? { ...d, checked: !!checked } : d));
                                                    }}
                                                    className="w-4 h-4 border-slate-300"
                                                />
                                                <Label htmlFor={`dept-${dept.id}`} className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">{dept.name}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Templates */}
                                <div className='pt-4'>
                                    <div className="flex items-center justify-between mb-3 px-0.5">
                                        <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">Templates</Label>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="sel-all-temp"
                                                onCheckedChange={(checked) => toggleAllTemplates(!!checked)}
                                                checked={allowedTemplates.every(t => t.checked)}
                                                className="w-4 h-4 border-slate-300"
                                            />
                                            <Label htmlFor="sel-all-temp" className="text-[11px] font-bold text-slate-500 cursor-pointer">Select All</Label>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5 p-3 rounded-lg dark:bg-background">
                                        {allowedTemplates.map(temp => (
                                            <div key={temp.id} className="flex items-center gap-3 group">
                                                <Checkbox
                                                    id={`temp-${temp.id}`}
                                                    checked={temp.checked}
                                                    onCheckedChange={(checked) => {
                                                        setAllowedTemplates(allowedTemplates.map(t => t.id === temp.id ? { ...t, checked: !!checked } : t));
                                                    }}
                                                    className="w-4 h-4 border-slate-300"
                                                />
                                                <Label htmlFor={`temp-${temp.id}`} className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">{temp.name}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 7. Signature Source Type */}
                        <section className="bg-white dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm p-4 md:p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <PenTool className="text-theme" size={18} />
                                <h2 className="text-base font-bold text-[#1E293B] dark:text-white">
                                    7. Signature Source Type
                                </h2>
                            </div>
                            <div className="space-y-3.5">
                                <RadioGroup
                                    value={signatureSourceType}
                                    onValueChange={setSignatureSourceType}
                                >
                                    {[
                                        { id: 'uploaded', label: 'Uploaded Signature' },
                                        { id: 'certificate', label: 'Digital Signature Certificate' }
                                    ].map(type => (
                                        <div key={type.id} className="flex items-center gap-3">
                                            <RadioGroupItem value={type.id} id={type.id} />
                                            <Label htmlFor={type.id} className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                                                {type.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </section>

                        {/* 8. Additional Information */}
                        <section className="bg-white dark:bg-background rounded-lg border dark:border-gray-700 shadow-sm p-4 md:p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Info className="text-theme" size={18} />
                                <h2 className="text-base font-bold text-[#1E293B] dark:text-white">
                                    8. Additional Information
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-white">Created By</Label>
                                    <Input value="Admin User" disabled />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-white">
                                        Created On</Label>
                                    <Input value="01-May-2025 10:30 AM" disabled />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pb-4">
                    <Button
                        type="button"
                        variant="outline"
                        className='h-10 flex-1 sm:flex-none'
                    >
                        <X size={16} className="mr-1" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 sm:flex-none h-10 px-8 bg-theme text-white font-bold shadow-md rounded-md"
                    >
                        <Save size={16} className="mr-1" />
                        Save Signature
                    </Button>
                </div>
            </form>
        </div>
    );
}
