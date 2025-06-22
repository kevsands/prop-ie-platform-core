/**
 * Enterprise Global Test Teardown
 * Cleans up enterprise testing environment and resources
 */

import { GlobalConfig } from '@jest/types';

const globalTeardown = async (globalConfig: GlobalConfig): Promise<void> => {
  console.log('🧹 Cleaning up PropIE Enterprise Test Environment...');
  
  // Cleanup test database
  try {
    const { cleanupTestDatabase } = await import('../utils/test-database');
    await cleanupTestDatabase();
    console.log('✅ Test database cleaned up');
  } catch (error) {
    console.warn('⚠️ Could not cleanup test database:', error);
  }
  
  // Cleanup mock services
  try {
    const { cleanupMockServices } = await import('../mocks/mock-services');
    await cleanupMockServices();
    console.log('✅ Mock services cleaned up');
  } catch (error) {
    console.warn('⚠️ Could not cleanup mock services:', error);
  }
  
  // Clear test environment variables
  delete process.env.TEST_DATABASE_RESET;
  delete process.env.MOCK_EXTERNAL_SERVICES;
  delete process.env.ALLOW_MOCK_AUTH;
  
  console.log('✅ PropIE Enterprise Test Environment Cleaned');
};

export default globalTeardown;