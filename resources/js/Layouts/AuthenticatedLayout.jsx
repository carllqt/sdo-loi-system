"use client";

import * as React from "react";
import { Link, usePage, router } from "@inertiajs/react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/animate-ui/components/radix/sidebar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    CheckCircle2,
    Layers3,
    LogOut,
    FilePlus2,
    BarChart3,
    Clock3,
    RefreshCw,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

const activeTeam = {
    name: "SDO LOI System",
    plan: "Schools Division Office",
};

export const AuthenticatedLayout = ({ breadcrumbs, children }) => {
    const breadcrumbProps = {
        parent: "SDO LOI System",
        current: "Data Fetching",
        ...breadcrumbs,
    };
    const isMobile = useIsMobile();

    // Get currently logged-in Laravel user
    const { auth, requestCounts = {} } = usePage().props;
    const user = auth?.user;

    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <SidebarProvider>
            <Sidebar
                collapsible="icon"
                className="border-slate-200"
                style={{
                    "--sidebar": "#ffffff",
                    "--sidebar-foreground": "#111827",
                    "--sidebar-primary": "#2563eb",
                    "--sidebar-primary-foreground": "#ffffff",
                    "--sidebar-accent": "#eef2f7",
                    "--sidebar-accent-foreground": "#111827",
                    "--sidebar-border": "#e2e8f0",
                    "--sidebar-ring": "#2563eb",
                }}
            >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                className="cursor-default px-3 hover:bg-transparent"
                            >
                                <img
                                    src="/logo.png"
                                    alt="SDO LOI System logo"
                                    className="size-9 rounded-xl object-cover shadow-lg shadow-blue-950/20"
                                />

                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {activeTeam.name}
                                    </span>

                                    <span className="truncate text-xs">
                                        {activeTeam.plan}
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup className="px-3 pt-5">
                        <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Main Navigation
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem className="w-full">
                                <SidebarMenuButton
                                    asChild
                                    isActive={route().current("requests.index")}
                                    tooltip="All LOI Requests"
                                    className="group w-full h-11 rounded-lg px-3 text-[15px] font-medium text-slate-900 hover:bg-slate-50 data-[active=true]:bg-[#1e293b] data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-slate-300/50 [&>svg]:transition-transform [&>svg]:duration-200 [&:hover>svg]:scale-110 [&:hover>svg]:-rotate-6"
                                >
                                    <Link href={route("requests.index")}>
                                        <Layers3 className="size-[18px]" />
                                        <span className="min-w-0 flex-1 truncate">
                                            All LOI Requests
                                        </span>
                                        <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                                            {requestCounts.all ?? 0}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup className="px-3 pt-1">
                        <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Filter Status
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem className="w-full">
                                <SidebarMenuButton
                                    asChild
                                    isActive={route().current(
                                        "requests.requested",
                                    )}
                                    tooltip="Requested"
                                    className="group w-full h-11 rounded-lg px-3 text-[15px] font-medium text-slate-900 hover:bg-slate-50 data-[active=true]:bg-[#1e293b] data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-slate-300/50 [&>svg]:transition-transform [&>svg]:duration-200 [&:hover>svg]:scale-110 [&:hover>svg]:-rotate-6"
                                >
                                    <Link href={route("requests.requested")}>
                                        <Clock3 className="size-[18px] text-amber-400" />
                                        <span className="min-w-0 flex-1 truncate">
                                            Requested
                                        </span>
                                        <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-500">
                                            {requestCounts.requested ?? 0}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem className="w-full">
                                <SidebarMenuButton
                                    asChild
                                    isActive={route().current(
                                        "requests.processing",
                                    )}
                                    tooltip="Processing"
                                    className="group w-full h-11 rounded-lg px-3 text-[15px] font-medium text-slate-900 hover:bg-slate-50 data-[active=true]:bg-[#1e293b] data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-slate-300/50 [&>svg]:transition-transform [&>svg]:duration-200 [&:hover>svg]:scale-110 [&:hover>svg]:-rotate-6"
                                >
                                    <Link href={route("requests.processing")}>
                                        <RefreshCw className="size-[18px] text-blue-400" />
                                        <span className="min-w-0 flex-1 truncate">
                                            Processing
                                        </span>
                                        <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-500">
                                            {requestCounts.processing ?? 0}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem className="w-full">
                                <SidebarMenuButton
                                    asChild
                                    isActive={route().current(
                                        "requests.completed",
                                    )}
                                    tooltip="Completed"
                                    className="group w-full h-11 rounded-lg px-3 text-[15px] font-medium text-slate-900 hover:bg-slate-50 data-[active=true]:bg-[#1e293b] data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-slate-300/50 [&>svg]:transition-transform [&>svg]:duration-200 [&:hover>svg]:scale-110 [&:hover>svg]:-rotate-6"
                                >
                                    <Link href={route("requests.completed")}>
                                        <CheckCircle2 className="size-[18px] text-emerald-400" />
                                        <span className="min-w-0 flex-1 truncate">
                                            Completed
                                        </span>
                                        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-500">
                                            {requestCounts.completed ?? 0}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                {/* Logged-in User */}
                <SidebarFooter className="border-t border-slate-200 bg-transparent p-3 text-slate-900">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <SidebarMenuButton
                                            size="lg"
                                            className="h-12 w-full min-w-0 rounded-xl bg-transparent px-2.5 text-slate-900 hover:bg-slate-50 data-[state=open]:bg-slate-50 data-[state=open]:text-slate-900 [&>svg]:transition-transform [&>svg]:duration-200 [&:hover>svg]:scale-110 [&:hover>svg]:-rotate-6"
                                        />
                                    }
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage
                                            src={user?.avatar}
                                            alt={user?.name || "User"}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="rounded-lg bg-slate-100 text-slate-600">
                                            {(user?.name || "U")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {user?.name || "User"}
                                        </span>

                                        <span className="truncate text-xs">
                                            {user?.email || ""}
                                        </span>
                                    </div>

                                    <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    className="min-w-48 max-w-[95vw] rounded-lg"
                                    side={isMobile ? "bottom" : "right"}
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="p-0 font-normal">
                                            <div className="flex min-w-0 items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                <Avatar className="h-8 w-8 rounded-lg">
                                                    <AvatarImage
                                                        src={user?.avatar}
                                                        alt={user?.name || "User"}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback />
                                                </Avatar>

                                                <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                                                    <span className="truncate font-semibold">
                                                        {user?.name || "User"}
                                                    </span>

                                                    <span className="truncate text-xs">
                                                        {user?.email || ""}
                                                    </span>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <BadgeCheck />
                                            Account
                                        </DropdownMenuItem>

                                        <DropdownMenuItem>
                                            <CreditCard />
                                            Billing
                                        </DropdownMenuItem>

                                        <DropdownMenuItem>
                                            <Bell />
                                            Notifications
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer"
                                    >
                                        <LogOut />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />

                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />

                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink
                                        href={breadcrumbProps.parentHref ?? "#"}
                                    >
                                        {breadcrumbProps.parent}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator className="hidden md:block" />

                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {breadcrumbProps.current}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AuthenticatedLayout;
