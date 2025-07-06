#!/usr/bin/env node
/**
 * setup-db-tests.js
 * This script prepares the environment for running database tests in CI/CD pipelines.
 * 
 * It ensures that:
 * 1. Environment mocks are properly set up
 * 2. Test database configuration is available
 * 3. Jest is configured to find and run database tests
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Log a message with color
 * @param {string} message Message to log
 * @param {string} color Color to use
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Check if a file or directory exists
 * @param {string} path Path to check
 * @returns {boolean} True if path exists
 */
function exists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Create a directory if it doesn't exist
 * @param {string} dir Directory to create
 */
function ensureDir(dir) {
  if (!exists(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`, colors.green);
  }
}

/**
 * Copy a file if the source exists and the destination doesn't
 * @param {string} src Source file
 * @param {string} dest Destination file
 */
function copyIfNeeded(src, dest) {
  if (exists(src) && !exists(dest)) {
    fs.copyFileSync(src, dest);
    log(`Copied ${src} to ${dest}`, colors.green);
  } else if (!exists(src)) {
    log(`Source file does not exist: ${src}`, colors.yellow);
  } else {
    log(`Destination file already exists: ${dest}`, colors.blue);
  }
}

// Project root directory
const rootDir = path.resolve(__dirname, '..');

// Ensure test directories exist
ensureDir(path.join(rootDir, '__tests__/mocks'));
ensureDir(path.join(rootDir, '__tests__/helpers'));
ensureDir(path.join(rootDir, '__tests__/db'));

// Path to required files
const requiredFiles = [
  {
    src: path.join(rootDir, 'src/tests/mocks/prisma.ts'),
    dest: path.join(rootDir, '__tests__/mocks/prisma-mock.ts'),
    comment: 'Prisma mock implementation'
  },
  {
    src: path.join(rootDir, 'src/tests/utils/testContext.ts'),
    dest: path.join(rootDir, '__tests__/helpers/test-context.ts'),
    comment: 'Test context utilities'
  },
  // Add environment mock if it doesn't exist
  {
    content: `/**
 * environment-test-utils.ts
 * Utilities for mocking environment variables and related functionality in tests
 */

// Mock implementation of getEnvironmentVariable
export function getEnvironmentVariable(key: string, defaultValue: string = ''): string {
  // For tests, we'll prioritize actual environment variables if set
  if (process.env[key]) {
    return process.env[key] as string;
  }
  
  // Return test-specific defaults for database connections
  if (key === 'POSTGRES_HOST') return 'localhost';
  if (key === 'POSTGRES_PORT') return '5432';
  if (key === 'POSTGRES_DB') return 'propie_test';
  if (key === 'POSTGRES_USER') return 'postgres';
  if (key === 'POSTGRES_PASSWORD') return 'postgres';
  if (key === 'POSTGRES_POOL_MAX') return '5';
  if (key === 'POSTGRES_IDLE_TIMEOUT') return '10000';
  if (key === 'POSTGRES_CONNECT_TIMEOUT') return '1000';
  if (key === 'POSTGRES_SSL') return 'false';
  if (key === 'NODE_ENV') return 'test';
  
  // Return provided default value for other keys
  return defaultValue;
}

/**
 * Mock environment variables for tests
 * @param mockedVariables Record of environment variables to mock
 * @returns Function to restore original environment
 */
export function mockEnvironmentVariables(mockedVariables: Record<string, string>) {
  const originalEnv = { ...process.env };
  
  // Set up test environment variables
  Object.entries(mockedVariables).forEach(([key, value]) => {
    process.env[key] = value;
  });
  
  // Return function to restore original environment
  return () => {
    // Restore original environment
    process.env = originalEnv;
  };
}

/**
 * Setup test environment for database tests
 * Configures test-specific database connection parameters
 */
export function setupTestDatabaseEnvironment() {
  return mockEnvironmentVariables({
    POSTGRES_HOST: 'localhost', 
    POSTGRES_PORT: '5432',
    POSTGRES_DB: 'propie_test',
    POSTGRES_USER: 'postgres',
    POSTGRES_PASSWORD: 'postgres',
    POSTGRES_POOL_MAX: '5',
    POSTGRES_IDLE_TIMEOUT: '10000',
    POSTGRES_CONNECT_TIMEOUT: '1000',
    POSTGRES_SSL: 'false',
    NODE_ENV: 'test'
  });
}

export default {
  getEnvironmentVariable,
  mockEnvironmentVariables,
  setupTestDatabaseEnvironment
};`,
    dest: path.join(rootDir, '__tests__/helpers/environment-test-utils.ts'),
    comment: 'Environment test utilities'
  },
  {
    content: `/**
 * environment-mock.ts
 * Mock implementation of the environment module for tests
 */

import { getEnvironmentVariable } from '../helpers/environment-test-utils';

export {
  getEnvironmentVariable
};

// Export any other functions from the real environment module that might be needed
export function validateEnvironment(): boolean {
  return true;
}

export function initializeEnvironment() {
  return true;
}

export default {
  getEnvironmentVariable,
  validateEnvironment,
  initializeEnvironment
};`,
    dest: path.join(rootDir, '__tests__/mocks/environment-mock.ts'),
    comment: 'Environment mock module'
  },
  {
    content: `/**
 * Extend app-router-test-utils.tsx with additional utilities for database testing
 */
import { mockEnvironmentVariables, setupTestDatabaseEnvironment } from './environment-test-utils';

/**
 * Setup the test environment for database tests
 * @returns Function to restore the original environment
 */
export function setupTestEnvironment() {
  // Mock environment variables needed for database tests
  const restoreEnv = setupTestDatabaseEnvironment();
  
  // Mock functions that require environment variables
  jest.mock('../../src/lib/environment', () => require('../mocks/environment-mock'));
  
  // Return function to restore environment
  return restoreEnv;
}

export default {
  setupTestEnvironment
};`,
    dest: path.join(rootDir, '__tests__/helpers/app-router-test-utils.tsx'),
    comment: 'App router test utilities'
  },
];

// Process required files
requiredFiles.forEach(file => {
  if (file.src && file.dest) {
    log(`Processing ${file.comment}...`, colors.cyan);
    copyIfNeeded(file.src, file.dest);
  } else if (file.content && file.dest) {
    if (!exists(file.dest)) {
      fs.writeFileSync(file.dest, file.content);
      log(`Created ${file.comment}: ${file.dest}`, colors.green);
    } else {
      log(`${file.comment} already exists: ${file.dest}`, colors.blue);
    }
  }
});

// Update CI/CD configuration if needed
const ciFile = path.join(rootDir, '.github/workflows/ci-cd.updated.yml');
if (exists(ciFile)) {
  log('Updating CI/CD configuration...', colors.cyan);
  
  let ciContent = fs.readFileSync(ciFile, 'utf8');
  
  // Check if test command needs to be updated
  if (!ciContent.includes('npm run test:db')) {
    // Add database test command
    ciContent = ciContent.replace(
      /npm run test/g,
      'npm run test && npm run test:db'
    );
    
    fs.writeFileSync(ciFile, ciContent);
    log('Updated CI/CD configuration with database tests', colors.green);
  } else {
    log('CI/CD configuration already includes database tests', colors.blue);
  }
}

// Update package.json with test commands
const packageFile = path.join(rootDir, 'package.json');
if (exists(packageFile)) {
  log('Updating package.json...', colors.cyan);
  
  const packageJson = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  
  // Add test commands if they don't exist
  let updated = false;
  
  if (!packageJson.scripts['test:db']) {
    packageJson.scripts['test:db'] = 'jest --config jest.db.config.js';
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2));
    log('Updated package.json with database test commands', colors.green);
  } else {
    log('Package.json already has database test commands', colors.blue);
  }
}

// Create Jest configuration for database tests
const jestDbConfig = path.join(rootDir, 'jest.db.config.js');
if (!exists(jestDbConfig)) {
  log('Creating Jest configuration for database tests...', colors.cyan);
  
  const jestConfig = `/**
 * Jest configuration for database tests
 */
const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/db/**/*.test.ts',
    '**/src/tests/integration/**/*.test.ts'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest.db.setup.js'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage/db',
  collectCoverageFrom: [
    'src/lib/db/**/*.{ts,tsx}',
    '!src/lib/db/**/*.d.ts',
  ],
};
`;
  
  fs.writeFileSync(jestDbConfig, jestConfig);
  log('Created Jest configuration for database tests', colors.green);
} else {
  log('Jest configuration for database tests already exists', colors.blue);
}

// Create Jest setup file for database tests
const jestDbSetup = path.join(rootDir, 'jest.db.setup.js');
if (!exists(jestDbSetup)) {
  log('Creating Jest setup file for database tests...', colors.cyan);
  
  const setupContent = `/**
 * Jest setup for database tests
 */

// Mock PrismaClient to avoid actual database connections during tests
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(callback => callback(mockPrismaClient)),
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    development: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    unit: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    document: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Mock environment module
jest.mock('./src/lib/environment', () => require('./__tests__/mocks/environment-mock'));

// Mock pg module to avoid actual database connections
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    }),
    on: jest.fn(),
    end: jest.fn(),
  };
  
  return {
    Pool: jest.fn(() => mockPool),
  };
});

// Global test timeout
jest.setTimeout(30000);
`;
  
  fs.writeFileSync(jestDbSetup, setupContent);
  log('Created Jest setup file for database tests', colors.green);
} else {
  log('Jest setup file for database tests already exists', colors.blue);
}

// Final message
log('\nSetup complete! You can now run database tests with:', colors.green);
log('npm run test:db\n', colors.cyan);