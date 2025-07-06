# PROP.ie Production Runbooks & Incident Response

## 🚨 Emergency Response Procedures

### Incident Classification

| Severity | Description | Response Time | Escalation |
|----------|-------------|---------------|------------|
| **P1 - Critical** | Complete service outage, payment failures, data loss | 15 minutes | Immediate escalation to CTO |
| **P2 - High** | Significant performance degradation, auth issues | 1 hour | Team lead notification |
| **P3 - Medium** | Minor feature issues, non-critical bugs | 4 hours | Next business day |
| **P4 - Low** | Cosmetic issues, documentation | 24 hours | Weekly review |

### Emergency Contacts

| Role | Contact | Primary | Secondary |
|------|---------|---------|-----------|
| **On-Call Engineer** | engineering@prop.ie | +353-xx-xxx-xxx1 | Slack: #prop-ie-alerts |
| **Database Admin** | dba@prop.ie | +353-xx-xxx-xxx2 | AWS RDS Console |
| **DevOps Lead** | devops@prop.ie | +353-xx-xxx-xxx3 | AWS Console Access |
| **CTO** | cto@prop.ie | +353-xx-xxx-xxx4 | Emergency escalation |

## 🔥 Critical Incident Response

### Service Outage (P1)

**Immediate Actions (0-15 minutes):**

1. **Acknowledge the Alert**
   ```bash
   # Check system status
   curl -I https://prop.ie/api/health
   
   # Check AWS Amplify status
   aws amplify get-app --app-id YOUR_APP_ID
   
   # Check database connectivity
   psql $DATABASE_URL -c "SELECT 1;"
   ```

2. **Assess Impact**
   - Check monitoring dashboards
   - Verify user impact scope
   - Document start time and symptoms

3. **Communicate Status**
   ```bash
   # Post to status page
   echo "Investigating service issues" > status.txt
   
   # Notify stakeholders
   # - Engineering team (Slack)
   # - Management (Email)
   # - Users (Status page)
   ```

**Investigation & Resolution (15-60 minutes):**

4. **Investigate Root Cause**
   ```bash
   # Check recent deployments
   git log --oneline -10
   
   # Review error logs
   tail -f /var/log/application.log
   
   # Check infrastructure metrics
   aws cloudwatch get-metric-statistics --namespace AWS/ApplicationELB
   ```

5. **Implement Fix**
   - Apply immediate workaround if available
   - Rollback recent deployment if necessary
   - Scale resources if capacity issue

6. **Verify Resolution**
   ```bash
   # Test critical user journeys
   npm run test:e2e:critical
   
   # Monitor metrics for stability
   watch -n 30 'curl -s https://prop.ie/api/health'
   ```

### Database Issues (P1)

**PostgreSQL Connection Failures:**

```bash
# Check database status
aws rds describe-db-instances --db-instance-identifier propie-production

# Check connection pool
SELECT * FROM pg_stat_activity WHERE state = 'active';

# Check for long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

# Kill problematic queries if necessary
SELECT pg_terminate_backend(pid);
```

**Database Performance Issues:**

```bash
# Check slow queries
SELECT query, mean_time, calls, total_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

# Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE schemaname = 'public';

# Apply emergency optimizations
REINDEX DATABASE propie_production;
ANALYZE;
```

### Payment Processing Failures (P1)

**Stripe Integration Issues:**

```bash
# Check Stripe webhook status
curl -X GET https://api.stripe.com/v1/webhook_endpoints \
  -u sk_live_YOUR_KEY:

# Test payment processing
curl -X POST https://prop.ie/api/payments/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check recent payment failures
SELECT * FROM payments 
WHERE status = 'failed' 
AND created_at > NOW() - INTERVAL '1 hour';
```

## 📊 Performance Incident Response

### High Response Times (P2)

**Investigation Steps:**

```bash
# Check APM metrics
curl https://prop.ie/api/monitoring/performance

# Identify slow endpoints
grep "response_time" /var/log/application.log | \
  awk '$NF > 2000 {print}' | \
  sort | uniq -c | sort -nr

# Check database performance
SELECT * FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;

# Check Redis cache performance
redis-cli --latency-history -i 1
```

