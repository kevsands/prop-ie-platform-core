'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Head from 'next/head';

/**
 * AppLayout Props
 * Defines the interface for the AppLayout component props
 */
export interface AppLayoutProps {
  /** Main content */
  children: React.ReactNode;
  /** Page title for SEO */
  title?: string;
  /** Page description for SEO */
  description?: string;
  /** Header content (e.g., page title, breadcrumbs) */
  header?: React.ReactNode;
  /** Additional content to render in the sidebar */
  sidebar?: React.ReactNode;
  /** Whether to display a full-width layout (no max-width container) */
  fullWidth?: boolean;
  /** Whether to include top padding (useful for pages with heroes) */
  noPadding?: boolean;
  /** Custom CSS class to add to the main container */
  className?: string;
  /** Custom container width class, defaults to 'max-w-7xl' */
  containerWidth?: string;
  /** Footer content (use when you need a custom footer) */
  footer?: React.ReactNode;
  /** Background color class for the main content area */
  bgColor?: string;
}

/**
 * AppLayout Component
 * 
 * A consistent layout component for application pages that ensures:
 * - Responsive design across all viewports
 * - Consistent spacing
 * - Sidebar support when needed
 * - Flexible width options
 * - Proper header placement
 * 
 * Use this component to wrap all page content for a consistent look and feel.
 * It works in harmony with the global ClientLayout which provides navigation and footer.
 */
export function AppLayout({
  children,
  title,
  description,
  header,
  sidebar,
  fullWidth = false,
  noPadding = false,
  className = '',
  containerWidth = 'max-w-7xl',
  footer,
  bgColor = 'bg-white dark:bg-gray-900'
}: AppLayoutProps): React.ReactElement {
  // Determine content classes based on whether there's a sidebar
  const contentClasses = sidebar 
    ? 'flex flex-col lg:flex-row gap-6'
    : '';
  
  // Container class composition
  const containerClasses = cn(
    !fullWidth ? containerWidth : 'w-full',
    'mx-auto px-4 sm:px-6 lg:px-8',
    !noPadding && 'py-8',
    className
  );

  // Background classes
  const bgClasses = cn(
    bgColor,
    'min-h-[calc(100vh-4rem)]' // Account for header height
  );

  return (
    <>
      {(title || description) && (
        // Next.js Head has been deprecated in app router, but we're retaining this 
        // pattern for backwards compatibility with any components that might rely on it
        <Head>
          {title && <title>{title}</title>}
          {description && <meta name="description" content={description} />}
        </Head>
      )}

      <div className={bgClasses}>
        <div className={containerClasses}>
          {/* Page header if provided */}
          {header && (
            <header className="mb-6">
              {header}
            </header>
          )}

          {/* Main content area */}
          <div className={contentClasses}>
            {/* Conditional sidebar */}
            {sidebar && (
              <aside className="w-full lg:w-64 flex-shrink-0 mb-6 lg:mb-0">
                {sidebar}
              </aside>
            )}

            {/* Main content */}
            <main className={cn(
              "flex-grow",
              sidebar && "lg:max-w-[calc(100%-16rem)]"
            )}>
              {children}
            </main>
          </div>

          {/* Optional footer */}
          {footer && (
            <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </>
  );
}

export default AppLayout;