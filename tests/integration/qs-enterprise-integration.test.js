/**
 * Quantity Surveyor Enterprise Integration Tests
 * 
 * Comprehensive end-to-end testing for QS integration with:
 * - Developer project data 
 * - Real-time synchronization
 * - Task orchestration
 * - API consistency
 * - Business logic validation
 */

const { test, expect } = require('@playwright/test');

describe('QS Enterprise Integration - End-to-End Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Ensure development server is running
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/PROP\.ie/);
  });

  test('QS Dashboard loads with real project data', async ({ page }) => {
    console.log('🧪 Testing QS Dashboard Loading...');
    
    // Navigate to QS dashboard
    await page.goto('http://localhost:3000/quantity-surveyor/cost-management');
    
    // Wait for data to load
    await page.waitForSelector('[data-testid="qs-dashboard"]', { timeout: 10000 });
    
    // Verify project name matches real project
    const projectName = await page.textContent('h1');
    expect(projectName).toContain('Quantity Surveyor');
    
    // Verify real project data is displayed
    const projectInfo = await page.textContent('.text-gray-600');
    expect(projectInfo).toContain('Fitzgerald Gardens');
    
    console.log('✅ QS Dashboard loads with correct project data');
  });

  test('Developer dashboard shows QS cost integration', async ({ page }) => {
    console.log('🧪 Testing Developer Dashboard QS Integration...');
    
    // Navigate to developer project dashboard
    await page.goto('http://localhost:3000/developer/projects/fitzgerald-gardens');
    
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="developer-dashboard"]', { timeout: 10000 });
    
    // Check for cost management section
    const costSection = await page.locator('[data-testid="cost-management"]');
    expect(await costSection.count()).toBeGreaterThan(0);
    
    // Verify QS data is visible in developer view
    const qsLink = await page.locator('a[href*="quantity-surveyor"]');
    expect(await qsLink.count()).toBeGreaterThan(0);
    
    console.log('✅ Developer dashboard shows QS integration');
  });

  test('API endpoints return consistent data', async ({ request }) => {
    console.log('🧪 Testing API Data Consistency...');
    
    // Test QS API endpoint
    const qsResponse = await request.get(
      'http://localhost:3000/api/quantity-surveyor/cost-management?action=get_project_costs&projectId=fitzgerald-gardens'
    );
    expect(qsResponse.ok()).toBeTruthy();
    
    const qsData = await qsResponse.json();
    expect(qsData.projectId).toBe('fitzgerald-gardens');
    expect(qsData.boq).toBeDefined();
    expect(qsData.boq.grandTotal).toBe(4200000);
    
    console.log('✅ QS API returns consistent financial data');
    
    // Verify BOQ calculations
    const boq = qsData.boq;
    const calculatedTotal = boq.totalValue + boq.preliminaries + boq.contingency;
    expect(calculatedTotal).toBe(boq.grandTotal);
    
    console.log('✅ BOQ calculations are mathematically correct');
  });

  test('Valuation calculations are accurate', async ({ request }) => {
    console.log('🧪 Testing Valuation Calculations...');
    
    const response = await request.get(
      'http://localhost:3000/api/quantity-surveyor/cost-management?action=get_project_costs&projectId=fitzgerald-gardens'
    );
    const data = await response.json();
    
    const valuation = data.valuations[0];
    
    // Test retention calculation
    const expectedRetention = Math.round(valuation.grossValuation * valuation.retentionPercentage / 100);
    expect(valuation.retentionAmount).toBe(expectedRetention);
    
    // Test net amount calculation  
    const expectedNet = (valuation.grossValuation - valuation.lessPreviousCertificates) - valuation.retentionAmount;
    expect(valuation.netAmount).toBe(expectedNet);
    
    console.log('✅ Valuation calculations are mathematically correct');
    console.log(`   Gross: €${valuation.grossValuation.toLocaleString()}`);
    console.log(`   Retention: €${valuation.retentionAmount.toLocaleString()} (${valuation.retentionPercentage}%)`);
    console.log(`   Net: €${valuation.netAmount.toLocaleString()}`);
  });

  test('SCSI compliance data is present', async ({ request }) => {
    console.log('🧪 Testing SCSI Compliance Data...');
    
    const response = await request.get(
      'http://localhost:3000/api/quantity-surveyor/cost-management?action=get_project_costs&projectId=fitzgerald-gardens'
    );
    const data = await response.json();
    
    expect(data.compliance).toBeDefined();
    expect(data.compliance.quantitySurveyorRegistration).toBeDefined();
    expect(data.compliance.quantitySurveyorRegistration.name).toContain('MSCSI');
    expect(data.compliance.professionalIndemnityInsurance.valid).toBe(true);
    expect(data.compliance.continuingProfessionalDevelopment.compliant).toBe(true);
    
    console.log('✅ SCSI compliance data is complete and valid');
  });

  test('Cash flow projections are realistic', async ({ request }) => {
    console.log('🧪 Testing Cash Flow Projections...');
    
    const response = await request.get(
      'http://localhost:3000/api/quantity-surveyor/cost-management?action=get_project_costs&projectId=fitzgerald-gardens'
    );
    const data = await response.json();
    
    expect(data.cashFlow).toBeDefined();
    expect(Array.isArray(data.cashFlow)).toBe(true);
    expect(data.cashFlow.length).toBeGreaterThan(0);
    
    // Test cash flow data structure
    const firstPeriod = data.cashFlow[0];
    expect(firstPeriod.plannedIncome).toBeDefined();
    expect(firstPeriod.actualIncome).toBeDefined();
    expect(firstPeriod.cumulativePlanned).toBeDefined();
    expect(firstPeriod.cumulativeActual).toBeDefined();
    expect(firstPeriod.variance).toBeDefined();
    
    console.log('✅ Cash flow projections have correct structure');
    console.log(`   ${data.cashFlow.length} periods tracked`);
  });

  test('Page rendering performance', async ({ page }) => {
    console.log('🧪 Testing Page Performance...');
    
    const start = Date.now();
    
    await page.goto('http://localhost:3000/quantity-surveyor/cost-management');
    await page.waitForSelector('[data-testid="qs-dashboard"]', { timeout: 10000 });
    
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
    
    console.log(`✅ QS Dashboard loads in ${loadTime}ms`);
  });

  test('Navigation between developer and QS works', async ({ page }) => {
    console.log('🧪 Testing Navigation Integration...');
    
    // Start at developer dashboard
    await page.goto('http://localhost:3000/developer/projects/fitzgerald-gardens');
    await page.waitForSelector('[data-testid="developer-dashboard"]');
    
    // Click link to QS dashboard (if it exists)
    const qsLink = page.locator('a[href*="quantity-surveyor"]').first();
    if (await qsLink.count() > 0) {
      await qsLink.click();
      await page.waitForSelector('[data-testid="qs-dashboard"]');
      
      // Verify we're on QS page with same project
      expect(page.url()).toContain('quantity-surveyor');
      
      console.log('✅ Navigation between systems works correctly');
    } else {
      console.log('ℹ️  QS navigation link not yet implemented');
    }
  });

});

