import React from "react";
import { Button } from "./ui/button";

interface PaginationProps {
    pageIndex: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    isNextDisabled: boolean;
}

export default function Pagination({ pageIndex, setPageIndex, isNextDisabled }: PaginationProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
                    disabled={pageIndex === 0}
                >
                    Prev
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPageIndex((p) => p + 1)}
                    disabled={isNextDisabled}
                    className="ml-2"
                >
                    Next
                </Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {pageIndex + 1}
            </div>
        </div>
    );
}
