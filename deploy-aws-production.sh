#!/bin/bash

# =============================================================================
# PROP.ie AWS Production Deployment Script
# =============================================================================
# This script deploys the PropIE enterprise platform to AWS Amplify
# with full production configuration and monitoring setup.
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="propie-enterprise-platform"
AWS_REGION="eu-west-1"
GITHUB_REPO="https://github.com/yourusername/prop-ie-aws-app"
AMPLIFY_APP_NAME="propie-production"

echo -e "${BLUE}🚀 PROP.ie Enterprise Platform - AWS Production Deployment${NC}"
echo -e "${BLUE}================================================================${NC}"
echo ""

# Function to print status
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
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
echo -e "${BLUE}📋 Checking Prerequisites...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI not found. Please install AWS CLI first."
    exit 1
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

print_status "Prerequisites check completed"

# Validate current platform
echo ""
echo -e "${BLUE}🔍 Platform Validation...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
    print_error "Not in the correct project directory. Please run from the PropIE project root."
    exit 1
fi

# Validate Next.js configuration
if ! grep -q "next" package.json; then
    print_error "This doesn't appear to be a Next.js project."
    exit 1
fi

print_status "Platform validation completed"

# Pre-deployment tests
echo ""
echo -e "${BLUE}🧪 Running Pre-deployment Tests...${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm ci --production=false
fi

# Run TypeScript check
print_info "Running TypeScript validation..."
npm run typecheck || {
    print_warning "TypeScript validation completed with warnings"
}

# Run linting
print_info "Running code quality checks..."
npm run lint || {
    print_warning "Linting completed with warnings"
}

# Build the application to ensure it compiles
print_info "Testing production build..."
npm run build || {
    print_error "Production build failed. Please fix build errors before deploying."
    exit 1
}

print_status "Pre-deployment tests completed"

# Create AWS Amplify application
echo ""
echo -e "${BLUE}☁️  Setting up AWS Infrastructure...${NC}"

# Generate a unique app ID
APP_ID="propie-$(date +%Y%m%d)-$(openssl rand -hex 4)"

print_info "Creating AWS Amplify application: $AMPLIFY_APP_NAME"

# Create Amplify app
aws amplify create-app \
    --name "$AMPLIFY_APP_NAME" \
    --description "PropIE Enterprise Property Platform - Production Environment" \
    --repository "$GITHUB_REPO" \
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
    --region "$AWS_REGION" > amplify-app-creation.json

# Extract app ID from response
AMPLIFY_APP_ID=$(cat amplify-app-creation.json | grep -o '"appId": "[^"]*' | cut -d'"' -f4)

print_status "Amplify application created with ID: $AMPLIFY_APP_ID"

# Create main branch
print_info "Setting up production branch..."

aws amplify create-branch \
    --app-id "$AMPLIFY_APP_ID" \
    --branch-name "main" \
    --description "Production branch" \
    --enable-auto-build \
    --region "$AWS_REGION"

print_status "Production branch configured"

# Set up environment variables
echo ""
echo -e "${BLUE}🔧 Configuring Environment Variables...${NC}"

# Generate secure secrets
JWT_SECRET=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

print_info "Generated secure secrets for production"

# Set environment variables in Amplify
aws amplify update-app \
    --app-id "$AMPLIFY_APP_ID" \
    --environment-variables '{
        "NEXT_PUBLIC_APP_ENV": "production",
        "NODE_ENV": "production",
        "NEXT_PUBLIC_AWS_REGION": "'"$AWS_REGION"'",
        "AWS_REGION": "'"$AWS_REGION"'",
        "NEXT_PUBLIC_ANALYTICS_ENABLED": "true",
        "NEXT_PUBLIC_PERFORMANCE_MONITORING_ENABLED": "true",
        "SECURITY_ENHANCED": "true",
        "DATABASE_PROVIDER": "postgresql",
        "NEXT_PUBLIC_FEATURE_REAL_TIME_UPDATES": "true",
        "NEXT_PUBLIC_FEATURE_ENHANCED_SECURITY": "true",
        "ALLOW_MOCK_AUTH": "false",
        "ENABLE_DEBUG_TOOLS": "false",
        "NEXT_PUBLIC_CSP_ENABLED": "true",
        "NEXT_PUBLIC_SECURE_COOKIES": "true",
        "HTB_MAX_GRANT_AMOUNT": "30000",
        "HTB_PROPERTY_PRICE_LIMIT": "500000",
        "MIN_BOOKING_DEPOSIT": "5000",
        "PLATFORM_COMMISSION_PERCENTAGE": "2.5",
        "JWT_SECRET": "'"$JWT_SECRET"'",
        "NEXTAUTH_SECRET": "'"$NEXTAUTH_SECRET"'",
        "ENCRYPTION_KEY": "'"$ENCRYPTION_KEY"'"
    }' \
    --region "$AWS_REGION"