**Mitigation Actions:**

```bash
# Enable emergency caching
curl -X POST https://prop.ie/api/cache/emergency-mode

# Scale application instances
aws amplify start-deployment --app-id YOUR_APP_ID

# Optimize database if needed
psql $DATABASE_URL -c "
  SELECT pg_stat_reset();
  REINDEX CONCURRENTLY INDEX CONCURRENTLY;
"
```

### Memory/CPU Issues (P2)

```bash
# Check resource usage
top -p $(pgrep -f "node.*next")

# Check memory leaks
node --inspect app.js &
# Connect Chrome DevTools for memory profiling

# Check garbage collection
node --trace-gc app.js 2> gc.log &

# Emergency restart if necessary
pm2 restart propie-production --update-env
```

## 🔐 Security Incident Response

### Suspected Attack (P1)

**Immediate Actions:**

```bash
# Check for suspicious patterns
grep -E "rate|limit|403|401" /var/log/access.log | \
  tail -1000 | \
  awk '{print $1}' | \
  sort | uniq -c | \
  sort -nr | head -20

# Check authentication failures
SELECT ip_address, COUNT(*) as attempts
FROM failed_login_attempts 
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip_address 
ORDER BY attempts DESC;

# Enable emergency rate limiting
curl -X POST https://prop.ie/api/security/emergency-mode
```

### Data Breach Suspicion (P1)

```bash
# Secure immediate environment
# 1. Rotate all API keys
# 2. Invalidate all user sessions
# 3. Enable additional logging

# Check for data exfiltration
SELECT user_id, COUNT(*) as requests
FROM api_requests 
WHERE endpoint LIKE '%export%' 
AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY user_id 
ORDER BY requests DESC;

# Activate incident response team
# 1. Notify legal team
# 2. Document all actions
# 3. Preserve evidence
```

## 🔄 Deployment Issues

### Failed Deployment Rollback

```bash
# Check deployment status
aws amplify get-job --app-id YOUR_APP_ID --branch-name production --job-id LATEST

# Rollback to previous version
git revert HEAD --no-edit
git push origin production

# Or manual rollback via AWS
aws amplify start-deployment \
  --app-id YOUR_APP_ID \
  --branch-name production \
  --source-url "previous-commit-hash"

# Verify rollback success
curl -s https://prop.ie/api/health | jq '.status'
```

### Database Migration Failures

```bash
# Check migration status
npx prisma migrate status

# Rollback migration if necessary
npx prisma migrate resolve --rolled-back MIGRATION_NAME

# Manual database fixes if needed
psql $DATABASE_URL

# Re-run migrations safely
npx prisma migrate deploy --schema=./prisma/schema-unified.prisma
```

## 📈 Monitoring & Alerting

### Key Metrics to Monitor

| Metric | Normal Range | Alert Threshold |
|--------|--------------|-----------------|
| **Response Time** | < 500ms | > 2000ms |
| **Error Rate** | < 1% | > 5% |
| **Uptime** | 99.9% | < 99.9% |
| **Memory Usage** | < 70% | > 85% |
| **CPU Usage** | < 60% | > 80% |
| **Database Connections** | < 50 | > 80 |
| **Payment Success Rate** | > 98% | < 95% |

### Health Check Endpoints

```bash
# Application health
curl https://prop.ie/api/health

# Database health
curl https://prop.ie/api/health/database

# Payment processing health
curl https://prop.ie/api/health/payments

# Authentication health
curl https://prop.ie/api/auth/session

# Real-time services health
curl https://prop.ie/api/realtime
```

## 🧪 Testing in Production

### Smoke Tests After Deployment

