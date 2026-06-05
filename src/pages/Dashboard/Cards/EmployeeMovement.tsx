import { Fragment } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Users, LogOut, AlarmClock } from 'lucide-react'

const movementData = [
	{
		title: 'Contract Employees',
		value: 68,
		icon: Users,
		iconBg: 'bg-emerald-50 dark:bg-emerald-950/20',
		iconColor: 'text-emerald-500 dark:text-emerald-400',
		trend: {
			direction: 'up',
			value: 6,
			color: 'text-emerald-500'
		}
	},
	{
		title: 'Resignations This Month',
		value: 15,
		icon: LogOut,
		iconBg: 'bg-red-50 dark:bg-red-950/20',
		iconColor: 'text-red-500 dark:text-red-450',
		trend: {
			direction: 'down',
			value: 3,
			color: 'text-red-500'
		}
	},
	{
		title: 'Employees in Notice Period',
		value: 22,
		icon: AlarmClock,
		iconBg: 'bg-blue-50 dark:bg-blue-950/20',
		iconColor: 'text-blue-500 dark:text-blue-400',
		trend: {
			direction: 'up',
			value: 4,
			color: 'text-emerald-500'
		}
	}
]

export default function EmployeeMovement() {
	return (
		<Card className="w-full dark:bg-background border dark:border-gray-700 rounded-md gap-0 py-0 overflow-hidden">
			{/* Card Header */}
			<CardHeader className="flex flex-row items-center justify-between p-5 pb-3">
				<div>
					<h3 className="text-[#202C4B] dark:text-white text-base font-bold">
						Employee Movement
					</h3>
					<p className="text-xs text-[#8f94ac] dark:text-gray-400 mt-0.5">
						Overview of contract, resignation and notice period employees
					</p>
				</div>
			</CardHeader>

			{/* Card Content containing the mapped sections separated by custom Separator lines */}
			<CardContent className="p-5 pt-2">
				<div className="flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-0">
					{movementData.map((item, index) => {
						const IconComponent = item.icon
						return (
							<Fragment key={index}>
								<div className="flex-1 flex items-center justify-between md:px-8 first:pl-0 last:pr-0">
									<div className="flex items-center gap-3">
										<div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`}>
											<IconComponent className={`h-5 w-5 ${item.iconColor}`} />
										</div>
										<div className="flex flex-col">
											<span className="text-2xl font-extrabold text-[#202C4B] dark:text-white leading-none">
												{item.value}
											</span>
											<span className="text-xs font-semibold text-[#8f94ac] dark:text-gray-400 mt-1">
												{item.title}
											</span>
										</div>
									</div>
									<div className="flex flex-col items-end shrink-0">
										<span className={`text-xs font-bold ${item.trend.color} flex items-center gap-0.5`}>
											<span className="text-sm">{item.trend.direction === 'up' ? '↑' : '↓'}</span> {item.trend.value}
										</span>
										<span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">vs last month</span>
									</div>
								</div>
								{index < movementData.length - 1 && (
									<Separator
										orientation="vertical"
										variant="light"
										className='h-auto!'
									/>
								)}
							</Fragment>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}
