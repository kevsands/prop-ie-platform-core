'use client';

/**
 * Simplified stub implementation of security analytics service for client-side
 * 
 * This provides mock security analytics functionality without complex implementation.
 */

/**
 * Mock security metric type
 */
export interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  category: string;
}

/**
 * Mock security event type
 */
export interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: Date;
  description: string;
}

/**
 * Mock anomaly detection type
 */
export interface AnomalyDetection {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  detectedAt: Date;
  status: string;
}

/**
 * Mock threat indicator type
 */
export interface ThreatIndicator {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  firstSeen: Date;
  lastSeen: Date;
  description: string;
}

/**
 * Mock security snapshot type
 */
export interface SecuritySnapshot {
  timestamp: Date;
  metrics: SecurityMetric[];
  recentEvents: SecurityEvent[];
  activeAnomalies: AnomalyDetection[];
  activeThreatIndicators: ThreatIndicator[];
  securityScore: number;
  securityStatus: 'normal' | 'elevated' | 'high_alert' | 'critical';
  alertCount: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

/**
 * Mock security analytics options
 */
export interface SecurityAnalyticsOptions {
  timeframe?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  category?: string;
  severity?: string[];
  source?: string[];
  includeResolved?: boolean;
  page?: number;
  refreshCache?: boolean;
  withCorrelation?: boolean;
  withRecommendations?: boolean;
}

/**
 * Mock correlation result type
 */
export interface CorrelationResult {
  relatedEvents: SecurityEvent[];
  correlationScore: number;
  insights: string[];
}

/**
 * Mock security performance metrics
 */
export interface SecurityPerformanceMetrics {
  cacheSize: {
    metrics: number;
    events: number;
    anomalies: number;
    threats: number;
    total: number;
  };
  sseStatus: 'connected' | 'connecting' | 'disconnected';
  workerStatus: string;
  latency: {
    metrics: number;
    events: number;
    anomalies: number;
    threats: number;
    average: number;
  };
}

/**
 * Mock timeframe enum
 */
export enum AnalyticsTimeframe {
  LAST_HOUR = 'last_hour',
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_24_HOURS = 'last_24_hours',
  CUSTOM = 'custom'
}

/**
 * Simplified security analytics service with mock data
 */
class SimpleAnalyticsService {
  private eventHandlers: Map<string, Set<(data: any) => void>> = new Map();
  
  constructor() {}
  
  /**
   * Get security metrics (mock implementation)
   */
  async getMetrics(options: SecurityAnalyticsOptions = {}): Promise<SecurityMetric[]> {
    return [
      {
        id: 'metric-1',
        name: 'Security Score',
        value: 85,
        timestamp: new Date(),
        category: 'security'
      },
      {
        id: 'metric-2',
        name: 'Successful Logins',
        value: 42,
        timestamp: new Date(),
        category: 'authentication'
      },
      {
        id: 'metric-3',
        name: 'Failed Logins',
        value: 3,
        timestamp: new Date(),
        category: 'authentication'
      }
    ];
  }
  
  /**
   * Get security events (mock implementation)
   */
  async getEvents(options: SecurityAnalyticsOptions = {}): Promise<SecurityEvent[]> {
    return [
      {
        id: 'event-1',
        type: 'user_login',
        severity: 'low',
        source: 'authentication',
        timestamp: new Date(),
        description: 'User login successful'
      },
      {
        id: 'event-2',
        type: 'failed_login',
        severity: 'medium',
        source: 'authentication',
        timestamp: new Date(Date.now() - 300000),
        description: 'Failed login attempt'
      }
    ];
  }
  
  /**
   * Get anomaly detections (mock implementation)
   */
  async getAnomalies(options: SecurityAnalyticsOptions = {}): Promise<AnomalyDetection[]> {
    return [
      {
        id: 'anomaly-1',
        type: 'unusual_login_time',
        severity: 'medium',
        confidence: 85,
        detectedAt: new Date(Date.now() - 3600000),
        status: 'active'
      }
    ];
  }
  
  /**
   * Get threat indicators (mock implementation)
   */
  async getThreats(options: SecurityAnalyticsOptions = {}): Promise<ThreatIndicator[]> {
    return [
      {
        id: 'threat-1',
        type: 'suspicious_ip',
        severity: 'high',
        confidence: 75,
        firstSeen: new Date(Date.now() - 86400000),
        lastSeen: new Date(Date.now() - 3600000),
        description: 'Access from suspicious IP address'
      }
    ];
  }
  
  /**
   * Get security snapshot (mock implementation)
   */
  async getSecuritySnapshot(options: SecurityAnalyticsOptions = {}): Promise<SecuritySnapshot> {
    // Use existing mock functions
    const [metrics, events, anomalies, threats] = await Promise.all([
      this.getMetrics(options),
      this.getEvents(options),
      this.getAnomalies(options),
      this.getThreats(options)
    ]);
    
    // Calculate alert counts
    const alertCount = {
      low: events.filter(e => e.severity === 'low').length,
      medium: events.filter(e => e.severity === 'medium').length + 
              anomalies.filter(a => a.severity === 'medium').length,
      high: events.filter(e => e.severity === 'high').length + 
            threats.filter(t => t.severity === 'high').length,
      critical: events.filter(e => e.severity === 'critical').length
    };
    
    return {
      timestamp: new Date(),
      metrics,
      recentEvents: events,
      activeAnomalies: anomalies,
      activeThreatIndicators: threats,
      securityScore: 85,
      securityStatus: 'normal',
      alertCount
    };
  }
  
  /**
   * Get performance metrics (mock implementation)
   */
  async getPerformanceMetrics(): Promise<SecurityPerformanceMetrics> {
    return {
      cacheSize: {
        metrics: 3,
        events: 2,
        anomalies: 1,
        threats: 1,
        total: 7
      },
      sseStatus: 'connected',
      workerStatus: 'active',
      latency: {
        metrics: 150,
        events: 180,
        anomalies: 200,
        threats: 220,
        average: 187.5
      }
    };
  }
  
  /**
   * Refresh data (mock implementation)
   */
  async refreshData(types: string[] = []): Promise<void> {
    console.log('Security data refreshed', types);
    return;
  }
  
  /**
   * Register event handler (mock implementation)
   */
  on(eventType: string, handler: (data: any) => void): () => void {
    // Add handler
    let handlers = this.eventHandlers.get(eventType);
    if (!handlers) {
      handlers = new Set();
      this.eventHandlers.set(eventType, handlers);
    }
    handlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }
  
  /**
   * Unregister event handler (mock implementation)
   */
  off(eventType: string, handler: (data: any) => void): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }
}

// Create singleton instance
export const SecurityAnalyticsClient = new SimpleAnalyticsService();

// For backwards compatibility
export const SecurityAnalytics = SecurityAnalyticsClient;

// For named export compatibility
export default SecurityAnalyticsClient;