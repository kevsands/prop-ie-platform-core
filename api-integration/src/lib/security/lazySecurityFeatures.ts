'use client';

import React from 'react';
import { lazyComponent, LazyComponentProps } from '@/utils/performance/lazyLoad';
import { performanceMonitor } from '@/utils/performance';
import { securityPerformanceIntegration } from './securityPerformanceIntegration';

/**
 * Enhanced security features with Next.js 15.3.1 optimized code splitting.
 * This module provides efficient lazy loading for security-related components
 * with advanced performance monitoring, error handling, and automatic retries.
 */

/**
 * Configuration for creating security feature components
 */
interface SecurityFeatureOptions {
  fallback?: React.ReactNode;
  preloadOnViewport?: boolean;
  minimumLoadTimeMs?: number;
  retry?: {
    count: number;
    delay: number;
  };
  suspenseBehavior?: 'normal' | 'delayed'; 
  onLoadError?: (error: Error) => void;
}

/**
 * Creates a security feature with enhanced code splitting and telemetry
 * This version is optimized for Next.js 15.3.1 and includes comprehensive 
 * performance monitoring integration
 */
export function createSecurityFeature<P extends LazyComponentProps>(
  name: string,
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  options: SecurityFeatureOptions = {}
) {
  // Check if we should use the enhanced performance integration
  const useEnhancedPerformance = typeof securityPerformanceIntegration !== 'undefined';
  
  // Create a performance-tracked import function
  const trackedImportFn = () => {
    const loadStartTime = performance.now();
    return importFn()
      .then(module => {
        if (useEnhancedPerformance) {
          // Track loading time with security performance metrics
          const loadTime = performance.now() - loadStartTime;
          securityPerformanceIntegration.trackFeatureLoad(name, loadTime);
        }
        return module;
      })
      .catch(error => {
        if (useEnhancedPerformance) {
          // Also track failed loads
          const loadTime = performance.now() - loadStartTime;
          securityPerformanceIntegration.trackFeatureLoad(`${name}_failed`, loadTime);
        }
        throw error;
      });
  };

  // Define tracking data type for better type safety
  interface TrackingData {
    startTime: number;
    timingId: number;
  }

  // Create a lazy-loaded component with enhanced error handling and telemetry
  const Component = lazyComponent<P>(trackedImportFn, {
    displayName: `Security_${name}`,
    fallback: options.fallback || React.createElement('div', { className: "security-feature-loading" }, 'Loading security feature...'),
    preloadOnViewport: options.preloadOnViewport ?? false,
    minimumLoadTimeMs: options.minimumLoadTimeMs ?? 0,
    retry: options.retry || { count: 3, delay: 1000 },
    suspenseBehavior: options.suspenseBehavior || 'normal',
    onLoadStart: () => {
      // Create a tracking object to carry timing data
      const trackingData: TrackingData = {
        startTime: performance.now(),
        timingId: -1
      };
      
      // Start timing with performance monitor if available
      if (performanceMonitor?.startTiming) {
        trackingData.timingId = performanceMonitor.startTiming(`security_${name}_load`, false);
      }
      
      return trackingData;
    },
    onLoadComplete: function() {
      const trackingData = arguments[0] as TrackingData;
      // End timing with performance monitor if available
      if (performanceMonitor?.endTiming && trackingData.timingId !== -1) {
        performanceMonitor.endTiming(trackingData.timingId);
      }
      
      // Calculate load time for security performance metrics
      if (useEnhancedPerformance) {
        const loadTime = performance.now() - trackingData.startTime;
        securityPerformanceIntegration.trackFeatureLoad(name, loadTime);
      }
    },
    onLoadError: (error: Error, trackingData?: TrackingData) => {
      // Track with security performance if available
      if (useEnhancedPerformance && trackingData) {
        const loadTime = performance.now() - trackingData.startTime;
        securityPerformanceIntegration.trackFeatureLoad(`${name}_error`, loadTime);
      }
      
      // Call custom error handler if provided
      if (options.onLoadError) {
        options.onLoadError(error);
      }
    }
  });
  
  // Return enhanced component with utilities
  return {
    Component,
    
    // Preload the component with performance tracking
    preload: () => {
      // Track preload time
      const preloadStartTime = performance.now();
      
      // Preload with performance tracking
      const promise = importFn();
      
      // Track results
      promise
        .then(() => {
          if (useEnhancedPerformance) {
            const loadTime = performance.now() - preloadStartTime;
            securityPerformanceIntegration.trackFeatureLoad(`${name}_preload`, loadTime);
          }
        })
        .catch(error => {
          console.error(`Failed to preload security feature "${name}":`, error);
          
          if (useEnhancedPerformance) {
            const loadTime = performance.now() - preloadStartTime;
            securityPerformanceIntegration.trackFeatureLoad(`${name}_preload_failed`, loadTime);
          }
        });
      
      return promise;
    },
    
    // Check if the component is preloaded
    isPreloaded: () => {
      // This is a best-effort check - it cannot guarantee the component is fully preloaded
      try {
        // Check if module is in webpack's module cache
        const moduleCache = (window as any).__webpack_module_cache__;
        if (moduleCache) {
          // Look for module by name pattern
          const moduleIds = Object.keys(moduleCache);
          const foundModule = moduleIds.some(id => {
            const module = moduleCache[id];
            return module && 
                  module.exports && 
                  (module.exports.__esModule || module.exports.default) &&
                  (module.id || '').includes(name.toLowerCase());
          });
          
          return foundModule;
        }
      } catch (e) {
        // Ignore errors in checking, just return false
        console.debug(`Error checking if ${name} is preloaded:`, e);
      }
      
      return false;
    }
  };
}

