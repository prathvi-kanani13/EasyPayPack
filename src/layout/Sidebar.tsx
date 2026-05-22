import { useEffect, useState, useRef } from "react"
import { LogOut, Menu } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Link, useNavigate } from "react-router-dom"
import { FaRegBell } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { IoCalendarOutline, IoDocumentTextOutline } from "react-icons/io5";
import { LuLayoutGrid, LuGraduationCap, LuUserRoundCog } from "react-icons/lu";
import type { IconType } from "react-icons";
import { IoMdTime } from "react-icons/io"
import { RxPeople } from "react-icons/rx";
import { GrDocumentUser } from "react-icons/gr";
import { GoPersonAdd, GoGear } from "react-icons/go";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { BsSpeedometer2, BsBarChart } from "react-icons/bs";

import logo from "../assets/WhiteLogo.png"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button";
import RenderWithTooltip from "@/utils/RenderWithTooltip";

type TSidebarItems = {
	label: string,
	href: string,
	icon: IconType
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

	const dashboardItems: TSidebarItems[] = [
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: LuLayoutGrid
		}
	];

	const mainItems: TSidebarItems[] = [
		{ label: "Employees", href: "/employees", icon: RxPeople },
		{ label: "Payroll", href: "/payroll", icon: GrDocumentUser },
		{ label: "Attendance", href: "/attendance", icon: SlCalender },
		{ label: "Leave Management", href: "/leave/management", icon: IoCalendarOutline },
		{ label: "Time Tracking", href: "/time-tracking", icon: IoMdTime },
		{ label: "Performance", href: "/performance", icon: BsSpeedometer2 },
		{ label: "Recruitment", href: "/recruitment", icon: GoPersonAdd },
		{ label: "Onboarding", href: "/onboarding", icon: HiOutlineClipboardDocumentList },
		{ label: "Training", href: "/training", icon: LuGraduationCap },
	];

	const otherItems: TSidebarItems[] = [
		{ label: "Reports & Analytics", href: "/reports", icon: BsBarChart },
		{ label: "Documents", href: "/documents", icon: IoDocumentTextOutline },
		{ label: "Notifications", href: "/notifications", icon: FaRegBell },
		{ label: "Settings", href: "/settings", icon: GoGear },
		{ label: "User Management", href: "/user/management", icon: LuUserRoundCog },
	];

	const sidebarItems = [
		{
			label: "dashboard",
			items: dashboardItems
		},
		{
			label: "main",
			items: mainItems
		},
		{
			label: "other",
			items: otherItems
		}
	]

	const renderSidebarItems = () => {
		return sidebarItems.map((sidebarItem, idx) => {
			return (
				<SidebarGroup key={idx} className="p-0">
					{(open || openMobile) ? (
						<SidebarGroupLabel className="text-grey-200 text-xs uppercase">{sidebarItem.label}</SidebarGroupLabel>
					) : (
						idx > 0 && <div className="my-1 border-t border-white/20 mr-2" />
					)}
					<SidebarMenu className={`${open || openMobile ? 'gap-1' : ''}`}>
						{sidebarItem.items.map((item, subIdx) => {
							const isActive = [item.href, ...(item?.subRoutes ?? [])].includes(location.pathname);
							return (
								<SidebarMenuItem key={subIdx}>
									{
										(open || openMobile) ? (
											<SidebarMenuButton
												className={`text-md font-medium text-white active:bg-black/20 active:text-white transition-all duration-200 ease-in-out cursor-pointer ${isActive
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
				</SidebarGroup>
			)
		})
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
							size="icon"
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