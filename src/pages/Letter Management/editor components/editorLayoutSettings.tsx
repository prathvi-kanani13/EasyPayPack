import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DraggableNodeList } from "./DraggableNodeList";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import DynamicPlaceholders from "./dynamicPlaceholders";

export default function EditorLayoutSettings() {
  const { toggleSidebar, state } = useSidebar();


  return (
    <Sidebar side="right" collapsible="icon" className="absolute! h-full! inset-y-0 border-r-0">
      <SidebarHeader className="flex flex-row justify-between items-center gap-4 p-2 border-b border-muted">
        <Button
          type="button"
          variant={'ghost'}
          size={'icon-sm'}
          onClick={toggleSidebar}
        >
          <Menu />
        </Button>
      </SidebarHeader>
      {state === "collapsed" ? (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <span className="rotate-90 whitespace-nowrap text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
            Layout Settings
          </span>
        </div>
      ) : (
        <SidebarContent className={`cursor-default transition-all ease-in-out duration-200 overflow-hidden relative`}>
          <ScrollArea className={`h-full flex`}>
            <div className={`flex flex-col p-2`}>
              <Tabs defaultValue="layout" className="w-full gap-4">
                <TabsList className="flex w-full flex-wrap h-auto p-0">
                  <TabsTrigger value="layout" className="h-8 max-[950px]:text-sm text-md min-w-13 text-gray-600 dark:text-gray-400 data-[state=active]:bg-theme/10! data-[state=active]:border-theme/60! cursor-pointer">Layout</TabsTrigger>
                  <TabsTrigger value="fields" className="h-8 max-[950px]:text-sm text-md min-w-13 text-gray-600 dark:text-gray-400 data-[state=active]:bg-theme/10! data-[state=active]:border-theme/60! cursor-pointer">Fields</TabsTrigger>
                </TabsList>

                {/* nodes = draggable elements */}
                <DraggableNodeList />

                {/* dynamic placeholders */}
                <DynamicPlaceholders />
              </Tabs>
            </div>
          </ScrollArea>
        </SidebarContent>
      )}
    </Sidebar>
  )
}

