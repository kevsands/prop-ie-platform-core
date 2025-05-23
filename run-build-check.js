#!/usr/bin/env node
// Quick build check

const { execSync } = require('child_process');

console.log('Running build check...\n');

try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build successful!');
} catch (error) {
  const output = error.stdout ? error.stdout.toString() : '';
  const stderr = error.stderr ? error.stderr.toString() : '';
  
  // Extract module not found errors
  const moduleErrors = output.match(/Module not found: Can't resolve '([^']+)'/g) || [];
  const missingModules = moduleErrors.map(err => err.match(/'([^']+)'/)[1]);
  
  if (missingModules.length > 0) {
    console.log('Missing modules:');
    missingModules.forEach(mod => console.log(`- ${mod}`));
    
    console.log('\nInstalling missing modules...');
    const uniqueModules = [...new Set(missingModules)];
    try {
      execSync(`npm install ${uniqueModules.join(' ')} --legacy-peer-deps`, { stdio: 'inherit' });
      console.log('✅ Installed missing modules');
    } catch (installError) {
      console.log('❌ Failed to install some modules');
    }
  } else {
    console.log('❌ Build failed with errors:\n');
    console.log(output);
    console.log(stderr);
  }
}