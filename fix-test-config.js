#!/usr/bin/env node
// Fix test configuration issues

const fs = require('fs');
const path = require('path');

console.log('Fixing test configuration...\n');

// Update jest config to handle TypeScript properly
const jestConfig = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/jest-setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json'
    }]
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/coverage/'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/stories/**',
    '!src/**/*.stories.{ts,tsx}'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  }
};

// Write jest config
fs.writeFileSync('jest.config.json', JSON.stringify(jestConfig, null, 2));
console.log('✅ Created jest.config.json');

// Create tsconfig for jest
const tsconfigJest = {
  extends: './tsconfig.json',
  compilerOptions: {
    jsx: 'react',
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    moduleResolution: 'node',
    resolveJsonModule: true,
    isolatedModules: false,
    noEmit: true,
    types: ['jest', '@testing-library/jest-dom', 'node']
  },
  include: [
    'src/**/*',
    '__tests__/**/*',
    'test-utils/**/*'
  ],
  exclude: [
    'node_modules',
    '.next',
    'coverage'
  ]
};

fs.writeFileSync('tsconfig.jest.json', JSON.stringify(tsconfigJest, null, 2));
console.log('✅ Created tsconfig.jest.json');

// Create mock files
const fileMock = `module.exports = 'test-file-stub';`;
const styleMock = `module.exports = {};`;

if (!fs.existsSync('__mocks__')) {
  fs.mkdirSync('__mocks__');
}

fs.writeFileSync('__mocks__/fileMock.js', fileMock);
fs.writeFileSync('__mocks__/styleMock.js', styleMock);
console.log('✅ Created mock files');

// Update test setup
const testSetup = `
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
  useParams: () => ({}),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
`;

// Create test utils directory if it doesn't exist
const testUtilsDir = path.join('src', 'test-utils');
if (!fs.existsSync(testUtilsDir)) {
  fs.mkdirSync(testUtilsDir, { recursive: true });
}

fs.writeFileSync(path.join(testUtilsDir, 'jest-setup.ts'), testSetup);
console.log('✅ Created jest setup file');

// Fix performance monitor mock
const performanceMonitorMock = `
export const performanceMonitor = {
  startTiming: jest.fn(() => Date.now()),
  endTiming: jest.fn((startTime) => Date.now() - startTime),
  logMetric: jest.fn(),
  clearMetrics: jest.fn(),
  getMetrics: jest.fn(() => ({})),
  track: jest.fn(),
  measure: jest.fn(),
};
`;

if (!fs.existsSync(path.join('src', 'lib', '__mocks__'))) {
  fs.mkdirSync(path.join('src', 'lib', '__mocks__'), { recursive: true });
}

fs.writeFileSync(path.join('src', 'lib', '__mocks__', 'performanceMonitor.ts'), performanceMonitorMock);
console.log('✅ Created performance monitor mock');

console.log('\nTest configuration fixed!');
console.log('Run "npm test" to verify tests are working.');