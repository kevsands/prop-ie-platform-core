
// PROP.ie Staging UAT Configuration
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './testing/e2e',
  fullyParallel: false, // Run tests sequentially for UAT
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Single worker for UAT observation
  reporter: [
    ['html', { outputFolder: './testing/uat-reports' }],
    ['json', { outputFile: './testing/uat-results.json' }],
    ['list']
  ],
  use: {
    baseURL: 'https://prop-ie-staging.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
    slowMo: 500
  },
  projects: [
    {
      name: 'staging-firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'staging-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'staging-mobile',
      use: { ...devices['iPhone 13'] },
    }
  ]
});
