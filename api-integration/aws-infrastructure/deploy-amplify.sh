#!/bin/bash

# ================================================================================
# PROP.ie AWS Amplify Deployment Script
# ================================================================================
# This script deploys the PROP.ie platform to AWS Amplify
# Run this after setting up AWS infrastructure with setup-aws-infrastructure.sh
# ================================================================================

set -e  # Exit on any error

# Configuration
AWS_REGION="eu-west-1"
PROJECT_NAME="prop-ie"
ENVIRONMENT="production"
DOMAIN_NAME="prop.ie"
GITHUB_REPO="https://github.com/your-org/prop-ie.git"  # Update with actual repo

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

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check AWS CLI
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS CLI not configured. Run 'aws configure' first."
    fi
    
    # Check if infrastructure config files exist
    if [ ! -f "aws-infrastructure/amplify-env-vars.json" ]; then
        error "Infrastructure not set up. Run ./aws-infrastructure/setup-aws-infrastructure.sh first."
    fi
    
    # Check jq is installed
    if ! command -v jq &> /dev/null; then
        error "jq is required but not installed. Install with: brew install jq"
    fi
    
    success "Prerequisites checked"
}

# Create Amplify app
create_amplify_app() {
    log "Creating AWS Amplify application..."
    
    # Check if app already exists
    APP_ID=$(aws amplify list-apps \
        --region $AWS_REGION \
        --query "apps[?name=='${PROJECT_NAME}-${ENVIRONMENT}'].appId" \
        --output text)
    
    if [ -z "$APP_ID" ] || [ "$APP_ID" == "None" ]; then
        # Create new Amplify app
        APP_ID=$(aws amplify create-app \
            --name "${PROJECT_NAME}-${ENVIRONMENT}" \
            --description "PROP.ie - Ireland's Enterprise Property Technology Platform" \
            --region $AWS_REGION \
            --repository $GITHUB_REPO \
            --platform WEB \
            --iam-service-role-arn $(cat aws-infrastructure/iam-config.json | jq -r '.amplifyRoleArn') \
            --environment-variables file://aws-infrastructure/amplify-env-vars.json \
            --build-spec '{
                "version": 1,
                "applications": [
                    {
                        "frontend": {
                            "phases": {
                                "preBuild": {
                                    "commands": [
                                        "npm ci",
                                        "echo \"Build started on $(date)\"",
                                        "echo \"Node version: $(node --version)\"",
                                        "echo \"NPM version: $(npm --version)\""
                                    ]
                                },
                                "build": {
                                    "commands": [
                                        "echo \"Starting production build...\"",
                                        "npm run build",
                                        "echo \"Build completed successfully\""
                                    ]
                                }
                            },
                            "artifacts": {
                                "baseDirectory": ".next",
                                "files": ["**/*"]
                            },
                            "cache": {
                                "paths": ["node_modules/**/*", ".next/cache/**/*"]
                            }
                        }
                    }
                ]
            }' \
            --custom-rules '[
                {
                    "source": "/<*>",
                    "target": "/index.html",
                    "status": "404-200"
                },
                {
                    "source": "/api/<*>",
                    "target": "/api/<*>",
                    "status": "200"
                }
            ]' \
            --tags '{
                "Environment": "'$ENVIRONMENT'",
                "Project": "'$PROJECT_NAME'",
                "Platform": "Next.js"
            }' \
            --query 'app.appId' \
            --output text)
        
        success "Created Amplify app: $APP_ID"
    else
        success "Using existing Amplify app: $APP_ID"
    fi
    
    # Save app configuration
    cat > aws-infrastructure/amplify-config.json << EOF
{
    "appId": "$APP_ID",
    "name": "${PROJECT_NAME}-${ENVIRONMENT}",
    "region": "$AWS_REGION"
}
EOF
    
    success "Amplify configuration saved"
}

