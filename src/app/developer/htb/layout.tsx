'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FileText, Home, PieChart, BookOpen } from 'lucide-react';
// Temporarily comment out problematic import for build testing
// import { HTBProvider } from '@/context/HTBContext';

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, active, children }) => (
  <Link href={href} className={`
    flex items-center px-3 py-2 text-sm font-medium rounded-md
    ${active 
      ? 'bg-blue-50 text-blue-700' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }
  `}>
    {children}
  </Link>
);

export default function HTBLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // Removed HTBProvider wrapper temporarily for build testing
    <div>
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 space-x-8">
            <NavLink 
              href="/developer/htb" 
              active={pathname === '/developer/htb'}
            >
              <Home className="mr-2 h-5 w-5" />
              HTB Overview
            </NavLink>
            <NavLink 
              href="/developer/htb/claims" 
              active={pathname === '/developer/htb/claims' || pathname.startsWith('/developer/htb/claims/')}
            >
              <FileText className="mr-2 h-5 w-5" />
              Claims Management
            </NavLink>
            <NavLink 
              href="/developer/htb/revenue-guide" 
              active={pathname === '/developer/htb/revenue-guide'}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Revenue Guide
            </NavLink>
            <NavLink 
              href="/developer/htb/analytics" 
              active={pathname === '/developer/htb/analytics'}
            >
              <PieChart className="mr-2 h-5 w-5" />
              Analytics
            </NavLink>
          </div>
        </div>
      </div>
      <main>{children}</main>
      <div className="bg-amber-100 p-3 m-4 rounded-md text-amber-800">
        Note: HTB Provider temporarily disabled for build testing.
      </div>
    </div>
  );
}