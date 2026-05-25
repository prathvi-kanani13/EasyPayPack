import { Button } from "@/components/ui/button"
import { Moon, Sun, Search, Menu, X } from "lucide-react"
import { ButtonGroup } from "@/components/ui/button-group"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { useEffect, useRef, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import lightLogo from "../assets/WhiteLogo.png"

import { useSidebar } from "@/components/ui/sidebar"
import RenderWithTooltip from "@/utils/RenderWithTooltip"

import {
  CommonRoutes as searchRoutes
} from "@/utils/textSearchRoutes";
import { Kbd } from "@/components/ui/kbd"
import { useTheme } from "@/providers/ThemeProvider";
import UserSettings from "@/components/layout/UserSettings"

export default function Header() {
  const isMobile = window.innerWidth < 768;

  const { theme, setTheme } = useTheme()
  const { open, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Derive filtered search routes directly from query state during render (derived state)
  const filtered = useMemo(() => {
    if (!searchRoutes || !query) return [];

    const safeQuery = escapeRegex(query);
    const regex = new RegExp(safeQuery, "i");
    return Object.keys(searchRoutes).filter((key) => regex.test(key));
  }, [query]);

  const [searchEl, setSearchEl] = useState<'icon' | 'field'>(isMobile ? 'icon' : 'field');
  const openSearch = () => {
    setSearchEl('field');
    inputRef.current?.focus();
  };

  // ctrl + k listener
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + k
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        openSearch()
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeSearch = () => {
    setQuery('');
    setShowDropdown(false);
    setSearchEl('icon');
  };

  const handleThemeChange = (value: "light" | "dark") => {
    setTheme(value) // already saves to sessionStorage inside provider
  }

  return (
    <header className="fixed top-0 flex items-center justify-between w-full h-14 bg-white dark:bg-background dark:border-b dark:border-border gap-2 px-2 md:pl-14 shadow-sm z-40">
      {/* logo */}
      <div className="flex items-center gap-2 lg:gap-4">
        {isMobile && <Button
          size='icon'
          variant='ghost'
          onClick={toggleSidebar}
        >
          <Menu />
        </Button>}

        {/* logo */}
        {!(searchEl === 'field' && window.innerWidth < 640) && (
          <div>
            <img
              src={theme === 'light' ? logo : lightLogo}
              alt="EasyPayPack"
              className="w-30 h-auto cursor-pointer z-49"
              onClick={() => navigate("/employee-dashboard")}
            />
          </div>
        )}
      </div>


      <div className={`flex items-center flex-1 gap-2 ${open ? 'pl-20' : ''}`}>
        {open && <Button
          size='icon'
          variant='ghost'
          onClick={toggleSidebar}
        >
          <Menu />
        </Button>}

        {/* search bar and suggestions */}
        {
          searchEl === 'field' && <div className="relative flex flex-1 min-w-0 max-w-100">
            <ButtonGroup className={"bg-gray-50 dark:bg-muted rounded-md w-full z-50"}>
              <InputGroup className="w-full h-full has-[[data-slot=input-group-control]:focus-visible]:border-border has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                <InputGroupInput
                  ref={inputRef}
                  name="Text Search"
                  id="Text Search"
                  placeholder="Search in HRMS"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (query) setShowDropdown(true)
                  }}
                  onBlur={() => {
                    setShowDropdown(false);
                  }}
                  className="text-sm w-full h-auto border-gray-200 dark:border-border"
                  autoComplete='off'
                />
                <InputGroupAddon align={'inline-start'}>
                  <Search size={16} className="text-gray-600 dark:text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupAddon align={'inline-end'} className="hidden sm:block">
                  <Kbd>Ctrl + k</Kbd>
                </InputGroupAddon>
              </InputGroup>
              {isMobile && <Button
                aria-label="Search"
                className="shrink-0"
                onClick={closeSearch}
                size={'icon'}
              >
                <X size={16} className="w-5 h-5 text-white" />
              </Button>}
            </ButtonGroup>

            {showDropdown && filtered.length > 0 && searchRoutes && (
              <div className="absolute top-[calc(100%-6px)] left-0 w-full bg-white dark:bg-popover border border-gray-200 dark:border-border rounded-b-md shadow-md pt-2">
                {filtered.map((item) => (
                  <div
                    key={item}
                    onMouseDown={() => {
                      navigate(searchRoutes[item]);
                      closeSearch();
                    }}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-muted"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        }
      </div>

      {/* utility section */}
      <div className={`flex items-center justify-end gap-1`}>
        <div className={`flex items-center justify-end`}>
          {/* Icon */}
          {searchEl !== 'field' && (
            <RenderWithTooltip
              onlyOnOverflow={false}
              trigger={
                <Button
                  size='icon'
                  className="rounded-md w-9 h-9 cursor-pointer"
                  onClick={openSearch}
                >
                  <Search className="w-5 h-5 text-white" />
                </Button>
              }
              content="Search"
            />
          )}
        </div>

        <div className="max-sm:hidden">
          <RenderWithTooltip
            onlyOnOverflow={false}
            trigger={
              <Button
                size={'icon'}
                onClick={() => {
                  handleThemeChange(theme === 'light' ? 'dark' : 'light')
                }}
              >
                {theme === 'light' ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
              </Button>
            }
            content={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
          />
        </div>

        <div className="w-8 h-8">
          <UserSettings />
        </div>

      </div>
    </header>
  )
}
