# Real-Time Monitoring System Guide

## Overview
Kevin Fitzgerald's property platform now includes comprehensive real-time monitoring and alerting capabilities to ensure system reliability, performance optimization, and early issue detection for the September 2025 production launch.

## 🎯 Key Features

### **System Health Monitoring**
- Real-time component status (API, Database, Email, Payments)
- Overall system health assessment (HEALTHY/DEGRADED/CRITICAL)
- Uptime tracking and availability metrics
- Performance threshold monitoring

### **Performance Metrics**
- API response time tracking
- Database query performance
- Error rate monitoring
- Throughput measurement
- Resource utilization (CPU, Memory)

### **Business Intelligence**
- User activity tracking
- Transaction volume monitoring
- Revenue attribution
- Property view analytics
- Conversion funnel metrics

### **Alert System**
- Severity-based alerting (LOW/MEDIUM/HIGH/CRITICAL)
- Automatic escalation for critical issues
- Acknowledgment and resolution tracking
- Component-specific troubleshooting guides

## 📊 Dashboard Components

### **SystemMonitoringDashboard.tsx**
Main monitoring interface with:
- Real-time system status overview
- Component health visualization
- Key performance indicators
- Active alerts management
- Performance trend charts

### **API Endpoints**
- `/api/monitoring/health` - System health check
- `/api/monitoring/dashboard` - Dashboard data
- `/api/monitoring/metrics` - Metrics collection

## 🚀 Quick Start

### **1. Start Monitoring Service**
```typescript
import { monitoringService } from '@/services/monitoringService';

// Start monitoring
monitoringService.start();

// Record custom metrics
monitoringService.recordMetric({
  type: 'RESPONSE_TIME',
  name: 'API Call',
  value: 245,
  unit: 'ms',
  source: 'api'
});
```

### **2. Use React Hook**
```typescript
import { useMonitoring } from '@/hooks/useMonitoring';

function MonitoringDashboard() {
  const { data, loading, acknowledgeAlert } = useMonitoring();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>System Status: {data?.systemHealth.overall}</h1>
      {data?.alerts.map(alert => (
        <AlertCard 
          key={alert.id} 
          alert={alert} 
          onAcknowledge={() => acknowledgeAlert(alert.id)} 
        />
      ))}
    </div>
  );
}
```

### **3. Track Business Metrics**
```typescript
import { PropertyPlatformMonitoring } from '@/middleware/monitoring';

// Track property views
PropertyPlatformMonitoring.trackPropertyEvent(
  'property_view',
  'fitzgerald-gardens-unit-12',
  'user-123'
);

// Track revenue events
PropertyPlatformMonitoring.trackRevenueEvent(
  495000,
  'property_sale',
  'fitzgerald-gardens-unit-12'
);
```

## 🔧 Configuration

### **Environment Variables**
```bash
# Monitoring Configuration
MONITORING_ENABLED=true
MONITORING_INTERVAL=30000
ALERT_EMAIL_RECIPIENTS="kevin@prop.ie,ops@prop.ie"

# Performance Thresholds
API_RESPONSE_WARNING_MS=1000
API_RESPONSE_CRITICAL_MS=2000
ERROR_RATE_WARNING=0.05
ERROR_RATE_CRITICAL=0.10

# Business Metrics
REVENUE_TRACKING_ENABLED=true
USER_ACTIVITY_TRACKING=true
```

### **Monitoring Thresholds**
```typescript
const thresholds = {
  responseTime: {
    warning: 1000,   // 1 second
    critical: 2000   // 2 seconds
  },
  errorRate: {
    warning: 0.05,   // 5%
    critical: 0.10   // 10%
  },
  memoryUsage: {
    warning: 512,    // 512 MB
    critical: 1024   // 1 GB
  }
};
```

## 📈 Metrics Types

### **System Metrics**
- `RESPONSE_TIME` - API and database response times
- `ERROR_RATE` - Request error percentages
- `THROUGHPUT` - Requests per minute
- `MEMORY_USAGE` - Application memory consumption
- `CPU_USAGE` - Server CPU utilization

### **Business Metrics**
- `USER_ACTIVITY` - User registrations, logins, sessions
- `TRANSACTION_VOLUME` - Property transactions and reservations
- `REVENUE_TRACKING` - Sales revenue and commission tracking
- `EMAIL_DELIVERY` - Marketing campaign performance

## 🚨 Alert Management

