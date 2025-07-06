#!/bin/bash

# Exit on any error
set -e

echo "📊 Starting bundle analysis..."

# Check if ANALYZE environment variable is already set
if [ -z "${ANALYZE}" ]; then
  export ANALYZE=true
fi

# Make sure the analysis directory exists
mkdir -p .next/analyze

# Build the application with bundle analyzer
echo "🔨 Building application with bundle analyzer..."
ANALYZE=true NODE_ENV=production npm run build

# Generate a timestamp for the report
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
REPORT_DIR=".next/analyze/report_${TIMESTAMP}"

# Create a directory for this report
mkdir -p "${REPORT_DIR}"

# Copy the bundle analyzer stats
echo "📋 Generating bundle report..."
cp -r .next/analyze/*.html "${REPORT_DIR}/"

# Run the report generator if it exists
if [ -f "scripts/generate-bundle-report.js" ]; then
  echo "📝 Running bundle report generator..."
  node scripts/generate-bundle-report.js
fi

# Generate a bundle summary
echo "📝 Creating bundle summary..."
{
  echo "# Bundle Analysis Report (${TIMESTAMP})"
  echo ""
  echo "## Summary"
  echo ""
  echo "| Metric | Value |"
  echo "|--------|-------|"
  
  # Extract total bundle size if stats.json exists
  if [ -f ".next/analyze/client.html" ]; then
    echo "| Client bundle | ✅ Generated |"
  else
    echo "| Client bundle | ❌ Not found |"
  fi
  
  if [ -f ".next/analyze/server.html" ]; then
    echo "| Server bundle | ✅ Generated |"
  else
    echo "| Server bundle | ❌ Not found |"
  fi
  
  # Check for specific patterns in the bundle
  if [ -f ".next/analyze/client.html" ]; then
    echo ""
    echo "## Large Dependencies"
    echo ""
    echo "Check the bundle analyzer report for detailed information on large dependencies."
    echo ""
    echo "## Recommendations"
    echo ""
    echo "1. Review any large dependencies and consider alternatives"
    echo "2. Implement code splitting for large components"
    echo "3. Use dynamic imports for routes and features not needed immediately"
    echo "4. Analyze tree-shaking effectiveness for large libraries"
  fi
} > "${REPORT_DIR}/summary.md"

# Show the report location
echo "✅ Bundle analysis complete!"
echo "📁 Reports saved to: ${REPORT_DIR}"
echo "📊 Open the HTML files in a browser to view detailed bundle visualization"
echo "📝 Summary available in: ${REPORT_DIR}/summary.md"