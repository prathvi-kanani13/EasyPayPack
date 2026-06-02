import { useState } from "react";
import EmployeeDetailCard from "../EmployeeDetailCard";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Plus, Trash2, Pencil } from "lucide-react";

// Nominee interface defines the structure of each nominee row in the table
export interface Nominee {
  id: string;
  name: string;
  relation: string;
  gender: string;
  dob: string;
  age: number | "";
  percentage: number;
  pfApplicable: boolean;
  education: string;
}

// Helper function to calculate age based on date of birth string in dd/MM/yyyy format
const calculateAge = (dobString: string): number | "" => {
  if (!dobString) return "";

  // Support both dash (-) and slash (/) separators
  const separator = dobString.includes("-") ? "-" : "/";
  const parts = dobString.split(separator);
  if (parts.length !== 3) return "";

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return "";

  const birthDate = new Date(year, month, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 ? age : "";
};

// Initial state data matching the screenshot values
const initialNominees: Nominee[] = [
  {
    id: "1",
    name: "JIGNESHKUMAR PATEL",
    relation: "Father",
    gender: "Male",
    dob: "12/05/1956",
    age: 68,
    percentage: 60,
    pfApplicable: true,
    education: "Graduate",
  },
  {
    id: "2",
    name: "KANTABEN PATEL",
    relation: "Mother",
    gender: "Female",
    dob: "15/08/1960",
    age: 63,
    percentage: 30,
    pfApplicable: true,
    education: "12th Pass",
  },
  {
    id: "3",
    name: "DHRUV PATEL",
    relation: "Son",
    gender: "Male",
    dob: "20/11/1990",
    age: 32,
    percentage: 10,
    pfApplicable: false,
    education: "Post Graduate",
  },
];

// NomineesTab displays an editable nominee summary table, allowing HR users to
// add, modify, and delete nominees for an employee with integrated form validation.
export default function NomineesTab() {
  const [nominees, setNominees] = useState<Nominee[]>(initialNominees);

  // Add a new empty row to the nominee table list
  const handleAddRow = () => {
    const newId = (nominees.length + 1).toString();
    const newRow: Nominee = {
      id: newId,
      name: "",
      relation: "",
      gender: "",
      dob: "",
      age: "",
      percentage: 0,
      pfApplicable: false,
      education: "",
    };
    setNominees([...nominees, newRow]);
  };

  // Delete a specific nominee row by its ID
  const handleDeleteRow = (id: string) => {
    setNominees(nominees.filter((n) => n.id !== id));
  };

  // Handle changes for any input fields within a row
  const handleInputChange = <K extends keyof Nominee>(
    id: string,
    field: K,
    value: Nominee[K]
  ) => {
    setNominees((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = { ...n, [field]: value };
          // Auto-calculate the age field if date of birth has changed
          if (field === "dob") {
            updated.age = calculateAge(value as string);
          }
          return updated;
        }
        return n;
      })
    );
  };

  // Compute total allocation percentage sum
  const totalPercentage = nominees.reduce((sum, n) => sum + (Number(n.percentage) || 0), 0);
  const isSumValid = totalPercentage === 100;

  return (
    <div className="flex flex-col gap-4">
      {/* Employee Detail Card */}
      <EmployeeDetailCard />

      {/* Nominees Data Grid Card */}
      <Card className="rounded-md border dark:border-gray-800 py-0">
        <CardContent className="flex flex-col gap-4 px-0">
          <div className="overflow-x-auto w-full px-4">
            <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border pb-3 text-gray-500 font-semibold">
                  <th className="py-3 px-2 w-[70px]">Sr. No.</th>
                  <th className="py-3 px-2 w-[240px]">
                    Nominee Name <span className="text-red-500">*</span>
                  </th>
                  <th className="py-3 px-2 w-[140px]">
                    Relation <span className="text-red-500">*</span>
                  </th>
                  <th className="py-3 px-2 w-[120px]">
                    Gender <span className="text-red-500">*</span>
                  </th>
                  <th className="py-3 px-2 w-[170px]">
                    Date of Birth <span className="text-red-500">*</span>
                  </th>
                  <th className="py-3 px-2 w-[80px]">Age</th>
                  <th className="py-3 px-2 w-[140px]">
                    Nominee (%) <span className="text-red-500">*</span>
                  </th>
                  <th className="py-3 px-2 w-[120px] text-center">PF Applicable</th>
                  <th className="py-3 px-2 w-[180px]">Education</th>
                  <th className="py-3 px-2 w-[100px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {nominees.map((nominee, index) => (
                  <tr key={nominee.id} className="hover:bg-muted/30 transition-colors">
                    {/* Sr. No. */}
                    <td className="py-3 px-2 font-medium text-gray-500">{index + 1}</td>

                    {/* Nominee Name */}
                    <td className="py-3 px-2">
                      <Input
                        value={nominee.name}
                        onChange={(e) => handleInputChange(nominee.id, "name", e.target.value.toUpperCase())}
                        placeholder="Enter Nominee Name"
                        className="h-8"
                      />
                    </td>

                    {/* Relation */}
                    <td className="py-3 px-2">
                      <Select
                        value={nominee.relation}
                        onValueChange={(val) => handleInputChange(nominee.id, "relation", val)}
                      >
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue placeholder="Relation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Father">Father</SelectItem>
                          <SelectItem value="Mother">Mother</SelectItem>
                          <SelectItem value="Son">Son</SelectItem>
                          <SelectItem value="Daughter">Daughter</SelectItem>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Children">Children</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Gender */}
                    <td className="py-3 px-2">
                      <Select
                        value={nominee.gender}
                        onValueChange={(val) => handleInputChange(nominee.id, "gender", val)}
                      >
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Date of Birth */}
                    <td className="py-3 px-2">
                      <DatePickerInput
                        value={nominee.dob}
                        onChange={(val) => handleInputChange(nominee.id, "dob", val)}
                        valueFormat="dd/MM/yyyy"
                        displayFormat="dd/MM/yyyy"
                        className="h-8 w-full"
                      />
                    </td>

                    {/* Age */}
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={nominee.age}
                        onChange={(e) =>
                          handleInputChange(
                            nominee.id,
                            "age",
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        placeholder="Age"
                        className="h-8 w-16"
                      />
                    </td>

                    {/* Nominee % */}
                    <td className="py-3 px-2">
                      <InputGroup className="h-8 w-[110px]">
                        <InputGroupInput
                          type="number"
                          value={nominee.percentage || ""}
                          onChange={(e) =>
                            handleInputChange(
                              nominee.id,
                              "percentage",
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          min={0}
                          max={100}
                          placeholder="0.00"
                          className="h-full"
                        />
                        <InputGroupAddon align="inline-end" className="bg-muted px-2 border-l h-full shrink-0">
                          <InputGroupText className="text-xs">%</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </td>

                    {/* PF Applicable */}
                    <td className="py-3 px-2 text-center">
                      <div className="flex justify-center items-center">
                        <Checkbox
                          checked={nominee.pfApplicable}
                          onCheckedChange={(checked) =>
                            handleInputChange(nominee.id, "pfApplicable", !!checked)
                          }
                        />
                      </div>
                    </td>

                    {/* Education */}
                    <td className="py-3 px-2">
                      <Input
                        value={nominee.education}
                        onChange={(e) => handleInputChange(nominee.id, "education", e.target.value)}
                        placeholder="Education Details"
                        className="h-8"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button outline matching the visual style */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-purple-200 text-purple-600 hover:bg-accent hover:text-purple-700 dark:border-purple-900/50 dark:text-purple-400"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {/* Delete Button with red outline indicator */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteRow(nominee.id)}
                          className="h-8 w-8 border-red-200 text-red-600 hover:bg-accent hover:text-red-700 dark:border-red-900/50 dark:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Nominee Button */}
          <div className="px-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleAddRow}
              className="w-full border-dashed border-theme-secondary/50 dark:border-theme-secondary/50 text-theme-secondary dark:text-theme-secondary"
            >
              <Plus className="h-4 w-4" />
              Add New Nominee
            </Button>
          </div>
        </CardContent>

        {/* Card Footer matching the requested layout */}
        <CardFooter className="flex flex-wrap gap-2 items-center justify-between border-t border-border">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#202C4B] dark:text-white">Total Nominee %</span>
            <span className={`px-3 py-1 text-sm font-semibold rounded-md border ${isSumValid
              ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50"
              }`}>
              {totalPercentage.toFixed(2)} %
            </span>
          </div>
          <div className="text-sm font-semibold text-[#202C4B] dark:text-gray-300">
            Note: Nominee percentage must be equal to 100%.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}