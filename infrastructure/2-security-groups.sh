#!/bin/bash
# PROP.ie Production Security Groups Setup
set -e

echo "🔒 Creating PROP.ie Production Security Groups..."

# Load VPC details
if [[ ! -f "infrastructure/vpc-details.json" ]]; then
  echo "❌ VPC details not found. Run 1-vpc-setup.sh first."
  exit 1
fi

VPC_ID=$(cat infrastructure/vpc-details.json | grep -o '"vpc_id": "[^"]*"' | cut -d'"' -f4)
REGION="eu-west-1"
PROJECT_NAME="propie-production"

echo "📍 VPC ID: $VPC_ID"

# 1. Application Load Balancer Security Group
echo "Creating ALB Security Group..."
ALB_SG_ID=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-alb-sg" \
  --description "Security group for PROP.ie Application Load Balancer" \
  --vpc-id $VPC_ID \
  --region $REGION \
  --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$PROJECT_NAME-alb-sg},{Key=Environment,Value=production},{Key=Purpose,Value=load-balancer}]" \
  --query 'GroupId' \
  --output text)

# ALB inbound rules
aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --region $REGION

aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0 \
  --region $REGION

echo "✅ ALB Security Group Created: $ALB_SG_ID"

# 2. Application Security Group (Amplify/Lambda)
echo "Creating Application Security Group..."
APP_SG_ID=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-app-sg" \
  --description "Security group for PROP.ie Application servers" \
  --vpc-id $VPC_ID \
  --region $REGION \
  --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$PROJECT_NAME-app-sg},{Key=Environment,Value=production},{Key=Purpose,Value=application}]" \
  --query 'GroupId' \
  --output text)

# App inbound rules (from ALB only)
aws ec2 authorize-security-group-ingress \
  --group-id $APP_SG_ID \
  --protocol tcp \
  --port 3000 \
  --source-group $ALB_SG_ID \
  --region $REGION

aws ec2 authorize-security-group-ingress \
  --group-id $APP_SG_ID \
  --protocol tcp \
  --port 443 \
  --source-group $ALB_SG_ID \
  --region $REGION

echo "✅ Application Security Group Created: $APP_SG_ID"

# 3. Database Security Group
echo "Creating Database Security Group..."
DB_SG_ID=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-db-sg" \
  --description "Security group for PROP.ie PostgreSQL database" \
  --vpc-id $VPC_ID \
  --region $REGION \
  --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$PROJECT_NAME-db-sg},{Key=Environment,Value=production},{Key=Purpose,Value=database}]" \
  --query 'GroupId' \
  --output text)

# Database inbound rules (from app servers only)
aws ec2 authorize-security-group-ingress \
  --group-id $DB_SG_ID \
  --protocol tcp \
  --port 5432 \
  --source-group $APP_SG_ID \
  --region $REGION

echo "✅ Database Security Group Created: $DB_SG_ID"

# 4. Redis Security Group
echo "Creating Redis Security Group..."
REDIS_SG_ID=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-redis-sg" \
  --description "Security group for PROP.ie Redis cluster" \
  --vpc-id $VPC_ID \
  --region $REGION \
  --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$PROJECT_NAME-redis-sg},{Key=Environment,Value=production},{Key=Purpose,Value=cache}]" \
  --query 'GroupId' \
  --output text)

# Redis inbound rules (from app servers only)
aws ec2 authorize-security-group-ingress \
  --group-id $REDIS_SG_ID \
  --protocol tcp \
  --port 6379 \
  --source-group $APP_SG_ID \
  --region $REGION

echo "✅ Redis Security Group Created: $REDIS_SG_ID"

# 5. Bastion/Management Security Group (for emergency access)
echo "Creating Management Security Group..."
MGMT_SG_ID=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-mgmt-sg" \
  --description "Security group for PROP.ie management/bastion access" \
  --vpc-id $VPC_ID \
  --region $REGION \
  --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$PROJECT_NAME-mgmt-sg},{Key=Environment,Value=production},{Key=Purpose,Value=management}]" \
  --query 'GroupId' \
  --output text)

# SSH access from specific IP (update with your office IP)
# aws ec2 authorize-security-group-ingress \
#   --group-id $MGMT_SG_ID \
#   --protocol tcp \
#   --port 22 \
#   --cidr YOUR.OFFICE.IP.ADDRESS/32 \
#   --region $REGION

echo "✅ Management Security Group Created: $MGMT_SG_ID"
echo "   ⚠️  Update SSH access rules with your office IP address"

# 6. Lambda Security Group (for serverless functions)
echo "Creating Lambda Security Group..."
LAMBDA_SG_ID=$(aws ec2 create-security-group \
  --group-name "$PROJECT_NAME-lambda-sg" \
  --description "Security group for PROP.ie Lambda functions" \
  --vpc-id $VPC_ID \
  --region $REGION \
  --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$PROJECT_NAME-lambda-sg},{Key=Environment,Value=production},{Key=Purpose,Value=serverless}]" \
  --query 'GroupId' \
  --output text)

echo "✅ Lambda Security Group Created: $LAMBDA_SG_ID"

# 7. Update Database SG to allow Lambda access
aws ec2 authorize-security-group-ingress \
  --group-id $DB_SG_ID \
  --protocol tcp \
  --port 5432 \
  --source-group $LAMBDA_SG_ID \
  --region $REGION

# 8. Update Redis SG to allow Lambda access  
aws ec2 authorize-security-group-ingress \
  --group-id $REDIS_SG_ID \
  --protocol tcp \
  --port 6379 \
  --source-group $LAMBDA_SG_ID \
  --region $REGION

echo "✅ Lambda access to database and Redis configured"

# 9. Save security group details
cat > infrastructure/security-groups.json << EOF
{
  "alb_security_group": "$ALB_SG_ID",
  "app_security_group": "$APP_SG_ID", 
  "database_security_group": "$DB_SG_ID",
  "redis_security_group": "$REDIS_SG_ID",
  "management_security_group": "$MGMT_SG_ID",
  "lambda_security_group": "$LAMBDA_SG_ID",
  "vpc_id": "$VPC_ID",
  "region": "$REGION"
}
EOF

echo "📝 Security group details saved to infrastructure/security-groups.json"
echo ""
echo "🎉 Security Groups Setup Complete!"
echo ""
echo "📋 Summary:"
echo "   ALB SG: $ALB_SG_ID (HTTP/HTTPS from internet)"
echo "   App SG: $APP_SG_ID (Port 3000/443 from ALB)"
echo "   DB SG: $DB_SG_ID (Port 5432 from App/Lambda)"
echo "   Redis SG: $REDIS_SG_ID (Port 6379 from App/Lambda)"
echo "   Mgmt SG: $MGMT_SG_ID (SSH access - configure IP)"
echo "   Lambda SG: $LAMBDA_SG_ID (Serverless functions)"
echo ""
echo "🔄 Next: Run 3-iam-roles.sh"