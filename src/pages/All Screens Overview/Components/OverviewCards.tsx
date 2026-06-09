import { ArrowRightLeft, ChartPie, ChevronRight, Ellipsis, LayoutGrid, Users, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { routes, type TCategories } from '@/utils/routes';


interface CategoryCard {
  title: string;
  category: TCategories | 'all';
  count: number;
  icon: LucideIcon;
  color: string;
  activeColor: string;
  classNames: string;
}

const cards: CategoryCard[] = [
  {
    title: 'Total Screens',
    category: 'all',
    count: routes.length,
    icon: LayoutGrid,
    // Purple themed icon (white icon on solid purple background as seen in the screenshot)
    color: 'bg-theme/10 text-theme-secondary',
    activeColor: 'bg-gradient-to-br from-[#7350e7] to-[#5135b3] text-white shadow-[0_4px_12px_rgba(115,80,231,0.2)]',
    classNames: 'shadow-md shadow-[#7350e7]/50'
  },
  {
    title: 'Master',
    category: 'master',
    count: routes.filter(r => r.category === 'master').length,
    icon: Users,
    // Blue themed icon
    color: 'bg-[#eef2ff] text-[#3b82f6] dark:bg-blue-950/40 dark:text-blue-400',
    activeColor: 'bg-gradient-to-br from-[#295bff] to-[#003791] text-white shadow-[0_4px_12px_rgba(115,80,231,0.2)]',
    classNames: 'shadow-md shadow-[#295bff]/50'
  },
  {
    title: 'Transaction',
    category: 'transaction',
    count: routes.filter(r => r.category === 'transaction').length,
    icon: ArrowRightLeft,
    // Green themed icon
    color: 'bg-[#ecfdf5] text-[#10b981] dark:bg-emerald-950/40 dark:text-emerald-400',
    activeColor: 'bg-gradient-to-br from-[#25cc7d] to-[#00914d] text-white shadow-[0_4px_12px_rgba(115,80,231,0.2)]',
    classNames: 'shadow-md shadow-[#25cc7d]/50'
  },
  {
    title: 'Report',
    category: 'report',
    count: routes.filter(r => r.category === 'report').length,
    icon: ChartPie,
    // Orange themed icon
    color: 'bg-[#fff7ed] text-[#f97316] dark:bg-orange-950/40 dark:text-orange-400',
    activeColor: 'bg-gradient-to-br from-[#e39230] to-[#9c5600] text-white shadow-[0_4px_12px_rgba(115,80,231,0.2)]',
    classNames: 'shadow-md shadow-[#e39230]/50'
  },
  {
    title: 'Other',
    category: 'other',
    count: routes.filter(r => r.category === 'other').length,
    icon: Ellipsis,
    // Pink themed icon
    color: 'bg-[#fdf2f8] text-[#ec4899] dark:bg-pink-950/40 dark:text-pink-400',
    activeColor: 'bg-gradient-to-br from-[#ed3e9d] to-[#9e0558] text-white shadow-[0_4px_12px_rgba(115,80,231,0.2)]',
    classNames: 'shadow-md shadow-[#ed3e9d]/50'
  }
];

// OverviewCard renders a single dashboard statistic card.
// It includes an icon on the left and title, count, subtext on the right, plus a right chevron link indicator.
function OverviewCard({ item, setFilters, filters }: { item: typeof cards[number], setFilters: (filters: { category: string, search: string }) => void, filters: { category: string, search: string } }) {
  const Icon = item.icon;

  const handleClick = () => {
    setFilters({ category: item.category, search: '' });
  }

  return (
    <Card className={cn("relative overflow-hidden hover:shadow-lg transition-all duration-300 border border-border rounded-2xl group cursor-pointer py-0 dark:bg-background", filters.category === item.category ? item.classNames : '')} onClick={handleClick}>
      <CardContent className="p-4 flex items-center gap-4 relative h-full">
        {/* Left Side: Icon Container */}
        <div className={cn("flex items-center justify-center h-14 w-14 rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-105", filters.category === item.category ? item.activeColor : item.color)}>
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
            Screens
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
export default function OverviewCards({ setFilters, filters, isMd, isLg }: { setFilters: (filters: { category: string, search: string }) => void, filters: { category: string, search: string }, isMd: boolean, isLg: boolean }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${isMd ? 'md:grid-cols-3' : ''} ${isLg ? 'lg:grid-cols-5' : ''} gap-4`}>
      {cards.map((item, idx) => (
        <OverviewCard key={idx} item={item} setFilters={setFilters} filters={filters} />
      ))}
    </div>
  )
}
