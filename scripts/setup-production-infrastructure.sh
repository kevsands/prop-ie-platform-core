#!/bin/bash

# Production Infrastructure Setup Script for PROP.ie Platform
# This script helps you set up all required production services

set -e

echo "🏗️  PROP.ie Production Infrastructure Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if AWS CLI is configured
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI first.${NC}"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not configured. Run 'aws configure' first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ AWS CLI configured${NC}"
}

# 1. Create Redis cluster for rate limiting
setup_redis() {
    echo -e "\n${BLUE}📦 Setting up Redis for Rate Limiting${NC}"
    echo "======================================"
    
    CLUSTER_NAME="prop-ie-redis-$(date +%s)"
    
    echo "Creating ElastiCache Redis cluster: $CLUSTER_NAME"
    
    aws elasticache create-cache-cluster \
        --cache-cluster-id "$CLUSTER_NAME" \
        --cache-node-type cache.t3.micro \
        --engine redis \
        --num-cache-nodes 1 \
        --port 6379 \
        --tags Key=Project,Value=PropIE Key=Environment,Value=Production
    
    echo -e "${YELLOW}⏳ Redis cluster is being created. This takes 5-10 minutes.${NC}"
    echo "Cluster ID: $CLUSTER_NAME"
    
    # Get the endpoint once created
    echo "Getting Redis endpoint..."
    aws elasticache describe-cache-clusters \
        --cache-cluster-id "$CLUSTER_NAME" \
        --show-cache-node-info \
        --query 'CacheClusters[0].CacheNodes[0].Endpoint'
    
    echo -e "${GREEN}✅ Redis setup initiated${NC}"
    echo "REDIS_URL will be: redis://<endpoint>:6379"
}

# 2. Set up Sentry for error tracking
setup_sentry() {
    echo -e "\n${BLUE}🐛 Setting up Sentry Error Tracking${NC}"
    echo "==================================="
    
    echo "To get your Sentry DSN:"
    echo "1. Go to https://sentry.io/"
    echo "2. Sign up or log in"
    echo "3. Create a new project"
    echo "4. Select 'Next.js' as the platform"
    echo "5. Copy the DSN from the project settings"
    echo ""
    echo "Example DSN format:"
    echo "https://abc123def456ghi789@o123456.ingest.sentry.io/7891011"
    echo ""
    read -p "Enter your Sentry DSN (or press Enter to skip): " SENTRY_DSN
    
    if [ ! -z "$SENTRY_DSN" ]; then
        echo "SENTRY_DSN=$SENTRY_DSN" >> .env.production
        echo -e "${GREEN}✅ Sentry DSN saved to .env.production${NC}"
    fi
}

# 3. Set up AWS CloudWatch for monitoring
setup_cloudwatch() {
    echo -e "\n${BLUE}📊 Setting up CloudWatch Monitoring${NC}"
    echo "===================================="
    
    # Create custom namespace for our metrics
    echo "Setting up CloudWatch namespace: PropIE/Business"
    
    # Test metric to create the namespace
    aws cloudwatch put-metric-data \
        --namespace "PropIE/Business" \
        --metric-data MetricName=SetupTest,Value=1,Unit=Count
    
    echo -e "${GREEN}✅ CloudWatch namespace created${NC}"
    
    # Your AWS credentials should already be configured
    AWS_REGION=$(aws configure get region)
    echo "AWS Region: $AWS_REGION"
    
    if [ -z "$AWS_REGION" ]; then
        echo -e "${YELLOW}⚠️  No default region set. Using eu-west-1${NC}"
        AWS_REGION="eu-west-1"
    fi
    
    echo "AWS_REGION=$AWS_REGION" >> .env.production
}

