/* eslint-disable react-refresh/only-export-components */
import React, { useState, useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import Editor from '@monaco-editor/react';
import { Parser } from 'node-sql-parser';

export const tableWiseFields: Record<string, string[]> = {
    'Employee': ['emp_id', 'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country', 'date_of_joining', 'date_of_birth', 'basic_salary', 'net_pay', 'grade'],
    'Department': ['dept_name', 'dept_code', 'dept_head'],
    'Designation': ['designation_name', 'designation_code', 'designation_level'],
};

export const ALL_AVAILABLE_FIELDS = Object.values(tableWiseFields).flat();

export default function AvailableFields() {
    const [queryMode, setQueryMode] = useState<'table' | 'query'>('table');
    const [connection, setConnection] = useState('');
    const [selectedTable, setSelectedTable] = useState('Employee');
    const [queryName, setQueryName] = useState('');
    const [sqlQuery, setSqlQuery] = useState('-- Write your SQL query here\nSELECT * FROM employee_master');
    const [validationMessage, setValidationMessage] = useState('');

    const [fields, setFields] = useState<string[]>([]);

    const parser = useMemo(() => new Parser(), []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (queryMode === 'table') {
            setFields(tableWiseFields[selectedTable] || []);
        } else {
            if (!sqlQuery.trim()) {
                setValidationMessage('Error: Query cannot be empty.');
                setFields([]);
                return;
            }

            try {
                const ast = parser.astify(sqlQuery);

                // node-sql-parser returns an array for multiple statements, or a single object
                const statements = Array.isArray(ast) ? ast : [ast];

                // Check if all statements are SELECT
                const invalidStatement = statements.find(s => s.type !== 'select');

                if (invalidStatement) {
                    setValidationMessage(`Error: ${invalidStatement.type.toUpperCase()} operations are not allowed. Only SELECT is permitted.`);
                    setFields([]);
                    return;
                }

                setValidationMessage('Query validated successfully.');
                // Mocking the result of a custom query
                setFields(['employee_name', 'employee_id', 'department', 'basic_salary', 'net_salary']);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setValidationMessage(`Error: ${errorMessage}`);
                setFields([]);
            }
        }
    };

    return (
        <div className='flex flex-col gap-6 p-2'>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Data Source & Query
                </h4>

                <RadioGroup
                    defaultValue={queryMode}
                    onValueChange={(val) => {
                        setQueryMode(val as 'table' | 'query');
                        setValidationMessage('');
                    }}
                    className="flex flex-col gap-2 mb-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="table" id="use-table" />
                        <Label htmlFor="use-table" className="cursor-pointer">Use Table</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="query" id="use-query" />
                        <Label htmlFor="use-query" className="cursor-pointer">Use Custom Query</Label>
                    </div>
                </RadioGroup>

                {queryMode === 'table' ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Label>Database Connection</Label>
                            <Select value={connection} onValueChange={setConnection}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select Database" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="payroll_db">Payroll DB</SelectItem>
                                    <SelectItem value="hr_db">HR DB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Table</Label>
                            <Select value={selectedTable} onValueChange={setSelectedTable}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select Table" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Employee">Employee</SelectItem>
                                    <SelectItem value="Department">Department</SelectItem>
                                    <SelectItem value="Designation">Designation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Label>Query Name</Label>
                            <Input
                                value={queryName}
                                onChange={(e) => setQueryName(e.target.value)}
                                placeholder="e.g., Employee Salary Query"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Database Connection</Label>
                            <Select value={connection} onValueChange={setConnection}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select Database" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="payroll_db">Payroll DB</SelectItem>
                                    <SelectItem value="hr_db">HR DB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>SQL Editor</Label>
                            <div className="h-[200px] border rounded-md overflow-hidden bg-[#1e1e1e]">
                                <Editor
                                    height="100%"
                                    defaultLanguage="sql"
                                    theme="vs-dark"
                                    value={sqlQuery}
                                    onChange={(value) => setSqlQuery(value || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 12,
                                        lineNumbers: 'off',
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: { top: 10, bottom: 10 },
                                        wordWrap: 'on',
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            {validationMessage && <div className={validationMessage.includes('Error') ? 'text-red-500 border-red-500' : 'text-green-600 border-green-200'}>{validationMessage}</div>}
                        </div>
                    </div>
                )}

                <Button type="submit" className="w-full bg-theme hover:bg-[#e65c00] text-white mt-4">
                    Submit
                </Button>
            </form>

            <Separator />

            <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Available Fields
                </h4>
                <div className="flex flex-wrap gap-2">
                    {fields.length > 0 ? (
                        fields.map((field, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold  border whitespace-nowrap">
                                {field}
                            </span>
                        ))
                    ) : (
                        <div className="text-xs text-muted-foreground italic w-full text-center py-6 border border-dashed rounded-md bg-muted/30">
                            No fields available
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

