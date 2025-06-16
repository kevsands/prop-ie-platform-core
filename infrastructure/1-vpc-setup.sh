#!/bin/bash
# PROP.ie Production VPC Setup
set -e

echo "🏗️  Creating PROP.ie Production VPC Infrastructure..."

# Set variables
VPC_CIDR="10.0.0.0/16"
REGION="eu-west-1"
PROJECT_NAME="propie-production"

echo "📍 Region: $REGION"
echo "🌐 VPC CIDR: $VPC_CIDR"

# 1. Create VPC
echo "Creating VPC..."
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block $VPC_CIDR \
  --region $REGION \
  --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=$PROJECT_NAME-vpc},{Key=Environment,Value=production},{Key=Project,Value=propie}]" \
  --query 'Vpc.VpcId' \
  --output text)

echo "✅ VPC Created: $VPC_ID"

# 2. Enable DNS hostnames and resolution
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support

echo "✅ DNS enabled for VPC"

# 3. Create Internet Gateway
echo "Creating Internet Gateway..."
IGW_ID=$(aws ec2 create-internet-gateway \
  --region $REGION \
  --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=$PROJECT_NAME-igw},{Key=Environment,Value=production}]" \
  --query 'InternetGateway.InternetGatewayId' \
  --output text)

echo "✅ Internet Gateway Created: $IGW_ID"

# 4. Attach Internet Gateway to VPC
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
echo "✅ Internet Gateway attached to VPC"

# 5. Create Public Subnets (for ALB, NAT Gateway)
echo "Creating public subnets..."

PUBLIC_SUBNET_1_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block "10.0.1.0/24" \
  --availability-zone "eu-west-1a" \
  --region $REGION \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-public-1a},{Key=Type,Value=public},{Key=Environment,Value=production}]" \
  --query 'Subnet.SubnetId' \
  --output text)

PUBLIC_SUBNET_2_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block "10.0.2.0/24" \
  --availability-zone "eu-west-1b" \
  --region $REGION \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-public-1b},{Key=Type,Value=public},{Key=Environment,Value=production}]" \
  --query 'Subnet.SubnetId' \
  --output text)

echo "✅ Public Subnets Created:"
echo "   📍 1a: $PUBLIC_SUBNET_1_ID"
echo "   📍 1b: $PUBLIC_SUBNET_2_ID"

# 6. Create Private Subnets (for RDS, ElastiCache, Lambda)
echo "Creating private subnets..."

PRIVATE_SUBNET_1_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block "10.0.10.0/24" \
  --availability-zone "eu-west-1a" \
  --region $REGION \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-private-1a},{Key=Type,Value=private},{Key=Environment,Value=production}]" \
  --query 'Subnet.SubnetId' \
  --output text)

PRIVATE_SUBNET_2_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block "10.0.11.0/24" \
  --availability-zone "eu-west-1b" \
  --region $REGION \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$PROJECT_NAME-private-1b},{Key=Type,Value=private},{Key=Environment,Value=production}]" \
  --query 'Subnet.SubnetId' \
  --output text)

echo "✅ Private Subnets Created:"
echo "   📍 1a: $PRIVATE_SUBNET_1_ID"
echo "   📍 1b: $PRIVATE_SUBNET_2_ID"

# 7. Create NAT Gateway (for private subnet internet access)
echo "Allocating Elastic IP for NAT Gateway..."
EIP_ALLOC_ID=$(aws ec2 allocate-address \
  --domain vpc \
  --region $REGION \
  --tag-specifications "ResourceType=elastic-ip,Tags=[{Key=Name,Value=$PROJECT_NAME-nat-eip},{Key=Environment,Value=production}]" \
  --query 'AllocationId' \
  --output text)

