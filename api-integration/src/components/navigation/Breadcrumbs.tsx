'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items: customItems, 
  className = '',
  showHome = true 
}) => {
  const { breadcrumbs: contextBreadcrumbs } = useNavigation();
  const pathname = usePathname();
  
  // Use custom items if provided, otherwise use context breadcrumbs
  const items = customItems || contextBreadcrumbs;
  
  // Don't show breadcrumbs on home page
  if (pathname === '/' && !customItems) {
    return null;
  }
  
  // Don't show if there are no items
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;
        
        return (
          <React.Fragment key={item.href}>
            {/* Add separator except for first item */}
            {!isFirst && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
            
            {/* Breadcrumb item */}
            {isLast || item.isActive ? (
              <span className="text-gray-900 font-medium">
                {isFirst && showHome ? (
                  <span className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {isFirst && showHome ? (
                  <span className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// Transaction-specific breadcrumbs
export const TransactionBreadcrumbs: React.FC<{ transactionId: string }> = ({ transactionId }) => {
  const pathname = usePathname();
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Transactions', href: '/transactions' },
    { label: `Transaction #${transactionId}`, href: `/transactions/${transactionId}`, isActive: true }
  ];
  
  // Add sub-pages if we're deeper in the transaction
  if (pathname.includes('/documents')) {
    breadcrumbs.push({ label: 'Documents', href: `/transactions/${transactionId}/documents`, isActive: true });
  } else if (pathname.includes('/participants')) {
    breadcrumbs.push({ label: 'Participants', href: `/transactions/${transactionId}/participants`, isActive: true });
  } else if (pathname.includes('/timeline')) {
    breadcrumbs.push({ label: 'Timeline', href: `/transactions/${transactionId}/timeline`, isActive: true });
  }
  
  return <Breadcrumbs items={breadcrumbs} />;
};

// Property-specific breadcrumbs
export const PropertyBreadcrumbs: React.FC<{ 
  propertyId: string;
  propertyName: string;
  developmentName?: string;
}> = ({ propertyId, propertyName, developmentName }) => {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Properties', href: '/properties' }
  ];
  
  if (developmentName) {
    breadcrumbs.push({ 
      label: developmentName, 
      href: `/developments/${propertyId.split('-')[0]}` 
    });
  }
  
  breadcrumbs.push({
    label: propertyName,
    href: `/properties/${propertyId}`,
    isActive: true
  });
  
  return <Breadcrumbs items={breadcrumbs} />;
};

// Project-specific breadcrumbs for developers
export const ProjectBreadcrumbs: React.FC<{
  projectId: string;
  projectName: string;
  currentSection?: string;
}> = ({ projectId, projectName, currentSection }) => {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Developer Dashboard', href: '/developer' },
    { label: 'Projects', href: '/developer/projects' },
    { label: projectName, href: `/developer/projects/${projectId}` }
  ];
  
  if (currentSection) {
    breadcrumbs.push({
      label: currentSection,
      href: `/developer/projects/${projectId}/${currentSection.toLowerCase()}`,
      isActive: true
    });
  }
  
  return <Breadcrumbs items={breadcrumbs} />;
};

export default Breadcrumbs;