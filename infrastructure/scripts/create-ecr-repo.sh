#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default variables
REPOSITORY_NAME="prop-transaction-app"
AWS_REGION="eu-west-1"

# Parse command line arguments
for arg in "$@"; do
  case $arg in
    --name=*)
      REPOSITORY_NAME="${arg#*=}"
      ;;
    --region=*)
      AWS_REGION="${arg#*=}"
      ;;
  esac
done

echo -e "${BLUE}Creating ECR Repository${NC}"
echo -e "${BLUE}======================${NC}"
echo -e "${GREEN}Repository Name:${NC} $REPOSITORY_NAME"
echo -e "${GREEN}AWS Region:${NC} $AWS_REGION"

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

# Check if repository already exists
echo -e "\n${YELLOW}Checking if repository exists...${NC}"
if aws ecr describe-repositories --repository-names "$REPOSITORY_NAME" --region "$AWS_REGION" &> /dev/null; then
    echo -e "${YELLOW}Repository $REPOSITORY_NAME already exists. Skipping creation.${NC}"
    REPO_URI=$(aws ecr describe-repositories --repository-names "$REPOSITORY_NAME" --region "$AWS_REGION" --query 'repositories[0].repositoryUri' --output text)
else
    # Create ECR repository
    echo -e "\n${YELLOW}Creating ECR repository...${NC}"
    REPO_RESULT=$(aws ecr create-repository \
        --repository-name "$REPOSITORY_NAME" \
        --image-tag-mutability "MUTABLE" \
        --image-scanning-configuration scanOnPush=true \
        --region "$AWS_REGION")
    
    REPO_URI=$(echo "$REPO_RESULT" | jq -r '.repository.repositoryUri')
    echo -e "${GREEN}Repository $REPOSITORY_NAME created successfully.${NC}"
fi

# Set repository policy
echo -e "\n${YELLOW}Setting repository policy...${NC}"
aws ecr put-repository-policy \
    --repository-name "$REPOSITORY_NAME" \
    --policy-text '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowPull",
                "Effect": "Allow",
                "Principal": {
                    "Service": "ecs.amazonaws.com"
                },
                "Action": [
                    "ecr:GetDownloadUrlForLayer",
                    "ecr:BatchGetImage",
                    "ecr:BatchCheckLayerAvailability"
                ]
            }
        ]
    }' \
    --region "$AWS_REGION"

echo -e "${GREEN}Repository policy set successfully.${NC}"

# Set lifecycle policy
echo -e "\n${YELLOW}Setting lifecycle policy...${NC}"
aws ecr put-lifecycle-policy \
    --repository-name "$REPOSITORY_NAME" \
    --lifecycle-policy-text '{
        "rules": [
            {
                "rulePriority": 1,
                "description": "Keep only the last 10 dev images",
                "selection": {
                    "tagStatus": "tagged",
                    "tagPrefixList": ["dev-"],
                    "countType": "imageCountMoreThan",
                    "countNumber": 10
                },
                "action": {
                    "type": "expire"
                }
            },
            {
                "rulePriority": 2,
                "description": "Keep only the last 10 staging images",
                "selection": {
                    "tagStatus": "tagged",
                    "tagPrefixList": ["staging-"],
                    "countType": "imageCountMoreThan",
                    "countNumber": 10
                },
                "action": {
                    "type": "expire"
                }
            },
            {
                "rulePriority": 3,
                "description": "Keep last 30 production images",
                "selection": {
                    "tagStatus": "tagged",
                    "tagPrefixList": ["production-"],
                    "countType": "imageCountMoreThan",
                    "countNumber": 30
                },
                "action": {
                    "type": "expire"
                }
            },
            {
                "rulePriority": 4,
                "description": "Expire untagged images older than 7 days",
                "selection": {
                    "tagStatus": "untagged",
                    "countType": "sinceImagePushed",
                    "countUnit": "days",
                    "countNumber": 7
                },
                "action": {
                    "type": "expire"
                }
            }
        ]
    }' \
    --region "$AWS_REGION"

echo -e "${GREEN}Lifecycle policy set successfully.${NC}"

# Get authentication token for Docker
echo -e "\n${YELLOW}Generating Docker authentication token...${NC}"
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$REPO_URI" &> /dev/null

echo -e "${GREEN}Successfully authenticated Docker with ECR.${NC}"

echo -e "\n${BLUE}=======================================================${NC}"
echo -e "${GREEN}ECR repository setup completed successfully!${NC}"
echo -e "${BLUE}=======================================================${NC}"
echo -e "Repository URI: ${YELLOW}$REPO_URI${NC}"
echo -e "\nUse these commands to push your Docker image:"
echo -e "${YELLOW}docker build -t $REPO_URI:latest .${NC}"
echo -e "${YELLOW}docker push $REPO_URI:latest${NC}"
echo -e "\nAdd this to your terraform.tfvars file:"
echo -e "${YELLOW}ecr_repository_url = \"$REPO_URI\"${NC}"