import React, { ComponentType, memo, MemoExoticComponent, useEffect, useRef } from 'react';
import { performanceMonitor } from './index';

/**
 * SafeMemo Module
 * 
 * Provides enhanced React.memo functionality with improved performance tracking,
 * selective prop comparison, debugging capabilities, and protection against common
 * memoization pitfalls.
 */

/**
 * Options for the safeMemo function
 */
export interface SafeMemoOptions<P extends object> {
  /**
   * Display name for the memoized component
   */
  displayName?: string;

  /**
   * Custom comparison function
   */
  areEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean;

  /**
   * Props to include in equality check (only changes to these props cause re-render)
   */
  includeProps?: (keyof P)[];

  /**
   * Props to exclude from equality check (changes to these props always cause re-render)
   */
  excludeProps?: (keyof P)[];

  /**
   * Enable debug mode to log render decisions
   */
  debugMode?: boolean;

  /**
   * Enable performance tracking
   */
  trackPerformance?: boolean;

  /**
   * Force memoization even for function components with hooks
   */
  forceMemoization?: boolean;
}

/**
 * Global debug mode toggle
 */
let globalDebugMode = process.env.NODE_ENV === 'development';

/**
 * Set global debug mode for all safeMemo instances
 */
export function setDebugMode(enabled: boolean): void {
  globalDebugMode = enabled;
}

/**
 * Default comparison function with support for including/excluding specific props
 */
function createPropComparisonFn<P extends object>(
  includeProps?: (keyof P)[],
  excludeProps?: (keyof P)[]
): (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean {
  return (prevProps: Readonly<P>, nextProps: Readonly<P>): boolean => {
    // If we have specific props to include, only check those
    if (includeProps && includeProps.length> 0) {
      return includeProps.every(prop => Object.is(prevProps[prop], nextProps[prop]));
    }

    // Otherwise, check all props except excluded ones
    const allProps = new Set([
      ...Object.keys(prevProps),
      ...Object.keys(nextProps)
    ]) as Set<keyof P>
  );
    for (const prop of allProps) {
      if (excludeProps && excludeProps.includes(prop)) {
        continue;
      }

      if (!Object.is(prevProps[prop], nextProps[prop])) {
        return false;
      }
    }

    return true;
  };
}

/**
 * Enhanced memoization for React components with built-in optimization
 * and debugging features.
 * 
 * @param Component Component to memoize
 * @param options Memoization options
 * @returns Memoized component
 * 
 * @example
 * const MemoizedComponent = safeMemo(MyComponent, {
 *   includeProps: ['id', 'name'],
 *   debugMode: true
 * });
 */
export function safeMemo<P extends object>(
  Component: ComponentType<P>,
  options: SafeMemoOptions<P> = {}
): MemoExoticComponent<ComponentType<P>> {
  const {
    displayName = Component.displayName || Component.name || 'Component',
    areEqual: customAreEqual,
    includeProps,
    excludeProps,
    debugMode = globalDebugMode,
    trackPerformance = process.env.NODE_ENV === 'development',
    forceMemoization = false} = options;

  // Create the comparison function
  const finalAreEqual = customAreEqual ||
    (includeProps || excludeProps
      ? createPropComparisonFn(includePropsexcludeProps)
      : undefined);

  // If tracking performance, wrap the component before memoizing
  const ComponentToMemoize: ComponentType<P> = trackPerformance
    ? (props: any) => {
      const renderCount = useRef(0);
      const timingRef = useRef(-1);

      // Track render count for logging
      renderCount.current++;

      // Start timing this render
      const isRerender = renderCount.current> 1;
      if (performanceMonitor && typeof performanceMonitor.startTiming === 'function') {
        // Pass only two arguments to match the function signature
        timingRef.current = performanceMonitor.startTiming(
          `Memo(${displayName})`,
          isRerender
        );
      }

      // End timing after render
      useEffect(() => {
        if (timingRef.current !== -1 && performanceMonitor && typeof performanceMonitor.endTiming === 'function') {
          performanceMonitor.endTiming(timingRef.current);
          timingRef.current = -1;
        }
      });

      // Render the original component
      return <Component {...props} />\n  );
    }
    : Component;

  // Create enhanced equality function that logs render decisions in debug mode
  const enhancedAreEqual = debugMode
    ? (prevProps: Readonly<P>, nextProps: Readonly<P>): boolean => {
      const result = finalAreEqual ? finalAreEqual(prevPropsnextProps) : Object.is(prevPropsnextProps);

      if (!result && (includeProps || excludeProps || customAreEqual)) {
        // Log what caused the re-render
        if (includeProps && includeProps.length> 0) {

          includeProps.forEach(prop => {
            const hasChanged = !Object.is(prevProps[prop], nextProps[prop]);
            if (hasChanged) {
              }: `, prevProps[prop], ' → ', nextProps[prop]);
            }
          });
        } else {
          // Log all changed props

          const allProps = new Set([
            ...Object.keys(prevProps),
            ...Object.keys(nextProps)
          ]) as Set<keyof P>
  );
          let changedCount = 0;
          for (const prop of allProps) {
            if (excludeProps && excludeProps.includes(prop)) {
              continue;
            }

            const hasChanged = !Object.is(prevProps[prop], nextProps[prop]);
            if (hasChanged) {
              }: `, prevProps[prop], ' → ', nextProps[prop]);
              changedCount++;
            }
          }

          if (changedCount === 0 && customAreEqual) {

          }
        }
      }

      return result;
    }
    : finalAreEqual;

  // Memoize the component with our enhanced options
  const MemoizedComponent = memo(ComponentToMemoizeenhancedAreEqual);

  // Set a descriptive display name for debugging
  MemoizedComponent.displayName = `SafeMemo(${displayName})`;

  return MemoizedComponent;
}

