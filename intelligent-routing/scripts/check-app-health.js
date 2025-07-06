#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkAppHealth() {
  console.log('🏥 Checking app health...\n');
  
  const checks = {
    'Context Files': {
      files: [
        'src/context/AuthContext.tsx',
        'src/context/TransactionContext.tsx',
        'src/context/UserRoleContext.tsx',
        'src/context/EnterpriseNotificationContext.tsx'
      ]
    },
    'Component Files': {
      files: [
        'src/components/navigation/MainNavigation.tsx',
        'src/components/ui/NotificationCenter.tsx',
        'src/components/auth/ProtectedRoute.tsx'
      ]
    },
    'UI Components': {
      files: [
        'src/components/ui/card.tsx',
        'src/components/ui/button.tsx',
        'src/components/ui/badge.tsx'
      ]
    }
  };
  
  let hasErrors = false;
  
  for (const [category, config] of Object.entries(checks)) {
    console.log(`Checking ${category}:`);
    
    for (const file of config.files) {
      const fullPath = path.join(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        console.log(`  ✅ ${file}`);
      } else {
        console.log(`  ❌ ${file} - MISSING`);
        hasErrors = true;
      }
    }
    console.log('');
  }
  
  // Check for NavigationContext which should NOT exist
  console.log('Checking removed contexts:');
  const removedContexts = ['src/context/NavigationContext.tsx'];
  for (const file of removedContexts) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.log(`  ✅ ${file} - Correctly removed`);
    } else {
      console.log(`  ⚠️  ${file} - Still exists (should be removed)`);
    }
  }
  
  console.log('\n=== Summary ===');
  if (hasErrors) {
    console.log('❌ Some files are missing. Run setup scripts to fix.');
  } else {
    console.log('✅ All required files are present!');
  }
  
  // Check package.json scripts
  console.log('\n=== Available Scripts ===');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const devScripts = ['dev', 'build', 'start', 'test'];
  
  for (const script of devScripts) {
    if (packageJson.scripts[script]) {
      console.log(`  ✅ npm run ${script}`);
    } else {
      console.log(`  ❌ npm run ${script} - Not configured`);
    }
  }
}

checkAppHealth();