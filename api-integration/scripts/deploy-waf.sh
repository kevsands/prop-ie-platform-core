#!/bin/bash

# Deploy AWS WAF configuration
# This script deploys the WAF CloudFormation stack for the PropIE application

# Exit on error
set -e

# Configuration
ENVIRONMENT=${1:-production}
STACK_NAME="prop-ie-${ENVIRONMENT}-waf"
TEMPLATE_FILE="infrastructure/cloudformation/waf.yml"
APPLICATION_NAME="prop-ie"
REGION=${AWS_REGION:-us-east-1}
DEPLOYMENT_BUCKET="prop-ie-cfn-templates"
REQUEST_THRESHOLD="2000"
LOG_RETENTION_DAYS="90"
BLOCK_CHINA_IPS="true"
BLOCK_TOR_EXIT_NODES="true"

# API Gateway and CloudFront IDs should be fetched from existing infrastructure
API_GATEWAY_ID=$(aws apigateway get-rest-apis --query "items[?name=='${APPLICATION_NAME}-${ENVIRONMENT}-api'].id" --output text)
CLOUDFRONT_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='${APPLICATION_NAME}-${ENVIRONMENT}'].Id" --output text)

echo "Deploying WAF configuration for environment: ${ENVIRONMENT}"
echo "Using API Gateway ID: ${API_GATEWAY_ID}"
echo "Using CloudFront ID: ${CLOUDFRONT_ID}"

# Make sure we have the IDs we need
if [ -z "$API_GATEWAY_ID" ] || [ -z "$CLOUDFRONT_ID" ]; then
  echo "Error: Could not find API Gateway ID or CloudFront ID. Ensure they exist and you have proper permissions."
  exit 1
fi

# Upload template to S3
echo "Uploading CloudFormation template to S3..."
aws s3 cp ${TEMPLATE_FILE} s3://${DEPLOYMENT_BUCKET}/${ENVIRONMENT}/waf.yml

# Check if stack exists
if aws cloudformation describe-stacks --stack-name ${STACK_NAME} >/dev/null 2>&1; then
  # Update existing stack
  echo "Updating existing WAF stack: ${STACK_NAME}..."
  aws cloudformation update-stack \
    --stack-name ${STACK_NAME} \
    --template-url https://${DEPLOYMENT_BUCKET}.s3.amazonaws.com/${ENVIRONMENT}/waf.yml \
    --parameters \
      ParameterKey=Environment,ParameterValue=${ENVIRONMENT} \
      ParameterKey=ApplicationName,ParameterValue=${APPLICATION_NAME} \
      ParameterKey=RequestThreshold,ParameterValue=${REQUEST_THRESHOLD} \
      ParameterKey=APIGatewayId,ParameterValue=${API_GATEWAY_ID} \
      ParameterKey=CloudFrontId,ParameterValue=${CLOUDFRONT_ID} \
      ParameterKey=LogRetentionDays,ParameterValue=${LOG_RETENTION_DAYS} \
      ParameterKey=BlockChinaIPs,ParameterValue=${BLOCK_CHINA_IPS} \
      ParameterKey=BlockTorExitNodes,ParameterValue=${BLOCK_TOR_EXIT_NODES} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${REGION}
    
  echo "Waiting for stack update to complete..."
  aws cloudformation wait stack-update-complete --stack-name ${STACK_NAME} --region ${REGION}
else
  # Create new stack
  echo "Creating new WAF stack: ${STACK_NAME}..."
  aws cloudformation create-stack \
    --stack-name ${STACK_NAME} \
    --template-url https://${DEPLOYMENT_BUCKET}.s3.amazonaws.com/${ENVIRONMENT}/waf.yml \
    --parameters \
      ParameterKey=Environment,ParameterValue=${ENVIRONMENT} \
      ParameterKey=ApplicationName,ParameterValue=${APPLICATION_NAME} \
      ParameterKey=RequestThreshold,ParameterValue=${REQUEST_THRESHOLD} \
      ParameterKey=APIGatewayId,ParameterValue=${API_GATEWAY_ID} \
      ParameterKey=CloudFrontId,ParameterValue=${CLOUDFRONT_ID} \
      ParameterKey=LogRetentionDays,ParameterValue=${LOG_RETENTION_DAYS} \
      ParameterKey=BlockChinaIPs,ParameterValue=${BLOCK_CHINA_IPS} \
      ParameterKey=BlockTorExitNodes,ParameterValue=${BLOCK_TOR_EXIT_NODES} \
    --capabilities CAPABILITY_NAMED_IAM \
    --region ${REGION}
    
  echo "Waiting for stack creation to complete..."
  aws cloudformation wait stack-create-complete --stack-name ${STACK_NAME} --region ${REGION}
fi

# Get outputs from stack
echo "Getting WAF configuration outputs..."
aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --query "Stacks[0].Outputs" \
  --region ${REGION}

echo "WAF deployment complete!"