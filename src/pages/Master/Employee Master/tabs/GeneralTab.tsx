import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { User, MapPin, CheckSquare, Search, Calendar, Heart, Shield, Landmark, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FamilyDetailsDialog } from "./FamilyDetailsDialog";
import { useLayoutWidth } from "@/layout/Layout";

export default function GeneralTab() {

  const width = useLayoutWidth();

  const breakPoints = {
    md: 720,
    xl: 1300
  };

  const isMd = width >= breakPoints.md;
  const isXl = width >= breakPoints.xl;

  const [activeInfoTab, setActiveInfoTab] = useState("family");
  const [dateValues, setDateValues] = useState<Record<string, string>>({});
  const [isFamilyDialogOpen, setIsFamilyDialogOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", name: "Rajeshkumar Patel", dob: "12/06/1980", gender: "Male", relation: "Father", occupation: "Retired", workInBank: "No", edpNo: "-", fullname: "Rajeshkumar Patel" },
    { id: "2", name: "Kantaben Patel", dob: "15/08/1982", gender: "Female", relation: "Mother", occupation: "House Wife", workInBank: "No", edpNo: "-", fullname: "Kantaben Patel" },
  ]);

  const additionalInfoPills = [
    { id: "family", label: "Family Details" },
    { id: "training", label: "Training Details" },
    { id: "transfer", label: "Transfer Detail" },
    { id: "kyc", label: "KYC Document" },
    { id: "experience", label: "Experience" },
    { id: "surety", label: "Surety" },
    { id: "target", label: "Target" },
    { id: "exam", label: "Exam Details" },
    { id: "policy", label: "Policy Details" },
    { id: "promotion", label: "Promotion" },
    { id: "appreciation", label: "Appreciation" },
    { id: "moredetail", label: "More Detail" },
    { id: "otherdetail", label: "Other Detail" },
    { id: "assetentry", label: "Asset Entry" },
  ];

  interface FamilyMember {
    id: string;
    name: string;
    dob: string;
    gender: string;
    relation: string;
    occupation: string;
    workInBank: string;
    edpNo: string;
    fullname: string;
  }

  const allowances = [
    { id: "allow_pf", label: "PF", defaultChecked: true },
    { id: "allow_bonus", label: "Bonus" },
    { id: "allow_authorized", label: "Authorized By" },
    { id: "allow_welfare", label: "Welfare Fund", defaultChecked: true },
    { id: "allow_esi", label: "ESI" },
    { id: "allow_carryforward", label: "Carry Forward", defaultChecked: true },
    { id: "allow_closing", label: "Closing Allow", defaultChecked: true },
    { id: "allow_ptax", label: "PTAX", defaultChecked: true },
    { id: "allow_vpf", label: "VPF" },
    { id: "allow_gratuity", label: "Gratuity", defaultChecked: true },
    { id: "allow_leave", label: "Leave" },
    { id: "allow_bepf", label: "B.E. PF", defaultChecked: true },
    { id: "allow_owner", label: "Owner Residence", defaultChecked: true },
    { id: "allow_pension", label: "P.F. Pension", defaultChecked: true },
    { id: "allow_hra", label: "HRA", defaultChecked: true },
    { id: "allow_cca", label: "CCA" },
    { id: "allow_da", label: "D.A", defaultChecked: true },
    { id: "allow_higher", label: "Higher Pension" },
    { id: "allow_hold", label: "Increment on Hold" },
    { id: "allow_language", label: "Language Known", defaultChecked: true },
  ];

  const addressFields = [
    { key: "add1", type: "textArea", label: "Add.1*", placeholder: "Enter Address Line 1" },
    { key: "add2", type: "textArea", label: "Add.2", placeholder: "Enter Address Line 2" },
    { key: "area", type: "input", label: "Area", placeholder: "Enter Area" },
    { key: "pin", type: "input", label: "Pin", placeholder: "Enter Pin Code" },
    { key: "city", type: "input", label: "City", placeholder: "Enter City" },
    { key: "state", type: "select", label: "State", options: ["delhi"] },
    { key: "country", type: "select", label: "Country", options: ["india"] },
    { key: "nativePlace", type: "input", label: "Native Place", placeholder: "Enter Native Place" },
    { key: "mobile", type: "input", label: "Mobile", placeholder: "Enter Mobile" },
    { key: "tel", type: "input", label: "Tel. No.", placeholder: "Enter Tel. No." },
  ];

  interface FieldConfig {
    key: string;
    type: "text" | "number" | "email" | "date" | "checkbox" | "select" | "empty";
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    colSpan?: number;
    options?: string[];
    defaultValue?: string;
    defaultChecked?: boolean;
    className?: string;
    labelInline?: boolean;
  }

  interface FieldGroup {
    title: string;
    icon: any;
    fields: FieldConfig[];
  }

  const fieldGroups: FieldGroup[] = [
    {
      title: "Primary Information",
      icon: User,
      fields: [
        { key: "empCode", type: "text", label: "Employee Code*", placeholder: "Auto Generate", disabled: true, className: "bg-gray-50 dark:bg-zinc-900" },
        { key: "salutation", type: "select", label: "Salutation*", placeholder: "Select Salutation", options: ["mr", "ms", "shree", "miss"] },
        { key: "firstname", type: "text", label: "Firstname*", placeholder: "Enter first name" },
        { key: "middlename", type: "text", label: "Middlename", placeholder: "Enter middle name" },
        { key: "surname", type: "text", label: "Surname*", placeholder: "Enter surname" },
        { key: "edpNo", type: "text", label: "EDP No*", placeholder: "Enter EDP No" },
        { key: "refId", type: "text", label: "Ref. id.*", placeholder: "Enter Ref ID" },
        { key: "petname", type: "text", label: "Petname", placeholder: "Enter Petname" },
        { key: "emailId", type: "email", label: "Email Id.", placeholder: "Enter Email" },
      ]
    },
    {
      title: "Personal & Demographic Details",
      icon: Heart,
      fields: [
        { key: "dob", type: "date", label: "Date of Birth*" },
        { key: "age", type: "number", label: "Age", placeholder: "Enter Age" },
        { key: "gender", type: "select", label: "Gender*", placeholder: "Select Gender", options: ["male", "female", "other"] },
        { key: "bloodGrp", type: "select", label: "Blood Grp.*", placeholder: "Select Blood Group", options: ["a+", "b+", "o+", "ab+"] },
        { key: "maritalStatus", type: "select", label: "Marital Status*", placeholder: "Select Marital Status", options: ["single", "married", "divorced"] },
        { key: "nationality", type: "select", label: "Nationality*", placeholder: "Select Nationality", options: ["indian"] },
        { key: "religion", type: "text", label: "Religion", placeholder: "Enter Religion" },
        { key: "caste", type: "select", label: "Caste*", placeholder: "Select Caste", options: ["general", "obc", "sc", "st"] },
        { key: "placeOfBirth", type: "text", label: "Place Of Birth", placeholder: "Enter Place of Birth" },
      ]
    },
    {
      title: "Dates & Milestones",
      icon: Calendar,
      fields: [
        { key: "doj", type: "date", label: "Date of Joining*" },
        { key: "confirmDt", type: "date", label: "Confirm. Dt." },
        { key: "probationDt", type: "date", label: "Probation Dt." },
        { key: "probationEnd", type: "date", label: "Probation End Dt." },
        { key: "retireDate", type: "date", label: "Retire. Date" },
      ]
    },
    {
      title: "Bank Account Details",
      icon: Landmark,
      fields: [
        { key: "bankName", type: "text", label: "Bank Name", placeholder: "Enter Bank Name" },
        { key: "bankAc", type: "text", label: "Bank A/c. No*", placeholder: "Enter Bank Account No" },
        { key: "acName", type: "text", label: "A/c. Name", placeholder: "Enter Account Name" },
        { key: "customerId", type: "text", label: "Customer Id", placeholder: "Enter Customer ID" },
      ]
    },
    {
      title: "Statutory & Identity Documents",
      icon: Shield,
      fields: [
        { key: "panNo", type: "text", label: "PAN No.*", placeholder: "Enter PAN No" },
        { key: "pfNumber", type: "text", label: "PF Number*", placeholder: "Enter PF Number" },
        { key: "pfDate", type: "date", label: "PF Date" },
        { key: "esiNumber", type: "text", label: "ESI Number", placeholder: "Enter ESI Number" },
        { key: "tdsMethod", type: "select", label: "TDS_Method", placeholder: "Select TDS Method", options: ["old", "new"] },
      ]
    },
    {
      title: "Preferences & Options",
      icon: Settings,
      fields: [
        { key: "handiDepe", type: "checkbox", label: "Handi. Depe.", labelInline: true },
        { key: "iCardIssued", type: "checkbox", label: "I-Card Issued", defaultChecked: true, labelInline: true },
      ]
    }
  ];

  const getOptionLabel = (val: string) => {
    if (val === "mr") return "Mr.";
    if (val === "ms") return "Ms.";
    if (val === "shree") return "Shree";
    if (val === "miss") return "Miss.";
    return val.toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

      {/* LEFT CONTAINER (Spans 2 columns) */}
      <div className="lg:col-span-2 flex flex-col gap-4">

        {/* Card 1: Personal Information */}
        <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
          <div className="flex items-center gap-2.5 mb-6 border-b pb-4">
            <div className="p-1.5 bg-theme/10 rounded-lg">
              <User className="w-5 h-5 text-theme" />
            </div>
            <h2 className="text-base font-bold text-[#202C4B] dark:text-white">
              Personal Information
            </h2>
          </div>

          <div className="space-y-8">
            {fieldGroups.map((group, groupIdx) => {
              const GroupIcon = group.icon;
              return (
                <div key={groupIdx} className="space-y-4">
                  {/* Group Header */}
                  <div className="flex items-center gap-2 border-b dark:border-zinc-800 pb-2 mb-1">
                    <div className="p-1 bg-theme/5 rounded">
                      <GroupIcon className="w-4 h-4 text-theme" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {group.title}
                    </h3>
                  </div>

                  {/* 5-Column Responsive Grid for fields in group */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${isMd ? "md:grid-cols-3" : ""} ${isXl ? "xl:grid-cols-4" : ""} gap-x-4 gap-y-4`}>
                    {group.fields.map((field) => {
                      if (field.type === "empty") {
                        return <div key={field.key} className="hidden xl:block"></div>;
                      }

                      const isColSpan2 = field.colSpan === 2;

                      return (
                        <div
                          key={field.key}
                          className={`flex flex-col gap-1.5 ${isColSpan2 ? "xl:col-span-2" : ""}`}
                        >
                          {field.type === "checkbox" ? (
                            field.labelInline ? (
                              <div className="flex flex-col gap-2 justify-end pb-1 h-full">
                                <div className="flex items-center gap-2">
                                  <Checkbox id={field.key} defaultChecked={field.defaultChecked} className="w-4 h-4 border-gray-300 rounded" />
                                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 leading-none">{field.label}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 justify-end pb-1 h-full">
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{field.label}</Label>
                                <Checkbox id={field.key} defaultChecked={field.defaultChecked} className="w-5 h-5 border-gray-300 rounded" />
                              </div>
                            )
                          ) : (
                            <>
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {field.label}
                              </Label>

                              {field.type === "select" ? (
                                <Select defaultValue={field.defaultValue}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={field.placeholder} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((opt) => (
                                      <SelectItem key={opt} value={opt}>
                                        {getOptionLabel(opt)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : field.type === "date" ? (
                                <DatePickerInput
                                  value={dateValues[field.key] || ""}
                                  onChange={(val) => setDateValues((p) => ({ ...p, [field.key]: val }))}
                                  placeholder={field.placeholder}
                                  className={`w-full ${field.className || ""}`}
                                  disabled={field.disabled}
                                />
                              ) : (
                                <Input
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  disabled={field.disabled}
                                  className={field.className}
                                />
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Card 2: Allowances & Deductions */}
        <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
          <div className="flex items-center gap-2.5 mb-2 border-b pb-4">
            <div className="p-1.5 bg-theme/10 rounded-lg">
              <CheckSquare className="w-5 h-5 text-theme" />
            </div>
            <h2 className="text-base font-bold text-[#202C4B] dark:text-white">
              Allowances & Deductions
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-7 gap-4">
            {allowances.map((a) => (
              <div key={a.id} className="flex items-center gap-2">
                <Checkbox id={a.id} defaultChecked={a.defaultChecked} className="w-4 h-4" />
                <Label htmlFor={a.id} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">{a.label}</Label>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* RIGHT CONTAINER (Spans 1 column) */}
      <div className="flex flex-col gap-4">

        {/* Card 3: Current Address */}
        <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
          <div className="flex items-center justify-between mb-2 border-b pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-theme/10 rounded-lg">
                <MapPin className="w-5 h-5 text-theme" />
              </div>
              <h2 className="text-base font-bold text-[#202C4B] dark:text-white">
                Current Address
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {addressFields.map((f) => {
                const isTextArea = f.type === "textArea";
                return (
                  <div key={f.key} className={`flex flex-col gap-1.5 ${isTextArea ? "col-span-2" : ""}`}>
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{f.label}</Label>
                    {f.type === "input" ? (
                      <Input placeholder={f.placeholder} />
                    ) : f.type === "textArea" ? (
                      <Textarea placeholder={f.placeholder} className="min-h-[80px] resize-none" />
                    ) : (
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select ${f.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {f.options?.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Card 4: Permanent Address */}
        <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
          <div className="flex items-center justify-between mb-2 border-b pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-theme/10 rounded-lg">
                <MapPin className="w-5 h-5 text-theme" />
              </div>
              <h2 className="text-base font-bold text-[#202C4B] dark:text-white">
                Permanent Address
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-4">

            <div className="flex items-center gap-2 pb-2">
              <Checkbox id="sameAsPermanent" className="w-4 h-4 border-gray-300 rounded" />
              <Label htmlFor="sameAsPermanent" className="text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer">Same as Current Address</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {addressFields.map((f) => {
                const isTextArea = f.type === "textArea";
                return (
                  <div key={f.key} className={`flex flex-col gap-1.5 ${isTextArea ? "col-span-2" : ""}`}>
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{f.label}</Label>
                    {f.type === "input" ? (
                      <Input placeholder={f.placeholder} />
                    ) : f.type === "textArea" ? (
                      <Textarea placeholder={f.placeholder} className="min-h-[80px] resize-none" />
                    ) : (
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select ${f.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {f.options?.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Card 5: Additional Information */}
        <Card className="p-4 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700">
          <div className="flex items-center gap-2.5 mb-2 border-b pb-4">
            <div className="p-1.5 bg-theme/10 rounded-lg">
              <Search className="w-5 h-5 text-theme" />
            </div>
            <h2 className="text-base font-bold text-[#202C4B] dark:text-white">
              Additional Information
            </h2>
          </div>

          {/* Interactive flex-wrap layout for pills */}
          <div className="flex flex-wrap gap-2">
            {additionalInfoPills.map((pill) => {
              const isActive = activeInfoTab === pill.id;
              return (
                <Button
                  key={pill.id}
                  type="button"
                  onClick={() => {
                    setActiveInfoTab(pill.id);
                    if (pill.id === "family") {
                      setIsFamilyDialogOpen(true);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${isActive
                    ? "bg-theme border-theme text-white shadow-sm"
                    : "bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  {pill.label}
                </Button>
              );
            })}
          </div>
        </Card>

      </div>

      <FamilyDetailsDialog
        open={isFamilyDialogOpen}
        onOpenChange={setIsFamilyDialogOpen}
        members={familyMembers}
        onSave={(members) => {
          setFamilyMembers(members);
          setIsFamilyDialogOpen(false);
        }}
      />

    </div>
  );
}
