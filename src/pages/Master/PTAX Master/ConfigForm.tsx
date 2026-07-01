/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAlert } from "@/context/AlertContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerInput } from "@/components/DatePickerInput";
import { DataTable } from "@/components/DataTable";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Save, RotateCcw, Share2, Trash2, Plus, ArrowLeft, Copy } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Slab details structure
interface Slab {
  lowerLimit: number | "";
  upperLimit: number | "";
  ptaxAmount: number | "";
}

// Configuration details structure
interface PTAXConfig {
  id?: string;
  effectiveDate: string;
  active: boolean;
  formulaDescription: string;
  company: string;
  branch: string;
  salaryHead: string;
  gender: string;
  slabs: Slab[];
}

// Mock database to populate initial values in edit mode
const mockConfigs: PTAXConfig[] = [
  {
    id: "1",
    effectiveDate: "01-04-2026",
    active: true,
    formulaDescription: "'Basic'+'DA'",
    company: "EasyPay Pack Pvt Ltd",
    branch: "Maharashtra Branch",
    salaryHead: "Professional Tax",
    gender: "ALL",
    slabs: [
      { lowerLimit: 1, upperLimit: 10000, ptaxAmount: 0 },
      { lowerLimit: 10001, upperLimit: 15000, ptaxAmount: 175 },
      { lowerLimit: 15001, upperLimit: 99999999, ptaxAmount: 200 }
    ]
  },
  {
    id: "2",
    effectiveDate: "01-04-2026",
    active: true,
    formulaDescription: "'Basic'+'DA'",
    company: "EasyPay Pack Pvt Ltd",
    branch: "Gujarat Branch",
    salaryHead: "Professional Tax",
    gender: "ALL",
    slabs: [
      { lowerLimit: 1, upperLimit: 12000, ptaxAmount: 0 },
      { lowerLimit: 12001, upperLimit: 99999999, ptaxAmount: 200 }
    ]
  },
  {
    id: "3",
    effectiveDate: "01-04-2026",
    active: true,
    formulaDescription: "'Basic'+'DA'",
    company: "EasyPay Pack Pvt Ltd",
    branch: "Karnataka Branch",
    salaryHead: "Professional Tax",
    gender: "ALL",
    slabs: [
      { lowerLimit: 1, upperLimit: 15000, ptaxAmount: 0 },
      { lowerLimit: 15001, upperLimit: 99999999, ptaxAmount: 200 }
    ]
  },
  {
    id: "4",
    effectiveDate: "01-04-2025",
    active: false,
    formulaDescription: "'Basic'",
    company: "EasyPay Pack Pvt Ltd",
    branch: "Maharashtra Branch",
    salaryHead: "Professional Tax",
    gender: "FEMALE",
    slabs: [
      { lowerLimit: 1, upperLimit: 10000, ptaxAmount: 0 },
      { lowerLimit: 10001, upperLimit: 15000, ptaxAmount: 150 },
      { lowerLimit: 15001, upperLimit: 99999999, ptaxAmount: 200 }
    ]
  },
  {
    id: "5",
    effectiveDate: "01-06-2026",
    active: true,
    formulaDescription: "'Basic'+'DA'+'HRA'",
    company: "EasyPay Pack Pvt Ltd",
    branch: "West Bengal Branch",
    salaryHead: "Professional Tax",
    gender: "ALL",
    slabs: [
      { lowerLimit: 1, upperLimit: 10000, ptaxAmount: 0 },
      { lowerLimit: 10001, upperLimit: 12500, ptaxAmount: 90 },
      { lowerLimit: 12501, upperLimit: 15000, ptaxAmount: 110 },
      { lowerLimit: 15001, upperLimit: 99999999, ptaxAmount: 200 }
    ]
  }
];

// Default initial values matching the reference screenshot
const defaultInitialValues: PTAXConfig = {
  effectiveDate: "01-01-2026",
  active: true,
  formulaDescription: "'Basic'+'DA'",
  company: "THE GANDHIDHAM MERCANTILE CO. OP.",
  branch: "Ahmedabad",
  salaryHead: "PTAX",
  gender: "ALL",
  slabs: [
    { lowerLimit: 1, upperLimit: 12000, ptaxAmount: 0 },
    { lowerLimit: 12001, upperLimit: 99999999, ptaxAmount: 200 }
  ]
};

