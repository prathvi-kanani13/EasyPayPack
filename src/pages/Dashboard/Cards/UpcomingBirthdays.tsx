import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleAlert } from 'lucide-react'
import moment from 'moment'
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/getInitials'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DataTable } from '@/components/DataTable'


interface UpcomingBirthdaysItem {
  name: string
  designation: string
  date: string
  imageUrl?: string
}

const dummyData = {
  upcomingBirthdaysDto: [
    {
      name: "Riya Sharma",
      designation: "UI/UX Designer",
      date: "May 25"
    },
    {
      name: "Amit Kumar",
      designation: "Sales Executive",
      date: "May 28"
    },
    {
      name: "Nehal Verma",
      designation: "HR Manager",
      date: "May 30"
    },
    {
      name: "Vikram Singh",
      designation: "Senior Developer",
      date: "June 2"
    },
    {
      name: "Anjali Jha",
      designation: "Data Analyst",
      date: "June 5"
    }
  ]
}

export default function UpcomingBirthdays() {
  const { data, isLoading, isError } = { data: dummyData, isLoading: false, isError: false };

  const upcomingBirthdaysData: UpcomingBirthdaysItem[] = data.upcomingBirthdaysDto ?? [];

  const columns = useMemo<ColumnDef<UpcomingBirthdaysItem>[]>(
    () => [
      {
        id: "employee",
        header: "Employee",
        cell: ({ row }) => {
          const emp = row.original
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={emp.imageUrl} alt={emp.name} className="object-cover" />
                <AvatarFallback className="font-semibold text-sm">
                  {getInitials(emp.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-bold text-[#202C4B] dark:text-white text-sm">
                  {emp.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {emp.designation}
                </span>
              </div>
            </div>
          )
        }
      },
      {
        accessorKey: "date",
        header: () => <div className="text-right">Joining Date</div>,
        cell: ({ row }) => (
          <div className="text-right text-sm text-gray-600 dark:text-gray-300 font-medium">
            {row.original.date}
          </div>
        )
      }
    ],
    []
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: upcomingBirthdaysData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card className="w-full h-full dark:bg-background border dark:border-gray-700 rounded-md gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between border-b border-[#E5E7EB] dark:border-gray-700 p-4">
        <CardTitle className="text-[#202C4B] dark:text-white text-lg font-semibold">
          Upcoming Birthdays
        </CardTitle>
        <Button
          variant="outline"
          className="text-[#202C4B] dark:text-white border-[#E5E7EB] dark:border-gray-600 text-md px-6 py-2 hover:bg-[#F5F7FA] dark:hover:bg-gray-700"
        >
          {moment().format('YYYY')}
        </Button>
      </CardHeader>

      <CardContent className="p-0 h-full flex flex-col justify-start">
        {isError ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <span className="text-red-500 text-xl font-bold">
                <CircleAlert />
              </span>
            </div>
            <p className="text-sm font-semibold text-red-500">Error loading data</p>
            <p className="text-xs text-muted-foreground">Please try again later</p>
          </div>
        ) : (
          <ScrollArea className="flex-1 w-full min-h-0">
            <DataTable
              table={table}
              isLoading={isLoading}
              isError={isError}
              columnCount={columns.length}
              showHeader={false}
              errorMessage="Failed to load upcoming birthdays."
            />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
