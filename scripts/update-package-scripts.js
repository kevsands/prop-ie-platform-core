#!/usr/bin/env node

/**
 * This script updates package.json with scripts to run the coverage dashboard
 */

const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add or update scripts
packageJson.scripts = packageJson.scripts || {};

// Add coverage dashboard scripts
packageJson.scripts['coverage:dashboard'] = 'node scripts/coverage-dashboard.js';
packageJson.scripts['coverage:dashboard:save'] = 'node scripts/coverage-dashboard.js --save';
packageJson.scripts['test:with-dashboard'] = 'npm test -- --coverage && npm run coverage:dashboard:save';

// Add CI script that includes the dashboard
packageJson.scripts['ci:test'] = packageJson.scripts['ci:test'] || 'npm test -- --coverage';
packageJson.scripts['ci:test'] = packageJson.scripts['ci:test'] + ' && npm run coverage:dashboard:save';

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ Package.json updated with coverage dashboard scripts:');
console.log('  - coverage:dashboard - Generate dashboard without saving history');
console.log('  - coverage:dashboard:save - Generate dashboard and save to history');
console.log('  - test:with-dashboard - Run tests with coverage and generate dashboard');
console.log('  - ci:test - Updated to include dashboard generation');