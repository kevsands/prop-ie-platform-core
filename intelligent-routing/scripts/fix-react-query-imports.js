#!/usr/bin/env node
/**
 * Fix React Query Imports
 * 
 * This script automatically updates TanStack React Query imports to use
 * the modular structure introduced in v5+.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths to process (relative to project root)
const SEARCH_PATHS = ['src'];

// Regex patterns for finding imports
const IMPORT_PATTERNS = {
  // Main package imports
  QUERY_IMPORT: /(import\s+)({[^}]*})\s+(from\s+['"])@tanstack\/react-query(['"])/g,
  
  // DevTools imports
  DEVTOOLS_IMPORT: /(import\s+)({[^}]*})\s+(from\s+['"])@tanstack\/react-query-devtools(['"])/g
};

// Get the project root directory
const rootDir = process.cwd();

// Maps import entities to the correct subpath
function mapImportToSubpath(importEntity) {
  // Core types and classes
  const coreImports = [
    'QueryClient',
    'QueryKey',
    'MutationKey',
    'MutationCache',
    'QueryCache',
    'QueriesObserver',
    'InfiniteQueryObserver',
    'MutationObserver',
    'QueryObserver',
    'UseQueryOptions',
    'UseMutationOptions',
    'UseInfiniteQueryOptions',
    'QueryFunction',
    'MutationFunction',
    'useQueryClient', // Maps to both in v5, but we'll map to /react for hook form
    'type',
    'dehydrate',
    'hydrate'
  ];
  
  // React-specific hooks and components
  const reactImports = [
    'useQuery',
    'useMutation',
    'useQueries',
    'useInfiniteQuery',
    'QueryClientProvider',
    'useSuspenseQuery',
    'useSuspenseInfiniteQuery',
    'useSuspenseQueries',
    'useIsFetching',
    'useIsMutating',
    'useQueryClient' // Hook lives in /react
  ];
  
  // Determine which path the import belongs to
  const importName = importEntity.trim();
  
  if (coreImports.some(item => importName.includes(item))) {
    return 'core';
  } else if (reactImports.some(item => importName.includes(item))) {
    return 'react';
  }
  
  // Default to react for unrecognized imports
  return 'react';
}

// Process a single file
function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  let fileContent = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Track imports to ensure we don't duplicate imports from the same module
  const coreImports = new Set();
  const reactImports = new Set();
  
  // Process regular React Query imports
  fileContent = fileContent.replace(IMPORT_PATTERNS.QUERY_IMPORT, (match, importStart, importItems, fromStart, fromEnd) => {
    modified = true;
    
    // Split the import items
    const items = importItems
      .replace(/[{}]/g, '')
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    // Group imports by submodule
    const coreSubmoduleImports = [];
    const reactSubmoduleImports = [];
    
    for (const item of items) {
      const subpath = mapImportToSubpath(item);
      
      if (subpath === 'core') {
        coreSubmoduleImports.push(item);
        coreImports.add(item.trim());
      } else {
        reactSubmoduleImports.push(item);
        reactImports.add(item.trim());
      }
    }
    
    // Build the new import statements
    let newImports = [];
    
    if (coreSubmoduleImports.length > 0) {
      newImports.push(`${importStart}{ ${coreSubmoduleImports.join(', ')} }${fromStart}@tanstack/react-query/core${fromEnd}`);
    }
    
    if (reactSubmoduleImports.length > 0) {
      newImports.push(`${importStart}{ ${reactSubmoduleImports.join(', ')} }${fromStart}@tanstack/react-query/react${fromEnd}`);
    }
    
    return newImports.join('\n');
  });
  
  // Process DevTools imports
  fileContent = fileContent.replace(IMPORT_PATTERNS.DEVTOOLS_IMPORT, (match, importStart, importItems, fromStart, fromEnd) => {
    modified = true;
    return `${importStart}${importItems}${fromStart}@tanstack/react-query-devtools/react${fromEnd}`;
  });

  // Save the file if it was modified
  if (modified) {
    fs.writeFileSync(filePath, fileContent, 'utf8');
    return true;
  }
  
  return false;
}

// Find files with TanStack React Query imports
function findFilesWithReactQueryImports() {
  const files = new Set();
  
  // Use simpler patterns for grep
  const grepPatterns = [
    'from "@tanstack/react-query"',
    "from '@tanstack/react-query'",
    'from "@tanstack/react-query-devtools"',
    "from '@tanstack/react-query-devtools'"
  ];
  
  for (const pattern of grepPatterns) {
    for (const searchPath of SEARCH_PATHS) {
      try {
        const command = `grep -r -l "${pattern}" ${searchPath} --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"`;
        const result = execSync(command, { cwd: rootDir, encoding: 'utf8' });
        
        if (result.trim()) {
          result.split('\n').filter(line => line.trim() !== '').forEach(file => files.add(file));
        }
      } catch (error) {
        // grep returns non-zero exit code if no matches found
        if (error.status !== 1) {
          console.error(`Error running grep: ${error.message}`);
        }
      }
    }
  }
  
  return Array.from(files);
}

// Main function
function main() {
  console.log('🔍 Finding files with TanStack React Query imports...');
  
  const files = findFilesWithReactQueryImports();
  
  if (files.length === 0) {
    console.log('✅ No files with TanStack React Query imports found!');
    return;
  }
  
  console.log(`\n🛠️ Found ${files.length} files with TanStack React Query imports to process:\n`);
  
  let processedCount = 0;
  
  for (const file of files) {
    try {
      const wasModified = processFile(file);
      if (wasModified) {
        processedCount++;
      }
    } catch (error) {
      console.error(`Error processing file ${file}: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Successfully processed ${processedCount} files!`);
  console.log(`📝 TanStack React Query v5+ modular structure has been applied to your imports.`);
  
  if (processedCount < files.length) {
    console.log(`⚠️ Some files (${files.length - processedCount}) could not be processed automatically.`);
    console.log('   Please review these files manually.');
  }
}

// Run the main function
main();