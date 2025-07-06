'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Error boundary specifically designed for handling navigation-related errors
 * Resets error state when route or search parameters change
 */
export function NavigationErrorBoundary({ 
  children,
  fallback
}: { 
  children: React.ReactNode,
  fallback: React.ReactNode
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Reset error state on navigation
    setHasError(false);
  }, [pathname, searchParams]);

  if (hasError) {
    return <>{fallback}</>;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Navigation error:', error);
    setHasError(true);
    return <>{fallback}</>;
  }
}

/**
 * Default fallback component for navigation errors
 */
export function DefaultNavigationErrorFallback() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-md mb-4">
        <h3 className="text-lg font-medium text-red-800 mb-2">Navigation Error</h3>
        <p className="text-sm text-red-700">
          There was a problem loading this page. This could be due to a temporary issue or invalid URL parameters.
        </p>
      </div>
      
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Go Back
        </button>
        
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

/**
 * Combined component with default fallback for ease of use
 */
export default function NavigationErrorHandler({ children }: { children: React.ReactNode }) {
  return (
    <NavigationErrorBoundary fallback={<DefaultNavigationErrorFallback />}>
      {children}
    </NavigationErrorBoundary>
  );
}