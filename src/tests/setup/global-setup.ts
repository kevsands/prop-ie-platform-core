/**
 * Enterprise Global Test Setup
 * Configures enterprise testing environment and infrastructure
 */

import { GlobalConfig } from '@jest/types';

const globalSetup = async (globalConfig: GlobalConfig): Promise<void> => {
  console.log('🚀 Setting up PropIE Enterprise Test Environment...');
  
  // Set enterprise test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_APP_ENV = 'test';
  process.env.DATABASE_URL = 'file:./test.db';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-enterprise-testing';
  
  // Mock Irish government service endpoints for testing
  process.env.REVENUE_API_ENDPOINT = 'https://mock-revenue.test.ie';
  process.env.LAND_REGISTRY_API_ENDPOINT = 'https://mock-landregistry.test.ie';
  process.env.PSRA_API_ENDPOINT = 'https://mock-psra.test.ie';
  
  // Enterprise testing configuration
  process.env.ALLOW_MOCK_AUTH = 'true';
  process.env.MOCK_EXTERNAL_SERVICES = 'true';
  process.env.TEST_DATABASE_RESET = 'true';
  
  // Initialize test database for TaskOrchestrationEngine testing
  try {
    const { setupTestDatabase } = await import('../utils/test-database');
    await setupTestDatabase();
    console.log('✅ Test database initialized for TaskOrchestrationEngine');
  } catch (error) {
    console.warn('⚠️ Could not initialize test database:', error);
  }
  
  // Setup mock services for enterprise testing
  try {
    const { setupMockServices } = await import('../mocks/mock-services');
    await setupMockServices();
    console.log('✅ Mock Irish government services initialized');
  } catch (error) {
    console.warn('⚠️ Could not setup mock services:', error);
  }
  
  console.log('✅ PropIE Enterprise Test Environment Ready');
};

export default globalSetup;