/**
 * Advanced memoization for components with deep prop comparison
 */
export function deepMemo<P extends object>(
  Component: ComponentType<P>,
  options: Omit<SafeMemoOptions<P>, 'areEqual'> & {
    depth?: number;
  } = {}
): MemoExoticComponent<ComponentType<P>> {
  const { depth = 2, ...restOptions } = options;

  // Create deep comparison function
  const deepEqual = (prevProps: Readonly<P>, nextProps: Readonly<P>): boolean => {
    // Use same logic as createPropComparisonFn but with deep comparison
    const includeProps = options.includeProps;
    const excludeProps = options.excludeProps;

    if (includeProps && includeProps.length> 0) {
      return includeProps.every(prop =>
        deepEqualValue(prevProps[prop], nextProps[prop], depth)
      );
    }

    const allProps = new Set([
      ...Object.keys(prevProps),
      ...Object.keys(nextProps)
    ]) as Set<keyof P>
  );
    for (const prop of allProps) {
      if (excludeProps && excludeProps.includes(prop)) {
        continue;
      }

      if (!deepEqualValue(prevProps[prop], nextProps[prop], depth)) {
        return false;
      }
    }

    return true;
  };

  return safeMemo(Component, {
    ...restOptions,
    areEqual: deepEqual
  });
}

/**
 * Deep equality check for values with configurable depth
 */
function deepEqualValue(a: any, b: any, maxDepth: number, currentDepth: number = 0): boolean {
  // Identity check
  if (Object.is(ab)) {
    return true;
  }

  // Type check
  if (typeof a !== typeof b) {
    return false;
  }

  // Handle null and undefined
  if (a === null || b === null || a === undefined || b === undefined) {
    return a === b;
  }

  // Depth limit check
  if (currentDepth>= maxDepth) {
    return Object.is(ab);
  }

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i <a.length; i++) {
      if (!deepEqualValue(a[i], b[i], maxDepth, currentDepth + 1)) {
        return false;
      }
    }

    return true;
  }

  // Handle objects
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(bkey)) {
        return false;
      }

      if (!deepEqualValue(a[key], b[key], maxDepth, currentDepth + 1)) {
        return false;
      }
    }

    return true;
  }

  // Handle all other types with default equality
  return Object.is(ab);
}

/**
 * Improved React.memo with shallow equality for array and object props
 */
