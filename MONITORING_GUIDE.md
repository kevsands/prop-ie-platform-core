# Prop.ie Platform Monitoring & Health Check System

This comprehensive monitoring system provides real-time insights into the platform's health, performance, and resource utilization.

## Overview

The monitoring system includes:
- Health check API endpoint (`/api/health`)
- Metrics collection endpoint (`/api/metrics`)
- Real-time monitoring dashboard (`/monitoring`)
- CloudWatch integration
- Error tracking with Sentry support
- Performance monitoring utilities

## API Endpoints

### Health Check Endpoint

**URL**: `/api/health`  
**Method**: `GET`  
**Description**: Returns the current health status of the platform and its dependencies.

**Response Example**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "service": "PropIE AWS Application",
  "version": "0.1.0",
  "uptime": 3600,
  "environment": "production",
  "checks": {
    "database": {
      "status": "ok",
      "responseTime": 5,
      "details": { "provider": "PostgreSQL" }
    },
    "redis": {
      "status": "ok",
      "responseTime": 1
    },
    "externalServices": {
      "status": "ok",
      "responseTime": 10,
      "details": {
        "aws": { "status": "ok", "region": "us-east-1" },
        "amplify": { "status": "ok", "configured": true }
      }
    }
  },
  "system": {
    "memory": {
      "total": 8589934592,
      "free": 4294967296,
      "used": 4294967296,
      "percentUsed": 50
    },
    "cpu": {
      "cores": 4,
      "loadAverage": [0.5, 0.7, 0.6],
      "percentUsed": 25
    },
    "process": {
      "memoryUsage": { /* Node.js memory details */ },
      "uptime": 3600,
      "pid": 12345
    }
  }
}
```

### Metrics Endpoint

**URL**: `/api/metrics`  
**Method**: `GET`  
**Description**: Returns detailed performance metrics and statistics.

**Response Example**:
```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "period": "since_startup",
  "application": {
    "version": "0.1.0",
    "environment": "production",
    "uptime": 3600000,
    "pid": 12345
  },
  "performance": {
    "averageResponseTime": 125.5,
    "requestsPerSecond": 10.5,
    "errorRate": 0.02,
    "successRate": 0.98,
    "activeConnections": 50,
    "totalRequests": 37800,
    "totalErrors": 756
  },
  "resources": {
    "memory": { /* Memory usage details */ },
    "cpu": { /* CPU usage details */ },
    "disk": { /* Disk usage details */ }
  },
  "database": {
    "connections": {
      "active": 5,
      "idle": 10,
      "total": 15
    },
    "queryPerformance": {
      "averageTime": 20.5,
      "slowQueries": 3
    }
  },
  "cache": {
    "hitRate": 0.85,
    "missRate": 0.15,
    "evictions": 100,
    "keys": 1500
  },
  "endpoints": [
    {
      "path": "/api/properties",
      "method": "GET",
      "count": 1200,
      "averageTime": 150.5,
      "errorRate": 0.01
    }
  ]
}
```

## Monitoring Dashboard

Access the monitoring dashboard at `/monitoring` to view:

- Real-time system status
- Performance metrics and trends
- Resource utilization graphs
- Service health checks
- Error rates and trends
- Top endpoints by traffic and response time
- Database and cache performance

## Configuration

### Environment Variables

```env
# CloudWatch Configuration
CLOUDWATCH_ENABLED=true
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Error Tracking
SENTRY_DSN=your-sentry-dsn
ERROR_TRACKING_ENABLED=true

# Monitoring Settings
MONITORING_INTERVAL=5000  # milliseconds
SLOW_QUERY_THRESHOLD=1000  # milliseconds
ERROR_RATE_THRESHOLD=0.05  # 5%
```

## Middleware Integration

The monitoring middleware automatically tracks:
- Request/response times
- HTTP status codes
- Error rates
- Active sessions
- User activity

```typescript
// Metrics are automatically recorded for all requests
import { monitoringMiddleware } from '@/middleware/monitoring';
```

## Performance Monitoring Utilities

Use the performance monitoring utilities in your code:

```typescript
import { monitorAsyncOperation, PerformanceMonitor } from '@/utils/monitoring';

// Monitor async operations
const result = await monitorAsyncOperation(
  'database-query',
  async () => await db.query('SELECT * FROM users'),
  { queryType: 'select' }
);

// Use PerformanceMonitor for complex operations
const monitor = new PerformanceMonitor();
monitor.start('complex-operation');
// ... perform operations
monitor.end('complex-operation');
const report = monitor.getReport();
```

## CloudWatch Integration

The system automatically sends metrics to CloudWatch:

```typescript
import { Metrics } from '@/lib/cloudwatch';

// Track custom business metrics
await Metrics.trackBusinessEvent('user-registration', 1, {
  plan: 'premium',
  source: 'web'
});

// Track performance metrics
await Metrics.trackPerformance('api-latency', responseTime);
```

## Error Tracking

Errors are automatically tracked and reported:

```typescript
import { trackError, BusinessError } from '@/lib/error-tracking';

try {
  // Your code
} catch (error) {
  trackError(error, {
    userId: user.id,
    path: request.path,
    metadata: { custom: 'data' }
  });
}

// Throw specific business errors
throw new BusinessError(
  'Invalid transaction',
  'INVALID_TRANSACTION',
  400,
  { transactionId: txId }
);
```

## Health Check Best Practices

1. **Dependency Checks**: Test all critical dependencies (database, cache, external APIs)
2. **Fast Response**: Keep health checks lightweight for quick responses
3. **Graceful Degradation**: Return "degraded" status if non-critical services are down
4. **Security**: Don't expose sensitive information in health check responses

## Monitoring Best Practices

1. **Metric Collection**: Record metrics for all critical operations
2. **Alerting**: Set up alerts for abnormal patterns
3. **Retention**: Configure appropriate metric retention periods
4. **Sampling**: Use sampling for high-traffic endpoints
5. **Custom Metrics**: Add business-specific metrics

## Troubleshooting

### Common Issues

1. **High Memory Usage**:
   - Check for memory leaks in application code
   - Review cache eviction policies
   - Analyze heap dumps

2. **Slow Response Times**:
   - Check database query performance
   - Review API endpoint complexity
   - Analyze network latency

3. **High Error Rates**:
   - Check application logs
   - Review error patterns in monitoring dashboard
   - Verify external service availability

## Integration with CI/CD

Include health checks in your deployment pipeline:

```bash
# Check health after deployment
curl -f http://localhost:3000/api/health || exit 1

# Verify metrics endpoint
curl -f http://localhost:3000/api/metrics || exit 1
```

## Future Enhancements

- [ ] Add distributed tracing support
- [ ] Implement custom alerting rules
- [ ] Add A/B testing metrics
- [ ] Create mobile app monitoring
- [ ] Add user experience metrics
- [ ] Implement SLA tracking

## Support

For monitoring-related issues:
1. Check the monitoring dashboard
2. Review CloudWatch logs
3. Check Sentry for error details
4. Contact DevOps team