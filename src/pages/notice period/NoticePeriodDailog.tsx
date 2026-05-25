import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse, differenceInDays } from "date-fns";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useAlert } from "@/context/AlertContext";

type NoticePeriodDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: any;
    onSubmit: (data: any) => void;
};

export default function NoticePeriodDialog({ open, onOpenChange, initialData, onSubmit }: NoticePeriodDialogProps) {
    const { showAlert } = useAlert();
    const { register, handleSubmit, control, reset, setValue } = useForm();
    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);

    const startDate = useWatch({ control, name: "startDate" });
    const endDate = useWatch({ control, name: "endDate" });

    useEffect(() => {
        if (initialData) {
            reset({
                empId: initialData.empId,
                employee: initialData.employee,
                designation: initialData.designation,
                startDate: initialData.startDate,
                endDate: initialData.endDate,
                totalDays: initialData.totalDays,
                completedDays: initialData.completedDays,
                remainingDays: initialData.remainingDays,
                status: initialData.status,
            });
        } else {
            reset({
                empId: "",
                employee: "",
                designation: "",
                startDate: "",
                endDate: "",
                totalDays: "",
                completedDays: "",
                remainingDays: "",
                status: "",
            });
        }
    }, [initialData, reset, open]);

    useEffect(() => {
        if (startDate && endDate) {
            try {
                const start = parse(startDate, "dd-MM-yyyy", new Date());
                const end = parse(endDate, "dd-MM-yyyy", new Date());
                const total = differenceInDays(end, start);
                if (total >= 0) {
                    setValue("totalDays", total.toString());

                    const today = new Date();
                    const completed = differenceInDays(today > end ? end : (today < start ? start : today), start);
                    const remaining = total - completed;
                    setValue("remainingDays", remaining.toString());

                    // Auto-calculate status with priority
                    if (remaining <= 0) {
                        setValue("status", "completed");
                    } else if (remaining <= 5 && today >= start) {
                        setValue("status", "closing soon");
                    } else {
                        setValue("status", "active");
                    }
                }
            } catch (e) {
                showAlert({
                    title: "Invalid Date",
                    description: "Please check the start and end dates.",
                    variant: "error",
                });
            }
        }
    }, [startDate, endDate, setValue]);

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] rounded-2xl overflow-auto max-h-130">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        {initialData ? "Edit Notice Period" : "Add Notice Period"}
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
                                <Label>Start Date</Label>
                                <Controller
                                    control={control}
                                    name="startDate"
                                    render={({ field }) => {
                                        const date = field.value ? parse(field.value, "dd-MM-yyyy", new Date()) : undefined;
                                        return (
                                            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
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
                                                            setStartDateOpen(false);
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
                                <Label>End Date</Label>
                                <Controller
                                    control={control}
                                    name="endDate"
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