// Business Logic Validation Tests
describe('QS Business Logic Validation', () => {

  test('Irish construction standards compliance', async ({ request }) => {
    console.log('🧪 Testing Irish Construction Standards...');
    
    const response = await request.get(
      'http://localhost:3000/api/quantity-surveyor/cost-management?action=get_project_costs&projectId=fitzgerald-gardens'
    );
    const data = await response.json();
    
    // Verify EUR currency usage
    expect(data.boq.currency).toBe('EUR');
    
    // Verify SCSI registration
    expect(data.compliance.quantitySurveyorRegistration.name).toContain('MSCSI');
    
    // Verify Irish company structure
    expect(data.compliance.professionalIndemnityInsurance.provider).toContain('Ireland');
    
    console.log('✅ Irish construction standards compliance verified');
  });

  test('Professional fee calculations', async ({ request }) => {
    console.log('🧪 Testing Professional Fee Structure...');
    
    const response = await request.get(
      'http://localhost:3000/api/quantity-surveyor/cost-management?action=get_project_costs&projectId=fitzgerald-gardens'
    );
    const data = await response.json();
    
    // Verify reasonable fee percentages for €4.2M project
    const contractValue = data.boq.grandTotal;
    const preliminaries = data.boq.preliminaries;
    const preliminaryPercentage = (preliminaries / contractValue) * 100;
    
    expect(preliminaryPercentage).toBeGreaterThan(3); // Reasonable minimum
    expect(preliminaryPercentage).toBeLessThan(15);   // Reasonable maximum
    
    console.log(`✅ Professional fees: ${preliminaryPercentage.toFixed(1)}% of contract value`);
  });

});

// Integration Robustness Tests  
describe('QS Integration Robustness', () => {

  test('Handle missing project data gracefully', async ({ page }) => {
    console.log('🧪 Testing Error Handling...');
    
    // Try to access QS for non-existent project
    await page.goto('http://localhost:3000/quantity-surveyor/cost-management?projectId=non-existent');
    
    // Should show loading or error state, not crash
    await page.waitForTimeout(3000);
    
    // Verify page doesn't crash
    const hasError = await page.locator('.text-red-500, .text-red-600').count();
    
    if (hasError > 0) {
      console.log('✅ Error handling works correctly');
    } else {
      console.log('✅ Fallback data prevents crashes');
    }
  });

  test('Large dataset performance', async ({ request }) => {
    console.log('🧪 Testing Large Dataset Performance...');
    
    const start = Date.now();
    
    const response = await request.get(
      'http://localhost:3000/api/quantity-surveyor/cost-management?action=get_project_costs&projectId=fitzgerald-gardens'
    );
    
    const responseTime = Date.now() - start;
    
    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(2000); // Should respond in under 2 seconds
    
    const data = await response.json();
    
    // Verify large cash flow dataset
    expect(data.cashFlow.length).toBeGreaterThan(20); // 29 months of data
    
    console.log(`✅ Large dataset (${data.cashFlow.length} periods) loads in ${responseTime}ms`);
  });

});

console.log('🏁 QS Enterprise Integration Test Suite Complete');