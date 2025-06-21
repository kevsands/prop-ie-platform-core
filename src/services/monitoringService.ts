/**
 * Real-Time Performance Monitoring Service
 * Tracks system health, API performance, and business metrics
 * Provides alerting for critical issues affecting Kevin's property platform
 */

import { EventEmitter } from 'events';

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum MetricType {
  RESPONSE_TIME = 'RESPONSE_TIME',
  ERROR_RATE = 'ERROR_RATE',
  THROUGHPUT = 'THROUGHPUT',
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',
  MEMORY_USAGE = 'MEMORY_USAGE',
  CPU_USAGE = 'CPU_USAGE',
  TRANSACTION_VOLUME = 'TRANSACTION_VOLUME',
  USER_ACTIVITY = 'USER_ACTIVITY',
  REVENUE_TRACKING = 'REVENUE_TRACKING',
  EMAIL_DELIVERY = 'EMAIL_DELIVERY'
}

export interface PerformanceMetric {
  id: string;
  type: MetricType;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  source: string;
  tags: Record<string, string>;
  threshold?: {
    warning: number;
    critical: number;
  };
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  metric: PerformanceMetric;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
  escalatedTo?: string[];
  context: {
    affectedUsers?: number;
    revenueImpact?: number;
    systemComponent: string;
    troubleshootingSteps: string[];
  };
}

export interface SystemHealth {
  overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  uptime: number;
  lastUpdated: Date;
  components: {
    api: 'UP' | 'DOWN' | 'DEGRADED';
    database: 'UP' | 'DOWN' | 'DEGRADED';
    email: 'UP' | 'DOWN' | 'DEGRADED';
    payments: 'UP' | 'DOWN' | 'DEGRADED';
    monitoring: 'UP' | 'DOWN' | 'DEGRADED';
  };
  metrics: {
    avgResponseTime: number;
    errorRate: number;
    throughput: number;
    activeUsers: number;
    pendingTransactions: number;
  };
}

export class MonitoringService {
  private eventBus = new EventEmitter();
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private startTime = Date.now();

  /**
   * Start real-time monitoring
   */
  start(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.startTime = Date.now();
    
    // Start monitoring intervals
    this.monitoringInterval = setInterval(() => {
      this.collectSystemMetrics();
    }, 30000); // Every 30 seconds

    console.log('🔍 Real-time monitoring started for Kevin Fitzgerald Property Platform');
    this.eventBus.emit('monitoring.started');
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('🔍 Monitoring stopped');
    this.eventBus.emit('monitoring.stopped');
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date()
    };

    // Store metric
    const typeKey = metric.type;
    if (!this.metrics.has(typeKey)) {
      this.metrics.set(typeKey, []);
    }
    
    const metricsArray = this.metrics.get(typeKey)!;
    metricsArray.push(fullMetric);
    
    // Keep only last 1000 metrics per type
    if (metricsArray.length > 1000) {
      metricsArray.splice(0, metricsArray.length - 1000);
    }

    // Check thresholds and create alerts
    this.checkThresholds(fullMetric);

    this.eventBus.emit('metric.recorded', fullMetric);
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const uptime = Date.now() - this.startTime;
    const recentMetrics = this.getRecentMetrics(5 * 60 * 1000); // Last 5 minutes

    // Calculate component health
    const components = {
      api: this.getComponentHealth('api', recentMetrics),
      database: this.getComponentHealth('database', recentMetrics),
      email: this.getComponentHealth('email', recentMetrics),
      payments: this.getComponentHealth('payments', recentMetrics),
      monitoring: this.isMonitoring ? 'UP' : 'DOWN'
    } as const;

    // Calculate aggregate metrics
    const responseTimeMetrics = recentMetrics.filter(m => m.type === MetricType.RESPONSE_TIME);
    const errorRateMetrics = recentMetrics.filter(m => m.type === MetricType.ERROR_RATE);
    const throughputMetrics = recentMetrics.filter(m => m.type === MetricType.THROUGHPUT);
    const userMetrics = recentMetrics.filter(m => m.type === MetricType.USER_ACTIVITY);
    const transactionMetrics = recentMetrics.filter(m => m.type === MetricType.TRANSACTION_VOLUME);

