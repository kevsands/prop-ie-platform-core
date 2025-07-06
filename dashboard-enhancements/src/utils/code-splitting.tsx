import { ComponentType, lazy, Suspense, ReactNode } from 'react';

/**
 * Creates a lazy-loaded component with proper typing
 * 
 * @param importFn Function that imports the component
 * @returns Lazy-loaded component with proper TypeScript types
 * 
 * @example
 * const LazyDashboard = lazyImport(() => import('@/components/Dashboard'));
 */
export function lazyImport<
  T extends ComponentType<any>,
  I extends { default?: T } & Record<string, T>
>(importFn: () => Promise<I>) {
  return lazy(async () => {
    const module = await importFn();
    // Handle both default and named exports
    const component = module.default || Object.values(module)[0];
    if (!component) {
      throw new Error('No component found in module');
    }
    return { default: component };
  }) as unknown as T;
}

/**
 * Creates a page-level route component that is code-split
 * 
 * @param importFn Function that imports the page component
 * @returns Lazy-loaded page component
 * 
 * @example
 * const DashboardPage = lazyPage(() => import('@/app/dashboard/page'));
 */
export function lazyPage<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return lazy(importFn) as unknown as T;
}

/**
 * Interface for components that support loading states and preloading
 */
export interface LoadableComponent<P = any> extends React.FC<P & { fallback?: ReactNode }> {
  preload: () => Promise<void>;
  displayName?: string;
}

/**
 * Creates a lazy-loaded component with Suspense built-in and preloading capability
 * 
 * @param importFn Function that imports the component
 * @param fallback Optional fallback component to show during loading
 * @param displayName Optional name for the component for better debugging
 * @returns Component with built-in Suspense and preload method
 * 
 * @example
 * const Dashboard = createLoadable(() => import('@/components/Dashboard'), <LoadingSpinner />);
 * 
 * // Later, to preload:
 * Dashboard.preload();
 */
export function createLoadable<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: ReactNode = null,
  displayName?: string
): LoadableComponent<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFn);
  
  const LoadableComponent = (props: any) => {
    const { fallback: propFallback, ...componentProps } = props;
    return (
      <Suspense fallback={propFallback || fallback}>
        <LazyComponent {...componentProps} />
      </Suspense>
    );
  };
  
  // Add preload capability
  const preloadFunc = async (): Promise<void> => {
    try {
      await importFn();
    } catch (error) {
      console.error('Error preloading component:', error);
    }
  };
  
  // Assign preload function
  const loadableComponent = LoadableComponent as LoadableComponent<React.ComponentProps<T>>;
  loadableComponent.preload = preloadFunc;
  
  if (displayName) {
    loadableComponent.displayName = displayName;
  }
  
  return loadableComponent;
}

/**
 * Creates a route component that is lazy-loaded with built-in Suspense
 * 
 * @param importFn Function that imports the route component
 * @param fallback Optional fallback component to show during loading
 * @returns Route component with built-in Suspense and preload method
 * 
 * @example
 * const DashboardPage = createRoute(() => import('@/app/dashboard/page'), <PageSkeleton />);
 */
export function createRoute<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: ReactNode = null
): LoadableComponent<React.ComponentProps<T>> {
  return createLoadable(importFn, fallback);
}

/**
 * Helper to batch preload multiple components
 * 
 * @param components Array of loadable components to preload
 * @returns Promise that resolves when all components are preloaded
 * 
 * @example
 * // Preload all dashboard-related components when hovering over the dashboard link
 * const preloadDashboard = () => preloadComponents([
 *   DashboardPage,
 *   DashboardMetrics,
 *   ActivityFeed
 * ]);
 */
export async function preloadComponents(components: LoadableComponent[]) {
  return Promise.all(components.map(component => component.preload()));
}

/**
 * Provides a way to prefetch critical components during idle time
 * 
 * @param components Array of loadable components to prefetch
 * 
 * @example
 * // In your app initialization
 * prefetchCriticalComponents([
 *   lazyComponents.PropertyCard,
 *   lazyComponents.Button,
 *   lazyRoutes.Dashboard
 * ]);
 */
export function prefetchCriticalComponents(components: LoadableComponent[]) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      preloadComponents(components).catch(err => 
        console.error('Error prefetching components:', err)
      );
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      preloadComponents(components).catch(err => 
        console.error('Error prefetching components:', err)
      );
    }, 1000);
  }
}

/**
 * Group of common components that can be lazy-loaded together
 * for efficient code-splitting while reducing waterfalls
 */
export const lazyComponents = {
  // UI Components
  Button: lazyImport(() => import('@/components/ui/button').then(mod => ({ default: mod.Button }))),
  Card: lazyImport(() => import('@/components/ui/card').then(mod => ({ default: mod.Card }))),
  Dialog: lazyImport(() => import('@/components/ui/dialog').then(mod => ({ default: mod.Dialog }))),
  
  // Form Components
  Form: lazyImport(() => import('@/components/ui/form').then(mod => ({ default: mod.Form }))),
  Input: lazyImport(() => import('@/components/ui/input').then(mod => ({ default: mod.Input }))),
  
  // Property Components
  PropertyCard: lazyImport(() => import('@/components/property/PropertyCard')),
  PropertyDetail: lazyImport(() => import('@/components/property/PropertyDetail')),
  
  // Dashboard Components
  KPIWidget: lazyImport(() => import('@/components/dashboard/KPIWidget')),
  DashboardGrid: lazyImport(() => import('@/components/dashboard/DashboardGrid')),
  ProjectStatusCard: lazyImport(() => import('@/components/dashboard/ProjectStatusCard')),
};

/**
 * Group of common routes that can be lazy-loaded
 */
export const lazyRoutes = {
  Login: lazyPage(() => import('@/app/login/page')),
  Register: lazyPage(() => import('@/app/register/page')),
  Dashboard: lazyPage(() => import('@/app/dashboard/page')),
  Properties: lazyPage(() => import('@/app/properties/page')),
};

/**
 * Loadable components with built-in Suspense and preloading
 */
export const loadableComponents = {
  // UI Components
  Button: createLoadable(() => import('@/components/ui/button').then(mod => ({ default: mod.Button })), null, 'Button'),
  Card: createLoadable(() => import('@/components/ui/card').then(mod => ({ default: mod.Card })), null, 'Card'),
  Dialog: createLoadable(() => import('@/components/ui/dialog').then(mod => ({ default: mod.Dialog })), null, 'Dialog'),
  
  // Property Components
  PropertyCard: createLoadable(
    () => import('@/components/property/PropertyCard'),
    null,
    'PropertyCard'
  ),
  PropertyDetail: createLoadable(
    () => import('@/components/property/PropertyDetail'),
    null,
    'PropertyDetail'
  ),
};

/**
 * Loadable routes with built-in Suspense and preloading
 */
export const loadableRoutes = {
  Login: createRoute(() => import('@/app/login/page')),
  Register: createRoute(() => import('@/app/register/page')),
  Dashboard: createRoute(() => import('@/app/dashboard/page')),
  Properties: createRoute(() => import('@/app/properties/page')),
};

export default {
  lazyImport,
  lazyPage,
  createLoadable,
  createRoute,
  preloadComponents,
  prefetchCriticalComponents,
  lazyComponents,
  lazyRoutes,
  loadableComponents,
  loadableRoutes
};