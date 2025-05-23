#!/usr/bin/env node
// Fix critical dependencies

const fs = require('fs');
const { execSync } = require('child_process');

console.log('Fixing critical dependencies...\n');

// Update specific vulnerable packages
const updates = [
  'cookie@latest',
  'esbuild@latest',
  'got@latest',
  'lodash@latest'
];

updates.forEach(pkg => {
  console.log(`Updating ${pkg}...`);
  try {
    execSync(`npm install ${pkg} --save-exact --legacy-peer-deps`, { stdio: 'inherit' });
    console.log(`✅ Updated ${pkg}`);
  } catch (error) {
    console.log(`⚠️ Failed to update ${pkg}`);
  }
});

// Remove vulnerable packages if not needed
const toRemove = ['libxmljs2', '@cyclonedx/cyclonedx-npm'];
toRemove.forEach(pkg => {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.dependencies && packageJson.dependencies[pkg]) {
      console.log(`Removing ${pkg}...`);
      execSync(`npm uninstall ${pkg}`, { stdio: 'inherit' });
      console.log(`✅ Removed ${pkg}`);
    }
  } catch (error) {
    // Package not installed, ignore
  }
});

console.log('\nCompleted security fixes!');