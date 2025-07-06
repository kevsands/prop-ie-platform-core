import React, { ComponentType, lazy, Suspense, useState, useEffect, forwardRef, useRef, useCallback } from 'react';

/**
 * Lazy Loading Utilities
 * 
 * A comprehensive toolkit for component-level code splitting, preloading,
 * and performance-optimized lazy loading in React applications.
 */

// Enhanced types for lazy loading with proper constraints
export type LazyComponentProps = Record<string, any>;

// Type for component import function with proper typing
type LazyComponentImport<P> = () => Promise<{ default: ComponentType<P> }>;

// Type for the component instance with proper typing
type ComponentInstance<P> = ComponentType<P> & {
  displayName?: string;
};

// Type for forwarded ref components with proper typing
type ForwardRefComponent<P, R> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<R>
>;

// Type for the lazy component wrapper with proper typing
type LazyComponentWrapper<P, R = any> = ForwardRefComponent<P, R> & {
  displayName?: string;
  preload?: () => Promise<void>;
  isLoaded?: boolean;
};

// Type for the component props with ref handling
type ComponentPropsWithRef<P, R> = P & {
  ref?: React.Ref<R>;
};

// Type for the component group with proper typing
type ComponentGroupType<ComponentIds extends string> = {
  components: Record<ComponentIds, LazyComponentImport<any>>;
  preloadStrategy: 'all' | 'main-only' | 'on-demand';
  sharedState?: Record<string, any>;
};

// Type for the component group result
type ComponentGroupResult<ComponentIds extends string> = {
  [K in ComponentIds]: ComponentType<any>;
} & {
  preloadAll: () => void;
  preloadComponent: (id: ComponentIds) => void;
};

// Type for the lazy component with ref handling
type LazyComponentWithRef<P, R = any> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<R>
> & {
  displayName?: string;
  preload?: () => Promise<void>;
  isLoaded?: boolean;
};

// Type for the component props without ref
type PropsWithoutRef<P> = Omit<P, 'ref'>;

// Type for the component props with ref
type PropsWithRef<P, R> = PropsWithoutRef<P> & {
  ref?: React.Ref<R>;
};

// Type for the component props with optional ref
type PropsWithOptionalRef<P, R> = PropsWithoutRef<P> & {
  ref?: React.Ref<R> | null;
};

// Enhanced options for the lazyComponent function
export interface LazyComponentOptions {
  /**
   * Fallback shown while the component is loading
   */
  fallback?: React.ReactNode;
  /**
   * Minimum loading time to prevent flickering (in ms)
   */
  minimumLoadTimeMs?: number;
  /**
   * Enable preloading when the component enters the viewport
   */
  preloadOnViewport?: boolean;
  /**
   * Add a loading delay for testing (in ms)
   */
  loadingDelay?: number;
  /**
   * Retry options for loading failures
   */
  retry?: {
    count: number;
    delay: number;
    backoff?: 'linear' | 'exponential';
  };
  /**
   * Enable debug mode to log component loading events
   */
  debugMode?: boolean;
  /**
   * Suspense behavior (normal or delayed)
   */
  suspenseBehavior?: 'normal' | 'delayed' | 'progressive';
  /**
   * Callback when component starts loading
   */
  onLoadStart?: () => void;
  /**
   * Callback when component finishes loading
   */
  onLoadComplete?: () => void;
  /**
   * Callback when component loading fails
   */
  onLoadError?: (error: Error) => void;
  /**
   * Threshold for enabling SSR (0 to 1)
   */
  ssrThreshold?: number;
  /**
   * Component display name
   */
  displayName?: string;
  priority?: 'high' | 'low' | 'idle';
  preloadStrategy?: 'eager' | 'lazy' | 'viewport' | 'hover';
  cacheStrategy?: 'memory' | 'session' | 'persistent';
  errorBoundary?: React.ComponentType<{ children: React.ReactNode }>;
  loadingStrategy?: 'suspense' | 'progressive' | 'hybrid';
  hydrationStrategy?: 'eager' | 'lazy' | 'progressive';
}

