# Property Platform Deployment Guide

This guide covers the deployment process for the Property Platform application to AWS.

## Deployment Options

The Property Platform supports two deployment options:

1. **Vercel Deployment** - For quick front-end hosting with Vercel
2. **AWS Deployment** - For complete infrastructure hosting on AWS

## Prerequisites

- GitHub account with access to the repository
- Either:
  - Vercel account (for Vercel deployment)
  - AWS account with appropriate permissions (for AWS deployment)
- Node.js 18+ and npm installed

## Option 1: Vercel Deployment

This option deploys the frontend to Vercel while using existing AWS backend services.

### Step 1: Prepare Your Repository

1. Clone the repository:
```bash
git clone https://github.com/yourusername/prop-ie-aws-app.git
cd prop-ie-aws-app
```

2. Ensure the code is ready for deployment:
```bash
npm install
npm run build
```

### Step 2: Connect to Vercel

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

### Step 3: Configure Environment Variables

Add the following environment variables:

- `NEXT_PUBLIC_API_URL`: Your AWS backend API URL
- `NEXT_PUBLIC_ENVIRONMENT`: 'production' or 'staging'
- `DATABASE_URL`: Connection string to your PostgreSQL database

### Step 4: Deploy

1. Click "Deploy"
2. Your site will be available at: https://prop-ie-aws-app.vercel.app

### Step 5: Custom Domain (When Ready)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain (e.g., property-platform.ie)
4. Follow the DNS configuration instructions

## Option 2: Full AWS Deployment

This option deploys the complete stack to AWS using Terraform.

### Step 1: Prepare AWS Environment

Ensure you have the necessary AWS permissions to create the required resources.

### Step 2: Set Up Terraform State Backend

```bash
cd infrastructure/terraform
./bootstrap.sh --region=eu-west-1
```

### Step 3: Create ECR Repository

```bash
cd infrastructure/scripts
./create-ecr-repo.sh --name=prop-transaction-app --region=eu-west-1
```

### Step 4: Configure Terraform Variables

Edit the `terraform.tfvars` file to set domain name, alert email, and other variables.

### Step 5: Deploy Infrastructure

For staging:
```bash
cd infrastructure/terraform
./deploy.sh --init --env=staging
```

For production:
```bash
./deploy.sh --env=production
```

### Step 6: Build and Push Docker Image

```bash
# Build Docker image
docker build -t prop-transaction-app:latest .

# Get the ECR repository URI from Terraform output
ECR_REPO_URI=$(cd infrastructure/terraform && terraform output -raw ecr_repository_url)

# Authenticate Docker with ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin $ECR_REPO_URI

# Tag and push the image
docker tag prop-transaction-app:latest $ECR_REPO_URI:latest
docker push $ECR_REPO_URI:latest
```

### Step 7: Update ECS Service

```bash
# For staging
aws ecs update-service --cluster prop-transaction-staging-cluster --service prop-transaction-staging-service --force-new-deployment --region eu-west-1

# For production
aws ecs update-service --cluster prop-transaction-production-cluster --service prop-transaction-production-service --force-new-deployment --region eu-west-1
```

## GitHub Actions CI/CD

For automated deployments, use the included GitHub Actions workflows:

- `.github/workflows/terraform-deploy.yml`: Deploys infrastructure changes
- `.github/workflows/build-and-deploy.yml`: Builds and deploys the application

Configure the following GitHub Secrets:
- `AWS_ROLE_ARN`: IAM role ARN for GitHub Actions
- `STAGING_AWS_ROLE_ARN`: IAM role ARN for staging
- `PRODUCTION_AWS_ROLE_ARN`: IAM role ARN for production

## Monitoring and Maintenance

### Health Checks

The application provides health check endpoints:
- `/api/health`: Comprehensive health check
- `/api/health/simple`: Simple health check

### Logs

Access logs in CloudWatch:
- ECS Task Logs: `/ecs/prop-transaction-{environment}`
- Application Logs: `/aws/application/prop-transaction-{environment}`

### Monitoring Dashboard

Access the CloudWatch dashboard for real-time metrics.

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check for syntax errors
   - Verify Node.js version compatibility
   - Ensure all dependencies are installed

2. **Deployment Failures:**
   - Check CloudWatch logs for errors
   - Verify security group settings 
   - Confirm IAM permissions are correct

3. **Database Connection Issues:**
   - Verify database credentials in Secrets Manager
   - Check security group rules

4. **CloudFront Issues:**
   - Clear edge caches if needed: `aws cloudfront create-invalidation`
   - Verify SSL/TLS certificate validity

### Support

For additional support, contact the DevOps team or refer to the detailed AWS infrastructure documentation.
