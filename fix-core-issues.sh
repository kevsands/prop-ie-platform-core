#!/bin/bash

# PropIE Platform Automatic Fix Script
# This script helps apply the most critical fixes to the codebase

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting PropIE Platform fix script...${NC}"

# Create backup directory
BACKUP_DIR="./fix-backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
echo -e "${GREEN}Created backup directory at:${NC} $BACKUP_DIR"

# 1. Fix missing 'use client' directives
echo -e "\n${YELLOW}Fixing missing 'use client' directives in app components...${NC}"
node add-use-client.js
echo -e "${GREEN}✓ Added 'use client' directives to client components${NC}"

# 2. Update AWS Amplify imports
echo -e "\n${YELLOW}Updating AWS Amplify imports to v6 syntax...${NC}"

# First backup the files
find ./src -type f -name "*.ts" -o -name "*.tsx" | grep -E "amplify|auth" | xargs -I{} cp {} $BACKUP_DIR/

# Update imports
find ./src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' -E 's/@aws-amplify\/auth/aws-amplify\/auth/g'
find ./src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' -E 's/@aws-amplify\/api/aws-amplify\/api/g'
find ./src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' -E 's/Auth\.signIn/signIn/g'
find ./src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' -E 's/Auth\.signOut/signOut/g'
find ./src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' -E 's/Auth\.currentAuthenticatedUser/getCurrentUser/g'
find ./src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' -E 's/Auth\.currentUserInfo/fetchUserAttributes/g'

echo -e "${GREEN}✓ Updated AWS Amplify imports to v6 syntax${NC}"

# 3. Copy fixed HomePage.tsx to its location
echo -e "\n${YELLOW}Ensuring HomePage.tsx has the latest fixes...${NC}"
cp -f ./backup-files/HomePage.tsx ./src/components/HomePage.tsx
echo -e "${GREEN}✓ Updated HomePage.tsx with fixed version${NC}"

# 4. Type definitions fixes
echo -e "\n${YELLOW}Updating type definitions...${NC}"

# Make sure the developments.ts type has required fields
grep -q "price:" ./src/types/developments.ts
if [ $? -ne 0 ]; then
    cp ./src/types/developments.ts $BACKUP_DIR/
    # This is a simplified approach - the actual fix should be more precise
    sed -i '' -E 's/floorPlans\?: Array<{/floorPlans\?: Array<{\n    price: string;/g' ./src/types/developments.ts
    echo -e "${GREEN}✓ Added price field to floorPlans type in developments.ts${NC}"
else
    echo -e "${GREEN}✓ Price field already exists in developments.ts${NC}"
fi

# Check for mapLocation
grep -q "mapLocation?" ./src/types/developments.ts
if [ $? -ne 0 ]; then
    cp ./src/types/developments.ts $BACKUP_DIR/
    # This is a simplified approach - the actual fix should be more precise
    sed -i '' -E 's/export interface Development {/export interface Development {\n  mapLocation?: {\n    lat: number;\n    lng: number;\n  };/g' ./src/types/developments.ts
    echo -e "${GREEN}✓ Added mapLocation field to Development interface in developments.ts${NC}"
else
    echo -e "${GREEN}✓ mapLocation field already exists in developments.ts${NC}"
fi

# 5. Fix JSX errors in property components by fixing unclosed tags
echo -e "\n${YELLOW}Checking for unclosed tags in property components...${NC}"
# This requires a more sophisticated approach - just flagging the files for now
grep -l -r "<div" --include="*.tsx" ./src/components/property | xargs grep -L "</div>" || true

echo -e "\n${YELLOW}Run build to verify fixes:${NC} npm run build"
echo -e "${YELLOW}Check the FIXES.md file for a complete list of issues and the fix plan.${NC}"
echo -e "${GREEN}Fix script completed!${NC}"