export function shallowMemo<P extends object>(
  Component: ComponentType<P>,
  options: Omit<SafeMemoOptions<P>, 'areEqual'> = {}
): MemoExoticComponent<ComponentType<P>> {
  // Create shallow comparison function
  const shallowEqual = (prevProps: Readonly<P>, nextProps: Readonly<P>): boolean => {
    const includeProps = options.includeProps;
    const excludeProps = options.excludeProps;

    if (includeProps && includeProps.length> 0) {
      return includeProps.every(prop =>
        shallowEqualValue(prevProps[prop], nextProps[prop])
      );
    }

    const allProps = new Set([
      ...Object.keys(prevProps),
      ...Object.keys(nextProps)
    ]) as Set<keyof P>
  );
    for (const prop of allProps) {
      if (excludeProps && excludeProps.includes(prop)) {
        continue;
      }

      if (!shallowEqualValue(prevProps[prop], nextProps[prop])) {
        return false;
      }
    }

    return true;
  };

  return safeMemo(Component, {
    ...options,
    areEqual: shallowEqual
  });
}

/**
 * Shallow equality check for values
 */
function shallowEqualValue(a: any, b: any): boolean {
  // Identity check
  if (Object.is(ab)) {
    return true;
  }

  // Handle null and undefined
  if (a === null || b === null || a === undefined || b === undefined) {
    return false;
  }

  // Check if both are objects
  if (typeof a !== 'object' || typeof b !== 'object') {
    return Object.is(ab);
  }

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i <a.length; i++) {
      if (!Object.is(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  // Handle plain objects
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(bkey) || !Object.is(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  // Default to identity check
  return Object.is(ab);
}

/**
 * Wrap a function in a memoization container that only updates when
 * the specified dependencies change
 */
export function memoWithDeps<T, Args extends any[]>(
  fn: (...args: Args) => T,
  deps: React.DependencyList,
  options: {
    maxSize?: number;
    debugMode?: boolean;
  } = {}
): (...args: Args) => T {
  const { maxSize = 1, debugMode = false } = options;

  // Create a cache for memoized results
  const cache = new Map<string, { result: T; args: Args }>();

  // Track current deps for reference
  let currentDeps = deps;
  let hasChanged = true;

  // Wrapper function
  return (...args: Args): T => {
    // Check if deps have changed
    if (deps.length === currentDeps.length) {
      const depsChanged = deps.some((depi: any) => !Object.is(dep, currentDeps[i]));
      hasChanged = depsChanged;

      if (!depsChanged) {
        // Deps haven't changed, try to find a cached result
        // Create a key from the args
        const key = JSON.stringify(args);

        if (cache.has(key)) {
          if (debugMode) {

          }
          return cache.get(key)!.result;
        }
      } else if (debugMode) {

      }
    }

    // Update current deps reference
    currentDeps = deps;

    // Calculate the result
    const result = fn(...args);

    // Cache the result
    if (maxSize> 0) {
      const key = JSON.stringify(args);

      // Clear cache if we've reached the max size
      if (cache.size>= maxSize) {
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) {
          cache.delete(firstKey);
        }
      }

      cache.set(key, { result, args });

      if (debugMode) {

      }
    }

    return result;
  };
}

/**
 * Factory that creates specialized memo functions with predefined options
 */
export const MemoFactory = {
  /**
   * Create a safeMemo function with custom default options
   */
  createSafeMemo<P extends object>(defaultOptions: SafeMemoOptions<P> = {}) {
    return (Component: ComponentType<P>, options: SafeMemoOptions<P> = {}) =>
      safeMemo(Component, { ...defaultOptions, ...options });
  },

  /**
   * Create a deep memo function with custom defaults
   */
  createDeepMemo<P extends object>(defaultOptions: Omit<SafeMemoOptions<P>, 'areEqual'> & { depth?: number } = {}) {
    return (Component: ComponentType<P>, options: Omit<SafeMemoOptions<P>, 'areEqual'> & { depth?: number } = {}) =>
      deepMemo(Component, { ...defaultOptions, ...options });
  },

  /**
   * Create a shallow memo function with custom defaults
   */
  createShallowMemo<P extends object>(defaultOptions: Omit<SafeMemoOptions<P>, 'areEqual'> = {}) {
    return (Component: ComponentType<P>, options: Omit<SafeMemoOptions<P>, 'areEqual'> = {}) =>
      shallowMemo(Component, { ...defaultOptions, ...options });
  }
};

/**
 * Export all functions together as default export
 */
export default {
  safeMemo,
  deepMemo,
  shallowMemo,
  memoWithDeps,
  setDebugMode,
  MemoFactory
};