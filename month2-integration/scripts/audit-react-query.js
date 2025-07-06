#!/usr/bin/env node
/**
 * Audit React Query Imports
 * 
 * This script scans the codebase for TanStack React Query imports and identifies
 * imports that need to be updated to match the package's modular structure in v5+.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths to search (relative to project root)
const SEARCH_PATHS = ['src'];

// Patterns to look for
const IMPORT_PATTERNS = [
  'from "@tanstack/react-query"',
  "from '@tanstack/react-query'",
  'from "@tanstack/react-query-devtools"',
  "from '@tanstack/react-query-devtools'"
];

// Get the project root directory
const rootDir = process.cwd();

// Function to run grep command and parse results
function findImportIssues() {
  const issues = [];
  
  for (const pattern of IMPORT_PATTERNS) {
    try {
      const command = `grep -r "${pattern}" ${SEARCH_PATHS.join(' ')} --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"`;
      const result = execSync(command, { cwd: rootDir, encoding: 'utf8' });
      
      if (result.trim()) {
        const lines = result.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          const [filePath, matchedText] = line.split(':', 2);
          const remainder = line.substring(filePath.length + matchedText.length + 2);
          
          issues.push({
            filePath,
            matchedText: matchedText.trim() + remainder,
            pattern
          });
        }
      }
    } catch (error) {
      // grep returns non-zero exit code if no matches found
      if (error.status !== 1) {
        console.error(`Error running grep: ${error.message}`);
      }
    }
  }

  return issues;
}

// Function to suggest fixes
function suggestFix(issue) {
  let suggestion = '';
  
  if (issue.pattern.includes('react-query-devtools')) {
    suggestion = 'Change import to use @tanstack/react-query-devtools/react';
  } else if (issue.matchedText.includes('QueryClient')) {
    suggestion = 'Import QueryClient from @tanstack/react-query/core';
  } else if (issue.matchedText.includes('Provider') || issue.matchedText.includes('useQuery') || issue.matchedText.includes('useMutation')) {
    suggestion = 'Import components and hooks from @tanstack/react-query/react';
  } else if (issue.matchedText.includes('QueryKey') || issue.matchedText.includes('type')) {
    suggestion = 'Import types from @tanstack/react-query/core';
  } else {
    suggestion = 'Evaluate whether to import from /core or /react based on usage';
  }
  
  return suggestion;
}

// Main function
function main() {
  console.log('🔍 Scanning for TanStack React Query imports...');
  
  const issues = findImportIssues();
  
  if (issues.length === 0) {
    console.log('✅ No problematic imports found!');
    return;
  }
  
  console.log(`\n🛠️ Found ${issues.length} imports that might need updating:\n`);
  
  const fileIssues = {};
  
  // Group issues by file
  for (const issue of issues) {
    if (!fileIssues[issue.filePath]) {
      fileIssues[issue.filePath] = [];
    }
    fileIssues[issue.filePath].push(issue);
  }
  
  // Print issues grouped by file
  for (const [filePath, fileIssueList] of Object.entries(fileIssues)) {
    console.log(`\n📄 ${filePath}:`);
    
    for (const issue of fileIssueList) {
      console.log(`   - ${issue.matchedText.trim()}`);
      console.log(`     Suggestion: ${suggestFix(issue)}`);
    }
  }
  
  console.log('\n📝 TanStack React Query v5+ uses a modular structure:');
  console.log('   - @tanstack/react-query/core: Core functionality and types');
  console.log('   - @tanstack/react-query/react: React specific hooks and components');
  console.log('   - @tanstack/react-query-devtools/react: DevTools for React');
  
  console.log('\n🔧 Fix options:');
  console.log('   1. Run this script as a guide and manually update imports');
  console.log('   2. Use codemod tools to automate the changes');
}

// Run the main function
main();