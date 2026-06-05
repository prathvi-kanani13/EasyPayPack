import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CircleAlert, Award } from 'lucide-react'

// LoadingSkeleton renders a skeleton loader matching the Onboarding list layout
const LoadingSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 w-full animate-pulse p-4">
			{[...Array(3)].map((_, i) => (
				<div key={i} className="flex flex-col gap-2">
					<div className="flex justify-between items-center">
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-4 w-12" />
					</div>
					<Skeleton className="h-3 w-5/6" />
					<Skeleton className="h-2 w-full rounded-full" />
				</div>
			))}
		</div>
	)
}

interface OnboardingItem {
	name: string
	designation: string
	progress: number
	currentStep: string
}

const dummyData: {
	onboardingDto: OnboardingItem[]
} = {
	onboardingDto: [
		{
			name: "Rahul Sharma",
			designation: "Product Designer",
			progress: 75,
			currentStep: "Asset Allocation"
		},
		{
			name: "Sneha Gupta",
			designation: "QA Engineer",
			progress: 50,
			currentStep: "Document Verification"
		},
		{
			name: "Vikram Malhotra",
			designation: "DevOps Specialist",
			progress: 90,
			currentStep: "Final Onboarding Sign-off"
		},
	]
}

// Onboarding displays onboarding progress for new hires with progress bars and step tracking
export default function Onboarding() {
	const { data, isLoading, isError } = { data: dummyData, isLoading: false, isError: false }

	const onboardingData: OnboardingItem[] = data.onboardingDto ?? [];

	return (
		<Card className="w-full h-full dark:bg-background border dark:border-gray-700 rounded-md gap-0 py-0">
			<CardHeader className="flex flex-row items-center justify-between border-b border-[#E5E7EB] dark:border-gray-700 p-4 shrink-0">
				<CardTitle className="text-[#202C4B] dark:text-white text-lg font-semibold flex items-center gap-2">
					Onboarding
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
				) : onboardingData.length === 0 ? (
					<p className="text-md text-[#202C4B] dark:text-gray-100 text-center py-10 p-4">
						No onboarding processes active.
					</p>
				) : (
					<ScrollArea className="flex-1 w-full min-h-0">
						<div className="flex flex-col p-4 gap-4">
							{onboardingData.map((item, index) => {
								return (
									<div key={index} className="flex flex-col gap-1.5 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
										<div className="flex justify-between items-start">
											<div>
												<h4 className="text-sm font-semibold text-[#202C4B] dark:text-white">
													{item.name}
												</h4>
												<p className="text-xs text-gray-400 dark:text-gray-500">
													{item.designation}
												</p>
											</div>
											<span className="text-xs font-bold text-theme bg-theme/10 dark:bg-theme/20 px-2 py-0.5 rounded flex items-center gap-1">
												{item.progress === 100 && <Award className="h-3 w-3" />}
												{item.progress}%
											</span>
										</div>
										<div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
											<span>Current Step: <strong className="font-semibold text-gray-700 dark:text-gray-300">{item.currentStep}</strong></span>
										</div>
										<div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-0.5 overflow-hidden">
											<div
												className="bg-theme h-full rounded-full transition-all duration-500"
												style={{ width: `${item.progress}%` }}
											/>
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
