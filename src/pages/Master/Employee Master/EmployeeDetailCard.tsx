import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'

// EmployeeDetail defines the properties expected by the EmployeeDetailCard component.
export interface EmployeeDetail {
  code?: string
  name?: string
  designation?: string
  department?: string
  doj?: string
  pfUanNo?: string
  location?: string
  imageUrl?: string
}

interface EmployeeDetailCardProps {
  employee?: EmployeeDetail
}

// EmployeeDetailCard is a card component that displays key employee details 
// such as Employee Code, Department, Designation, Date of Joining, PF/UAN No, and Location 
// side-by-side with the employee's avatar, matching the horizontal summary layout.
export default function EmployeeDetailCard({ employee = {} }: EmployeeDetailCardProps) {
  const {
    code = 'EMP000245',
    name = 'Rohan Mehta',
    designation = 'Manager',
    department = 'Human Resources',
    doj = '15/06/2018',
    pfUanNo = '100245786541',
    location = 'Ahmedabad',
    imageUrl,
  } = employee;

  const details = [
    {
      label: 'Emp. Code',
      value: code,
    },
    {
      label: 'Department',
      value: department,
    },
    {
      label: 'Designation',
      value: designation,
    },
    {
      label: 'DOJ',
      value: doj,
    },
    {
      label: 'PF / UAN No.',
      value: pfUanNo,
    },
    {
      label: 'Location',
      value: location,
    },
  ];

  // Get initials for fallback avatar text
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    // Card uses default shadcn styling without manual background colors
    <Card className="rounded-md border dark:border-gray-800 py-0">
      {/* Container maintains the required 16px (p-4) padding and gap-4 spacing */}
      <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Avatar component uses custom rounded-xl to render as a rounded square */}
        <Avatar className="h-16 w-16 rounded-xl after:rounded-xl shrink-0">
          <AvatarImage src={imageUrl} alt={name} className="object-cover rounded-xl" />
          <AvatarFallback className="rounded-xl text-purple-600 dark:text-purple-400">
            {initials || <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>

        {/* Details Wrapper container */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Employee Name */}
          <h2 className="text-lg font-bold text-[#202C4B] dark:text-white leading-none">
            {name}
          </h2>

          {/* Grid column sections separated by border dividers */}
          <div className="text-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">{detail.label}</span>
                <span className="text-center text-gray-400">:</span>
                <span className="font-semibold text-[#202C4B] dark:text-gray-200">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