    const avgResponseTime = responseTimeMetrics.length > 0 
      ? responseTimeMetrics.reduce((sum, m) => sum + m.value, 0) / responseTimeMetrics.length 
      : 0;

    const errorRate = errorRateMetrics.length > 0
      ? errorRateMetrics.reduce((sum, m) => sum + m.value, 0) / errorRateMetrics.length
      : 0;

    const throughput = throughputMetrics.length > 0
      ? throughputMetrics[throughputMetrics.length - 1].value
      : 0;

    const activeUsers = userMetrics.length > 0
      ? userMetrics[userMetrics.length - 1].value
      : 0;

    const pendingTransactions = transactionMetrics.length > 0
      ? transactionMetrics[transactionMetrics.length - 1].value
      : 0;

    // Determine overall health
    let overall: SystemHealth['overall'] = 'HEALTHY';
    
    const criticalAlerts = Array.from(this.alerts.values())
      .filter(alert => !alert.acknowledged && alert.severity === AlertSeverity.CRITICAL);
    
    const highAlerts = Array.from(this.alerts.values())
      .filter(alert => !alert.acknowledged && alert.severity === AlertSeverity.HIGH);

    if (criticalAlerts.length > 0 || Object.values(components).some(c => c === 'DOWN')) {
      overall = 'CRITICAL';
    } else if (highAlerts.length > 0 || Object.values(components).some(c => c === 'DEGRADED')) {
      overall = 'DEGRADED';
    }

