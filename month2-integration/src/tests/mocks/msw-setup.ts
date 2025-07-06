/**
 * Mock Service Worker setup for test environment
 * This file configures the MSW server for mocking API and GraphQL requests during tests
 */

// Set up TextEncoder and TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

import { setupServer } from 'msw/node';
import { handlers } from './msw-handlers';

/**
 * MSW server instance with all request handlers
 * Import and use this in individual test files when you need
 * to override handlers or add specific handlers for a test
 */
export const server = setupServer(...handlers);

// Configure global setup and teardown hooks for Jest
// These will be automatically called by Jest's setup process
// Do not manually invoke these functions in tests

/**
 * Set up MSW before tests run to intercept API/GraphQL calls
 * This is automatically called by Jest before all tests run
 */
export function startMSWServer() {
  // Start the server and listen to requests before all tests
  server.listen({ onUnhandledRequest: 'warn' });
  console.log('🔶 MSW server started');

  // Reset server handlers after each test
  beforeEach(() => {
    console.log('❇️ Resetting MSW handlers for next test');
  });

  // Reset handlers after each test
  afterEach(() => {
    server.resetHandlers();
  });

  // Clean up after all tests are complete
  afterAll(() => {
    server.close();
    console.log('🔶 MSW server closed');
  });
}

/**
 * Add custom handlers for a specific test
 * @param customHandlers Array of HTTP/GraphQL handlers to add
 * @returns Function to restore original handlers
 * 
 * @example
 * // In your test file
 * import { server, addCustomHandlers } from '../mocks/msw-setup';
 * import { http, graphql } from 'msw';
 * 
 * test('my test with custom handlers', async () => {
 *   // Add custom handlers for this test only
 *   const restore = addCustomHandlers([
 *     http.get('/api/custom', () => new HttpResponse({ status: 200, data: customData }))
 *   ]);
 *   
 *   // Run test...
 *   
 *   // Restore original handlers when done
 *   restore();
 * });
 */
export function addCustomHandlers(customHandlers: any[]) {
  // Store current handlers
  const originalHandlers = [...server.listHandlers()];
  
  // Use the custom handlers
  server.use(...customHandlers);
  
  // Return function to restore original handlers
  return () => {
    server.resetHandlers();
    server.use(...originalHandlers);
  };
}

// Export server for individual tests to add/override handlers
export { server };