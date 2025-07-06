/**
 * ================================================================================
 * APPLICATION PERFORMANCE MONITORING (APM) SERVICE
 * Comprehensive performance monitoring and alerting for production environments
 * ================================================================================
 */

import { EventEmitter } from 'events';

// Performance monitoring types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: 'response_time' | 'throughput' | 'error_rate' | 'resource_usage' | 'business_metric';
  tags: Record<string, string>;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  score: number; // 0-100
  components: {
    database: ComponentHealth;
    cache: ComponentHealth;
    realtime: ComponentHealth;
    external_apis: ComponentHealth;
    storage: ComponentHealth;
  };
  lastChecked: Date;
}

export interface ComponentHealth {
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  responseTime: number;
  uptime: number;
  lastError?: string;
  metrics: Record<string, number>;
}

export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  category: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  metadata: Record<string, any>;
}

export interface PerformanceReport {
  period: { from: Date; to: Date };
  summary: {
    averageResponseTime: number;
    totalRequests: number;
    errorRate: number;
    uptime: number;
    peakConcurrentUsers: number;
  };
  trends: {
    responseTime: Array<{ timestamp: Date; value: number }>;
    throughput: Array<{ timestamp: Date; value: number }>;
    errorRate: Array<{ timestamp: Date; value: number }>;
  };
  topEndpoints: Array<{
    endpoint: string;
    requests: number;
    averageTime: number;
    errorRate: number;
  }>;
  alerts: Alert[];
}

/**
 * Application Performance Monitoring Service
 * Tracks performance metrics, health status, and generates alerts
 */
export class ApplicationPerformanceMonitoring extends EventEmitter {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private systemHealth: SystemHealth;
  private monitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private thresholds: Map<string, { warning: number; critical: number }> = new Map();

  constructor() {
    super();
    this.initializeThresholds();
    this.initializeSystemHealth();
    this.startMonitoring();
  }

  /**
   * Initialize performance thresholds
   */
  private initializeThresholds(): void {
    this.thresholds.set('response_time', { warning: 1000, critical: 3000 }); // ms
    this.thresholds.set('error_rate', { warning: 5, critical: 10 }); // %
    this.thresholds.set('cpu_usage', { warning: 70, critical: 90 }); // %
    this.thresholds.set('memory_usage', { warning: 80, critical: 95 }); // %
    this.thresholds.set('disk_usage', { warning: 85, critical: 95 }); // %
    this.thresholds.set('database_connections', { warning: 80, critical: 95 }); // %
  }

  /**
   * Initialize system health structure
   */
  private initializeSystemHealth(): void {
    this.systemHealth = {
      status: 'unknown',
      score: 100,
      components: {
        database: {
          status: 'unknown',
          responseTime: 0,
          uptime: 100,
          metrics: {}
        },
        cache: {
          status: 'unknown',
          responseTime: 0,
          uptime: 100,
          metrics: {}
        },
        realtime: {
          status: 'unknown',
          responseTime: 0,
          uptime: 100,
          metrics: {}
        },
        external_apis: {
          status: 'unknown',
          responseTime: 0,
          uptime: 100,
          metrics: {}
        },
        storage: {
          status: 'unknown',
          responseTime: 0,
          uptime: 100,
          metrics: {}
        }
      },
      lastChecked: new Date()
    };
  }

