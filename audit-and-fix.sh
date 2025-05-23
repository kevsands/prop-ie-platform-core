#!/bin/bash
# TypeScript Error Audit and Fix Orchestrator
# This script manages the entire error audit, tracking, and fixing process

set -e  # Exit on error

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}"
echo "================================================="
echo "  TypeScript Error Audit and Fix Orchestrator"
echo "================================================="
echo -e "${NC}"

# Create necessary directories
mkdir -p error-reports
mkdir -p error-history
mkdir -p error-fix-backups

# Function to show help
show_help() {
  echo -e "${YELLOW}Usage:${NC}"
  echo "  $0 [options]"
  echo ""
  echo -e "${YELLOW}Options:${NC}"
  echo "  --help        Show this help message"
  echo "  --audit-only  Only run the error audit without fixing"
  echo "  --track-only  Only update the error tracking without fixing"
  echo "  --fix-only    Only run the error fixes without audit or tracking"
  echo "  --dry-run     Run fixes in dry-run mode (no changes applied)"
  echo ""
  echo -e "${YELLOW}Examples:${NC}"
  echo "  $0             # Run full audit, tracking and fixes"
  echo "  $0 --audit-only # Only analyze errors"
  echo "  $0 --fix-only --dry-run # Test fixes without applying them"
}

# Parse arguments
AUDIT=true
TRACK=true
FIX=true
DRY_RUN=""

for arg in "$@"; do
  case $arg in
    --help)
      show_help
      exit 0
      ;;
    --audit-only)
      TRACK=false
      FIX=false
      ;;
    --track-only)
      AUDIT=false
      FIX=false
      ;;
    --fix-only)
      AUDIT=false
      TRACK=false
      ;;
    --dry-run)
      DRY_RUN="--dry-run"
      ;;
  esac
done

# Function to print section header
print_section() {
  echo -e "\n${GREEN}$1${NC}"
  echo -e "${GREEN}$(printf '=%.0s' $(seq 1 ${#1}))${NC}\n"
}

# Step 1: Run the error audit
if [ "$AUDIT" = true ]; then
  print_section "Running TypeScript Error Audit"
  node scripts/error-audit.js
  
  # Check if audit was successful
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error audit failed!${NC}"
    exit 1
  fi
fi

# Step 2: Update error tracking
if [ "$TRACK" = true ]; then
  print_section "Updating Error Progress Tracking"
  node scripts/error-track-progress.js
  
  # Check if tracking was successful
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error tracking failed!${NC}"
    exit 1
  fi
fi

# Step 3: Run error fixes
if [ "$FIX" = true ]; then
  print_section "Running Automated Error Fixes"
  
  # Show warning for dry run mode
  if [ -n "$DRY_RUN" ]; then
    echo -e "${YELLOW}⚠️  Running in DRY RUN mode - no files will be modified${NC}\n"
  fi
  
  node scripts/fix-common-errors.js $DRY_RUN
  
  # Check if fixes were successful
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error fixes failed!${NC}"
    exit 1
  fi
fi

# Final summary
print_section "TypeScript Error Audit and Fix Complete"

# Show results summary
if [ -f "error-reports/summary.json" ]; then
  TOTAL_ERRORS=$(grep -o '"totalErrors": [0-9]*' error-reports/summary.json | grep -o '[0-9]*')
  FILES_WITH_ERRORS=$(grep -o '"fileCount": [0-9]*' error-reports/summary.json | grep -o '[0-9]*')
  
  echo -e "Current status:"
  echo -e "  ${YELLOW}$TOTAL_ERRORS${NC} total TypeScript errors in ${YELLOW}$FILES_WITH_ERRORS${NC} files"
  
  # Show progress if tracking file exists
  if [ -f "error-history/progress-history.json" ]; then
    ENTRIES=$(grep -o '"timestamp"' error-history/progress-history.json | wc -l)
    if [ $ENTRIES -gt 1 ]; then
      echo -e "  Progress tracking has ${YELLOW}$ENTRIES${NC} historical data points"
      echo -e "  See ${BLUE}error-history/progress-summary.md${NC} for detailed progress report"
    fi
  fi
  
  echo ""
  echo -e "Reports and documentation:"
  echo -e "  - ${BLUE}error-reports/summary.md${NC} - Current error summary"
  echo -e "  - ${BLUE}error-reports/fix-plan-*.md${NC} - Fix plans by category"
  echo -e "  - ${BLUE}error-history/progress-summary.md${NC} - Progress tracking"
fi

# Next steps
echo -e "\n${YELLOW}Next steps:${NC}"
echo "  1. Review error reports in the error-reports directory"
echo "  2. Run with --fix-only after reviewing the fix plans"
echo "  3. Run periodically to track progress"
echo "  4. After applying fixes, run a TypeScript check to validate improvements:"
echo "     npm run type-check"
echo ""

# Make script executable
chmod +x "audit-and-fix.sh"