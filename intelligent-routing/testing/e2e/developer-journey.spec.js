
import { test, expect } from '@playwright/test';

test.describe('Developer Property Management Journey', () => {
  test('Complete developer workflow from login to analytics', async ({ page }) => {
    // 1. Access developer portal
    await page.goto('/developer/overview');
    
    // 2. Login with developer test user
    await page.click('text=Login');
    await page.fill('[data-testid="email"]', 'developer.test@staging.prop.ie');
    await page.click('[data-testid="login-button"]');
    
    // 3. View project dashboard
    await expect(page.locator('[data-testid="project-dashboard"]')).toBeVisible();
    await expect(page.locator('text=Staging Gardens Development')).toBeVisible();
    
    // 4. Access project analytics
    await page.click('text=Analytics');
    await expect(page.locator('[data-testid="sales-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="revenue-metrics"]')).toBeVisible();
    
    // 5. Review HTB applications
    await page.click('text=HTB Applications');
    await expect(page.locator('[data-testid="htb-applications-table"]')).toBeVisible();
    
    // 6. Update property information
    await page.click('text=Properties');
    await page.click('[data-testid="edit-property"]:first-child');
    await page.fill('[data-testid="property-description"]', 'Updated staging description');
    await page.click('[data-testid="save-property"]');
    
    // 7. Generate sales report
    await page.click('text=Reports');
    await page.click('[data-testid="generate-sales-report"]');
    await expect(page.locator('text=Report Generated')).toBeVisible();
  });
});