// Dropdown options
const companyOptions = [
  { value: "THE GANDHIDHAM MERCANTILE CO. OP.", label: "THE GANDHIDHAM MERCANTILE CO. OP." },
  { value: "BANKAI INFORMATICS PVT. LTD.", label: "BANKAI INFORMATICS PVT. LTD." },
  { value: "EasyPay Pack Pvt Ltd", label: "EasyPay Pack Pvt Ltd" }
];

const branchOptions = [
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Gandhidham HO", label: "Gandhidham HO" },
  { value: "Adipur Branch", label: "Adipur Branch" },
  { value: "Maharashtra Branch", label: "Maharashtra Branch" },
  { value: "Gujarat Branch", label: "Gujarat Branch" },
  { value: "Karnataka Branch", label: "Karnataka Branch" },
  { value: "West Bengal Branch", label: "West Bengal Branch" }
];

const salaryHeadOptions = [
  { value: "PTAX", label: "PTAX" },
  { value: "Professional Tax", label: "Professional Tax" }
];

const genderOptions = [
  { value: "ALL", label: "ALL" },
  { value: "MALE", label: "MALE" },
  { value: "FEMALE", label: "FEMALE" }
];

// Validation Schemas
const SlabSchema = Yup.object().shape({
  lowerLimit: Yup.number()
    .typeError("Must be a number")
    .required("Required")
    .min(0, "Min 0"),
  upperLimit: Yup.number()
    .typeError("Must be a number")
    .required("Required")
    .moreThan(Yup.ref("lowerLimit"), "Must be > Lower Limit"),
  ptaxAmount: Yup.number()
    .typeError("Must be a number")
    .required("Required")
    .min(0, "Min 0")
});

const PTAXConfigSchema = Yup.object().shape({
  effectiveDate: Yup.string().required("Effective Date is required"),
  active: Yup.boolean().required("Status is required"),
  formulaDescription: Yup.string().required("Formula Description is required"),
  company: Yup.string().required("Company is required"),
  branch: Yup.string().required("Branch is required"),
  salaryHead: Yup.string().required("Salary Head is required"),
  gender: Yup.string().required("Gender is required"),
  slabs: Yup.array().of(SlabSchema).min(1, "At least one slab is required")
});

