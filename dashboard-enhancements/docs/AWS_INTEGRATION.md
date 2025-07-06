# AWS Integration Guide for PropIE AWS App

This document outlines the AWS integration of the PropIE property investment platform. It covers deployment configuration, CI/CD pipelines, infrastructure setup, monitoring, and security best practices.

## Architecture Overview

The application architecture leverages AWS Amplify for easy deployment and integration with various AWS services:

- **Frontend**: Next.js 15.3.1 application deployed on AWS Amplify
- **Authentication**: AWS Cognito for user authentication and group-based permissions
- **API Layer**: AWS AppSync for GraphQL API with Cognito integration
- **Database**: DynamoDB for NoSQL data storage
- **Storage**: S3 for file storage
- **Monitoring**: CloudWatch for logs, metrics, dashboards, and alerting

## Deployment Configuration

### AWS Amplify Setup

The application uses an enhanced `amplify.yml` configuration for multi-environment deployment:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - if [ "${AWS_BRANCH}" = "production" ]; then export NODE_ENV=production; elif [ "${AWS_BRANCH}" = "staging" ]; then export NODE_ENV=staging; else export NODE_ENV=development; fi
        - echo "Building for environment: ${NODE_ENV}"
        - npm ci
        - npm run verify-lockfile
        - npm run security-check
    build:
      commands:
        - echo "Running build for branch: ${AWS_BRANCH}"
        - if [ "${AWS_BRANCH}" = "production" ]; then npm run build:prod; elif [ "${AWS_BRANCH}" = "staging" ]; then npm run build:staging; else npm run build; fi
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
  customHeaders:
    - pattern: '**/*'
      headers:
        - key: 'Strict-Transport-Security'
          value: 'max-age=31536000; includeSubDomains'
        # Additional security headers configured...
```

### Branch Environments

The application is configured with three main environments:

1. **Development** (`development` branch)
   - URL: https://dev.prop-ie-app.com
   - Used for ongoing development work
   - Automatically deploys from the development branch
   - Uses development environment variables

2. **Staging** (`staging` branch)
   - URL: https://staging.prop-ie-app.com
   - Used for pre-production testing
   - Automatically deploys from the staging branch
   - Uses staging environment variables

3. **Production** (`production` branch)
   - URL: https://prop-ie-app.com
   - Live production environment
   - Manually promoted from staging
   - Uses production environment variables

## CI/CD Pipeline

The application uses GitHub Actions for the CI/CD pipeline, configured in `.github/workflows/ci-cd.yml`.

### Pipeline Stages

1. **Validate**: Runs type checking, linting, and security checks
2. **Test**: Runs unit tests, integration tests, and accessibility tests
3. **Build**: Builds the application and runs bundle analysis
4. **Preview**: For pull requests, deploys a preview environment
5. **Deploy**: Deploys to the appropriate environment based on the branch

### Pull Request Previews

Each pull request automatically gets a unique preview deployment URL:

```
https://pr-${PR_ID}.${BRANCH_NAME}.amplifyapp.com
```

This allows reviewers to see the changes in action before merging.

## Infrastructure as Code

The infrastructure is defined using a combination of CloudFormation and Terraform:

### CloudFormation Resources

- **AppSync API**: Defined in `infrastructure/cloudformation/appsync.yml`
- **Cognito Setup**: Defined in `infrastructure/cloudformation/cognito.yml`
- **Monitoring**: Defined in `infrastructure/cloudformation/monitoring.yml`

### Terraform Resources

- **Amplify Application**: Configured in `infrastructure/terraform/main.tf`
- **Domain Configuration**: Configured for all environments
- **IAM Roles**: Proper permissions for Amplify and other services

## Environment Configuration

### Environment Variables

Environment variables are managed through:

1. AWS Amplify environment variables for service-specific configuration
2. `.env` files for local development
3. Infrastructure as Code for environment-specific service configurations

The base environment variables structure is defined in `.env.example`:

```
# Application Environment
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development

# API Configuration
NEXT_PUBLIC_API_ENDPOINT=https://dev-api.prop-ie-app.com
NEXT_PUBLIC_APP_URL=https://dev.prop-ie-app.com

# AWS Amplify Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOLS_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
# Additional configurations...
```

## Monitoring and Alerting

### CloudWatch Dashboards

The application has custom CloudWatch dashboards:

1. **Main Dashboard**: Overall application health
2. **Performance Dashboard**: Frontend and API performance metrics
3. **Security Dashboard**: Security-related metrics and events

### CloudWatch Alarms

Alarms are set up to monitor:

- **Error Rates**: 4XX and 5XX errors
- **Latency**: Page load and API response times
- **Authentication**: Failed login attempts
- **API Usage**: API throttling and error rates
- **Resource Utilization**: Lambda, DynamoDB, and S3 usage

### Client-Side Monitoring

The application includes client-side monitoring components:

- `PerformanceDashboard`: Monitors frontend performance
- `EnhancedSecurityDashboard`: Monitors security metrics

## Security Best Practices

### Authentication and Authorization

- **Cognito User Pool**: User registration and authentication
- **Identity Pool**: For AWS service access with fine-grained permissions
- **JWT Tokens**: Used for API authentication
- **MFA**: Optional Multi-Factor Authentication

### API Security

- **AppSync Security**: Field-level access control
- **Cognito Integration**: User group-based permissions
- **API Key Rotation**: Automatic rotation via CloudFormation
- **WAF Protection**: Web Application Firewall for AppSync API

### Data Protection

- **S3 Encryption**: Server-side encryption for stored files
- **DynamoDB Encryption**: Encryption at rest for database
- **HTTPS**: SSL/TLS for all communications
- **Security Headers**: Strict Content-Security-Policy and other headers

## AWS Service Integration

The AWS integration follows a modular approach:

- **src/lib/amplify/index.ts**: Central entry point and initialization
- **src/lib/amplify/config.ts**: Configuration using environment variables
- **src/lib/amplify/auth.ts**: Authentication service
- **src/lib/amplify/api.ts**: API client service
- **src/lib/amplify/storage.ts**: Storage service
- **src/lib/amplify/types.ts**: Shared type definitions

### Authentication Flow

The authentication flow uses AWS Cognito:

1. User signs in with username/password via `Auth.signIn()`
2. Credentials are verified against Cognito User Pool
3. Upon successful authentication, tokens are stored securely
4. User attributes and roles are retrieved from Cognito
5. The application maintains auth state via the AuthContext

### API Integration

The application uses GraphQL APIs through AWS AppSync:

1. GraphQL queries are defined in domain-specific service modules
2. The API client handles authentication, error handling, and retries
3. React Query is used for data fetching, caching, and state management

### Storage Integration

Files are stored in Amazon S3:

1. Files are uploaded via the `Storage.upload()` method
2. Access levels (public, protected, private) control file visibility
3. Signed URLs are generated for accessing files

## Troubleshooting

### Common Issues

1. **Deployment Failures**:
   - Check CloudWatch Logs for build errors
   - Verify environment variables are correctly set

2. **Authentication Issues**:
   - Check Cognito User Pool for user status
   - Verify client configuration matches Cognito setup

3. **API Errors**:
   - Check AppSync console for resolver errors
   - Verify API permissions in Cognito groups

### Logging

Logs are available in several locations:

- **CloudWatch Logs**: All AWS service logs
- **Amplify Console**: Build and deployment logs
- **AppSync Console**: GraphQL query and resolver logs

## Further Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [AppSync Documentation](https://docs.aws.amazon.com/appsync/)
- [Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [CloudWatch Documentation](https://docs.aws.amazon.com/cloudwatch/)