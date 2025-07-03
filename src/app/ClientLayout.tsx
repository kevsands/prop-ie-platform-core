'use client';

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CleanProfessionalNav from '@/components/navigation/CleanProfessionalNav';
import { UserRoleProvider } from '@/context/UserRoleContext';
import { EnterpriseNotificationProvider } from '@/context/EnterpriseNotificationContext';
import { TransactionProvider } from '@/context/TransactionContext';

/**
 * ClientLayout Component
 * 
 * This component provides the main layout structure for the application,
 * including navigation and footer.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  // Get current pathname for conditional rendering
  const pathname = usePathname();
  
  // Check if current page is homepage
  const isHomePage = pathname === '/';
  
  // Check if current page is a portal/dashboard route
  const isPortalRoute = pathname.startsWith('/buyer/') || 
                       pathname.startsWith('/developer/') || 
                       pathname.startsWith('/solicitor/');
  
  // Only show footer on pages that are not the homepage
  const isMainPage = pathname === '/';
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <TransactionProvider>
      <UserRoleProvider>
        <EnterpriseNotificationProvider>
          {/* Only show main navigation on non-portal routes */}
          {!isPortalRoute && <CleanProfessionalNav />}
          
          {/* Main content - conditional spacing for navigation */}
          <div className={isPortalRoute ? "" : "pt-16"}> {/* Add spacing for fixed navigation only when nav is present */}
            {children}
          </div>
          
          {/* Global Footer with navigation - only on non-portal routes */}
          {!isPortalRoute && (
            <footer className="bg-gray-900 text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {/* Company */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Company</h3>
                  <ul className="space-y-2">
                    <li><Link href="/company/about" className="hover:text-primary">About Us</Link></li>
                    <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                    <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                  </ul>
                </div>
                {/* Solutions */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Solutions</h3>
                  <ul className="space-y-2">
                    <li><Link href="/solutions/buyers" className="hover:text-primary">For Buyers</Link></li>
                    <li><Link href="/solutions/investors" className="hover:text-primary">For Investors</Link></li>
                    <li><Link href="/solutions/developers" className="hover:text-primary">For Developers</Link></li>
                    <li><Link href="/solutions/professionals" className="hover:text-primary">For Professionals</Link></li>
                  </ul>
                </div>
                {/* Resources */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li><Link href="/resources/guides" className="hover:text-primary">Property Guides</Link></li>
                    <li><Link href="/resources/calculator" className="hover:text-primary">Mortgage Calculator</Link></li>
                    <li><Link href="/resources/templates" className="hover:text-primary">Templates</Link></li>
                    <li><Link href="/resources/reports" className="hover:text-primary">Market Reports</Link></li>
                  </ul>
                </div>
                {/* Legal */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Legal</h3>
                  <ul className="space-y-2">
                    <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                  </ul>
                </div>
              </div>
              {/* Bottom Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-700 pt-6">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <Link href="/" className="text-xl font-bold tracking-tight">PropIE</Link>
                  <span className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} PropIE. All rights reserved.</span>
                </div>
                <div className="flex space-x-4">
                  {/* Replace with your icon components */}
                  <a href="https://twitter.com/" aria-label="Twitter" className="hover:text-primary"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.936 0 .39.045.765.127 1.124C7.728 8.89 4.1 6.89 1.671 3.905c-.427.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89-.386.104-.793.16-1.213.16-.297 0-.583-.028-.862-.08.584 1.823 2.28 3.152 4.29 3.188A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.014-.633A9.936 9.936 0 0 0 24 4.557z"/></svg></a>
                  <a href="https://linkedin.com/" aria-label="LinkedIn" className="hover:text-primary"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.845-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z"/></svg></a>
                  <a href="https://facebook.com/" aria-label="Facebook" className="hover:text-primary"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.294h6.116c.733 0 1.325-.593 1.325-1.326v-21.349c0-.734-.592-1.326-1.325-1.326z"/></svg></a>
                </div>
              </div>
            </div>
          </footer>
          )}
        </EnterpriseNotificationProvider>
      </UserRoleProvider>
    </TransactionProvider>
  );
}