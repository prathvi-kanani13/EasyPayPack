import type React from "react";
import Image from "../../assets/avtar.jpg"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { LogOut, type LucideIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "@/providers/ThemeProvider"
import { useState } from "react";
import RenderWithTooltip from "@/utils/RenderWithTooltip";

type MenuItem = {
    label: string;
    icon: LucideIcon;
    action?: () => void;
    isDanger?: boolean;
    hideOnDesktop?: boolean;
    component?: React.ReactNode
};

export default function UserSettings() {

    const [open, setOpen] = useState<boolean>(false);

    const { theme, setTheme } = useTheme()

    const menuItems: MenuItem[] = [
        {
            label: "Theme", icon: theme === 'light' ? Sun : Moon, hideOnDesktop: true, action: () => {
                setTheme(theme === 'light' ? 'dark' : 'light')
            }
        },
        { label: "Logout", icon: LogOut, isDanger: true },
    ];

    const user = {
        name: "System Administrator",
        email: "system.admin@dummy.com",
        image: Image,
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <RenderWithTooltip
                trigger={
                    <DropdownMenuTrigger asChild>
                        <Avatar className="w-8 h-8 cursor-pointer">
                            <AvatarImage src={Image} alt="User" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                }
                content="Profile Settings"
            />

            <DropdownMenuContent className="w-53.75 mt-2" align="end">
                <div className="flex items-center gap-3 p-2">
                    <Avatar className="w-12 h-12 border-2 border-gray-300">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm line-clamp-2 break-all">{user.name}</span>
                        <span className="text-xs font-semibold line-clamp-2 break-all">{user.email}</span>
                    </div>
                </div>
                <DropdownMenuSeparator />

                {menuItems.map((item) =>
                    <DropdownMenuItem
                        key={item.label}
                        onClick={(e) => {
                            e.preventDefault()

                            if (typeof item.action === 'function')
                                item.action()

                            if (item.label !== 'Theme') setOpen(false);
                        }}
                        className={`flex items-center font-semibold text-sm gap-3 ${item.hideOnDesktop ? 'sm:hidden' : ''} ${item.isDanger ? "text-red-600 focus:text-red-600" : ""
                            }`}
                    >
                        <item.icon size={18} className="text-gray-700 dark:text-white" />
                        {item.label}
                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu >
    );
}
