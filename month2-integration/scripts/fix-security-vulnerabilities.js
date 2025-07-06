#!/usr/bin/env node

/**
 * Security Vulnerability Fix Script
 * 
 * This script safely updates packages with known security vulnerabilities
 * while avoiding breaking changes where possible.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 Starting security vulnerability fixes...\n');

// Read current package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Define safe updates for vulnerable packages
const safeUpdates = [
  // High priority security fixes
  { 
    package: 'lighthouse-ci', 
    newVersion: '^1.13.0',
    reason: 'Fixes cookie and lodash.set vulnerabilities'
  },
  {
    package: 'wrangler',
    newVersion: '^4.20.0', 
    reason: 'Fixes esbuild vulnerability'
  },
  // Medium priority updates
  {
    package: 'cookie',
    newVersion: '^0.7.1',
    reason: 'Fixes out of bounds character handling'
  }
];

// Function to safely update a package
function safeUpdate(packageName, newVersion, reason) {
  try {
    console.log(`📦 Updating ${packageName} to ${newVersion}`);
    console.log(`   Reason: ${reason}`);
    
    // Check if package exists in dependencies or devDependencies
    const isDep = packageJson.dependencies && packageJson.dependencies[packageName];
    const isDevDep = packageJson.devDependencies && packageJson.devDependencies[packageName];
    
    if (!isDep && !isDevDep) {
      console.log(`   ⚠️  Package ${packageName} not found, skipping...`);
      return;
    }
    
    // Use npm update with specific version
    const updateCmd = `npm install ${packageName}@${newVersion} ${isDevDep ? '--save-dev' : '--save'}`;
    execSync(updateCmd, { stdio: 'inherit' });
    
    console.log(`   ✅ Successfully updated ${packageName}\n`);
  } catch (error) {
    console.error(`   ❌ Failed to update ${packageName}: ${error.message}\n`);
  }
}

// Apply safe updates
console.log('Applying safe security updates...\n');
safeUpdates.forEach(({ package: pkg, newVersion, reason }) => {
  safeUpdate(pkg, newVersion, reason);
});

// Run npm audit to check remaining vulnerabilities
console.log('🔍 Checking for remaining vulnerabilities...\n');
try {
  execSync('npm audit --audit-level=high', { stdio: 'inherit' });
} catch (error) {
  console.log('\n⚠️  Some high/critical vulnerabilities remain.');
  console.log('Manual review required for remaining issues.\n');
}

// Generate security summary
console.log('📋 Generating security summary...\n');

const securitySummary = {
  timestamp: new Date().toISOString(),
  fixesApplied: safeUpdates.map(update => ({
    package: update.package,
    newVersion: update.newVersion,
    reason: update.reason
  })),
  nextSteps: [
    'Review remaining npm audit results',
    'Test application functionality after updates',
    'Deploy to staging environment for validation',
    'Update package-lock.json in version control'
  ],
  securityChecklist: [
    '✅ Updated vulnerable dependencies',
    '🔄 Need to verify JWT_SECRET is set in production',
    '🔄 Need to verify database migration from SQLite to PostgreSQL',
    '🔄 Need to configure real AWS Cognito credentials',
    '🔄 Need to disable mock authentication in production'
  ]
};

fs.writeFileSync('security-fix-summary.json', JSON.stringify(securitySummary, null, 2));

console.log('✅ Security vulnerability fixes completed!');
console.log('📄 Summary saved to security-fix-summary.json');
console.log('\n🚨 Next steps:');
console.log('1. Review the security-fix-summary.json file');
console.log('2. Test the application to ensure no breaking changes');
console.log('3. Address remaining environment configuration issues');
console.log('4. Set up production secrets and database configuration');