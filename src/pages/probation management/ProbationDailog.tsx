import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { useForm, Controller, useWatch } from "react-hook-form";

type ProbationDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: any;
    onSubmit: (data: any) => void;
};

export default function ProbationDialog({ open, onOpenChange, initialData, onSubmit }: ProbationDialogProps) {
    const { register, handleSubmit, control, reset } = useForm();
    const [joiningDateOpen, setJoiningDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);
    const [extensionFromOpen, setExtensionFromOpen] = useState(false);
    const [extensionToOpen, setExtensionToOpen] = useState(false);

    const status = useWatch({
        control,
        name: "status",
    });

    useEffect(() => {
        if (initialData) {
            reset({
                empId: initialData.empId,
                employee: initialData.employee,
                designation: initialData.designation,
                joiningDate: initialData.joiningDate,
                probationEndDate: initialData.probationEndDate,
                reviewer: initialData.reviewer,
                status: initialData.status,
                extensionFromDate: initialData.extensionFromDate || "",
                extensionToDate: initialData.extensionToDate || "",
            });
        } else {
            reset({
                empId: "",
                employee: "",
                designation: "",
                joiningDate: "",
                probationEndDate: "",
                reviewer: "",
                status: "",
                extensionFromDate: "",
                extensionToDate: "",
            });
        }
    }, [initialData, reset, open]);

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] rounded-2xl overflow-auto max-h-130">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        {initialData ? "Edit Probation Record" : "Add Probation Record"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Emp ID</Label>
                                <Input {...register("empId")} placeholder="Enter Emp ID" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Employee Name</Label>
                                <Input {...register("employee")} placeholder="Enter Employee Name" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Designation</Label>
                            <Input {...register("designation")} placeholder="Enter Designation" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Joining Date</Label>
                                <Controller
                                    control={control}
                                    name="joiningDate"
                                    render={({ field }) => {
                                        const date = field.value ? parse(field.value, "dd-MM-yyyy", new Date()) : undefined;
                                        return (

                                            <Popover open={joiningDateOpen} onOpenChange={setJoiningDateOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-between font-normal text-gray-600"
                                                    >
                                                        {field.value ? field.value : "Select date"}
                                                        <CalendarIcon className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={(d) => {
                                                            field.onChange(d ? format(d, "dd-MM-yyyy") : "");
                                                            setJoiningDateOpen(false);
                                                        }}
                                                        captionLayout="dropdown"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Probation End Date</Label>
                                <Controller
                                    control={control}
                                    name="probationEndDate"
                                    render={({ field }) => {
                                        const date = field.value ? parse(field.value, "dd-MM-yyyy", new Date()) : undefined;
                                        return (
                                            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-between font-normal text-gray-600"
                                                    >
                                                        {field.value ? field.value : "Select date"}
                                                        <CalendarIcon className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={(d) => {
                                                            field.onChange(d ? format(d, "dd-MM-yyyy") : "");
                                                            setEndDateOpen(false);
                                                        }}
                                                        captionLayout="dropdown"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Reviewer</Label>
                                <Input {...register("reviewer")} placeholder="Enter Reviewer Name" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Controller
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="In Review">In Review</SelectItem>
                                                <SelectItem value="Failed">Failed</SelectItem>
                                                <SelectItem value="Extended">Extended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        {(status === "Extended" || status === "In Review") && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>{status === "Extended" ? "Extension From" : "Review From"}</Label>
                                        <Controller
                                            control={control}
                                            name="extensionFromDate"
                                            render={({ field }) => {
                                                const date = field.value ? parse(field.value, "dd-MM-yyyy", new Date()) : undefined;
                                                return (
                                                    <Popover open={extensionFromOpen} onOpenChange={setExtensionFromOpen}>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-between font-normal text-gray-600"
                                                            >
                                                                {field.value ? field.value : "Select date"}
                                                                <CalendarIcon className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={date}
                                                                onSelect={(d) => {
                                                                    field.onChange(d ? format(d, "dd-MM-yyyy") : "");
                                                                    setExtensionFromOpen(false);
                                                                }}
                                                                captionLayout="dropdown"
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                );
                                            }}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>{status === "Extended" ? "Extension To" : "Review To"}</Label>
                                        <Controller
                                            control={control}
                                            name="extensionToDate"
                                            render={({ field }) => {
                                                const date = field.value ? parse(field.value, "dd-MM-yyyy", new Date()) : undefined;
                                                return (
                                                    <Popover open={extensionToOpen} onOpenChange={setExtensionToOpen}>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-between font-normal text-gray-600"
                                                            >
                                                                {field.value ? field.value : "Select date"}
                                                                <CalendarIcon className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={date}
                                                                onSelect={(d) => {
                                                                    field.onChange(d ? format(d, "dd-MM-yyyy") : "");
                                                                    setExtensionToOpen(false);
                                                                }}
                                                                captionLayout="dropdown"
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="text-white">
                            {initialData ? "Update" : "Save"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
