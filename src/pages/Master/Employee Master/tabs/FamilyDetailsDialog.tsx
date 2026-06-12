import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Check } from "lucide-react";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";

export interface FamilyMember {
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

interface FamilyDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    members: FamilyMember[];
    onSave: (members: FamilyMember[]) => void;
}

export function FamilyDetailsDialog({ open, onOpenChange, members, onSave }: FamilyDetailsDialogProps) {
    const [draftMembers, setDraftMembers] = useState<FamilyMember[]>(members);
    const [editingRowIds, setEditingRowIds] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (open) {
            setDraftMembers(members);
            setEditingRowIds(
                members.reduce((acc, member) => {
                    acc[member.id] = false;
                    return acc;
                }, {} as Record<string, boolean>)
            );
        }
    }, [open, members]);

    const genderOptions = ["Male", "Female", "Other"];
    const relationOptions = ["Father", "Mother", "Spouse", "Brother", "Sister", "Son", "Daughter"];
    const workOptions = ["Yes", "No"];

    const updateField = (id: string, field: keyof Omit<FamilyMember, "id">, value: string) => {
        setDraftMembers((prev) =>
            prev.map((member) => {
                if (member.id === id) {
                    const updated = { ...member, [field]: value };
                    // Auto-fill fullname when name changes
                    if (field === "name") {
                        updated.fullname = value;
                    }
                    return updated;
                }
                return member;
            })
        );
    };

    const toggleEdit = (id: string) => {
        setEditingRowIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const deleteMember = (id: string) => {
        setDraftMembers((prev) => prev.filter((m) => m.id !== id));
        setEditingRowIds((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const addNewMember = () => {
        const nextMember: FamilyMember = {
            id: `new-${Date.now()}`,
            name: "",
            dob: "",
            gender: "Male",
            relation: "Father",
            occupation: "",
            workInBank: "No",
            edpNo: "-",
            fullname: "",
        };

        setDraftMembers((prev) => [...prev, nextMember]);
        setEditingRowIds((prev) => ({ ...prev, [nextMember.id]: true }));
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    const handleSaveChanges = () => {
        onSave(draftMembers);
    };

    const columns = useMemo<ColumnDef<FamilyMember>[]>(
        () => [
            {
                id: "srNo",
                header: "Sr. No.",
                cell: ({ row }) => (
                    <div className="text-center font-medium text-gray-700 dark:text-gray-300">
                        {row.index + 1}
                    </div>
                ),
            },
            {
                accessorKey: "name",
                header: () => (
                    <span>
                        Member Name<span className="text-red-500 font-bold ml-0.5">*</span>
                    </span>
                ),
                cell: ({ row }) => {
                    const isEditing = editingRowIds[row.original.id];
                    return (
                        <Input
                            value={row.original.name}
                            onChange={(e) => updateField(row.original.id, "name", e.target.value)}
                            disabled={!isEditing}
                            placeholder="MEMBER NAME"
                            className="h-9 px-3 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/50 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default font-medium uppercase min-w-[180px]"
                        />
                    );
                },
            },
            {
                accessorKey: "dob",
                header: () => (
                    <span>
                        DOB<span className="text-red-500 font-bold ml-0.5">*</span>
                    </span>
                ),
                cell: ({ row }) => {
                    const isEditing = editingRowIds[row.original.id];
                    return (
                        <DatePickerInput
                            value={row.original.dob}
                            onChange={(value) => updateField(row.original.id, "dob", value)}
                            placeholder="Select Date"
                            disabled={!isEditing}
                            className="w-full h-9 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/50 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default min-w-[130px]"
                        />
                    );
                },
            },
            {
                accessorKey: "gender",
                header: () => (
                    <span>
                        Gender<span className="text-red-500 font-bold ml-0.5">*</span>
                    </span>
                ),
                cell: ({ row }) => {
                    const isEditing = editingRowIds[row.original.id];
                    return (
                        <Select
                            value={row.original.gender}
                            onValueChange={(value) => updateField(row.original.id, "gender", value)}
                            disabled={!isEditing}
                        >
                            <SelectTrigger className="w-full h-9 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/50 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default min-w-[100px]">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {genderOptions.map((option) => (
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
                accessorKey: "relation",
                header: () => (
                    <span>
                        Relation<span className="text-red-500 font-bold ml-0.5">*</span>
                    </span>
                ),
                cell: ({ row }) => {
                    const isEditing = editingRowIds[row.original.id];
                    return (
                        <Select
                            value={row.original.relation}
                            onValueChange={(value) => updateField(row.original.id, "relation", value)}
                            disabled={!isEditing}
                        >
                            <SelectTrigger className="w-full h-9 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/50 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default min-w-[110px]">
                                <SelectValue placeholder="Relation" />
                            </SelectTrigger>
                            <SelectContent>
                                {relationOptions.map((option) => (
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
                accessorKey: "occupation",
                header: "Occupation",
                cell: ({ row }) => {
                    const isEditing = editingRowIds[row.original.id];
                    return (
                        <Input
                            value={row.original.occupation}
                            onChange={(e) => updateField(row.original.id, "occupation", e.target.value)}
                            disabled={!isEditing}
                            placeholder="Occupation"
                            className="h-9 px-3 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/50 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default font-medium min-w-[120px]"
                        />
                    );
                },
            },
            {
                accessorKey: "workInBank",
                header: () => (
                    <span>
                        Work In Bank<span className="text-red-500 font-bold ml-0.5">*</span>
                    </span>
                ),
                cell: ({ row }) => {
                    const isEditing = editingRowIds[row.original.id];
                    return (
                        <Select
                            value={row.original.workInBank}
                            onValueChange={(value) => updateField(row.original.id, "workInBank", value)}
                            disabled={!isEditing}
                        >
                            <SelectTrigger className="w-full h-9 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/50 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default min-w-[100px]">
                                <SelectValue placeholder="No" />
                            </SelectTrigger>
                            <SelectContent>
                                {workOptions.map((option) => (
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
                accessorKey: "edpNo",
                header: "EDP No",
                cell: ({ row }) => {
                    const isEditing = editingRowIds[row.original.id];
                    return (
                        <Input
                            value={row.original.edpNo}
                            onChange={(e) => updateField(row.original.id, "edpNo", e.target.value)}
                            disabled={!isEditing}
                            placeholder="-"
                            className="h-9 px-3 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/50 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default font-medium text-center min-w-[80px]"
                        />
                    );
                },
            },
            {
                accessorKey: "fullname",
                header: "Fullname",
                cell: ({ row }) => {
                    const isEditing = editingRowIds[row.original.id];
                    return (
                        <Input
                            value={row.original.fullname}
                            onChange={(e) => updateField(row.original.id, "fullname", e.target.value)}
                            disabled={!isEditing}
                            placeholder="FULLNAME"
                            className="h-9 px-3 border-[#EAE6F3] dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white rounded-lg disabled:opacity-100 disabled:bg-[#FAF9FC] dark:disabled:bg-zinc-900/50 disabled:text-gray-800 dark:disabled:text-gray-200 disabled:cursor-default font-medium uppercase min-w-[180px]"
                        />
                    );
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const isEditing = editingRowIds[row.original.id];
                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => toggleEdit(row.original.id)}
                                className={`h-8 w-8 rounded-lg border transition-all ${isEditing
                                    ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
                                    : "text-yellow-600 hover:text-yellow-600"
                                    }`}
                            >
                                {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => deleteMember(row.original.id)}
                                className="h-8 w-8 rounded-lg text-red-700 hover:text-red-700 transition-all"
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
        data: draftMembers,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] md:max-w-6xl rounded-sm p-4 overflow-hidden flex flex-col max-h-[90vh] bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800">
                <DialogHeader className="flex flex-col gap-2 border-b border-gray-100 dark:border-zinc-800 pb-4 mb-4">
                    <div>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Family Details</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-1">
                    <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                        <DataTable
                            table={table}
                            isLoading={false}
                            isError={false}
                            columnCount={columns.length}
                            errorMessage="No Data Found"
                            className="w-full"
                            emptyState={
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No family members added yet.</p>
                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={addNewMember}
                                        className="text-theme font-semibold mt-1 hover:text-theme/80"
                                    >
                                        Add your first member
                                    </Button>
                                </div>
                            }
                        />
                    </div>

                </div>
                <div className="mt-4 flex justify-between items-center pb-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addNewMember}
                        className="border-theme text-theme hover:bg-theme/5 hover:text-theme rounded-xl px-4 py-2 h-10 font-semibold flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4 stroke-[3px]" />
                        Add New Member
                    </Button>
                </div>

                <DialogFooter className="justify-end gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="rounded-lg px-4 h-10 font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveChanges}
                        className="bg-theme hover:bg-theme/90 text-white shadow-sm rounded-lg px-5 h-10 font-medium"
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}




