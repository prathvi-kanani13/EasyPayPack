import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, ChartPie, Ellipsis, Users, Star, EllipsisVertical, Power, PowerOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type RouteItem } from '@/utils/routes';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import RenderWithTooltip from '@/utils/RenderWithTooltip';

// Config for category icons and color classes from OverviewCards.tsx
const categoryConfigs = {
  master: {
    icon: Users,
    colorClass: 'bg-[#eef2ff] text-[#3b82f6] dark:bg-blue-950/40 dark:text-blue-400',
  },
  transaction: {
    icon: ArrowRightLeft,
    colorClass: 'bg-[#ecfdf5] text-[#10b981] dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  report: {
    icon: ChartPie,
    colorClass: 'bg-[#fff7ed] text-[#f97316] dark:bg-orange-950/40 dark:text-orange-400',
  },
  other: {
    icon: Ellipsis,
    colorClass: 'bg-[#fdf2f8] text-[#ec4899] dark:bg-pink-950/40 dark:text-pink-400',
  },
};

interface PageCardProps {
  item: RouteItem;
  isDisabled: boolean;
  onToggleDisable: (route: string) => void;
}

/**
 * PageCard renders a single screen/page card based on metadata.
 * It includes an icon based on its category, status badge, bookmark, star options,
 * navigation to the route on click of 'View', and a popover menu to disable/enable.
 */
function PageCard({ item, isDisabled, onToggleDisable }: PageCardProps) {
  const navigate = useNavigate();
  const [isStarred, setIsStarred] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Fallback to 'other' config if category is missing or mismatch
  const config = categoryConfigs[item.category as keyof typeof categoryConfigs] || categoryConfigs.other;
  const CategoryIcon = config.icon;

  const handleNavigate = () => {
    if (isDisabled) return;
    navigate(item.route);
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border border-border rounded-2xl transition-all duration-300 group py-0 dark:bg-background",
        isDisabled ? "opacity-60" : "hover:shadow-md hover:border-theme/30"
      )}
    >
      <CardContent className="p-4 flex flex-col justify-between h-full gap-4">
        {/* Top Section */}
        <div className="flex gap-3 items-start justify-between">
          <div className="flex gap-3 items-start min-w-0 flex-1">
            {/* Category Icon */}
            <div className={cn("flex items-center justify-center h-12 w-12 rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-105", config.colorClass)}>
              <CategoryIcon className="h-5 w-5" />
            </div>

            {/* Code and Title Info */}
            <div className="flex flex-col min-w-0 flex-1 mt-0.5">
              <span className="text-xs font-bold text-gray-400 tracking-wider">
                {item.code}
              </span>
              <RenderWithTooltip
                trigger={
                  <span className="text-[14px] font-semibold text-[#242664] dark:text-white mt-0.5 leading-snug line-clamp-1">
                    {item.name}
                  </span>
                }
                content={item.name}
              />
              <div className="mt-1.5 flex items-center">
                {isDisabled ? (
                  <Badge variant="secondary" className="bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 font-semibold px-2 py-0.5 text-[10px] rounded-full uppercase tracking-wider">
                    Disabled
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 font-semibold px-2 py-0.5 text-[10px] rounded-full uppercase tracking-wider">
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator variant='light' />

        {/* Bottom Section */}
        <div className="flex justify-between items-center gap-1">
          {/* View Link / Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNavigate}
            disabled={isDisabled}
            className="flex-1 rounded-full px-4 h-8 text-xs font-semibold bg-theme/5 hover:bg-theme/10 text-theme border border-theme/20 hover:border-theme/30 transition-all cursor-pointer flex items-center gap-1"
          >
            <span>View</span>
            <span className="text-[10px] font-bold">&gt;</span>
          </Button>

          <div className='flex items-center'>
            {/* Star Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsStarred(!isStarred)}
              className="rounded-full h-8 w-8 text-gray-400 hover:text-amber-500 cursor-pointer"
            >
              <Star className={cn("h-4.5 w-4.5 transition-colors", isStarred && "fill-amber-500 text-amber-500")} />
            </Button>

            {/* Action Menu (Ellipsis Popover) */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 text-gray-400 hover:text-foreground cursor-pointer"
                >
                  <EllipsisVertical className="h-4.5 w-4.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-36 p-1 z-50">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-xs font-medium px-2 py-1.5 h-8 gap-2 cursor-pointer text-left",
                    isDisabled ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20" : "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  )}
                  onClick={() => {
                    onToggleDisable(item.route);
                    setPopoverOpen(false);
                  }}
                >
                  {isDisabled ? (
                    <>
                      <Power className="h-3.5 w-3.5" />
                      <span>Enable</span>
                    </>
                  ) : (
                    <>
                      <PowerOff className="h-3.5 w-3.5" />
                      <span>Disable</span>
                    </>
                  )}
                </Button>
              </PopoverContent>
            </Popover>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

interface PageCardsProps {
  items: RouteItem[];
  disabledRoutes: Record<string, boolean>;
  onToggleDisable: (route: string) => void;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
}

/**
 * PageCards renders a responsive grid of screen cards.
 * Uses 16px (gap-4) spacing in compliance with layout guidelines.
 */
export default function PageCards({ items, disabledRoutes, onToggleDisable, isMd, isLg, isXl }: PageCardsProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-2xl min-h-[200px]">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          No screens found matching the filters.
        </span>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${isMd ? 'md:grid-cols-3' : ''} ${isLg ? 'lg:grid-cols-4' : ''} ${isXl ? 'xl:grid-cols-5' : ''} gap-4`}>
      {items.map((item) => (
        <PageCard
          key={item.route}
          item={item}
          isDisabled={!!disabledRoutes[item.route]}
          onToggleDisable={onToggleDisable}
        />
      ))}
    </div>
  );
}
