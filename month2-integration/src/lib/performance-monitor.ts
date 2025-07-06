// Performance monitoring and analytics for PROP.ie platform
import { captureException } from '@sentry/nextjs';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  page?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private sessionId: string;
  private isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = process.env.NODE_ENV === 'production' && 
                     process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
    
    if (typeof window !== 'undefined' && this.isEnabled) {
      this.initializeWebVitals();
      this.setupPerformanceObserver();
    }
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async initializeWebVitals() {
    try {
      const { getCLS, getFID, getFCP, getLCP, getTTFB, onINP } = await import('web-vitals');
      
      const handleMetric = (metric: WebVitalsMetric) => {
        this.recordMetric({
          name: `webvital_${metric.name}`,
          value: metric.value,
          timestamp: Date.now(),
          page: window.location.pathname,
          metadata: {
            id: metric.id,
            delta: metric.delta,
            rating: metric.rating,
            navigationType: this.getNavigationType(),
            connectionType: this.getConnectionType()
          }
        });
      };

      getCLS(handleMetric);
      getFID(handleMetric);
      getFCP(handleMetric);
      getLCP(handleMetric);
      getTTFB(handleMetric);
      onINP(handleMetric);
    } catch (error) {
      console.warn('Web Vitals not available:', error);
    }
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Monitor Long Tasks
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric({
              name: 'long_task',
              value: entry.duration,
              timestamp: Date.now(),
              page: window.location.pathname,
              metadata: {
                entryType: entry.entryType,
                startTime: entry.startTime
              }
            });
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        console.warn('Long Task Observer not supported');
      }

      // Monitor Resource Loading
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 1000) { // Only log slow resources (>1s)
              this.recordMetric({
                name: 'slow_resource',
                value: entry.duration,
                timestamp: Date.now(),
                page: window.location.pathname,
                metadata: {
                  resourceName: entry.name,
                  resourceType: (entry as PerformanceResourceTiming).initiatorType,
                  transferSize: (entry as PerformanceResourceTiming).transferSize
                }
              });
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('Resource Observer not supported');
      }
    }
  }

  private getNavigationType(): string {
    if ('connection' in navigator) {
      return (navigator as any).connection?.type || 'unknown';
    }
    return 'unknown';
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || connection?.type || 'unknown';
    }
    return 'unknown';
  }

  recordMetric(metric: Omit<PerformanceMetric, 'sessionId'>): void {
    if (!this.isEnabled) return;

    const fullMetric: PerformanceMetric = {
      ...metric,
      sessionId: this.sessionId,
      userId: this.getCurrentUserId()
    };

    this.metrics.push(fullMetric);

    // Send immediately for critical metrics
    if (this.isCriticalMetric(metric.name)) {
      this.sendMetric(fullMetric);
    }

    // Batch send every 10 metrics or 30 seconds
    if (this.metrics.length >= 10) {
      this.flushMetrics();
    }
  }

  private isCriticalMetric(name: string): boolean {
    const criticalMetrics = ['webvital_LCP', 'webvital_FID', 'webvital_CLS', 'long_task'];
    return criticalMetrics.includes(name);
  }

  private getCurrentUserId(): string | undefined {
    try {
      // Try to get user ID from various sources
      if (typeof window !== 'undefined') {
        // From localStorage/sessionStorage
        const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (stored) {
          const user = JSON.parse(stored);
          return user.id || user.userId;
        }
        
        // From cookies
        const match = document.cookie.match(/userId=([^;]+)/);
        if (match) return match[1];
      }
    } catch (error) {
      // Silently fail
    }
    return undefined;
  }

  recordPageView(page: string, metadata?: Record<string, any>): void {
    this.recordMetric({
      name: 'page_view',
      value: 1,
      timestamp: Date.now(),
      page,
      metadata: {
        referrer: typeof window !== 'undefined' ? document.referrer : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        viewport: typeof window !== 'undefined' ? 
          `${window.innerWidth}x${window.innerHeight}` : undefined,
        ...metadata
      }
    });
  }

  recordUserAction(action: string, metadata?: Record<string, any>): void {
    this.recordMetric({
      name: 'user_action',
      value: 1,
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      metadata: {
        action,
        ...metadata
      }
    });
  }

  recordError(error: Error, context?: Record<string, any>): void {
    this.recordMetric({
      name: 'error',
      value: 1,
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      metadata: {
        message: error.message,
        stack: error.stack,
        name: error.name,
        ...context
      }
    });

    // Also send to Sentry if available
    if (captureException) {
      captureException(error, { contexts: { performance: context } });
    }
  }

  recordAPICall(endpoint: string, duration: number, status: number, metadata?: Record<string, any>): void {
    this.recordMetric({
      name: 'api_call',
      value: duration,
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      metadata: {
        endpoint,
        status,
        success: status >= 200 && status < 300,
        ...metadata
      }
    });
  }

  private async sendMetric(metric: PerformanceMetric): Promise<void> {
    try {
      await fetch('/api/analytics/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.warn('Failed to send metric:', error);
    }
  }

  private async flushMetrics(): Promise<void> {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      await fetch('/api/analytics/metrics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metrics: metricsToSend }),
      });
    } catch (error) {
      console.warn('Failed to flush metrics:', error);
      // Re-add metrics on failure (with limit to prevent memory issues)
      this.metrics = [...metricsToSend.slice(-50), ...this.metrics].slice(0, 100);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  async generateReport(): Promise<{
    summary: Record<string, any>;
    metrics: PerformanceMetric[];
    recommendations: string[];
  }> {
    const metrics = this.getMetrics();
    const webVitals = metrics.filter(m => m.name.startsWith('webvital_'));
    const apiCalls = metrics.filter(m => m.name === 'api_call');
    const errors = metrics.filter(m => m.name === 'error');

    const summary = {
      totalMetrics: metrics.length,
      sessionDuration: metrics.length > 0 ? 
        Math.max(...metrics.map(m => m.timestamp)) - Math.min(...metrics.map(m => m.timestamp)) : 0,
      pageViews: metrics.filter(m => m.name === 'page_view').length,
      userActions: metrics.filter(m => m.name === 'user_action').length,
      errors: errors.length,
      avgApiResponse: apiCalls.length > 0 ? 
        apiCalls.reduce((sum, m) => sum + m.value, 0) / apiCalls.length : 0,
      webVitalsScore: this.calculateWebVitalsScore(webVitals)
    };

    const recommendations = this.generateRecommendations(summary, metrics);

    return {
      summary,
      metrics,
      recommendations
    };
  }

  private calculateWebVitalsScore(webVitals: PerformanceMetric[]): number {
    if (webVitals.length === 0) return 0;
    
    const scoreMap: Record<string, number> = {
      'good': 100,
      'needs-improvement': 50,
      'poor': 0
    };

    const totalScore = webVitals.reduce((sum, metric) => {
      const rating = metric.metadata?.rating || 'poor';
      return sum + (scoreMap[rating] || 0);
    }, 0);

    return Math.round(totalScore / webVitals.length);
  }

  private generateRecommendations(summary: Record<string, any>, metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = [];

    if (summary.webVitalsScore < 70) {
      recommendations.push('Improve Core Web Vitals scores - consider optimizing LCP, FID, and CLS');
    }

    if (summary.avgApiResponse > 1000) {
      recommendations.push('API response times are slow - consider caching and optimization');
    }

    if (summary.errors > 0) {
      recommendations.push(`${summary.errors} errors detected - investigate error handling`);
    }

    const longTasks = metrics.filter(m => m.name === 'long_task');
    if (longTasks.length > 5) {
      recommendations.push('Multiple long tasks detected - consider code splitting and optimization');
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance is good! Continue monitoring for optimization opportunities');
    }

    return recommendations;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for React components
export function usePerformanceMonitor() {
  return {
    recordPageView: performanceMonitor.recordPageView.bind(performanceMonitor),
    recordUserAction: performanceMonitor.recordUserAction.bind(performanceMonitor),
    recordError: performanceMonitor.recordError.bind(performanceMonitor),
    recordAPICall: performanceMonitor.recordAPICall.bind(performanceMonitor),
    generateReport: performanceMonitor.generateReport.bind(performanceMonitor)
  };
}

export default performanceMonitor;