#!/usr/bin/env node
// Final Platform Status Report

const fs = require('fs');
const { execSync } = require('child_process');

function runCommand(cmd, silent = true) {
  try {
    return execSync(cmd, { 
      encoding: 'utf8', 
      stdio: silent ? 'pipe' : 'inherit' 
    });
  } catch (error) {
    return error.stdout || error.message || 'Error';
  }
}

console.log('🔍 Generating Final Platform Status Report\n');

// Count actual lines of code
console.log('📊 Code Metrics:');
const jsFiles = runCommand('find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .next | wc -l').trim();
console.log(`   JavaScript/TypeScript files: ${jsFiles}`);

const totalLines = runCommand('find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .next | xargs wc -l | tail -1 | awk \'{print $1}\'').trim();
console.log(`   Total lines of code: ${totalLines}`);

// Check current git status
console.log('\n📁 Current Git Status:');
const gitStatus = runCommand('git status --porcelain | wc -l').trim();
console.log(`   Uncommitted changes: ${gitStatus} files`);

// Check package.json
console.log('\n📦 Package Info:');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log(`   Name: ${pkg.name}`);
console.log(`   Version: ${pkg.version}`);
console.log(`   Dependencies: ${Object.keys(pkg.dependencies || {}).length}`);
console.log(`   Dev Dependencies: ${Object.keys(pkg.devDependencies || {}).length}`);

// Check available scripts
console.log('\n🛠️ Available Scripts:');
Object.keys(pkg.scripts || {}).forEach(script => {
  console.log(`   - npm run ${script}`);
});

// Check for critical files
console.log('\n📄 Critical Files:');
const criticalFiles = [
  '.env.local',
  '.env.production',
  'next.config.js',
  'tsconfig.json',
  'prisma/schema.prisma',
  'src/middleware.ts',
  'src/lib/auth.ts'
];

criticalFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
});

// Directory structure
console.log('\n📂 Directory Structure:');
const dirs = runCommand('find src -type d -maxdepth 2 | sort').split('\n').filter(Boolean);
dirs.forEach(dir => {
  const fileCount = runCommand(`find ${dir} -type f | wc -l`).trim();
  console.log(`   ${dir}: ${fileCount} files`);
});

// Generate summary report
const report = {
  timestamp: new Date().toISOString(),
  codeMetrics: {
    files: parseInt(jsFiles),
    totalLines: parseInt(totalLines),
    uncommittedChanges: parseInt(gitStatus)
  },
  packageInfo: {
    name: pkg.name,
    version: pkg.version,
    dependencies: Object.keys(pkg.dependencies || {}).length,
    devDependencies: Object.keys(pkg.devDependencies || {}).length
  },
  criticalFiles: {},
  directories: {}
};

criticalFiles.forEach(file => {
  report.criticalFiles[file] = fs.existsSync(file);
});

dirs.forEach(dir => {
  const count = runCommand(`find ${dir} -type f | wc -l`).trim();
  report.directories[dir] = parseInt(count);
});

fs.writeFileSync('final-platform-status.json', JSON.stringify(report, null, 2));
console.log('\n✅ Report saved to final-platform-status.json');