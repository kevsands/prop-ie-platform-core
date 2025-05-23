import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for E2E tests
 * Runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for application to be ready
    await page.goto(baseURL!);
    await page.waitForLoadState('networkidle');
    
    // Create test users and data
    console.log('Setting up test data...');
    
    // Create admin user for tests
    await page.goto(`${baseURL}/api/create-test-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'e2e-admin@test.com',
        password: 'E2E-Test-Pass-123!',
        name: 'E2E Admin',
        roles: ['admin', 'developer'],
      }),
    });
    
    // Create buyer user for tests
    await page.goto(`${baseURL}/api/create-test-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'e2e-buyer@test.com',
        password: 'E2E-Test-Pass-123!',
        name: 'E2E Buyer',
        roles: ['buyer'],
      }),
    });
    
    // Save auth state for reuse
    await page.goto(`${baseURL}/auth/login`);
    await page.fill('[name="email"]', 'e2e-admin@test.com');
    await page.fill('[name="password"]', 'E2E-Test-Pass-123!');
    await page.click('[type="submit"]');
    
    // Wait for login to complete
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Save authentication state
    await page.context().storageState({ path: 'e2e/.auth/admin.json' });
    
    console.log('Test data setup complete');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;