  /**
   * Start performance monitoring
   */
  private startMonitoring(): void {
    if (this.monitoring) return;
    
    this.monitoring = true;
    
    // Health check every 30 seconds
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck();
      this.cleanupOldMetrics();
      this.evaluateAlerts();
    }, 30000);

    // Collect system metrics every 10 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 10000);

    console.log('APM: Performance monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.monitoring = false;
    console.log('APM: Performance monitoring stopped');
  }

  /**
   * Record a performance metric
   */
  recordMetric(
    name: string,
    value: number,
    unit: string,
    category: PerformanceMetric['category'],
    tags: Record<string, string> = {}
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      category,
      tags
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metrics = this.metrics.get(name)!;
    metrics.push(metric);

    // Keep only last 1000 metrics per name
    if (metrics.length > 1000) {
      metrics.shift();
    }

    this.emit('metric_recorded', metric);
    this.checkThresholds(metric);
  }

  /**
   * Record API response time
   */
  recordApiResponseTime(endpoint: string, method: string, statusCode: number, responseTime: number): void {
    this.recordMetric(
      'api_response_time',
      responseTime,
      'ms',
      'response_time',
      { endpoint, method, status_code: statusCode.toString() }
    );

    // Record error if status code indicates error
    if (statusCode >= 400) {
      this.recordMetric(
        'api_error',
        1,
        'count',
        'error_rate',
        { endpoint, method, status_code: statusCode.toString() }
      );
    }
  }

  /**
   * Record database query performance
   */
  recordDatabaseQuery(query: string, responseTime: number, error?: boolean): void {
    this.recordMetric(
      'database_query_time',
      responseTime,
      'ms',
      'response_time',
      { query_type: this.getQueryType(query), error: error ? 'true' : 'false' }
    );

    if (error) {
      this.recordMetric(
        'database_error',
        1,
        'count',
        'error_rate',
        { query_type: this.getQueryType(query) }
      );
    }
  }

  /**
   * Record cache performance
   */
  recordCacheOperation(operation: string, hit: boolean, responseTime: number): void {
    this.recordMetric(
      'cache_response_time',
      responseTime,
      'ms',
      'response_time',
      { operation, hit: hit ? 'true' : 'false' }
    );

    this.recordMetric(
      hit ? 'cache_hit' : 'cache_miss',
      1,
      'count',
      'throughput',
      { operation }
    );
  }

  /**
   * Record business metric
   */
  recordBusinessMetric(name: string, value: number, unit: string, context: Record<string, string> = {}): void {
    this.recordMetric(name, value, unit, 'business_metric', context);
  }

  /**
   * Create an alert
   */
  createAlert(
    level: Alert['level'],
    title: string,
    description: string,
    category: string,
    metadata: Record<string, any> = {}
  ): string {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const alert: Alert = {
      id: alertId,
      level,
      title,
      description,
      category,
      timestamp: new Date(),
      resolved: false,
      metadata
    };

    this.alerts.set(alertId, alert);
    this.emit('alert_created', alert);

    // Auto-resolve info alerts after 5 minutes
    if (level === 'info') {
      setTimeout(() => {
        this.resolveAlert(alertId);
      }, 5 * 60 * 1000);
    }

    return alertId;
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      this.emit('alert_resolved', alert);
      return true;
    }
    return false;
  }

  /**
   * Get current system health
   */
  async getSystemHealth(): Promise<SystemHealth> {
    await this.performHealthCheck();
    return { ...this.systemHealth };
  }

  /**
   * Perform comprehensive health check
   */
  private async performHealthCheck(): Promise<void> {
    const startTime = Date.now();

    try {
      // Check database health
      this.systemHealth.components.database = await this.checkDatabaseHealth();
      
      // Check cache health
      this.systemHealth.components.cache = await this.checkCacheHealth();
      
      // Check real-time service health
      this.systemHealth.components.realtime = await this.checkRealtimeHealth();
      
      // Check external APIs health
      this.systemHealth.components.external_apis = await this.checkExternalApisHealth();
      
      // Check storage health
      this.systemHealth.components.storage = await this.checkStorageHealth();

      // Calculate overall health score
      this.calculateOverallHealth();
      
      this.systemHealth.lastChecked = new Date();
      
      this.emit('health_check_completed', this.systemHealth);
      
    } catch (error) {
      console.error('Health check failed:', error);
      this.systemHealth.status = 'critical';
      this.systemHealth.score = 0;
    }

    const responseTime = Date.now() - startTime;
    this.recordMetric('health_check_time', responseTime, 'ms', 'response_time', {});
  }

  /**
   * Check database health
   */
  private async checkDatabaseHealth(): Promise<ComponentHealth> {
    const startTime = Date.now();
    
    try {
      // Simulate database health check
      // In production, this would actually query the database
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime < 100 ? 'healthy' : responseTime < 500 ? 'warning' : 'critical',
        responseTime,
        uptime: 99.9,
        metrics: {
          active_connections: 45,
          query_avg_time: responseTime,
          queries_per_second: 150
        }
      };
    } catch (error) {
      return {
        status: 'critical',
        responseTime: Date.now() - startTime,
        uptime: 0,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        metrics: {}
      };
    }
  }

  /**
   * Check cache health
   */
  private async checkCacheHealth(): Promise<ComponentHealth> {
    const startTime = Date.now();
    
    try {
      // Simulate cache health check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime < 50 ? 'healthy' : responseTime < 200 ? 'warning' : 'critical',
        responseTime,
        uptime: 99.95,
        metrics: {
          hit_rate: 85.5,
          memory_usage: 45.2,
          operations_per_second: 500
        }
      };
    } catch (error) {
      return {
        status: 'critical',
        responseTime: Date.now() - startTime,
        uptime: 0,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        metrics: {}
      };
    }
  }

  /**
   * Check real-time service health
   */
  private async checkRealtimeHealth(): Promise<ComponentHealth> {
    const startTime = Date.now();
    
    try {
      // Simulate real-time service health check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 30));
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime,
        uptime: 99.8,
        metrics: {
          active_connections: 125,
          messages_per_second: 75,
          avg_latency: responseTime
        }
      };
    } catch (error) {
      return {
        status: 'critical',
        responseTime: Date.now() - startTime,
        uptime: 0,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        metrics: {}
      };
    }
  }

  /**
   * Check external APIs health
   */
  private async checkExternalApisHealth(): Promise<ComponentHealth> {
    const startTime = Date.now();
    
    try {
      // Simulate external API health checks
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime < 200 ? 'healthy' : responseTime < 1000 ? 'warning' : 'critical',
        responseTime,
        uptime: 98.5,
        metrics: {
          stripe_api: 150,
          aws_api: 80,
          google_maps_api: 200
        }
      };
    } catch (error) {
      return {
        status: 'critical',
        responseTime: Date.now() - startTime,
        uptime: 0,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        metrics: {}
      };
    }
  }

  /**
   * Check storage health
   */
  private async checkStorageHealth(): Promise<ComponentHealth> {
    try {
      // Simulate storage health check
      const diskUsage = Math.random() * 100;
      
      return {
        status: diskUsage < 80 ? 'healthy' : diskUsage < 90 ? 'warning' : 'critical',
        responseTime: 10,
        uptime: 99.99,
        metrics: {
          disk_usage_percent: diskUsage,
          available_space_gb: 500 - (diskUsage * 5),
          iops: 1000
        }
      };
    } catch (error) {
      return {
        status: 'critical',
        responseTime: 0,
        uptime: 0,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        metrics: {}
      };
    }
  }

  /**
   * Calculate overall system health
   */
  private calculateOverallHealth(): void {
    const components = Object.values(this.systemHealth.components);
    const healthyCount = components.filter(c => c.status === 'healthy').length;
    const warningCount = components.filter(c => c.status === 'warning').length;
    const criticalCount = components.filter(c => c.status === 'critical').length;

    // Calculate score (100 for healthy, 50 for warning, 0 for critical)
    const totalComponents = components.length;
    this.systemHealth.score = Math.round(
      ((healthyCount * 100) + (warningCount * 50) + (criticalCount * 0)) / totalComponents
    );

    // Determine overall status
    if (criticalCount > 0) {
      this.systemHealth.status = 'critical';
    } else if (warningCount > 0) {
      this.systemHealth.status = 'warning';
    } else {
      this.systemHealth.status = 'healthy';
    }
  }

  /**
   * Collect system metrics
   */
  private collectSystemMetrics(): void {
    if (typeof process !== 'undefined') {
      // Memory usage
      const memUsage = process.memoryUsage();
      this.recordMetric('memory_heap_used', memUsage.heapUsed / 1024 / 1024, 'MB', 'resource_usage', {});
      this.recordMetric('memory_heap_total', memUsage.heapTotal / 1024 / 1024, 'MB', 'resource_usage', {});
      
      // CPU usage (approximation)
      const cpuUsage = process.cpuUsage();
      this.recordMetric('cpu_user_time', cpuUsage.user / 1000, 'ms', 'resource_usage', {});
      this.recordMetric('cpu_system_time', cpuUsage.system / 1000, 'ms', 'resource_usage', {});
      
      // Uptime
      this.recordMetric('process_uptime', process.uptime(), 'seconds', 'resource_usage', {});
    }
  }

  /**
   * Check thresholds and create alerts
   */
  private checkThresholds(metric: PerformanceMetric): void {
    const threshold = this.thresholds.get(metric.name);
    if (!threshold) return;

    if (metric.value >= threshold.critical) {
      this.createAlert(
        'critical',
        `Critical ${metric.name}`,
        `${metric.name} is at critical level: ${metric.value}${metric.unit}`,
        'performance',
        { metric, threshold: threshold.critical }
      );
    } else if (metric.value >= threshold.warning) {
      this.createAlert(
        'warning',
        `High ${metric.name}`,
        `${metric.name} is above warning threshold: ${metric.value}${metric.unit}`,
        'performance',
        { metric, threshold: threshold.warning }
      );
    }
  }

  /**
   * Evaluate and auto-resolve alerts
   */
  private evaluateAlerts(): void {
    for (const [alertId, alert] of this.alerts.entries()) {
      // Auto-resolve alerts older than 1 hour if conditions have improved
      if (!alert.resolved && (Date.now() - alert.timestamp.getTime()) > 60 * 60 * 1000) {
        // Check if the condition that triggered the alert has improved
        const shouldResolve = this.shouldAutoResolveAlert(alert);
        if (shouldResolve) {
          this.resolveAlert(alertId);
        }
      }
    }
  }

  /**
   * Determine if alert should be auto-resolved
   */
  private shouldAutoResolveAlert(alert: Alert): boolean {
    // Simple logic - in production this would be more sophisticated
    return this.systemHealth.status !== 'critical' && this.systemHealth.score > 80;
  }

  /**
   * Clean up old metrics (keep last 24 hours)
   */
  private cleanupOldMetrics(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    for (const [name, metrics] of this.metrics.entries()) {
      const filtered = metrics.filter(m => m.timestamp.getTime() > cutoffTime);
      this.metrics.set(name, filtered);
    }
  }

  /**
   * Get performance report
   */
  generatePerformanceReport(from: Date, to: Date): PerformanceReport {
    const relevantMetrics = this.getMetricsInRange(from, to);
    const relevantAlerts = Array.from(this.alerts.values())
      .filter(alert => alert.timestamp >= from && alert.timestamp <= to);

    return {
      period: { from, to },
      summary: this.calculateSummaryMetrics(relevantMetrics),
      trends: this.calculateTrends(relevantMetrics),
      topEndpoints: this.calculateTopEndpoints(relevantMetrics),
      alerts: relevantAlerts
    };
  }

  /**
   * Get metrics in date range
   */
  private getMetricsInRange(from: Date, to: Date): PerformanceMetric[] {
    const metrics: PerformanceMetric[] = [];
    
    for (const metricList of this.metrics.values()) {
      const filtered = metricList.filter(m => 
        m.timestamp >= from && m.timestamp <= to
      );
      metrics.push(...filtered);
    }
    
    return metrics;
  }

  /**
   * Calculate summary metrics
   */
  private calculateSummaryMetrics(metrics: PerformanceMetric[]): PerformanceReport['summary'] {
    const responseTimeMetrics = metrics.filter(m => m.category === 'response_time');
    const errorMetrics = metrics.filter(m => m.category === 'error_rate');
    
    return {
      averageResponseTime: this.calculateAverage(responseTimeMetrics.map(m => m.value)),
      totalRequests: metrics.filter(m => m.name === 'api_response_time').length,
      errorRate: this.calculateErrorRate(metrics),
      uptime: 99.5, // This would be calculated from actual uptime data
      peakConcurrentUsers: Math.max(...metrics.filter(m => m.name === 'concurrent_users').map(m => m.value), 0)
    };
  }

  /**
   * Calculate trends
   */
  private calculateTrends(metrics: PerformanceMetric[]): PerformanceReport['trends'] {
    return {
      responseTime: this.aggregateMetricsByHour(metrics.filter(m => m.category === 'response_time')),
      throughput: this.aggregateMetricsByHour(metrics.filter(m => m.category === 'throughput')),
      errorRate: this.aggregateMetricsByHour(metrics.filter(m => m.category === 'error_rate'))
    };
  }

  /**
   * Calculate top endpoints
   */
  private calculateTopEndpoints(metrics: PerformanceMetric[]): PerformanceReport['topEndpoints'] {
    const endpointMetrics = metrics.filter(m => m.name === 'api_response_time');
    const endpointGroups = new Map<string, PerformanceMetric[]>();
    
    endpointMetrics.forEach(metric => {
      const endpoint = metric.tags.endpoint || 'unknown';
      if (!endpointGroups.has(endpoint)) {
        endpointGroups.set(endpoint, []);
      }
      endpointGroups.get(endpoint)!.push(metric);
    });
    
    return Array.from(endpointGroups.entries())
      .map(([endpoint, endpointMetrics]) => ({
        endpoint,
        requests: endpointMetrics.length,
        averageTime: this.calculateAverage(endpointMetrics.map(m => m.value)),
        errorRate: this.calculateErrorRateForEndpoint(endpoint, metrics)
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10);
  }

  /**
   * Utility methods
   */
  private getQueryType(query: string): string {
    const queryLower = query.toLowerCase().trim();
    if (queryLower.startsWith('select')) return 'SELECT';
    if (queryLower.startsWith('insert')) return 'INSERT';
    if (queryLower.startsWith('update')) return 'UPDATE';
    if (queryLower.startsWith('delete')) return 'DELETE';
    return 'OTHER';
  }

  private calculateAverage(values: number[]): number {
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  private calculateErrorRate(metrics: PerformanceMetric[]): number {
    const totalRequests = metrics.filter(m => m.name === 'api_response_time').length;
    const errorRequests = metrics.filter(m => m.name === 'api_error').length;
    return totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
  }

  private calculateErrorRateForEndpoint(endpoint: string, metrics: PerformanceMetric[]): number {
    const totalRequests = metrics.filter(m => 
      m.name === 'api_response_time' && m.tags.endpoint === endpoint
    ).length;
    const errorRequests = metrics.filter(m => 
      m.name === 'api_error' && m.tags.endpoint === endpoint
    ).length;
    return totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
  }

  private aggregateMetricsByHour(metrics: PerformanceMetric[]): Array<{ timestamp: Date; value: number }> {
    const hourlyData = new Map<string, number[]>();
    
    metrics.forEach(metric => {
      const hourKey = new Date(metric.timestamp);
      hourKey.setMinutes(0, 0, 0);
      const key = hourKey.toISOString();
      
      if (!hourlyData.has(key)) {
        hourlyData.set(key, []);
      }
      hourlyData.get(key)!.push(metric.value);
    });
    
    return Array.from(hourlyData.entries())
      .map(([timestamp, values]) => ({
        timestamp: new Date(timestamp),
        value: this.calculateAverage(values)
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Get all alerts
   */
  getAlerts(resolved?: boolean): Alert[] {
    const alerts = Array.from(this.alerts.values());
    if (resolved !== undefined) {
      return alerts.filter(alert => alert.resolved === resolved);
    }
    return alerts;
  }

  /**
   * Get metrics
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.get(name) || [];
    }
    
    const allMetrics: PerformanceMetric[] = [];
    for (const metricList of this.metrics.values()) {
      allMetrics.push(...metricList);
    }
    return allMetrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

// Export singleton instance
export const apmService = new ApplicationPerformanceMonitoring();