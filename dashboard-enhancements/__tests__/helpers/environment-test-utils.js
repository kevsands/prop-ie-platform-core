"use strict";
/**
 * environment-test-utils.ts
 * Utilities for mocking environment variables and related functionality in tests
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentVariable = getEnvironmentVariable;
exports.mockEnvironmentVariables = mockEnvironmentVariables;
exports.setupTestDatabaseEnvironment = setupTestDatabaseEnvironment;
// Mock implementation of getEnvironmentVariable
function getEnvironmentVariable(key, defaultValue) {
    if (defaultValue === void 0) { defaultValue = ''; }
    // For tests, we'll prioritize actual environment variables if set
    if (process.env[key]) {
        return process.env[key];
    }
    // Return test-specific defaults for database connections
    if (key === 'POSTGRES_HOST')
        return 'localhost';
    if (key === 'POSTGRES_PORT')
        return '5432';
    if (key === 'POSTGRES_DB')
        return 'propie_test';
    if (key === 'POSTGRES_USER')
        return 'postgres';
    if (key === 'POSTGRES_PASSWORD')
        return 'postgres';
    if (key === 'POSTGRES_POOL_MAX')
        return '5';
    if (key === 'POSTGRES_IDLE_TIMEOUT')
        return '10000';
    if (key === 'POSTGRES_CONNECT_TIMEOUT')
        return '1000';
    if (key === 'POSTGRES_SSL')
        return 'false';
    if (key === 'NODE_ENV')
        return 'test';
    // Return provided default value for other keys
    return defaultValue;
}
/**
 * Mock environment variables for tests
 * @param mockedVariables Record of environment variables to mock
 * @returns Function to restore original environment
 */
function mockEnvironmentVariables(mockedVariables) {
    var originalEnv = __assign({}, process.env);
    // Set up test environment variables
    Object.entries(mockedVariables).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        process.env[key] = value;
    });
    // Return function to restore original environment
    return function () {
        // Restore original environment
        process.env = originalEnv;
    };
}
/**
 * Setup test environment for database tests
 * Configures test-specific database connection parameters
 */
function setupTestDatabaseEnvironment() {
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
exports.default = {
    getEnvironmentVariable: getEnvironmentVariable,
    mockEnvironmentVariables: mockEnvironmentVariables,
    setupTestDatabaseEnvironment: setupTestDatabaseEnvironment
};
