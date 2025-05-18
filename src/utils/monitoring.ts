import { headers } from 'next/headers';

// Performance monitoring interfaces
interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface PerformanceReport {
  totalDuration: number;
  metrics: PerformanceMetric[];
  slowOperations: PerformanceMetric[];
  timestamp: string;
}

// Performance monitoring class
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private startTime: number;
  private slowThreshold: number = 1000; // 1 second
  
  constructor(slowThreshold?: number) {
    this.startTime = Date.now();
    if (slowThreshold) {
      this.slowThreshold = slowThreshold;
    }
  }
  
  // Start timing an operation
  start(name: string, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      startTime: Date.now(),
      metadata
    };
    this.metrics.set(name, metric);
  }
  
  // End timing an operation
  end(name: string): number {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`No metric found for ${name}`);
      return 0;
    }
    
    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;
    
    // Log slow operations
    if (metric.duration > this.slowThreshold) {
      console.warn(`Slow operation detected: ${name} took ${metric.duration}ms`);
    }
    
    return metric.duration;
  }
  
  // Get a specific metric
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }
  
  // Get all metrics
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }
  
  // Get performance report
  getReport(): PerformanceReport {
    const metrics = this.getAllMetrics();
    const slowOperations = metrics.filter(
      m => m.duration && m.duration > this.slowThreshold
    );
    
    return {
      totalDuration: Date.now() - this.startTime,
      metrics,
      slowOperations,
      timestamp: new Date().toISOString()
    };
  }
  
  // Clear all metrics
  clear() {
    this.metrics.clear();
    this.startTime = Date.now();
  }
}

// Global performance monitor
let globalMonitor: PerformanceMonitor | null = null;

export function getGlobalMonitor(): PerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor();
  }
  return globalMonitor;
}

// Utility functions for common monitoring tasks
export async function monitorAsyncOperation<T>(
  name: string,
  operation: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const monitor = getGlobalMonitor();
  monitor.start(name, metadata);
  
  try {
    const result = await operation();
    const duration = monitor.end(name);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Operation ${name} completed in ${duration}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = monitor.end(name);
    console.error(`Operation ${name} failed after ${duration}ms:`, error);
    throw error;
  }
}

export function monitorSyncOperation<T>(
  name: string,
  operation: () => T,
  metadata?: Record<string, any>
): T {
  const monitor = getGlobalMonitor();
  monitor.start(name, metadata);
  
  try {
    const result = operation();
    const duration = monitor.end(name);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Operation ${name} completed in ${duration}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = monitor.end(name);
    console.error(`Operation ${name} failed after ${duration}ms:`, error);
    throw error;
  }
}

// Memory usage monitoring
export function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
    external: Math.round(usage.external / 1024 / 1024), // MB
    rss: Math.round(usage.rss / 1024 / 1024), // MB
    percentage: (usage.heapUsed / usage.heapTotal) * 100
  };
}

// Session tracking
interface SessionMetrics {
  sessionId: string;
  userId?: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  apiCalls: number;
  errors: number;
}

const activeSessions = new Map<string, SessionMetrics>();

export function trackSession(sessionId: string, userId?: string) {
  if (!activeSessions.has(sessionId)) {
    activeSessions.set(sessionId, {
      sessionId,
      userId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      apiCalls: 0,
      errors: 0
    });
  }
  
  const session = activeSessions.get(sessionId)!;
  session.lastActivity = Date.now();
  return session;
}

export function updateSessionMetrics(
  sessionId: string,
  update: Partial<SessionMetrics>
) {
  const session = activeSessions.get(sessionId);
  if (session) {
    Object.assign(session, update);
    session.lastActivity = Date.now();
  }
}

export function getActiveSessionCount(): number {
  // Clean up inactive sessions (older than 30 minutes)
  const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.lastActivity < thirtyMinutesAgo) {
      activeSessions.delete(sessionId);
    }
  }
  
  return activeSessions.size;
}

export function getSessionMetrics(): SessionMetrics[] {
  return Array.from(activeSessions.values());
}

// Request ID tracking for distributed tracing
export function getRequestId(): string {
  const headersList = headers();
  return headersList.get('x-request-id') || generateRequestId();
}

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Export monitoring data for dashboards
export interface MonitoringData {
  timestamp: string;
  performance: PerformanceReport;
  memory: ReturnType<typeof getMemoryUsage>;
  sessions: {
    active: number;
    metrics: SessionMetrics[];
  };
}

export function getMonitoringData(): MonitoringData {
  return {
    timestamp: new Date().toISOString(),
    performance: getGlobalMonitor().getReport(),
    memory: getMemoryUsage(),
    sessions: {
      active: getActiveSessionCount(),
      metrics: getSessionMetrics()
    }
  };
}