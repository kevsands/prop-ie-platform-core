# Comprehensive Deployment Guide

## Table of Contents

1. [Overview](#overview)
2. [Deployment Environments](#deployment-environments)
3. [Prerequisite Setup](#prerequisite-setup)
4. [Environment Configuration](#environment-configuration)
5. [Deployment Process](#deployment-process)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring Setup](#monitoring-setup)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)
10. [Security Considerations](#security-considerations)

## Overview

The PropIE application is a Next.js application that integrates with AWS services through Amplify. This document provides comprehensive guidance for deploying the application to different environments, configuring the CI/CD pipeline, and setting up monitoring.

### Key Technologies

- **Framework**: Next.js 15+
- **Cloud Provider**: AWS (Amplify, Cognito, AppSync, S3)
- **Deployment Platform**: AWS Amplify / Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: AWS CloudWatch / Vercel Analytics

## Deployment Environments

The application supports four deployment environments:

### 1. Development Environment

- **Purpose**: For development and testing during implementation
- **URL Pattern**: `dev-[branch].prop-ie-app.amplifyapp.com`
- **Features**: Full application with development-specific settings
- **Data**: Points to development backend services
- **Access**: Limited to development team

### 2. Testing Environment

- **Purpose**: For QA and testing by stakeholders
- **URL Pattern**: `test.prop-ie-app.amplifyapp.com`
- **Features**: Complete application with test data
- **Data**: Points to testing backend services
- **Access**: Internal team and selected clients

### 3. Staging Environment

- **Purpose**: Pre-production environment that mirrors production
- **URL Pattern**: `staging.propieapp.com`
- **Features**: Production-ready application
- **Data**: Production-like data with anonymization
- **Access**: Internal team and client stakeholders

### 4. Production Environment

- **Purpose**: Live production environment
- **URL Pattern**: `app.propieapp.com` or client-specific domains
- **Features**: Complete application with all features
- **Data**: Production data
- **Access**: Authenticated users only

## Prerequisite Setup

Before deploying the application, ensure the following prerequisites are met:

### 1. AWS Account and Access

- AWS account with administrative access
- AWS CLI installed and configured with appropriate credentials
- AWS Amplify CLI installed: `npm install -g @aws-amplify/cli`

### 2. GitHub Repository Setup

- Repository access with appropriate permissions
- GitHub Actions enabled
- Repository secrets configured for CI/CD

### 3. Domain Registration and DNS

- Registered domain (if custom domain is required)
- Access to DNS management
- SSL certificate (automatically handled by AWS/Vercel)

### 4. Backend Services

- Cognito User Pools configured
- AppSync API created and configured
- S3 buckets provisioned
- Other required AWS services set up

## Environment Configuration

Each environment requires specific configuration. Create the following configuration files:

### 1. Environment Variable Files

Create specific `.env` files for each environment:

- `.env.development`
- `.env.test`
- `.env.staging`
- `.env.production`

### 2. Required Environment Variables

```
# AWS Region and Endpoints
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT=https://[YOUR-API-ID].appsync-api.[REGION].amazonaws.com/graphql

# Authentication
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Storage
NEXT_PUBLIC_S3_BUCKET=propieawsapp-storage-[ENV]-[ID]

# API Configuration 
NEXT_PUBLIC_API_KEY=da2-xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_API_ENDPOINT=https://api.[ENV].propieapp.com

# Feature Flags
NEXT_PUBLIC_ENABLE_NEW_DASHBOARD=true
NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES=false
```

### 3. Environment-Specific Configurations

#### Development Environment

```
# Development-specific overrides
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true
NEXT_PUBLIC_API_TIMEOUT=30000
```

#### Testing Environment

```
# Testing-specific overrides
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
NEXT_PUBLIC_TEST_USER_EMAIL=test@example.com
NEXT_PUBLIC_TEST_USER_PASSWORD=TestPassword123
```

#### Staging Environment

```
# Staging-specific overrides
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_API_TIMEOUT=15000
```

#### Production Environment

```
# Production-specific overrides
NEXT_PUBLIC_ENABLE_DEBUG_TOOLS=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxx.ingest.sentry.io/xxxxxxx
```

### 4. Configuration Management

For secure management of environment variables:

#### AWS Amplify

Store environment variables in the Amplify Console:

1. Go to AWS Amplify Console > App settings > Environment variables
2. Add all required environment variables
3. Specify which branches should use these variables

#### Vercel

Store environment variables in the Vercel project settings:

1. Go to Vercel > Project > Settings > Environment Variables
2. Add all required variables
3. Specify which environments (Production, Preview, Development) should use these variables

## Deployment Process

### Deploying to AWS Amplify

#### Initial Setup

1. **Connect Repository**:
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Choose GitHub as the repository source
   - Authenticate and select the repository

2. **Configure Build Settings**:
   - Review and update the auto-detected build settings
   - Ensure the build spec in `amplify.yml` is correct:

```yaml
version: 1
frontend:
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
      - .next/cache/**/*
```

3. **Environment Variables**:
   - Add all required environment variables
   - Make sure to mark sensitive variables as secure

4. **Review and Deploy**:
   - Review configuration
   - Click "Save and deploy"

#### Continuous Deployment

1. **Branch-based Deployment**:
   - `main` branch deploys to production
   - `staging` branch deploys to staging
   - `develop` branch deploys to development
   - Feature branches deploy to preview environments

2. **Pull Request Previews**:
   - Enable pull request previews in Amplify Console settings
   - Each PR will get a unique preview URL

### Deploying to Vercel

#### Initial Setup

1. **Connect Repository**:
   - Go to Vercel dashboard
   - Click "New Project"
   - Import from GitHub repository
   - Select the repository

2. **Configure Project**:
   - Framework preset: Next.js
   - Root directory: ./
   - Build command: `npm run build` (default)
   - Output directory: `.next` (default)

3. **Environment Variables**:
   - Add all required environment variables
   - Specify environment targets (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy"

#### Continuous Deployment

1. **Branch-based Deployment**:
   - `main` branch automatically deploys to production
   - All branches get preview deployments
   - Configure production branch in project settings

2. **Pull Request Previews**:
   - Automatically created for every PR
   - Preview URL provided in GitHub PR comments

## CI/CD Pipeline

The application uses GitHub Actions for CI/CD. The following workflows are available:

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
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

### 2. Deployment Workflow

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy Application

on:
  push:
    branches: [develop, staging, main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Set environment based on branch
        id: set-env
        run: |
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            echo "env=production" >> $GITHUB_OUTPUT
          elif [ "${{ github.ref }}" = "refs/heads/staging" ]; then
            echo "env=staging" >> $GITHUB_OUTPUT
          else
            echo "env=development" >> $GITHUB_OUTPUT
          fi
          
      - name: Deploy to AWS Amplify
        run: |
          echo "Deploying to ${{ steps.set-env.outputs.env }} environment"
          aws amplify start-job --app-id ${{ secrets.AMPLIFY_APP_ID }} --branch-name ${{ github.ref_name }} --job-type RELEASE
          
      - name: Create deployment verification
        run: |
          echo "Deployment to ${{ steps.set-env.outputs.env }} completed"
          # Add post-deployment verification steps
```

### 3. Security Scanning Workflow

File: `.github/workflows/security-scan.yml`

```yaml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * 1' # Weekly on Monday
  workflow_dispatch:

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run dependency vulnerability scan
        run: npm audit --production
        
      - name: Run SAST scan
        uses: github/codeql-action/analyze@v2
        with:
          languages: javascript, typescript
        
      - name: Report findings
        if: ${{ failure() }}
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Security scan found vulnerabilities',
              body: 'Weekly security scan found potential vulnerabilities. Please review the workflow logs.'
            })
```

## Monitoring Setup

### AWS CloudWatch Monitoring

The application leverages AWS CloudWatch for comprehensive monitoring:

1. **Dashboard Setup**:
   - Deploy the CloudWatch dashboard using the template in `infrastructure/monitoring/dashboard.tf`
   - The dashboard provides metrics for API performance, authentication, and errors

2. **Alarm Configuration**:
   - Set up alarms for critical metrics in `infrastructure/monitoring/cloudwatch-alarms.tf`
   - Configure notification endpoints (email, SMS, Slack)

3. **Log Groups**:
   - Application logs: `/aws/amplify/propieapp/app`
   - API Gateway logs: `/aws/apigateway/propie-api`
   - Lambda logs: `/aws/lambda/propie-api-*`

4. **Custom Metrics**:
   - API response times
   - Authentication success/failure rates
   - GraphQL resolver performance
   - Client-side performance metrics (sent via custom logging)

### Performance Monitoring

The application includes client-side performance monitoring:

1. **Web Vitals Tracking**:
   - Core Web Vitals (LCP, FID, CLS)
   - Navigation timing
   - Resource loading
   - JS execution time

2. **Real User Monitoring (RUM)**:
   - User session recording (anonymized)
   - Error tracking
   - Feature usage analytics

3. **API Performance Monitoring**:
   - API call latency
   - Error rates
   - Cache hit rates
   - Query complexity metrics

## Rollback Procedures

In case of deployment issues, follow these rollback procedures:

### AWS Amplify Rollback

1. **Quick Rollback via Console**:
   - Go to AWS Amplify Console > App > Branch
   - Find the previous successful deployment
   - Click "Redeploy this version"

2. **Git-based Rollback**:
   - Revert the problematic commit
   - Push to the same branch
   - Amplify will automatically redeploy

3. **Manual Backend Rollback**:
   - If backend changes are affected:
     - Restore affected AWS resources to previous state
     - Update environment variables if necessary
     - Redeploy frontend

### Vercel Rollback

1. **Via Vercel Dashboard**:
   - Go to Vercel project > Deployments
   - Find the previous successful deployment
   - Click the three dots menu > "Promote to Production"

2. **Git-based Rollback**:
   - Revert the problematic commit
   - Push to the production branch
   - Vercel will automatically redeploy

### Emergency Response Procedure

For critical production issues:

1. **Assess Impact**:
   - Determine severity and scope
   - Log the incident with timestamp and details

2. **Immediate Actions**:
   - If security breach: isolate affected components
   - If performance issue: scale resources if applicable
   - If data issue: pause data modifications

3. **Execute Rollback**:
   - Follow rollback procedures above
   - Verify rollback success
   - Notify stakeholders

4. **Post-Incident**:
   - Conduct root cause analysis
   - Document lessons learned
   - Implement preventive measures

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**

   - **Symptoms**: Build fails in CI/CD pipeline
   - **Troubleshooting**:
     - Check build logs for specific errors
     - Verify Node.js version compatibility
     - Check for TypeScript or linting errors
     - Ensure all dependencies are installed
     - Verify environment variables are correctly set

2. **Runtime Errors After Deployment**

   - **Symptoms**: Application crashes or shows errors after successful deployment
   - **Troubleshooting**:
     - Check browser console for client-side errors
     - Verify environment variables are correctly loaded
     - Check API endpoints are accessible
     - Validate authentication configuration
     - Look for CORS issues

3. **Environment Configuration Issues**

   - **Symptoms**: Application behaves differently across environments
   - **Troubleshooting**:
     - Compare environment variables across environments
     - Check for environment-specific code or configuration
     - Verify backend services are correctly configured
     - Check for feature flag differences

4. **Performance Degradation**

   - **Symptoms**: Slow load times, high API latency
   - **Troubleshooting**:
     - Check CloudWatch metrics for bottlenecks
     - Verify CDN caching is working
     - Check for excessive API calls or data fetching
     - Look for memory leaks or unnecessary rerenders
     - Verify AWS resource scaling

### Deployment Verification Checklist

After each deployment, verify the following:

1. **Authentication Flows**:
   - Register a new user
   - Login with existing credentials
   - Test password reset
   - Verify role-based access controls

2. **Core Features**:
   - Property browsing and search
   - Development showcase pages
   - User profile management
   - Document uploads and downloads

3. **Integration Points**:
   - AWS Cognito authentication
   - AppSync GraphQL API
   - S3 file uploads and retrievals
   - External service integrations

4. **Performance Metrics**:
   - Page load times under target thresholds
   - API response times within acceptable limits
   - Resource utilization within expected ranges

## Security Considerations

### Secure Deployment Practices

1. **Environment Variables**:
   - Never commit secrets to the repository
   - Use environment variable encryption in CI/CD
   - Rotate secrets regularly
   - Use least privilege principle for service accounts

2. **Infrastructure Security**:
   - Use infrastructure as code (Terraform, CloudFormation)
   - Implement security groups and network ACLs
   - Enable AWS CloudTrail for audit logging
   - Use AWS WAF for API protection

3. **Content Security Policy**:
   - Implement strict CSP headers
   - Limit allowed sources for scripts, styles, and media
   - Configure reporting endpoints for violations
   - Regularly review and update policies

4. **Authorization and Access Control**:
   - Implement proper JWT validation
   - Use short-lived tokens with proper refresh
   - Configure proper CORS policies
   - Implement rate limiting for APIs

### Post-Deployment Security Checks

After each deployment, perform these security checks:

1. **Dependency Scanning**:
   - Run npm audit to check for vulnerabilities
   - Review new dependencies for security concerns
   - Ensure all critical vulnerabilities are addressed

2. **Security Header Verification**:
   - Verify Content-Security-Policy
   - Check X-XSS-Protection
   - Validate HSTS headers
   - Confirm X-Content-Type-Options

3. **Authentication Testing**:
   - Verify token handling
   - Test MFA if applicable
   - Check session timeout behavior
   - Validate CSRF protection