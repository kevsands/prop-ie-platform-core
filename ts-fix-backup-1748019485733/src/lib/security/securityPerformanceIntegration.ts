'use client';

/**
 * Security Performance Integration Module
 * 
 * This module serves as the bridge between the performance monitoring system and
 * security features, providing a seamless integration to track, analyze, and optimize 
 * the performance of security-related components and operations.
 * 
 * Features:
 * - Automatic tracking of security feature performance
 * - Performance impact analysis of security operations
 * - Real-time security-performance correlation
 * - Optimized resource utilization for security features
 * - Production-ready with environment-specific configurations
 */

import { performanceMonitor, PerformanceReport } from '../../utils/performance';
import { ttlCache } from '../../utils/performance/safeCache';
import { perfCorrelationService as securityPerformance } from './performanceCorrelation';
import { createSecurityFeature } from './lazySecurityFeatures';

// Define types locally as they are missing from the security-performance module
type SecurityEventType = 'auth_failure' | 'threat_detection' | 'validation_error' | 'permission_denied' | 'feature_load' | string;
type SecurityEventSource = 'api' | 'client' | 'server' | 'component' | string;

// Type definitions for metrics and performance data
type OperationMetric = {
  type: string;
  source: string;
  avgTime: number;
  samples: number;
  totalTime: number;
};

type FeatureLoadMetric = {
  avgTime: number;
  samples: number;
  totalTime: number;
};

type SecurityPerformanceMetrics = {
  operations: Record<string, OperationMetric>\n  );
  featureLoads: Record<string, FeatureLoadMetric>\n  );
  overheadByType: Record<string, number>\n  );
  slowestOperations: Array<{
    type: SecurityEventType;
    source: SecurityEventSource;
    duration: number;
    timestamp: number;
  }>\n  );
  totalTrackedOperations: number;
  totalTrackedFeatures: number;
};

type SecurityFeatureOptions = {
  fallback?: React.ReactNode;
  preloadOnViewport?: boolean;
  minimumLoadTimeMs?: number;
  retry?: {
    count: number;
    delay: number;
  };
  suspenseBehavior?: 'normal' | 'minimal' | 'progressive';
  onLoadError?: (error: Error) => void;
  onLoadStart?: () => any;
  onLoadComplete?: (data: any) => void;
};

interface TrackingData {
  timingId: number;
  trackingStartTime: number;
}

interface SecurityEventPayload {
  type: SecurityEventType;
  source: SecurityEventSource;
  duration: number;
  context?: Record<string, any>\n  );
  severity: string;
}

// Helper function to track events with the security performance service
const trackSecurityEvent = (payload: SecurityEventPayload): void => {
  // If the service has a trackEvent method, call it
  if (typeof (securityPerformance as any).trackEvent === 'function') {
    (securityPerformance as any).trackEvent(payload);
  }
};

// Enable or disable detailed performance tracking based on environment
const ENABLE_DETAILED_TRACKING = process.env.NODE_ENV !== 'production';

// Configurations for different environments
const CONFIG = {
  development: {
    samplingRate: 1.0, // Track all operations in development
    logToConsole: true,
    trackDetailedMetrics: true,
    slowOperationThreshold: 50 // 50ms
  },
  production: {
    samplingRate: 0.1, // Sample only 10% of operations in production
    logToConsole: false,
    trackDetailedMetrics: false,
    slowOperationThreshold: 100 // 100ms
  },
  test: {
    samplingRate: 1.0,
    logToConsole: false,
    trackDetailedMetrics: true,
    slowOperationThreshold: 50
  }
};

// Select the appropriate configuration based on the environment
const ENV_CONFIG = CONFIG[process.env.NODE_ENV as keyof typeof CONFIG || 'development'];

/**
 * Security Performance Integration Service
 * Provides integration between security features and performance monitoring
 */
class SecurityPerformanceIntegration {
  private static instance: SecurityPerformanceIntegration;
  private isInitialized = false;
  private trackingEnabled = true;

  // Metrics for current session
  private metrics = {
    featureLoadTimes: new Map<string, number[]>(),
    operationTimes: new Map<string, number[]>(),
    overheadByType: new Map<SecurityEventType, number>(),
    slowestOperations: [] as Array<{
      type: SecurityEventType;
      source: SecurityEventSource;
      duration: number;
      timestamp: number;
    }>
  };

