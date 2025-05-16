# Deployment Guide for PropIE AWS Application

This guide explains how to set up and deploy the PropIE application to AWS environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [AWS Infrastructure Setup](#aws-infrastructure-setup)
4. [Deployment Process](#deployment-process)
5. [Manual Deployment](#manual-deployment)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring](#monitoring)
8. [Rollback Procedures](#rollback-procedures)

## Prerequisites

Before deploying the application, ensure you have the following:

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js v18 or higher
- npm or yarn package manager
- Git for version control

## Environment Configuration

The application uses environment variables for configuration. These are managed through:

1. `.env` files for local development
2. AWS Parameter Store for CI/CD and production deployment
3. AWS Amplify environment variables for hosting

### Environment Files

Copy the template file to create your local environment:

```bash
cp .env.template .env.local
```

Edit the `.env.local` file with your AWS credentials and configuration values.

### Environment Variables

Key variables required for deployment:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_AWS_REGION` | AWS region for services | `us-east-1` |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | Cognito User Pool ID | `us-east-1_abc123` |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID` | Cognito App Client ID | `1a2b3c4d5e6f7g8h9i0j` |
| `NEXT_PUBLIC_GRAPHQL_ENDPOINT` | AppSync GraphQL endpoint | `https://example.appsync-api.region.amazonaws.com/graphql` |
| `NEXT_PUBLIC_API_ENDPOINT` | API Gateway endpoint | `https://api.example.com` |
| `NEXT_PUBLIC_S3_BUCKET` | S3 bucket for storage | `myapp-storage-12345-dev` |

## AWS Infrastructure Setup

The application's infrastructure is managed using AWS CDK.

### Setting Up Infrastructure

1. Navigate to the CDK directory:

```bash
cd infrastructure/cdk
```

2. Install dependencies:

```bash
npm ci
```

3. Deploy the infrastructure for the desired environment:

```bash
# Development environment
npm run deploy:dev

# Staging environment
npm run deploy:staging

# Production environment
npm run deploy:prod
```

### Infrastructure Components

The deployment creates the following AWS resources:

- **Cognito User Pool**: For authentication
- **AppSync API**: For GraphQL operations
- **API Gateway**: For RESTful API endpoints
- **S3 Buckets**: For file storage
- **AWS Amplify Hosting**: For web application hosting
- **CloudWatch**: For monitoring and logging
- **CloudFront**: For content distribution

## Deployment Process

### Building the Application

To build the application locally:

```bash
# Development build
npm run build

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

The build artifacts are placed in the `.next` directory.

## Manual Deployment

To manually deploy the application to AWS Amplify:

1. Build the application for the target environment
2. Deploy using the AWS Amplify CLI:

```bash
# Install Amplify CLI if not already installed
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in the project (if not already done)
amplify init

# Push changes to AWS
amplify push
```

## CI/CD Pipeline

The application uses GitHub Actions for CI/CD.

### GitHub Actions Workflow

The CI/CD pipeline is defined in `.github/workflows/deploy.yml` and includes:

1. **Validation**: Linting, type checking, and security scanning
2. **Testing**: Unit tests and integration tests
3. **Building**: Creating optimized build artifacts
4. **Infrastructure Deployment**: Updating AWS resources using CDK
5. **Application Deployment**: Deploying to AWS Amplify

### Triggering Deployments

Deployments are triggered by:

- Pushing to the `main` branch (production deployment)
- Manually triggering the workflow with environment selection

### Environment-Specific Deployments

The CI/CD pipeline supports:

- **Development**: For testing new features
- **Staging**: For pre-production validation
- **Production**: For live application

## Monitoring

The application is monitored using:

- **AWS CloudWatch**: For logs and metrics
- **AWS X-Ray**: For performance tracing
- **AWS CloudWatch Alarms**: For critical alerts

### Monitoring Dashboards

- CloudWatch Dashboard: Available in the AWS Console
- Custom monitoring dashboard: Available at `/admin/monitoring` in the application (admin access required)

## Rollback Procedures

In case of a failed deployment:

### Using AWS Amplify Console

1. Go to the AWS Amplify Console
2. Select the application and branch
3. Navigate to the "Hosting" tab
4. Find the previous deployment and click "Redeploy this version"

### Using GitHub Actions

1. Find the last successful deployment workflow run
2. Click "Re-run jobs" to redeploy the previous version

### Manual Rollback

If the CI/CD pipeline is unavailable:

1. Checkout the previous version in Git
2. Build the application
3. Deploy manually using the AWS Amplify CLI

## Troubleshooting

Common deployment issues and solutions:

### Build Failures

- Check error logs in the GitHub Actions output
- Verify environment variables are correctly set
- Ensure AWS credentials have the necessary permissions

### Runtime Errors

- Check CloudWatch logs for application errors
- Verify API connections and authentication
- Test the application locally with the same configuration

### Infrastructure Deployment Failures

- Review CDK deployment logs
- Check AWS CloudFormation events
- Verify service quotas and limits

For additional help, contact the DevOps team or refer to the AWS documentation.