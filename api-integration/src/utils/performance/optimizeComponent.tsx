import React, { Suspense, lazy, ComponentType } from 'react';
import { withMemo } from './withMemo';
import { performanceMonitor } from './index';

/**
 * Higher-order component for monitoring component render performance
 */
export function withPerformanceMonitoring<P extends object>(
  Component: ComponentType<P>,
  options: {
    name?: string;
    trackProps?: boolean;
    trackReRenders?: boolean;
  } = {}
): ComponentType<P> {
  const {
    name = Component.displayName || Component.name || 'UnknownComponent',
    trackProps = false,
    trackReRenders = true
  } = options;

  const MonitoredComponent = (props: P) => {
    const renderCount = React.useRef(0);
    const timingRef = React.useRef(-1);

    // Track render count
    renderCount.current++;

    // Check if this is a re-render
    const isRerender = renderCount.current > 1;

    // Skip if we're not tracking re-renders and this is a re-render
    if (isRerender && !trackReRenders) {
      return <Component {...props} />;
    }

    // Start timing if the monitor has startTiming function
    if (typeof performanceMonitor.startTiming === 'function') {
      timingRef.current = performanceMonitor.startTiming(
        `${name}${isRerender ? ' (rerender)' : ''}`
      );
    }

    // Use layout effect to end timing after render completes
    React.useEffect(() => {
      if (timingRef.current !== -1 && typeof performanceMonitor.endTiming === 'function') {
        performanceMonitor.endTiming(timingRef.current);
        timingRef.current = -1;
      }

      // Cleanup function in case component unmounts
      return () => {
        if (timingRef.current !== -1 && typeof performanceMonitor.endTiming === 'function') {
          performanceMonitor.endTiming(timingRef.current);
          timingRef.current = -1;
        }
      };
    }, []);

    return <Component {...props} />;
  };

  MonitoredComponent.displayName = `WithPerformance(${name})`;

  return MonitoredComponent;
}

/**
 * Utility to warn if a component render takes excessive time
 * 
 * @param componentName Name of the component
 * @param renderTime Time taken to render in ms
 * @param threshold Warning threshold in ms (default: 16ms which is ~60fps)
 */
export function warnIfExcessive(
  componentName: string,
  renderTime: number,
  threshold: number = 16
): void {
  if (renderTime > threshold && process.env.NODE_ENV !== 'production') {
    console.warn(
      `%cSlow Render Warning: ${componentName} took ${renderTime.toFixed(2)}ms to render, which exceeds the ${threshold}ms threshold`,
      'color: orange; font-weight: bold'
    );
  }
}

/**
 * Options for component optimization
 */
export interface OptimizeComponentOptions {
  /**
   * Whether to memoize the component
   */
  memoize?: boolean;

  /**
   * Props to exclude from memoization equality check
   */
  excludeProps?: string[];

  /**
   * Props to include in memoization equality check
   */
  includeProps?: string[];

  /**
   * Whether to track component performance
   */
  trackPerformance?: boolean;

  /**
   * Whether to log render decisions
   */
  logRenders?: boolean;

  /**
   * Whether to lazy load the component
   */
  lazyLoad?: boolean;

  /**
   * Fallback component for lazy loading
   */
  fallback?: React.ReactNode;

  /**
   * Custom display name for the optimized component
   */
  displayName?: string;
}

/**
 * Creates an optimized version of a component with various performance enhancements
 * 
 * @param Component Component to optimize
 * @param options Optimization options
 * @returns Optimized component
 * 
 * @example
 * const OptimizedDataGrid = optimizeComponent(DataGrid, {
 *   memoize: true,
 *   includeProps: ['data', 'columns'],
 *   trackPerformance: true,
 *   displayName: 'OptimizedDataGrid'
 * });
 */
export function optimizeComponent<P extends object>(
  Component: ComponentType<P>,
  options: OptimizeComponentOptions = {}
): ComponentType<P> {
  const {
    memoize = true,
    excludeProps,
    includeProps,
    trackPerformance = process.env.NODE_ENV === 'development',
    logRenders = process.env.NODE_ENV === 'development',
    lazyLoad = false,
    fallback = null,
    displayName
  } = options;

  // Use the provided display name or get it from the component
  const componentName = displayName || Component.displayName || Component.name || 'Component';

  // Start with the original component
  let OptimizedComponent: ComponentType<P> = Component;

  // Apply optimizations in sequence

  // Step 1: Wrap with performance monitoring if enabled
  if (trackPerformance) {
    const MonitoredComponent = withPerformanceMonitoring(OptimizedComponent, {
      name: `${componentName}`,
      trackReRenders: true
    });
    OptimizedComponent = MonitoredComponent;
  }

  // Step 2: Memoize if enabled
  if (memoize) {
    const MemoizedComponent = withMemo(OptimizedComponent, {
      name: componentName,
      excludeProps,
      includeProps,
      trackPerformance: false, // Already tracking if enabled above
      logRenders
    });
    // Use type assertion to help TypeScript with the memo exotic component
    OptimizedComponent = MemoizedComponent as unknown as ComponentType<P>;
  }

  // Step 3: Lazy load if enabled
  if (lazyLoad) {
    // Create a lazy component factory
    const getLazyComponent = () => {
      return new Promise<{ default: ComponentType<P> }>((resolve) => {
        // Simulate network delay in dev for testing
        const delay = process.env.NODE_ENV === 'development' ? 300 : 0;

        setTimeout(() => {
          resolve({ default: OptimizedComponent });
        }, delay);
      });
    };

    // Lazy load the component
    const LazyComponent = lazy(getLazyComponent);

    // Create a wrapped component with Suspense
    const WrappedLazyComponent = React.forwardRef<unknown, P>((props, ref) => {
      const Component = LazyComponent as any;
      return (
        <Suspense fallback={fallback}>
          <Component {...props} ref={ref} />
        </Suspense>
      );
    });

    // Cast to ComponentType<P> through unknown since we know the types are compatible
    OptimizedComponent = (WrappedLazyComponent as unknown) as ComponentType<P>;
  }

  // Set an appropriate display name for debugging
  let finalName = componentName;
  if (memoize) finalName = `Memo(${finalName})`;
  if (trackPerformance) finalName = `Monitored(${finalName})`;
  if (lazyLoad) finalName = `Lazy(${finalName})`;

  OptimizedComponent.displayName = finalName;

  return OptimizedComponent;
}

export default optimizeComponent;