'use client';

import React, { lazy, Suspense, ComponentType } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface LazyOptions {
  fallback?: React.ReactNode;
  preload?: boolean;
  retry?: number;
  onError?: (error: Error) => void;
}

// Custom lazy loading wrapper with retry logic
export function lazyWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyOptions = {}
): React.LazyExoticComponent<T> {
  const { retry = 3, onError } = options;
  
  let retryCount = 0;
  
  const load = (): Promise<{ default: T }> => {
    return importFunc().catch((error) => {
      if (retryCount < retry) {
        retryCount++;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(load());
          }, 1000 * retryCount); // Exponential backoff
        });
      }
      
      if (onError) {
        onError(error);
      }
      throw error;
    });
  };

  const LazyComponent = lazy(load);

  // Preload the component if requested
  if (options.preload) {
    load();
  }

  return LazyComponent;
}

// Default loading skeletons for different component types
export const LoadingSkeletons = {
  page: (
    <div className="container mx-auto p-6">
      <Skeleton className="h-12 w-1/3 mb-4" />
      <Skeleton className="h-6 w-2/3 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  ),
  
  card: (
    <div className="p-4">
      <Skeleton className="h-48 mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
  
  table: (
    <div className="p-4">
      <Skeleton className="h-10 mb-4" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 mb-2" />
      ))}
    </div>
  ),
  
  form: (
    <div className="p-4 space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  ),
  
  spinner: (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  )
};

// Lazy loading wrapper component
export function LazyLoad<P extends object>({
  loader,
  fallback = LoadingSkeletons.spinner,
  errorFallback,
  ...props
}: {
  loader: () => Promise<{ default: ComponentType<P> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
} & P) {
  const LazyComponent = lazyWithRetry(loader);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Error boundary for lazy loaded components
export class LazyLoadErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyLoad error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Intersection Observer for lazy loading images and components
export function useLazyLoad(options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isIntersecting };
}

// Lazy image component
export function LazyImage({
  src,
  alt,
  placeholder,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { placeholder?: string }) {
  const { ref, isIntersecting } = useLazyLoad();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div ref={ref as any} className={className}>
      {!isIntersecting ? (
        placeholder ? (
          <img src={placeholder} alt={alt} className={className} {...props} />
        ) : (
          <Skeleton className="w-full h-full" />
        )
      ) : (
        <>
          {!isLoaded && !error && <Skeleton className="w-full h-full absolute" />}
          <img
            src={src}
            alt={alt}
            className={className}
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            {...props}
          />
          {error && (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <span className="text-gray-500">Failed to load image</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Route-based code splitting configurations
export const routeConfig = {
  // Admin routes
  '/admin': {
    preload: false,
    chunk: 'admin'
  },
  '/developer': {
    preload: true,
    chunk: 'developer'
  },
  '/buyer': {
    preload: true,
    chunk: 'buyer'
  },
  '/properties': {
    preload: true,
    chunk: 'properties'
  },
  // Heavy components
  '/analytics': {
    preload: false,
    chunk: 'analytics'
  },
  '/reports': {
    preload: false,
    chunk: 'reports'
  }
};

// Dynamic import helper
export const dynamicImport = {
  // Pages
  PropertySearch: () => lazyWithRetry(() => import('@/app/properties/search/page')),
  BuyerDashboard: () => lazyWithRetry(() => import('@/features/dashboards/BuyerDashboard')),
  DeveloperDashboard: () => lazyWithRetry(() => import('@/features/dashboards/DeveloperDashboard')),
  
  // Features
  ComplianceDashboard: () => lazyWithRetry(() => import('@/features/compliance/ComplianceDashboard')),
  RegulatoryReporting: () => lazyWithRetry(() => import('@/features/compliance/RegulatoryReportingSystem')),
  
  // Heavy components
  PropertyMap: () => lazyWithRetry(() => import('@/components/properties/PropertyMapView')),
  Analytics: () => lazyWithRetry(() => import('@/features/analytics/AnalyticsDashboard')),
  
  // Modals
  PropertyDetailModal: () => lazyWithRetry(() => import('@/components/properties/PropertyDetailModal')),
  DocumentViewer: () => lazyWithRetry(() => import('@/components/documents/DocumentViewer')),
};

// Preload critical routes
export const preloadCriticalRoutes = () => {
  // Preload based on user role
  const userRole = sessionStorage.getItem('userRole');
  
  switch (userRole) {
    case 'buyer':
      dynamicImport.PropertySearch();
      dynamicImport.BuyerDashboard();
      break;
    case 'developer':
      dynamicImport.DeveloperDashboard();
      break;
    case 'admin':
      dynamicImport.ComplianceDashboard();
      break;
  }
};

// Component for route-based lazy loading
export function RouteLoader({ path, children }: { path: string; children: React.ReactNode }) {
  const config = routeConfig[path];
  
  if (!config) {
    return <>{children}</>;
  }
  
  return (
    <LazyLoadErrorBoundary>
      <Suspense fallback={LoadingSkeletons.page}>
        {children}
      </Suspense>
    </LazyLoadErrorBoundary>
  );
}