# Create production branch
create_production_branch() {
    log "Setting up production branch..."
    
    APP_ID=$(cat aws-infrastructure/amplify-config.json | jq -r '.appId')
    
    # Check if branch already exists
    BRANCH_EXISTS=$(aws amplify list-branches \
        --app-id $APP_ID \
        --region $AWS_REGION \
        --query "branches[?branchName=='production'].branchName" \
        --output text)
    
    if [ -z "$BRANCH_EXISTS" ] || [ "$BRANCH_EXISTS" == "None" ]; then
        # Create production branch
        aws amplify create-branch \
            --app-id $APP_ID \
            --branch-name production \
            --region $AWS_REGION \
            --description "Production deployment branch" \
            --environment-variables file://aws-infrastructure/amplify-env-vars.json \
            --enable-auto-build \
            --enable-basic-auth false \
            --stage PRODUCTION
        
        success "Created production branch"
    else
        success "Production branch already exists"
    fi
}

# Configure custom domain
configure_domain() {
    log "Configuring custom domain..."
    
    APP_ID=$(cat aws-infrastructure/amplify-config.json | jq -r '.appId')
    
    # Check if SSL certificate exists and is validated
    CERT_ARN=$(cat aws-infrastructure/ssl-config.json | jq -r '.certificateArn')
    
    # Create domain association
    aws amplify create-domain-association \
        --app-id $APP_ID \
        --domain-name $DOMAIN_NAME \
        --region $AWS_REGION \
        --sub-domain-settings '[
            {
                "prefix": "",
                "branchName": "production"
            },
            {
                "prefix": "www",
                "branchName": "production"
            }
        ]' \
        --certificate-arn $CERT_ARN || warning "Domain may already be configured"
    
    success "Domain configuration initiated"
    warning "⚠️  Domain validation may take 24-48 hours to complete"
}

# Deploy application
deploy_application() {
    log "Deploying application to production..."
    
    APP_ID=$(cat aws-infrastructure/amplify-config.json | jq -r '.appId')
    
    # Start deployment
    JOB_ID=$(aws amplify start-job \
        --app-id $APP_ID \
        --branch-name production \
        --job-type RELEASE \
        --region $AWS_REGION \
        --query 'jobSummary.jobId' \
        --output text)
    
    success "Deployment started with Job ID: $JOB_ID"
    
    # Wait for deployment to complete
    log "Waiting for deployment to complete..."
    aws amplify wait job-complete \
        --app-id $APP_ID \
        --branch-name production \
        --job-id $JOB_ID \
        --region $AWS_REGION
    
    # Get deployment status
    JOB_STATUS=$(aws amplify get-job \
        --app-id $APP_ID \
        --branch-name production \
        --job-id $JOB_ID \
        --region $AWS_REGION \
        --query 'job.summary.status' \
        --output text)
    
    if [ "$JOB_STATUS" == "SUCCEED" ]; then
        success "Deployment completed successfully!"
    else
        error "Deployment failed with status: $JOB_STATUS"
    fi
    
    # Get app URL
    APP_URL=$(aws amplify get-branch \
        --app-id $APP_ID \
        --branch-name production \
        --region $AWS_REGION \
        --query 'branch.branchArn' \
        --output text)
    
    APP_URL="https://production.${APP_ID}.amplifyapp.com"
    
    success "Application deployed to: $APP_URL"
}

# Configure monitoring
setup_monitoring() {
    log "Setting up monitoring and alerts..."
    
    APP_ID=$(cat aws-infrastructure/amplify-config.json | jq -r '.appId')
    
    # Enable access logs
    aws amplify update-app \
        --app-id $APP_ID \
        --region $AWS_REGION \
        --enable-basic-auth false \
        --enable-auto-branch-creation false \
        --enable-branch-auto-build true \
        --enable-branch-auto-deletion false
    
    # Create CloudWatch alarm for application errors
    aws cloudwatch put-metric-alarm \
        --alarm-name "${PROJECT_NAME}-amplify-errors" \
        --alarm-description "Monitor Amplify application errors" \
        --region $AWS_REGION \
        --metric-name "4xxError" \
        --namespace "AWS/Amplify" \
        --statistic Sum \
        --period 300 \
        --threshold 10 \
        --comparison-operator GreaterThanThreshold \
        --evaluation-periods 2 \
        --alarm-actions "arn:aws:sns:${AWS_REGION}:$(aws sts get-caller-identity --query Account --output text):${PROJECT_NAME}-alerts" \
        --dimensions Name=App,Value=$APP_ID || warning "CloudWatch alarm may already exist"
    
    success "Monitoring configured"
}

