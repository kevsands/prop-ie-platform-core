
import { test, expect } from '@playwright/test';

test.describe('Estate Agent Client Management Journey', () => {
  test('Complete agent workflow for client assistance', async ({ page }) => {
    // 1. Access agent portal
    await page.goto('/professionals/estate-agents');
    await page.click('text=Agent Portal');
    
    // 2. Login with agent test user
    await page.click('text=Login');
    await page.fill('[data-testid="email"]', 'agent.test@staging.prop.ie');
    await page.click('[data-testid="login-button"]');
    
    // 3. View client pipeline
    await expect(page.locator('[data-testid="client-pipeline"]')).toBeVisible();
    
    // 4. Add new client
    await page.click('[data-testid="add-client"]');
    await page.fill('[data-testid="client-name"]', 'Test Client');
    await page.fill('[data-testid="client-email"]', 'testclient@staging.prop.ie');
    await page.click('[data-testid="save-client"]');
    
    // 5. Assist client with property search
    await page.click('[data-testid="assist-search"]');
    await page.fill('[data-testid="search-criteria"]', 'Dublin apartment');
    await page.click('[data-testid="find-properties"]');
    
    // 6. Submit client application
    await page.click('[data-testid="submit-application"]');
    await page.fill('[data-testid="application-notes"]', 'Staging test application');
    await page.click('[data-testid="confirm-submission"]');
    
    // 7. Track commission status
    await page.click('text=Commission');
    await expect(page.locator('[data-testid="commission-tracker"]')).toBeVisible();
  });
});
