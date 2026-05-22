import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import { useRef, useState } from "react"
import RenderWithTooltip from "../utils/RenderWithTooltip"


export default function Layout() {

  const mainRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = () => {
    if (mainRef.current) {
      setShowScrollTop(mainRef.current.scrollTop > 100);
    }
  };

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TooltipProvider>
        <SidebarProvider defaultOpen={true}>
          {/* header navbar */}
          <Header />

          {/* body */}
          <div className="relative flex flex-1 min-w-0 pt-14">
            {/* sidebar */}
            <Sidebar />

            {/* content */}
            <div className="relative flex-1 flex flex-col min-w-0">
              <main
                ref={mainRef}
                onScroll={handleScroll}
                className="flex flex-col flex-1 h-full overflow-y-auto p-4 gap-4 no-scrollbar
                  bg-[#F5F7FA]
                  dark:bg-[#0F0F10]
                  text-gray-900
                  dark:text-white
                "
              >
                <Outlet />
              </main>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-49">
                <RenderWithTooltip content={"Back to top"} onlyOnOverflow={false} side={"top"} trigger={
                  <Button
                    onClick={scrollToTop}
                    className={`
                    rounded-full p-2 h-10 w-10
                    transition-opacity duration-300
                    ${showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"}
                  `}
                  >
                    <ChevronUp className="h-8 w-8" />
                  </Button>
                } />
              </div>
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  )
}