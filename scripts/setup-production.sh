#!/bin/bash
# Production Environment Setup Script

set -e

echo "🔧 Setting up Production Environment for Prop.ie Platform"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Check if user is logged into AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Not logged into AWS. Please run 'aws configure' first."
    exit 1
fi

# Generate secure secrets if they don't exist
if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "🔐 Generating NEXTAUTH_SECRET..."
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
fi

if [ -z "$JWT_SECRET" ]; then
    echo "🔐 Generating JWT_SECRET..."
    JWT_SECRET=$(openssl rand -base64 32)
    echo "JWT_SECRET=$JWT_SECRET"
fi

# Create AWS resources
echo "☁️  Creating AWS resources..."

# 1. Create RDS PostgreSQL database
echo "📊 Setting up RDS PostgreSQL..."
aws rds create-db-instance \
    --db-instance-identifier prop-ie-production \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15 \
    --allocated-storage 20 \
    --master-username postgres \
    --master-user-password "$DB_PASSWORD" \
    --backup-retention-period 7 \
    --no-publicly-accessible \
    --vpc-security-group-ids "$SECURITY_GROUP_ID" \
    --db-subnet-group-name "$DB_SUBNET_GROUP" \
    --tags Key=Project,Value=prop-ie Key=Environment,Value=production

# 2. Create ElastiCache Redis cluster
echo "🗄️  Setting up Redis cache..."
aws elasticache create-cache-cluster \
    --cache-cluster-id prop-ie-redis \
    --engine redis \
    --cache-node-type cache.t3.micro \
    --num-cache-nodes 1 \
    --security-group-ids "$SECURITY_GROUP_ID" \
    --cache-subnet-group-name "$CACHE_SUBNET_GROUP" \
    --tags Key=Project,Value=prop-ie Key=Environment,Value=production

# 3. Create S3 bucket for static assets
echo "🪣 Creating S3 bucket..."
aws s3api create-bucket \
    --bucket prop-ie-assets \
    --region eu-west-1 \
    --create-bucket-configuration LocationConstraint=eu-west-1

# Enable static website hosting
aws s3 website s3://prop-ie-assets \
    --index-document index.html \
    --error-document error.html

# 4. Create CloudFront distribution
echo "🌐 Setting up CloudFront CDN..."
aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json

# 5. Set up CloudWatch Log Groups
echo "📊 Creating CloudWatch log groups..."
aws logs create-log-group --log-group-name /aws/amplify/prop-ie
aws logs put-retention-policy \
    --log-group-name /aws/amplify/prop-ie \
    --retention-in-days 30

# 6. Create SSM Parameter Store entries for secrets
echo "🔑 Storing secrets in Parameter Store..."
aws ssm put-parameter \
    --name "/prop-ie/production/nextauth-secret" \
    --value "$NEXTAUTH_SECRET" \
    --type SecureString \
    --overwrite

aws ssm put-parameter \
    --name "/prop-ie/production/jwt-secret" \
    --value "$JWT_SECRET" \
    --type SecureString \
    --overwrite

# 7. Set up WAF rules
echo "🛡️  Configuring WAF..."
aws wafv2 create-web-acl \
    --name prop-ie-waf \
    --scope CLOUDFRONT \
    --default-action Allow={} \
    --rules file://waf-rules.json \
    --region us-east-1

# 8. Create Route 53 hosted zone
echo "🌐 Setting up Route 53..."
aws route53 create-hosted-zone \
    --name prop.ie \
    --caller-reference "$(date +%s)"

echo "✅ AWS resources created successfully!"
echo "📝 Next steps:"
echo "1. Update .env.production with the created resource endpoints"
echo "2. Configure DNS to point to CloudFront distribution"
echo "3. Run database migrations"
echo "4. Deploy the application"
echo ""
echo "Resource Summary:"
echo "- RDS Endpoint: [check AWS console]"
echo "- Redis Endpoint: [check AWS console]"
echo "- S3 Bucket: prop-ie-assets"
echo "- CloudFront Domain: [check AWS console]"
echo "- Secrets: Stored in SSM Parameter Store"