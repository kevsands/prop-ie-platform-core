# CI/CD Pipeline and Monitoring Guide

This document provides comprehensive documentation for the CI/CD pipeline and monitoring setup for the PropIE AWS application.

## Table of Contents

1. [CI/CD Pipeline Overview](#cicd-pipeline-overview)
2. [GitHub Actions Workflows](#github-actions-workflows)
3. [AWS Amplify Deployment](#aws-amplify-deployment)
4. [Vercel Deployment](#vercel-deployment)
5. [Monitoring Setup](#monitoring-setup)
6. [Performance Monitoring](#performance-monitoring)
7. [Security Monitoring](#security-monitoring)
8. [Alerting and Notifications](#alerting-and-notifications)
9. [Dashboards and Reporting](#dashboards-and-reporting)
10. [Troubleshooting](#troubleshooting)

## CI/CD Pipeline Overview

The PropIE application uses a multi-stage CI/CD pipeline to ensure code quality and reliable deployments.

### Pipeline Stages

1. **Code Validation**
   - Code linting
   - TypeScript type checking
   - Unit tests
   - Security scanning

2. **Build Process**
   - Dependency installation
   - Application build
   - Bundle analysis

3. **Testing**
   - Unit tests
   - Integration tests
   - End-to-end tests (in staging)

4. **Deployment**
   - Environment-specific deployments
   - Automated validation

5. **Post-Deployment**
   - Smoke tests
   - Performance monitoring
   - Security validation

### Branch Strategy

The repository follows a branch strategy aligned with the deployment environments:

- `main` branch → Production environment
- `staging` branch → Staging environment
- `develop` branch → Development environment
- Feature branches → Preview/testing environments

## GitHub Actions Workflows

The CI/CD pipeline is implemented using GitHub Actions. The following workflows are configured:

### 1. Continuous Integration Workflow

File: `.github/workflows/ci.yml`

```yaml
name: Continuous Integration

on:
  push:
    branches: [develop, staging, main]
  pull_request:
    branches: [develop, staging, main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint code
        run: npm run lint
        
      - name: Type check
        run: npm run typecheck
        
      - name: Run unit tests
        run: npm run test
        
      - name: Run security scan
        run: npm audit --production --audit-level=high
        
  build:
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Analyze bundle
        run: npm run analyze
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-output
          path: .next
          retention-days: 1
```

### 2. Deployment Workflow

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy Application

on:
  push:
    branches: [develop, staging, main]
    
jobs:
  deploy_to_amplify:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Set environment variables
        id: set-env
        run: |
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            echo "env=production" >> $GITHUB_OUTPUT
            echo "branch=main" >> $GITHUB_OUTPUT
          elif [ "${{ github.ref }}" = "refs/heads/staging" ]; then
            echo "env=staging" >> $GITHUB_OUTPUT
            echo "branch=staging" >> $GITHUB_OUTPUT
          else
            echo "env=development" >> $GITHUB_OUTPUT
            echo "branch=develop" >> $GITHUB_OUTPUT
          fi
          
      - name: Deploy to AWS Amplify
        run: |
          echo "Deploying to ${{ steps.set-env.outputs.env }} environment"
          aws amplify start-job --app-id ${{ secrets.AMPLIFY_APP_ID }} --branch-name ${{ steps.set-env.outputs.branch }} --job-type RELEASE
          
      - name: Wait for deployment to complete
        run: |
          # Poll the deployment status
          status="IN_PROGRESS"
          while [ "$status" = "IN_PROGRESS" ]; do
            sleep 30
            status=$(aws amplify get-job --app-id ${{ secrets.AMPLIFY_APP_ID }} --branch-name ${{ steps.set-env.outputs.branch }} --job-id $JOB_ID --query 'job.summary.status' --output text)
            echo "Deployment status: $status"
          done
          
          if [ "$status" != "SUCCEED" ]; then
            echo "Deployment failed with status: $status"
            exit 1
          fi
          
      - name: Run post-deployment tests
        run: |
          echo "Running smoke tests for ${{ steps.set-env.outputs.env }} environment"
          # Add smoke test commands here
```

### 3. Pull Request Workflow

File: `.github/workflows/pull_request.yml`

```yaml
name: Pull Request Checks

on:
  pull_request:
    branches: [develop, staging, main]
    
jobs:
  validate_pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint code
        run: npm run lint
        
      - name: Type check
        run: npm run typecheck
        
      - name: Run unit tests
        run: npm run test
        
      - name: Check for sensitive information
        uses: gitleaks/gitleaks-action@v2
        
  preview_deployment:
    runs-on: ubuntu-latest
    needs: validate_pr
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to preview environment
        # This step would deploy to a preview environment
        # For Amplify, this would create a new branch deployment
        # For Vercel, this would create a preview deployment
        run: |
          echo "Deploying preview environment for PR #${{ github.event.pull_request.number }}"
          # Add preview deployment commands here
```

### 4. Security Scanning Workflow

File: `.github/workflows/security_scan.yml`

```yaml
name: Security Scanning

on:
  schedule:
    - cron: '0 0 * * 1' # Weekly on Monday
  workflow_dispatch:

jobs:
  security_scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run npm audit
        run: npm audit --json > npm-audit.json || true
        
      - name: Run SAST scan
        uses: github/codeql-action/analyze@v2
        with:
          languages: javascript, typescript
          
      - name: Run dependency scanning
        uses: snyk/actions/node@master
        with:
          args: --all-projects
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
          
      - name: Create security report
        run: |
          echo "Security Scan Report" > security-report.md
          echo "===================" >> security-report.md
          echo "" >> security-report.md
          echo "## npm audit results" >> security-report.md
          cat npm-audit.json | jq -r '.advisories | length' | xargs -I{} echo "{} vulnerabilities found" >> security-report.md
          
      - name: Upload security report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: security-report.md
          
      - name: Notify on vulnerabilities
        if: ${{ failure() }}
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Security vulnerabilities found',
              body: 'Security scanning found potential vulnerabilities. Please review the security report.'
            })
```

## AWS Amplify Deployment

AWS Amplify is the primary deployment platform for the PropIE application.

### Amplify Configuration

The application is configured for deployment to AWS Amplify in the `amplify.yml` file:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - echo "Building for environment $ENVIRONMENT"
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*

  customHeaders:
    - pattern: '**/*'
      headers:
        - key: 'Strict-Transport-Security'
          value: 'max-age=31536000; includeSubDomains'
        - key: 'X-Content-Type-Options'
          value: 'nosniff'
        - key: 'X-Frame-Options'
          value: 'DENY'
        - key: 'X-XSS-Protection'
          value: '1; mode=block'
        - key: 'Referrer-Policy'
          value: 'same-origin'
    - pattern: '/_next/**/*'
      headers:
        - key: 'Cache-Control'
          value: 'public, max-age=31536000, immutable'
```

### Branch Mapping

AWS Amplify is configured with the following branch mapping:

| Git Branch | Environment | Domain |
|------------|-------------|--------|
| `main` | Production | app.propieapp.com |
| `staging` | Staging | staging.propieapp.com |
| `develop` | Development | dev.propieapp.com |
| Feature branches | Preview | feature-*.propieapp.com |

### Environment Variables

AWS Amplify is configured with environment-specific variables. These variables are managed through the AWS Amplify Console and are automatically applied during deployment.

### Custom Domains

AWS Amplify is configured with custom domains for each environment:

1. **Production**: app.propieapp.com
2. **Staging**: staging.propieapp.com
3. **Development**: dev.propieapp.com

The domain configuration includes:

- SSL certificate management
- Automatic subdomain creation
- HTTPS redirection
- Domain verification

## Vercel Deployment

Vercel is used as an alternative deployment platform, particularly for preview environments.

### Vercel Configuration

The Vercel configuration is defined in `vercel.json`:

```json
{
  "env": {
    "NEXT_PUBLIC_ENVIRONMENT": "production"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_ENVIRONMENT": "production"
    }
  },
  "github": {
    "silent": true,
    "autoAlias": true
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "same-origin"
        }
      ]
    }
  ],
  "redirects": [],
  "regions": ["iad1"]
}
```

### Vercel Project Settings

Vercel project settings include:

1. **Framework Preset**: Next.js
2. **Root Directory**: ./
3. **Build Command**: npm run build
4. **Output Directory**: .next
5. **Install Command**: npm ci

### Preview Deployments

Vercel automatically creates preview deployments for each pull request. The preview URL is added as a comment to the pull request.

## Monitoring Setup

The application uses a combination of monitoring tools to ensure optimal performance and reliability.

### AWS CloudWatch Monitoring

AWS CloudWatch is configured to monitor the following metrics:

1. **Application Metrics**
   - Request count
   - Error rate
   - Latency
   - 5xx error rate
   - 4xx error rate

2. **Infrastructure Metrics**
   - CPU utilization
   - Memory usage
   - Network traffic
   - Disk I/O

3. **Custom Metrics**
   - Authentication success/failure rate
   - API call volume
   - GraphQL query/mutation performance
   - Cache hit/miss ratio

### CloudWatch Dashboard

A CloudWatch dashboard is created to provide a comprehensive view of application health and performance. The dashboard is defined in `infrastructure/monitoring/dashboard.tf`:

```hcl
resource "aws_cloudwatch_dashboard" "propie_dashboard" {
  dashboard_name = "PropIE-${var.environment}-Dashboard"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Count", "ApiName", "PropIE-API", { "stat": "Sum" }],
            ["AWS/ApiGateway", "4XXError", "ApiName", "PropIE-API", { "stat": "Sum" }],
            ["AWS/ApiGateway", "5XXError", "ApiName", "PropIE-API", { "stat": "Sum" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Request Volume and Errors"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Latency", "ApiName", "PropIE-API", { "stat": "Average" }],
            ["AWS/ApiGateway", "IntegrationLatency", "ApiName", "PropIE-API", { "stat": "Average" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "API Latency"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Cognito", "SignInSuccesses", "UserPool", var.cognito_user_pool_id, { "stat": "Sum" }],
            ["AWS/Cognito", "SignUpSuccesses", "UserPool", var.cognito_user_pool_id, { "stat": "Sum" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Authentication Activity"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["PropIE/Custom", "ApiCallSuccess", "Environment", var.environment, { "stat": "Sum" }],
            ["PropIE/Custom", "ApiCallError", "Environment", var.environment, { "stat": "Sum" }],
            ["PropIE/Custom", "GraphQLQueryLatency", "Environment", var.environment, { "stat": "Average" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Custom Application Metrics"
          period  = 300
        }
      }
    ]
  })
}
```

### CloudWatch Alarms

CloudWatch alarms are configured to alert on critical metrics. Alarms are defined in `infrastructure/monitoring/cloudwatch-alarms.tf`:

```hcl
# High Error Rate Alarm
resource "aws_cloudwatch_metric_alarm" "api_error_rate" {
  alarm_name          = "PropIE-${var.environment}-HighErrorRate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "5XXError"
  namespace           = "AWS/ApiGateway"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "This alarm monitors for high 5XX error rates in the API"
  alarm_actions       = [aws_sns_topic.monitoring_alerts.arn]
  
  dimensions = {
    ApiName = "PropIE-API"
  }
}

# High Latency Alarm
resource "aws_cloudwatch_metric_alarm" "api_high_latency" {
  alarm_name          = "PropIE-${var.environment}-HighLatency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Latency"
  namespace           = "AWS/ApiGateway"
  period              = 300
  statistic           = "Average"
  threshold           = 2000  # 2 seconds
  alarm_description   = "This alarm monitors for high API latency"
  alarm_actions       = [aws_sns_topic.monitoring_alerts.arn]
  
  dimensions = {
    ApiName = "PropIE-API"
  }
}

# Authentication Failure Alarm
resource "aws_cloudwatch_metric_alarm" "auth_failures" {
  alarm_name          = "PropIE-${var.environment}-AuthFailures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "SignInFailures"
  namespace           = "AWS/Cognito"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "This alarm monitors for excessive authentication failures"
  alarm_actions       = [aws_sns_topic.monitoring_alerts.arn]
  
  dimensions = {
    UserPool = var.cognito_user_pool_id
  }
}
```

## Performance Monitoring

The application includes comprehensive client-side performance monitoring.

### Web Vitals Monitoring

Web Vitals are monitored to ensure optimal user experience:

```typescript
// src/lib/monitoring/webVitals.ts
import { NextWebVitalsMetric } from 'next/app';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
  
  // Send to CloudWatch in production
  if (process.env.NODE_ENV === 'production') {
    const { id, name, value, label, startTime } = metric;
    
    const body = JSON.stringify({
      name,
      id,
      value,
      label,
      startTime,
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    });
    
    // Using sendBeacon for non-blocking reporting
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/monitoring/web-vitals', body);
    } else {
      // Fallback to fetch
      fetch('/api/monitoring/web-vitals', {
        body,
        method: 'POST',
        keepalive: true,
      });
    }
  }
}
```

### API Performance Monitoring

API performance is monitored through custom instrumentation:

```typescript
// src/lib/monitoring/apiPerformance.ts
import config from '@/config/environment';

interface ApiMetric {
  operation: string;
  duration: number;
  status: 'success' | 'error';
  timestamp: number;
  path?: string;
}

const metrics: ApiMetric[] = [];
let flushInterval: NodeJS.Timeout | null = null;

// Initialize API monitoring
export function initApiMonitoring() {
  if (!config.features.enablePerformanceMonitoring) {
    return;
  }
  
  // Set up periodic flushing of metrics
  flushInterval = setInterval(flushMetrics, 30000); // 30 seconds
  
  // Flush metrics on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flushMetrics);
  }
}

// Stop API monitoring
export function stopApiMonitoring() {
  if (flushInterval) {
    clearInterval(flushInterval);
    flushInterval = null;
  }
  
  if (typeof window !== 'undefined') {
    window.removeEventListener('beforeunload', flushMetrics);
  }
}

// Record API metric
export function recordApiMetric(
  operation: string,
  duration: number,
  status: 'success' | 'error' = 'success',
  path?: string,
) {
  if (!config.features.enablePerformanceMonitoring) {
    return;
  }
  
  metrics.push({
    operation,
    duration,
    status,
    timestamp: Date.now(),
    path,
  });
  
  // Flush if we have a lot of metrics
  if (metrics.length >= 50) {
    flushMetrics();
  }
}

// Flush metrics to server
function flushMetrics() {
  if (metrics.length === 0) {
    return;
  }
  
  const metricsToSend = [...metrics];
  metrics.length = 0;
  
  // Send metrics to server
  if (typeof window !== 'undefined' && window.navigator.sendBeacon) {
    navigator.sendBeacon('/api/monitoring/api-metrics', JSON.stringify(metricsToSend));
  } else {
    fetch('/api/monitoring/api-metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metricsToSend),
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to send API metrics:', error);
    });
  }
}

// API performance measurement wrapper
export async function measureApiCall<T>(
  operation: string,
  apiFn: () => Promise<T>,
  path?: string,
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await apiFn();
    const duration = performance.now() - startTime;
    
    recordApiMetric(operation, duration, 'success', path);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    recordApiMetric(operation, duration, 'error', path);
    throw error;
  }
}
```

## Security Monitoring

The application includes security monitoring to detect and respond to security threats.

### Authentication Monitoring

Authentication activity is monitored to detect unauthorized access attempts:

```typescript
// src/lib/security/authLogger.ts
import config from '@/config/environment';

export enum AuthEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_RESET = 'PASSWORD_RESET',
  SIGNUP = 'SIGNUP',
  MFA_SUCCESS = 'MFA_SUCCESS',
  MFA_FAILURE = 'MFA_FAILURE',
}

interface AuthEvent {
  type: AuthEventType;
  username?: string;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;
}

const authEvents: AuthEvent[] = [];
let flushInterval: NodeJS.Timeout | null = null;

// Initialize auth logging
export function initAuthLogging() {
  // Set up periodic flushing of auth events
  flushInterval = setInterval(flushAuthEvents, 60000); // 60 seconds
  
  // Flush auth events on page unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flushAuthEvents);
  }
}

// Stop auth logging
export function stopAuthLogging() {
  if (flushInterval) {
    clearInterval(flushInterval);
    flushInterval = null;
  }
  
  if (typeof window !== 'undefined') {
    window.removeEventListener('beforeunload', flushAuthEvents);
  }
}

// Log auth event
export function logAuthEvent(
  type: AuthEventType,
  username?: string,
  errorMessage?: string,
) {
  const event: AuthEvent = {
    type,
    username,
    timestamp: Date.now(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    errorMessage,
  };
  
  authEvents.push(event);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth Event:', event);
  }
  
  // Flush if we have a lot of events
  if (authEvents.length >= 10) {
    flushAuthEvents();
  }
}

// Flush auth events to server
function flushAuthEvents() {
  if (authEvents.length === 0) {
    return;
  }
  
  const eventsToSend = [...authEvents];
  authEvents.length = 0;
  
  // Send events to server
  fetch('/api/security/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventsToSend),
    keepalive: true,
  }).catch((error) => {
    console.error('Failed to send auth events:', error);
  });
}
```

### Security Audit Logging

Security-relevant events are logged for audit purposes:

```typescript
// src/lib/security/auditLogger.ts
import config from '@/config/environment';

export enum AuditEventType {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  PERMISSION_CHANGED = 'PERMISSION_CHANGED',
  SENSITIVE_DATA_ACCESSED = 'SENSITIVE_DATA_ACCESSED',
  CONFIGURATION_CHANGED = 'CONFIGURATION_CHANGED',
  SECURITY_SETTING_CHANGED = 'SECURITY_SETTING_CHANGED',
}

interface AuditEvent {
  type: AuditEventType;
  userId?: string;
  targetId?: string;
  action: string;
  details?: Record<string, any>;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
}

// Log audit event
export async function logAuditEvent(
  type: AuditEventType,
  userId: string,
  action: string,
  details?: Record<string, any>,
  targetId?: string,
) {
  const event: AuditEvent = {
    type,
    userId,
    targetId,
    action,
    details,
    timestamp: Date.now(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Audit Event:', event);
  }
  
  // Send to server
  try {
    await fetch('/api/security/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}
```

## Alerting and Notifications

The application uses multiple channels for alerting and notifications:

### 1. AWS SNS Topics

SNS topics are used to distribute alerts:

```hcl
# Create SNS topic for alerts
resource "aws_sns_topic" "monitoring_alerts" {
  name = "PropIE-${var.environment}-Alerts"
}

# Subscribe to SNS topic (email)
resource "aws_sns_topic_subscription" "email_alerts" {
  topic_arn = aws_sns_topic.monitoring_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# Subscribe to SNS topic (SMS)
resource "aws_sns_topic_subscription" "sms_alerts" {
  topic_arn = aws_sns_topic.monitoring_alerts.arn
  protocol  = "sms"
  endpoint  = var.alert_phone
}
```

### 2. Slack Notifications

Slack notifications are integrated for team communication:

```typescript
// src/lib/monitoring/slack.ts
export async function sendSlackNotification(
  channel: string,
  message: string,
  attachments?: any[],
) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error('Slack webhook URL not configured');
      return;
    }
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel,
        text: message,
        attachments,
      }),
    });
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
  }
}
```

### 3. PagerDuty Integration

Critical alerts are sent to PagerDuty for on-call notification:

```typescript
// src/lib/monitoring/pagerduty.ts
export async function createPagerDutyIncident(
  title: string,
  description: string,
  severity: 'critical' | 'error' | 'warning' | 'info',
  details?: Record<string, any>,
) {
  try {
    const apiKey = process.env.PAGERDUTY_API_KEY;
    const serviceId = process.env.PAGERDUTY_SERVICE_ID;
    
    if (!apiKey || !serviceId) {
      console.error('PagerDuty configuration missing');
      return;
    }
    
    await fetch('https://api.pagerduty.com/incidents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token token=${apiKey}`,
        'Accept': 'application/vnd.pagerduty+json;version=2',
      },
      body: JSON.stringify({
        incident: {
          type: 'incident',
          title,
          service: {
            id: serviceId,
            type: 'service_reference',
          },
          urgency: severity === 'critical' ? 'high' : 'low',
          body: {
            type: 'incident_body',
            details: description,
          },
          custom_details: details,
        },
      }),
    });
  } catch (error) {
    console.error('Failed to create PagerDuty incident:', error);
  }
}
```

## Dashboards and Reporting

### Operational Dashboard

A comprehensive operational dashboard is available for monitoring application health:

- **URL**: https://monitoring.propieapp.com/dashboard
- **Authentication**: Requires operations team credentials
- **Refresh rate**: 5 minutes
- **Data retention**: 90 days

### Performance Reports

Weekly performance reports are generated automatically:

- **Delivery**: Emailed to stakeholders every Monday
- **Contents**:
  - Overall performance metrics
  - Top 5 slowest API endpoints
  - Authentication success rate
  - Error rate trends
  - User engagement metrics

### Security Reports

Monthly security reports provide insights into security posture:

- **Delivery**: Emailed to security team on the 1st of each month
- **Contents**:
  - Authentication anomalies
  - Blocked attack attempts
  - Security patch status
  - Compliance status

## Troubleshooting

### Common CI/CD Issues

1. **Build Failures**
   - Check the build logs for specific errors
   - Verify that all dependencies are installed
   - Ensure environment variables are correctly set
   - Confirm that tests are passing

2. **Deployment Failures**
   - Check the AWS Amplify deployment logs
   - Verify AWS credentials and permissions
   - Ensure that the build output is correctly configured
   - Check for resource limitations or quota issues

3. **Monitoring Issues**
   - Verify that CloudWatch metrics are being emitted
   - Check that alarms are correctly configured
   - Ensure that notification endpoints are valid
   - Test the notification pipeline manually

### Getting Help

For assistance with CI/CD pipeline and monitoring issues, contact:

- **CI/CD Pipeline Issues**: devops@propieapp.com
- **Monitoring Issues**: monitoring@propieapp.com
- **Security Issues**: security@propieapp.com

### Additional Resources

- **AWS Amplify Documentation**: https://docs.aws.amazon.com/amplify/
- **CloudWatch Documentation**: https://docs.aws.amazon.com/cloudwatch/
- **GitHub Actions Documentation**: https://docs.github.com/en/actions