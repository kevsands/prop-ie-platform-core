#!/bin/bash

# =============================================================================
# PropIE Platform - AWS Deployment Readiness Verification
# =============================================================================
# This script verifies that all components are ready for AWS production deployment
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 PropIE Platform - AWS Deployment Readiness Check${NC}"
echo -e "${BLUE}======================================================${NC}"
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

# Track results
passed=0
failed=0
warnings=0

# Check 1: AWS CLI Configuration
echo -e "${BLUE}1. Checking AWS CLI Configuration...${NC}"
if command -v aws &> /dev/null; then
    if aws sts get-caller-identity &> /dev/null; then
        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        REGION=$(aws configure get region)
        print_status "AWS CLI configured (Account: $ACCOUNT_ID, Region: $REGION)"
        ((passed++))
    else
        print_error "AWS CLI not authenticated. Run 'aws configure'"
        ((failed++))
    fi
else
    print_error "AWS CLI not installed"
    ((failed++))
fi

# Check 2: Project Structure
echo ""
echo -e "${BLUE}2. Validating Project Structure...${NC}"

required_files=(
    "package.json"
    "next.config.js"
    "amplify.yml"
    "src/app/page.tsx"
    "prisma/schema-unified.prisma"
    ".env.production.deploy"
    "deploy-aws-production.sh"
    "AWS_DEPLOYMENT_GUIDE.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "Found $file"
        ((passed++))
    else
        print_error "Missing $file"
        ((failed++))
    fi
done

# Check 3: Node.js and Dependencies
echo ""
echo -e "${BLUE}3. Checking Node.js Environment...${NC}"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -ge "18" ]; then
        print_status "Node.js version $NODE_VERSION (compatible)"
        ((passed++))
    else
        print_error "Node.js version $NODE_VERSION is too old (need 18+)"
        ((failed++))
    fi
else
    print_error "Node.js not installed"
    ((failed++))
fi

if [ -d "node_modules" ]; then
    print_status "Dependencies installed"
    ((passed++))
else
    print_warning "Dependencies not installed. Run 'npm ci'"
    ((warnings++))
fi

# Check 4: Environment Configuration
echo ""
echo -e "${BLUE}4. Validating Environment Configuration...${NC}"

if [ -f ".env.production.deploy" ]; then
    # Check for required environment variables
    required_vars=(
        "NEXT_PUBLIC_APP_ENV"
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "NEXT_PUBLIC_AWS_REGION"
    )
    
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env.production.deploy; then
            print_status "Environment variable $var configured"
            ((passed++))
        else
            print_error "Missing environment variable $var"
            ((failed++))
        fi
    done
else
    print_error "Production environment file missing"
    ((failed++))
fi

# Check 5: Build Configuration
echo ""
echo -e "${BLUE}5. Checking Build Configuration...${NC}"

if grep -q "build:prod" package.json; then
    print_status "Production build script configured"
    ((passed++))
else
    print_warning "Production build script not found"
    ((warnings++))
fi

if [ -f "amplify.yml" ]; then
    if grep -q "npm run build:prod" amplify.yml; then
        print_status "Amplify build configuration correct"
        ((passed++))
    else
        print_warning "Amplify build configuration may need updating"
        ((warnings++))
    fi
fi

# Check 6: Security Configuration
echo ""
echo -e "${BLUE}6. Validating Security Configuration...${NC}"

if grep -q "Strict-Transport-Security" next.config.js || grep -q "Strict-Transport-Security" amplify.yml; then
    print_status "Security headers configured"
    ((passed++))
else
    print_warning "Security headers may not be configured"
    ((warnings++))
fi

if grep -q "Content-Security-Policy" next.config.js || grep -q "Content-Security-Policy" amplify.yml; then
    print_status "Content Security Policy configured"
    ((passed++))
else
    print_warning "Content Security Policy may not be configured"
    ((warnings++))
fi

# Check 7: Performance Optimization
echo ""
echo -e "${BLUE}7. Checking Performance Optimizations...${NC}"

performance_files=(
    "src/lib/cache/realTimeCacheManager.ts"
    "src/lib/realtime/connectionPoolManager.ts"
    "src/lib/performance/performanceOptimizationService.ts"
)

for file in "${performance_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "Performance optimization: $(basename $file)"
        ((passed++))
    else
        print_warning "Performance optimization missing: $(basename $file)"
        ((warnings++))
    fi
done

# Check 8: Database Configuration
echo ""
echo -e "${BLUE}8. Validating Database Configuration...${NC}"

if [ -f "prisma/schema-unified.prisma" ]; then
    if grep -q "provider.*postgresql" prisma/schema-unified.prisma; then
        print_status "PostgreSQL database provider configured"
        ((passed++))
    else
        print_warning "Database provider may not be PostgreSQL"
        ((warnings++))
    fi
    
    if npx prisma validate --schema=./prisma/schema-unified.prisma &> /dev/null; then
        print_status "Database schema is valid"
        ((passed++))
    else
        print_error "Database schema validation failed"
        ((failed++))
    fi
else
    print_error "Database schema file missing"
    ((failed++))
fi

# Check 9: Deployment Scripts
echo ""
echo -e "${BLUE}9. Checking Deployment Scripts...${NC}"

if [ -f "deploy-aws-production.sh" ] && [ -x "deploy-aws-production.sh" ]; then
    print_status "AWS deployment script ready"
    ((passed++))
else
    print_error "AWS deployment script missing or not executable"
    ((failed++))
fi

if [ -f "validate-production-readiness.js" ] && [ -x "validate-production-readiness.js" ]; then
    print_status "Production readiness validator ready"
    ((passed++))
else
    print_warning "Production readiness validator missing"
    ((warnings++))
fi

# Calculate results
echo ""
echo -e "${BLUE}📊 Deployment Readiness Summary${NC}"
echo "================================="

total_checks=$((passed + failed + warnings))
readiness_score=$((passed * 100 / (passed + failed)))

echo "Total Checks: $total_checks"
echo -e "${GREEN}Passed: $passed${NC}"
echo -e "${RED}Failed: $failed${NC}"
echo -e "${YELLOW}Warnings: $warnings${NC}"
echo ""
echo "Readiness Score: $readiness_score%"

# Deployment recommendation
if [ $failed -eq 0 ] && [ $readiness_score -ge 90 ]; then
    echo ""
    echo -e "${GREEN}🚀 READY FOR DEPLOYMENT${NC}"
    echo "The PropIE platform is ready for AWS production deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./deploy-aws-production.sh"
    echo "2. Monitor deployment in AWS Amplify Console"
    echo "3. Configure custom domain (optional)"
    echo "4. Set up production monitoring"
    
    exit 0
elif [ $failed -eq 0 ] && [ $readiness_score -ge 75 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  PROCEED WITH CAUTION${NC}"
    echo "The platform is mostly ready but has some warnings."
    echo "Consider addressing warnings before deployment."
    
    exit 1
else
    echo ""
    echo -e "${RED}🚫 NOT READY FOR DEPLOYMENT${NC}"
    echo "Please fix the failed checks before deploying to production."
    
    exit 1
fi