# 4. Generate other required environment variables
setup_other_vars() {
    echo -e "\n${BLUE}🔐 Setting up Other Environment Variables${NC}"
    echo "========================================"
    
    # Generate JWT secret if not exists
    if ! grep -q "JWT_SECRET" .env.production 2>/dev/null; then
        JWT_SECRET=$(openssl rand -hex 64)
        echo "JWT_SECRET=$JWT_SECRET" >> .env.production
        echo -e "${GREEN}✅ Generated JWT secret${NC}"
    fi
    
    # Generate NextAuth secret if not exists
    if ! grep -q "NEXTAUTH_SECRET" .env.production 2>/dev/null; then
        NEXTAUTH_SECRET=$(openssl rand -hex 64)
        echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.production
        echo -e "${GREEN}✅ Generated NextAuth secret${NC}"
    fi
    
    # Generate encryption key if not exists
    if ! grep -q "ENCRYPTION_KEY" .env.production 2>/dev/null; then
        ENCRYPTION_KEY=$(openssl rand -hex 32)
        echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> .env.production
        echo -e "${GREEN}✅ Generated encryption key${NC}"
    fi
    
    # Set other required vars
    echo "NODE_ENV=production" >> .env.production
    echo "LOG_LEVEL=info" >> .env.production
    echo "LOG_FORMAT=json" >> .env.production
    echo "RATE_LIMIT_WINDOW_MS=900000" >> .env.production
    echo "RATE_LIMIT_MAX_REQUESTS=100" >> .env.production
    
    echo -e "${GREEN}✅ Base environment variables set${NC}"
}

# 5. Create .env.production.template for reference
create_env_template() {
    echo -e "\n${BLUE}📋 Creating Environment Template${NC}"
    echo "================================"
    
    cat > .env.production.template << EOF
# PROP.ie Production Environment Variables
# Copy this file to .env.production and fill in your values

# Application
NODE_ENV=production
APP_URL=https://your-domain.com
PORT=3000

# Database (you'll need to set these up)
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-generated-secret
JWT_SECRET=your-generated-secret

# AWS (from your AWS CLI configuration)
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-s3-bucket

# Redis (from ElastiCache setup above)
REDIS_URL=redis://your-redis-endpoint:6379
REDIS_PASSWORD=your-redis-password

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production

# Email (you'll need to configure SMTP)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@your-domain.com

# Third-party APIs (optional)
STRIPE_SECRET_KEY=sk_live_your-stripe-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Security
ENCRYPTION_KEY=your-generated-encryption-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Feature Flags
FEATURE_BLOCKCHAIN_ENABLED=false
FEATURE_AI_SEARCH_ENABLED=true
FEATURE_ADVANCED_ANALYTICS_ENABLED=true
EOF

    echo -e "${GREEN}✅ Template created: .env.production.template${NC}"
}

# 6. Show next steps
show_next_steps() {
    echo -e "\n${BLUE}🎯 Next Steps${NC}"
    echo "=============="
    echo ""
    echo "1. Complete your .env.production file with:"
    echo "   - Database connection string"
    echo "   - Domain name and SSL certificate"
    echo "   - SMTP email configuration"
    echo "   - Stripe keys (for payments)"
    echo ""
    echo "2. Set up your database:"
    echo "   - PostgreSQL instance (AWS RDS recommended)"
    echo "   - Run migrations: npm run db:migrate"
    echo "   - Seed initial data: npm run db:seed"
    echo ""
    echo "3. Configure your domain:"
    echo "   - Set up SSL certificate"
    echo "   - Configure DNS"
    echo "   - Update NEXTAUTH_URL and APP_URL"
    echo ""
    echo "4. Deploy to production:"
    echo "   - AWS Amplify (configured)"
    echo "   - Or Docker container"
    echo "   - Test all endpoints"
    echo ""
    echo -e "${GREEN}🚀 Your infrastructure setup is ready!${NC}"
}

# Main execution
main() {
    echo "Starting infrastructure setup..."
    
    check_aws_cli
    
    # Create .env.production if it doesn't exist
    touch .env.production
    
    # Run setup functions
    setup_cloudwatch
    setup_other_vars
    setup_sentry
    
    # Redis setup (might require additional permissions)
    echo -e "\n${YELLOW}⚠️  Redis setup requires ElastiCache permissions${NC}"
    read -p "Do you want to try setting up Redis now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_redis || echo -e "${YELLOW}⚠️  Redis setup failed. You may need additional AWS permissions.${NC}"
    fi
    
    create_env_template
    show_next_steps
}

# Run the script
main "$@"
EOF