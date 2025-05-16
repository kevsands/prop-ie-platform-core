#!/usr/bin/env node

/**
 * Diagnose app startup issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Diagnosing app startup issues...\n');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('❌ node_modules directory not found.');
  console.log('   Run: npm install\n');
} else {
  console.log('✅ node_modules exists');
}

// Check if package-lock.json exists
if (!fs.existsSync('package-lock.json')) {
  console.log('⚠️  package-lock.json not found.');
  console.log('   Run: npm install\n');
}

// Check Next.js version
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`Next.js version: ${packageJson.dependencies.next || 'Not found'}`);
  console.log(`React version: ${packageJson.dependencies.react || 'Not found'}`);
  console.log(`TypeScript version: ${packageJson.devDependencies?.typescript || 'Not found'}\n`);
} catch (error) {
  console.log('❌ Error reading package.json');
}

// Check TypeScript errors
console.log('Checking TypeScript errors...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ No TypeScript errors\n');
} catch (error) {
  console.log('❌ TypeScript errors found:');
  console.log(error.stdout?.toString() || error.stderr?.toString());
  console.log('\n');
}

// Check key files
const keyFiles = [
  '.env.local',
  'next.config.js',
  'tsconfig.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
];

console.log('Checking key files:');
keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check environment variables
console.log('\nEnvironment variables (.env.local):');
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const envVars = envContent.split('\n').filter(line => line && !line.startsWith('#'));
  envVars.forEach(line => {
    const [key] = line.split('=');
    if (key) {
      console.log(`  ${key} = [SET]`);
    }
  });
} else {
  console.log('  ⚠️  .env.local not found');
  console.log('  Create .env.local with necessary environment variables');
}

// Try to start the server and capture errors
console.log('\n=== Attempting to start dev server ===');
console.log('Running: npm run dev');
try {
  const result = execSync('npm run dev', { 
    timeout: 5000,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  console.log('Server started successfully!');
} catch (error) {
  console.log('❌ Server failed to start:');
  if (error.stderr) {
    console.log(error.stderr.toString());
  }
  if (error.stdout) {
    console.log(error.stdout.toString());
  }
  
  // Check for common errors
  const errorStr = (error.stderr || error.stdout || '').toString();
  
  if (errorStr.includes('EADDRINUSE')) {
    console.log('\n⚠️  Port 3000 is already in use. Try:');
    console.log('   lsof -ti:3000 | xargs kill -9');
    console.log('   Or use a different port: npm run dev -- -p 3001');
  }
  
  if (errorStr.includes('Cannot find module')) {
    console.log('\n⚠️  Missing dependencies. Try:');
    console.log('   rm -rf node_modules package-lock.json');
    console.log('   npm install');
  }
  
  if (errorStr.includes('Module not found')) {
    const moduleMatch = errorStr.match(/Module not found: ([^\n]+)/);
    if (moduleMatch) {
      console.log(`\n⚠️  Module not found: ${moduleMatch[1]}`);
      console.log('   Check imports and file paths');
    }
  }
}