    return {
      overall,
      uptime,
      lastUpdated: new Date(),
      components,
      metrics: {
        avgResponseTime,
        errorRate,
        throughput,
        activeUsers,
        pendingTransactions
      }
    };
  }

  /**
   * Track API performance
   */
  trackApiPerformance(endpoint: string, method: string, responseTime: number, statusCode: number): void {
    // Record response time
    this.recordMetric({
      type: MetricType.RESPONSE_TIME,
      name: `API Response Time - ${method} ${endpoint}`,
      value: responseTime,
      unit: 'ms',
      source: 'api',
      tags: { endpoint, method, statusCode: statusCode.toString() },
      threshold: {
        warning: 2000, // 2 seconds
        critical: 5000 // 5 seconds
      }
    });

    // Record error rate
    const isError = statusCode >= 400;
    this.recordMetric({
      type: MetricType.ERROR_RATE,
      name: `API Error Rate - ${method} ${endpoint}`,
      value: isError ? 1 : 0,
      unit: 'errors',
      source: 'api',
      tags: { endpoint, method, statusCode: statusCode.toString() },
      threshold: {
        warning: 0.05, // 5% error rate
        critical: 0.10 // 10% error rate
      }
    });
  }

  /**
   * Track database performance
   */
  trackDatabasePerformance(operation: string, queryTime: number, success: boolean): void {
    this.recordMetric({
      type: MetricType.RESPONSE_TIME,
      name: `Database Query Time - ${operation}`,
      value: queryTime,
      unit: 'ms',
      source: 'database',
      tags: { operation, success: success.toString() },
      threshold: {
        warning: 1000, // 1 second
        critical: 3000 // 3 seconds
      }
    });

    if (!success) {
      this.recordMetric({
        type: MetricType.ERROR_RATE,
        name: `Database Error Rate - ${operation}`,
        value: 1,
        unit: 'errors',
        source: 'database',
        tags: { operation }
      });
    }
  }

  /**
   * Track business metrics
   */
  trackBusinessMetric(type: 'transaction' | 'user_signup' | 'property_view' | 'reservation', value: number, metadata?: Record<string, string>): void {
    const metricTypes = {
      transaction: MetricType.TRANSACTION_VOLUME,
      user_signup: MetricType.USER_ACTIVITY,
      property_view: MetricType.USER_ACTIVITY,
      reservation: MetricType.TRANSACTION_VOLUME
    };

    this.recordMetric({
      type: metricTypes[type],
      name: `Business Metric - ${type}`,
      value,
      unit: 'count',
      source: 'business',
      tags: { event: type, ...metadata }
    });

    // Track revenue impact for transactions and reservations
    if ((type === 'transaction' || type === 'reservation') && metadata?.amount) {
      this.recordMetric({
        type: MetricType.REVENUE_TRACKING,
        name: `Revenue - ${type}`,
        value: parseFloat(metadata.amount),
        unit: 'EUR',
        source: 'business',
        tags: { event: type, ...metadata }
      });
    }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.acknowledged)
      .sort((a, b) => {
        // Sort by severity (CRITICAL first) then by timestamp
        const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
        if (severityDiff !== 0) return severityDiff;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.acknowledged = true;
    console.log(`🔔 Alert acknowledged: ${alert.title} by ${acknowledgedBy}`);
    this.eventBus.emit('alert.acknowledged', { alert, acknowledgedBy });
    
    return true;
  }

  /**
   * Get metrics by type and time range
   */
  getMetrics(type: MetricType, timeRangeMs: number = 60 * 60 * 1000): PerformanceMetric[] {
    const metrics = this.metrics.get(type) || [];
    const cutoff = new Date(Date.now() - timeRangeMs);
    
    return metrics.filter(metric => metric.timestamp >= cutoff);
  }

  /**
   * Get monitoring dashboard data
   */
  getDashboardData(): {
    systemHealth: SystemHealth;
    activeAlerts: Alert[];
    recentMetrics: {
      responseTime: PerformanceMetric[];
      errorRate: PerformanceMetric[];
      throughput: PerformanceMetric[];
      userActivity: PerformanceMetric[];
    };
  } {
    const timeRange = 30 * 60 * 1000; // Last 30 minutes

    return {
      systemHealth: this.getSystemHealth() as SystemHealth,
      activeAlerts: this.getActiveAlerts(),
      recentMetrics: {
        responseTime: this.getMetrics(MetricType.RESPONSE_TIME, timeRange),
        errorRate: this.getMetrics(MetricType.ERROR_RATE, timeRange),
        throughput: this.getMetrics(MetricType.THROUGHPUT, timeRange),
        userActivity: this.getMetrics(MetricType.USER_ACTIVITY, timeRange)
      }
    };
  }

  /**
   * Collect system metrics
   */
  private async collectSystemMetrics(): Promise<void> {
    try {
      // Memory usage
      if (typeof process !== 'undefined' && process.memoryUsage) {
        const memUsage = process.memoryUsage();
        this.recordMetric({
          type: MetricType.MEMORY_USAGE,
          name: 'Memory Usage',
          value: memUsage.heapUsed / 1024 / 1024, // MB
          unit: 'MB',
          source: 'system',
          tags: { component: 'nodejs' },
          threshold: {
            warning: 512, // 512 MB
            critical: 1024 // 1 GB
          }
        });
      }

      // CPU usage (approximated)
      const cpuUsage = Math.random() * 100; // Mock CPU usage
      this.recordMetric({
        type: MetricType.CPU_USAGE,
        name: 'CPU Usage',
        value: cpuUsage,
        unit: '%',
        source: 'system',
        tags: { component: 'nodejs' },
        threshold: {
          warning: 80,
          critical: 95
        }
      });

      // Simulate other metrics for Kevin's platform
      this.recordMetric({
        type: MetricType.USER_ACTIVITY,
        name: 'Active Users',
        value: Math.floor(Math.random() * 50) + 10, // 10-60 active users
        unit: 'users',
        source: 'business',
        tags: { component: 'platform' }
      });

      this.recordMetric({
        type: MetricType.THROUGHPUT,
        name: 'Requests per Minute',
        value: Math.floor(Math.random() * 200) + 50, // 50-250 RPM
        unit: 'rpm',
        source: 'api',
        tags: { component: 'api' }
      });

    } catch (error) {
      console.error('Failed to collect system metrics:', error);
    }
  }

  /**
   * Check metric thresholds and create alerts
   */
  private checkThresholds(metric: PerformanceMetric): void {
    if (!metric.threshold) return;

    const { warning, critical } = metric.threshold;
    let severity: AlertSeverity | null = null;
    let title = '';
    let description = '';

    if (metric.value >= critical) {
      severity = AlertSeverity.CRITICAL;
      title = `CRITICAL: ${metric.name} Threshold Exceeded`;
      description = `${metric.name} is ${metric.value}${metric.unit}, exceeding critical threshold of ${critical}${metric.unit}`;
    } else if (metric.value >= warning) {
      severity = AlertSeverity.HIGH;
      title = `HIGH: ${metric.name} Warning Threshold`;
      description = `${metric.name} is ${metric.value}${metric.unit}, exceeding warning threshold of ${warning}${metric.unit}`;
    }

    if (severity) {
      this.createAlert(severity, title, description, metric);
    }
  }

  /**
   * Create a new alert
   */
  private createAlert(severity: AlertSeverity, title: string, description: string, metric: PerformanceMetric): void {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      severity,
      title,
      description,
      metric,
      timestamp: new Date(),
      acknowledged: false,
      context: {
        systemComponent: metric.source,
        troubleshootingSteps: this.getTroubleshootingSteps(metric.type),
        affectedUsers: severity === AlertSeverity.CRITICAL ? 100 : 10,
        revenueImpact: severity === AlertSeverity.CRITICAL ? 50000 : 0
      }
    };

    this.alerts.set(alert.id, alert);
    console.log(`🚨 ${severity} Alert: ${title}`);
    this.eventBus.emit('alert.created', alert);

    // Auto-escalate critical alerts
    if (severity === AlertSeverity.CRITICAL) {
      setTimeout(() => {
        if (!alert.acknowledged) {
          alert.escalatedTo = ['kevin@prop.ie', 'ops-team@prop.ie'];
          console.log(`📢 Critical alert escalated: ${title}`);
          this.eventBus.emit('alert.escalated', alert);
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
  }

  /**
   * Get troubleshooting steps for metric type
   */
  private getTroubleshootingSteps(type: MetricType): string[] {
    const steps = {
      [MetricType.RESPONSE_TIME]: [
        'Check API server load and CPU usage',
        'Review database query performance',
        'Examine network latency to external services',
        'Scale API instances if needed'
      ],
      [MetricType.ERROR_RATE]: [
        'Check application logs for error patterns',
        'Verify database connectivity',
        'Review recent deployments for issues',
        'Check third-party service status'
      ],
      [MetricType.DATABASE_CONNECTION]: [
        'Verify database server health',
        'Check connection pool configuration',
        'Review database locks and blocking queries',
        'Monitor database disk space'
      ],
      [MetricType.MEMORY_USAGE]: [
        'Review memory-intensive processes',
        'Check for memory leaks in application',
        'Scale server resources if needed',
        'Optimize database query caching'
      ],
      [MetricType.CPU_USAGE]: [
        'Identify CPU-intensive processes',
        'Review recent code changes',
        'Scale server instances',
        'Optimize algorithmic complexity'
      ]
    };

    return steps[type] || ['Contact system administrator', 'Review system logs', 'Check service dependencies'];
  }

  /**
   * Get component health status
   */
  private getComponentHealth(component: string, recentMetrics: PerformanceMetric[]): 'UP' | 'DOWN' | 'DEGRADED' {
    const componentMetrics = recentMetrics.filter(m => m.tags.component === component || m.source === component);
    
    if (componentMetrics.length === 0) {
      return 'UP'; // No metrics = assume healthy
    }

    // Check for critical errors
    const criticalErrors = componentMetrics.filter(m => 
      m.threshold && m.value >= m.threshold.critical
    );

    if (criticalErrors.length > 0) {
      return 'DOWN';
    }

    // Check for warnings
    const warnings = componentMetrics.filter(m => 
      m.threshold && m.value >= m.threshold.warning
    );

    if (warnings.length > 0) {
      return 'DEGRADED';
    }

    return 'UP';
  }

  /**
   * Get recent metrics within time range
   */
  private getRecentMetrics(timeRangeMs: number): PerformanceMetric[] {
    const cutoff = new Date(Date.now() - timeRangeMs);
    const allMetrics: PerformanceMetric[] = [];

    for (const metricArray of this.metrics.values()) {
      allMetrics.push(...metricArray.filter(m => m.timestamp >= cutoff));
    }

    return allMetrics;
  }

  /**
   * Subscribe to monitoring events
   */
  on(event: string, callback: (data: any) => void): void {
    this.eventBus.on(event, callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: (data: any) => void): void {
    this.eventBus.off(event, callback);
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService();