// jest.config.js
const nextJest = require("next/jest");

// Providing the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import("jest").Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "<rootDir>/src/test-utils.tsx",
    "jest-extended"
  ],
  // DOM setup for node environment tests that need DOM
  setupFiles: [
    "<rootDir>/jest.dom.setup.js",
    "<rootDir>/src/tests/mocks/jsdom-setup.js"
  ],
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
    "^@tanstack/react-query$": "<rootDir>/node_modules/@tanstack/react-query/build/lib/index.js",
    "^@tanstack/react-query/(.*)$": "<rootDir>/node_modules/@tanstack/react-query/build/lib/$1"
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
    "<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}"
  ],
  // Use ts-jest for TypeScript files and babel-jest for JS files
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: "tsconfig.jest.json",
      isolatedModules: false,
      diagnostics: {
        ignoreCodes: [
          1343, // TS1343: The 'import.meta' meta-property is only allowed...
          2304, // TS2304: Cannot find name...
          2322, // TS2322: Type ... is not assignable to type ...
          2339, // TS2339: Property ... does not exist on type ...
          2554  // TS2554: Expected ... arguments, but got ...
        ],
        warnOnly: true
      }
    }],
    "^.+\\.(js|jsx)$": ["babel-jest", { 
      configFile: "./babel.config.js" 
    }]
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@tanstack|react-query|msw|@react-three)).+\\.js$",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/out/",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },
  
  // Enable test coverage collection
  collectCoverage: true,
  
  // Specify which files to collect coverage from
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    // Exclude certain files and directories
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
  ],
  
  // Set enterprise-grade coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80, 
      lines: 80,
      statements: 80,
    },
    // Critical enterprise modules require highest coverage
    "./src/services/**/*.{ts,tsx}": {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
    "./src/lib/security/**/*.{ts,tsx}": {
      statements: 95,
      branches: 90,
      functions: 95,
      lines: 95,
    },
    "./src/lib/services/**/*.{ts,tsx}": {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },
    "./src/components/auth/**/*.{ts,tsx}": {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
    "./src/app/api/**/*.{ts,tsx}": {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85,
    },
  },
  
  // Enterprise coverage reporting configuration
  coverageReporters: [
    "json",
    "lcov",     // Generates lcov.info file for SonarQube integration
    "text",     // Plain text summary output
    "text-summary", // Brief summary
    "clover",   // Clover format XML file
    "cobertura", // Cobertura format XML file for CI/CD integrations
    "html",     // HTML report for developers
    "json-summary", // JSON summary for enterprise reporting
  ],
  
  // Coverage output directory
  coverageDirectory: "<rootDir>/coverage",
  
  // Path to coverage results processor
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/test-utils/",
    "<rootDir>/src/tests/",
    "<rootDir>/src/**/*.stories.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.d.ts",
  ],
  
  // Cache test results for faster reruns
  cache: true,
  
  // Allow tests to detect open handles
  detectOpenHandles: true,
  
  // Force tests to exit after completion
  forceExit: true,
  
  // Enterprise test timeout configuration
  testTimeout: 60000, // Extended for integration tests
  
  // Jest worker configuration for enterprise CI/CD
  maxWorkers: process.env.CI ? 2 : "50%",
  
  // Enterprise test result processing
  reporters: [
    "default",
    ["jest-junit", {
      outputDirectory: "<rootDir>/test-results",
      outputName: "junit.xml",
      uniqueOutputName: "false",
      suiteName: "PropIE Enterprise Test Suite",
      classNameTemplate: "{classname}",
      titleTemplate: "{title}",
      ancestorSeparator: " › ",
      usePathForSuiteName: "true"
    }],
    ["@jest/reporters", {
      verbose: true
    }]
  ],
  
  // Set verbosity of test output
  verbose: true,
  
  // Add module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  
  // Enterprise test environment variables
  testEnvironmentOptions: {
    url: "http://localhost:3000"
  },
  
  // Global test setup for enterprise testing
  globalSetup: "<rootDir>/src/tests/setup/global-setup.ts",
  globalTeardown: "<rootDir>/src/tests/setup/global-teardown.ts",
  
  // Resolve Haste module naming collision between package.json files
  modulePathIgnorePatterns: [
    "<rootDir>/new-deploy/",
    "<rootDir>/new-deploy 2/"
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
