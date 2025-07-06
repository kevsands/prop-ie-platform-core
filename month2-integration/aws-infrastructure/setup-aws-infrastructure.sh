#!/bin/bash

# ================================================================================
# PROP.ie AWS Infrastructure Setup Script
# ================================================================================
# This script provisions all AWS infrastructure required for production deployment
# Run this script after configuring AWS CLI with appropriate permissions
# ================================================================================

set -e  # Exit on any error

# Configuration
AWS_REGION="eu-west-1"
PROJECT_NAME="prop-ie"
ENVIRONMENT="production"
DOMAIN_NAME="prop.ie"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check AWS CLI is configured
check_aws_cli() {
    log "Checking AWS CLI configuration..."
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS CLI not configured. Run 'aws configure' first."
    fi
    success "AWS CLI configured"
}

# Create Cognito User Pool
setup_cognito() {
    log "Setting up AWS Cognito User Pool..."
    
    # Create User Pool
    USER_POOL_ID=$(aws cognito-idp create-user-pool \
        --pool-name "${PROJECT_NAME}-${ENVIRONMENT}" \
        --region $AWS_REGION \
        --policies '{
            "PasswordPolicy": {
                "MinimumLength": 8,
                "RequireUppercase": true,
                "RequireLowercase": true,
                "RequireNumbers": true,
                "RequireSymbols": true
            }
        }' \
        --mfa-configuration "OPTIONAL" \
        --account-recovery-setting '{
            "RecoveryMechanisms": [
                {"Name": "verified_email", "Priority": 1},
                {"Name": "verified_phone_number", "Priority": 2}
            ]
        }' \
        --user-pool-tags '{
            "Environment": "'$ENVIRONMENT'",
            "Project": "'$PROJECT_NAME'"
        }' \
        --query 'UserPool.Id' \
        --output text)
    
    success "Created User Pool: $USER_POOL_ID"
    
    # Create User Pool Client
    CLIENT_ID=$(aws cognito-idp create-user-pool-client \
        --user-pool-id $USER_POOL_ID \
        --client-name "${PROJECT_NAME}-web-client" \
        --region $AWS_REGION \
        --supported-identity-providers "COGNITO" \
        --callback-urls "https://${DOMAIN_NAME}/auth/callback" \
        --logout-urls "https://${DOMAIN_NAME}/auth/signout" \
        --allowed-o-auth-flows "code" \
        --allowed-o-auth-scopes "email" "openid" "profile" \
        --allowed-o-auth-flows-user-pool-client \
        --generate-secret \
        --query 'UserPoolClient.ClientId' \
        --output text)
    
    success "Created User Pool Client: $CLIENT_ID"
    
    # Create Identity Pool
    IDENTITY_POOL_ID=$(aws cognito-identity create-identity-pool \
        --identity-pool-name "${PROJECT_NAME}-${ENVIRONMENT}" \
        --region $AWS_REGION \
        --allow-unauthenticated-identities \
        --cognito-identity-providers '[{
            "ProviderName": "cognito-idp.'$AWS_REGION'.amazonaws.com/'$USER_POOL_ID'",
            "ClientId": "'$CLIENT_ID'",
            "ServerSideTokenCheck": true
        }]' \
        --query 'IdentityPoolId' \
        --output text)
    
    success "Created Identity Pool: $IDENTITY_POOL_ID"
    
    # Save Cognito configuration
    cat > aws-infrastructure/cognito-config.json << EOF
{
    "userPoolId": "$USER_POOL_ID",
    "clientId": "$CLIENT_ID",
    "identityPoolId": "$IDENTITY_POOL_ID",
    "region": "$AWS_REGION",
    "domain": "${PROJECT_NAME}-auth.auth.${AWS_REGION}.amazoncognito.com"
}
EOF
    
    success "Cognito configuration saved to aws-infrastructure/cognito-config.json"
}

