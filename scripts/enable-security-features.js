#!/usr/bin/env node

/**
 * Security Features Re-enablement Script
 * 
 * This script re-enables the security analytics and monitoring features that were
 * temporarily disabled to work around the safeCache and Amplify initialization issues.
 * 
 * Now that those underlying issues have been fixed, this script can be used to:
 * 1. Enable security analytics
 * 2. Enable security monitoring
 * 3. Remove the temporary flags entirely
 * 
 * Usage:
 *   node scripts/enable-security-features.js [--analytics | --monitoring | --all | --remove]
 * 
 * Options:
 *   --analytics: Enable only security analytics (sets ENABLE_SECURITY_ANALYTICS = true)
 *   --monitoring: Enable only security monitoring (sets ENABLE_SECURITY_MONITORING = true)
 *   --all: Enable both analytics and monitoring (default)
 *   --remove: Remove the feature flags entirely (use only after confirming everything works)
 */

const fs = require('fs');
const path = require('path');

// Security module path
const securityFilePath = path.join(
  process.cwd(),
  'src',
  'lib',
  'security',
  'index.ts'
);

// Check if file exists
if (!fs.existsSync(securityFilePath)) {
  console.error(`Error: File not found: ${securityFilePath}`);
  process.exit(1);
}

// Parse arguments
const args = process.argv.slice(2);
const enableAnalytics = args.includes('--analytics') || args.includes('--all') || (!args.length);
const enableMonitoring = args.includes('--monitoring') || args.includes('--all') || (!args.length);
const removeFlags = args.includes('--remove');

// Read the file
let content = fs.readFileSync(securityFilePath, 'utf8');

// Process the file content based on the mode
if (removeFlags) {
  // Remove the feature flags entirely
  // Find the comment block and flag declarations
  const flagPattern = /\/\*\*\s*\n\s*\*\s*TEMPORARY FIX[\s\S]*?const ENABLE_SECURITY_MONITORING\s*=\s*(false|true)\s*;/;
  
  if (flagPattern.test(content)) {
    // Replace it with an initialization of the real components directly
    content = content.replace(
      flagPattern,
      '// Security features are fully enabled by default'
    );
    
    console.log('✅ Security feature flags have been completely removed.');
  } else {
    console.error('⚠️ Could not find feature flags to remove. They may have already been removed.');
    process.exit(1);
  }
} else {
  // Update the feature flags to enable the selected components
  if (enableAnalytics) {
    // Enable Security Analytics
    content = content.replace(
      /const ENABLE_SECURITY_ANALYTICS\s*=\s*false/,
      'const ENABLE_SECURITY_ANALYTICS = true'
    );
    console.log('✅ Security Analytics enabled successfully.');
  }

  if (enableMonitoring) {
    // Enable Security Monitoring
    content = content.replace(
      /const ENABLE_SECURITY_MONITORING\s*=\s*false/,
      'const ENABLE_SECURITY_MONITORING = true'
    );
    console.log('✅ Security Monitoring enabled successfully.');
  }
}

// Write the changes back to the file
fs.writeFileSync(securityFilePath, content);

// Output final status message
if (!removeFlags) {
  console.log('\n🔒 Security features have been updated.');
  if (enableAnalytics && enableMonitoring) {
    console.log('✅ Both Security Analytics and Monitoring are now enabled.');
  } else if (enableAnalytics) {
    console.log('✅ Only Security Analytics is enabled. Security Monitoring is still disabled.');
  } else if (enableMonitoring) {
    console.log('✅ Only Security Monitoring is enabled. Security Analytics is still disabled.');
  }
  console.log('\n▶️  Next steps:');
  console.log('   1. Run the application and verify it still works correctly');
  console.log('   2. Check the security dashboard for analytics data');
  console.log('   3. Verify security monitoring is properly detecting violations');
  console.log('   4. Once confirmed working, you can remove the flags entirely:');
  console.log('      node scripts/enable-security-features.js --remove');
} else {
  console.log('\n🛡️  Security bypass has been completely removed.');
  console.log('✅ The security module is now using its default configuration with all features enabled.');
  console.log('\n▶️  Final verification:');
  console.log('   1. Run security tests: npm run test:security');
  console.log('   2. Verify the security dashboard is showing real-time data');
  console.log('   3. Check that security monitoring is properly detecting violations');
}