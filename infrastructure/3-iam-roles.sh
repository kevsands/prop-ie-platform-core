#!/bin/bash
# PROP.ie Production IAM Roles and Policies Setup
set -e

echo "👤 Creating PROP.ie Production IAM Roles and Policies..."

REGION="eu-west-1"
PROJECT_NAME="propie-production"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "📍 AWS Account: $ACCOUNT_ID"
echo "📍 Region: $REGION"

# 1. Amplify Service Role
echo "Creating Amplify Service Role..."

cat > /tmp/amplify-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "amplify.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \
  --role-name PropieAmplifyServiceRole \
  --assume-role-policy-document file:///tmp/amplify-trust-policy.json \
  --description "Service role for PROP.ie Amplify application" \
  --tags Key=Environment,Value=production Key=Project,Value=propie

# Amplify service policy
cat > /tmp/amplify-service-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::propie-production-*",
        "arn:aws:s3:::propie-production-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name PropieAmplifyServicePolicy \
  --policy-document file:///tmp/amplify-service-policy.json \
  --description "Custom policy for PROP.ie Amplify service"

aws iam attach-role-policy \
  --role-name PropieAmplifyServiceRole \
  --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/PropieAmplifyServicePolicy

echo "✅ Amplify Service Role Created"

# 2. Lambda Execution Role
echo "Creating Lambda Execution Role..."

cat > /tmp/lambda-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \
  --role-name PropieLambdaExecutionRole \
  --assume-role-policy-document file:///tmp/lambda-trust-policy.json \
  --description "Execution role for PROP.ie Lambda functions" \
  --tags Key=Environment,Value=production Key=Project,Value=propie

# Lambda execution policy
cat > /tmp/lambda-execution-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream", 
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface",
        "ec2:AttachNetworkInterface",
        "ec2:DetachNetworkInterface"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances",
        "rds:Connect"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "elasticache:DescribeCacheClusters",
        "elasticache:DescribeReplicationGroups"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::propie-production-*",
        "arn:aws:s3:::propie-production-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminUpdateUserAttributes",
        "cognito-idp:ListUsers"
      ],
      "Resource": "arn:aws:cognito-idp:*:*:userpool/*"
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name PropieLambdaExecutionPolicy \
  --policy-document file:///tmp/lambda-execution-policy.json \
  --description "Custom execution policy for PROP.ie Lambda functions"

aws iam attach-role-policy \
  --role-name PropieLambdaExecutionRole \
  --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/PropieLambdaExecutionPolicy

aws iam attach-role-policy \
  --role-name PropieLambdaExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole

echo "✅ Lambda Execution Role Created"

# 3. RDS Enhanced Monitoring Role
echo "Creating RDS Enhanced Monitoring Role..."

cat > /tmp/rds-monitoring-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "monitoring.rds.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \
  --role-name PropieRDSEnhancedMonitoringRole \
  --assume-role-policy-document file:///tmp/rds-monitoring-trust-policy.json \
  --description "Enhanced monitoring role for PROP.ie RDS instances" \
  --tags Key=Environment,Value=production Key=Project,Value=propie

aws iam attach-role-policy \
  --role-name PropieRDSEnhancedMonitoringRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole

echo "✅ RDS Enhanced Monitoring Role Created"

# 4. Application User (for Amplify deployment)
echo "Creating Application User..."

aws iam create-user \
  --user-name propie-deployment-user \
  --tags Key=Environment,Value=production Key=Project,Value=propie Key=Purpose,Value=deployment

# Application deployment policy
cat > /tmp/app-deployment-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "amplify:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::propie-production-*",
        "arn:aws:s3:::propie-production-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:DescribeStackResources"
      ],
      "Resource": "arn:aws:cloudformation:*:*:stack/amplify-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:CreateFunction",
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "lambda:DeleteFunction",
        "lambda:GetFunction",
        "lambda:ListFunctions",
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:*:*:function:propie-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": [
        "arn:aws:iam::$ACCOUNT_ID:role/PropieAmplifyServiceRole",
        "arn:aws:iam::$ACCOUNT_ID:role/PropieLambdaExecutionRole"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:CreateUserPool",
        "cognito-idp:UpdateUserPool",
        "cognito-idp:DeleteUserPool",
        "cognito-idp:DescribeUserPool",
        "cognito-idp:CreateUserPoolClient",
        "cognito-idp:UpdateUserPoolClient",
        "cognito-idp:DeleteUserPoolClient",
        "cognito-idp:DescribeUserPoolClient"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name PropieDeploymentPolicy \
  --policy-document file:///tmp/app-deployment-policy.json \
  --description "Deployment policy for PROP.ie application"

aws iam attach-user-policy \
  --user-name propie-deployment-user \
  --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/PropieDeploymentPolicy

# Create access keys
echo "Creating access keys for deployment user..."
aws iam create-access-key --user-name propie-deployment-user > /tmp/deployment-keys.json

DEPLOYMENT_ACCESS_KEY=$(cat /tmp/deployment-keys.json | grep -o '"AccessKeyId": "[^"]*"' | cut -d'"' -f4)
DEPLOYMENT_SECRET_KEY=$(cat /tmp/deployment-keys.json | grep -o '"SecretAccessKey": "[^"]*"' | cut -d'"' -f4)

echo "✅ Application Deployment User Created"

# 5. Save IAM details
cat > infrastructure/iam-details.json << EOF
{
  "amplify_service_role": {
    "name": "PropieAmplifyServiceRole",
    "arn": "arn:aws:iam::$ACCOUNT_ID:role/PropieAmplifyServiceRole"
  },
  "lambda_execution_role": {
    "name": "PropieLambdaExecutionRole", 
    "arn": "arn:aws:iam::$ACCOUNT_ID:role/PropieLambdaExecutionRole"
  },
  "rds_monitoring_role": {
    "name": "PropieRDSEnhancedMonitoringRole",
    "arn": "arn:aws:iam::$ACCOUNT_ID:role/PropieRDSEnhancedMonitoringRole"
  },
  "deployment_user": {
    "name": "propie-deployment-user",
    "access_key_id": "$DEPLOYMENT_ACCESS_KEY",
    "secret_access_key": "$DEPLOYMENT_SECRET_KEY"
  },
  "account_id": "$ACCOUNT_ID",
  "region": "$REGION"
}
EOF

# Clean up temporary files
rm -f /tmp/*-trust-policy.json /tmp/*-policy.json /tmp/deployment-keys.json

echo "📝 IAM details saved to infrastructure/iam-details.json"
echo ""
echo "🎉 IAM Roles and Policies Setup Complete!"
echo ""
echo "📋 Summary:"
echo "   Amplify Service Role: PropieAmplifyServiceRole"
echo "   Lambda Execution Role: PropieLambdaExecutionRole" 
echo "   RDS Monitoring Role: PropieRDSEnhancedMonitoringRole"
echo "   Deployment User: propie-deployment-user"
echo ""
echo "🔑 Deployment Credentials:"
echo "   Access Key: $DEPLOYMENT_ACCESS_KEY"
echo "   Secret Key: $DEPLOYMENT_SECRET_KEY"
echo ""
echo "⚠️  IMPORTANT: Store these credentials securely!"
echo ""
echo "🔄 Next: Run 4-database-setup.sh"