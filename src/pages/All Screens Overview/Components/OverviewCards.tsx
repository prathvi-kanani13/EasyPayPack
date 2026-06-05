import { ArrowRightLeft, ChartPie, ChevronRight, Ellipsis, LayoutGrid, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const cards = [
  {
    title: 'Total Screens',
    count: 124,
    subtext: 'Active',
    icon: LayoutGrid,
    // Purple themed icon (white icon on solid purple background as seen in the screenshot)
    color: 'bg-gradient-to-br from-[#7350e7] to-[#5135b3] text-white shadow-[0_4px_12px_rgba(115,80,231,0.2)]',
  },
  {
    title: 'Master',
    count: 28,
    subtext: 'Screens',
    icon: Users,
    // Blue themed icon
    color: 'bg-[#eef2ff] text-[#3b82f6] dark:bg-blue-950/40 dark:text-blue-400',
  },
  {
    title: 'Transaction',
    count: 36,
    subtext: 'Screens',
    icon: ArrowRightLeft,
    // Green themed icon
    color: 'bg-[#ecfdf5] text-[#10b981] dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  {
    title: 'Report',
    count: 34,
    subtext: 'Screens',
    icon: ChartPie,
    // Orange themed icon
    color: 'bg-[#fff7ed] text-[#f97316] dark:bg-orange-950/40 dark:text-orange-400',
  },
  {
    title: 'Other',
    count: 26,
    subtext: 'Screens',
    icon: Ellipsis,
    // Pink themed icon
    color: 'bg-[#fdf2f8] text-[#ec4899] dark:bg-pink-950/40 dark:text-pink-400',
  }
]

// OverviewCard renders a single dashboard statistic card.
// It includes an icon on the left and title, count, subtext on the right, plus a right chevron link indicator.
function OverviewCard({ item }: { item: typeof cards[number] }) {
  const Icon = item.icon

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-all duration-300 border border-border rounded-2xl group cursor-pointer">
      <CardContent className="p-4 flex items-center gap-4 relative h-full">
        {/* Left Side: Icon Container */}
        <div className={cn("flex items-center justify-center h-14 w-14 rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-105", item.color)}>
          <Icon className="h-6 w-6" />
        </div>

        {/* Right Side: Text Information */}
        <div className="flex flex-col flex-1 min-w-0 pr-6">
          <span className="text-[13px] font-semibold text-[#8f94ac] dark:text-gray-400 tracking-wide">
            {item.title}
          </span>
          <span className="text-2xl font-bold tracking-tight text-[#242664] dark:text-white mt-0.5">
            {item.count}
          </span>
          <span className="text-xs text-[#8f94ac] dark:text-gray-500 mt-0.5 font-medium">
            {item.subtext}
          </span>
        </div>

        {/* Chevron link indicator in the bottom-right corner */}
        <div className="absolute bottom-4 right-4 text-gray-400 dark:text-gray-600 transition-transform duration-300 group-hover:translate-x-0.5">
          <ChevronRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  )
}

// OverviewCards renders a list of cards from the cards variable.
// It uses a responsive grid with a 16px gap to lay out the statistical cards for the dashboard.
export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((item, idx) => (
        <OverviewCard key={idx} item={item} />
      ))}
    </div>
  )
}
