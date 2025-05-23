# Property Platform AWS Infrastructure

This directory contains the AWS infrastructure setup for the Property Platform application using Terraform.

## Architecture Overview

The Property Platform is deployed on AWS with the following architecture:

![Architecture Diagram](https://via.placeholder.com/800x600.png?text=Property+Platform+AWS+Architecture)

### Components

- **VPC**: Isolated network with public, private, and database subnets across 3 availability zones
- **ECS (Fargate)**: Containerized application hosting with auto-scaling
- **RDS (PostgreSQL)**: Managed database service with multi-AZ deployment for high availability
- **CloudFront**: Content delivery network for caching and edge distribution
- **S3**: Object storage for documents, uploads, and static assets
- **ALB**: Application Load Balancer for distributing traffic to containers
- **WAF**: Web Application Firewall for security protection
- **Route53**: DNS management
- **CloudWatch**: Monitoring and logging
- **Secrets Manager**: Secure storage for credentials and secrets

## Setup Instructions

### Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform (version 1.5.x or higher)
- Domain name registered and available for DNS configuration

### Initial Setup

1. **Bootstrap Terraform State Management**

   Run the bootstrap script to create the S3 bucket and DynamoDB table for Terraform state:

   ```bash
   cd infrastructure/terraform
   chmod +x bootstrap.sh
   ./bootstrap.sh --region=eu-west-1
   ```

2. **Initialize Terraform**

   ```bash
   cd infrastructure/terraform
   chmod +x deploy.sh
   ./deploy.sh --init --env=staging
   ```

3. **Deploy Staging Environment**

   ```bash
   ./deploy.sh --env=staging
   ```

4. **Deploy Production Environment**

   ```bash
   ./deploy.sh --env=production
   ```

## Infrastructure Management

### Directory Structure

- `terraform/`: Terraform configuration files
  - `main.tf`: Main Terraform configuration
  - `variables.tf`: Variable definitions
  - `outputs.tf`: Output values
  - `networking.tf`: VPC and networking resources
  - `database.tf`: RDS database configuration
  - `ecs.tf`: ECS cluster and service configuration
  - `s3.tf`: S3 buckets configuration
  - `cloudfront.tf`: CloudFront distribution configuration
  - `alb.tf`: Application Load Balancer configuration
  - `waf.tf`: Web Application Firewall configuration
  - `monitoring.tf`: CloudWatch and monitoring configuration
  - `terraform.tfvars`: Default variable values for production
  - `terraform-staging.tfvars`: Variable values for staging environment

### Environment Configuration

The deployment supports multiple environments:

- **Staging**: Used for testing and QA
- **Production**: Live environment

Each environment has its own Terraform workspace and variable files.

### CI/CD Integration

The infrastructure deployment is integrated into the CI/CD pipeline using GitHub Actions:

- `.github/workflows/terraform-deploy.yml`: Terraform deployment workflow
- `.github/workflows/build-and-deploy.yml`: Application build and deployment workflow

## Security Considerations

- All sensitive data is stored in AWS Secrets Manager
- Security groups restrict access to the minimum necessary
- VPC endpoints are used for private AWS service access
- WAF provides protection against common web vulnerabilities
- TLS encryption enforced throughout the infrastructure
- Database encryption at rest and in transit
- S3 buckets are configured with proper access controls

## Monitoring and Maintenance

- CloudWatch dashboards provide visibility into the infrastructure
- Alarms are configured for critical metrics
- Logs are centrally collected and retained according to policy
- Regular database backups are configured
- Load balancer health checks monitor application status

## Disaster Recovery

- RDS has automated backups with point-in-time recovery
- Multi-AZ deployment provides high availability
- S3 bucket versioning allows file recovery
- Terraform state is versioned in S3

## Cost Optimization

- Staging environment uses smaller instance sizes
- Auto-scaling adjusts capacity based on demand
- Amazon S3 lifecycle policies move infrequently accessed data to cheaper storage tiers
- CloudFront reduces data transfer costs and improves performance