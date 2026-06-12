import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePickerInput } from "@/components/DatePickerInput";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface Employee {
    id: string;
    code: string;
    name: string;
    email: string;
    mobile: string;
    designation: string;
    department: string;
    location: string;
    doj: string;
    status: string;
    reportingManager: string;
    gender: string;
    bloodGroup: string;
    employeeType: string;
    workStatus: string;
}

interface EmployeeCardProps {
    selectedEmployee: Employee;
    setIsSidebarOpen: (open: boolean) => void;
    onUpdate: (updatedEmployee: Employee) => void;
    isMobile?: boolean;
}

export default function EmployeeCard({
    selectedEmployee,
    setIsSidebarOpen,
    onUpdate,
    isMobile = false,
}: EmployeeCardProps) {
    const [formData, setFormData] = useState<Employee>({ ...selectedEmployee });

    useEffect(() => {
        setFormData({ ...selectedEmployee });
    }, [selectedEmployee]);

    const handleChange = (key: keyof Employee, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = () => {
        onUpdate(formData);
    };

    return (
        <>
            <div className="p-4 border-b dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Employee Details</h3>
                {!isMobile && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
                        <X size={18} />
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1 h-[calc(100vh-250px)]">
                <div className="p-4 space-y-4">
                    {/* General Info */}
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Employee Code</Label>
                        <Input
                            value={formData.code}
                            disabled
                            className="h-10 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Employee Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="h-10 border-slate-200 dark:border-slate-800"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Gender</Label>
                            <Select value={formData.gender} onValueChange={(val) => handleChange("gender", val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Blood Group</Label>
                            <Select value={formData.bloodGroup} onValueChange={(val) => handleChange("bloodGroup", val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Blood Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Email ID</Label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="h-10 border-slate-200 dark:border-slate-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Mobile No</Label>
                        <Input
                            value={formData.mobile}
                            onChange={(e) => handleChange("mobile", e.target.value)}
                            className="h-10 border-slate-200 dark:border-slate-800"
                        />
                    </div>

                    {/* Job Details */}
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Designation</Label>
                        <Select value={formData.designation} onValueChange={(val) => handleChange("designation", val)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Designation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Senior Software Engineer">Senior Software Engineer</SelectItem>
                                <SelectItem value="HR Executive">HR Executive</SelectItem>
                                <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                                <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                                <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Department</Label>
                        <Select value={formData.department} onValueChange={(val) => handleChange("department", val)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Engineering">Engineering</SelectItem>
                                <SelectItem value="Human Resources">Human Resources</SelectItem>
                                <SelectItem value="Analytics">Analytics</SelectItem>
                                <SelectItem value="Design">Design</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Location</Label>
                            <Select value={formData.location} onValueChange={(val) => handleChange("location", val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Noida">Noida</SelectItem>
                                    <SelectItem value="Delhi">Delhi</SelectItem>
                                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                                    <SelectItem value="Pune">Pune</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Employee Type</Label>
                            <Select value={formData.employeeType} onValueChange={(val) => handleChange("employeeType", val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full Time">Full Time</SelectItem>
                                    <SelectItem value="Part Time">Part Time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Date of Joining</Label>
                        <DatePickerInput
                            value={formData.doj}
                            onChange={(val) => handleChange("doj", val)}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Reporting Manager</Label>
                        <Select value={formData.reportingManager} onValueChange={(val) => handleChange("reportingManager", val)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Manager" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="John Doe">John Doe</SelectItem>
                                <SelectItem value="Sarah Smith">Sarah Smith</SelectItem>
                                <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                                <SelectItem value="David Brown">David Brown</SelectItem>
                                <SelectItem value="Emma Wilson">Emma Wilson</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Work Status</Label>
                            <Select value={formData.workStatus} onValueChange={(val) => handleChange("workStatus", val)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Work Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2 justify-end pb-1">
                            <div className="flex items-center justify-between">
                                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Status</Label>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={formData.status === "Active"}
                                        onCheckedChange={(checked) => handleChange("status", checked ? "Active" : "Inactive")}
                                    />
                                    <span className="text-xs font-bold">{formData.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <div className="p-4 border-t dark:border-slate-800 grid grid-cols-2 gap-4 bg-background">
                <Button variant="outline" className="h-10 font-bold text-slate-600 border-slate-200 dark:border-slate-800" onClick={() => setIsSidebarOpen(false)}>
                    Cancel
                </Button>
                <Button className="h-10 bg-theme text-white font-bold" onClick={handleSave}>
                    Update
                </Button>
            </div>
        </>
    );
}