// Define component prop types
interface MFAChallengeProps {
  onComplete: (success: boolean) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

interface MFASetupProps {
  onSetupComplete: () => void;
  onCancel?: () => void;
}

interface SecurityDashboardProps {}

/**
 * Lazy loaded MFA Setup component with enhanced error handling
 */
export const MFASetup = createSecurityFeature<MFASetupProps>(
  'MFASetup',
  () => import('@/components/security/mfa/MFASetup').then(module => ({ default: module.default })),
  {
    fallback: React.createElement('div', { className: "p-4 border rounded-md bg-gray-50" }, 'Loading MFA setup...'),
    retry: { count: 3, delay: 800 }
  }
);

/**
 * Lazy loaded MFA Challenge component
 */
// Define our own props type to avoid dependency issues
interface InternalMFAChallengeProps {
  onCompleteAction: (success: boolean) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

export const MFAChallenge = createSecurityFeature<InternalMFAChallengeProps>(
  'MFAChallenge',
  async () => {
    const module = await import('@/components/security/MFAChallenge');
    return { default: module.MFAChallenge };
  },
  {
    fallback: React.createElement('div', { className: "p-4 border rounded-md bg-gray-50" }, 'Loading MFA verification...'),
    minimumLoadTimeMs: 300 // Prevent flickering for fast loads
  }
);

/**
 * Lazy loaded Trusted Devices management component
 */
export const TrustedDevices = createSecurityFeature<LazyComponentProps>(
  'TrustedDevices',
  () => import('@/components/security/TrustedDevices').then(module => ({ default: module.default })),
  {
    preloadOnViewport: true // Preload when component enters viewport
  }
);

/**
 * Lazy loaded Security Dashboard with optimizations
 */
export const SecurityDashboard = createSecurityFeature<SecurityDashboardProps>(
  'SecurityDashboard',
  () => import('@/components/security/SecurityDashboard').then(module => ({ default: module.SecurityDashboard })),
  {
    fallback: React.createElement('div', { className: "p-4 border rounded-md bg-gray-50" }, 'Loading security overview...')
  }
);

/**
 * Lazy loaded Enhanced Security Dashboard with advanced features
 */
export const EnhancedSecurityDashboard = createSecurityFeature(
  'EnhancedSecurityDashboard',
  () => import('@/components/security/EnhancedSecurityDashboard'),
  {
    fallback: React.createElement('div', { className: "p-6 border rounded-md bg-gray-50" }, [
      React.createElement('div', { className: "h-6 bg-gray-200 rounded animate-pulse mb-4 w-3/4", key: "1" }),
      React.createElement('div', { className: "h-24 bg-gray-200 rounded animate-pulse mb-4", key: "2" }),
      React.createElement('div', { className: "h-40 bg-gray-200 rounded animate-pulse", key: "3" })
    ])
  }
);

/**
 * Lazy loaded Security Setup Wizard
 */
export const SecuritySetupWizard = createSecurityFeature(
  'SecuritySetupWizard',
  () => import('@/components/security/SecuritySetupWizard'),
  {
    fallback: React.createElement('div', { className: "p-6 border rounded-md bg-gray-50" }, 'Loading security setup wizard...'),
    retry: { count: 3, delay: 1000 }
  }
);

/**
 * Lazy loaded Security Monitoring Dashboard
 */
export const SecurityMonitoringDashboard = createSecurityFeature(
  'SecurityMonitoringDashboard',
  () => import('@/components/security/SecurityMonitoringDashboard'),
  {
    fallback: React.createElement('div', { className: "p-6 border rounded-md bg-gray-50" }, 'Loading security monitoring...')
  }
);

/**
 * Preload all critical security components during idle time
 * This function should be called when the user navigates to a security-related page
 * or when the user is likely to use security features soon
 * 
 * This version uses performance monitoring to track preload times and success rates
 */
export function preloadCriticalSecurityComponents() {
  // Track overall preload operation 
  const startTime = performance.now();
  let loadedCount = 0;
  
  // Function to track completion of preloading
  const trackPreloadCompletion = () => {
    loadedCount++;
    
    // If we've loaded 2 components (dashboard and enhanced dashboard), log metrics
    if (loadedCount === 2) {
      const totalTime = performance.now() - startTime;
      
      // Track with security performance metrics if available
      if (typeof securityPerformanceIntegration !== 'undefined') {
        securityPerformanceIntegration.trackFeatureLoad('critical_security_components', totalTime);
      }
      
      // Track with standard performance metrics
      if (performanceMonitor && typeof performanceMonitor.recordCustomMetric === 'function') {
        performanceMonitor.recordCustomMetric(
          'security_preload_complete', 
          totalTime,
          {
            components: ['SecurityDashboard', 'EnhancedSecurityDashboard'],
            timing: totalTime
          }
        );
      }
    }
  };
  
  // Use optimal scheduling strategy based on environment
  const isLowPriorityPreload = process.env.NODE_ENV === 'production';
  
  // Use requestIdleCallback if available, otherwise setTimeout
  const schedulePreload = (fn: () => void) => {
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window && isLowPriorityPreload) {
        // Use idle callback for low priority background loading
        (window as any).requestIdleCallback(fn, { timeout: 2000 });
      } else {
        // Use regular setTimeout with a short delay for higher priority loading
        setTimeout(fn, isLowPriorityPreload ? 200 : 50);
      }
    }
  };