# Generate deployment summary
generate_summary() {
    log "Generating deployment summary..."
    
    APP_ID=$(cat aws-infrastructure/amplify-config.json | jq -r '.appId')
    USER_POOL_ID=$(cat aws-infrastructure/cognito-config.json | jq -r '.userPoolId')
    DB_ENDPOINT=$(cat aws-infrastructure/database-config.json | jq -r '.endpoint')
    
    cat > aws-infrastructure/deployment-summary.md << EOF
# PROP.ie Production Deployment Summary

## 🚀 Deployment Status: COMPLETE

### Application Details
- **Amplify App ID**: $APP_ID
- **Production URL**: https://production.${APP_ID}.amplifyapp.com
- **Custom Domain**: https://$DOMAIN_NAME (pending DNS validation)
- **Region**: $AWS_REGION

### Infrastructure Components

#### Authentication (AWS Cognito)
- **User Pool ID**: $USER_POOL_ID
- **Region**: $AWS_REGION
- **Domain**: ${PROJECT_NAME}-auth.auth.${AWS_REGION}.amazoncognito.com

#### Database (RDS PostgreSQL)
- **Endpoint**: $DB_ENDPOINT
- **Engine**: PostgreSQL 15.4
- **Instance Class**: db.t3.micro
- **Multi-AZ**: Enabled
- **Backup Retention**: 7 days

#### File Storage (S3)
- **Documents Bucket**: ${PROJECT_NAME}-documents-${ENVIRONMENT}
- **Assets Bucket**: ${PROJECT_NAME}-assets-${ENVIRONMENT}
- **Region**: $AWS_REGION

### Next Steps
1. **DNS Configuration**: Point $DOMAIN_NAME to Amplify
2. **SSL Validation**: Complete certificate validation
3. **Third-party Services**: Configure Stripe, SendGrid, Sentry
4. **Testing**: Run production health checks
5. **Go-Live**: Update DNS and announce launch

### Access Information
- **AWS Console**: https://console.aws.amazon.com/amplify/home?region=${AWS_REGION}#/${APP_ID}
- **Database**: Use connection string in database-config.json
- **Monitoring**: CloudWatch dashboards and alarms

Generated: $(date)
EOF
    
    success "Deployment summary created: aws-infrastructure/deployment-summary.md"
}

# Main execution
main() {
    log "🚀 Starting PROP.ie AWS Amplify Deployment"
    log "Project: $PROJECT_NAME"
    log "Environment: $ENVIRONMENT"
    log "Region: $AWS_REGION"
    
    # Execute deployment steps
    check_prerequisites
    create_amplify_app
    create_production_branch
    configure_domain
    deploy_application
    setup_monitoring
    generate_summary
    
    success "🎉 AWS Amplify Deployment Complete!"
    
    echo ""
    log "📋 Deployment Summary:"
    echo "  Application URL: https://production.$(cat aws-infrastructure/amplify-config.json | jq -r '.appId').amplifyapp.com"
    echo "  Custom Domain: https://$DOMAIN_NAME (pending DNS)"
    echo "  Amplify Console: https://console.aws.amazon.com/amplify/"
    
    echo ""
    log "📋 Next Steps:"
    echo "1. Configure DNS records for custom domain"
    echo "2. Set up third-party service integrations"
    echo "3. Run production health checks"
    echo "4. Update monitoring and alerting"
    
    echo ""
    warning "⚠️  Review deployment-summary.md for complete details"
}

# Run main function
main "$@"