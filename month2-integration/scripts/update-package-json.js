#!/usr/bin/env node

/**
 * This script updates package.json to add the a11y-audit script
 */

const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add the accessibility audit script
packageJson.scripts['a11y-audit'] = 'node scripts/accessibility-audit.js';
packageJson.scripts['a11y-audit:ci'] = 'node scripts/accessibility-audit.js --ci';
packageJson.scripts['a11y-audit:fix'] = 'node scripts/accessibility-audit.js --fix';

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ Added a11y-audit scripts to package.json');