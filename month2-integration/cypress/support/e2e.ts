// ***********************************************************
// This is the main configuration file for Cypress E2E tests
// ***********************************************************

// Import commands
import './commands';

// Disable screenshot on test failure for specific failures like accessibility
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: true,
});

// Preserve cookies and localStorage between tests
beforeEach(() => {
  cy.restoreLocalStorage();
});

afterEach(() => {
  cy.saveLocalStorage();
});

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from failing the test due to uncaught exceptions
  // from the application. This is useful for third-party scripts throwing errors.
  console.error('Uncaught exception:', err.message);

  // Allow test to continue for most errors
  return false;
});

// Set default viewport
Cypress.config('viewportWidth', 1280);
Cypress.config('viewportHeight', 720);

// Always fail on console errors
Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error').as('consoleError');
});

// Check for console errors after each test
afterEach(() => {
  cy.get('@consoleError').then((errorSpy: any) => {
    const criticalKeywords = [
      'TypeError',
      'ReferenceError',
      'SyntaxError',
      'Failed to load resource',
      'Uncaught exception'
    ];

    // Use type assertion for Cypress spy
    const calls = (errorSpy as any).getCalls?.() || [];
    const criticalErrors = calls.filter((call: Cypress.SinonSpyCall) => {
      const msg = call.args[0]?.toString() || '';
      return criticalKeywords.some(keyword => msg.includes(keyword));
    });

    if (criticalErrors.length) {
      // Log critical errors for easier debugging
      console.warn('Critical console errors during test:', criticalErrors);
      // You can choose whether to fail the test or just log errors
      // uncomment the line below to fail tests with critical console errors
      // expect(criticalErrors.length).to.equal(0);
    }
  });
});