import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { FormikErrors, FormikTouched } from "formik";

interface FormValues {
    templateName: string;
    category: string;
    description?: string;
}

interface LetterInfoFormProps {
    values: FormValues;
    setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void;
    errors: FormikErrors<FormValues>;
    touched: FormikTouched<FormValues>;
}

// Component for letter information form fields
export default function LetterInfoForm({ values, setFieldValue, errors, touched }: LetterInfoFormProps) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-12 gap-2">
                <div className="max-[500px]:col-span-12 col-span-6 lg:col-span-4 space-y-1">
                    <Label className="text-sm font-medium">Template Name</Label>
                    <Input
                        name="templateName"
                        type="text"
                        placeholder="Enter Template Name"
                        value={values.templateName}
                        onChange={(e) => setFieldValue("templateName", e.target.value)}
                        className={errors.templateName && touched.templateName ? "border-red-500" : ""}
                    />
                    {errors.templateName && touched.templateName && (
                        <p className="text-xs text-red-500">{errors.templateName}</p>
                    )}
                </div>
                <div className="max-[500px]:col-span-12 col-span-6 lg:col-span-3 space-y-1">
                    <Label className="text-sm font-medium">Category</Label>
                    <Select
                        value={values.category}
                        onValueChange={(value) => setFieldValue("category", value)}
                    >
                        <SelectTrigger className={`w-full ${errors.category && touched.category ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hr">HR Letters</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.category && touched.category && (
                        <p className="text-xs text-red-500">{errors.category}</p>
                    )}
                </div>
                <div className="col-span-12 lg:col-span-5 space-y-1">
                    <Label className="text-sm font-medium">Description</Label>
                    <Input
                        name="description"
                        type="text"
                        placeholder="Enter Description"
                        value={values.description}
                        onChange={(e) => setFieldValue("description", e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}
