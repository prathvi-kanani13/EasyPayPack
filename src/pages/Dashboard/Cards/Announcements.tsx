import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CircleAlert, ClipboardList, Megaphone, PartyPopper } from 'lucide-react'
import moment from 'moment'

// LoadingSkeleton renders a skeleton loader matching the Announcements list layout
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

type Types = 'general' | 'policy' | 'recreation';

interface AnnouncementItem {
	title: string
	description: string
	time: string
	type: Types
}

const typeConfig = {
	general: {
		icon: Megaphone,
		bg: 'bg-blue-50 dark:bg-blue-950/20',
		color: 'text-blue-600 dark:text-blue-400',
		dot: 'bg-blue-500'
	},
	policy: {
		icon: ClipboardList,
		bg: 'bg-emerald-50 dark:bg-emerald-950/20',
		color: 'text-emerald-600 dark:text-emerald-400',
		dot: 'bg-emerald-500'
	},
	recreation: {
		icon: PartyPopper,
		bg: 'bg-amber-50 dark:bg-amber-950/20',
		color: 'text-amber-600 dark:text-amber-400',
		dot: 'bg-amber-500'
	}
}

const dummyData: {
	announcementsDto: AnnouncementItem[]
} = {
	announcementsDto: [
		{
			title: "Office Closed on May 27",
			description: "The office will remain closed on Monday, 27th May on account of Memorial Day.",
			time: "Today",
			type: 'general'
		},
		{
			title: "New Leave Policy",
			description: "Please review the updated leave policy effective from June 1, 2024.",
			time: "2 days ago",
			type: 'policy'
		},
		{
			title: "Team Outing",
			description: "Team outing scheduled on June 15, 2024. Get ready!",
			time: "5 days ago",
			type: 'recreation'
		},
	]
}

// Announcements displays a list of recently posted announcements with categorized icons and read status indicators
export default function Announcements() {
	const { data, isLoading, isError } = { data: dummyData, isLoading: false, isError: false }

	const announcementsData: AnnouncementItem[] = data.announcementsDto ?? [];

	return (
		<Card className="w-full h-full min-h-70 dark:bg-background border dark:border-gray-700 rounded-md gap-0 py-0 flex flex-col overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between border-b border-[#E5E7EB] dark:border-gray-700 p-4 shrink-0">
				<CardTitle className="text-[#202C4B] dark:text-white text-lg font-semibold">
					Announcements
				</CardTitle>
				<Button
					variant="outline"
					className="text-[#202C4B] dark:text-white border-[#E5E7EB] dark:border-gray-600 text-md px-6 py-2 hover:bg-[#F5F7FA] dark:hover:bg-gray-700"
				>
					{moment().format('YYYY')}
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
				) : announcementsData.length === 0 ? (
					<p className="text-md text-[#202C4B] dark:text-gray-100 text-center py-10 p-4">
						No announcements available for this period.
					</p>
				) : (
					<ScrollArea className="flex-1 w-full min-h-0">
						<div className="flex flex-col p-4 gap-4">
							{announcementsData.map((item, index) => {
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
