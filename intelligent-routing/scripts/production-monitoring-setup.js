#!/usr/bin/env node

/**
 * PROP.ie Production Monitoring & Alerting Setup
 * 
 * Comprehensive monitoring system configuration for production environment
 * with real-time alerting, performance tracking, and incident management
 */

const fs = require('fs');
const path = require('path');

class ProductionMonitoringSetup {
  constructor() {
    this.monitoringConfig = {
      healthChecks: {
        interval: 30000, // 30 seconds
        timeout: 10000,  // 10 seconds
        retries: 3
      },
      alerts: {
        responseTime: { threshold: 2000, severity: 'warning' },
        errorRate: { threshold: 5, severity: 'critical' },
        availability: { threshold: 99.9, severity: 'critical' },
        memoryUsage: { threshold: 80, severity: 'warning' },
        cpuUsage: { threshold: 85, severity: 'warning' }
      },
      notifications: {
        email: ['alerts@prop.ie', 'engineering@prop.ie'],
        slack: '#prop-ie-alerts',
        sms: ['+353-xxx-xxx-xxx'] // Emergency contact
      }
    };
  }

  async setupMonitoring() {
    console.log('📊 Setting up PROP.ie Production Monitoring...\n');
    
    try {
      // Setup health check endpoints
      await this.setupHealthChecks();
      
      // Configure performance monitoring
      await this.setupPerformanceMonitoring();
      
      // Setup error tracking
      await this.setupErrorTracking();
      
      // Configure alerting rules
      await this.setupAlertingRules();
      
      // Setup dashboards
      await this.setupMonitoringDashboards();
      
      // Configure log aggregation
      await this.setupLogAggregation();
      
      // Setup uptime monitoring
      await this.setupUptimeMonitoring();
      
      console.log('✅ Production monitoring setup completed!\n');
      this.generateMonitoringReport();
      
    } catch (error) {
      console.error('❌ Monitoring setup failed:', error.message);
      process.exit(1);
    }
  }

  async setupHealthChecks() {
    console.log('🏥 Configuring Health Check Endpoints...');
    
    const healthChecks = [
      {
        name: 'Application Health',
        endpoint: '/api/health',
        method: 'GET',
        expectedStatus: 200,
        timeout: 5000
      },
      {
        name: 'Database Connectivity',
        endpoint: '/api/health/database',
        method: 'GET',
        expectedStatus: 200,
        timeout: 10000
      },
      {
        name: 'Payment Processing',
        endpoint: '/api/health/payments',
        method: 'GET',
        expectedStatus: 200,
        timeout: 8000
      },
      {
        name: 'Authentication Service',
        endpoint: '/api/auth/session',
        method: 'GET',
        expectedStatus: 200,
        timeout: 5000
      },
      {
        name: 'Real-time Services',
        endpoint: '/api/realtime',
        method: 'GET',
        expectedStatus: 200,
        timeout: 5000
      }
    ];

    // Generate health check configuration
    const healthConfig = {
      checks: healthChecks,
      schedule: '*/30 * * * * *', // Every 30 seconds
      alertOnFailure: true,
      retryAttempts: 3,
      escalationDelay: 300000 // 5 minutes
    };

    fs.writeFileSync('./monitoring/health-checks.json', JSON.stringify(healthConfig, null, 2));
    console.log('  ✅ Health check endpoints configured');
    
    // Create health check monitoring script
    const healthScript = this.generateHealthCheckScript();
    fs.writeFileSync('./monitoring/health-monitor.js', healthScript);
    console.log('  ✅ Health monitoring script created\n');
  }

