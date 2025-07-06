/**
 * environment-test-utils.ts
 * Utilities for mocking environment variables and related functionality in tests
 */

// Database test defaults to provide consistent environment for tests
export enum PostgresDefaults {
  HOST = 'localhost',
  PORT = '5432',
  DB = 'propie_test',
  USER = 'postgres',
  PASSWORD = 'postgres',
  POOL_MAX = '5',
  IDLE_TIMEOUT = '10000',
  CONNECT_TIMEOUT = '1000',
  SSL = 'false'
}

// Common environment variable keys for database configuration
export enum EnvKeys {
  NODE_ENV = 'NODE_ENV',
  POSTGRES_HOST = 'POSTGRES_HOST',
  POSTGRES_PORT = 'POSTGRES_PORT',
  POSTGRES_DB = 'POSTGRES_DB',
  POSTGRES_USER = 'POSTGRES_USER',
  POSTGRES_PASSWORD = 'POSTGRES_PASSWORD',
  POSTGRES_POOL_MAX = 'POSTGRES_POOL_MAX',
  POSTGRES_IDLE_TIMEOUT = 'POSTGRES_IDLE_TIMEOUT',
  POSTGRES_CONNECT_TIMEOUT = 'POSTGRES_CONNECT_TIMEOUT',
  POSTGRES_SSL = 'POSTGRES_SSL',
  TEST = 'test'
}

/**
 * Type for environment variable storage
 * Ensures type safety when accessing process.env
 */
type EnvVarStore = Record<string, string | undefined>;

/**
 * Gets an environment variable with fallback to default test values
 * @param key Environment variable key
 * @param defaultValue Optional default value if not found
 * @returns The environment variable value or default
 */
export function getEnvironmentVariable(key: string, defaultValue: string = ''): string {
  // For tests, we'll prioritize actual environment variables if set
  if (process.env[key]) {
    return process.env[key] as string;
  }
  
  // Return test-specific defaults for database connections using the enum
  switch (key) {
    case EnvKeys.POSTGRES_HOST:
      return PostgresDefaults.HOST;
    case EnvKeys.POSTGRES_PORT:
      return PostgresDefaults.PORT;
    case EnvKeys.POSTGRES_DB:
      return PostgresDefaults.DB;
    case EnvKeys.POSTGRES_USER:
      return PostgresDefaults.USER;
    case EnvKeys.POSTGRES_PASSWORD:
      return PostgresDefaults.PASSWORD;
    case EnvKeys.POSTGRES_POOL_MAX:
      return PostgresDefaults.POOL_MAX;
    case EnvKeys.POSTGRES_IDLE_TIMEOUT:
      return PostgresDefaults.IDLE_TIMEOUT;
    case EnvKeys.POSTGRES_CONNECT_TIMEOUT:
      return PostgresDefaults.CONNECT_TIMEOUT;
    case EnvKeys.POSTGRES_SSL:
      return PostgresDefaults.SSL;
    case EnvKeys.NODE_ENV:
      return EnvKeys.TEST;
    default:
      return defaultValue;
  }
}

/**
 * Mock environment variables for tests
 * @param mockedVariables Record of environment variables to mock
 * @returns Function to restore original environment
 */
export function mockEnvironmentVariables(mockedVariables: Record<string, string>): () => void {
  // Create a deep copy of the original environment to ensure we can restore it
  const originalEnv: EnvVarStore = { ...process.env };
  
  // Set up test environment variables
  Object.entries(mockedVariables).forEach(([key, value]) => {
    if (value !== undefined) {
      process.env[key] = value;
    }
  });
  
  // Return function to restore original environment
  return () => {
    // Restore original environment
    // This ensures we don't leave any test values in the environment
    process.env = originalEnv;
  };
}

/**
 * Standard test database configuration
 */
export interface TestDatabaseConfig {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
  poolMax: string;
  idleTimeout: string;
  connectTimeout: string;
  ssl: string;
}

/**
 * Get the standard test database configuration
 * @returns Database configuration object for tests
 */
export function getTestDatabaseConfig(): TestDatabaseConfig {
  return {
    host: PostgresDefaults.HOST,
    port: PostgresDefaults.PORT,
    database: PostgresDefaults.DB,
    user: PostgresDefaults.USER,
    password: PostgresDefaults.PASSWORD,
    poolMax: PostgresDefaults.POOL_MAX,
    idleTimeout: PostgresDefaults.IDLE_TIMEOUT,
    connectTimeout: PostgresDefaults.CONNECT_TIMEOUT,
    ssl: PostgresDefaults.SSL
  };
}

/**
 * Setup test environment for database tests
 * Configures test-specific database connection parameters
 * @param customConfig Optional custom database configuration
 * @returns Function to restore original environment
 */
export function setupTestDatabaseEnvironment(
  customConfig: Partial<TestDatabaseConfig> = {}
): () => void {
  const config = {
    ...getTestDatabaseConfig(),
    ...customConfig
  };
  
  return mockEnvironmentVariables({
    [EnvKeys.POSTGRES_HOST]: config.host, 
    [EnvKeys.POSTGRES_PORT]: config.port,
    [EnvKeys.POSTGRES_DB]: config.database,
    [EnvKeys.POSTGRES_USER]: config.user,
    [EnvKeys.POSTGRES_PASSWORD]: config.password,
    [EnvKeys.POSTGRES_POOL_MAX]: config.poolMax,
    [EnvKeys.POSTGRES_IDLE_TIMEOUT]: config.idleTimeout,
    [EnvKeys.POSTGRES_CONNECT_TIMEOUT]: config.connectTimeout,
    [EnvKeys.POSTGRES_SSL]: config.ssl,
    [EnvKeys.NODE_ENV]: EnvKeys.TEST
  });
}

// Export default for backward compatibility
export default {
  getEnvironmentVariable,
  mockEnvironmentVariables,
  setupTestDatabaseEnvironment
};