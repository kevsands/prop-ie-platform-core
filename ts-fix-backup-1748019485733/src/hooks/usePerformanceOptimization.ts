import { useCallback, useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
}

export function usePerformanceOptimization() {
  const [metricssetMetrics] = useState<PerformanceMetrics>({});
  const [resourcessetResources] = useState<ResourceTiming[]>([]);
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Observe Core Web Vitals
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry: any) => {
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => ({ ...prev, lcp: entry.renderTime || entry.loadTime }));
          }

          if (entry.entryType === 'first-input') {
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
          }

          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + entry.value }));
          }
        });
      });

      observerRef.current.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });

      // Measure FCP and TTFB
      if ('performance' in window) {
        const nav = performance.getEntriesByType('navigation')[0] as any;
        if (nav) {
          setMetrics(prev => ({ 
            ...prev, 
            ttfb: nav.responseStart - nav.requestStart 
          }));
        }

        const paint = performance.getEntriesByType('paint');
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          setMetrics(prev => ({ ...prev, fcp: fcp.startTime }));
        }
      }

      // Monitor resource loading
      const resourceEntries = performance.getEntriesByType('resource') as any[];
      const resourceTimings: ResourceTiming[] = resourceEntries.map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize || 0,
        type: entry.initiatorType
      }));
      setResources(resourceTimings);

    } catch (error) {

    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const getNetworkInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }, []);

  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }, []);

  const reportMetric = useCallback((metric: string, value: number) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric, {
        value: Math.round(value),
        metric_value: value,
        metric_delta: value,
        metric_rating: value <2500 ? 'good' : value <4000 ? 'needs-improvement' : 'poor'
      });
    }
  }, []);

  return {
    metrics,
    resources,
    getNetworkInfo,
    getMemoryUsage,
    reportMetric
  };
}