```bash
#!/bin/bash
# Post-deployment smoke tests

echo "🧪 Running production smoke tests..."

# Test homepage
if curl -sf https://prop.ie > /dev/null; then
  echo "✅ Homepage responding"
else
  echo "❌ Homepage failed"
  exit 1
fi

# Test API health
if curl -sf https://prop.ie/api/health | grep -q "ok"; then
  echo "✅ API health check passed"
else
  echo "❌ API health check failed"
  exit 1
fi

# Test authentication
if curl -sf https://prop.ie/api/auth/session; then
  echo "✅ Authentication service responding"
else
  echo "❌ Authentication service failed"
  exit 1
fi

# Test database
if curl -sf https://prop.ie/api/health/database | grep -q "connected"; then
  echo "✅ Database connectivity verified"
else
  echo "❌ Database connection failed"
  exit 1
fi

# Test payments
if curl -sf https://prop.ie/api/health/payments | grep -q "operational"; then
  echo "✅ Payment processing operational"
else
  echo "❌ Payment processing failed"
  exit 1
fi

echo "🎉 All smoke tests passed!"
```

## 📋 Maintenance Procedures

### Planned Maintenance Window

**Pre-maintenance (T-2 hours):**

```bash
# 1. Notify users via status page
echo "Scheduled maintenance in 2 hours" > maintenance-notice.txt

# 2. Take database backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M).sql

# 3. Verify backup integrity
pg_restore --list backup-$(date +%Y%m%d-%H%M).sql

# 4. Scale down non-essential services
```

**During maintenance (T-0):**

```bash
# 1. Enable maintenance mode
curl -X POST https://prop.ie/api/maintenance/enable

# 2. Perform updates
# - Database migrations
# - Application deployment
# - Configuration changes

# 3. Run validation tests
npm run test:production-validation
```

**Post-maintenance (T+30 minutes):**

```bash
# 1. Disable maintenance mode
curl -X POST https://prop.ie/api/maintenance/disable

# 2. Run comprehensive tests
npm run test:e2e:full

# 3. Monitor metrics for 2 hours
# 4. Update status page
```

### Database Maintenance

**Weekly Tasks:**

```sql
-- Update table statistics
ANALYZE;

-- Reindex if needed
REINDEX DATABASE propie_production;

-- Clean up old data
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM sessions WHERE expires_at < NOW();

-- Check for bloated tables
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 📞 Communication Templates

### Internal Incident Notification

```
🚨 INCIDENT ALERT - PROP.ie Production

Severity: P1 - Critical
Started: [TIMESTAMP]
Status: Investigating

Issue: [BRIEF DESCRIPTION]
Impact: [USER IMPACT]
ETA: [ESTIMATED RESOLUTION]

Assigned: [ENGINEER NAME]
Updates: Every 15 minutes

Dashboard: https://monitoring.prop.ie
Status: https://status.prop.ie
```

### Customer Communication

```
We're currently experiencing technical difficulties with our platform. 
Our engineering team is actively working to resolve this issue.

We apologize for any inconvenience and will provide updates as they become available.

Status updates: https://status.prop.ie
Support: support@prop.ie

The PROP.ie Team
```

## 🔧 Useful Commands & Scripts

### Quick Diagnostics

```bash
# System overview
./scripts/system-overview.sh

# Database diagnostics
./scripts/db-diagnostics.sh

# Performance check
./scripts/performance-check.sh

# Security audit
./scripts/security-audit.sh

# Generate incident report
./scripts/generate-incident-report.sh
```

### Log Analysis

```bash
# Find errors in last hour
grep -i error /var/log/application.log | \
  grep "$(date -d '1 hour ago' '+%Y-%m-%d %H')"

# Analyze response times
awk '{print $NF}' /var/log/access.log | \
  sort -n | \
  awk '{a[i++]=$1} END {print "median:", a[int(i/2)]}'

# Check user agents for bots
awk -F'"' '{print $6}' /var/log/access.log | \
  sort | uniq -c | sort -nr | head -20
```

---

*PROP.ie Production Runbooks - Ireland's Most Advanced Property Technology Platform*
*For 24/7 Support: emergency@prop.ie | +353-xx-xxx-xxxx*