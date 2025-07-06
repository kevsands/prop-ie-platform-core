/**
 * Custom type definitions for Web Performance API
 * These types supplement the standard DOM types with specific properties
 * used in our performance monitoring system.
 */

interface PerformanceEntryExtended extends PerformanceEntry {
  /** 
   * Property to check if a layout shift happened after user input
   * (for Cumulative Layout Shift calculation)
   */
  hadRecentInput?: boolean;
  
  /**
   * The value of a layout shift (for CLS calculation)
   */
  value?: number;
  
  /**
   * Processing start time (for First Input Delay calculation)
   */
  processingStart?: number;
}

interface PerformanceMemory {
  /**
   * Total size of the JS heap (in bytes)
   */
  totalJSHeapSize: number;
  
  /**
   * Currently used JS heap size (in bytes)
   */
  usedJSHeapSize: number;
  
  /**
   * Maximum size of the JS heap (in bytes)
   */
  jsHeapSizeLimit: number;
}

interface Performance {
  /**
   * Memory information (only available in some browsers)
   */
  memory?: PerformanceMemory;
}

// Type for the entries returned by PerformanceObserver
declare type PerformanceObserverEntryList = {
  getEntries(): PerformanceEntryExtended[];
  getEntriesByType(type: string): PerformanceEntryExtended[];
  getEntriesByName(name: string, type?: string): PerformanceEntryExtended[];
};

// Extended PerformanceObserver to work with our custom entry types
interface PerformanceObserverEx {
  new(callback: (list: PerformanceObserverEntryList, observer: PerformanceObserver) => void): PerformanceObserver;
  observe(options: { entryTypes: string[] } | { type: string, buffered?: boolean }): void;
  disconnect(): void;
  takeRecords(): PerformanceEntryExtended[];
}

// Make the global PerformanceObserver match our extended type
declare let PerformanceObserver: PerformanceObserverEx;

// Extend window with analytics property for metrics reporting
interface Window {
  analytics?: {
    track(eventName: string, properties: Record<string, any>): void;
  };
}