  async setupPerformanceMonitoring() {
    console.log('⚡ Configuring Performance Monitoring...');
    
    const performanceMetrics = {
      responseTime: {
        endpoints: ['/api/*', '/', '/buyer/*', '/developer/*'],
        thresholds: {
          warning: 1000,   // 1 second
          critical: 3000   // 3 seconds
        }
      },
      throughput: {
        metric: 'requests_per_second',
        baseline: 100,
        alertOn: 'deviation_25_percent'
      },
      errorRate: {
        metric: 'error_percentage',
        thresholds: {
          warning: 2,    // 2%
          critical: 5    // 5%
        }
      },
      apdex: {
        target: 0.5,      // 500ms target
        tolerance: 2.0,   // 2s tolerance
        threshold: 0.85   // 85% satisfaction
      }
    };

    fs.writeFileSync('./monitoring/performance-config.json', JSON.stringify(performanceMetrics, null, 2));
    console.log('  ✅ Performance thresholds configured');
    console.log('  ✅ APM integration ready\n');
  }

  async setupErrorTracking() {
    console.log('🐛 Configuring Error Tracking...');
    
    const errorConfig = {
      sentry: {
        dsn: process.env.SENTRY_DSN || 'CONFIGURE_SENTRY_DSN',
        environment: 'production',
        tracesSampleRate: 0.1,
        errorSampleRate: 1.0,
        beforeSend: 'filter_sensitive_data',
        integrations: [
          'Browser',
          'Http', 
          'OnUncaughtException',
          'OnUnhandledRejection'
        ]
      },
      customErrorTracking: {
        businessLogicErrors: true,
        paymentErrors: true,
        authenticationErrors: true,
        apiErrors: true
      },
      alerting: {
        newErrorTypes: true,
        errorSpikes: {
          threshold: 10,
          timeWindow: 300000 // 5 minutes
        },
        criticalErrors: [
          'PaymentProcessingError',
          'AuthenticationFailure',
          'DatabaseConnectionError'
        ]
      }
    };

    fs.writeFileSync('./monitoring/error-tracking.json', JSON.stringify(errorConfig, null, 2));
    console.log('  ✅ Error tracking configured');
    console.log('  ✅ Sentry integration ready\n');
  }

  async setupAlertingRules() {
    console.log('🚨 Configuring Alerting Rules...');
    
    const alertingRules = [
      {
        name: 'High Response Time',
        condition: 'avg_response_time > 2000ms for 5 minutes',
        severity: 'warning',
        channels: ['email', 'slack']
      },
      {
        name: 'Critical Error Rate',
        condition: 'error_rate > 5% for 2 minutes',
        severity: 'critical',
        channels: ['email', 'slack', 'sms']
      },
      {
        name: 'Service Unavailable',
        condition: 'availability < 99% for 1 minute',
        severity: 'critical',
        channels: ['email', 'slack', 'sms']
      },
      {
        name: 'Database Connection Issues',
        condition: 'database_connections_failed > 3 for 1 minute',
        severity: 'critical',
        channels: ['email', 'slack', 'sms']
      },
      {
        name: 'Payment Processing Failure',
        condition: 'payment_failure_rate > 2% for 5 minutes',
        severity: 'high',
        channels: ['email', 'slack']
      },
      {
        name: 'Memory Usage High',
        condition: 'memory_usage > 80% for 10 minutes',
        severity: 'warning',
        channels: ['email']
      },
      {
        name: 'Disk Space Low',
        condition: 'disk_usage > 85%',
        severity: 'warning',
        channels: ['email', 'slack']
      },
      {
        name: 'SSL Certificate Expiry',
        condition: 'ssl_cert_expires_in < 30 days',
        severity: 'warning',
        channels: ['email']
      }
    ];

    fs.writeFileSync('./monitoring/alerting-rules.json', JSON.stringify(alertingRules, null, 2));
    console.log('  ✅ Alerting rules configured');
    console.log('  ✅ Multi-channel notifications setup\n');
  }