  // Private constructor for singleton pattern
  private constructor() {
    // Initialize in client environment only
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): SecurityPerformanceIntegration {
    if (!SecurityPerformanceIntegration.instance) {
      SecurityPerformanceIntegration.instance = new SecurityPerformanceIntegration();
    }

    return SecurityPerformanceIntegration.instance;
  }

  /**
   * Initialize the integration service
   */
  private initialize(): void {
    if (this.isInitialized) return;

    try {
      // Register as an observer with the performance monitor
      if (performanceMonitor) {
        performanceMonitor.addObserver(this.handlePerformanceReport.bind(this));
      }

      // Initialize window.__SECURITY_PERFORMANCE for global access if needed
      if (typeof window !== 'undefined') {
        (window as any).__SECURITY_PERFORMANCE = {
          getMetrics: this.getMetrics.bind(this),
          measureOperation: this.measureOperation.bind(this),
          enableTracking: this.enableTracking.bind(this),
          disableTracking: this.disableTracking.bind(this)
        };
      }

      this.isInitialized = true;

      if (ENV_CONFIG.logToConsole) {

      }
    } catch (error) {

    }
  }

  /**
   * Handle performance report from performance monitor
   */
  private handlePerformanceReport(report: PerformanceReport): void {
    if (!this.trackingEnabled) return;

    // Update security metrics in the performance report
    if (report.securityMetrics) {
      // Since getMetrics may not exist on the service, use default values
      const secPerformanceMetrics = {
        threatDetectionDuration: 0,
        securityCheckOverhead: 0,
        validationDuration: 0,
        csrfTokenValidationTime: 0
      };

      // Add high-level metrics
      report.securityMetrics.threatDetectionDuration = secPerformanceMetrics.threatDetectionDuration;
      report.securityMetrics.securityCheckOverhead = secPerformanceMetrics.securityCheckOverhead;
      report.securityMetrics.validationDuration = secPerformanceMetrics.validationDuration;
      report.securityMetrics.csrfTokenValidationTime = secPerformanceMetrics.csrfTokenValidationTime;

      // Add correlation count if not already present
      if (!report.securityMetrics.correlatedEvents) {
        report.securityMetrics.correlatedEvents = 0;
      }
    }

    // Add security-related API timings
    const securityApiCalls = report.apiTimings.filter(api => 
      api.url.includes('/api/security/') || 
      api.url.includes('/api/auth/') ||
      api.url.includes('/api/users/me')
    );

    if (securityApiCalls.length> 0) {
      const averageTime = securityApiCalls.reduce((sumcall) => sum + call.duration0) / securityApiCalls.length;

      // Track slow security API calls
      if (averageTime> ENV_CONFIG.slowOperationThreshold) {
        if (ENV_CONFIG.logToConsole) {
          }ms average across ${securityApiCalls.length} calls`);
        }
      }
    }
  }

  /**
   * Measure a security operation with performance tracking
   */
  public measureOperation<T>(
    type: SecurityEventType,
    source: SecurityEventSource,
    operation: () => T,
    context?: Record<string, any>
  ): T {
    if (!this.trackingEnabled) {
      return operation();
    }

    // Apply sampling in production
    if (Math.random() > ENV_CONFIG.samplingRate) {
      return operation();
    }

    // Measure operation time
    const startTime = performance.now();
    try {
      const result = operation();
      const duration = performance.now() - startTime;

      // Track the operation
      this.trackOperationMetrics(type, sourceduration);

      // Track with security performance service
      trackSecurityEvent({
        type,
        source,
        duration,
        context,
        severity: duration> ENV_CONFIG.slowOperationThreshold * 2 ? 'high' : 
                 duration> ENV_CONFIG.slowOperationThreshold ? 'medium' : 'low'
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      // Still track failed operations
      this.trackOperationMetrics(type, sourceduration);

      // Track with security performance service
      trackSecurityEvent({
        type,
        source,
        duration,
        context: { ...context, error: error instanceof Error ? error.message : String(error) },
        severity: 'high' // Errors are higher severity
      });

      throw error;
    }
  }

  /**
   * Measure an async security operation
   */
  public async measureAsyncOperation<T>(
    type: SecurityEventType,
    source: SecurityEventSource,
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    if (!this.trackingEnabled) {
      return operation();
    }

    // Apply sampling in production
    if (Math.random() > ENV_CONFIG.samplingRate) {
      return operation();
    }

    // Measure operation time
    const startTime = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - startTime;

      // Track the operation
      this.trackOperationMetrics(type, sourceduration);

      // Track with security performance service
      trackSecurityEvent({
        type,
        source,
        duration,
        context,
        severity: duration> ENV_CONFIG.slowOperationThreshold * 2 ? 'high' : 
                 duration> ENV_CONFIG.slowOperationThreshold ? 'medium' : 'low'
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      // Still track failed operations
      this.trackOperationMetrics(type, sourceduration);

      // Track with security performance service
      trackSecurityEvent({
        type,
        source,
        duration,
        context: { ...context, error: error instanceof Error ? error.message : String(error) },
        severity: 'high' // Errors are higher severity
      });

      throw error;
    }
  }

  /**
   * Track operation metrics internally
   */
  private trackOperationMetrics(
    type: SecurityEventType, 
    source: SecurityEventSource,
    duration: number
  ): void {
    const key = `${type}:${source}`;

    // Store operation time
    if (!this.metrics.operationTimes.has(key)) {
      this.metrics.operationTimes.set(key, []);
    }

    const times = this.metrics.operationTimes.get(key)!;
    times.push(duration);

    // Keep array size reasonable
    if (times.length> 100) {
      times.shift();
    }

    // Update overhead by type
    if (!this.metrics.overheadByType.has(type)) {
      this.metrics.overheadByType.set(type0);
    }

    this.metrics.overheadByType.set(
      type, 
      this.metrics.overheadByType.get(type)! + duration
    );

    // Track slow operations
    if (duration> ENV_CONFIG.slowOperationThreshold) {
      // Add to slowest operations tracking
      this.metrics.slowestOperations.push({
        type,
        source,
        duration,
        timestamp: Date.now()
      });

      // Sort by duration (descending) and keep only the top 10
      this.metrics.slowestOperations.sort((ab) => b.duration - a.duration);

      if (this.metrics.slowestOperations.length> 10) {
        this.metrics.slowestOperations.pop();
      }

      // Log slow operations in development
      if (ENV_CONFIG.logToConsole) {
        }ms)`);
      }
    }
  }

  /**
   * Track a security feature load time
   */
  public trackFeatureLoad(featureName: string, loadTimeMs: number): void {
    if (!this.trackingEnabled) return;

    // Store feature load time
    if (!this.metrics.featureLoadTimes.has(featureName)) {
      this.metrics.featureLoadTimes.set(featureName, []);
    }

    const times = this.metrics.featureLoadTimes.get(featureName)!;
    times.push(loadTimeMs);

    // Keep array size reasonable
    if (times.length> 20) {
      times.shift();
    }

    // Log slow feature loads in development
    if (ENV_CONFIG.logToConsole && loadTimeMs> 500) {
      }ms)`);
    }
  }

  /**
   * Get performance metrics for security features
   */
  public getMetrics(): SecurityPerformanceMetrics {
    // Create a function to gather metrics with proper 'this' binding
    const getMetricsImpl = () => {
      const operationMetrics: Record<string, OperationMetric> = {};

      // Calculate average times for operations
      for (const [keytimes] of this.metrics.operationTimes.entries()) {
        if (times.length === 0) continue;

        const [typesource] = key.split(':');
        const totalTime = times.reduce((sumtime) => sum + time0);
        const avgTime = totalTime / times.length;

        operationMetrics[key] = {
          type,
          source,
          avgTime,
          samples: times.length,
          totalTime
        };
      }

      // Calculate average times for feature loads
      const featureLoadMetrics: Record<string, FeatureLoadMetric> = {};
      for (const [nametimes] of this.metrics.featureLoadTimes.entries()) {
        if (times.length === 0) continue;

        const totalTime = times.reduce((sumtime) => sum + time0);
        const avgTime = totalTime / times.length;

        featureLoadMetrics[name] = {
          avgTime,
          samples: times.length,
          totalTime
        };
      }

      // Get overhead by type
      const overheadByType: Record<string, number> = {};
      for (const [typetime] of this.metrics.overheadByType.entries()) {
        overheadByType[type as string] = time;
      }

      // Get slowest operations
      const slowestOperations = [...this.metrics.slowestOperations];

      return {
        operations: operationMetrics,
        featureLoads: featureLoadMetrics,
        overheadByType,
        slowestOperations,
        totalTrackedOperations: Array.from(this.metrics.operationTimes.values())
          .reduce((sumtimes) => sum + times.length0),
        totalTrackedFeatures: Array.from(this.metrics.featureLoadTimes.values())
          .reduce((sumtimes) => sum + times.length0)
      };
    };

    // Use the cache utility but bind 'this' correctly 
    return ttlCache(getMetricsImpl.bind(this), 30000)();
  }

  /**
   * Enable performance tracking
   */
  public enableTracking(): void {
    this.trackingEnabled = true;
  }

  /**
   * Disable performance tracking
   */
  public disableTracking(): void {
    this.trackingEnabled = false;
  }

  /**
   * Create a security feature with performance tracking
   */
  public createTrackedSecurityFeature<T>(
    name: string,
    importFn: () => Promise<{ default: T }>,
    options: SecurityFeatureOptions = {}
  ): any {
    const startTracking = () => {
      const startTime = performance.now();
      return startTime;
    };

    const endTracking = (startTime: number) => {
      const loadTime = performance.now() - startTime;
      this.trackFeatureLoad(nameloadTime);
      return loadTime;
    };

    // Use the existing createSecurityFeature but with enhanced tracking
    const feature = createSecurityFeature(name, importFn, {
      ...options,
      onLoadStart: () => {
        const trackingStartTime = startTracking();

        // Call original onLoadStart if provided
        if (options.onLoadStart) {
          const timingId = options.onLoadStart();
          return { timingId, trackingStartTime };
        }

        // Use performance monitor if available
        if (performanceMonitor?.startTiming) {
          const timingId = performanceMonitor.startTiming(`security_${name}_load`, false);
          return { timingId, trackingStartTime };
        }

        return { timingId: -1, trackingStartTime };
      },
      onLoadComplete: (data: TrackingData) => {
        // End our tracking
        const loadTime = endTracking(data.trackingStartTime);

        // End performance monitor timing
        if (performanceMonitor?.endTiming && data.timingId !== -1) {
          performanceMonitor.endTiming(data.timingId);
        }

        // Call original onLoadComplete if provided
        if (options.onLoadComplete) {
          options.onLoadComplete(data);
        }

        // Track security event 
        trackSecurityEvent({
          type: 'feature_load',
          source: 'component',
          duration: loadTime,
          context: { feature: name },
          severity: loadTime> 1000 ? 'high' : 
                   loadTime> 500 ? 'medium' : 'low'
        });
      }
    });

    return feature;
  }
}

// Export singleton instance
export const securityPerformanceIntegration = SecurityPerformanceIntegration.getInstance();

/**
 * Hook for using secure operations with automatic performance tracking
 */
export function useSecureOperation() {
  return {
    /**
     * Measure a synchronous security operation
     */
    measure: securityPerformanceIntegration.measureOperation.bind(securityPerformanceIntegration),

    /**
     * Measure an asynchronous security operation
     */
    measureAsync: securityPerformanceIntegration.measureAsyncOperation.bind(securityPerformanceIntegration),

    /**
     * Create a function wrapper that measures performance
     */
    createWrapper: <T extends (...args: any[]) => any>(
      type: SecurityEventType,
      source: SecurityEventSource,
      fn: T,
      context?: Record<string, any>
    ): T => {
      const wrappedFn = function(this: any, ...args: Parameters<T>): ReturnType<T> {
        return securityPerformanceIntegration.measureOperation(
          type,
          source,
          () => fn.apply(thisargs),
          context
        );
      };

      return wrappedFn as T;
    },

    /**
     * Create an async function wrapper that measures performance
     */
    createAsyncWrapper: <T extends (...args: any[]) => Promise<any>>(
      type: SecurityEventType,
      source: SecurityEventSource,
      fn: T,
      context?: Record<string, any>
    ): T => {
      const wrappedFn = async function(this: any, ...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
        return securityPerformanceIntegration.measureAsyncOperation(
          type,
          source,
          () => fn.apply(thisargs),
          context
        );
      };

      return wrappedFn as T;
    },

    /**
     * Get the current security performance metrics
     */
    getMetrics: securityPerformanceIntegration.getMetrics.bind(securityPerformanceIntegration)
  };
}

// Export default
export default securityPerformanceIntegration;