import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Sliders, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DatePickerInput } from "@/components/DatePickerInput";
import { useAlert } from "@/context/AlertContext";

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

// Mock database to retrieve settings
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

// Fallback value matching reference screenshot if ID is not found or is adding
const defaultViewValue: PTAXConfig = {
  effectiveDate: "01/01/2026",
  active: true,
  formulaDescription: "Basic + DA",
  company: "THE GANDHIDHAM MERCANTILE CO. OP.",
  branch: "Ahmedabad",
  salaryHead: "PTAX",
  gender: "ALL",
  slabs: [
    { lowerLimit: 1, upperLimit: 12000, ptaxAmount: 0 },
    { lowerLimit: 12001, upperLimit: 99999999, ptaxAmount: 200 }
  ]
};

// Target branches options (excluding source branch from select list)
const branchList = ["Surat", "Rajkot", "Vadodara", "Mumbai", "Gandhidham HO", "Adipur Branch", "Delhi Branch"];

// Branch groups options
const groupList = ["Gujarat Branches", "Maharashtra Branches", "South Branches", "HO & Corporate"];

export default function ViewConfig() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Retrieve matching config details
  const config = useMemo(() => {
    if (id) {
      const found = mockConfigs.find((c) => c.id === id);
      if (found) return found;
    }
    return defaultViewValue;
  }, [id]);

  // Replication State Variables
  const [activeTab, setActiveTab] = useState<string>("branches");
  const [branchSearch, setBranchSearch] = useState<string>("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["Mumbai"]); // Mumbai checked by default as in screenshot
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [applyToAll, setApplyToAll] = useState<boolean>(false);

  // Effective Date Selection State
  const [dateOption, setDateOption] = useState<"same" | "new">("same");
  const [newEffectiveDate, setNewEffectiveDate] = useState<string>("");

  // Calculate overall slabs coverage range (e.g. 1 - 99,99,999)
  const getSlabRangeString = (slabs: Slab[]) => {
    if (!slabs || slabs.length === 0) return "N/A";
    const minLimit = slabs[0].lowerLimit;
    const maxLimit = slabs[slabs.length - 1].upperLimit;

    const formatNumber = (num: number | "") => {
      if (num === "") return "";
      return num.toLocaleString("en-IN");
    };

    return `${formatNumber(minLimit)} - ${formatNumber(maxLimit)}`;
  };

  // Filter branches based on search query
  const filteredBranches = useMemo(() => {
    return branchList
      .filter((b) => b.toLowerCase() !== config.branch.toLowerCase()) // exclude source branch
      .filter((b) => b.toLowerCase().includes(branchSearch.toLowerCase()));
  }, [branchSearch, config.branch]);

  // Handle replication submit
  const handleApplyConfiguration = () => {
    // 1. Validation of target branches selection
    if (activeTab === "branches" && selectedBranches.length === 0) {
      showAlert({
        title: "Validation Error",
        description: "Please select at least one branch to apply configuration.",
        variant: "error"
      });
      return;
    }
    if (activeTab === "groups" && selectedGroups.length === 0) {
      showAlert({
        title: "Validation Error",
        description: "Please select at least one branch group to apply configuration.",
        variant: "error"
      });
      return;
    }
    if (activeTab === "all" && !applyToAll) {
      showAlert({
        title: "Validation Error",
        description: "Please confirm applying to all branches by checking the option.",
        variant: "error"
      });
      return;
    }

    // 2. Validation of new date
    if (dateOption === "new" && !newEffectiveDate) {
      showAlert({
        title: "Validation Error",
        description: "Please specify a new effective date.",
        variant: "error"
      });
      return;
    }

    // 3. Execution Log & Alert
    const targets =
      activeTab === "branches"
        ? `Branches: ${selectedBranches.join(", ")}`
        : activeTab === "groups"
          ? `Groups: ${selectedGroups.join(", ")}`
          : "All branches";

    const dateVal = dateOption === "same" ? config.effectiveDate : newEffectiveDate;

    console.log("Applying configuration settings:", {
      sourceBranch: config.branch,
      targets,
      effectiveDate: dateVal,
      configuration: config
    });

    showAlert({
      title: "Configuration Applied Successfully",
      description: `Configuration replicated to ${targets} starting ${dateVal}.`,
      variant: "success"
    });

    navigate("/ptax/master");
  };

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/ptax/master")}>
        <ArrowLeft size={16} /> <h1 className="text-2xl font-bold dark:text-white">PTAX Master</h1>
      </div>

      {/* Card 1: Configuration Summary */}
      <Card className="rounded-sm shadow-xs border overflow-hidden">
        <CardContent className="p-0 flex flex-col">
          {/* Header Row */}
          <div className="p-5 flex items-center gap-3 border-b ">
            <Sliders className="text-blue-600 h-5 w-5" />
            <h2 className="text-lg font-semibold dark:text-white">
              Configuration Summary
            </h2>
          </div>

          {/* Details Grid */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-4">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center py-0.5 border-b">
                <span className="font-medium text-sm">Branch</span>
                <span className="font-semibold text-sm">{config.branch}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b">
                <span className="font-medium text-sm">Salary Head</span>
                <span className="font-semibold text-sm">{config.salaryHead}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b">
                <span className="font-medium text-sm">Gender</span>
                <span className="font-semibold text-sm">{config.gender}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="font-medium text-sm">Formula</span>
                <span className="font-semibold text-sm">{config.formulaDescription}</span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3 md:border-l md:pl-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm">No. of Slabs</span>
                <span className="font-semibold text-sm">
                  {config.slabs.length}
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <span className="font-medium text-sm">Status</span>
                <Badge className={`w-fit border-none px-2.5 py-0.5 text-xs ${config.active
                  ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300"
                  }`}>
                  {config.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-3 md:border-l md:pl-4">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm">Slab Range</span>
                <span className="font-semibold text-sm">
                  {getSlabRangeString(config.slabs)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Metadata Row */}
          <div className="px-4 py-3 border-t flex justify-between items-center text-xs">
            <div>
              <span className="font-medium mr-1.5">Last Modified By</span>
              <span className="font-semibold">Shahid</span>
            </div>
            <div>
              <span className="font-medium mr-1.5">Last Modified On</span>
              <span className="font-semibold">12/06/2026 11:30 AM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Apply Same Configuration To */}
      <Card className="p-4 rounded-sm shadow-sm border flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b pb-3">
          <Copy className="text-blue-600 h-5 w-5" />
          <h2 className="text-lg font-semibold dark:text-white">
            Apply Same Configuration To
          </h2>
        </div>

        <Tabs defaultValue="branches" onValueChange={setActiveTab} className="w-full flex flex-col gap-4">
          <TabsList className="p-1 rounded-sm h-10 border-none shadow-none flex gap-1 w-full max-w-md">
            <TabsTrigger
              value="branches"
              className="flex-1 h-8 text-sm cursor-pointer"
            >
              Branches
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="flex-1 h-8 text-sm cursor-pointer"
            >
              Branch Group
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="flex-1 h-8 text-sm cursor-pointer"
            >
              All Branches
            </TabsTrigger>
          </TabsList>

          {/* Branches Tab Content */}
          <TabsContent value="branches" className="flex flex-col gap-4 focus-visible:outline-none">
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Search Branch"
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
                className="pr-10 h-10 w-full"
              />
              <Search className="absolute right-3 top-3 h-4 w-4" />
            </div>

            <div className="border rounded-sm p-4 max-h-48 overflow-y-auto flex flex-col gap-3">
              {filteredBranches.length === 0 ? (
                <span className="text-sm italic">No matching branches found.</span>
              ) : (
                filteredBranches.map((br) => (
                  <div key={br} className="flex items-center gap-3">
                    <Checkbox
                      id={`branch-${br}`}
                      checked={selectedBranches.includes(br)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBranches([...selectedBranches, br]);
                        } else {
                          setSelectedBranches(selectedBranches.filter((x) => x !== br));
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <Label
                      htmlFor={`branch-${br}`}
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      {br}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Groups Tab Content */}
          <TabsContent value="groups" className="flex flex-col gap-4 focus-visible:outline-none">
            <div className="border rounded-sm p-4 max-h-48 overflow-y-auto flex flex-col gap-3">
              {groupList.map((gp) => (
                <div key={gp} className="flex items-center gap-3">
                  <Checkbox
                    id={`group-${gp}`}
                    checked={selectedGroups.includes(gp)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedGroups([...selectedGroups, gp]);
                      } else {
                        setSelectedGroups(selectedGroups.filter((x) => x !== gp));
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor={`group-${gp}`}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {gp}
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* All Branches Tab Content */}
          <TabsContent value="all" className="flex flex-col gap-4 focus-visible:outline-none">
            <div className="border rounded-sm p-4 flex items-center gap-3">
              <Checkbox
                id="apply-all"
                checked={applyToAll}
                onCheckedChange={(checked) => setApplyToAll(!!checked)}
                className="cursor-pointer"
              />
              <Label
                htmlFor="apply-all"
                className="text-sm font-medium cursor-pointer flex-1"
              >
                Apply this PTAX configuration to all other active branches (except {config.branch})
              </Label>
            </div>
          </TabsContent>
        </Tabs>

        {/* Date Selection Options */}
        <div className="flex flex-col gap-3 mt-2 border-t pt-4">
          <span className="text-sm font-semibold">
            Effective Date for New Branches
          </span>

          <RadioGroup
            value={dateOption}
            onValueChange={(val) => setDateOption(val as "same" | "new")}
            className="flex flex-col gap-3"
          >
            {/* Same date radio */}
            <div className="flex items-center gap-3">
              <RadioGroupItem value="same" id="date-same" className="cursor-pointer" />
              <Label htmlFor="date-same" className="text-sm font-medium cursor-pointer">
                Same as Source ({config.effectiveDate})
              </Label>
            </div>

            {/* New date radio and DatePickerInput */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="new" id="date-new" className="cursor-pointer" />
                <Label htmlFor="date-new" className="text-sm font-medium cursor-pointer">
                  Use New Date
                </Label>
              </div>
              <DatePickerInput
                value={newEffectiveDate}
                onChange={setNewEffectiveDate}
                disabled={dateOption === "same"}
                placeholder="DD/MM/YYYY"
                className="w-44"
              />
            </div>
          </RadioGroup>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleApplyConfiguration}
            className="w-full max-w-sm h-11 bg-theme font-semibold text-sm rounded-md shadow-xs transition-colors"
          >
            Apply Configuration
          </Button>
        </div>
      </Card>
    </div>
  );
}
