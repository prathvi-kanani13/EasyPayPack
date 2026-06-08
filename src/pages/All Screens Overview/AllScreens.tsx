import Pagination from '@/components/Pagination';
import { useState, useEffect } from 'react';
import ListView from './ListView';
import CardView from './CardView';
import OverviewCards from './Components/OverviewCards';
import { ChevronDown, Funnel, LayoutGrid, List, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { routes } from '@/utils/routes';
import { Separator } from '@/components/ui/separator';
import { useLayoutWidth } from '@/layout/Layout';

/**
 * AllScreens component acts as the dashboard dashboard for all screens in the system.
 * It manages views (Card/List), category and search filters, disabled routes state,
 * and paginated page indices.
 */
export default function AllScreens() {
  const [view, setView] = useState<'card' | 'list'>('card');
  const [pageIndex, setPageIndex] = useState(0);
  const [disabledRoutes, setDisabledRoutes] = useState<Record<string, boolean>>({});

  const width = useLayoutWidth();

  const breakpoints = {
    md: 768,
    lg: 1024,
    xl: 1280
  }

  const isMd = width >= breakpoints.md;
  const isLg = width >= breakpoints.lg;
  const isXl = width >= breakpoints.xl;

  const [filters, setFilters] = useState<{
    category: string;
    search: string;
  }>({
    category: 'all',
    search: '',
  });

  // Reset pagination index to 0 whenever filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageIndex(0);
  }, [filters.category, filters.search]);

  // Filter routes based on active category card and search query (case-insensitive)
  const filteredRoutes = routes.filter((r) => {
    const matchesCategory = filters.category === 'all' || r.category === filters.category;

    const matchesSearch = filters.search
      ? r.route.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      r.code.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  // Paginate filtered routes (10 items per page)
  const itemsPerPage = 10;
  const paginatedRoutes = filteredRoutes.slice(
    pageIndex * itemsPerPage,
    (pageIndex + 1) * itemsPerPage
  );

  const isNextDisabled = (pageIndex + 1) * itemsPerPage >= filteredRoutes.length;

  // Handler to toggle enable/disable state of a specific route/page card
  const handleToggleDisable = (route: string) => {
    setDisabledRoutes((prev) => ({
      ...prev,
      [route]: !prev[route],
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header section with view toggle and search bar */}
      <div className="gap-2 flex flex-wrap items-center justify-between">
        {/* Title and Icon */}
        <div className="flex gap-2 items-center">
          <div className="p-4 bg-theme/80 dark:bg-theme/40 rounded-md text-white">
            <Monitor />
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-black dark:text-white tracking-wide">All Screens</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">Manage and access all system screens easily.</span>
          </div>
        </div>

        {/* Filters and View controls */}
        <div className="flex-1 flex gap-2 items-center justify-end flex-wrap">
          <Button variant="outline" className="gap-4 h-9">
            <div className="flex items-center gap-2">
              <Funnel className="h-4 w-4" /> Filter
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Tabs defaultValue="card" value={view} onValueChange={(value) => setView(value as 'card' | 'list')} className="gap-4">
            <TabsList className="flex w-full flex-wrap h-9! p-0">
              <TabsTrigger value="card" className="h-9 px-4 text-md min-w-13 text-gray-600 dark:text-gray-400 data-[state=active]:bg-theme/10! data-[state=active]:border-theme/60! cursor-pointer">
                <LayoutGrid /> Card View
              </TabsTrigger>
              <TabsTrigger value="list" className="h-9 px-4 text-md min-w-13 text-gray-600 dark:text-gray-400 data-[state=active]:bg-theme/10! data-[state=active]:border-theme/60! cursor-pointer">
                <List /> List View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Overview stats cards grid */}
      <OverviewCards filters={filters} setFilters={setFilters} isMd={isMd} isLg={isLg} />

      <Separator variant='light' />

      {/* Conditional layouts rendering the current paginated routes */}
      {view === 'card' ? (
        <CardView
          items={paginatedRoutes}
          disabledRoutes={disabledRoutes}
          onToggleDisable={handleToggleDisable}
          isMd={isMd}
          isLg={isLg}
          isXl={isXl}
        />
      ) : (
        <ListView
          items={paginatedRoutes}
          disabledRoutes={disabledRoutes}
          onToggleDisable={handleToggleDisable}
        />
      )}

      {/* Pagination control */}
      <Pagination
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        isNextDisabled={isNextDisabled}
      />
    </div>
  );
}
