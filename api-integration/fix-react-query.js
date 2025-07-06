/**
 * Script to fix React Query import issues in Jest
 * This script will add a mock for @tanstack/react-query to jest.dom.setup.js
 */

const fs = require('fs');
const path = require('path');

const jestDomSetupPath = path.resolve('./jest.dom.setup.js');

try {
  // Read the current content
  const content = fs.readFileSync(jestDomSetupPath, 'utf8');
  
  // Check if we already have a React Query mock
  if (content.includes('@tanstack/react-query')) {
    console.log('React Query mock already exists in jest.dom.setup.js');
    process.exit(0);
  }
  
  // Add React Query mock at the end of the file
  const updatedContent = `${content}

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  })),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn().mockResolvedValue({}),
    isLoading: false,
    isError: false,
    error: null,
    reset: jest.fn(),
  })),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  })),
  QueryClient: jest.fn().mockImplementation(() => ({
    setDefaultOptions: jest.fn(),
    mount: jest.fn(),
    clear: jest.fn(),
  })),
  QueryClientProvider: ({ children }) => children,
}));
`;
  
  // Write the updated content
  fs.writeFileSync(jestDomSetupPath, updatedContent, 'utf8');
  console.log('Added React Query mock to jest.dom.setup.js');
  
  // Update package.json to run test with --no-cache
  const packageJsonPath = path.resolve('./package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.test) {
    // Only update if we need to
    if (!packageJson.scripts.test.includes('--no-cache')) {
      packageJson.scripts.test = packageJson.scripts.test + ' --no-cache';
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('Updated package.json "test" script to include --no-cache');
    }
  }

  // Create a .env.test file to set the environment variables for testing
  const envTestPath = path.resolve('./.env.test');
  const envTestContent = `
# Test environment configuration
NODE_ENV=test
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GRAPHQL_API=http://localhost:3001/api/graphql
NEXT_PUBLIC_MOCK_API=true
`;
  
  fs.writeFileSync(envTestPath, envTestContent, 'utf8');
  console.log('Created .env.test file with test environment variables');
  
  console.log('Setup complete! Run your tests with: npm test -- --testPathIgnorePatterns="node_modules" --no-cache');
} catch (error) {
  console.error('Error updating Jest setup files:', error);
  process.exit(1);
}