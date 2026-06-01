import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Trash2, Plus, Pencil, Check } from "lucide-react";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";

export interface LoanRecord {
  id: string;
  bank: string;
  branch: string;
  type: string;
  accountNo: string;
  accountName: string;
  salaryHead: string;
  noOfInst: string;
  instRs: string;
  disbursedAmt: string;
  insStartDate: string;
  dueDate: string;
}

export default function LoanDetailTab() {
  const [loans, setLoans] = useState<LoanRecord[]>([
    {
      id: "1",
      bank: "",
      branch: "",
      type: "",
      accountNo: "",
      accountName: "",
      salaryHead: "",
      noOfInst: "0",
      instRs: "0.00",
      disbursedAmt: "0.00",
      insStartDate: "",
      dueDate: "",
    },
  ]);

  const [editingRowIds, setEditingRowIds] = useState<Record<string, boolean>>({
    "1": false,
  });

  const bankOptions = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Bank of Baroda", "AXIS Bank"];
  const branchOptions = ["Gandhidham HO", "Adipur Branch", "Bhuj Branch", "Anjar Branch"];
  const typeOptions = ["Company Loan", "Festival Advance", "Salary Advance", "Medical Loan"];
  const salaryHeadOptions = ["LOAN DEDUCTION", "ADVANCE DEDUCTION", "SALARY ADVANCE"];

  const updateField = (id: string, field: keyof LoanRecord, value: string) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, [field]: value } : loan))
    );
  };

  const toggleEdit = (id: string) => {
    setEditingRowIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteLoan = (id: string) => {
    setLoans((prev) => prev.filter((loan) => loan.id !== id));
    setEditingRowIds((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const addNewLoan = () => {
    const nextId = `loan-${Date.now()}`;
    const newRow: LoanRecord = {
      id: nextId,
      bank: "",
      branch: "",
      type: "",
      accountNo: "",
      accountName: "",
      salaryHead: "",
      noOfInst: "0",
      instRs: "0.00",
      disbursedAmt: "0.00",
      insStartDate: "",
      dueDate: "",
    };

    setLoans((prev) => [...prev, newRow]);
    setEditingRowIds((prev) => ({ ...prev, [nextId]: true }));
  };

  const columns = useMemo<ColumnDef<LoanRecord>[]>(
    () => [
      {
        id: "srNo",
        header: "SR. NO.",
        cell: ({ row }) => (
          <div className="w-10 h-9 mx-auto flex items-center justify-center border border-gray-200 dark:border-zinc-800 rounded bg-[#FAF9FC] dark:bg-zinc-900 font-semibold text-gray-700 dark:text-gray-300 text-sm">
            {row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: "bank",
        header: () => (
          <span>
            BANK<span className="text-red-500 font-bold ml-0.5">*</span>
          </span>
        ),
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <Select
              value={row.original.bank || undefined}
              onValueChange={(value) => updateField(row.original.id, "bank", value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full h-9 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default min-w-[160px] text-sm">
                <SelectValue placeholder="Select Bank" />
              </SelectTrigger>
              <SelectContent>
                {bankOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      },
      {
        accessorKey: "branch",
        header: () => (
          <span>
            BRANCH<span className="text-red-500 font-bold ml-0.5">*</span>
          </span>
        ),
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <Select
              value={row.original.branch || undefined}
              onValueChange={(value) => updateField(row.original.id, "branch", value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full h-9 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default min-w-[160px] text-sm">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      },
      {
        accessorKey: "type",
        header: () => (
          <span>
            TYPE<span className="text-red-500 font-bold ml-0.5">*</span>
          </span>
        ),
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <Select
              value={row.original.type || undefined}
              onValueChange={(value) => updateField(row.original.id, "type", value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full h-9 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default min-w-[140px] text-sm">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      },
      {
        accessorKey: "accountNo",
        header: () => (
          <span>
            A/C<span className="text-red-500 font-bold ml-0.5">*</span>
          </span>
        ),
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <Input
              value={row.original.accountNo}
              onChange={(e) => updateField(row.original.id, "accountNo", e.target.value)}
              disabled={!isEditing}
              placeholder="Enter A/C No."
              className="h-9 px-3 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default font-medium min-w-[130px] text-sm"
            />
          );
        },
      },
      {
        accessorKey: "accountName",
        header: "ACCOUNT NAME",
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <Input
              value={row.original.accountName}
              onChange={(e) => updateField(row.original.id, "accountName", e.target.value)}
              disabled={!isEditing}
              placeholder="Enter Account Name"
              className="h-9 px-3 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default font-medium min-w-[180px] text-sm"
            />
          );
        },
      },
      {
        accessorKey: "salaryHead",
        header: () => (
          <span>
            SALARY HEAD<span className="text-red-500 font-bold ml-0.5">*</span>
          </span>
        ),
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <Select
              value={row.original.salaryHead || undefined}
              onValueChange={(value) => updateField(row.original.id, "salaryHead", value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full h-9 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default min-w-[160px] text-sm">
                <SelectValue placeholder="Select Salary Head" />
              </SelectTrigger>
              <SelectContent>
                {salaryHeadOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      },
      {
        accessorKey: "noOfInst",
        header: "NO. OF INST.",
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <Input
              type="number"
              value={row.original.noOfInst}
              onChange={(e) => updateField(row.original.id, "noOfInst", e.target.value)}
              disabled={!isEditing}
              placeholder="0"
              className="h-9 px-3 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default font-medium min-w-[80px] text-sm"
            />
          );
        },
      },
      {
        accessorKey: "instRs",
        header: "INST. RS.",
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <Input
              value={row.original.instRs}
              onChange={(e) => updateField(row.original.id, "instRs", e.target.value)}
              disabled={!isEditing}
              placeholder="0.00"
              className="h-9 px-3 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default font-medium min-w-[95px] text-sm"
            />
          );
        },
      },
      {
        accessorKey: "disbursedAmt",
        header: "DISBURSED AMT.",
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <Input
              value={row.original.disbursedAmt}
              onChange={(e) => updateField(row.original.id, "disbursedAmt", e.target.value)}
              disabled={!isEditing}
              placeholder="0.00"
              className="h-9 px-3 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default font-medium min-w-[110px] text-sm"
            />
          );
        },
      },
      {
        accessorKey: "insStartDate",
        header: "INS. START DATE",
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <DatePickerInput
              value={row.original.insStartDate}
              onChange={(value) => updateField(row.original.id, "insStartDate", value)}
              placeholder="Select Date"
              valueFormat="Select Date"
              disabled={!isEditing}
              className="w-full h-9 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default min-w-[140px] text-sm"
            />
          );
        },
      },
      {
        accessorKey: "dueDate",
        header: "DUE DATE",
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <DatePickerInput
              value={row.original.dueDate}
              onChange={(value) => updateField(row.original.id, "dueDate", value)}
              placeholder="Select Date"
              valueFormat="Select Date"
              disabled={!isEditing}
              className="w-full h-9 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/55 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default min-w-[140px] text-sm"
            />
          );
        },
      },
      {
        id: "actions",
        header: "ACTION",
        cell: ({ row }) => {
          const isEditing = editingRowIds[row.original.id];
          return (
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => toggleEdit(row.original.id)}
                className={`h-9 w-9 rounded-lg border transition-all ${isEditing
                  ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
                  : "border-[#EAE6F3] text-theme hover:bg-theme/5 hover:text-theme dark:border-zinc-800 dark:text-purple-400"
                  }`}
              >
                {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => deleteLoan(row.original.id)}
                className="h-9 w-9 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/30 transition-all cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [editingRowIds]
  );

  const table = useReactTable({
    data: loans,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 rounded-sm shadow-sm bg-white dark:bg-background border dark:border-gray-700 overflow-hidden">
        {/* Title and Icon */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-1.5 bg-theme/10 rounded-lg">
            <Wallet className="w-5 h-5 text-theme" />
          </div>
          <h2 className="text-base font-bold text-[#202C4B] dark:text-white">
            Loan Details
          </h2>
        </div>

        {/* TanStack Table with DataTable styling wrapper */}
        <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 mb-6">
          <DataTable
            table={table}
            isLoading={false}
            isError={false}
            columnCount={columns.length}
            errorMessage="No Data Found"
            className="w-full min-w-[1500px]"
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No loan records added yet.</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={addNewLoan}
                  className="text-theme font-semibold mt-1 hover:text-theme/80"
                >
                  Add your first loan
                </Button>
              </div>
            }
          />
        </div>

        {/* Add Loan Button */}
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={addNewLoan}
            className="border-theme text-theme hover:bg-theme/5 hover:text-theme rounded-xl px-5 py-2 h-10 font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="h-4 w-4 stroke-[3px]" />
            Add Loan
          </Button>
        </div>
      </Card>
    </div>
  );
}