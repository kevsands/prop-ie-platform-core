#!/bin/bash

# 🚀 PROP.ie Enterprise - AWS Staging Deployment Script
# Comprehensive staging deployment following validation checklist

set -e

echo "🚀 PROP.ie Enterprise - AWS Staging Deployment"
echo "=============================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}📋 $1${NC}"
}

# Step 1: Pre-deployment validation
print_info "Step 1: Running pre-deployment validation..."
if node scripts/pre-deployment-validation.js; then
    print_status "Pre-deployment validation passed"
else
    print_error "Pre-deployment validation failed - aborting deployment"
    exit 1
fi

# Step 2: Check AWS CLI and credentials
print_info "Step 2: Verifying AWS configuration..."
if aws sts get-caller-identity > /dev/null 2>&1; then
    print_status "AWS credentials configured"
    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=$(aws configure get region || echo "us-east-1")
    print_info "Account: $AWS_ACCOUNT, Region: $AWS_REGION"
else
    print_error "AWS credentials not configured"
    echo "Please run: aws configure"
    exit 1
fi

# Step 3: Create Amplify application
print_info "Step 3: Creating AWS Amplify application..."

APP_NAME="propie-enterprise-staging"
REPO_URL="https://github.com/your-username/prop-ie-aws-app"  # Update with actual repo URL

# Check if Amplify app already exists
if aws amplify get-app --app-id $(aws amplify list-apps --query 'apps[?name==`'$APP_NAME'`].appId' --output text 2>/dev/null) > /dev/null 2>&1; then
    print_warning "Amplify app '$APP_NAME' already exists"
    APP_ID=$(aws amplify list-apps --query 'apps[?name==`'$APP_NAME'`].appId' --output text)
    print_info "Using existing app ID: $APP_ID"
else
    print_info "Creating new Amplify application..."
    
    # Create Amplify app
    CREATE_RESULT=$(aws amplify create-app \
        --name "$APP_NAME" \
        --description "PROP.ie Enterprise Platform - Staging Environment" \
        --platform WEB \
        --build-spec file://amplify.yml \
        --custom-rules '[
            {
                "source": "/api/<*>",
                "target": "/api/<*>",
                "status": "200"
            },
            {
                "source": "/<*>",
                "target": "/index.html",
                "status": "404-200"
            }
        ]' \
        --enable-branch-auto-build \
        --query 'app.appId' \
        --output text)
    
    APP_ID=$CREATE_RESULT
    print_status "Created Amplify app with ID: $APP_ID"
fi

# Step 4: Configure environment variables
print_info "Step 4: Configuring environment variables..."

# Read current environment variables
if [ -f .env.local ]; then
    source .env.local
fi

# Set staging environment variables
aws amplify put-backend-environment \
    --app-id "$APP_ID" \
    --environment-name "staging" \
    --deployment-artifacts '{
        "stackName": "amplify-'$APP_NAME'-staging",
        "bucketName": "amplify-'$APP_NAME'-staging-deployment"
    }' || print_warning "Backend environment may already exist"

# Configure app environment variables
print_info "Setting application environment variables..."
aws amplify update-app \
    --app-id "$APP_ID" \
    --environment-variables \
        NEXT_PUBLIC_APP_ENV=staging \
        NEXT_PUBLIC_ENABLE_ANALYTICS=true \
        SECURITY_ENHANCED=true \
        DATABASE_PROVIDER=postgresql \
        BUILD_ID=$(git rev-parse HEAD 2>/dev/null || echo "manual-deploy") \
        NODE_ENV=production

print_status "Environment variables configured"

# Step 5: Database setup reminder
print_warning "Step 5: Database Setup Required"
echo ""
echo "Before proceeding, you need to:"
echo "1. Create PostgreSQL RDS instance in AWS"
echo "2. Configure security groups for database access"
echo "3. Update DATABASE_URL environment variable in Amplify"
echo ""
echo "Sample RDS creation command:"
echo "aws rds create-db-instance \\"
echo "    --db-instance-identifier propie-staging-db \\"
echo "    --db-instance-class db.t3.micro \\"
echo "    --engine postgres \\"
echo "    --master-username propie_admin \\"
echo "    --master-user-password YOUR_SECURE_PASSWORD \\"
echo "    --allocated-storage 20 \\"
echo "    --vpc-security-group-ids sg-YOUR-SECURITY-GROUP \\"
echo "    --db-name propie_staging"
echo ""

