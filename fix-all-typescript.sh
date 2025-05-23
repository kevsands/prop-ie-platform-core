#!/bin/bash

echo "🔧 Starting TypeScript Error Fixing Process..."
echo "================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Install dependencies if needed
echo -e "${BLUE}📦 Checking dependencies...${NC}"
npm install --save-dev ts-morph fs-extra chalk

# Create backup of current state
echo -e "${BLUE}📸 Creating backup of current TypeScript error count...${NC}"
npx tsc --noEmit --pretty false 2>&1 | grep "error TS" | wc -l > typescript-errors-before.txt
ERRORS_BEFORE=$(cat typescript-errors-before.txt)
echo -e "${YELLOW}Current TypeScript errors: ${ERRORS_BEFORE}${NC}"

# Run the main fixer
echo -e "\n${BLUE}🔧 Running main TypeScript fixer...${NC}"
node fix-typescript.js

# Run the advanced fixer
echo -e "\n${BLUE}🚀 Running advanced TypeScript fixer...${NC}"
node fix-typescript-advanced.js

# Check new error count
echo -e "\n${BLUE}📊 Checking results...${NC}"
npx tsc --noEmit --pretty false 2>&1 | grep "error TS" | wc -l > typescript-errors-after.txt
ERRORS_AFTER=$(cat typescript-errors-after.txt)

# Calculate improvement
ERRORS_FIXED=$((ERRORS_BEFORE - ERRORS_AFTER))
PERCENT_FIXED=$((ERRORS_FIXED * 100 / ERRORS_BEFORE))

echo -e "\n${GREEN}✅ TypeScript Error Fixing Complete!${NC}"
echo "================================================"
echo -e "Errors before: ${RED}${ERRORS_BEFORE}${NC}"
echo -e "Errors after: ${GREEN}${ERRORS_AFTER}${NC}"
echo -e "Errors fixed: ${YELLOW}${ERRORS_FIXED} (${PERCENT_FIXED}%)${NC}"
echo ""
echo "📄 Check the following files for details:"
echo "  - typescript-fix-report.json"
echo "  - fix-later.log"
echo ""
echo "💾 Backup created in: typescript-fix-backup-*/"

# Cleanup temp files
rm -f typescript-errors-before.txt typescript-errors-after.txt

# Offer to run type check
echo ""
read -p "Would you like to run a full type check now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run type-check || npx tsc --noEmit
fi