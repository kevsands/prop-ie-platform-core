
import { test, expect } from '@playwright/test';

test.describe('First-Time Buyer Complete Journey', () => {
  test('Complete buyer workflow from search to reservation', async ({ page }) => {
    // 1. Navigate to homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/PROP.ie/);
    
    // 2. Access buyer portal
    await page.click('text=First-Time Buyers');
    await page.waitForURL('/buyer/first-time-buyers/welcome');
    
    // 3. Login with test user (mock auth)
    await page.click('text=Login');
    await page.fill('[data-testid="email"]', 'buyer.test@staging.prop.ie');
    await page.click('[data-testid="login-button"]');
    
    // 4. Search for properties
    await page.click('text=Search Properties');
    await page.fill('[data-testid="search-input"]', 'Dublin');
    await page.click('[data-testid="search-button"]');
    
    // 5. View property details
    await page.click('[data-testid="property-card"]:first-child');
    await expect(page.locator('[data-testid="property-title"]')).toBeVisible();
    
    // 6. Add to favorites
    await page.click('[data-testid="favorite-button"]');
    await expect(page.locator('text=Added to favorites')).toBeVisible();
    
    // 7. Start HTB application
    await page.click('text=Apply for Help to Buy');
    await page.fill('[data-testid="htb-amount"]', '135000');
    await page.click('[data-testid="submit-htb"]');
    
    // 8. Make reservation
    await page.click('text=Reserve Property');
    await page.fill('[data-testid="reservation-deposit"]', '5000');
    await page.click('[data-testid="confirm-reservation"]');
    
    // 9. Verify completion
    await expect(page.locator('text=Reservation Confirmed')).toBeVisible();
  });
});
