import { test as base } from '@playwright/test';
import path from 'path';

/**
 * Custom test fixtures for E2E tests
 */

// Define custom fixtures
export const test = base.extend({
  // Authenticated page fixture
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '.auth/admin.json'),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  
  // Buyer authenticated page
  buyerPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '.auth/buyer.json'),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  
  // Mobile context
  mobilePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';

// Helper functions
export const login = async (page: any, email: string, password: string) => {
  await page.goto('/auth/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('[type="submit"]');
  await page.waitForURL('**/dashboard');
};

export const logout = async (page: any) => {
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('**/login');
};

export const waitForToast = async (page: any, message: string) => {
  await page.waitForSelector(`[role="alert"]:has-text("${message}")`, {
    timeout: 5000,
  });
};

export const dismissToast = async (page: any) => {
  await page.click('[data-testid="toast-close"]');
};

export const uploadFile = async (page: any, selector: string, filePath: string) => {
  const fileInput = await page.$(selector);
  await fileInput?.setInputFiles(filePath);
};

export const selectDate = async (page: any, selector: string, date: Date) => {
  await page.click(selector);
  await page.click(`[data-date="${date.toISOString().split('T')[0]}"]`);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const scrollToElement = async (page: any, selector: string) => {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
  }, selector);
};

export const waitForNetworkIdle = async (page: any) => {
  await page.waitForLoadState('networkidle');
};