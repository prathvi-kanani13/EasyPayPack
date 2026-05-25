import { useEffect, useState, useRef } from "react"
import { Menu } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Link, useNavigate } from "react-router-dom"

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
	LogOut,
	type LucideIcon
} from "lucide-react";

import logo from "../assets/WhiteLogo.png"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button";
import RenderWithTooltip from "@/utils/RenderWithTooltip";

type TSidebarItems = {
	label: string,
	href: string,
	icon: LucideIcon
	subRoutes?: string[]
}

export default function SidebarComponent() {
	const isMobile = window.innerWidth < 768;

	const navigate = useNavigate();
	const { open, setOpen, openMobile, setOpenMobile, toggleSidebar } = useSidebar()

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setOpenMobile(false);
			} else {
				setOpen(false);
			}
		};
		handleResize();

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [showTopShadow, setShowTopShadow] = useState(false);
	const [showBottomShadow, setShowBottomShadow] = useState(false);

	useEffect(() => {
		const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
		if (!viewport) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = viewport as HTMLElement;
			setShowTopShadow(scrollTop > 10);
			setShowBottomShadow(scrollTop + clientHeight < scrollHeight - 10);
		};

		viewport.addEventListener("scroll", handleScroll);
		// Initial check
		handleScroll();

		const resizeObserver = new ResizeObserver(handleScroll);
		resizeObserver.observe(viewport);

		const content = viewport.firstElementChild;
		if (content) {
			resizeObserver.observe(content);
		}

		return () => {
			viewport.removeEventListener("scroll", handleScroll);
			resizeObserver.disconnect();
		};
	}, [open, openMobile]);

	const sidebarItems: TSidebarItems[] = [
		{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
		{ label: "Master", icon: Database, href: "/master" },
		{ label: "Transaction", icon: ArrowRightLeft, href: "/transaction" },
		{ label: "Report", icon: BarChart3, href: "/report" },
		{ label: "Other", icon: MoreHorizontal, href: "/other" },
		{ label: "Salary Process", icon: Wallet, href: "/salary-process" },
		{ label: "Leave Management", icon: Calendar, href: "/leave-management" },
		{ label: "DA Increment Process", icon: TrendingUp, href: "/da-increment" },
		{ label: "Bonus Process", icon: Gift, href: "/bonus-process" },
		{ label: "Closing Process", icon: Lock, href: "/closing-process" },
		{ label: "Income Tax", icon: Calculator, href: "/income-tax" },
		{ label: "Pre-onboarding", icon: UserPlus, href: "/pre-onboarding" },
		{ label: "Conveyance", icon: MapPin, href: "/conveyance" },
		{ label: "Probation Management", icon: Clock, href: "/probation-management" },
		{ label: "Resignation / Notice Period", icon: LogOut, href: "/notice-period/resignation" },
		{ label: "Letter Management", icon: Mail, href: "/letter-management" },
	];

	const renderSidebarItems = () => {
		return (
			<SidebarGroup className="p-0">
				<SidebarMenu className={open || openMobile ? 'gap-1' : 'gap-0'}>
					{sidebarItems.map((item, subIdx) => {
						const isActive = [item.href, ...(item?.subRoutes ?? [])].includes(location.pathname);
						return (
							<SidebarMenuItem key={subIdx}>
								{
									(open || openMobile) ? (
										<SidebarMenuButton
											className={`text-md font-medium h-auto py-0 text-white active:bg-black/20 active:text-white transition-all duration-200 ease-in-out cursor-pointer ${isActive
												? "bg-white text-theme rounded-sm pointer-events-none active:bg-white active:text-theme"
												: `my-0 ${(open || openMobile) ? '' : 'hover:my-1.5'} hover:bg-black/20 hover:text-white hover:rounded-sm`
												}`}
										>
											<Link
												key={item.href}
												to={item.href}
												className={`flex w-full items-center gap-3 text-sm font-medium py-1.5 ${open ? 'px-1' : ''} leading-relaxed transition-colors`}
											>
												{/* Indicator bar */}
												<item.icon style={{ ...(open && { height: '20px', width: '20px' }) }} />

												{item.label}
											</Link>
										</SidebarMenuButton>
									) : (
										<RenderWithTooltip
											side="right"
											onlyOnOverflow={false}
											content={item.label}
											trigger={
												<SidebarMenuButton
													className={`text-md font-medium text-white active:bg-black/20 active:text-white transition-all duration-200 ease-in-out cursor-pointer ${isActive
														? "bg-white text-theme rounded-sm pointer-events-none active:bg-white active:text-theme my-1"
														: `my-0 ${(open || openMobile) ? '' : 'hover:my-1.5'} hover:bg-black/20 hover:text-white hover:rounded-sm`
														}`}
												>
													<Link
														key={item.href}
														to={item.href}
														className="flex w-full items-center justify-center text-sm font-medium py-1.5 leading-relaxed transition-colors"
													>
														{/* Indicator bar */}
														<item.icon />
													</Link>
												</SidebarMenuButton>
											}
										/>
									)
								}
							</SidebarMenuItem>
						)
					})}
				</SidebarMenu>
			</SidebarGroup >
		)
	}

	return (
		<Sidebar collapsible="icon" className="cursor-pointer h-full flex shrink-0 border-r-0 z-41 selection:bg-white selection:text-theme">
			<div className="flex flex-col h-full bg-linear-to-r from-theme to-[rgba(115,80,231)]">
				<SidebarHeader className={`flex flex-row items-center ${isMobile ? 'justify-between' : 'justify-center'} p-2`}>
					{(open || openMobile) ? (
						<img
							src={logo}
							alt="EasyPayPack Logo"
							className={`w-60 h-auto cursor-pointer -mt-8 -mb-10 ${isMobile ? '-ml-7' : '-ml-10'}`}
							onClick={() => navigate("/dashboard")}
						/>
					) : (
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={toggleSidebar}
							className="rounded-sm cursor-pointer text-white hover:bg-white! hover:text-theme!"
						>
							<Menu />
						</Button>
					)}
					{(isMobile && openMobile) && (
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleSidebar}
							className="rounded-sm cursor-pointer text-white hover:bg-white! hover:text-theme!"
						>
							<Menu />
						</Button>
					)}
				</SidebarHeader>
				<SidebarContent className={`pl-2 cursor-default transition-all ease-in-out duration-200 overflow-hidden relative`}>
					{/* Top Shadow - shown when content is scrollable above */}
					<div className={`absolute top-0 left-0 right-0 h-10 z-20 pointer-events-none transition-opacity duration-300 ${showTopShadow ? 'opacity-100' : 'opacity-0'} bg-linear-to-b from-black/15 to-transparent`} />

					<ScrollArea ref={scrollAreaRef} className={`h-full flex ${open || openMobile ? 'pr-3' : ''}`}>
						<div className={`flex flex-col ${open || openMobile ? 'gap-3' : 'gap-0'}`}>
							{renderSidebarItems()}
						</div>
					</ScrollArea>

					{/* Bottom Shadow - shown when content is scrollable below */}
					<div className={`absolute bottom-0 left-0 right-0 h-10 z-20 pointer-events-none transition-opacity duration-300 ${showBottomShadow ? 'opacity-100' : 'opacity-0'} bg-linear-to-t from-black/15 to-transparent`} />
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						{/* This is what shows in icon-collapsed mode */}
						<SidebarMenuItem className="flex flex-col gap-1">
							<SidebarMenuButton tooltip="Log out" className="cursor-pointer text-md font-medium text-white hover:bg-black/20! hover:text-white! gap-3">
								<LogOut /> Log out
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</div>
		</Sidebar>
	)
}