# Create RDS PostgreSQL Database
setup_rds() {
    log "Setting up RDS PostgreSQL database..."
    
    # Create DB Subnet Group
    aws rds create-db-subnet-group \
        --db-subnet-group-name "${PROJECT_NAME}-${ENVIRONMENT}-subnet-group" \
        --db-subnet-group-description "Subnet group for ${PROJECT_NAME} ${ENVIRONMENT}" \
        --subnet-ids $(aws ec2 describe-subnets \
            --filters "Name=default-for-az,Values=true" \
            --query 'Subnets[0:2].SubnetId' \
            --output text) \
        --region $AWS_REGION \
        --tags '[
            {"Key": "Environment", "Value": "'$ENVIRONMENT'"},
            {"Key": "Project", "Value": "'$PROJECT_NAME'"}
        ]' || warning "Subnet group may already exist"
    
    # Create Security Group
    SG_ID=$(aws ec2 create-security-group \
        --group-name "${PROJECT_NAME}-${ENVIRONMENT}-rds-sg" \
        --description "Security group for ${PROJECT_NAME} RDS" \
        --region $AWS_REGION \
        --query 'GroupId' \
        --output text) || warning "Security group may already exist"
    
    if [ ! -z "$SG_ID" ]; then
        # Allow PostgreSQL access
        aws ec2 authorize-security-group-ingress \
            --group-id $SG_ID \
            --protocol tcp \
            --port 5432 \
            --cidr 0.0.0.0/0 \
            --region $AWS_REGION || warning "Security group rule may already exist"
    fi
    
    # Generate secure database password
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    # Create RDS Instance
    DB_IDENTIFIER="${PROJECT_NAME}-${ENVIRONMENT}"
    aws rds create-db-instance \
        --db-instance-identifier $DB_IDENTIFIER \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --engine-version 15.4 \
        --master-username propie_user \
        --master-user-password "$DB_PASSWORD" \
        --allocated-storage 20 \
        --storage-type gp2 \
        --storage-encrypted \
        --vpc-security-group-ids $SG_ID \
        --db-subnet-group-name "${PROJECT_NAME}-${ENVIRONMENT}-subnet-group" \
        --backup-retention-period 7 \
        --multi-az \
        --publicly-accessible \
        --region $AWS_REGION \
        --tags '[
            {"Key": "Environment", "Value": "'$ENVIRONMENT'"},
            {"Key": "Project", "Value": "'$PROJECT_NAME'"}
        ]' || warning "RDS instance may already exist"
    
    success "RDS PostgreSQL instance creation initiated: $DB_IDENTIFIER"
    
    # Wait for RDS to be available (this can take 10-15 minutes)
    log "Waiting for RDS instance to become available (this may take 10-15 minutes)..."
    aws rds wait db-instance-available \
        --db-instance-identifier $DB_IDENTIFIER \
        --region $AWS_REGION
    
    # Get RDS endpoint
    DB_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier $DB_IDENTIFIER \
        --region $AWS_REGION \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text)
    
    success "RDS instance available at: $DB_ENDPOINT"
    
    # Save database configuration
    cat > aws-infrastructure/database-config.json << EOF
{
    "endpoint": "$DB_ENDPOINT",
    "port": 5432,
    "database": "postgres",
    "username": "propie_user",
    "password": "$DB_PASSWORD",
    "connectionString": "postgresql://propie_user:$DB_PASSWORD@$DB_ENDPOINT:5432/postgres"
}
EOF
    
    success "Database configuration saved to aws-infrastructure/database-config.json"
    warning "⚠️  Database password saved in database-config.json - keep this file secure!"
}

# Create S3 Buckets
setup_s3() {
    log "Setting up S3 buckets..."
    
    # Document storage bucket
    DOCS_BUCKET="${PROJECT_NAME}-documents-${ENVIRONMENT}"
    aws s3 mb s3://$DOCS_BUCKET --region $AWS_REGION || warning "Bucket may already exist"
    
    # Configure CORS for file uploads
    cat > /tmp/cors-config.json << EOF
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
            "AllowedOrigins": ["https://${DOMAIN_NAME}"],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000
        }
    ]
}
EOF
    
    aws s3api put-bucket-cors \
        --bucket $DOCS_BUCKET \
        --cors-configuration file:///tmp/cors-config.json \
        --region $AWS_REGION
    
    # Enable versioning
    aws s3api put-bucket-versioning \
        --bucket $DOCS_BUCKET \
        --versioning-configuration Status=Enabled \
        --region $AWS_REGION
    
    # Static assets bucket
    ASSETS_BUCKET="${PROJECT_NAME}-assets-${ENVIRONMENT}"
    aws s3 mb s3://$ASSETS_BUCKET --region $AWS_REGION || warning "Bucket may already exist"
    
    # Configure for static website hosting
    aws s3api put-bucket-website \
        --bucket $ASSETS_BUCKET \
        --website-configuration '{
            "IndexDocument": {"Suffix": "index.html"},
            "ErrorDocument": {"Key": "error.html"}
        }' \
        --region $AWS_REGION
    
    success "Created S3 buckets: $DOCS_BUCKET, $ASSETS_BUCKET"
    
    # Save S3 configuration
    cat > aws-infrastructure/s3-config.json << EOF
{
    "documentsBucket": "$DOCS_BUCKET",
    "assetsBucket": "$ASSETS_BUCKET",
    "region": "$AWS_REGION"
}
EOF
    
    success "S3 configuration saved to aws-infrastructure/s3-config.json"
}

# Create SSL Certificate
setup_ssl() {
    log "Requesting SSL certificate..."
    
    CERT_ARN=$(aws acm request-certificate \
        --domain-name $DOMAIN_NAME \
        --subject-alternative-names "www.${DOMAIN_NAME}" "api.${DOMAIN_NAME}" \
        --validation-method DNS \
        --region $AWS_REGION \
        --query 'CertificateArn' \
        --output text)
    
    success "SSL certificate requested: $CERT_ARN"
    
    # Save certificate configuration
    cat > aws-infrastructure/ssl-config.json << EOF
{
    "certificateArn": "$CERT_ARN",
    "domain": "$DOMAIN_NAME",
    "alternativeNames": ["www.${DOMAIN_NAME}", "api.${DOMAIN_NAME}"]
}
EOF
    
    success "SSL configuration saved to aws-infrastructure/ssl-config.json"
    warning "⚠️  You need to validate the certificate via DNS records in your domain registrar"
}

