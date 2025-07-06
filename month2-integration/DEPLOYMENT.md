# PROP.ie Production Deployment Guide

## 🚀 Enterprise Deployment Checklist

This guide provides step-by-step instructions for deploying PROP.ie to production with enterprise-grade security, monitoring, and performance.

---

## 📋 Pre-Deployment Checklist

### ✅ Infrastructure Prerequisites

- [ ] **AWS Account** with appropriate permissions
- [ ] **Domain name** configured (prop.ie)
- [ ] **SSL certificates** obtained for HTTPS
- [ ] **PostgreSQL database** provisioned (AWS RDS recommended)
- [ ] **Redis instance** for caching and sessions
- [ ] **S3 buckets** for document storage
- [ ] **CloudFront CDN** configured
- [ ] **Load balancer** set up for high availability

### ✅ Third-Party Services

- [ ] **Stripe live account** configured with production API keys
- [ ] **AWS Cognito** production user pool created
- [ ] **SendGrid** account for email delivery
- [ ] **Sentry** project for error monitoring
- [ ] **Twilio** account for SMS/MFA (optional)

---

## 🔧 Environment Configuration

### 1. Production Environment Variables

Copy `.env.production.template` to `.env.production` and configure:

```bash
# Copy template
cp .env.production.template .env.production

# Edit with production values
nano .env.production
```

**Critical variables to configure:**

```bash
# Core Application
NEXT_PUBLIC_APP_URL=https://prop.ie
NODE_ENV=production

# Database (PostgreSQL Production)
DATABASE_URL=postgresql://username:password@host:5432/propie_production

# Stripe (LIVE KEYS - Be extremely careful)
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET

# AWS Cognito (Production Pool)
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-west-1_PRODUCTION_POOL
NEXT_PUBLIC_COGNITO_CLIENT_ID=PRODUCTION_CLIENT_ID

# Security (Generate random 32+ character strings)
JWT_SECRET=GENERATE_SECURE_32_CHAR_STRING
NEXTAUTH_SECRET=GENERATE_DIFFERENT_32_CHAR_STRING
ENCRYPTION_KEY=GENERATE_ANOTHER_32_CHAR_STRING
```

### 2. Security Configuration Checklist

- [ ] **SSL/TLS certificates** installed and configured
- [ ] **Security headers** enabled (CSP, HSTS, etc.)
- [ ] **Rate limiting** configured
- [ ] **CORS policy** properly set
- [ ] **API keys** secured and rotated
- [ ] **Database encryption** at rest enabled
- [ ] **Backup encryption** configured

---

## 🗃️ Database Setup

### 1. PostgreSQL Production Setup

```sql
-- Create production database
CREATE DATABASE propie_production;

-- Create dedicated user
CREATE USER propie_user WITH PASSWORD 'SECURE_PASSWORD';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE propie_production TO propie_user;

-- Enable required extensions
\c propie_production
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 2. Migration Process

```bash
# Run production migrations
npm run prisma:migrate:prod

# Seed with production data (if applicable)
npm run prisma:seed:prod

# Verify migration
npm run prisma:studio
```

### 3. Database Backup Configuration

```bash
# Daily automated backups
0 2 * * * pg_dump -h HOST -U USER -d propie_production | gzip > /backups/propie_$(date +\%Y\%m\%d).sql.gz

# Weekly full backup with retention
0 1 * * 0 pg_dumpall -h HOST -U USER | gzip > /backups/full_backup_$(date +\%Y\%m\%d).sql.gz
```

---

## 💳 Stripe Production Configuration

### 1. Stripe Account Setup

1. **Create Stripe Live Account**
   - Verify business information
   - Complete tax documentation
   - Set up bank account for payouts

2. **Configure Webhook Endpoints**
   ```
   Endpoint URL: https://prop.ie/api/webhooks/stripe
   Events to send:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - payment_intent.created
   ```

3. **Stripe Connect Configuration**
   - Enable Express accounts for agents
   - Configure commission splits
   - Set up marketplace verification

### 2. Payment Testing

```bash
# Test payment flow with small amounts
curl -X POST https://prop.ie/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "test-property",
    "paymentType": "booking_deposit",
    "amount": 100,
    "description": "Production test payment"
  }'
```

---

## 🏗️ AWS Infrastructure Setup

### 1. AWS Amplify Configuration

```yaml
# amplify.yml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

### 2. Environment Variables in AWS

Set in AWS Amplify console:
- All production environment variables
- Secure secrets using AWS Secrets Manager
- Database connection strings
- API keys and tokens

### 3. AWS Cognito Production Setup

