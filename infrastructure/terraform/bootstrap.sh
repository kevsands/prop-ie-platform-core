#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default variables
AWS_REGION="eu-west-1"
STATE_BUCKET="prop-transaction-terraform-state"
LOCK_TABLE="prop-transaction-terraform-locks"

# Parse command line arguments
for arg in "$@"; do
  case $arg in
    --region=*)
      AWS_REGION="${arg#*=}"
      ;;
    --bucket=*)
      STATE_BUCKET="${arg#*=}"
      ;;
    --table=*)
      LOCK_TABLE="${arg#*=}"
      ;;
  esac
done

echo -e "${BLUE}Terraform State Management Bootstrap${NC}"
echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}Region:${NC} $AWS_REGION"
echo -e "${GREEN}S3 Bucket:${NC} $STATE_BUCKET"
echo -e "${GREEN}DynamoDB Table:${NC} $LOCK_TABLE"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is logged in to AWS
echo -e "\n${YELLOW}Verifying AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with AWS. Please run 'aws configure' or set up credentials.${NC}"
    exit 1
fi

echo -e "${GREEN}AWS credentials verified successfully.${NC}"

# Create S3 bucket for Terraform state
echo -e "\n${YELLOW}Creating S3 bucket for Terraform state...${NC}"
if aws s3api head-bucket --bucket "$STATE_BUCKET" 2>/dev/null; then
    echo -e "${YELLOW}Bucket $STATE_BUCKET already exists. Skipping creation.${NC}"
else
    if [ "$AWS_REGION" = "us-east-1" ]; then
        aws s3api create-bucket \
            --bucket "$STATE_BUCKET" \
            --region "$AWS_REGION"
    else
        aws s3api create-bucket \
            --bucket "$STATE_BUCKET" \
            --region "$AWS_REGION" \
            --create-bucket-configuration LocationConstraint="$AWS_REGION"
    fi
    echo -e "${GREEN}Bucket $STATE_BUCKET created successfully.${NC}"
fi

# Enable versioning on the S3 bucket
echo -e "\n${YELLOW}Enabling versioning on the S3 bucket...${NC}"
aws s3api put-bucket-versioning \
    --bucket "$STATE_BUCKET" \
    --versioning-configuration Status=Enabled
echo -e "${GREEN}Versioning enabled on bucket $STATE_BUCKET.${NC}"

# Enable server-side encryption on the S3 bucket
echo -e "\n${YELLOW}Enabling default encryption on the S3 bucket...${NC}"
aws s3api put-bucket-encryption \
    --bucket "$STATE_BUCKET" \
    --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'
echo -e "${GREEN}Default encryption enabled on bucket $STATE_BUCKET.${NC}"

# Block public access to the S3 bucket
echo -e "\n${YELLOW}Blocking public access to the S3 bucket...${NC}"
aws s3api put-public-access-block \
    --bucket "$STATE_BUCKET" \
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
echo -e "${GREEN}Public access blocked for bucket $STATE_BUCKET.${NC}"

# Create DynamoDB table for Terraform state locking
echo -e "\n${YELLOW}Creating DynamoDB table for Terraform state locking...${NC}"
if aws dynamodb describe-table --table-name "$LOCK_TABLE" &>/dev/null; then
    echo -e "${YELLOW}DynamoDB table $LOCK_TABLE already exists. Skipping creation.${NC}"
else
    aws dynamodb create-table \
        --table-name "$LOCK_TABLE" \
        --billing-mode PAY_PER_REQUEST \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --region "$AWS_REGION"
    echo -e "${GREEN}DynamoDB table $LOCK_TABLE created successfully.${NC}"
fi

# Add tags to resources
echo -e "\n${YELLOW}Adding tags to resources...${NC}"
aws s3api put-bucket-tagging \
    --bucket "$STATE_BUCKET" \
    --tagging 'TagSet=[{Key=Name,Value=terraform-state},{Key=Environment,Value=management},{Key=ManagedBy,Value=terraform}]'

aws dynamodb tag-resource \
    --resource-arn "arn:aws:dynamodb:$AWS_REGION:$(aws sts get-caller-identity --query Account --output text):table/$LOCK_TABLE" \
    --tags Key=Name,Value=terraform-locks Key=Environment,Value=management Key=ManagedBy,Value=terraform

echo -e "${GREEN}Tags added to resources.${NC}"

echo -e "\n${BLUE}=======================================================${NC}"
echo -e "${GREEN}Terraform state management infrastructure created successfully!${NC}"
echo -e "${BLUE}=======================================================${NC}"
echo -e "S3 Bucket: ${YELLOW}$STATE_BUCKET${NC}"
echo -e "DynamoDB Table: ${YELLOW}$LOCK_TABLE${NC}"
echo -e "Region: ${YELLOW}$AWS_REGION${NC}"
echo -e "\nAdd the following to your Terraform configuration:"
echo -e "${BLUE}------------------------------------------${NC}"
echo -e "${YELLOW}terraform {
  backend \"s3\" {
    bucket         = \"$STATE_BUCKET\"
    key            = \"<environment>/terraform.tfstate\"
    region         = \"$AWS_REGION\"
    dynamodb_table = \"$LOCK_TABLE\"
    encrypt        = true
  }
}${NC}"

echo -e "\n${GREEN}You can now run:${NC} ./deploy.sh --init --env=<environment>"