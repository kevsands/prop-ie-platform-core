// jest.integration.config.js
const nextJest = require("next/jest");

// Providing the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import("jest").Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.integration.setup.js"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias support
  moduleDirectories: ["node_modules", "<rootDir>/"],
  // Ensure all tests use jsdom environment
  testEnvironment: "jest-environment-jsdom",
  // Handle module aliases (this should match the paths in tsconfig.json)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/lib/db/repositories$": "<rootDir>/src/lib/db/repositories/index.ts", 
    "^@/lib/db/repositories/(.*)$": "<rootDir>/src/lib/db/repositories/$1",
    "^@/types/core/user$": "<rootDir>/src/types/core/user.ts",
    "^@/types/jest-extend$": "<rootDir>/src/types/jest-extended.d.ts",
    "^@/types/jest-extended$": "<rootDir>/src/types/jest-extended.d.ts",
    "^@/types/prisma$": "<rootDir>/src/types/prisma.ts",
    "^@/lib/services/users$": "<rootDir>/src/lib/services/users.ts",
    "^@/lib/services/(.*)$": "<rootDir>/src/lib/services/$1",
    // Correctly handle @tanstack/react-query imports
    "^@tanstack/react-query$": "<rootDir>/node_modules/@tanstack/react-query/build/modern/index.js",
    "^@tanstack/react-query/(.*)$": "<rootDir>/node_modules/@tanstack/react-query/build/modern/$1"
  },
  preset: "ts-jest", // Use ts-jest preset
  transform: {
    // Use ts-jest for .ts/.tsx files
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
  ],
  testMatch: [
    // Match only integration test files
    "**/?(*.)+(integration|integration.spec|integration.test).[jt]s?(x)",
    "**/tests/integration/**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  // Clear all mocks between tests
  clearMocks: true,
  // Enable test coverage for integration tests
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/types/**/*",
    "!src/pages/_app.tsx",
    "!src/pages/_document.tsx",
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  // Generate coverage reports even if threshold failed
  coverageReporters: ["json", "lcov", "text", "clover"],
  // Maximum test timeout
  testTimeout: 30000,
  
  // Resolve Haste module naming collision between package.json files
  modulePathIgnorePatterns: [
    "<rootDir>/new-deploy/",
    "<rootDir>/new-deploy 2/"
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);