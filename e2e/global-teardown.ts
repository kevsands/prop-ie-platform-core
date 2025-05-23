import { FullConfig } from '@playwright/test';

/**
 * Global teardown for E2E tests
 * Runs once after all tests
 */
async function globalTeardown(config: FullConfig) {
  console.log('Cleaning up test data...');
  
  // Clean up test data if needed
  // This could include:
  // - Removing test users
  // - Clearing test transactions
  // - Resetting database state
  
  console.log('Test cleanup complete');
}

export default globalTeardown;