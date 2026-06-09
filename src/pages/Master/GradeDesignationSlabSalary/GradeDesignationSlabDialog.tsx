import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";

type GradeDesignationSlabDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: any;
    onSubmit: (data: any) => void;
};

export default function GradeDesignationSlabDialog({ open, onOpenChange, initialData, onSubmit }: GradeDesignationSlabDialogProps) {
    const { register, handleSubmit, control, reset } = useForm();

    useEffect(() => {
        if (initialData) {
            reset({
                grade: initialData.grade || "",
                designation: initialData.designation || "",
                status: initialData.status || "Active",
                effectiveDate: initialData.effectiveDate || "",
                totalSlabs: initialData.totalSlabs || 1,
            });
        } else {
            reset({
                grade: "",
                designation: "",
                status: "Active",
                effectiveDate: "",
                totalSlabs: 1,
            });
        }
    }, [initialData, reset, open]);

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl overflow-auto max-h-130">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        {initialData ? "Edit Slab Configuration" : "Add Slab Configuration"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Grade</Label>
                            <Controller
                                control={control}
                                name="grade"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Officer">Officer</SelectItem>
                                            <SelectItem value="Manager">Manager</SelectItem>
                                            <SelectItem value="Executive">Executive</SelectItem>
                                            <SelectItem value="Staff">Staff</SelectItem>
                                            <SelectItem value="Trainee">Trainee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Designation</Label>
                            <Input {...register("designation")} placeholder="Enter Designation" />
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
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
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
