#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 Starting Security Updates...\n');

// Critical security updates needed
const criticalUpdates = {
  // Remove vulnerable version of lighthouse-ci
  'lighthouse-ci': null,
  // Update AWS packages
  '@aws-amplify/api': '^6.3.11',
  '@aws-amplify/auth': '^6.12.4',
  '@aws-amplify/core': '^6.11.4',
  '@aws-amplify/storage': '^6.8.4',
  'aws-amplify': '^6.14.4',
  // Update critical dependencies
  'cookie': '^0.7.0',
  'got': '^11.8.5',
  'esbuild': '^0.24.3',
  // Update React and related
  'next': '^15.3.2',
  'react': '18.3.1', // Stay on React 18 for stability
  'react-dom': '18.3.1',
};

// Read current package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Update dependencies
Object.entries(criticalUpdates).forEach(([pkg, version]) => {
  if (version === null) {
    // Remove package
    delete packageJson.dependencies[pkg];
    delete packageJson.devDependencies[pkg];
    console.log(`❌ Removed vulnerable package: ${pkg}`);
  } else {
    // Update package
    if (packageJson.dependencies[pkg]) {
      packageJson.dependencies[pkg] = version;
      console.log(`✅ Updated ${pkg} to ${version}`);
    } else if (packageJson.devDependencies[pkg]) {
      packageJson.devDependencies[pkg] = version;
      console.log(`✅ Updated ${pkg} to ${version} (dev)`);
    }
  }
});

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('\n📝 Updated package.json');

// Clean install
console.log('\n🧹 Cleaning node_modules and package-lock.json...');
try {
  execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to clean:', error.message);
}

console.log('\n📦 Installing packages...');
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install:', error.message);
  process.exit(1);
}

console.log('\n🔍 Running security audit...');
try {
  execSync('npm audit', { stdio: 'inherit' });
} catch (error) {
  // npm audit returns non-zero exit code if vulnerabilities found
  console.log('Security vulnerabilities remain. Manual intervention may be required.');
}

console.log('\n✅ Security update process complete!');