import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowUp, CircleAlert } from 'lucide-react'
import moment from 'moment'
import { Badge } from '@/components/ui/badge'

import LottieComponent from "lottie-react";
import coins from "@/animation/lottie/coins.json";

// Resolve CommonJS vs ESM default import mismatch for lottie-react
const Lottie = (LottieComponent as unknown as { default?: typeof LottieComponent }).default || LottieComponent;


interface AttendanceItem {
    name: string
    value: number
    color: string
    label: string
    [key: string]: string | number
}

const dummyData = {
    attendanceDashboardStatDto: [
        {
            reasonCategory: "Present",
            count: 100,
        },
        {
            reasonCategory: "Absent",
            count: 16,
        },
        {
            reasonCategory: "Late",
            count: 22,
        },
        {
            reasonCategory: "Half Day",
            count: 7,
        },
    ]
}

const LoadingSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-pulse w-full overflow-hidden">
            {/* Chart Skeleton */}
            <div className="flex flex-col items-center gap-4 min-w-[200px]">
                <div className="relative w-[170px] h-[170px]">
                    <div className="absolute inset-0 rounded-full border-15 border-gray-300 dark:border-gray-700" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Skeleton className="h-6 w-12 mb-1" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full px-2">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                </div>
            </div>

            <Separator orientation="vertical" className="hidden lg:block h-64 opacity-30" />

            {/* List Skeleton */}
            <div className="flex-1 w-full pt-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                            <div className="flex items-center gap-2.5">
                                <Skeleton className="h-2 w-2 rounded-full shrink-0" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-4 w-8 rounded bg-gray-100 dark:bg-gray-800" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function PayrollSummary({ isLg, isXl }: { isLg: boolean, isXl: boolean }) {
    const { data, isLoading, isError } = { data: dummyData, isLoading: false, isError: false }
    // const { data, isLoading, isError } = useGetDashboardDetails({ fromDate, toDate })

    const formatValue = (value: number) => {
        return "₹" + value.toLocaleString("en-IN");
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            "Present": "var(--theme)",
            "Absent": "#ef4444",
            "Late": "#f59e0b",
            "Half Day": "var(--theme-secondary)",
        };
        return colors[status] || "var(--theme)";
    };

    const attendanceData: AttendanceItem[] = useMemo(() => {
        return data?.attendanceDashboardStatDto?.length
            ? data.attendanceDashboardStatDto.map((item: { reasonCategory: string, count: number }) => ({
                name: item.reasonCategory,
                value: Number(item.count) || 0,
                label: item.reasonCategory,
                color: getStatusColor(item.reasonCategory),
            }))
            : [];
    }, [data]);

    const subTotals = [
        { title: 'Basic Pay', amount: formatValue(1545000) },
        { title: 'Allowances', amount: formatValue(425300) },
        { title: 'Deductions', amount: formatValue(185980) },
        { title: 'Net Pay', amount: formatValue(2284320), isTotal: true },
    ]

    return (
        <Card className="w-full h-full dark:bg-background border dark:border-gray-700 rounded-md gap-0 py-0">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#E5E7EB] dark:border-gray-700 p-4">
                <CardTitle className="text-[#202C4B] dark:text-white text-lg font-semibold">
                    Payroll Summary
                </CardTitle>
                <Button
                    variant="outline"
                    className="text-[#202C4B] dark:text-white border-[#E5E7EB] dark:border-gray-600 text-md px-6 py-2 hover:bg-[#F5F7FA] dark:hover:bg-gray-700"
                >
                    {moment().format('YYYY')}
                </Button>
            </CardHeader>

            <CardContent className="p-4 h-full flex flex-col justify-center">
                {isLoading ? (
                    <LoadingSkeleton />
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                            <span className="text-red-500 text-xl font-bold">
                                <CircleAlert />
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-red-500">Error loading data</p>
                        <p className="text-xs text-muted-foreground">Please try again later</p>
                    </div>
                ) : attendanceData.length === 0 ? (
                    <p className="text-md text-[#202C4B] dark:text-gray-100 text-center py-10">
                        No Payroll data available for this period.
                    </p>
                ) : (
                    <div className="grid grid-cols-12 gap-4 h-full">
                        <div className={`flex flex-col ${isLg ? 'col-span-8' : isXl ? 'col-span-7' : 'col-span-7'} max-sm:col-span-12`}>
                            <div className="text-xs font-semibold text-[#8f94ac] dark:text-gray-400">
                                Total Payroll
                            </div>
                            <div className='flex gap-4 items-center mb-4'>
                                <div className="text-2xl font-bold tracking-tight text-[#242664] dark:text-white mt-0.5">{formatValue(2458320)}</div>
                                <Badge className='bg-green-600/30 text-green-600 text-sm'>
                                    <ArrowUp size={14} /> 8.5%
                                </Badge>
                            </div>

                            <div className='flex flex-col gap-2 w-full h-full justify-between'>
                                {subTotals.map((item, index) => (
                                    <div key={index} className='flex items-center justify-between'>
                                        <div className={`text-sm font-semibold ${item.isTotal ? 'text-theme font-bold' : 'text-gray-700 dark:text-gray-400'}`}>{item.title}</div>
                                        <div className='text-sm font-semibold text-gray-700 dark:text-gray-400'>{item.amount}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`h-full flex items-end justify-center ${isLg ? 'col-span-4' : isXl ? 'col-span-5' : 'col-span-5'} max-sm:hidden`}>
                            <Lottie
                                animationData={coins}
                                loop={false}
                                className="w-52 h-full"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
