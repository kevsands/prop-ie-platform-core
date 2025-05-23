#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// React Query v4 to v5 import mapping
const importMappings = {
  // Core imports remain the same
  'QueryClient': 'QueryClient',
  'QueryClientProvider': 'QueryClientProvider',
  'useQuery': 'useQuery',
  'useMutation': 'useMutation',
  'useInfiniteQuery': 'useInfiniteQuery',
  'useQueries': 'useQueries',
  'useQueryClient': 'useQueryClient',
  
  // Config types changed
  'QueryClientConfig': 'QueryClientConfig',
  'DefaultOptions': 'DefaultOptions',
  
  // These are the same but need proper imports
  'QueryKey': 'QueryKey',
  'QueryFunction': 'QueryFunction',
  'UseQueryOptions': 'UseQueryOptions',
  'UseMutationOptions': 'UseMutationOptions',
};

const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

console.log(`Found ${files.length} files to check...`);

let filesFixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Fix import statements
  const importRegex = /import\s*{([^}]+)}\s*from\s*['"]@tanstack\/react-query['"]/g;
  
  content = content.replace(importRegex, (match, imports) => {
    modified = true;
    // In v4, all imports come from @tanstack/react-query
    return match; // Keep the import as is for v4
  });
  
  // Fix incorrect v5 imports back to v4
  content = content.replace(
    /import\s*{([^}]+)}\s*from\s*['"]@tanstack\/react-query-devtools['"]/g,
    'import { $1 } from "@tanstack/react-query-devtools"'
  );
  
  // Fix any incorrect usage patterns
  // In v4, QueryClient constructor doesn't need defaultOptions nested structure
  content = content.replace(
    /new QueryClient\(\s*{\s*defaultOptions:\s*{\s*queries:\s*{/g,
    'new QueryClient({ defaultOptions: { queries: {'
  );
  
  if (modified) {
    fs.writeFileSync(file, content);
    filesFixed++;
    console.log(`Fixed imports in: ${file}`);
  }
});

console.log(`\nFixed ${filesFixed} files`);

// Now create a proper queryClient file for v4
const queryClientContent = `import { QueryClient } from '@tanstack/react-query';

// Create a client with v4 configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        if (error.status === 401) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
`;

fs.writeFileSync(
  path.join(process.cwd(), 'src/utils/queryClient.ts'),
  queryClientContent
);
console.log('Created v4-compatible queryClient.ts');