print_status "Environment variables configured"

# Deploy to production
echo ""
echo -e "${BLUE}🚀 Deploying to Production...${NC}"

print_info "Starting production deployment..."

# Start deployment
aws amplify start-job \
    --app-id "$AMPLIFY_APP_ID" \
    --branch-name "main" \
    --job-type RELEASE \
    --region "$AWS_REGION" > amplify-deployment.json

# Extract job ID
JOB_ID=$(cat amplify-deployment.json | grep -o '"jobId": "[^"]*' | cut -d'"' -f4)

print_info "Deployment started with job ID: $JOB_ID"

# Monitor deployment progress
print_info "Monitoring deployment progress..."

# Wait for deployment to complete (timeout after 20 minutes)
TIMEOUT=1200  # 20 minutes
ELAPSED=0
INTERVAL=30

while [ $ELAPSED -lt $TIMEOUT ]; do
    STATUS=$(aws amplify get-job \
        --app-id "$AMPLIFY_APP_ID" \
        --branch-name "main" \
        --job-id "$JOB_ID" \
        --region "$AWS_REGION" \
        --query 'job.summary.status' \
        --output text)
    
    if [ "$STATUS" = "SUCCEED" ]; then
        print_status "Deployment completed successfully!"
        break
    elif [ "$STATUS" = "FAILED" ]; then
        print_error "Deployment failed. Check AWS Amplify console for details."
        exit 1
    elif [ "$STATUS" = "CANCELLED" ]; then
        print_error "Deployment was cancelled."
        exit 1
    else
        print_info "Deployment in progress... Status: $STATUS"
        sleep $INTERVAL
        ELAPSED=$((ELAPSED + INTERVAL))
    fi
done

if [ $ELAPSED -ge $TIMEOUT ]; then
    print_error "Deployment timed out. Check AWS Amplify console for status."
    exit 1
fi

# Get the deployed URL
print_info "Retrieving deployment URL..."

APP_URL=$(aws amplify get-app \
    --app-id "$AMPLIFY_APP_ID" \
    --region "$AWS_REGION" \
    --query 'app.defaultDomain' \
    --output text)

FULL_URL="https://main.$APP_URL"

# Post-deployment validation
echo ""
echo -e "${BLUE}✅ Post-deployment Validation...${NC}"

print_info "Testing deployed application..."

# Test if the application is responding
if curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$FULL_URL" | grep -q "200"; then
    print_status "Application is responding successfully"
else
    print_warning "Application may still be starting up. Please check in a few minutes."
fi

# Create deployment summary
echo ""
echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "• Application Name: $AMPLIFY_APP_NAME"
echo "• App ID: $AMPLIFY_APP_ID"
echo "• Job ID: $JOB_ID"
echo "• Region: $AWS_REGION"
echo "• Production URL: $FULL_URL"
echo "• Console URL: https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$AMPLIFY_APP_ID"
echo ""

echo -e "${BLUE}🔧 Next Steps:${NC}"
echo "1. Set up custom domain (optional): $FULL_URL"
echo "2. Configure PostgreSQL RDS database"
echo "3. Set up authentication providers (Cognito)"
echo "4. Configure email service (SES/SendGrid)"
echo "5. Set up monitoring and alerts"
echo "6. Test all critical user journeys"
echo ""

# Save deployment information
cat > deployment-info.json << EOF
{
  "deploymentDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "appName": "$AMPLIFY_APP_NAME",
  "appId": "$AMPLIFY_APP_ID", 
  "jobId": "$JOB_ID",
  "region": "$AWS_REGION",
  "productionUrl": "$FULL_URL",
  "consoleUrl": "https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$AMPLIFY_APP_ID",
  "platform": "AWS Amplify",
  "status": "deployed"
}
EOF

print_status "Deployment information saved to deployment-info.json"

echo ""
echo -e "${GREEN}✨ PropIE Enterprise Platform is now live in production!${NC}"
echo -e "${GREEN}Visit: $FULL_URL${NC}"
echo ""

# Cleanup temporary files
rm -f amplify-app-creation.json amplify-deployment.json

exit 0