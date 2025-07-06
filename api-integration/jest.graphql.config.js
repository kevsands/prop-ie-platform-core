/**
 * Jest configuration for GraphQL tests
 */

const nextJest = require('next/jest');

// Create the Next.js Jest configuration
const createJestConfig = nextJest({
  dir: './', // Root directory
});

// Custom Jest configuration
const customJestConfig = {
  displayName: 'graphql',
  testEnvironment: 'node', // Use node environment for GraphQL API tests
  setupFilesAfterEnv: ['<rootDir>/src/lib/graphql/testing/jest.setup.ts'],
  testMatch: ['**/?(*.)+(spec|test).graphql.[jt]s?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  collectCoverageFrom: [
    'src/lib/graphql/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/testing/',
  ],
};

// Export the merged configuration
module.exports = createJestConfig(customJestConfig);