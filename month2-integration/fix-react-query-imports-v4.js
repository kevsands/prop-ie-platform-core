#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define import mappings for v4 compatibility
const importMappings = {
  // React Query v4 uses @tanstack/react-query for all main imports
  'react-query': '@tanstack/react-query',
  '@tanstack/query-core': '@tanstack/react-query',
  // For v4, use react-query persist client instead of v5 packages
  '@tanstack/query-persist-client-core': '@tanstack/react-query-persist-client',
  '@tanstack/query-sync-storage-persister': '@tanstack/react-query-persist-client',
};

// Define specific import replacements
const specificReplacements = {
  'persistQueryClient': 'persistQueryClient',
  'createSyncStoragePersister': 'createSyncStoragePersister',
  'QueryClient': 'QueryClient',
  'DefaultOptions': 'DefaultOptions',
  'QueryClientProvider': 'QueryClientProvider',
  'useQuery': 'useQuery',
  'useMutation': 'useMutation',
  'useQueryClient': 'useQueryClient',
};

// Rename v5 properties to v4
const propertyReplacements = {
  'gcTime': 'cacheTime', // v5 gcTime was v4 cacheTime
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Replace imports
  Object.entries(importMappings).forEach(([oldImport, newImport]) => {
    // Handle various import styles
    const patterns = [
      new RegExp(`from ['"]${oldImport}['"]`, 'g'),
      new RegExp(`from "${oldImport}"`, 'g'),
      new RegExp(`from '${oldImport}'`, 'g'),
    ];
    
    patterns.forEach(pattern => {
      if (content.match(pattern)) {
        content = content.replace(pattern, `from '${newImport}'`);
        hasChanges = true;
      }
    });
  });

  // Fix specific v5 to v4 property names
  Object.entries(propertyReplacements).forEach(([v5Prop, v4Prop]) => {
    const pattern = new RegExp(`\\b${v5Prop}\\b`, 'g');
    if (content.match(pattern)) {
      content = content.replace(pattern, v4Prop);
      hasChanges = true;
    }
  });

  // For persist client imports, update the imports to be from the correct package
  const persistClientPattern = /import\s*{([^}]+)}\s*from\s*['"]@tanstack\/react-query-persist-client['"]/g;
  const persistClientMatches = content.match(persistClientPattern);
  if (persistClientMatches) {
    // Check if the package is installed
    try {
      require.resolve('@tanstack/react-query-persist-client');
    } catch (e) {
      // If not installed, keep imports from main package for now
      content = content.replace(persistClientPattern, (match, imports) => {
        return `import {${imports}} from '@tanstack/react-query'`;
      });
      hasChanges = true;
    }
  }

  // Handle the specific queryClient.ts file imports
  if (filePath.includes('queryClient.ts')) {
    // For v4, we need to adjust persist imports
    content = content.replace(
      /import { createSyncStoragePersister } from ['"]@tanstack\/query-sync-storage-persister['"]/g,
      `import { createSyncStoragePersister } from '@tanstack/react-query-persist-client'`
    );
    
    content = content.replace(
      /import { persistQueryClient } from ['"]@tanstack\/query-persist-client-core['"]/g,
      `import { persistQueryClient } from '@tanstack/react-query-persist-client'`
    );
    
    content = content.replace(
      /import { QueryClient, DefaultOptions } from ['"]@tanstack\/query-core['"]/g,
      `import { QueryClient, DefaultOptions } from '@tanstack/react-query'`
    );
    
    hasChanges = true;
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

// Find all TypeScript and JavaScript files
const patterns = [
  'src/**/*.ts',
  'src/**/*.tsx',
  'src/**/*.js',
  'src/**/*.jsx',
];

patterns.forEach(pattern => {
  const files = glob.sync(pattern, { cwd: process.cwd() });
  files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    processFile(filePath);
  });
});

console.log('React Query import fixes completed for v4 compatibility');