echo "Creating NAT Gateway..."
NAT_GW_ID=$(aws ec2 create-nat-gateway \
  --subnet-id $PUBLIC_SUBNET_1_ID \
  --allocation-id $EIP_ALLOC_ID \
  --region $REGION \
  --tag-specifications "ResourceType=nat-gateway,Tags=[{Key=Name,Value=$PROJECT_NAME-nat-gw},{Key=Environment,Value=production}]" \
  --query 'NatGateway.NatGatewayId' \
  --output text)

echo "✅ NAT Gateway Created: $NAT_GW_ID"

# 8. Create Route Tables
echo "Creating route tables..."

# Public Route Table
PUBLIC_RT_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --region $REGION \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=$PROJECT_NAME-public-rt},{Key=Type,Value=public},{Key=Environment,Value=production}]" \
  --query 'RouteTable.RouteTableId' \
  --output text)

# Private Route Table
PRIVATE_RT_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --region $REGION \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=$PROJECT_NAME-private-rt},{Key=Type,Value=private},{Key=Environment,Value=production}]" \
  --query 'RouteTable.RouteTableId' \
  --output text)

echo "✅ Route Tables Created:"
echo "   🌐 Public: $PUBLIC_RT_ID"
echo "   🔒 Private: $PRIVATE_RT_ID"

# 9. Create Routes
echo "Creating routes..."

# Public route to internet
aws ec2 create-route \
  --route-table-id $PUBLIC_RT_ID \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id $IGW_ID \
  --region $REGION

# Private route to NAT Gateway (wait for NAT Gateway to be available)
echo "⏳ Waiting for NAT Gateway to be available..."
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_GW_ID --region $REGION

aws ec2 create-route \
  --route-table-id $PRIVATE_RT_ID \
  --destination-cidr-block 0.0.0.0/0 \
  --nat-gateway-id $NAT_GW_ID \
  --region $REGION

echo "✅ Routes created"

# 10. Associate subnets with route tables
echo "Associating subnets with route tables..."

aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET_1_ID --route-table-id $PUBLIC_RT_ID --region $REGION
aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET_2_ID --route-table-id $PUBLIC_RT_ID --region $REGION
aws ec2 associate-route-table --subnet-id $PRIVATE_SUBNET_1_ID --route-table-id $PRIVATE_RT_ID --region $REGION
aws ec2 associate-route-table --subnet-id $PRIVATE_SUBNET_2_ID --route-table-id $PRIVATE_RT_ID --region $REGION

echo "✅ Subnet associations completed"

# 11. Save infrastructure details
cat > infrastructure/vpc-details.json << EOF
{
  "vpc_id": "$VPC_ID",
  "internet_gateway_id": "$IGW_ID",
  "nat_gateway_id": "$NAT_GW_ID",
  "elastic_ip_allocation_id": "$EIP_ALLOC_ID",
  "public_subnets": {
    "subnet_1a": "$PUBLIC_SUBNET_1_ID",
    "subnet_1b": "$PUBLIC_SUBNET_2_ID"
  },
  "private_subnets": {
    "subnet_1a": "$PRIVATE_SUBNET_1_ID",
    "subnet_1b": "$PRIVATE_SUBNET_2_ID"
  },
  "route_tables": {
    "public": "$PUBLIC_RT_ID",
    "private": "$PRIVATE_RT_ID"
  },
  "region": "$REGION",
  "project": "$PROJECT_NAME"
}
EOF

echo "📝 Infrastructure details saved to infrastructure/vpc-details.json"
echo ""
echo "🎉 VPC Infrastructure Setup Complete!"
echo ""
echo "📋 Summary:"
echo "   VPC ID: $VPC_ID"
echo "   Public Subnets: $PUBLIC_SUBNET_1_ID, $PUBLIC_SUBNET_2_ID"
echo "   Private Subnets: $PRIVATE_SUBNET_1_ID, $PRIVATE_SUBNET_2_ID"
echo "   NAT Gateway: $NAT_GW_ID"
echo ""
echo "🔄 Next: Run 2-security-groups.sh"