```bash
# Create user pool
aws cognito-idp create-user-pool \
  --pool-name "prop-ie-production" \
  --policies PasswordPolicy='{MinimumLength=12,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=true}'

# Configure MFA and security
aws cognito-idp update-user-pool \
  --user-pool-id "POOL_ID" \
  --mfa-configuration ON
```

---

## 📊 Monitoring and Alerting

### 1. Sentry Error Monitoring

```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Configure Sentry
sentry-cli login
sentry-cli releases new $VERSION
sentry-cli releases finalize $VERSION
```

### 2. Performance Monitoring

```javascript
// next.config.js - Production monitoring
module.exports = {
  sentry: {
    hideSourceMaps: true,
    widenClientFileUpload: true,
  },
  experimental: {
    instrumentationHook: true,
  },
}
```

### 3. Health Check Endpoints

```bash
# API health check
curl https://prop.ie/api/health

# Database connectivity
curl https://prop.ie/api/health/database

# Payment system status
curl https://prop.ie/api/health/payments
```

---

## 🚀 Deployment Process

### 1. Pre-deployment Testing

```bash
# Run full test suite
npm run test

# Type checking
npm run typecheck

# Linting
npm run lint

# Build verification
npm run build

# Security audit
npm audit --audit-level moderate
```

### 2. Production Build

```bash
# Clean build
rm -rf .next
rm -rf node_modules

# Fresh install
npm ci --only=production

# Production build
npm run build

# Verify build
npm run start
```

### 3. Deployment Steps

1. **Database Migration**
   ```bash
   # Backup current database
   pg_dump production_db > backup_$(date +%Y%m%d).sql
   
   # Run migrations
   npm run prisma:migrate:deploy
   ```

2. **Application Deployment**
   ```bash
   # Deploy to AWS Amplify
   git push origin main
   
   # Or manual deployment
   npm run deploy:production
   ```

3. **Post-deployment Verification**
   ```bash
   # Health checks
   curl -f https://prop.ie/api/health || exit 1
   
   # Payment system test
   curl -f https://prop.ie/api/payments/health || exit 1
   
   # Database connectivity
   curl -f https://prop.ie/api/health/database || exit 1
   ```

---

## 🔒 Security Hardening

### 1. SSL/TLS Configuration

```nginx
# Nginx SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=63072000" always;
```

### 2. Security Headers

```javascript
// next.config.js security headers
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
]
```

### 3. Rate Limiting

```javascript
// Implement rate limiting
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
}
```

---

## 📈 Performance Optimization

### 1. Caching Strategy

```javascript
// Redis caching configuration
const cacheConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: 0,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100
}
```

### 2. CDN Configuration

```javascript
// CloudFront settings
const cdnConfig = {
  origins: ['https://prop.ie'],
  cacheBehaviors: {
    '/_next/static/*': {
      ttl: 31536000, // 1 year
      compress: true
    },
    '/api/*': {
      ttl: 0, // No caching for API
      compress: false
    }
  }
}
```

---

## 🆘 Emergency Procedures

### 1. Rollback Process

```bash
# Quick rollback to previous version
aws amplify start-deployment \
  --app-id APP_ID \
  --branch-name main \
  --source-url "PREVIOUS_COMMIT_SHA"
```

### 2. Database Recovery

```bash
# Restore from backup
pg_restore -h HOST -U USER -d propie_production backup_file.sql
```

### 3. Emergency Contacts

- **Technical Lead**: [Contact Info]
- **Database Admin**: [Contact Info]
- **Infrastructure Team**: [Contact Info]
- **Security Team**: [Contact Info]

---

## ✅ Post-Deployment Checklist

- [ ] **All health checks passing**
- [ ] **SSL certificates valid**
- [ ] **Payment processing functional**
- [ ] **Database migrations completed**
- [ ] **Monitoring alerts configured**
- [ ] **Backup systems operational**
- [ ] **Error rates within acceptable limits**
- [ ] **Performance metrics normal**
- [ ] **Security scans passed**
- [ ] **Team notifications sent**

---

## 📞 Support and Maintenance

### Daily Monitoring

- Check error rates in Sentry
- Monitor payment success rates
- Review database performance
- Verify backup completion
- Check SSL certificate expiry

### Weekly Tasks

- Security audit review
- Performance optimization
- Database cleanup
- Log analysis
- Capacity planning

### Monthly Tasks

- Security patches
- Dependency updates
- Performance review
- Disaster recovery testing
- Business metrics analysis

---

**⚠️ IMPORTANT**: This is an enterprise production deployment. Always test changes in staging first, maintain proper backups, and have rollback procedures ready.

---

*Last updated: June 18, 2025*
*Version: 1.0.0*