#!/usr/bin/env node

/**
 * Script to remove console.log/warn/error statements from production code
 * This addresses a critical security and performance issue
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const COMPONENT_DIRS = [
  'src/components',
  'src/app',
  'src/features',
  'src/lib',
  'src/services',
  'src/hooks',
  'src/utils'
];

const FILE_PATTERNS = ['**/*.tsx', '**/*.jsx', '**/*.ts', '**/*.js'];
const EXCLUDED_PATTERNS = [
  '**/__tests__/**',
  '**/*.test.*',
  '**/*.spec.*',
  '**/test-utils/**',
  '**/__mocks__/**'
];

// Console statement patterns to remove
const CONSOLE_PATTERNS = [
  /console\s*\.\s*log\s*\([^)]*\)\s*;?/g,
  /console\s*\.\s*error\s*\([^)]*\)\s*;?/g,
  /console\s*\.\s*warn\s*\([^)]*\)\s*;?/g,
  /console\s*\.\s*info\s*\([^)]*\)\s*;?/g,
  /console\s*\.\s*debug\s*\([^)]*\)\s*;?/g,
  /console\s*\.\s*trace\s*\([^)]*\)\s*;?/g,
  /console\s*\.\s*table\s*\([^)]*\)\s*;?/g,
  /console\s*\.\s*time\s*\([^)]*\)\s*;?/g,
  /console\s*\.\s*timeEnd\s*\([^)]*\)\s*;?/g,
  /console\s*\.\s*group\s*\([^)]*\)\s*;?/g,
  /console\s*\.\s*groupEnd\s*\([^)]*\)\s*;?/g
];

// Track statistics
let totalFiles = 0;
let modifiedFiles = 0;
let totalStatementsRemoved = 0;
const filesSummary = [];

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let statementsRemoved = 0;

    // Check if file should be excluded
    if (content.includes('// @preserve-console') || 
        content.includes('/* @preserve-console */')) {
      console.log(`⏭️  Skipping ${filePath} (has @preserve-console directive)`);
      return;
    }

    // Remove each type of console statement
    CONSOLE_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        statementsRemoved += matches.length;
        content = content.replace(pattern, '');
      }
    });

    // Remove multiline console statements
    const multilinePattern = /console\s*\.\s*\w+\s*\([^)]*\n[^)]*\)\s*;?/gm;
    const multilineMatches = content.match(multilinePattern);
    if (multilineMatches) {
      statementsRemoved += multilineMatches.length;
      content = content.replace(multilinePattern, '');
    }

    // Clean up empty lines left behind
    content = content.replace(/^\s*\n/gm, '\n');
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Only write if content changed
    if (content !== originalContent) {
      // Create backup
      const backupPath = `${filePath}.console-backup-${Date.now()}`;
      fs.writeFileSync(backupPath, originalContent);
      
      // Write cleaned content
      fs.writeFileSync(filePath, content);
      
      modifiedFiles++;
      totalStatementsRemoved += statementsRemoved;
      
      filesSummary.push({
        file: filePath.replace(process.cwd() + '/', ''),
        statementsRemoved,
        backupPath: backupPath.replace(process.cwd() + '/', '')
      });
      
      console.log(`✅ ${filePath} - Removed ${statementsRemoved} console statements`);
    }
    
    totalFiles++;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Find all files to process
function findFiles() {
  const files = [];
  
  COMPONENT_DIRS.forEach(dir => {
    FILE_PATTERNS.forEach(pattern => {
      const fullPattern = path.join(dir, pattern);
      const matchedFiles = glob.sync(fullPattern, {
        ignore: EXCLUDED_PATTERNS.map(exc => path.join(dir, exc))
      });
      files.push(...matchedFiles);
    });
  });
  
  return [...new Set(files)]; // Remove duplicates
}

// Generate summary report
function generateReport() {
  const reportPath = path.join(process.cwd(), 'console-removal-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFilesScanned: totalFiles,
      filesModified: modifiedFiles,
      totalStatementsRemoved: totalStatementsRemoved
    },
    files: filesSummary,
    highRiskFiles: filesSummary
      .filter(f => f.statementsRemoved > 5)
      .sort((a, b) => b.statementsRemoved - a.statementsRemoved)
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  return report;
}

// Main execution
function main() {
  console.log('🧹 Starting console statement removal...\n');
  
  const files = findFiles();
  console.log(`Found ${files.length} files to scan\n`);
  
  // Process each file
  files.forEach(processFile);
  
  // Generate and display report
  const report = generateReport();
  
  console.log('\n📊 Summary:');
  console.log(`   Files scanned: ${report.summary.totalFilesScanned}`);
  console.log(`   Files modified: ${report.summary.filesModified}`);
  console.log(`   Console statements removed: ${report.summary.totalStatementsRemoved}`);
  
  if (report.highRiskFiles.length > 0) {
    console.log('\n⚠️  High-risk files (>5 console statements removed):');
    report.highRiskFiles.slice(0, 10).forEach(file => {
      console.log(`   ${file.file} (${file.statementsRemoved} statements)`);
    });
  }
  
  console.log(`\n✅ Report saved to: console-removal-report.json`);
  console.log('📁 Backup files created with .console-backup-* extension\n');
  
  // Restore command hint
  console.log('💡 To restore a file from backup:');
  console.log('   mv <file>.console-backup-<timestamp> <file>\n');
}

// Add command to package.json
function updatePackageJson() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts['remove-console']) {
      packageJson.scripts['remove-console'] = 'node scripts/remove-console-statements.js';
      packageJson.scripts['remove-console:dry-run'] = 'node scripts/remove-console-statements.js --dry-run';
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log('📦 Added remove-console script to package.json\n');
    }
  } catch (error) {
    console.warn('⚠️  Could not update package.json:', error.message);
  }
}

// Check for dry run mode
const isDryRun = process.argv.includes('--dry-run');

if (isDryRun) {
  console.log('🔍 DRY RUN MODE - No files will be modified\n');
  const files = findFiles();
  console.log(`Would scan ${files.length} files\n`);
  
  let wouldRemove = 0;
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    CONSOLE_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        wouldRemove += matches.length;
      }
    });
  });
  
  console.log(`Would remove approximately ${wouldRemove} console statements`);
} else {
  updatePackageJson();
  main();
}