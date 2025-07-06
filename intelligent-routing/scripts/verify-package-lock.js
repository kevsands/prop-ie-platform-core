#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Check if package-lock.json exists
if (!fs.existsSync('package-lock.json')) {
  console.error('ERROR: package-lock.json not found. Run npm install to generate it.');
  process.exit(1);
}

// Verify package-lock.json is in sync with package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const packageLock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));

// Check lockfile version matches package.json version
if (packageJson.version !== packageLock.version) {
  console.error('ERROR: Package version mismatch between package.json and package-lock.json');
  process.exit(1);
}

// Verify all dependencies in package.json are in package-lock.json
const allDeps = {
  ...packageJson.dependencies || {},
  ...packageJson.devDependencies || {},
  ...packageJson.optionalDependencies || {}
};

let hasError = false;
Object.keys(allDeps).forEach(dep => {
  if (!packageLock.packages || !Object.keys(packageLock.packages).some(pkg => 
    pkg.includes(`node_modules/${dep}`))) {
    console.error(`ERROR: Dependency ${dep} found in package.json but not in package-lock.json`);
    hasError = true;
  }
});

if (hasError) {
  process.exit(1);
}

console.log('✅ package-lock.json is valid and in sync with package.json');
process.exit(0);