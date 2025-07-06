terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "prop-ie-terraform-state"
    key    = "prop-ie-aws-app/terraform.tfstate"
    region = "us-east-1"
  }
  required_version = ">= 1.5.0"
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "PropIE"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Import CloudFormation resources as data sources
data "aws_cloudformation_stack" "appsync" {
  name = "prop-ie-${var.environment}-appsync-stack"
}

data "aws_cloudformation_stack" "cognito" {
  name = "prop-ie-${var.environment}-cognito-stack"
}

data "aws_cloudformation_stack" "monitoring" {
  name = "prop-ie-${var.environment}-monitoring-stack"
}

# AWS Amplify App
resource "aws_amplify_app" "prop_ie_app" {
  name         = "prop-ie-aws-app"
  description  = "PropIE Property Investment Platform"
  repository   = var.repository_url
  access_token = var.github_access_token

  # Enable branch auto-detection to automatically connect new branches
  enable_branch_auto_detection = true
  
  # Custom rules for handling SPAs and redirects
  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/index.html"
  }

  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>"
    status = "200"
    target = "/index.html"
  }

  # Environment variables common to all branches
  environment_variables = {
    NEXT_PUBLIC_AWS_REGION = var.aws_region
    NODE_OPTIONS           = "--max-old-space-size=4096"
  }

  # Build specification directly in Terraform
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - if [ "${var.environment}" = "production" ]; then export NODE_ENV=production; elif [ "${var.environment}" = "staging" ]; then export NODE_ENV=staging; else export NODE_ENV=development; fi
            - echo "Building for environment: ${var.environment}"
            - npm ci
            - npm run verify-lockfile
            - npm run security-check
        build:
          commands:
            - echo "Running build for branch: ${var.environment}"
            - if [ "${var.environment}" = "production" ]; then npm run build:prod; elif [ "${var.environment}" = "staging" ]; then npm run build:staging; else npm run build; fi
      artifacts:
        baseDirectory: .next
        files:
          - "**/*"
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
  EOT

  # Platform configuration
  platform = "WEB_COMPUTE"

  # IAM service role for Amplify
  iam_service_role_arn = aws_iam_role.amplify_role.arn
}

# Development Branch
resource "aws_amplify_branch" "development" {
  app_id      = aws_amplify_app.prop_ie_app.id
  branch_name = "development"
  stage       = "DEVELOPMENT"
  
  environment_variables = {
    NEXT_PUBLIC_APP_ENV       = "development"
    NEXT_PUBLIC_API_ENDPOINT  = "https://dev-api.prop-ie-app.com"
    NEXT_PUBLIC_APP_URL       = "https://dev.prop-ie-app.com"
    NEXT_PUBLIC_USER_POOLS_ID = data.aws_cloudformation_stack.cognito.outputs["UserPoolId"]
    NEXT_PUBLIC_S3_BUCKET     = data.aws_cloudformation_stack.cognito.outputs["S3BucketName"]
  }
}

# Staging Branch
resource "aws_amplify_branch" "staging" {
  app_id      = aws_amplify_app.prop_ie_app.id
  branch_name = "staging"
  stage       = "BETA"
  
  environment_variables = {
    NEXT_PUBLIC_APP_ENV       = "staging"
    NEXT_PUBLIC_API_ENDPOINT  = "https://staging-api.prop-ie-app.com"
    NEXT_PUBLIC_APP_URL       = "https://staging.prop-ie-app.com"
    NEXT_PUBLIC_USER_POOLS_ID = data.aws_cloudformation_stack.cognito.outputs["UserPoolId"]
    NEXT_PUBLIC_S3_BUCKET     = data.aws_cloudformation_stack.cognito.outputs["S3BucketName"]
  }
}

# Production Branch
resource "aws_amplify_branch" "production" {
  app_id      = aws_amplify_app.prop_ie_app.id
  branch_name = "production"
  stage       = "PRODUCTION"
  
  environment_variables = {
    NEXT_PUBLIC_APP_ENV       = "production"
    NEXT_PUBLIC_API_ENDPOINT  = "https://api.prop-ie-app.com"
    NEXT_PUBLIC_APP_URL       = "https://prop-ie-app.com"
    NEXT_PUBLIC_USER_POOLS_ID = data.aws_cloudformation_stack.cognito.outputs["UserPoolId"]
    NEXT_PUBLIC_S3_BUCKET     = data.aws_cloudformation_stack.cognito.outputs["S3BucketName"]
  }
}

# Domain association
resource "aws_amplify_domain_association" "prop_ie" {
  app_id      = aws_amplify_app.prop_ie_app.id
  domain_name = "prop-ie-app.com"
  
  # Production subdomain
  sub_domain {
    branch_name = aws_amplify_branch.production.branch_name
    prefix      = ""
  }
  
  # Staging subdomain
  sub_domain {
    branch_name = aws_amplify_branch.staging.branch_name
    prefix      = "staging"
  }
  
  # Development subdomain
  sub_domain {
    branch_name = aws_amplify_branch.development.branch_name
    prefix      = "dev"
  }
}

# IAM role for Amplify
resource "aws_iam_role" "amplify_role" {
  name = "prop-ie-amplify-role-${var.environment}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "amplify.amazonaws.com"
        }
      }
    ]
  })
}

# Amplify permissions policy
resource "aws_iam_policy" "amplify_policy" {
  name        = "prop-ie-amplify-policy-${var.environment}"
  description = "Policy for AWS Amplify to access required resources"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:s3:::${data.aws_cloudformation_stack.cognito.outputs["S3BucketName"]}",
          "arn:aws:s3:::${data.aws_cloudformation_stack.cognito.outputs["S3BucketName"]}/*"
        ]
      },
      {
        Action = [
          "cognito-idp:DescribeUserPool",
          "cognito-idp:DescribeUserPoolClient"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "appsync:GraphQL"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:appsync:${var.aws_region}:*:apis/${data.aws_cloudformation_stack.appsync.outputs["GraphQLApiId"]}/*"
      },
      {
        Action = [
          "cloudwatch:PutMetricData",
          "cloudwatch:GetMetricData",
          "cloudwatch:ListMetrics"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Attach policy to role
resource "aws_iam_role_policy_attachment" "amplify_policy_attachment" {
  role       = aws_iam_role.amplify_role.name
  policy_arn = aws_iam_policy.amplify_policy.arn
}

# Webhook for automatic deployments from GitHub
resource "aws_amplify_webhook" "development" {
  app_id      = aws_amplify_app.prop_ie_app.id
  branch_name = aws_amplify_branch.development.branch_name
  description = "Development branch webhook"
}

resource "aws_amplify_webhook" "staging" {
  app_id      = aws_amplify_app.prop_ie_app.id
  branch_name = aws_amplify_branch.staging.branch_name
  description = "Staging branch webhook"
}

resource "aws_amplify_webhook" "production" {
  app_id      = aws_amplify_app.prop_ie_app.id
  branch_name = aws_amplify_branch.production.branch_name
  description = "Production branch webhook"
}