read -p "Have you configured the PostgreSQL database? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Please configure the database first, then re-run this script"
    echo "Amplify app created with ID: $APP_ID"
    echo "You can continue deployment later with: aws amplify start-job --app-id $APP_ID --branch-name staging --job-type MANUAL"
    exit 1
fi

# Step 6: Create staging branch
print_info "Step 6: Creating staging branch..."

BRANCH_RESULT=$(aws amplify create-branch \
    --app-id "$APP_ID" \
    --branch-name "staging" \
    --description "Staging environment for PROP.ie Enterprise" \
    --enable-auto-build \
    --environment-variables \
        NEXT_PUBLIC_APP_ENV=staging \
        DATABASE_URL="$DATABASE_URL" \
    --framework "Next.js - SSR" 2>/dev/null || echo "Branch may already exist")

print_status "Staging branch configured"

# Step 7: Start deployment
print_info "Step 7: Starting deployment..."

JOB_ID=$(aws amplify start-job \
    --app-id "$APP_ID" \
    --branch-name "staging" \
    --job-type "MANUAL" \
    --query 'jobSummary.jobId' \
    --output text)

print_status "Deployment started with Job ID: $JOB_ID"

# Step 8: Monitor deployment
print_info "Step 8: Monitoring deployment progress..."

echo "Deployment initiated. Monitor progress at:"
echo "https://console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID/YnJhbmNoZXM/staging"
echo ""
echo "Or check status with:"
echo "aws amplify get-job --app-id $APP_ID --branch-name staging --job-id $JOB_ID"
echo ""

# Wait for deployment to complete
print_info "Waiting for deployment to complete (this may take 5-10 minutes)..."

while true; do
    STATUS=$(aws amplify get-job \
        --app-id "$APP_ID" \
        --branch-name "staging" \
        --job-id "$JOB_ID" \
        --query 'job.summary.status' \
        --output text)
    
    case $STATUS in
        "SUCCEED")
            print_status "Deployment completed successfully!"
            break
            ;;
        "FAILED")
            print_error "Deployment failed"
            aws amplify get-job \
                --app-id "$APP_ID" \
                --branch-name "staging" \
                --job-id "$JOB_ID" \
                --query 'job.steps[?status==`FAILED`].logUrl' \
                --output table
            exit 1
            ;;
        "RUNNING")
            print_info "Deployment in progress... ($STATUS)"
            sleep 30
            ;;
        *)
            print_warning "Deployment status: $STATUS"
            sleep 30
            ;;
    esac
done

# Step 9: Get deployment URL
print_info "Step 9: Retrieving deployment information..."

APP_URL=$(aws amplify get-branch \
    --app-id "$APP_ID" \
    --branch-name "staging" \
    --query 'branch.branchName' \
    --output text)

DOMAIN=$(aws amplify get-app \
    --app-id "$APP_ID" \
    --query 'app.defaultDomain' \
    --output text)

STAGING_URL="https://staging.$DOMAIN"

print_status "Deployment completed!"
echo ""
echo "🎉 DEPLOYMENT SUMMARY"
echo "===================="
echo "App ID: $APP_ID"
echo "Staging URL: $STAGING_URL"
echo "Job ID: $JOB_ID"
echo "Region: $AWS_REGION"
echo ""

# Step 10: Post-deployment validation
print_info "Step 10: Running post-deployment validation..."

echo "Manual validation checklist:"
echo "1. Visit staging URL: $STAGING_URL"
echo "2. Test homepage loads correctly"
echo "3. Verify database connectivity"
echo "4. Check API endpoints: $STAGING_URL/api/test-enterprise"
echo "5. Validate security headers"
echo "6. Test critical user flows"
echo ""

print_status "AWS Staging Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Test the staging environment thoroughly"
echo "2. Run performance validation"
echo "3. Validate with business stakeholders"  
echo "4. Prepare for production deployment"
echo ""
echo "Monitoring and logs:"
echo "- Amplify Console: https://console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID"
echo "- CloudWatch Logs: https://console.aws.amazon.com/cloudwatch/home?region=$AWS_REGION"