  // Schedule preloading components
  schedulePreload(() => {
    // Preload dashboard with tracking
    SecurityDashboard.preload()
      .then(() => trackPreloadCompletion())
      .catch(() => trackPreloadCompletion());
    
    // Preload enhanced dashboard with tracking
    EnhancedSecurityDashboard.preload()
      .then(() => trackPreloadCompletion())
      .catch(() => trackPreloadCompletion());
  });
}

/**
 * Preload MFA components when the user is about to use MFA features
 * This version uses performance monitoring to track preload times and success rates
 */
export function preloadMFAComponents() {
  // Track overall preload operation
  const startTime = performance.now();
  let loadedCount = 0;
  
  // Function to track completion of preloading
  const trackPreloadCompletion = () => {
    loadedCount++;
    
    // If we've loaded both components, log metrics
    if (loadedCount === 2) {
      const totalTime = performance.now() - startTime;
      
      // Track with security performance metrics if available
      if (typeof securityPerformanceIntegration !== 'undefined') {
        securityPerformanceIntegration.trackFeatureLoad('mfa_components', totalTime);
      }
      
      // Track with standard performance metrics
      if (performanceMonitor && typeof performanceMonitor.recordCustomMetric === 'function') {
        performanceMonitor.recordCustomMetric(
          'security_preload_mfa_components', 
          totalTime,
          {
            components: ['MFASetup', 'MFAChallenge'],
            timing: totalTime
          }
        );
      }
    }
  };
  
  // Preload with tracking
  MFASetup.preload()
    .then(() => trackPreloadCompletion())
    .catch(() => trackPreloadCompletion());
    
  MFAChallenge.preload()
    .then(() => trackPreloadCompletion())
    .catch(() => trackPreloadCompletion());
}

/**
 * Preload security monitoring components for admin users
 * This version uses performance monitoring to track preload times and success rates
 */
export function preloadSecurityMonitoring() {
  // Track preload operation
  const startTime = performance.now();
  
  // Preload with tracking
  SecurityMonitoringDashboard.preload()
    .then(() => {
      const loadTime = performance.now() - startTime;
      
      // Track with security performance metrics if available
      if (typeof securityPerformanceIntegration !== 'undefined') {
        securityPerformanceIntegration.trackFeatureLoad('security_monitoring', loadTime);
      }
      
      // Track with standard performance metrics
      if (performanceMonitor && typeof performanceMonitor.recordCustomMetric === 'function') {
        performanceMonitor.recordCustomMetric(
          'security_monitoring_preload', 
          loadTime,
          {
            components: ['SecurityMonitoringDashboard'],
            timing: loadTime
          }
        );
      }
    })
    .catch(error => {
      console.error('Failed to preload security monitoring:', error);
      
      // Track failure with security performance metrics if available
      if (typeof securityPerformanceIntegration !== 'undefined') {
        const loadTime = performance.now() - startTime;
        securityPerformanceIntegration.trackFeatureLoad('security_monitoring_failed', loadTime);
      }
    });
}

export default {
  createSecurityFeature,
  MFASetup,
  MFAChallenge,
  TrustedDevices,
  SecurityDashboard,
  EnhancedSecurityDashboard,
  SecuritySetupWizard,
  SecurityMonitoringDashboard,
  preloadCriticalSecurityComponents,
  preloadMFAComponents,
  preloadSecurityMonitoring
};