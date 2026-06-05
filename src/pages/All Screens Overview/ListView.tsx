import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, ChartPie, Ellipsis, Users, EllipsisVertical, Power, PowerOff, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type RouteItem } from '@/utils/routes';
import { cn } from '@/lib/utils';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef
} from "@tanstack/react-table";
import { DataTable } from '@/components/DataTable';

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

interface ListViewProps {
  items: RouteItem[];
  disabledRoutes: Record<string, boolean>;
  onToggleDisable: (route: string) => void;
}

/**
 * ListView displays screens in a structured TanStack Table format.
 * Utilizes the shared DataTable component.
 */
export default function ListView({ items, disabledRoutes, onToggleDisable }: ListViewProps) {
  const navigate = useNavigate();
  const [isStarred, setIsStarred] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // Column definitions for TanStack table
  const columns = useMemo<ColumnDef<RouteItem>[]>(
    () => [
      {
        accessorKey: "code",
        header: "",
        cell: ({ row }) => {
          const item = row.original;
          const isDisabled = !!disabledRoutes[item.route];
          return (
            <Button
              variant="ghost"
              size="icon"
              disabled={isDisabled}
              onClick={() => setIsStarred(!isStarred)}
              className="rounded-full h-8 w-8 text-gray-400 hover:text-amber-500 cursor-pointer"
            >
              <Star className={cn("h-4.5 w-4.5 transition-colors", isStarred && "fill-amber-500 text-amber-500")} />
            </Button>
          )
        }
      },
      {
        accessorKey: "name",
        header: "Screen Name",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-[#242664] dark:text-white">
              {row.original.code} - {row.original.name}
            </span>
          </div>
        )
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const category = row.original.category;
          const config = categoryConfigs[category as keyof typeof categoryConfigs] || categoryConfigs.other;
          const CategoryIcon = config.icon;
          return (
            <span className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full capitalize",
              config.colorClass
            )}>
              <CategoryIcon className="h-3.5 w-3.5" />
              {category}
            </span>
          );
        }
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const isDisabled = !!disabledRoutes[row.original.route];
          return isDisabled ? (
            <Badge variant="secondary" className="bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 font-semibold px-2.5 py-0.5 text-[10px] rounded-full uppercase tracking-wider border-none">
              Disabled
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 font-semibold px-2.5 py-0.5 text-[10px] rounded-full uppercase tracking-wider border-none">
              Active
            </Badge>
          );
        }
      },
      {
        id: "actions",
        header: () => <div className="">Actions</div>,
        cell: ({ row }) => {
          const item = row.original;
          const isDisabled = !!disabledRoutes[item.route];
          return (
            <div className="flex items-center justify-start gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="outline"
                size="sm"
                disabled={isDisabled}
                onClick={() => navigate(item.route)}
                className="rounded-full px-3.5 h-7 text-xs font-semibold bg-theme/5 hover:bg-theme/10 text-theme border border-theme/20 hover:border-theme/30 transition-all cursor-pointer"
              >
                View &gt;
              </Button>

              <Popover
                open={openPopoverId === item.route}
                onOpenChange={(open) => setOpenPopoverId(open ? item.route : null)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-foreground cursor-pointer rounded-full"
                  >
                    <EllipsisVertical className="h-4 w-4" />
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
                      setOpenPopoverId(null);
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
          );
        }
      }
    ],
    [disabledRoutes, openPopoverId, navigate, onToggleDisable]
  );

  // TanStack Table instantiation
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card">
      <DataTable
        table={table}
        isLoading={false}
        columnCount={columns.length}
      />
    </div>
  );
}
