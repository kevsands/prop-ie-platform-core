'use client';

import React, { Suspense, lazy, ComponentType } from 'react';

interface LazyComponentProps {
  /**
   * Function that returns a Promise to load the component
   * @example 
   * loaderAction={() => import('@/components/HeavyComponent')}
   */
  loaderAction: () => Promise<{ default: ComponentType<any> }>;
  /**
   * Props to pass to the lazy-loaded component
   */
  componentProps?: Record<string, any>;
  /**
   * Content to display while the component is loading
   */
  fallback?: React.ReactNode;
  /**
   * Error component to display if loading fails
   */
  errorComponent?: React.ComponentType<{ error: Error, reset: () => void }>;
}

/**
 * Default loading fallback
 */
const DefaultLoadingFallback = () => (
  <div className="p-4 bg-gray-100 animate-pulse rounded-md w-full h-32 flex items-center justify-center">
    <div className="text-gray-500">Loading...</div>
  </div>
);

/**
 * Default error component
 */
const DefaultErrorComponent = ({ error, reset }: { error: Error, reset: () => void }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load component</h3>
    <p className="text-red-600 mb-4">{error.message}</p>
    <button
      onClick={reset}
      className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
    >
      Try again
    </button>
  </div>
);

/**
 * LazyComponent - Utility for lazy-loading components with Suspense
 *
 * This component wraps React.lazy and Suspense to provide a clean API for
 * lazy-loading components with proper error handling and fallbacks.
 * 
 * @example
 * // Basic usage
 * <LazyComponent loaderAction={() => import('@/components/HeavyComponent')} />
 * 
 * @example
 * // With custom fallback and props
 * <LazyComponent 
 *   loaderAction={() => import('@/components/DashboardMetrics')} 
 *   componentProps={{ userId: '123' }}
 *   fallback={<Skeleton />}
 * />
 */
export const LazyComponent: React.FC<LazyComponentProps> = ({
  loaderAction,
  componentProps = {},
  fallback = <DefaultLoadingFallback />,
  errorComponent: ErrorComponent = DefaultErrorComponent,
}) => {
  // Memoize the lazy component to avoid re-creating it on every render
  const LazyLoadedComponent = React.useMemo(() => 
    lazy(loaderAction), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [error, setError] = React.useState<Error | null>(null);

  // Reset error state to trigger a re-load
  const handleReset = () => setError(null);

  if (error) {
    return <ErrorComponent error={error} reset={handleReset} />;
  }

  return (
    <Suspense fallback={fallback}>
      <React.Fragment>
        {/* 
          Use an error boundary to catch lazy loading errors.
          The try/catch here is for demonstration - in a real app, you would 
          use a proper ErrorBoundary component.
        */}
        {(() => {
          try {
            return <LazyLoadedComponent {...componentProps} />;
          } catch (e) {
            // This will catch synchronous errors, but not promise rejections
            setError(e as Error);
            return null;
          }
        })()}
      </React.Fragment>
    </Suspense>
  );
};

export default LazyComponent;