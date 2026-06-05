import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CircleAlert, Calendar } from 'lucide-react'

// LoadingSkeleton renders a skeleton loader matching the Preboarding list layout
const LoadingSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 w-full animate-pulse p-4">
			{[...Array(3)].map((_, i) => (
				<div key={i} className="flex flex-col gap-2">
					<div className="flex justify-between items-center">
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-4 w-16 rounded-full" />
					</div>
					<Skeleton className="h-3 w-5/6" />
					<Skeleton className="h-3 w-24" />
				</div>
			))}
		</div>
	)
}

type Stages = 'offer_released' | 'tech_setup' | 'form_submitted' | 'docs_uploaded' | 'completed';

interface PreboardingItem {
	name: string
	role: string
	stage: Stages
	joiningDate: string
	daysToJoin: number
}

const stageConfig = {
	offer_released: {
		label: "Offer Released",
		bg: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-950/50",
	},
	tech_setup: {
		label: "Tech Setup Pending",
		bg: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-950/50",
	},
	form_submitted: {
		label: "Form Submitted",
		bg: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-950/50",
	},
	docs_uploaded: {
		label: "Docs Uploaded",
		bg: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-950/50",
	},
	completed: {
		label: "Pre-boarded",
		bg: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-950/50",
	}
}

const dummyData: {
	preboardingDto: PreboardingItem[]
} = {
	preboardingDto: [
		{
			name: "Aditya Sen",
			role: "Marketing Manager",
			stage: 'offer_released',
			joiningDate: "June 15, 2026",
			daysToJoin: 10
		},
		{
			name: "Riya Verma",
			role: "UX Analyst",
			stage: 'tech_setup',
			joiningDate: "June 10, 2026",
			daysToJoin: 5
		},
		{
			name: "Karan Johar",
			role: "Business Analyst",
			stage: 'form_submitted',
			joiningDate: "June 8, 2026",
			daysToJoin: 3
		},
	]
}

// Preboarding displays candidates in the pre-joining phase with progress badges and countdowns
export default function Preboarding() {
	const { data, isLoading, isError } = { data: dummyData, isLoading: false, isError: false }

	const preboardingData: PreboardingItem[] = data.preboardingDto ?? [];

	return (
		<Card className="w-full h-full dark:bg-background border dark:border-gray-700 rounded-md gap-0 py-0">
			<CardHeader className="flex flex-row items-center justify-between border-b border-[#E5E7EB] dark:border-gray-700 p-4 shrink-0">
				<CardTitle className="text-[#202C4B] dark:text-white text-lg font-semibold flex items-center gap-2">
					Pre-boarding
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
				) : preboardingData.length === 0 ? (
					<p className="text-md text-[#202C4B] dark:text-gray-100 text-center py-10 p-4">
						No pre-boarding activities.
					</p>
				) : (
					<ScrollArea className="flex-1 w-full min-h-0">
						<div className="flex flex-col p-4 gap-4">
							{preboardingData.map((item, index) => {
								const config = stageConfig[item.stage] || stageConfig.offer_released

								return (
									<div key={index} className="flex flex-col gap-1.5 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
										<div className="flex justify-between items-start">
											<div>
												<h4 className="text-sm font-semibold text-[#202C4B] dark:text-white">
													{item.name}
												</h4>
												<p className="text-xs text-gray-400 dark:text-gray-500">
													{item.role}
												</p>
											</div>
											<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.bg}`}>
												{config.label}
											</span>
										</div>
										<div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
											<span className="flex items-center gap-1">
												<Calendar className="h-3.5 w-3.5 text-gray-400" />
												Joining {item.joiningDate}
											</span>
											<span className={`font-semibold ${item.daysToJoin <= 3 ? 'text-red-500 font-bold' : 'text-gray-600 dark:text-gray-350'}`}>
												{item.daysToJoin} {item.daysToJoin === 1 ? 'day' : 'days'} left
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
