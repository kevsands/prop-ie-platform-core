import { test, expect, waitForToast, formatCurrency } from './fixtures';

/**
 * E2E tests for complete buyer journey
 */
test.describe('Buyer Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete property purchase flow', async ({ buyerPage }) => {
    // Step 1: Search for properties
    await test.step('Search for properties', async () => {
      await buyerPage.goto('/properties/search');
      
      // Set search filters
      await buyerPage.fill('[name="location"]', 'Dublin');
      await buyerPage.selectOption('[name="propertyType"]', 'apartment');
      await buyerPage.fill('[name="minPrice"]', '200000');
      await buyerPage.fill('[name="maxPrice"]', '400000');
      await buyerPage.selectOption('[name="bedrooms"]', '2');
      
      await buyerPage.click('[data-testid="search-button"]');
      
      // Wait for results
      await buyerPage.waitForSelector('[data-testid="property-card"]');
      
      // Verify results
      const results = await buyerPage.$$('[data-testid="property-card"]');
      expect(results.length).toBeGreaterThan(0);
    });

    // Step 2: View property details
    await test.step('View property details', async () => {
      // Click first property
      await buyerPage.click('[data-testid="property-card"]:first-child');
      
      // Wait for property page
      await buyerPage.waitForURL('**/properties/*');
      
      // Verify property details are displayed
      await expect(buyerPage.locator('h1')).toBeVisible();
      await expect(buyerPage.locator('[data-testid="property-price"]')).toBeVisible();
      await expect(buyerPage.locator('[data-testid="property-features"]')).toBeVisible();
      
      // Check virtual tour if available
      const virtualTourButton = buyerPage.locator('[data-testid="virtual-tour-button"]');
      if (await virtualTourButton.isVisible()) {
        await virtualTourButton.click();
        await expect(buyerPage.locator('[data-testid="virtual-tour-modal"]')).toBeVisible();
        await buyerPage.click('[data-testid="close-modal"]');
      }
    });

    // Step 3: Customize property
    await test.step('Customize property', async () => {
      await buyerPage.click('[data-testid="customize-button"]');
      
      // Select customizations
      await buyerPage.click('[data-testid="flooring-option-hardwood"]');
      await buyerPage.click('[data-testid="kitchen-option-premium"]');
      await buyerPage.click('[data-testid="bathroom-option-luxury"]');
      
      // Verify price updates
      const totalPrice = await buyerPage.textContent('[data-testid="total-price"]');
      expect(totalPrice).toContain('€');
      
      await buyerPage.click('[data-testid="save-customizations"]');
      await waitForToast(buyerPage, 'Customizations saved');
    });

    // Step 4: Reserve property
    await test.step('Reserve property', async () => {
      await buyerPage.click('[data-testid="reserve-button"]');
      
      // Fill reservation form
      await buyerPage.fill('[name="reservationAmount"]', '5000');
      await buyerPage.check('[name="agreeToTerms"]');
      
      await buyerPage.click('[data-testid="confirm-reservation"]');
      
      // Handle payment
      await buyerPage.waitForURL('**/payment');
      await buyerPage.fill('[name="cardNumber"]', '4242424242424242');
      await buyerPage.fill('[name="expiryDate"]', '12/25');
      await buyerPage.fill('[name="cvv"]', '123');
      
      await buyerPage.click('[data-testid="pay-button"]');
      
      // Wait for confirmation
      await buyerPage.waitForURL('**/reservation-confirmed');
      await expect(buyerPage.locator('h1')).toContainText('Reservation Confirmed');
    });

    // Step 5: Complete KYC
    await test.step('Complete KYC verification', async () => {
      await buyerPage.goto('/buyer/kyc-verification');
      
      // Upload documents
      await buyerPage.setInputFiles('[name="passport"]', 'e2e/fixtures/passport.pdf');
      await buyerPage.setInputFiles('[name="proofOfAddress"]', 'e2e/fixtures/utility-bill.pdf');
      await buyerPage.setInputFiles('[name="bankStatement"]', 'e2e/fixtures/bank-statement.pdf');
      
      await buyerPage.click('[data-testid="submit-kyc"]');
      await waitForToast(buyerPage, 'Documents uploaded successfully');
    });

    // Step 6: Sign contract
    await test.step('Sign purchase contract', async () => {
      await buyerPage.goto('/buyer/transactions');
      await buyerPage.click('[data-testid="transaction-row"]:first-child');
      
      // Review contract
      await buyerPage.click('[data-testid="view-contract"]');
      await buyerPage.waitForSelector('[data-testid="contract-viewer"]');
      
      // Scroll through contract
      await buyerPage.evaluate(() => {
        const viewer = document.querySelector('[data-testid="contract-viewer"]');
        viewer?.scrollTo(0, viewer.scrollHeight);
      });
      
      // Sign contract
      await buyerPage.click('[data-testid="sign-contract"]');
      await buyerPage.fill('[name="signature"]', 'E2E Buyer');
      await buyerPage.click('[data-testid="confirm-signature"]');
      
      await waitForToast(buyerPage, 'Contract signed successfully');
    });

    // Step 7: Make deposit payment
    await test.step('Make deposit payment', async () => {
      const depositAmount = 35000; // 10% of 350,000
      
      await buyerPage.click('[data-testid="make-payment"]');
      
      // Verify payment details
      await expect(buyerPage.locator('[data-testid="payment-amount"]')).toContainText(
        formatCurrency(depositAmount)
      );
      
      // Select payment method
      await buyerPage.click('[data-testid="payment-method-bank-transfer"]');
      
      // Get bank details
      const bankDetails = await buyerPage.textContent('[data-testid="bank-details"]');
      expect(bankDetails).toContain('IBAN');
      expect(bankDetails).toContain('BIC');
      
      // Simulate payment confirmation
      await buyerPage.click('[data-testid="confirm-payment-sent"]');
      await waitForToast(buyerPage, 'Payment confirmation received');
    });

    // Step 8: Track transaction progress
    await test.step('Track transaction progress', async () => {
      await buyerPage.goto('/buyer/transactions/current');
      
      // Verify milestones
      await expect(buyerPage.locator('[data-testid="milestone-reservation"]')).toHaveClass(/completed/);
      await expect(buyerPage.locator('[data-testid="milestone-kyc"]')).toHaveClass(/completed/);
      await expect(buyerPage.locator('[data-testid="milestone-contract"]')).toHaveClass(/completed/);
      await expect(buyerPage.locator('[data-testid="milestone-deposit"]')).toHaveClass(/in-progress/);
      
      // Check timeline
      const timelineEvents = await buyerPage.$$('[data-testid="timeline-event"]');
      expect(timelineEvents.length).toBeGreaterThan(5);
    });
  });

  test('property comparison feature', async ({ page }) => {
    await page.goto('/properties/search');
    
    // Add properties to comparison
    const properties = page.locator('[data-testid="property-card"]');
    await properties.nth(0).locator('[data-testid="compare-checkbox"]').check();
    await properties.nth(1).locator('[data-testid="compare-checkbox"]').check();
    await properties.nth(2).locator('[data-testid="compare-checkbox"]').check();
    
    // Open comparison view
    await page.click('[data-testid="compare-button"]');
    
    // Verify comparison table
    await expect(page.locator('[data-testid="comparison-table"]')).toBeVisible();
    await expect(page.locator('[data-testid="comparison-property"]')).toHaveCount(3);
    
    // Check features comparison
    await expect(page.locator('[data-testid="price-row"]')).toBeVisible();
    await expect(page.locator('[data-testid="bedrooms-row"]')).toBeVisible();
    await expect(page.locator('[data-testid="size-row"]')).toBeVisible();
  });

  test('mortgage calculator', async ({ page }) => {
    await page.goto('/properties/1');
    
    await page.click('[data-testid="mortgage-calculator-button"]');
    
    // Fill calculator inputs
    await page.fill('[name="loanAmount"]', '315000'); // 90% of 350,000
    await page.fill('[name="interestRate"]', '3.5');
    await page.selectOption('[name="loanTerm"]', '30');
    
    await page.click('[data-testid="calculate-button"]');
    
    // Verify results
    const monthlyPayment = await page.textContent('[data-testid="monthly-payment"]');
    expect(monthlyPayment).toMatch(/€1,4\d{2}/); // Should be around €1,400-1,500
    
    // Check affordability
    await page.fill('[name="monthlyIncome"]', '5000');
    await page.click('[data-testid="check-affordability"]');
    
    const affordabilityResult = await page.textContent('[data-testid="affordability-result"]');
    expect(affordabilityResult).toContain('affordable');
  });

  test('save and manage favorite properties', async ({ buyerPage }) => {
    await buyerPage.goto('/properties/search');
    
    // Add properties to favorites
    const properties = buyerPage.locator('[data-testid="property-card"]');
    await properties.nth(0).locator('[data-testid="favorite-button"]').click();
    await properties.nth(2).locator('[data-testid="favorite-button"]').click();
    await properties.nth(4).locator('[data-testid="favorite-button"]').click();
    
    // Go to favorites
    await buyerPage.goto('/buyer/favorites');
    
    // Verify favorites
    await expect(buyerPage.locator('[data-testid="favorite-property"]')).toHaveCount(3);
    
    // Create collection
    await buyerPage.click('[data-testid="create-collection"]');
    await buyerPage.fill('[name="collectionName"]', 'Dream Homes');
    await buyerPage.click('[data-testid="save-collection"]');
    
    // Add to collection
    await buyerPage.locator('[data-testid="favorite-property"]').nth(0)
      .locator('[data-testid="add-to-collection"]').click();
    await buyerPage.selectOption('[name="collection"]', 'Dream Homes');
    await buyerPage.click('[data-testid="confirm-add"]');
    
    await waitForToast(buyerPage, 'Added to collection');
  });

  test('schedule property viewings', async ({ buyerPage }) => {
    await buyerPage.goto('/properties/1');
    
    await buyerPage.click('[data-testid="schedule-viewing"]');
    
    // Select date and time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await buyerPage.click('[data-testid="viewing-date"]');
    await buyerPage.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    
    await buyerPage.click('[data-testid="viewing-time-14:00"]');
    
    // Add message
    await buyerPage.fill('[name="message"]', 'Looking forward to viewing this property');
    
    await buyerPage.click('[data-testid="confirm-viewing"]');
    
    await waitForToast(buyerPage, 'Viewing scheduled successfully');
    
    // Check calendar
    await buyerPage.goto('/buyer/viewings');
    await expect(buyerPage.locator('[data-testid="viewing-appointment"]')).toHaveCount(1);
  });
});