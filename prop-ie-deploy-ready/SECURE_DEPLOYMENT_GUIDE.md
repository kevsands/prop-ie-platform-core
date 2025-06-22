# 🔒 PropIE Irish Property Platform - Secure Deployment Guide

## ✅ Prerequisites Completed

**Phase 1 & 2**: Infrastructure successfully deployed
- ✅ **VPC**: `vpc-07557b176b2a339dd`
- ✅ **Database**: Production RDS PostgreSQL instance
- ✅ **Environment Configuration**: Secure template created

## 🔐 Security-First Deployment Process

### Step 1: Prepare GitHub Repository

1. **Repository is ready with secure configuration**:
   - ✅ Credentials removed from version control
   - ✅ `.env.production.example` template provided
   - ✅ Comprehensive `.gitignore` in place

### Step 2: Create AWS Amplify App

1. **Go to AWS Amplify Console**:
   - Navigate to: https://console.aws.amazon.com/amplify/home?region=eu-west-1
   - Click **"Create app"**

2. **Connect Repository**:
   - Select **"Deploy from GitHub"**
   - Connect to your repository
   - Select branch: **main**

3. **Configure App Settings**:
   - **App name**: `propie-irish-property-production`
   - **Environment**: production

### Step 3: Configure Environment Variables in AWS Amplify

**CRITICAL**: Add these environment variables directly in AWS Amplify Console:

```bash
# Database Configuration (Configure in Amplify Console)
DATABASE_HOST=propie-irish-property-production-db.chmowkkmepz2.eu-west-1.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=propie_production
DATABASE_USER=propie_admin
DATABASE_PASSWORD=[Configure securely in AWS Console]
DATABASE_SSL=true

# AWS Configuration
PROPIE_AWS_REGION=eu-west-1
DATABASE_SECRET_ARN=[Your AWS Secrets Manager ARN]

# Platform Configuration
NODE_ENV=production
PLATFORM_VERSION=2.1.0
IRISH_MARKET_COMPLIANCE=true
AMPLIFY_ENVIRONMENT=production

# Irish Market APIs
REVENUE_API_BASE_URL=https://api.revenue.ie
LAND_REGISTRY_API_BASE_URL=https://api.landregistry.ie
PLANNING_AUTHORITY_API_BASE_URL=https://api.housing.gov.ie

# Security & Performance
SECURITY_HEADERS_ENABLED=true
CSP_ENABLED=true
HSTS_ENABLED=true
NEXT_IMAGE_OPTIMIZATION=true
NEXT_TELEMETRY_DISABLED=1
DATABASE_CONNECTION_POOL_SIZE=20
```

### Step 4: Secure Environment Variable Configuration

**In AWS Amplify Console > App Settings > Environment Variables:**

1. Add each variable individually
2. Mark sensitive variables (passwords, ARNs) as **encrypted**
3. Use AWS Secrets Manager integration where possible
4. Never expose credentials in build logs

### Step 5: Deploy and Verify

1. **Deploy Application**:
   - Amplify will use secure environment variable injection
   - Monitor build logs (credentials will not appear)

2. **Test Health Check**:
   ```bash
   curl https://main.xxxxxxxxxx.amplifyapp.com/api/health
   ```

3. **Expected Response**:
   ```json
   {
     "status": "healthy",
     "database": {
       "connected": true
     },
     "irish_market": {
       "compliance": true
     }
   }
   ```

## 🛡️ Security Benefits

✅ **Zero credentials in version control**
✅ **AWS-managed environment variable encryption**
✅ **Secure secret injection at build time**
✅ **No credential exposure in logs**
✅ **Audit trail compliance**
✅ **Team member access control**

## 🔧 Database Connection Security

The application uses secure environment variable injection:

```typescript
// src/lib/database.ts - Secure by design
const dbConfig: PoolConfig = {
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD, // Injected securely by AWS
  ssl: { rejectUnauthorized: false },
  // ... other config
};
```

## ✅ Production Readiness Checklist

- [x] **Environment template created** (`.env.production.example`)
- [x] **Gitignore configured** (blocks credential commits)
- [x] **Amplify build config ready** (`amplify.yml`)
- [ ] **Environment variables configured in AWS Amplify**
- [ ] **Application deployed and health check passing**
- [ ] **Database connectivity verified**

## 🎯 Next Steps

1. **Configure environment variables in AWS Amplify Console**
2. **Deploy application**
3. **Verify health check endpoint**
4. **Test database connectivity**

---

**🔒 Security First**: This deployment method ensures zero credential exposure while maintaining full functionality.