import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowUp, CircleAlert } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

import LottieComponent from "lottie-react";
import coins from "@/animation/lottie/coins.json";

// Resolve CommonJS vs ESM default import mismatch for lottie-react
const Lottie = (LottieComponent as unknown as { default?: typeof LottieComponent }).default || LottieComponent;


type TCardFilter = 'thisWeek' | 'thisMonth' | 'thisYear';

interface AttendanceItem {
    name: string
    value: number
    color: string
    label: string
    [key: string]: string | number
}

const dummyData = {
    PayrollSummaryDto: [
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

// LoadingSkeleton renders a skeleton loader matching the Payroll Summary card content layout
const LoadingSkeleton = ({ isLg, isXl }: { isLg: boolean; isXl: boolean }) => {
    return (
        <div className="grid grid-cols-12 gap-4 h-full animate-pulse w-full">
            <div className={`flex flex-col ${isLg ? 'col-span-8' : isXl ? 'col-span-7' : 'col-span-8'} max-sm:col-span-12`}>
                {/* Total Payroll Label Skeleton */}
                <Skeleton className="h-3.5 w-24 mb-2" />

                {/* Payroll Amount and Badge Skeleton */}
                <div className="flex gap-4 items-center mb-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                </div>

                {/* Sub-totals List Skeleton */}
                <div className="flex flex-col gap-2 w-full h-full justify-between">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Lottie Coins Animation Placeholder Skeleton */}
            <div className={`h-full flex items-end justify-center ${isLg ? 'col-span-4' : isXl ? 'col-span-5' : 'col-span-4'} max-sm:hidden pb-4`}>
                <Skeleton className="w-40 h-40 rounded-full" />
            </div>
        </div>
    )
}

// PayrollSummary displays the summary of total payroll including basic pay, allowances, deductions, net pay, and an animation visual
export default function PayrollSummary({ isLg, isXl, cardFilter, handleCardFilter }: { isLg: boolean, isXl: boolean, cardFilter: TCardFilter, handleCardFilter: (card: 'attendanceOverview' | 'payrollSummary' | 'leaveSummary', filter: TCardFilter) => void }) {
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

    const payrollData: AttendanceItem[] = useMemo(() => {
        return data?.PayrollSummaryDto?.length
            ? data.PayrollSummaryDto.map((item: { reasonCategory: string, count: number }) => ({
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
                <Select value={cardFilter} onValueChange={(value: TCardFilter) => {
                    handleCardFilter('payrollSummary', value)
                }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="thisWeek">This Week</SelectItem>
                        <SelectItem value="thisMonth">This Month</SelectItem>
                        <SelectItem value="thisYear">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="p-4 h-full flex flex-col justify-center">
                {isLoading ? (
                    <LoadingSkeleton isLg={isLg} isXl={isXl} />
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
                ) : payrollData.length === 0 ? (
                    <p className="text-md text-[#202C4B] dark:text-gray-100 text-center py-10">
                        No Payroll data available for this period.
                    </p>
                ) : (
                    <div className="grid grid-cols-12 gap-4 h-full">
                        <div className={`flex flex-col ${isLg ? 'col-span-8' : isXl ? 'col-span-7' : 'col-span-8'} max-sm:col-span-12`}>
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

                        <div className={`h-full flex items-end justify-center ${isLg ? 'col-span-4' : isXl ? 'col-span-5' : 'col-span-4'} max-sm:hidden`}>
                            <Lottie
                                animationData={coins}
                                loop={false}
                                className="w-52 h-auto"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
