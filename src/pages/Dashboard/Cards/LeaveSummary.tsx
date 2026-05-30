import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { CircleAlert } from 'lucide-react'
import moment from 'moment'


// getProgressBarColor maps a leave type name to its respective indicator background color
const getProgressBarColor = (name: string) => {
  switch (name) {
    case 'Casual Leave':
      return 'bg-violet-500 dark:bg-violet-600'
    case 'Sick Leave':
      return 'bg-emerald-500 dark:bg-emerald-600'
    case 'Earned Leave':
      return 'bg-amber-500 dark:bg-amber-600'
    case 'Maternity Leave':
      return 'bg-pink-500 dark:bg-pink-600'
    case 'Paternity Leave':
      return 'bg-blue-500 dark:bg-blue-600'
    default:
      return 'bg-primary'
  }
}

// LoadingSkeleton renders a skeleton loader matching the Leave Summary card content layout
const LoadingSkeleton = ({ isCompact }: { isCompact: boolean }) => {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      {[...Array(5)].map((_, i) => (
        isCompact ? (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-10" />
            </div>
            <div className="w-full">
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          </div>
        ) : (
          <div key={i} className="flex items-center gap-4">
            <div className="w-32 shrink-0">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex-1 min-w-0">
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
            <div className="w-16 shrink-0 flex justify-end">
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        )
      ))}
    </div>
  )
}

interface LeaveSummaryItem {
  name: string
  value: number
  color: string
  total: number
}

const dummyData = {
  leaveSummaryDto: [
    {
      name: "Casual Leave",
      value: 12,
      total: 48,
      color: '[var(--theme-secondary)]'
    },
    {
      name: "Sick Leave",
      value: 8,
      total: 24,
      color: 'green-300'
    },
    {
      name: "Earned Leave",
      value: 32,
      total: 96,
      color: 'yellow-300'
    },
    {
      name: "Maternity Leave",
      value: 3,
      total: 12,
      color: 'pink-300'
    },
    {
      name: "Paternity Leave",
      value: 1,
      total: 6,
      color: 'blue-300'
    },

  ]
}

// LeaveSummary displays a list of different leave types with progress bars representing used vs total allowed leaves
export default function LeaveSummary() {
  const { data, isLoading, isError } = { data: dummyData, isLoading: false, isError: false }
  const containerRef = useRef<HTMLDivElement>(null)
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Space occupied by layout items other than progress bar:
        // Name (128px) + Value (64px) + 2x gap-4 (32px) = 224px.
        // If content width < 424px, the progress bar width falls below 200px.
        setIsCompact(entry.contentRect.width < 424)
      }
    })

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  const leaveData: LeaveSummaryItem[] = data.leaveSummaryDto ?? [];

  return (
    <Card className="w-full h-full dark:bg-background border dark:border-gray-700 rounded-md gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between border-b border-[#E5E7EB] dark:border-gray-700 p-4">
        <CardTitle className="text-[#202C4B] dark:text-white text-lg font-semibold">
          Leave Summary
        </CardTitle>
        <Button
          variant="outline"
          className="text-[#202C4B] dark:text-white border-[#E5E7EB] dark:border-gray-600 text-md px-6 py-2 hover:bg-[#F5F7FA] dark:hover:bg-gray-700"
        >
          {moment().format('YYYY')}
        </Button>
      </CardHeader>

      <CardContent ref={containerRef} className="p-4 h-full flex flex-col justify-start">
        {isLoading ? (
          <LoadingSkeleton isCompact={isCompact} />
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
        ) : leaveData.length === 0 ? (
          <p className="text-md text-[#202C4B] dark:text-gray-100 text-center py-10">
            No leave data available for this period.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {leaveData.map((item, index) => {
              const progressPercentage = item.total > 0 ? (item.value / item.total) * 100 : 0
              return isCompact ? (
                <div key={index} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span className="truncate">{item.name}</span>
                    <span className="whitespace-nowrap">{item.value} / {item.total}</span>
                  </div>
                  <div className="w-full">
                    <Progress
                      value={progressPercentage}
                      indicatorClassName={getProgressBarColor(item.name)}
                    />
                  </div>
                </div>
              ) : (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-32 shrink-0 text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                    {item.name}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Progress
                      value={progressPercentage}
                      indicatorClassName={getProgressBarColor(item.name)}
                    />
                  </div>
                  <div className="w-16 shrink-0 text-right text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {item.value} / {item.total}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
