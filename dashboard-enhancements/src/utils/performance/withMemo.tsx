import * as React from 'react';
import { performanceMonitor } from './index';

/**
 * Options for the withMemo HOC
 */
export interface WithMemoOptions {
  /**
   * Custom component name for logging (defaults to Component.displayName or Component.name)
   */
  name?: string;
  
  /**
   * Custom comparison function for props
   * @param prevProps The previous props object
   * @param nextProps The new props object
   * @returns True if the props are equal (component should not re-render)
   */
  areEqual?: (prevProps: any, nextProps: any) => boolean;
  
  /**
   * Props to exclude from equality check (changes to these props will always cause re-render)
   */
  excludeProps?: string[];
  
  /**
   * Props to include in equality check (only changes to these props will cause re-render)
   */
  includeProps?: string[];
  
  /**
   * Whether to track render performance
   */
  trackPerformance?: boolean;
  
  /**
   * Whether to log render decisions in development mode
   */
  logRenders?: boolean;
}

/**
 * Default comparison function that shallowly compares objects
 * with support for including/excluding specific props
 */
function defaultAreEqual(
  prevProps: Record<string, any>, 
  nextProps: Record<string, any>,
  includeProps?: string[] | undefined,
  excludeProps?: string[] | undefined
): boolean {
  // If we have specific props to include, only check those
  if (includeProps?.length) {
    return includeProps.every(prop => 
      prevProps[prop] === nextProps[prop]
    );
  }
  
  // Otherwise, check all props except excluded ones
  const allProps = new Set([
    ...Object.keys(prevProps),
    ...Object.keys(nextProps)
  ]);
  
  for (const prop of allProps) {
    if (excludeProps?.includes(prop)) {
      continue;
    }
    
    if (prevProps[prop] !== nextProps[prop]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Higher-order component that memoizes a component with enhanced options
 * and optional performance tracking
 * 
 * @param Component The component to memoize
 * @param options Memoization options
 * @returns Memoized component
 * 
 * @example
 * const MemoizedComponent = withMemo(MyComponent, {
 *   includeProps: ['id', 'name'],
 *   trackPerformance: true
 * });
 */
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  options: WithMemoOptions = {}
): React.MemoExoticComponent<React.ComponentType<P>> {
  const {
    name = Component.displayName || Component.name || 'UnknownComponent',
    areEqual: customAreEqual,
    excludeProps,
    includeProps,
    trackPerformance = process.env.NODE_ENV === 'development',
    logRenders = process.env.NODE_ENV === 'development'
  } = options;
  
  // Create a comparison function that combines the custom function (if provided)
  // with the includeProps/excludeProps logic
  const finalAreEqual = (prevProps: P, nextProps: P): boolean => {
    let shouldUpdate: boolean;
    
    if (customAreEqual) {
      // Use custom comparison if provided
      shouldUpdate = customAreEqual(prevProps, nextProps);
    } else {
      // Otherwise use default with include/exclude options
      shouldUpdate = defaultAreEqual(
        prevProps as Record<string, any>,
        nextProps as Record<string, any>,
        includeProps,
        excludeProps
      );
    }
    
    // Log render decisions if enabled
    if (logRenders && typeof console !== 'undefined') {
      console.debug(
        `%c${name} ${shouldUpdate ? 'skipped re-render' : 'will re-render'}`,
        `color: ${shouldUpdate ? 'green' : 'orange'}`,
        {
          reason: shouldUpdate ? 'Props equal' : 'Props changed',
          prevProps,
          nextProps
        }
      );
    }
    
    return shouldUpdate;
  };
  
  // If tracking performance, wrap the component before memoizing
  let ComponentToMemoize: React.ComponentType<P>;
  
  if (trackPerformance) {
    // Create a wrapped version that tracks performance
    const WrappedComponent = (props: P) => {
      const timingRef = React.useRef<number>(-1);
      const renderCountRef = React.useRef<number>(0);
      
      // Track component rendering
      React.useEffect(() => {
        renderCountRef.current += 1;
        return () => {
          if (timingRef.current !== -1 && typeof performanceMonitor.endRenderTiming === 'function') {
            performanceMonitor.endRenderTiming(timingRef.current);
            timingRef.current = -1;
          }
        };
      });
      
      // Start timing this render
      const isRerender = renderCountRef.current > 0;
      if (typeof performanceMonitor.startRenderTiming === 'function') {
        timingRef.current = performanceMonitor.startRenderTiming(
          `Memo(${name})${isRerender ? ' (rerender)' : ''}`
        );
      }
      
      // End timing after render completes
      React.useLayoutEffect(() => {
        if (timingRef.current !== -1 && typeof performanceMonitor.endRenderTiming === 'function') {
          performanceMonitor.endRenderTiming(timingRef.current);
          timingRef.current = -1;
        }
      });
      
      // Render the original component
      return <Component {...props} />;
    };
    
    // Set display name for the wrapped component
    WrappedComponent.displayName = `TimedWrapper(${name})`;
    ComponentToMemoize = WrappedComponent;
  } else {
    // Use the original component directly if not tracking performance
    ComponentToMemoize = Component;
  }
  
  // Memoize the component with our custom comparison function
  const MemoizedComponent = React.memo(ComponentToMemoize, finalAreEqual);
  
  // Set display name for better debugging
  MemoizedComponent.displayName = `Memo(${name})`;
  
  return MemoizedComponent;
}

export default withMemo;