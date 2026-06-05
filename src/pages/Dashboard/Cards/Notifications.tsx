import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, CalendarCheck, CircleAlert, Coins, ShieldAlert, TrendingUp } from 'lucide-react'

// LoadingSkeleton renders a skeleton loader matching the Notifications list layout
const LoadingSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 w-full animate-pulse p-4">
			{[...Array(3)].map((_, i) => (
				<div key={i} className="flex items-start gap-4">
					<Skeleton className="h-12 w-12 rounded-full shrink-0" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-3 w-5/6" />
						<Skeleton className="h-3 w-12" />
					</div>
					<Skeleton className="h-2 w-2 rounded-full mt-2 shrink-0" />
				</div>
			))}
		</div>
	)
}

type Types = 'leave' | 'payroll' | 'system' | 'performance' | 'general';

interface NotificationItem {
	title: string
	description: string
	time: string
	type: Types
}

const typeConfig = {
	leave: {
		icon: CalendarCheck,
		bg: 'bg-purple-50 dark:bg-purple-950/20',
		color: 'text-purple-600 dark:text-purple-400',
		dot: 'bg-purple-500'
	},
	payroll: {
		icon: Coins,
		bg: 'bg-emerald-50 dark:bg-emerald-950/20',
		color: 'text-emerald-600 dark:text-emerald-400',
		dot: 'bg-emerald-500'
	},
	system: {
		icon: ShieldAlert,
		bg: 'bg-red-50 dark:bg-red-950/20',
		color: 'text-red-600 dark:text-red-400',
		dot: 'bg-red-500'
	},
	performance: {
		icon: TrendingUp,
		bg: 'bg-blue-50 dark:bg-blue-950/20',
		color: 'text-blue-600 dark:text-blue-400',
		dot: 'bg-blue-500'
	},
	general: {
		icon: Bell,
		bg: 'bg-gray-50 dark:bg-gray-800/40',
		color: 'text-gray-600 dark:text-gray-400',
		dot: 'bg-gray-500'
	}
}

const dummyData: {
	notificationsDto: NotificationItem[]
} = {
	notificationsDto: [
		{
			title: "Leave Approved",
			description: "Your casual leave request for June 10 has been approved by Admin.",
			time: "10m ago",
			type: 'leave'
		},
		{
			title: "Payslip Generated",
			description: "Your payslip for the month of May 2026 has been generated and is ready for download.",
			time: "2h ago",
			type: 'payroll'
		},
		{
			title: "System Update Scheduled",
			description: "EasyPayPack will undergo scheduled maintenance from 2 AM to 4 AM Sunday.",
			time: "1d ago",
			type: 'system'
		}
	]
}

// Notifications displays a list of recently posted notifications with categorized icons and read status indicators
export default function Notifications() {
	const { data, isLoading, isError } = { data: dummyData, isLoading: false, isError: false }

	const notificationsData: NotificationItem[] = data.notificationsDto ?? [];

	return (
		<Card className="w-full h-full dark:bg-background border dark:border-gray-700 rounded-md gap-0 py-0">
			<CardHeader className="flex flex-row items-center justify-between border-b border-[#E5E7EB] dark:border-gray-700 p-4 shrink-0">
				<CardTitle className="text-[#202C4B] dark:text-white text-lg font-semibold">
					Notifications
				</CardTitle>
				<Button
					variant="link"
					className='px-0 text-theme decoration-theme-secondary'
				>
					View All
				</Button>
			</CardHeader>

			<CardContent className="p-0 flex-1 min-h-0 flex flex-col justify-start">
				{isLoading ? (
					<LoadingSkeleton />
				) : isError ? (
					<div className="flex flex-col items-center justify-center py-10 gap-2 p-4">
						<div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
							<span className="text-red-500 text-xl font-bold">
								<CircleAlert />
							</span>
						</div>
						<p className="text-sm font-semibold text-red-500">Error loading data</p>
						<p className="text-xs text-muted-foreground">Please try again later</p>
					</div>
				) : notificationsData.length === 0 ? (
					<p className="text-md text-[#202C4B] dark:text-gray-100 text-center py-10 p-4">
						No notifications available for this period.
					</p>
				) : (
					<ScrollArea className="flex-1 w-full min-h-0">
						<div className="flex flex-col p-4 gap-4">
							{notificationsData.map((item, index) => {
								const config = typeConfig[item.type] || typeConfig.general
								const IconComponent = config.icon

								return (
									<div key={index} className="flex items-start gap-2">
										<div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
											<IconComponent className={`h-5 w-5 ${config.color}`} />
										</div>
										<div className="flex-1 min-w-0">
											<h4 className="text-sm font-semibold text-[#202C4B] dark:text-white truncate">
												{item.title}
											</h4>
											<p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
												{item.description}
											</p>
											<span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
												{item.time}
											</span>
										</div>
									</div>
								)
							})}
						</div>
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	)
}
