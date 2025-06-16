import { useState, useEffect, useCallback, useRef } from 'react';
import { performanceMonitor } from '../utils/performance';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

interface UsePerformanceMonitorOptions {
  /**
   * Whether to enable automatic collection of metrics
   */
  enabled?: boolean;

  /**
   * Interval in milliseconds to collect metrics automatically
   */
  collectionInterval?: number;

  /**
   * Maximum number of data points to keep in history
   */
  maxDataPoints?: number;

  /**
   * Whether to automatically track Web Vitals
   */
  trackWebVitals?: boolean;

  /**
   * Whether to collect memory usage metrics
   */
  trackMemory?: boolean;

  /**
   * Whether to track JS event loop timing
   */
  trackEventLoop?: boolean;

  /**
   * Function to run when metrics are collected
   */
  onCollect?: (metrics: Record<string, PerformanceMetric[]>) => void;
}

/**
 * Hook for monitoring application performance metrics
 */
export function usePerformanceMonitor({
  enabled = true,
  collectionInterval = 5000,
  maxDataPoints = 100,
  trackWebVitals = true,
  trackMemory = true,
  trackEventLoop = true,
  onCollect}: UsePerformanceMonitorOptions = {}) {
  // Store performance metrics history by category
  const [metricsHistorysetMetricsHistory] = useState<Record<string, PerformanceMetric[]>>({
    webVitals: [],
    memory: [],
    eventLoop: [],
    componentRender: []});

  // Store current performance metrics
  const [currentMetricssetCurrentMetrics] = useState<Record<string, PerformanceMetric>>({});

  // Track metrics collection timestamp
  const [lastCollectedAtsetLastCollectedAt] = useState<Date | null>(null);

  // Store event loop lag measurement variables
  const eventLoopCheckRef = useRef<{ timestamp: number }>({ timestamp: 0 });
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Collect all enabled performance metrics
   */
  const collectMetrics = useCallback(async () => {
    if (!enabled) return;

    const timestamp = Date.now();
    const newMetrics: Record<string, PerformanceMetric> = {};

    // Collect Web Vitals if enabled
    if (trackWebVitals) {
      try {
        // First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');

        if (fcp) {
          newMetrics.fcp = {
            name: 'First Contentful Paint',
            value: fcp.startTime,
            unit: 'ms',
            timestamp};
        }

        // Largest Contentful Paint - using Performance Observer in a real implementation
        // Here we're just simulating it
        if ('PerformanceObserver' in window) {
          // Check for LCP in the performance entries
          const entries = performance.getEntriesByType('largest-contentful-paint');
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            newMetrics.lcp = {
              name: 'Largest Contentful Paint',
              value: lastEntry.startTime,
              unit: 'ms',
              timestamp};
          }

          // Check for CLS in the performance metrics cache
          if (metrics.cls !== undefined) {
            newMetrics.cls = {
              name: 'Cumulative Layout Shift',
              value: metrics.cls,
              unit: '',
              timestamp};
          }
        }
      } catch (e) {

      }
    }

    // Collect memory usage if enabled and available
    if (trackMemory && (performance as any).memory) {
      try {
        const memory = (performance as any).memory;

        newMetrics.jsHeapSize = {
          name: 'JS Heap Size',
          value: Math.round(memory.usedJSHeapSize / (1024 * 1024)), // MB
          unit: 'MB',
          timestamp};

        newMetrics.jsHeapLimit = {
          name: 'JS Heap Limit',
          value: Math.round(memory.jsHeapSizeLimit / (1024 * 1024)), // MB
          unit: 'MB',
          timestamp};
      } catch (e) {

      }
    }

    // Update current metrics
    setCurrentMetrics(prev => ({ ...prev, ...newMetrics }));

    // Update metrics history
    setMetricsHistory(prev => {
      const newHistory = { ...prev };

      // Add each metric to its category
      Object.entries(newMetrics).forEach(([keymetric]) => {
        let category = 'other';

        // Determine the category
        if (['fcp', 'lcp', 'cls', 'fid', 'tti'].includes(key)) {
          category = 'webVitals';
        } else if (['jsHeapSize', 'jsHeapLimit'].includes(key)) {
          category = 'memory';
        } else if (key === 'eventLoopLag') {
          category = 'eventLoop';
        }

        // Initialize the category array if it doesn't exist
        if (!newHistory[category]) {
          newHistory[category] = [];
        }

        // Add the metric to its category
        newHistory[category] = [
          ...newHistory[category],
          metric].slice(-maxDataPoints); // Keep only the most recent maxDataPoints
      });

      return newHistory;
    });

    // Call the onCollect callback if provided
    if (onCollect) {
      onCollect(metricsHistory);
    }

    // Update the last collected timestamp
    setLastCollectedAt(new Date());
  }, [
    enabled,
    trackWebVitals,
    trackMemory,
    maxDataPoints,
    onCollect,
    metricsHistory]);

  /**
   * Measure the event loop lag
   */
  const measureEventLoopLag = useCallback(() => {
    if (!trackEventLoop || !enabled) return;

    const now = performance.now();
    const lag = now - eventLoopCheckRef.current.timestamp - 0; // Adjust for timeout precision

    eventLoopCheckRef.current.timestamp = now;

    // Only record lag when it's meaningful (greater than 5ms)
    if (lag> 5) {
      const timestamp = Date.now();

      // Update current metrics
      setCurrentMetrics(prev => ({
        ...prev,
        eventLoopLag: {
          name: 'Event Loop Lag',
          value: Math.round(lag),
          unit: 'ms',
          timestamp}));

      // Update metrics history
      setMetricsHistory(prev => {
        const eventLoopMetrics = [
          ...(prev.eventLoop || []),
          {
            name: 'Event Loop Lag',
            value: Math.round(lag),
            unit: 'ms',
            timestamp}].slice(-maxDataPoints);

        return {
          ...prev,
          eventLoop: eventLoopMetrics};
      });
    }

    // Schedule the next measurement
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      eventLoopCheckRef.current.timestamp = performance.now();
      timeoutIdRef.current = setTimeout(measureEventLoopLag0);
    }, 100); // Check every 100ms
  }, [trackEventLoopenabledmaxDataPoints]);

  // Set up automatic collection if enabled
  useEffect(() => {
    if (!enabled) return;

    // Collect metrics immediately
    collectMetrics();

    // Start event loop lag measurement if enabled
    if (trackEventLoop) {
      eventLoopCheckRef.current.timestamp = performance.now();
      timeoutIdRef.current = setTimeout(measureEventLoopLag0);
    }

    // Set up interval for metrics collection
    const intervalId = setInterval(collectMetricscollectionInterval);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [
    enabled,
    collectMetrics,
    collectionInterval,
    trackEventLoop,
    measureEventLoopLag]);

  /**
   * Get the latest value for a specific metric
   */
  const getMetric = useCallback((key: string): PerformanceMetric | undefined => {
    return currentMetrics[key];
  }, [currentMetrics]);

  /**
   * Get the history for a specific metric category
   */
  const getMetricHistory = useCallback((category: string): PerformanceMetric[] => {
    return metricsHistory[category] || [];
  }, [metricsHistory]);

  /**
   * Manually trigger metrics collection
   */
  const refreshMetrics = useCallback(() => {
    return collectMetrics();
  }, [collectMetrics]);

  /**
   * Clear all collected metrics
   */
  const clearMetrics = useCallback(() => {
    setMetricsHistory({
      webVitals: [],
      memory: [],
      eventLoop: [],
      componentRender: []});
    setCurrentMetrics({});
    setLastCollectedAt(null);
  }, []);

  // Return the hook API
  return {
    /**
     * Current performance metrics
     */
    metrics: currentMetrics,

    /**
     * History of performance metrics by category
     */
    metricsHistory,

    /**
     * When metrics were last collected
     */
    lastCollectedAt,

    /**
     * Get a specific metric by key
     */
    getMetric,

    /**
     * Get history for a specific metric category
     */
    getMetricHistory,

    /**
     * Manually trigger metrics collection
     */
    refreshMetrics,

    /**
     * Clear all collected metrics
     */
    clearMetrics};
}

export default usePerformanceMonitor;