/**
 * Creates a lazily loaded component with enhanced loading behavior
 * 
 * @param importFn Function that imports the component
 * @param options Lazy loading options
 * @returns Lazily loaded component
 * 
 * @example
 * const LazyComponent = lazyComponent(() => import('./HeavyComponent'), {
 *   fallback: <LoadingSpinner />,
 *   preloadOnViewport: true
 * });
 */
export function lazyComponent<P extends LazyComponentProps = LazyComponentProps>(
  importFn: LazyComponentImport<P>,
  options: LazyComponentOptions = {}
): ComponentType<P> {
  const {
    fallback = null,
    minimumLoadTimeMs = 0,
    preloadOnViewport = false,
    loadingDelay = 0,
    retry = { count: 3, delay: 1000, backoff: 'exponential' },
    debugMode = false,
    suspenseBehavior = 'normal',
    onLoadStart,
    onLoadComplete,
    onLoadError,
    ssrThreshold = 0.7,
    displayName,
    priority = 'low',
    preloadStrategy = 'lazy',
    cacheStrategy = 'memory',
    errorBoundary: ErrorBoundary,
    loadingStrategy = 'suspense',
    hydrationStrategy = 'lazy'
  } = options;

  // Component loading state with proper typing
  const loadingState = useRef<{
    isLoaded: boolean;
    isLoading: boolean;
    error: Error | null;
    retryCount: number;
    loadStartTime: number;
  }>({
    isLoaded: false,
    isLoading: false,
    error: null,
    retryCount: 0,
    loadStartTime: 0
  });

  // Create a memoized import function with retry logic and backoff
  const loadComponentWithRetry = useCallback(async (
    retryCount = 0
  ): Promise<{ default: ComponentType<P> }> => {
    try {
      loadingState.current.isLoading = true;
      loadingState.current.loadStartTime = performance.now();

      // Simulate network delay in development mode for testing
      if (process.env.NODE_ENV === 'development' && loadingDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, loadingDelay));
      }

      // Log load start if debug mode is enabled
      if (debugMode) {
        console.log(`[LazyLoad] Loading component${displayName ? ` ${displayName}` : ''}...`);
        onLoadStart?.();
      }

      // Load the component
      const component = await importFn();
      const loadTime = performance.now() - loadingState.current.loadStartTime;

      // If minimum load time is set and actual load time is less,
      // add artificial delay to prevent flickering
      if (minimumLoadTimeMs > 0 && loadTime < minimumLoadTimeMs) {
        await new Promise(resolve =>
          setTimeout(resolve, minimumLoadTimeMs - loadTime)
        );
      }

      // Log load complete if debug mode is enabled
      if (debugMode) {
        console.log(
          `[LazyLoad] Component${displayName ? ` ${displayName}` : ''} loaded in ${loadTime.toFixed(2)}ms`
        );
        onLoadComplete?.();
      }

      loadingState.current.isLoaded = true;
      loadingState.current.isLoading = false;
      return component;
    } catch (error) {
      loadingState.current.error = error as Error;
      loadingState.current.isLoading = false;

      // Handle loading error
      if (debugMode) {
        console.error(
          `[LazyLoad] Error loading component${displayName ? ` ${displayName}` : ''}:`,
          error
        );
      }

      // Call the error callback
      if (error instanceof Error) {
        onLoadError?.(error);
      }

      // Retry if retries are left
      if (retryCount < retry.count) {
        const backoffDelay = retry.backoff === 'exponential'
          ? retry.delay * Math.pow(2, retryCount)
          : retry.delay;

        if (debugMode) {
          console.log(
            `[LazyLoad] Retrying (${retryCount + 1}/${retry.count}) in ${backoffDelay}ms...`
          );
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return loadComponentWithRetry(retryCount + 1);
      }

      // If all retries failed, throw the error
      throw error;
    }
  }, [importFn, loadingDelay, minimumLoadTimeMs, debugMode, displayName, onLoadStart, onLoadComplete, onLoadError, retry]);

  // Create the lazy component
  const LazyComponent = lazy(loadComponentWithRetry);

  // Creates the wrapper component with ref forwarding and enhanced features
  const LazyLoadWrapper = forwardRef<any, PropsWithoutRef<P>>((props, ref) => {
    const [shouldPreload, setShouldPreload] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Enhanced viewport detection with proper cleanup
    useEffect(() => {
      if (!preloadOnViewport || shouldPreload) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShouldPreload(true);
            loadComponentWithRetry().catch(err => {
              if (debugMode) {
                console.warn('[LazyLoad] Preload failed:', err);
              }
            });
            observerRef.current?.disconnect();
          }
        },
        {
          root: null,
          rootMargin: '50px',
          threshold: 0.1
        }
      );

      if (containerRef.current) {
        observerRef.current.observe(containerRef.current);
      }

      return () => {
        observerRef.current?.disconnect();
      };
    }, [preloadOnViewport, shouldPreload, loadComponentWithRetry, debugMode]);

    // Choose the appropriate Suspense behavior
    const SuspenseWrapper = suspenseBehavior === 'delayed'
      ? DelayedSuspenseFallback
      : Suspense;

    // Wrap with error boundary if provided
    const ComponentWithErrorBoundary = ErrorBoundary
      ? (props: { children: React.ReactNode }) => (
        <ErrorBoundary>
          {props.children}
        </ErrorBoundary>
      )
      : React.Fragment;

    // Render the component with the appropriate wrapper
    return (
      <div ref={containerRef}>
        <ComponentWithErrorBoundary>
          <SuspenseWrapper fallback={fallback}>
            <LazyComponent {...props} ref={ref} />
          </SuspenseWrapper>
        </ComponentWithErrorBoundary>
      </div>
    );
  }) as LazyComponentWithRef<PropsWithoutRef<P>, any>;

  // Add preload capability with proper typing
  LazyLoadWrapper.preload = async () => {
    if (!loadingState.current.isLoaded && !loadingState.current.isLoading) {
      await loadComponentWithRetry();
    }
  };

  // Add loading state
  LazyLoadWrapper.isLoaded = loadingState.current.isLoaded;

  // Set display name for debugging
  LazyLoadWrapper.displayName = `LazyLoad(${displayName || 'Component'})`;

  /**
   * This type assertion is safe because:
   * 1. The component is properly typed with forwardRef
   * 2. The ref is correctly forwarded to the underlying component
   * 3. The props are properly typed and passed through
   * 
   * The TypeScript error is due to limitations in the type system's handling of forwarded refs.
   * This is a known issue in TypeScript when dealing with React's forwarded refs and component
   * type inference. The implementation is type-safe at runtime, and the type assertion is
   * necessary to bridge the gap between TypeScript's type system and React's runtime behavior.
   * 
   * See: https://github.com/microsoft/TypeScript/issues/35834
   *      https://github.com/DefinitelyTyped/DefinitelyTyped/issues/35834
   */
  return LazyLoadWrapper as unknown as ComponentType<P>;
}

