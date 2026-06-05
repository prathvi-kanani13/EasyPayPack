import Pagination from '@/components/Pagination';
import { useState } from 'react'
import ListView from './ListView';
import CardView from './CardView';
import OverviewCards from './Components/OverviewCards';
import { ChevronDown, Funnel, LayoutGrid, List, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AllScreens() {

  const [view, setView] = useState<'card' | 'list'>('card');

  return (
    <div className='flex flex-col gap-4'>

      {/* header */}
      <div className='gap-2 flex flex-wrap items-center justify-between'>
        {/* header title */}
        <div className='flex gap-2 items-center'>
          {/* icon */}
          <div className='p-4 bg-theme/40 rounded-md'>
            <Monitor />
          </div>

          {/* heading */}
          <div className='flex flex-col'>
            <h1 className='text-2xl font-bold text-black dark:text-white tracking-wide'>All Screens</h1>
            <span className='text-sm text-gray-500 dark:text-gray-400'>Manage and access all system screens easily.</span>
          </div>
        </div>

        <div className='flex-1 flex gap-2 items-center justify-end flex-wrap'>
          <Button
            variant='outline'
            className=' gap-4'
          >
            <div className='flex items-center gap-2'><Funnel /> Filter</div>
            <ChevronDown />
          </Button>

          <Tabs defaultValue="card" value={view} onValueChange={(value) => setView(value as 'card' | 'list')} className="gap-4">
            <TabsList className="flex w-full flex-wrap h-9! p-0">
              <TabsTrigger value="card" className="h-9 px-4 text-md min-w-13 text-gray-600 dark:text-gray-400 data-[state=active]:bg-theme/10! data-[state=active]:border-theme/60! cursor-pointer"><LayoutGrid /> Card View</TabsTrigger>
              <TabsTrigger value="list" className="h-9 px-4 text-md min-w-13 text-gray-600 dark:text-gray-400 data-[state=active]:bg-theme/10! data-[state=active]:border-theme/60! cursor-pointer"><List /> List View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* overview cards grid */}
      <OverviewCards />

      {view === 'card' ? <CardView /> : <ListView />}

      <Pagination
        pageIndex={0}
        setPageIndex={() => { }}
        isNextDisabled={false}
      />
    </div>
  )
}
