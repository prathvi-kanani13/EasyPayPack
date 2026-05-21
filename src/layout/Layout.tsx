import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar - responsive component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Wrapper */}
      <div className="flex flex-col md:pl-68 min-h-screen transition-all duration-300">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic Nested Content Page */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
