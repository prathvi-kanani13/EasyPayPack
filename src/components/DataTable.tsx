import { flexRender, type Table } from "@tanstack/react-table";
import { Skeleton } from "./ui/skeleton";
import EmptyState from "../animation/EmptyState";
import { cn } from "../lib/utils";

interface DataTableProps<TData> {
    table: Table<TData>;
    isLoading: boolean;
    isError?: boolean;
    columnCount: number;
    errorMessage?: string;
    emptyState?: React.ReactNode;
    className?: string;
    onRowClick?: (row: TData) => void;
    showHeader?: boolean;
}

// A reusable and accessible table component with built-in loading and error states
export function DataTable<TData>({
    table,
    isLoading,
    isError = false,
    columnCount,
    errorMessage = "Failed to load data.",
    emptyState = <EmptyState />,
    className,
    showHeader = true,
}: DataTableProps<TData>) {
    return (
        <div className={cn("overflow-x-auto", className)}>
            <table className="w-full table-auto border-collapse">
                {showHeader && (
                    <thead className="text-left text-xs bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 uppercase font-bold tracking-wider">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((h) => (
                                    <th key={h.id} className="px-4 py-3 border-b dark:border-gray-700">
                                        {flexRender(h.column.columnDef.header, h.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                )}
                <tbody className="divide-y dark:divide-gray-800">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {Array.from({ length: columnCount }).map((_, colIndex) => (
                                    <td key={colIndex} className="px-4 py-4">
                                        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : isError ? (
                        <tr>
                            <td colSpan={columnCount} className="py-20 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-destructive font-medium">{errorMessage}</p>
                                </div>
                            </td>
                        </tr>
                    ) : table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columnCount} className="py-10">
                                {emptyState}
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-4 align-top text-sm text-gray-700 dark:text-gray-300">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
