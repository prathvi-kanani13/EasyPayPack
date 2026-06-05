import { useRef, useState, useEffect } from 'react'
import OverviewCards from './Cards/OverviewCards'
import EmployeeMovement from './Cards/EmployeeMovement'
import AttendanceOverview from './Cards/AttendanceOverview'
import PayrollSummary from './Cards/PayrollSummary';
import LeaveSummary from './Cards/LeaveSummary';
import EmployeeJoinings from './Cards/EmployeeJoinings';
import Announcements from './Cards/Announcements';
import Notifications from './Cards/Notifications';
// import Onboarding from './Cards/Onboarding';
import Preboarding from './Cards/Preboarding';
import UpcomingBirthdays from './Cards/UpcomingBirthdays';
import { DatePickerInput } from '@/components/DatePickerInput';
import moment from 'moment';

const Welcome = ({ userName, date, setDate }: { userName: string, date: string, setDate: (date: string) => void }) => {
    return (
        <div className="w-full flex items-center justify-between gap-4 flex-wrap">
            <div>
                <h1 className="text-2xl font-bold">Welcome Back, {userName}! 👋</h1>
                <p className="text-gray-500">Here's what happening in your organization today.</p>
            </div>
            <div className='flex flex-1 justify-end items-center'>
                <DatePickerInput
                    value={date}
                    onChange={setDate}
                    displayFormat='MMM dd, yyyy'
                    className="w-40 h-10 border-gray-300 dark:border-gray-600 rounded-md text-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                />
            </div>
        </div>
    )
}

type TCardFilter = 'thisMonth' | 'thisYear';
type TCardName = 'attendanceOverview' | 'payrollSummary' | 'leaveSummary';

// Dashboard is the main page component rendering the overview analytics.
export default function Dashboard() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState<number>(0);

    const breakpoints = {
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
    }

    const [cardFilters, setCardFilters] = useState<{
        attendanceOverview: TCardFilter,
        payrollSummary: TCardFilter,
        leaveSummary: TCardFilter,
    }>({
        attendanceOverview: 'thisMonth',
        payrollSummary: 'thisMonth',
        leaveSummary: 'thisMonth',
    });

    const handleCardFilter = (card: TCardName, filter: TCardFilter) => {
        setCardFilters((prev) => ({
            ...prev,
            [card]: filter,
        }));
    };

    useEffect(() => {
        if (!containerRef.current) return

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // get the bounding width of the content area
                setWidth(entry.contentRect.width)
            }
        })

        observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
        }
    }, [])

    const isMd = width >= breakpoints.md;
    const isLg = width >= breakpoints.lg;
    const isXl = width >= breakpoints.xl;

    const [date, setDate] = useState<string>(moment().format('DD-MM-YYYY'))

    return (
        // dashboard container
        <div ref={containerRef} className="flex flex-col gap-4">
            <Welcome
                userName="Admin"
                date={date}
                setDate={setDate}
            />

            <div className="bg-theme-secondary/40 py-2 px-4 rounded-md text-sm">Last login : 10 AM </div>

            <OverviewCards isLg={isLg} />

            <EmployeeMovement />

            <div className='grid grid-cols-12 gap-4'>
                <div className={`flex flex-col gap-4 ${isLg ? 'col-span-9' : isMd ? 'col-span-8' : 'col-span-12'}`}>
                    <div className='grid grid-cols-12 gap-4'>
                        <div className={isLg ? 'col-span-6' : 'col-span-12'}>
                            <AttendanceOverview cardFilter={cardFilters.attendanceOverview} handleCardFilter={handleCardFilter} />
                        </div>
                        <div className={isLg ? 'col-span-6' : 'col-span-12'}>
                            <PayrollSummary isLg={isLg} isXl={isXl} cardFilter={cardFilters.attendanceOverview} handleCardFilter={handleCardFilter} />
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-4'>
                        <div className={isLg ? 'col-span-5' : 'col-span-12'}>
                            <LeaveSummary cardFilter={cardFilters.attendanceOverview} handleCardFilter={handleCardFilter} />
                        </div>
                        <div className={isLg ? 'col-span-7' : 'col-span-12'}>
                            <EmployeeJoinings />
                        </div>
                    </div>
                </div>

                {/* Right column — absolute positioning prevents it from influencing grid row height */}
                <div className={`${isLg ? 'col-span-3 relative' : isMd ? 'col-span-4 relative' : 'col-span-12'}`}>
                    <div className={`flex flex-col gap-4 ${isMd ? 'absolute inset-0' : ''}`}>
                        <div className={isMd ? 'flex-55 min-h-0' : ''}><Announcements /></div>
                        <div className={isMd ? 'flex-45 min-h-0' : ''}><UpcomingBirthdays /></div>
                    </div>
                </div>

                {/* Bottom Row: Notifications, Onboarding, Pre-boarding */}
                <div className={`${isLg ? 'col-span-4' : isMd ? 'col-span-4' : 'col-span-12'} h-[380px]`}>
                    <Preboarding />
                </div>
                {/* <div className={`${isLg ? 'col-span-4' : isMd ? 'col-span-4' : 'col-span-12'} h-[380px]`}>
                    <Onboarding />
                </div> */}
                <div className={`${isLg ? 'col-span-4' : isMd ? 'col-span-4' : 'col-span-12'} h-[380px]`}>
                    <Notifications />
                </div>

            </div>
        </div>
    )
}
