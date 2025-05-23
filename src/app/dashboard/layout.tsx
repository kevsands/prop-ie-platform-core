'use client';

import React from 'react';
// Temporarily comment out problematic import for build testing
// import NavigationErrorHandler from '@/components/navigation/NavigationErrorBoundary';

// Define the interface for parallel route slots
interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
}

/**
 * Dashboard layout with parallel routes
 * 
 * This layout uses Next.js 13+ parallel routes feature to create a dashboard
 * with persistent sidebar and dynamic main content area
 */
export default function DashboardLayout({ sidebar, main, children }: DashboardLayoutProps) {
  return (
    // <NavigationErrorHandler>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar slot - content from @sidebar folder */}
        <div className="w-64 bg-white shadow-md">
          {sidebar}
        </div>

        {/* Main content slot - content from @main folder */}
        <div className="flex-1">
          {main}
        </div>

        {/* Default children if needed */}
        {children}
      </div>
    // </NavigationErrorHandler>
  );
}