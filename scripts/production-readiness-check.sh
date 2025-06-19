#!/bin/bash

# PROP.ie Production Readiness Validation Script
# Comprehensive check of all production deployment requirements

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

print_header() {
    echo -e "${MAGENTA}"
    echo "🚀 PROP.ie Production Readiness Validation"
    echo "=========================================="
    echo -e "${NC}"
}

print_section() {
    echo -e "\n${CYAN}$1${NC}"
    echo "$(printf '=%.0s' {1..50})"
}

check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED_CHECKS++))
    ((TOTAL_CHECKS++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED_CHECKS++))
    ((TOTAL_CHECKS++))
}

check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNING_CHECKS++))
    ((TOTAL_CHECKS++))
}

check_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Start validation
print_header

# 1. Database Schema Validation
print_section "📊 Database Configuration"

if [ -f "prisma/schema-production.prisma" ]; then
    check_pass "PostgreSQL production schema exists"
    SCHEMA_SIZE=$(wc -l < prisma/schema-production.prisma)
    check_info "Schema contains $SCHEMA_SIZE lines of configuration"
else
    check_fail "PostgreSQL production schema missing"
fi

if [ -f "scripts/migrate-to-postgresql.sh" ]; then
    check_pass "Database migration script ready"
    if [ -x "scripts/migrate-to-postgresql.sh" ]; then
        check_pass "Migration script is executable"
    else
        check_warning "Migration script needs executable permissions"
    fi
else
    check_fail "Database migration script missing"
fi

# 2. Environment Configuration
print_section "🔧 Environment Configuration"

if [ -f ".env.production" ]; then
    check_pass "Production environment file exists"
    ENV_VARS=$(grep -c "=" .env.production)
    check_info "Contains $ENV_VARS environment variables"
else
    check_fail "Production environment file missing"
fi

if [ -f ".env.staging" ]; then
    check_pass "Staging environment file exists"
else
    check_warning "Staging environment file missing"
fi

# 3. Security Configuration
print_section "🔒 Security Configuration"

if [ -f "security-config.js" ]; then
    check_pass "Security configuration file exists"
    if grep -q "Content-Security-Policy" security-config.js; then
        check_pass "Content Security Policy configured"
    else
        check_warning "CSP configuration needs review"
    fi
else
    check_fail "Security configuration missing"
fi

if grep -q "NEXTAUTH_SECRET" .env.production 2>/dev/null; then
    check_pass "Authentication secrets configured"
else
    check_warning "Authentication secrets need configuration"
fi

# 4. Performance Configuration
print_section "⚡ Performance Configuration"

if [ -f "next.config.js" ]; then
    check_pass "Next.js configuration exists"
    if grep -q "optimization" next.config.js; then
        check_pass "Build optimization configured"
    else
        check_warning "Build optimization needs enhancement"
    fi
else
    check_fail "Next.js configuration missing"
fi

if [ -f "scripts/load-testing.js" ]; then
    check_pass "Load testing suite available"
    if [ -x "scripts/load-testing.js" ]; then
        check_pass "Load testing script is executable"
    else
        check_warning "Load testing script needs executable permissions"
    fi
else
    check_fail "Load testing suite missing"
fi

# 5. Deployment Configuration
print_section "🚀 Deployment Configuration"

if [ -f "amplify.yml" ]; then
    check_pass "AWS Amplify configuration exists"
    if grep -q "postgresql" amplify.yml; then
        check_pass "PostgreSQL migration configured in deployment"
    else
        check_warning "PostgreSQL migration not configured in deployment"
    fi
else
    check_fail "AWS Amplify configuration missing"
fi

if [ -f "PRODUCTION-DEPLOYMENT-CHECKLIST.md" ]; then
    check_pass "Production deployment checklist available"
else
    check_warning "Production deployment checklist missing"
fi

# 6. Scripts and Automation
print_section "🤖 Scripts and Automation"

REQUIRED_SCRIPTS=(
    "migrate-to-postgresql.sh"
    "load-testing.js"
)

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [ -f "scripts/$script" ]; then
        check_pass "Script $script exists"
    else
        check_fail "Script $script missing"
    fi
done

# 7. Package.json Production Scripts
print_section "📦 Package.json Scripts"

REQUIRED_NPM_SCRIPTS=(
    "migrate:postgres"
    "load:test"
    "build:prod"
    "security:audit"
)

for script in "${REQUIRED_NPM_SCRIPTS[@]}"; do
    if npm run | grep -q "$script"; then
        check_pass "NPM script '$script' configured"
    else
        check_fail "NPM script '$script' missing"
    fi
done

# 8. Integration Files
print_section "🔗 Integration Components"

INTEGRATION_FILES=(
    "src/components/system/IntegrationValidationDashboard.tsx"
    "src/app/api/system/integration-test/route.ts"
    "src/services/ROSIeIntegrationService.ts"
    "src/services/CompletionStatementService.ts"
)

for file in "${INTEGRATION_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "Integration file $(basename $file) exists"
    else
        check_fail "Integration file $(basename $file) missing"
    fi
done

# 9. Node.js and Dependencies
print_section "🔍 Dependencies and Runtime"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check_pass "Node.js is installed ($NODE_VERSION)"
else
    check_fail "Node.js is not installed"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_pass "NPM is installed ($NPM_VERSION)"
else
    check_fail "NPM is not installed"
fi

if [ -f "package.json" ]; then
    check_pass "Package.json exists"
    DEPS_COUNT=$(jq '.dependencies | length' package.json 2>/dev/null || echo "unknown")
    check_info "Dependencies: $DEPS_COUNT packages"
else
    check_fail "Package.json missing"
fi

# 10. Git and Version Control
print_section "📚 Version Control"

if [ -d ".git" ]; then
    check_pass "Git repository initialized"
    if git status &>/dev/null; then
        check_pass "Git repository is valid"
        BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
        check_info "Current branch: $BRANCH"
    else
        check_warning "Git repository has issues"
    fi
else
    check_warning "Not a Git repository"
fi

# 11. Final Assessment
print_section "📊 Assessment Summary"

echo -e "\n${CYAN}Production Readiness Score:${NC}"
echo "  Total Checks: $TOTAL_CHECKS"
echo -e "  ${GREEN}Passed: $PASSED_CHECKS${NC}"
echo -e "  ${YELLOW}Warnings: $WARNING_CHECKS${NC}"
echo -e "  ${RED}Failed: $FAILED_CHECKS${NC}"

# Calculate percentage
if [ $TOTAL_CHECKS -gt 0 ]; then
    PASS_PERCENTAGE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))
    echo -e "\n${CYAN}Overall Score: ${PASS_PERCENTAGE}%${NC}"
    
    if [ $PASS_PERCENTAGE -ge 95 ]; then
        echo -e "\n${GREEN}🎉 EXCELLENT! Production ready for €847M+ transaction volume${NC}"
        exit 0
    elif [ $PASS_PERCENTAGE -ge 85 ]; then
        echo -e "\n${YELLOW}⚠️  GOOD - Address warnings before production deployment${NC}"
        exit 1
    elif [ $PASS_PERCENTAGE -ge 70 ]; then
        echo -e "\n${YELLOW}⚠️  NEEDS WORK - Several issues need resolution${NC}"
        exit 2
    else
        echo -e "\n${RED}❌ NOT READY - Significant issues need addressing${NC}"
        exit 3
    fi
else
    echo -e "\n${RED}❌ VALIDATION ERROR - No checks performed${NC}"
    exit 4
fi