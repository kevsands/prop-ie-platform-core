"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  ChevronsLeft, 
  ChevronsRight, 
  ClipboardList, 
  FileText, 
  Home, 
  Layers, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  MessageSquare, 
  Settings, 
  Users, 
  X,
  LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";

// Navigation interface definitions
interface SidebarNavItemProps {
  icon: LucideIcon;
  title: string;
  href: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary" | "destructive";
  external?: boolean;
  disabled?: boolean;
  children?: SidebarNavItemProps[];
  role?: string | string[];
}

interface SidebarNavGroupProps {
  title: string;
  items: SidebarNavItemProps[];
}

interface MainNavItemProps {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  children?: MainNavItemProps[];
}

interface ProfileProps {
  name: string;
  email: string;
  imageUrl?: string;
  role?: string;
}

// Default navigation items
const defaultMainNavItems: MainNavItemProps[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Properties",
    href: "/properties",
  },
  {
    title: "Developments",
    href: "/developments",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

const defaultSidebarNavGroups: SidebarNavGroupProps[] = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Properties",
        href: "/properties",
        icon: Building2,
      },
      {
        title: "Projects",
        href: "/projects",
        icon: Layers,
        badge: "New",
      },
      {
        title: "Calendar",
        href: "/calendar",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Team",
        href: "/team",
        icon: Users,
      },
      {
        title: "Documents",
        href: "/documents",
        icon: FileText,
      },
      {
        title: "Tasks",
        href: "/tasks",
        icon: ClipboardList,
        badge: "5",
      },
      {
        title: "Messages",
        href: "/messages",
        icon: MessageSquare,
        badge: "3",
        badgeVariant: "destructive",
      },
    ],
  },
  {
    title: "Reporting",
    items: [
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

const defaultProfile: ProfileProps = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Administrator",
};

// Main AppShell Component
interface AppShellProps {
  children: React.ReactNode;
  mainNavItems?: MainNavItemProps[];
  sidebarNavGroups?: SidebarNavGroupProps[];
  profile?: ProfileProps;
  showMainNav?: boolean;
  showSidebar?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  sidebarWidth?: string;
  collapsedSidebarWidth?: string;
  mainNavHeight?: string;
  footerHeight?: string;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  profileActions?: React.ReactNode;
  logoContent?: React.ReactNode;
}

export function AppShell({
  children,
  mainNavItems = defaultMainNavItems,
  sidebarNavGroups = defaultSidebarNavGroups,
  profile = defaultProfile,
  showMainNav = true,
  showSidebar = true,
  collapsible = true,
  defaultCollapsed = false,
  sidebarWidth = "280px",
  collapsedSidebarWidth = "80px",
  mainNavHeight = "4rem",
  footerHeight = "3rem",
  headerContent,
  footerContent,
  profileActions,
  logoContent,
}: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const pathname = usePathname();

  const adjustedSidebarWidth = collapsed ? collapsedSidebarWidth : sidebarWidth;

  // Handle responsive sidebar
  React.useEffect(() => {
    // Close mobile sidebar when pathname changes
    setMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Main Navigation */}
      {showMainNav && (
        <header 
          className={cn(
            "sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6",
            showSidebar && "pr-6"
          )}
          style={{ height: mainNavHeight }}
        >
          <div className="flex items-center gap-2 md:gap-4">
            {showSidebar && (
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            )}
            <div className="flex items-center gap-2">
              {logoContent ? (
                logoContent
              ) : (
                <Link href="/" className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <span className="hidden text-xl font-bold sm:inline-block">
                    PropIE
                  </span>
                </Link>
              )}
            </div>
          </div>

          {headerContent ? (
            <div className="flex-1">{headerContent}</div>
          ) : (
            <>
              <nav className="hidden flex-1 items-center gap-6 md:flex">
                {mainNavItems?.map((item, index) => (
                  <MainNavItem key={index} item={item} />
                ))}
              </nav>
              <div className="flex items-center gap-4">
                <UserMenu profile={profile} actions={profileActions} />
              </div>
            </>
          )}
        </header>
      )}

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <aside
              className={cn(
                "fixed hidden h-screen border-r bg-background md:block",
                collapsed ? "overflow-x-hidden" : "overflow-y-auto"
              )}
              style={{
                width: adjustedSidebarWidth,
                top: showMainNav ? mainNavHeight : 0,
                height: showMainNav 
                  ? `calc(100vh - ${mainNavHeight})` 
                  : "100vh",
              }}
            >
              <div className="flex h-full flex-col gap-2 py-4">
                <div className="px-3 py-2">
                  {!collapsed && (
                    <div className="pb-4">
                      <UserInfo profile={profile} />
                    </div>
                  )}
                  <nav className="grid gap-1 px-2">
                    {sidebarNavGroups.map((group, index) => (
                      <div key={index} className="mb-4">
                        {!collapsed && (
                          <h3 className="mb-1 px-4 text-xs font-semibold text-muted-foreground">
                            {group.title}
                          </h3>
                        )}
                        <div className="grid gap-1">
                          {group.items.map((item, itemIndex) => (
                            <SidebarNavItem 
                              key={itemIndex} 
                              item={item} 
                              collapsed={collapsed} 
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </nav>
                </div>
                {collapsible && (
                  <div className="mt-auto px-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCollapsed(!collapsed)}
                      className="h-9 w-9"
                    >
                      {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                      <span className="sr-only">
                        {collapsed ? "Expand sidebar" : "Collapse sidebar"}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
              <SheetContent side="left" className="w-full max-w-xs p-0">
                <div className="flex h-full flex-col gap-2">
                  <div className="flex h-14 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2">
                      <Building2 className="h-6 w-6 text-primary" />
                      <span className="text-xl font-bold">PropIE</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-9 w-9"
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close sidebar</span>
                    </Button>
                  </div>
                  <div className="px-6 py-4">
                    <UserInfo profile={profile} />
                  </div>
                  <div className="flex-1 overflow-auto">
                    <nav className="grid gap-2 px-6">
                      {sidebarNavGroups.map((group, index) => (
                        <div key={index} className="mb-4">
                          <h3 className="mb-1 px-4 text-xs font-semibold text-muted-foreground">
                            {group.title}
                          </h3>
                          <div className="grid gap-1">
                            {group.items.map((item, itemIndex) => (
                              <SidebarNavItem 
                                key={itemIndex} 
                                item={item} 
                                collapsed={false}
                                onClick={() => setMobileSidebarOpen(false)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </nav>
                  </div>
                  <div className="mt-auto border-t p-6">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        console.log("Log out clicked");
                        setMobileSidebarOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}

        {/* Main Content */}
        <main
          className={cn(
            "flex flex-1 flex-col",
            showSidebar && "md:ml-auto"
          )}
          style={{
            width: showSidebar 
              ? `calc(100% - ${adjustedSidebarWidth})` 
              : "100%",
            marginLeft: showSidebar ? adjustedSidebarWidth : 0,
          }}
        >
          <div className="flex-1">{children}</div>
          
          {/* Footer Content */}
          {footerContent && (
            <footer 
              className="border-t bg-background"
              style={{ height: footerHeight }}
            >
              <div className="container flex h-full items-center">
                {footerContent}
              </div>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}

// Supporting Components
function MainNavItem({ item }: { item: MainNavItemProps }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  if (item.disabled) {
    return (
      <span className="text-muted-foreground/70 cursor-not-allowed text-sm font-medium">
        {item.title}
      </span>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/70 hover:text-foreground text-sm font-medium transition-colors"
      >
        {item.title}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "text-sm font-medium transition-colors",
        isActive
          ? "text-foreground"
          : "text-foreground/70 hover:text-foreground"
      )}
    >
      {item.title}
    </Link>
  );
}

function SidebarNavItem({ 
  item, 
  collapsed = false,
  onClick,
}: { 
  item: SidebarNavItemProps; 
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <div
        className={cn(
          "group flex cursor-not-allowed items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground",
          collapsed ? "justify-center px-2" : ""
        )}
      >
        <Icon className="h-5 w-5" />
        {!collapsed && <span>{item.title}</span>}
      </div>
    );
  }

  const linkContent = (
    <div
      className={cn(
        "group flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed ? "justify-center px-2" : ""
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge && (
            <Badge variant={item.badgeVariant} className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </div>
  );

  if (collapsed && item.badge) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link 
              href={item.href} 
              onClick={onClick}
              className="relative"
            >
              {linkContent}
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                {item.badge}
              </span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            <span>{item.title}</span>
            {item.badge && (
              <Badge variant={item.badgeVariant}>
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href} onClick={onClick}>
              {linkContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link href={item.href} onClick={onClick}>
      {linkContent}
    </Link>
  );
}

function UserInfo({ profile }: { profile: ProfileProps }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={profile.imageUrl} alt={profile.name} />
        <AvatarFallback>
          {profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{profile.name}</p>
        <p className="text-xs text-muted-foreground">{profile.email}</p>
        {profile.role && (
          <div className="flex items-center pt-1">
            <Badge variant="outline" className="text-xs">
              {profile.role}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

function UserMenu({ 
  profile,
  actions,
}: { 
  profile: ProfileProps;
  actions?: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.imageUrl} alt={profile.name} />
            <AvatarFallback>
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        {actions}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}