export default function ConfigForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showAlert } = useAlert();
  const [submitAction, setSubmitAction] = useState<"save" | "replicate">("save");

  // Determine initial values based on Add or Edit mode
  const initialValues = useMemo(() => {
    if (id) {
      const found = mockConfigs.find((c) => c.id === id);
      if (found) return found;
    }
    return defaultInitialValues;
  }, [id]);

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full p-4">
      {/* Navigation Breadcrumb */}
      <div
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer w-fit transition-colors"
        onClick={() => navigate("/ptax/master")}
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back to List</span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#202C4B] dark:text-white">
          {id ? "Edit PTAX Configuration" : "Add PTAX Configuration"}
        </h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={PTAXConfigSchema}
        enableReinitialize
        onSubmit={(values, { setSubmitting }) => {
          if (submitAction === "replicate") {
            console.log("Saving and replicating configuration:", values);
            // TODO: Call API to save and replicate configuration details
            showAlert({
              title: "Configuration Saved & Replicated",
              description: "The PTAX configuration has been saved and replicated successfully.",
              variant: "success"
            });
          } else {
            console.log("Saving configuration:", values);
            // TODO: Call API to save configuration details
            showAlert({
              title: id ? "Configuration Updated" : "Configuration Saved",
              description: `The PTAX configuration has been ${id ? "updated" : "saved"} successfully.`,
              variant: "success"
            });
          }
          navigate("/ptax/master");
          setSubmitting(false);
        }}
      >
        {({ values, errors, touched, setFieldValue, handleChange, handleBlur, resetForm, handleSubmit }) => {
          // Define slab columns to render inside DataTable
          const columns = useMemo<ColumnDef<Slab>[]>(() => [
            {
              id: "srNo",
              header: "SI.",
              cell: (info) => (
                <span className="font-semibold text-gray-500">{info.row.index + 1}.</span>
              )
            },
            {
              accessorKey: "lowerLimit",
              header: () => <span>Lower Limit <span className="text-red-500">*</span></span>,
              cell: (info) => {
                const idx = info.row.index;
                const slabErrors = errors.slabs?.[idx] as Yup.ValidationError | undefined;
                const slabTouched = touched.slabs?.[idx];
                return (
                  <div className="flex flex-col">
                    <Input
                      type="number"
                      name={`slabs.${idx}.lowerLimit`}
                      value={values.slabs[idx]?.lowerLimit ?? ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : Number(e.target.value);
                        setFieldValue(`slabs.${idx}.lowerLimit`, val);
                      }}
                      onBlur={handleBlur}
                      className="h-9 text-right w-full min-w-30"
                    />
                    {slabTouched?.lowerLimit && slabErrors && (slabErrors as any).lowerLimit && (
                      <span className="text-xs text-red-500 mt-1">{(slabErrors as any).lowerLimit}</span>
                    )}
                  </div>
                );
              }
            },
            {
              accessorKey: "upperLimit",
              header: () => <span>Upper Limit <span className="text-red-500">*</span></span>,
              cell: (info) => {
                const idx = info.row.index;
                const slabErrors = errors.slabs?.[idx] as Yup.ValidationError | undefined;
                const slabTouched = touched.slabs?.[idx];
                return (
                  <div className="flex flex-col">
                    <Input
                      type="number"
                      name={`slabs.${idx}.upperLimit`}
                      value={values.slabs[idx]?.upperLimit ?? ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : Number(e.target.value);
                        setFieldValue(`slabs.${idx}.upperLimit`, val);
                      }}
                      onBlur={handleBlur}
                      className="h-9 text-right w-full min-w-30"
                    />
                    {slabTouched?.upperLimit && slabErrors && (slabErrors as any).upperLimit && (
                      <span className="text-xs text-red-500 mt-1">{(slabErrors as any).upperLimit}</span>
                    )}
                  </div>
                );
              }
            },
            {
              accessorKey: "ptaxAmount",
              header: () => <span>PTAX Amount <span className="text-red-500">*</span></span>,
              cell: (info) => {
                const idx = info.row.index;
                const slabErrors = errors.slabs?.[idx] as Yup.ValidationError | undefined;
                const slabTouched = touched.slabs?.[idx];
                return (
                  <div className="flex flex-col">
                    <Input
                      type="number"
                      step="0.01"
                      name={`slabs.${idx}.ptaxAmount`}
                      value={values.slabs[idx]?.ptaxAmount ?? ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : Number(e.target.value);
                        setFieldValue(`slabs.${idx}.ptaxAmount`, val);
                      }}
                      onBlur={handleBlur}
                      className="h-9 text-right w-full min-w-30"
                    />
                    {slabTouched?.ptaxAmount && slabErrors && (slabErrors as any).ptaxAmount && (
                      <span className="text-xs text-red-500 mt-1">{(slabErrors as any).ptaxAmount}</span>
                    )}
                  </div>
                );
              }
            },
            {
              id: "actions",
              header: "Action",
              cell: (info) => (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20 size-8"
                  onClick={() => {
                    const updated = values.slabs.filter((_, i) => i !== info.row.index);
                    setFieldValue("slabs", updated);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              )
            }
          ], [values.slabs, errors.slabs, touched.slabs, setFieldValue, handleBlur]);

          // Create react table instance for slabs DataTable
          const table = useReactTable({
            data: values.slabs,
            columns,
            getCoreRowModel: getCoreRowModel()
          });

          return (
            <Form className="w-full flex flex-col gap-4">
              <Card className="p-4 rounded-sm shadow-sm">
                <CardContent className="p-0 flex flex-col gap-4">
                  {/* Form Header Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Effective Date */}
                    <div className="col-span-12 md:col-span-3 flex flex-col gap-2">
                      <Label htmlFor="effectiveDate" className="text-sm font-medium">
                        Effective Date <span className="text-red-500">*</span>
                      </Label>
                      <DatePickerInput
                        value={values.effectiveDate}
                        onChange={(date) => setFieldValue("effectiveDate", date)}
                        className="w-full"
                      />
                      {touched.effectiveDate && errors.effectiveDate && (
                        <span className="text-xs text-red-500 mt-1">{errors.effectiveDate}</span>
                      )}
                    </div>

                    {/* Active Switch */}
                    <div className="col-span-12 md:col-span-2 flex flex-col gap-2">
                      <Label htmlFor="active" className="text-sm font-medium">
                        Active <span className="text-red-500">*</span>
                      </Label>
                      <div className="h-9 flex items-center">
                        <Switch
                          id="active"
                          checked={values.active}
                          onCheckedChange={(checked) => setFieldValue("active", checked)}
                        />
                      </div>
                    </div>

                    {/* Formula Description */}
                    <div className="col-span-12 md:col-span-7 flex flex-col gap-2">
                      <Label htmlFor="formulaDescription" className="text-sm font-medium">
                        Formula Description <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="formulaDescription"
                          name="formulaDescription"
                          value={values.formulaDescription}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g. 'Basic'+'DA'"
                          className="flex-1 h-9"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 shrink-0"
                          onClick={() => {
                            showAlert({
                              title: "Formula Builder Helper",
                              description: "Select salary heads to insert into the formula description.",
                              variant: "info"
                            });
                          }}
                        >
                          ...
                        </Button>
                      </div>
                      {touched.formulaDescription && errors.formulaDescription && (
                        <span className="text-xs text-red-500 mt-1">{errors.formulaDescription}</span>
                      )}
                    </div>

                    {/* Company Dropdown */}
                    <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                      <Label className="text-sm font-medium">
                        Company <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={values.company}
                        onValueChange={(val) => setFieldValue("company", val)}
                      >
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {touched.company && errors.company && (
                        <span className="text-xs text-red-500 mt-1">{errors.company}</span>
                      )}
                    </div>

                    {/* Branch Dropdown */}
                    <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                      <Label className="text-sm font-medium">
                        Branch <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Select
                          value={values.branch}
                          onValueChange={(val) => setFieldValue("branch", val)}
                        >
                          <SelectTrigger className="h-9 flex-1">
                            <SelectValue placeholder="Select Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branchOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 shrink-0"
                          onClick={() => {
                            showAlert({
                              title: "Replicate branch settings",
                              description: "Replicate this configuration setup for other branches.",
                              variant: "info"
                            });
                          }}
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                      {touched.branch && errors.branch && (
                        <span className="text-xs text-red-500 mt-1">{errors.branch}</span>
                      )}
                    </div>

                    {/* Salary Head Dropdown */}
                    <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                      <Label className="text-sm font-medium">
                        Salary Head <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={values.salaryHead}
                        onValueChange={(val) => setFieldValue("salaryHead", val)}
                      >
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder="Select Salary Head" />
                        </SelectTrigger>
                        <SelectContent>
                          {salaryHeadOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {touched.salaryHead && errors.salaryHead && (
                        <span className="text-xs text-red-500 mt-1">{errors.salaryHead}</span>
                      )}
                    </div>

                    {/* Gender Dropdown */}
                    <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                      <Label className="text-sm font-medium">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={values.gender}
                        onValueChange={(val) => setFieldValue("gender", val)}
                      >
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {touched.gender && errors.gender && (
                        <span className="text-xs text-red-500 mt-1">{errors.gender}</span>
                      )}
                    </div>
                  </div>

                  {/* Slab Details Section */}
                  <div className="border rounded-sm p-4 flex flex-col gap-4 ">
                    <div className="flex items-center gap-2 font-semibold border-b pb-2 text-base">
                      <span className="text-theme-secondary text-lg">✦</span> PTAX Slab Details
                    </div>

                    <div className="border rounded-sm overflow-hidden">
                      <DataTable
                        table={table}
                        isLoading={false}
                        isError={false}
                        columnCount={columns.length}
                        errorMessage="No slab configurations found."
                      />
                    </div>

                    {errors.slabs && typeof errors.slabs === "string" && (
                      <span className="text-xs text-red-500">{errors.slabs}</span>
                    )}

                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const lastSlab = values.slabs[values.slabs.length - 1];
                          const nextLower = lastSlab ? (Number(lastSlab.upperLimit) || 0) + 1 : 1;
                          setFieldValue("slabs", [
                            ...values.slabs,
                            { lowerLimit: nextLower, upperLimit: "", ptaxAmount: "" }
                          ]);
                        }}
                        className="gap-2 h-9 border-dashed"
                      >
                        <Plus size={16} /> Add Slab
                      </Button>
                    </div>
                  </div>

                  <Separator variant="light" />

                  {/* Footer Form Action Buttons */}
                  <div className="flex justify-between items-center ">
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        onClick={() => setSubmitAction("save")}
                        className="gap-2 px-5 h-10 bg-theme font-medium shadow-xs"
                      >
                        <Save size={16} /> Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => resetForm()}
                        className="gap-2 px-5 h-10"
                      >
                        <RotateCcw size={16} /> Reset
                      </Button>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSubmitAction("replicate");
                          handleSubmit();
                        }}
                        className="gap-2 px-5 h-10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      >
                        <Share2 size={16} /> Save & Replicate
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/ptax/master")}
                        className="px-4 h-10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
