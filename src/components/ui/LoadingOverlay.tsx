'use client';

import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
  transparent?: boolean;
  children?: React.ReactNode;
}

/**
 * LoadingOverlay - A customizable loading overlay component
 * 
 * Can be used either as a wrapper around content (will show spinner over content when loading)
 * or as a standalone component when fullScreen is true.
 * 
 * @example
 * // As a wrapper
 * <LoadingOverlay isLoading={isLoading}>
 *   <div>Content to show after loading</div>
 * </LoadingOverlay>
 * 
 * @example
 * // As a full-screen overlay
 * <LoadingOverlay isLoading={true} fullScreen message="Loading your dashboard..." />
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  fullScreen = false,
  transparent = false,
  children
}) => {
  if (!isLoading && !fullScreen) {
    return <>{children}</>\n  );
  }

  const overlayClasses = `
    ${isLoading ? 'flex' : 'hidden'} 
    ${fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10'}
    ${transparent ? 'bg-white/70 backdrop-blur-sm' : 'bg-white/90'}
    flex flex-col items-center justify-center
  `;

  const LoadingIndicator = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
      {message && <p className="text-gray-700 font-medium text-center max-w-xs">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className={overlayClasses}><LoadingIndicator /></div>
  );
  }

  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className={overlayClasses}>
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;