# 🚀 PROP.ie Production Environment Setup Guide

## Quick Start

Run the automated setup script:
```bash
./scripts/setup-production-infrastructure.sh
```

Or follow the manual steps below:

## 1. 📦 Redis (Rate Limiting Infrastructure)

### Option A: AWS ElastiCache (Recommended)
```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id prop-ie-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1

# Get endpoint
aws elasticache describe-cache-clusters \
  --cache-cluster-id prop-ie-redis \
  --show-cache-node-info
```

**Cost**: ~$15/month for t3.micro

### Option B: Redis Cloud (Alternative)
1. Go to https://redis.com/try-free/
2. Create free account (30MB free)
3. Create database
4. Copy connection string

### Option C: DigitalOcean Managed Redis
1. Go to DigitalOcean
2. Create → Databases → Redis
3. Basic plan: $15/month

**Set in .env.production:**
```bash
REDIS_URL=redis://your-endpoint:6379
REDIS_PASSWORD=your-password  # if required
```

## 2. 🐛 Sentry (Error Tracking)

### Get Sentry DSN:
1. Go to **https://sentry.io/**
2. **Sign up** (free tier: 5K errors/month)
3. **Create Project** → Select "Next.js"
4. Copy the DSN from project settings

**Example DSN:**
```
https://abc123def456@o123456.ingest.sentry.io/7891011
```

**Set in .env.production:**
```bash
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
```

## 3. ☁️ AWS Services (You Already Have)

### Check your current AWS setup:
```bash
# Check your AWS configuration
aws sts get-caller-identity
aws configure list
```

**Your AWS credentials are already configured. You need:**
```bash
AWS_REGION=eu-west-1  # or your preferred region
AWS_ACCESS_KEY_ID=your-existing-key
AWS_SECRET_ACCESS_KEY=your-existing-secret
```

### S3 Bucket (if needed):
```bash
# Create S3 bucket for file uploads
aws s3 mb s3://prop-ie-uploads-$(date +%s)
```

## 4. 🗄️ Database Setup

### Option A: AWS RDS PostgreSQL (Recommended)
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier prop-ie-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username propieadmin \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20
```

**Cost**: ~$25/month for db.t3.micro

### Option B: Supabase (PostgreSQL)
1. Go to **https://supabase.com/**
2. Create project (free tier available)
3. Go to Settings → Database
4. Copy connection string

### Option C: DigitalOcean Managed PostgreSQL
1. Create → Databases → PostgreSQL
2. Basic plan: $15/month

**Set in .env.production:**
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

## 5. 📧 Email Service (SMTP)

### Option A: AWS SES
```bash
# Verify your domain
aws ses verify-domain-identity --domain your-domain.com
```

### Option B: SendGrid
1. Go to **https://sendgrid.com/**
2. Free tier: 100 emails/day
3. Get API key from Settings

### Option C: Mailgun
1. Go to **https://mailgun.com/**
2. Free tier: 5K emails/month

**Set in .env.production:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@your-domain.com
```

## 6. 💳 Stripe (Payments)

### Get Stripe Keys:
1. Go to **https://stripe.com/**
2. Create account
3. Go to Developers → API Keys
4. Copy Secret Key (starts with `sk_live_` for production)

**Set in .env.production:**
```bash
STRIPE_SECRET_KEY=sk_live_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

## 7. 🔐 Generate Secrets

### Generate required secrets:
```bash
# JWT Secret (64 chars)
openssl rand -hex 64

# NextAuth Secret (64 chars)  
openssl rand -hex 64

# Encryption Key (32 chars)
openssl rand -hex 32
```

**Set in .env.production:**
```bash
JWT_SECRET=your-generated-jwt-secret
NEXTAUTH_SECRET=your-generated-nextauth-secret
ENCRYPTION_KEY=your-generated-encryption-key
```

## 8. 🌐 Domain & SSL

### Set up your domain:
1. **Buy domain** (or use existing)
2. **Configure DNS** to point to your hosting
3. **Get SSL certificate** (AWS Certificate Manager if using AWS)

**Set in .env.production:**
```bash
APP_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
```

## 9. 📊 Complete .env.production File

Create `.env.production` with all values:

```bash
# Application
NODE_ENV=production
APP_URL=https://your-domain.com
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/propie
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-64-char-secret
JWT_SECRET=your-64-char-secret

# AWS
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=prop-ie-uploads

# Redis
REDIS_URL=redis://your-redis-endpoint:6379
REDIS_PASSWORD=your-redis-password

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@your-domain.com

# Payments
STRIPE_SECRET_KEY=sk_live_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Security
ENCRYPTION_KEY=your-32-char-encryption-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Feature Flags
FEATURE_BLOCKCHAIN_ENABLED=false
FEATURE_AI_SEARCH_ENABLED=true
FEATURE_ADVANCED_ANALYTICS_ENABLED=true
```

## 10. 🚀 Deployment Commands

```bash
# Install dependencies
npm ci --production

# Run database migrations
npm run db:migrate

# Build application
npm run build:prod

# Start production server
npm start
```

## 💰 Estimated Monthly Costs

| Service | Tier | Cost/Month |
|---------|------|------------|
| Redis (AWS ElastiCache) | t3.micro | $15 |
| PostgreSQL (AWS RDS) | db.t3.micro | $25 |
| Sentry | Free | $0 |
| SendGrid | Free | $0 |
| Stripe | Pay per transaction | 2.9% + 30¢ |
| AWS CloudWatch | Basic | $5 |
| **Total** | | **~$45/month** |

## 🆘 Need Help?

### Common Issues:

1. **AWS Permissions**: Make sure your AWS user has permissions for ElastiCache, RDS, S3, CloudWatch
2. **Redis Connection**: Check security groups and VPC settings
3. **Database Connection**: Verify connection string format and credentials
4. **Domain Issues**: Ensure DNS propagation and SSL certificate setup

### Contact:
- Check the CLAUDE.md file for project-specific guidance
- Review AWS documentation for service-specific issues
- Test each service individually before full deployment

## ✅ Verification Checklist

- [ ] Redis connection working
- [ ] Database migrations completed
- [ ] Sentry receiving test errors
- [ ] Email sending working
- [ ] Stripe test payment successful
- [ ] All environment variables set
- [ ] Domain and SSL configured
- [ ] Application builds successfully
- [ ] Health checks passing

**Your PROP.ie platform is ready for production! 🎉**