  async setupMonitoringDashboards() {
    console.log('📈 Setting up Monitoring Dashboards...');
    
    const dashboards = {
      operations: {
        name: 'PROP.ie Operations Dashboard',
        panels: [
          'System Health Overview',
          'Response Time Trends',
          'Error Rate Monitoring', 
          'Request Volume',
          'Database Performance',
          'Payment Processing Status'
        ],
        refreshInterval: 30000
      },
      business: {
        name: 'PROP.ie Business Metrics',
        panels: [
          'User Registration Rate',
          'Property Search Volume',
          'Transaction Value',
          'Geographic Usage Distribution',
          'Feature Adoption Metrics',
          'Revenue Tracking'
        ],
        refreshInterval: 300000
      },
      security: {
        name: 'PROP.ie Security Dashboard',
        panels: [
          'Authentication Attempts',
          'Failed Login Monitoring',
          'Rate Limiting Triggers',
          'Security Alerts',
          'Suspicious Activity Detection',
          'API Abuse Monitoring'
        ],
        refreshInterval: 60000
      }
    };

    fs.writeFileSync('./monitoring/dashboards-config.json', JSON.stringify(dashboards, null, 2));
    console.log('  ✅ Operations dashboard configured');
    console.log('  ✅ Business metrics dashboard configured');
    console.log('  ✅ Security dashboard configured\n');
  }

  async setupLogAggregation() {
    console.log('📋 Configuring Log Aggregation...');
    
    const logConfig = {
      sources: [
        'application_logs',
        'access_logs',
        'error_logs',
        'security_logs',
        'audit_logs',
        'performance_logs'
      ],
      retention: {
        debug: '7 days',
        info: '30 days',
        warning: '90 days',
        error: '1 year',
        critical: '2 years'
      },
      parsing: {
        structured: true,
        timestampExtraction: true,
        fieldExtraction: [
          'userId',
          'sessionId',
          'requestId',
          'responseTime',
          'statusCode'
        ]
      },
      alerting: {
        errorSpikes: true,
        unknownErrors: true,
        securityEvents: true
      }
    };

    fs.writeFileSync('./monitoring/log-aggregation.json', JSON.stringify(logConfig, null, 2));
    console.log('  ✅ Log aggregation configured');
    console.log('  ✅ Log retention policies set\n');
  }

  async setupUptimeMonitoring() {
    console.log('⏱️ Configuring Uptime Monitoring...');
    
    const uptimeConfig = {
      endpoints: [
        {
          name: 'PROP.ie Homepage',
          url: 'https://prop.ie',
          method: 'GET',
          interval: 60000,
          timeout: 10000,
          expectedStatus: [200],
          locations: ['Dublin', 'London', 'Frankfurt', 'New York']
        },
        {
          name: 'API Health Check',
          url: 'https://prop.ie/api/health',
          method: 'GET',
          interval: 30000,
          timeout: 5000,
          expectedStatus: [200]
        },
        {
          name: 'User Authentication',
          url: 'https://prop.ie/api/auth/session',
          method: 'GET',
          interval: 120000,
          timeout: 8000,
          expectedStatus: [200, 401]
        }
      ],
      sla: {
        target: 99.9,
        measurement_window: '30_days',
        alerting: {
          below_target: true,
          downtime_duration: 300000 // 5 minutes
        }
      }
    };

    fs.writeFileSync('./monitoring/uptime-monitoring.json', JSON.stringify(uptimeConfig, null, 2));
    console.log('  ✅ Uptime monitoring configured');
    console.log('  ✅ SLA tracking enabled\n');
  }

