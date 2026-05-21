import { useState, useEffect } from "react";
import { Bell, Search, Menu, User, LogOut, Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      html.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/85 backdrop-blur-md px-6 dark:border-gray-800 dark:bg-gray-900/85">
      {/* Left side: Hamburger (mobile) & Search (desktop) */}
      <div className="flex items-center gap-4 flex-1">
        <Button
          onClick={onMenuClick}
          variant="ghost"
          size="icon"
          className=""
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Global Search Bar */}
        <div className="relative max-w-md w-full max-sm:hidden">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search className="h-4.5 w-4.5 " />
          </div>
          <input
            type="text"
            placeholder="Search Anything..."
            className="block w-full h-10 pl-10 pr-4 text-sm bg-gray-50/70 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#424efa]/20 focus:border-[#424efa] dark:bg-gray-800/50 dark:border-gray-800 dark:text-white dark:focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Right side: Notifications, Dark mode, User Avatar */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <Button
          onClick={toggleDarkMode}
          variant="ghost"
          size="icon-lg"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="h-4.5 w-4.5 text-yellow-500 text-gray-600 dark:text-gray-400" style={{ height: '20px', width: '20px' }} /> : <Moon className="h-4.5 w-4.5 text-gray-600 dark:text-gray-400" style={{ height: '20px', width: '20px' }} />}
        </Button>

        {/* Notification Bell */}
        <div className="relative">
          <Button variant="ghost" size="icon-lg" className="relative">
            <Bell className="h-4.5 w-4.5 text-gray-600 dark:text-gray-400" style={{ height: '20px', width: '20px' }} />
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="text-gray-600 dark:text-gray-200"
              aria-label="Open profile menu"
            >
              <User className="h-4.5 w-4.5" style={{ height: '20px', width: '20px' }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <User className="h-4.5 w-4.5" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Settings className="h-4.5 w-4.5" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 dark:text-red-400 flex items-center gap-2"
              onSelect={handleLogout}
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
