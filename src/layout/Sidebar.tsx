import { Link, useLocation } from "react-router-dom";
import WhiteLogo from "../assets/WhiteLogo.png";
import {
    LayoutDashboard,
    Database,
    ArrowRightLeft,
    BarChart3,
    MoreHorizontal,
    Wallet,
    Calendar,
    TrendingUp,
    Gift,
    Lock,
    Calculator,
    UserPlus,
    MapPin,
    Clock,
    Mail,
    X,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();

    const menuItems = [
        { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { title: "Master", icon: Database, path: "/master" },
        { title: "Transaction", icon: ArrowRightLeft, path: "/transaction" },
        { title: "Report", icon: BarChart3, path: "/report" },
        { title: "Other", icon: MoreHorizontal, path: "/other" },
        { title: "Salary Process", icon: Wallet, path: "/salary-process" },
        { title: "Leave Management", icon: Calendar, path: "/leave-management" },
        { title: "DA Increment Process", icon: TrendingUp, path: "/da-increment" },
        { title: "Bonus Process", icon: Gift, path: "/bonus-process" },
        { title: "Closing Process", icon: Lock, path: "/closing-process" },
        { title: "Income Tax", icon: Calculator, path: "/income-tax" },
        { title: "Pre-onboarding", icon: UserPlus, path: "/pre-onboarding" },
        { title: "Conveyance", icon: MapPin, path: "/conveyance" },
        { title: "Probation Management", icon: Clock, path: "/probation-management" },
        { title: "Resignation Management", icon: LogOut, path: "/resignation-management" },
        { title: "Letter Management", icon: Mail, path: "/letter-management" },
    ];

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 bottom-0 left-0 z-50 flex w-68 flex-col border-r border-white/10 bg-[linear-gradient(90deg,rgba(66,78,250)_20%,rgba(115,80,231,1)_100%)] text-white/90 transition-transform duration-300 ease-in-out md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Brand/Logo Section */}
                <div className="flex h-25 items-center justify-between p-0">
                    <Link to="/employee-dashboard" className="flex items-center" onClick={onClose}>
                        <img src={WhiteLogo}
                            alt="EasyPayPack Logo"
                            className="h-55 w-auto object-contain" />
                    </Link>
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-white/80 hover:bg-white/10 md:hidden"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 border border-t border-white/10 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.title}
                                to={item.path}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative text-white",
                                    isActive
                                        ? "bg-gradient-to-r from-[#424efa] to-[#7350e7] shadow-md shadow-blue-500/10"
                                        : "hover:bg-white hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                                        isActive
                                            ? "text-white"
                                            : "text-white group-hover:text-gray-700 dark:group-hover:text-gray-300"
                                    )}
                                />

                                <span>{item.title}</span>

                                {isActive && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-2 w-2 rounded-full bg-white animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 space-y-2">
                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white hover:text-gray-700 transition-all duration-200 cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
