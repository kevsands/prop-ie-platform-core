# DevOps Setup Guide

This guide explains how to use the DevOps tooling configured for this project, including AWS integration, Docker development environments, and CI/CD pipelines.

## Quick Start

```bash
# Start development environment with Docker
npm run docker:dev

# Run TypeScript checks
npm run typescript:check

# Set up AWS Amplify environments
npm run setup:amplify

# Verify AWS configuration
npm run prepare:aws

# Run security-enhanced development mode
npm run dev:secure
```

## AWS Environment Setup

The project now includes proper AWS Amplify configuration for multiple environments. To set up AWS environments:

1. Install the Amplify CLI:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Configure your AWS credentials:
   ```bash
   aws configure
   ```

3. Run the Amplify environment setup script:
   ```bash
   npm run setup:amplify
   ```

This will guide you through setting up development, staging, and production environments.

## Docker Development Environment

A complete Docker development environment has been configured with:

- Next.js application container
- Mock API server
- LocalStack for AWS services
- PostgreSQL database
- Bundle analyzer (optional)

To use the Docker environment:

```bash
# Start all services
npm run docker:dev

# Rebuild containers after configuration changes
npm run docker:dev:build

# Run bundle analyzer
npm run docker:analyze

# Stop all containers
npm run docker:down
```

## TypeScript Error Handling

A TypeScript error checking script has been implemented to improve build and deployment quality:

```bash
# Run TypeScript checks (strict in production, warnings in development)
npm run typescript:check

# Set strict mode explicitly
TS_STRICT_MODE=true npm run typescript:check
```

This script provides:
- Formatted error output for better readability
- Different error handling modes for different environments
- Error output files for CI/CD artifact collection

## Security Headers and Configuration

Security headers have been configured in `security-headers.js` and integrated into `next.config.js`. This provides:

- Strict Content Security Policy
- XSS protection
- CORS configuration
- Frame protection
- Other OWASP recommended headers

You can run development with enhanced security using:

```bash
npm run dev:secure
```

## CI/CD Pipeline

The CI/CD pipeline has been configured with:

- TypeScript error checking
- Dependency caching
- AWS environment verification
- Bundle analysis
- Security scanning
- Automated deployment stages

You can manually trigger a staging deployment with:

```bash
npm run deploy:staging
```

## Monitoring & Logging

For application monitoring, the following has been configured:

1. Error tracking through AWS Amplify Analytics
2. Security monitoring in the SecurityMonitor component
3. Performance tracking and metrics collection

## Troubleshooting

If you encounter issues with the DevOps setup:

1. Check AWS credentials with `aws sts get-caller-identity`
2. Verify Docker installation with `docker --version`
3. Check that all scripts have executable permissions
4. Ensure environment variables are properly configured

For more detailed information, see the individual setup guides:
- [AWS Integration Guide](docs/AWS_INTEGRATION_FINAL.md)
- [DEPLOYMENT_GUIDE](DEPLOYMENT_GUIDE.md)
- [SECURITY_ARCHITECTURE](docs/SECURITY_ARCHITECTURE.md)