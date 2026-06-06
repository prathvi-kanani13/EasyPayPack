import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

type GradeDesignationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: MasterRecord | null;
  onSubmit: (data: Omit<MasterRecord, "id">) => void;
  suggestedSortOrder: number;
};

export default function GradeDesignationDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  suggestedSortOrder
}: GradeDesignationDialogProps) {

  const { register, handleSubmit, control, reset } = useForm<Omit<MasterRecord, "id">>({
    defaultValues: {
      type: "Grade",
      code: "",
      shortName: "",
      description: "",
      active: true,
      sortOrder: suggestedSortOrder,
      exempted: false,
      addInDaily: false,
    }
  });

  // Reset form values when initialData or open state changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          type: initialData.type,
          code: initialData.code,
          shortName: initialData.shortName,
          description: initialData.description,
          active: initialData.active,
          sortOrder: initialData.sortOrder,
          exempted: initialData.exempted,
          addInDaily: initialData.addInDaily,
        });
      } else {
        reset({
          type: "Grade",
          code: "",
          shortName: "",
          description: "",
          active: true,
          sortOrder: suggestedSortOrder,
          exempted: false,
          addInDaily: false,
        });
      }
    }
  }, [initialData, reset, open, suggestedSortOrder]);

  const handleFormSubmit = (formData: Omit<MasterRecord, "id">) => {
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl overflow-auto max-h-130 bg-white dark:bg-background border dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {initialData ? "Edit Record" : "Add New Grade & Designation"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grade">Grade</SelectItem>
                        <SelectItem value="Designation">Designation</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label>Code</Label>
                <Input
                  {...register("code", { required: true })}
                  placeholder="Enter Code (e.g. ST)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Short Name</Label>
                <Input
                  {...register("shortName", { required: true })}
                  placeholder="Enter Short Name"
                />
              </div>

              <div className="grid gap-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  {...register("sortOrder", { required: true, valueAsNumber: true })}
                  placeholder="Enter Sort Order"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Input
                {...register("description", { required: true })}
                placeholder="Enter description"
              />
            </div>

            <div className="flex items-center justify-between border dark:border-gray-700 p-3 rounded-lg bg-slate-50/50 dark:bg-gray-800/40">
              <Label className="cursor-pointer" htmlFor="dialog-active">Active</Label>
              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <Switch
                    id="dialog-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-checked:bg-emerald-500"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border dark:border-gray-700 p-3 rounded-lg bg-slate-50/50 dark:bg-gray-800/40">
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="exempted"
                  render={({ field }) => (
                    <Checkbox
                      id="dialog-exempted"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  )}
                />
                <Label htmlFor="dialog-exempted" className="font-medium cursor-pointer">
                  Exempted
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="addInDaily"
                  render={({ field }) => (
                    <Checkbox
                      id="dialog-addindaily"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  )}
                />
                <Label htmlFor="dialog-addindaily" className="font-medium cursor-pointer">
                  Add in Daily
                </Label>
              </div>
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