### **Alert Severities**
- **LOW**: Informational alerts, no immediate action required
- **MEDIUM**: Performance degradation, monitor closely
- **HIGH**: Service issues affecting users, investigate immediately
- **CRITICAL**: System failure, immediate intervention required

### **Escalation Process**
1. **Immediate**: Alert appears in dashboard
2. **5 minutes**: Email notification sent
3. **15 minutes**: SMS notification (for CRITICAL alerts)
4. **30 minutes**: Auto-escalation to management

### **Troubleshooting Steps**
Each alert includes component-specific troubleshooting guides:

```typescript
const troubleshootingSteps = {
  'RESPONSE_TIME': [
    'Check API server load and CPU usage',
    'Review database query performance',
    'Examine network latency to external services',
    'Scale API instances if needed'
  ],
  'ERROR_RATE': [
    'Check application logs for error patterns',
    'Verify database connectivity',
    'Review recent deployments for issues',
    'Check third-party service status'
  ]
};
```

## 📊 Dashboard Metrics

### **Key Performance Indicators**
- **Response Time**: Average API response time (target: <500ms)
- **Error Rate**: Percentage of failed requests (target: <1%)
- **Throughput**: Requests per minute (baseline: 1000 RPM)
- **Active Users**: Current authenticated users
- **System Uptime**: Overall availability percentage (target: 99.9%)

### **Business Intelligence**
- **Revenue Today**: Daily transaction revenue
- **Active Transactions**: Pending property transactions
- **User Registrations**: New user signups
- **Property Views**: Property listing engagement
- **Conversion Rate**: Visitor to customer conversion

## 🔍 Health Check Endpoints

### **Basic Health Check**
```bash
GET /api/monitoring/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-19T10:30:00Z",
  "uptime": 86400,
  "services": {
    "api": { "status": "up", "responseTime": 45 },
    "database": { "status": "up", "responseTime": 12 },
    "email": { "status": "up" }
  },
  "businessMetrics": {
    "totalUsers": 156,
    "totalTransactions": 47,
    "totalRevenue": 16870000
  }
}
```

### **Load Balancer Health Check**
```bash
HEAD /api/monitoring/health
```
Returns 200 (healthy) or 503 (unhealthy) status codes.

## 🚀 Production Deployment

### **Infrastructure Setup**
1. **CloudWatch Integration**: Metrics sent to AWS CloudWatch
2. **Log Aggregation**: Structured logging with ELK stack
3. **Alert Channels**: Email, SMS, Slack notifications
4. **Dashboards**: Grafana dashboards for operations team

### **Monitoring Checklist**
- [ ] Health check endpoints configured
- [ ] Alert thresholds tuned for production
- [ ] Notification channels tested
- [ ] Dashboard access permissions set
- [ ] Backup monitoring systems configured
- [ ] Incident response procedures documented

## 📋 Testing

### **Run Monitoring Tests**
```bash
node test-monitoring-system.js
```

**Expected Results:**
- ✅ System health check functional
- ✅ Performance metrics collection working
- ✅ Database monitoring implemented
- ✅ Business metrics tracking active
- ✅ Alert system configured
- ✅ Real-time dashboard data available

### **Load Testing**
```bash
# Simulate high load
for i in {1..100}; do
  curl http://localhost:3001/api/monitoring/health &
done
```

## 🎯 Production Benefits

### **For Kevin's Business**
- **99.9% Uptime**: Ensure platform availability for September launch
- **Performance Optimization**: Identify and resolve bottlenecks
- **Revenue Protection**: Monitor transaction processing
- **User Experience**: Track and improve response times
- **Business Intelligence**: Real-time insights into platform performance

### **For Operations Team**
- **Proactive Alerting**: Detect issues before they impact users
- **Root Cause Analysis**: Detailed metrics for troubleshooting
- **Capacity Planning**: Usage trends for infrastructure scaling
- **SLA Monitoring**: Track service level agreement compliance

## 🔧 Maintenance

### **Daily Tasks**
- Review overnight alerts and system performance
- Check resource utilization trends
- Verify backup monitoring systems

### **Weekly Tasks**
- Analyze performance trends and capacity planning
- Review and tune alert thresholds
- Update monitoring dashboards

### **Monthly Tasks**
- Performance review and optimization recommendations
- Monitoring system health check
- Disaster recovery testing

---

**For Support**: Contact the monitoring team at ops@prop.ie
**Documentation**: This guide covers monitoring system v1.0
**Last Updated**: June 2025