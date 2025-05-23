'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTransaction } from '@/context/TransactionContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  BuildingIcon,
  FileTextIcon,
  UsersIcon,
  BarChart3Icon,
  MessageSquareIcon,
  SettingsIcon,
  LogOutIcon,
  UserIcon,
  BellIcon,
  CreditCardIcon,
  SearchIcon,
  PlusIcon,
  BriefcaseIcon,
  ScaleIcon
} from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  children?: NavigationItem[];
}

export const SmartNav: React.FC = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { transactions } = useTransaction();
  const [notificationssetNotifications] = useState(3); // Mock notifications

  if (!user) return null;

  // Define navigation items based on user role
  const getNavigationItems = (): NavigationItem[] => {
    switch (user.role) {
      case 'DEVELOPER':
        return [
          { 
            label: 'Dashboard', 
            href: '/dashboard', 
            icon: <HomeIcon className="h-4 w-4" />
          },
          { 
            label: 'Projects', 
            href: '/developer/projects',
            icon: <BuildingIcon className="h-4 w-4" />,
            children: [
              { label: 'All Projects', href: '/developer/projects', icon: <BuildingIcon className="h-4 w-4" /> },
              { label: 'New Project', href: '/developer/project/new', icon: <PlusIcon className="h-4 w-4" /> },
              { label: 'Analytics', href: '/developer/analytics', icon: <BarChart3Icon className="h-4 w-4" /> }
            ]
          },
          { 
            label: 'Transactions', 
            href: '/transactions',
            icon: <FileTextIcon className="h-4 w-4" />,
            badge: transactions.filter(t => t.status !== 'COMPLETED').length
          },
          { 
            label: 'Finance', 
            href: '/developer/finance',
            icon: <CreditCardIcon className="h-4 w-4" />
          },
          { 
            label: 'Documents', 
            href: '/developer/documents',
            icon: <FileTextIcon className="h-4 w-4" />
          },
          { 
            label: 'Sales', 
            href: '/developer/sales',
            icon: <BarChart3Icon className="h-4 w-4" />
          }
        ];

      case 'BUYER':
        return [
          { 
            label: 'Dashboard', 
            href: '/dashboard', 
            icon: <HomeIcon className="h-4 w-4" />
          },
          { 
            label: 'Property Search', 
            href: '/properties',
            icon: <SearchIcon className="h-4 w-4" />
          },
          { 
            label: 'My Transactions', 
            href: '/transactions',
            icon: <FileTextIcon className="h-4 w-4" />,
            badge: transactions.filter(t => t.status !== 'COMPLETED').length
          },
          { 
            label: 'Documents', 
            href: '/buyer/documents',
            icon: <FileTextIcon className="h-4 w-4" />
          },
          { 
            label: 'Journey', 
            href: '/buyer/journey',
            icon: <BarChart3Icon className="h-4 w-4" />,
            children: [
              { label: 'Planning', href: '/buyer/journey/planning', icon: <FileTextIcon className="h-4 w-4" /> },
              { label: 'Property Search', href: '/buyer/journey/property-search', icon: <SearchIcon className="h-4 w-4" /> },
              { label: 'Financing', href: '/buyer/journey/financing', icon: <CreditCardIcon className="h-4 w-4" /> },
              { label: 'Legal Process', href: '/buyer/journey/legal-process', icon: <ScaleIcon className="h-4 w-4" /> }
            ]
          },
          { 
            label: 'Help to Buy', 
            href: '/buyer/htb',
            icon: <CreditCardIcon className="h-4 w-4" />
          }
        ];

      case 'AGENT':
        return [
          { 
            label: 'Dashboard', 
            href: '/dashboard', 
            icon: <HomeIcon className="h-4 w-4" />
          },
          { 
            label: 'Listings', 
            href: '/agents/listings',
            icon: <BuildingIcon className="h-4 w-4" />
          },
          { 
            label: 'Leads', 
            href: '/agents/leads',
            icon: <UsersIcon className="h-4 w-4" />,
            badge: 5 // Mock new leads
          },
          { 
            label: 'Transactions', 
            href: '/transactions',
            icon: <FileTextIcon className="h-4 w-4" />,
            badge: transactions.filter(t => t.status !== 'COMPLETED').length
          },
          { 
            label: 'Resources', 
            href: '/agents/resources',
            icon: <FileTextIcon className="h-4 w-4" />
          },
          { 
            label: 'Performance', 
            href: '/agents/performance',
            icon: <BarChart3Icon className="h-4 w-4" />
          }
        ];

      case 'SOLICITOR':
        return [
          { 
            label: 'Dashboard', 
            href: '/dashboard', 
            icon: <HomeIcon className="h-4 w-4" />
          },
          { 
            label: 'Cases', 
            href: '/solicitors/cases',
            icon: <BriefcaseIcon className="h-4 w-4" />,
            badge: transactions.filter(t => t.status === 'CONTRACTED').length
          },
          { 
            label: 'Documents', 
            href: '/solicitors/documents',
            icon: <FileTextIcon className="h-4 w-4" />
          },
          { 
            label: 'Contacts', 
            href: '/solicitors/contacts',
            icon: <UsersIcon className="h-4 w-4" />
          },
          { 
            label: 'Transactions', 
            href: '/transactions',
            icon: <FileTextIcon className="h-4 w-4" />,
            badge: transactions.filter(t => t.status !== 'COMPLETED').length
          }
        ];

      case 'INVESTOR':
        return [
          { 
            label: 'Dashboard', 
            href: '/dashboard', 
            icon: <HomeIcon className="h-4 w-4" />
          },
          { 
            label: 'Portfolio', 
            href: '/investor/portfolio',
            icon: <BriefcaseIcon className="h-4 w-4" />
          },
          { 
            label: 'Properties', 
            href: '/investor/properties',
            icon: <BuildingIcon className="h-4 w-4" />
          },
          { 
            label: 'Market', 
            href: '/investor/market',
            icon: <BarChart3Icon className="h-4 w-4" />
          },
          { 
            label: 'Financial', 
            href: '/investor/financial',
            icon: <CreditCardIcon className="h-4 w-4" />
          },
          { 
            label: 'Settings', 
            href: '/investor/settings',
            icon: <SettingsIcon className="h-4 w-4" />
          }
        ];

      default:
        return [
          { 
            label: 'Dashboard', 
            href: '/dashboard', 
            icon: <HomeIcon className="h-4 w-4" />
          }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="transition-opacity duration-300 hover:opacity-80">
                <Image 
                  src="/images/Prop Branding/Prop Master_Logo- White.png" 
                  alt="Prop.ie" 
                  width={120} 
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </Link>
            </div>

            <NavigationMenu className="ml-10">
              <NavigationMenuList>
                {navigationItems.map((item: any) => (
                  <NavigationMenuItem key={item.href}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger className="h-9">
                          <span className="flex items-center">
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                            {item.badge !== undefined && item.badge> 0 && (
                              <Badge className="ml-2" variant="secondary" size="sm">
                                {item.badge}
                              </Badge>
                            )}
                          </span>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                            {item.children.map((child: any) => (
                              <li key={child.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                      pathname === child.href && 'bg-accent'
                                    )}
                                  >
                                    <div className="flex items-center text-sm font-medium leading-none">
                                      {child.icon}
                                      <span className="ml-2">{child.label}</span>
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                          pathname === item.href && 'bg-accent'
                        )}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                        {item.badge !== undefined && item.badge> 0 && (
                          <Badge className="ml-2" variant="secondary" size="sm">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <BellIcon className="h-4 w-4" />
                  {notifications> 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                      variant="destructive"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div>
                    <p className="font-medium">New document uploaded</p>
                    <p className="text-sm text-gray-500">Contract for Unit 42B uploaded by John Smith</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div>
                    <p className="font-medium">Payment received</p>
                    <p className="text-sm text-gray-500">Booking deposit received for Property #123</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div>
                    <p className="font-medium">Status update</p>
                    <p className="text-sm text-gray-500">Transaction #456 moved to Legal Process</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  <Link href="/notifications" className="text-sm">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages */}
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquareIcon className="h-4 w-4" />
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                variant="secondary"
              >
                2
              </Badge>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <Badge variant="secondary" className="w-fit mt-1">
                      {user.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SmartNav;