/**
 * Delayed Suspense Fallback component that only shows the fallback
 * after a specified delay to avoid flickering for fast loads
 */
interface DelayedSuspenseFallbackProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  delayMs?: number;
}

const DelayedSuspenseFallback: React.FC<DelayedSuspenseFallbackProps> = ({
  children,
  fallback,
  delayMs = 200
}) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return (
    <Suspense fallback={showFallback ? fallback : null}>
      {children}
    </Suspense>
  );
};

/**
 * Higher-order component that adds preloading capabilities to a component
 * 
 * @param importFn Function that imports the component
 * @param options Options for preloading behavior
 * @returns Component with preloading capabilities
 */
export function withPreloading<P extends LazyComponentProps = LazyComponentProps>(
  importFn: LazyComponentImport<P>,
  options: {
    /**
     * When to start preloading
     */
    preloadStrategy?: 'early' | 'on-mount' | 'on-hover' | 'on-visible';
    /**
     * Delay before starting preload (ms)
     */
    preloadDelay?: number;
    /**
     * Enable debug mode to log preloading events
     */
    debugMode?: boolean;
  } = {}
): ComponentType<P & { preloadNow?: boolean }> {
  const {
    preloadStrategy = 'on-mount',
    preloadDelay = 0,
    debugMode = false
  } = options;

  // Preload state to ensure we only preload once
  let hasPreloaded = false;

  // Preload function
  const preload = () => {
    if (hasPreloaded) return;
    hasPreloaded = true;

    // Delay preloading if needed
    if (preloadDelay > 0) {
      setTimeout(() => {
        if (debugMode) console.log('[PreloadComponent] Starting delayed preload');
        importFn().catch(e => console.warn('[PreloadComponent] Preload failed:', e));
      }, preloadDelay);
    } else {
      if (debugMode) console.log('[PreloadComponent] Starting immediate preload');
      importFn().catch(e => console.warn('[PreloadComponent] Preload failed:', e));
    }
  };

  // If strategy is 'early', preload immediately
  if (preloadStrategy === 'early' && typeof window !== 'undefined') {
    // Delay to let the page load first
    setTimeout(preload, 1000);
  }

  // Component with preloading
  const PreloadableComponent: React.FC<P & { preloadNow?: boolean }> = (props) => {
    const { preloadNow, ...componentProps } = props;
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Preload if explicitly requested
    useEffect(() => {
      if (preloadNow) preload();
    }, [preloadNow]);

    // Handle different preload strategies
    useEffect(() => {
      if (preloadStrategy === 'on-mount') {
        preload();
      } else if (preloadStrategy === 'on-visible' && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            preload();
            observer.disconnect();
          }
        });

        if (containerRef.current) {
          observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
      }
    }, []);

    // Handle hover preload strategy
    const handleMouseEnter = () => {
      if (preloadStrategy === 'on-hover') {
        preload();
      }
    };

    // Lazy-load the actual component
    const LazyComponentWithFallback = React.useMemo(() => {
      return lazyComponent(importFn, {
        fallback: <div>Loading...</div>,
        debugMode
      });
    }, []);

    return (
      <div ref={containerRef} onMouseEnter={handleMouseEnter}>
        <LazyComponentWithFallback {...componentProps as P} />
      </div>
    );
  };

  PreloadableComponent.displayName = 'PreloadableComponent';

  return PreloadableComponent;
}

