'use client';

import React from 'react';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function DashboardLayout({ 
  children, 
  sidebar, 
  className = '', 
  header, 
  footer 
}: DashboardLayoutProps): React.ReactElement {
  return (
    <div className={`container mx-auto px-4 py-6 ${className}`}>
      {header && <header className="mb-6">{header}</header>}

      <div className="flex flex-col md:flex-row gap-6">
        {sidebar && (
          <aside className="w-full md:w-64 md:flex-shrink-0">
            {sidebar}
          </aside>
        )}
        <main className="flex-grow">
          {children}
        </main>
      </div>

      {footer && <footer className="mt-6">{footer}</footer>}
    </div>
  );
}