# Create IAM Roles
setup_iam() {
    log "Setting up IAM roles..."
    
    # Amplify service role
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
    
    AMPLIFY_ROLE_ARN=$(aws iam create-role \
        --role-name "${PROJECT_NAME}-amplify-role" \
        --assume-role-policy-document file:///tmp/amplify-trust-policy.json \
        --query 'Role.Arn' \
        --output text) || warning "Role may already exist"
    
    # Attach policies to Amplify role
    aws iam attach-role-policy \
        --role-name "${PROJECT_NAME}-amplify-role" \
        --policy-arn arn:aws:iam::aws:policy/AdministratorAccess-Amplify || warning "Policy may already be attached"
    
    success "Created IAM role for Amplify: $AMPLIFY_ROLE_ARN"
    
    # Save IAM configuration
    cat > aws-infrastructure/iam-config.json << EOF
{
    "amplifyRoleArn": "$AMPLIFY_ROLE_ARN"
}
EOF
    
    success "IAM configuration saved to aws-infrastructure/iam-config.json"
}

# Generate environment variables
generate_env_vars() {
    log "Generating production environment variables..."
    
    # Load configurations
    COGNITO_CONFIG=$(cat aws-infrastructure/cognito-config.json)
    DATABASE_CONFIG=$(cat aws-infrastructure/database-config.json)
    S3_CONFIG=$(cat aws-infrastructure/s3-config.json)
    
    USER_POOL_ID=$(echo $COGNITO_CONFIG | jq -r '.userPoolId')
    CLIENT_ID=$(echo $COGNITO_CONFIG | jq -r '.clientId')
    IDENTITY_POOL_ID=$(echo $COGNITO_CONFIG | jq -r '.identityPoolId')
    DB_CONNECTION_STRING=$(echo $DATABASE_CONFIG | jq -r '.connectionString')
    DOCS_BUCKET=$(echo $S3_CONFIG | jq -r '.documentsBucket')
    
    # Create environment variables file for Amplify
    cat > aws-infrastructure/amplify-env-vars.json << EOF
{
    "NEXT_PUBLIC_AWS_REGION": "$AWS_REGION",
    "NEXT_PUBLIC_COGNITO_USER_POOL_ID": "$USER_POOL_ID",
    "NEXT_PUBLIC_AUTH_CLIENT_ID": "$CLIENT_ID",
    "NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID": "$IDENTITY_POOL_ID",
    "NEXT_PUBLIC_S3_BUCKET": "$DOCS_BUCKET",
    "NEXT_PUBLIC_S3_REGION": "$AWS_REGION",
    "DATABASE_URL": "$DB_CONNECTION_STRING",
    "NEXT_PUBLIC_APP_URL": "https://$DOMAIN_NAME",
    "NEXTAUTH_URL": "https://$DOMAIN_NAME",
    "NODE_ENV": "production"
}
EOF
    
    success "Environment variables generated: aws-infrastructure/amplify-env-vars.json"
}

# Main execution
main() {
    log "🚀 Starting PROP.ie AWS Infrastructure Setup"
    log "Region: $AWS_REGION"
    log "Project: $PROJECT_NAME"
    log "Environment: $ENVIRONMENT"
    log "Domain: $DOMAIN_NAME"
    
    # Create infrastructure directory
    mkdir -p aws-infrastructure
    
    # Execute setup steps
    check_aws_cli
    setup_cognito
    setup_rds
    setup_s3
    setup_ssl
    setup_iam
    generate_env_vars
    
    success "🎉 AWS Infrastructure Setup Complete!"
    
    echo ""
    log "📋 Next Steps:"
    echo "1. Validate SSL certificate via DNS records"
    echo "2. Set up Stripe live account and get API keys"
    echo "3. Configure SendGrid for email delivery"
    echo "4. Set up Sentry for error monitoring"
    echo "5. Run AWS Amplify deployment script"
    
    echo ""
    warning "⚠️  Configuration files created in aws-infrastructure/ directory"
    warning "⚠️  Keep these files secure - they contain sensitive information"
    
    echo ""
    log "Configuration files created:"
    echo "  - aws-infrastructure/cognito-config.json"
    echo "  - aws-infrastructure/database-config.json"
    echo "  - aws-infrastructure/s3-config.json"
    echo "  - aws-infrastructure/ssl-config.json"
    echo "  - aws-infrastructure/iam-config.json"
    echo "  - aws-infrastructure/amplify-env-vars.json"
}

# Run main function
main "$@"