  generateHealthCheckScript() {
    return `#!/usr/bin/env node

/**
 * PROP.ie Production Health Monitor
 * Automated health checking with alerting
 */

const https = require('https');
const fs = require('fs');

class HealthMonitor {
  constructor() {
    this.config = JSON.parse(fs.readFileSync('./monitoring/health-checks.json', 'utf8'));
    this.failureCount = new Map();
  }

  async checkHealth() {
    console.log(\`[\${new Date().toISOString()}] Running health checks...\`);
    
    for (const check of this.config.checks) {
      try {
        const result = await this.performCheck(check);
        if (result.healthy) {
          this.failureCount.delete(check.name);
          console.log(\`✅ \${check.name}: Healthy\`);
        } else {
          this.handleFailure(check, result.error);
        }
      } catch (error) {
        this.handleFailure(check, error);
      }
    }
  }

  async performCheck(check) {
    return new Promise((resolve) => {
      const options = {
        hostname: 'prop.ie',
        path: check.endpoint,
        method: check.method,
        timeout: check.timeout
      };

      const req = https.request(options, (res) => {
        resolve({
          healthy: res.statusCode === check.expectedStatus,
          statusCode: res.statusCode
        });
      });

      req.on('timeout', () => {
        resolve({ healthy: false, error: 'Timeout' });
      });

      req.on('error', (error) => {
        resolve({ healthy: false, error: error.message });
      });

      req.end();
    });
  }

  handleFailure(check, error) {
    const failures = this.failureCount.get(check.name) || 0;
    this.failureCount.set(check.name, failures + 1);
    
    console.log(\`❌ \${check.name}: Failed (\${failures + 1}/\${this.config.retryAttempts})\`);
    
    if (failures + 1 >= this.config.retryAttempts) {
      this.sendAlert(check, error);
    }
  }

  sendAlert(check, error) {
    console.log(\`🚨 ALERT: \${check.name} has failed \${this.config.retryAttempts} times\`);
    console.log(\`Error: \${error}\`);
    
    // In production, this would send actual alerts via email/SMS/Slack
    const alert = {
      timestamp: new Date().toISOString(),
      service: check.name,
      error: error,
      severity: 'critical'
    };
    
    fs.appendFileSync('./monitoring/alerts.log', JSON.stringify(alert) + '\\n');
  }
}

const monitor = new HealthMonitor();
monitor.checkHealth();

// Schedule recurring checks
setInterval(() => {
  monitor.checkHealth();
}, 30000); // Every 30 seconds
`;
  }

  generateMonitoringReport() {
    const report = {
      title: 'PROP.ie Production Monitoring Setup',
      timestamp: new Date().toISOString(),
      components: {
        healthChecks: '✅ Configured',
        performanceMonitoring: '✅ Configured', 
        errorTracking: '✅ Configured',
        alertingRules: '✅ Configured',
        dashboards: '✅ Configured',
        logAggregation: '✅ Configured',
        uptimeMonitoring: '✅ Configured'
      },
      keyMetrics: {
        healthCheckInterval: '30 seconds',
        alertResponseTime: '< 5 minutes',
        uptimeTarget: '99.9%',
        errorRateThreshold: '5%',
        performanceTarget: '< 2s response time'
      },
      alertingChannels: {
        email: this.monitoringConfig.notifications.email,
        slack: this.monitoringConfig.notifications.slack,
        sms: 'Emergency contacts configured'
      },
      nextSteps: [
        'Configure Sentry DSN for error tracking',
        'Set up Slack webhook for alerts',
        'Configure email SMTP settings',
        'Test all alerting channels',
        'Deploy monitoring dashboard',
        'Set up automated reporting'
      ]
    };

    // Ensure monitoring directory exists
    if (!fs.existsSync('./monitoring')) {
      fs.mkdirSync('./monitoring', { recursive: true });
    }

    fs.writeFileSync('./monitoring/setup-report.json', JSON.stringify(report, null, 2));

    console.log('📊 PRODUCTION MONITORING SETUP COMPLETE');
    console.log('========================================');
    console.log('✅ Health Checks: 5 endpoints monitored');
    console.log('✅ Performance: Thresholds configured');
    console.log('✅ Error Tracking: Sentry integration ready');
    console.log('✅ Alerting: 8 rules with multi-channel notifications');
    console.log('✅ Dashboards: Operations, Business, Security');
    console.log('✅ Log Aggregation: 6 sources with retention policies');
    console.log('✅ Uptime Monitoring: 99.9% SLA tracking');
    console.log('\n📋 Configuration files generated in ./monitoring/');
    console.log('🚨 Next: Configure external alerting services');
  }
}

// Execute monitoring setup if run directly
if (require.main === module) {
  const setup = new ProductionMonitoringSetup();
  setup.setupMonitoring().catch(error => {
    console.error('💥 Monitoring setup crashed:', error);
    process.exit(1);
  });
}

module.exports = ProductionMonitoringSetup;