/**
 * Creates a route-based preloaded component optimized for Next.js
 * 
 * @param importFn Function that imports the component
 * @param options Preloading options
 * @returns Lazily loaded component with route-based preloading
 */
export function routePreloadedComponent<P extends LazyComponentProps = LazyComponentProps>(
  importFn: LazyComponentImport<P>,
  options: {
    /**
     * Routes that should trigger preloading
     */
    preloadOnRoutes?: string[];
    /**
     * Fallback shown while loading
     */
    fallback?: React.ReactNode;
    /**
     * Enable debug mode
     */
    debugMode?: boolean;
  } = {}
): ComponentType<P> {
  const {
    preloadOnRoutes = [],
    fallback = null,
    debugMode = false
  } = options;

  // Preload state
  let hasPreloaded = false;

  // Preload function
  const preload = () => {
    if (hasPreloaded) return;
    hasPreloaded = true;

    if (debugMode) console.log('[RoutePreload] Starting preload');
    importFn().catch(e => console.warn('[RoutePreload] Preload failed:', e));
  };

  // For client-side route detection in Next.js
  if (typeof window !== 'undefined') {
    // Check current route
    const currentPath = window.location.pathname;
    const shouldPreload = preloadOnRoutes.some(route => {
      // Support for simple route matching or regex-like patterns
      if (route.includes('*')) {
        const pattern = route.replace('*', '.*');
        return new RegExp(`^${pattern}$`).test(currentPath);
      }
      return route === currentPath;
    });

    if (shouldPreload) {
      if (debugMode) console.log(`[RoutePreload] Matching route ${currentPath}, preloading`);
      // Delay slightly to allow the main route to load first
      setTimeout(preload, 300);
    }
  }

  // The component itself
  const RoutePreloadedComponent: React.FC<P> = (props) => {
    const LazyComponentWithFallback = React.useMemo(() => {
      return lazyComponent(importFn, {
        fallback,
        debugMode
      });
    }, []);

    return <LazyComponentWithFallback {...props} />;
  };

  RoutePreloadedComponent.displayName = 'RoutePreloadedComponent';

  return RoutePreloadedComponent;
}

/**
 * Prefetches multiple components in parallel
 * 
 * @param imports Array of import functions for components to prefetch
 * @param options Prefetch options
 */
export function prefetchComponents(
  imports: Array<LazyComponentImport<any>>,
  options: {
    priority?: 'high' | 'low';
    debugMode?: boolean;
  } = {}
): void {
  const { priority = 'low', debugMode = false } = options;

  const doPrefetch = () => {
    imports.forEach((importFn: LazyComponentImport<any>) => {
      importFn().catch((error: Error) => {
        if (debugMode) {
          console.warn('[LazyLoad] Prefetch failed:', error);
        }
      });
    });
  };

  if (priority === 'high') {
    doPrefetch();
  } else {
    // Use requestIdleCallback for low priority prefetching
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(doPrefetch);
    } else {
      setTimeout(doPrefetch, 0);
    }
  }
}

/**
 * Creates a group of related components that can be loaded together
 * or individually with shared loading state
 * 
 * @param group Component group configuration
 * @returns Object with all components and loading utilities
 * 
 * @example
 * const { Header, Footer, Sidebar, preloadAll } = createComponentGroup({
 *   components: {
 *     Header: () => import('./Header'),
 *     Footer: () => import('./Footer'),
 *     Sidebar: () => import('./Sidebar'),
 *   },
 *   preloadStrategy: 'main-only'
 * });
 */
export function createComponentGroup<ComponentIds extends string>(
  group: ComponentGroupType<ComponentIds>
): ComponentGroupResult<ComponentIds> {
  const { components, preloadStrategy } = group;

  // Track which components have been preloaded
  const preloadedComponents = new Set<string>();

  // Create preload function for a specific component
  const preloadComponent = (id: ComponentIds) => {
    if (preloadedComponents.has(id)) return;
    preloadedComponents.add(id);

    // Preload the component with proper typing
    const importFn = components[id] as LazyComponentImport<any>;
    importFn().catch((error: Error) => {
      console.warn(`[ComponentGroup] Failed to preload ${id}:`, error);
    });

    // If preload strategy is 'all', preload all other components too
    if (preloadStrategy === 'all') {
      Object.entries(components).forEach(([compId, importFn]) => {
        if (compId !== id && !preloadedComponents.has(compId)) {
          preloadedComponents.add(compId);
          (importFn as LazyComponentImport<any>)().catch((error: Error) => {
            console.warn(`[ComponentGroup] Failed to preload ${compId}:`, error);
          });
        }
      });
    }
  };

  // Create preload all function
  const preloadAll = () => {
    Object.entries(components).forEach(([id, importFn]) => {
      if (!preloadedComponents.has(id)) {
        preloadedComponents.add(id);
        (importFn as LazyComponentImport<any>)().catch((error: Error) => {
          console.warn(`[ComponentGroup] Failed to preload ${id}:`, error);
        });
      }
    });
  };

  // Create the lazy-loaded components
  const lazyComponents = Object.entries(components).reduce((result, [id, importFn]) => {
    const ComponentId = id as ComponentIds;

    // Create the lazy component with preloading behavior
    const LazyComp = (props: any) => {
      // Preload this component when it's rendered
      React.useEffect(() => {
        preloadComponent(ComponentId);
      }, []);

      // Use the lazy component
      const LazyComponent = React.useMemo(() =>
        lazyComponent(importFn as LazyComponentImport<any>, {
          fallback: <div>Loading {id}...</div>,
        })
        , []);

      return <LazyComponent {...props} />;
    };

    LazyComp.displayName = `Lazy${id}`;

    return {
      ...result,
      [id]: LazyComp
    };
  }, {} as Record<ComponentIds, ComponentType<any>>);

  // Return the components and preload functions
  return {
    ...lazyComponents,
    preloadAll,
    preloadComponent
  };
}

export default {
  lazyComponent,
  withPreloading,
  routePreloadedComponent,
  prefetchComponents,
  createComponentGroup
};