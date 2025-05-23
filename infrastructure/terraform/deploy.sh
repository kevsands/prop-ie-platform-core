#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Usage information
function show_usage {
  echo -e "${BLUE}Usage:${NC} $0 [options]"
  echo -e ""
  echo -e "${BLUE}Options:${NC}"
  echo -e "  --help         Show this help message"
  echo -e "  --init         Initialize Terraform (required for first run)"
  echo -e "  --plan         Generate execution plan only (no apply)"
  echo -e "  --apply        Apply changes without showing plan"
  echo -e "  --destroy      Destroy all resources"
  echo -e "  --env=ENV      Set environment (dev/staging/production)"
  echo -e "  --auto-approve Skip approval prompt for apply/destroy"
  echo -e ""
  echo -e "${BLUE}Examples:${NC}"
  echo -e "  $0 --init --env=dev        # Initialize Terraform for dev environment"
  echo -e "  $0 --plan --env=staging    # Show plan for staging environment"
  echo -e "  $0 --env=production        # Plan and apply for production environment"
  echo -e "  $0 --destroy --env=dev     # Destroy dev environment resources"
  exit 1
}

# Initialize variables
INIT=false
PLAN=false
APPLY=false
DESTROY=false
AUTO_APPROVE=""
ENV="production"
BACKEND_CONFIG_FILE=""

# Parse command line arguments
for arg in "$@"; do
  case $arg in
    --help)
      show_usage
      ;;
    --init)
      INIT=true
      ;;
    --plan)
      PLAN=true
      ;;
    --apply)
      APPLY=true
      ;;
    --destroy)
      DESTROY=true
      ;;
    --auto-approve)
      AUTO_APPROVE="-auto-approve"
      ;;
    --env=*)
      ENV="${arg#*=}"
      ;;
    *)
      echo -e "${RED}Error: Unknown option '$arg'${NC}"
      show_usage
      ;;
  esac
done

# Check if backend config file exists for the environment
if [ -f "backend-${ENV}.conf" ]; then
  BACKEND_CONFIG_FILE="-backend-config=backend-${ENV}.conf"
  echo -e "${GREEN}Using backend configuration for ${ENV} environment${NC}"
else
  echo -e "${YELLOW}Warning: No backend configuration found for ${ENV} environment${NC}"
  echo -e "${YELLOW}Will use default backend settings or prompt during initialization${NC}"
fi

# Create or select workspace based on environment
function setup_workspace {
  # Check if workspace exists
  if terraform workspace list | grep -q "$ENV"; then
    echo -e "${GREEN}Selecting workspace: ${ENV}${NC}"
    terraform workspace select "$ENV"
  else
    echo -e "${GREEN}Creating new workspace: ${ENV}${NC}"
    terraform workspace new "$ENV"
  fi
}

# Initialize Terraform if requested
if [ "$INIT" = true ]; then
  echo -e "${GREEN}Initializing Terraform...${NC}"
  if [ -n "$BACKEND_CONFIG_FILE" ]; then
    terraform init $BACKEND_CONFIG_FILE
  else
    terraform init
  fi
  setup_workspace
fi

# Select tfvars file based on environment
TFVARS_FILE="terraform.tfvars"
if [ "$ENV" != "production" ] && [ -f "terraform-${ENV}.tfvars" ]; then
  TFVARS_FILE="terraform-${ENV}.tfvars"
fi
echo -e "${GREEN}Using variables from: ${TFVARS_FILE}${NC}"

# Check if workspace is set
if [ "$INIT" = false ]; then
  # Ensure we're in the right workspace
  setup_workspace
fi

# Handle Terraform operations
if [ "$DESTROY" = true ]; then
  echo -e "${RED}WARNING: You are about to DESTROY all resources in the ${ENV} environment!${NC}"
  echo -e "${RED}This action cannot be easily undone.${NC}"
  
  if [ -z "$AUTO_APPROVE" ]; then
    read -p "Are you absolutely sure you want to continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
      echo -e "${GREEN}Destroy operation cancelled.${NC}"
      exit 0
    fi
  fi
  
  echo -e "${YELLOW}Destroying all resources...${NC}"
  terraform destroy $AUTO_APPROVE -var-file="$TFVARS_FILE"
  
elif [ "$PLAN" = true ]; then
  echo -e "${GREEN}Generating Terraform execution plan...${NC}"
  terraform plan -var-file="$TFVARS_FILE"
  
elif [ "$APPLY" = true ]; then
  echo -e "${GREEN}Applying Terraform changes...${NC}"
  terraform apply $AUTO_APPROVE -var-file="$TFVARS_FILE"
  
else
  # Default behavior: plan and then apply if confirmed
  echo -e "${GREEN}Generating Terraform execution plan...${NC}"
  terraform plan -var-file="$TFVARS_FILE"
  
  if [ -z "$AUTO_APPROVE" ]; then
    read -p "Do you want to apply these changes? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
      echo -e "${GREEN}Apply operation cancelled.${NC}"
      exit 0
    fi
  fi
  
  echo -e "${GREEN}Applying Terraform changes...${NC}"
  terraform apply $AUTO_APPROVE -var-file="$TFVARS_FILE"
fi

echo -e "${GREEN}Operation completed successfully.${NC}"