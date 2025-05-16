/// <reference types="cypress" />
// Import additional Cypress commands
import "cypress-wait-until";
import "cypress-file-upload";
import "cypress-axe";
import "cypress-localstorage-commands";
// Login command implementation
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    // Wait for redirect after successful login
    cy.waitUntil(() => cy.url().then(url => !url.includes('/login')));
    // Store auth state for future requests
    cy.saveLocalStorage('auth');
});
// Logout command implementation
Cypress.Commands.add('logout', () => {
    cy.visit('/');
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();
    // Wait for redirect after logout
    cy.waitUntil(() => cy.url().then(url => url.includes('/login')));
    // Clear saved auth state
    cy.clearLocalStorage();
});
// Visit route with authentication command
Cypress.Commands.add('visitAuth', (url, options = {}) => {
    // Restore auth state
    cy.restoreLocalStorage('auth');
    // Visit URL
    cy.visit(url, options);
    // Handle potential redirect to login page
    cy.url().then(currentUrl => {
        if (currentUrl.includes('/login')) {
            // Login using environment variables if redirected
            const email = Cypress.env('testBuyerEmail');
            const password = Cypress.env('testBuyerPassword');
            cy.login(email, password);
            cy.visit(url, options);
        }
    });
});
// Wait for API request to complete
Cypress.Commands.add('waitForApi', (method, url, alias) => {
    const aliasName = alias || `${method.toLowerCase()}${url.replace(/\//g, '_')}`;
    // Create intercept
    cy.intercept(method, url).as(aliasName);
    // Wait for API call
    return cy.wait(`@${aliasName}`);
});
// Check accessibility
Cypress.Commands.add('checkA11y', (options = {}) => {
    cy.injectAxe();
    cy.checkA11y(options);
});
// Stub Amplify Auth.signIn response
Cypress.Commands.add('stubAmplifySignIn', ({ isSuccess, user, error }) => {
    cy.window().then((win) => {
        // Mock Auth.signIn method
        win.Auth = win.Auth || {};
        win.Auth.signIn = cy.stub().callsFake((username, password) => {
            if (isSuccess) {
                return Promise.resolve({
                    isSignedIn: true,
                    nextStep: { signInStep: 'DONE' },
                    attributes: user || {
                        email: username,
                        sub: 'mock-user-id',
                        email_verified: 'true'
                    }
                });
            }
            else {
                return Promise.reject(new Error(error || 'Invalid credentials'));
            }
        });
    });
});
// Stub Amplify API response
Cypress.Commands.add('stubAmplifyApi', (method, url, response, statusCode = 200) => {
    cy.window().then((win) => {
        // Mock API method
        win.API = win.API || {};
        win.API[method.toLowerCase()] = cy.stub().callsFake((options) => {
            if (options.path === url) {
                return Promise.resolve(response);
            }
            return Promise.reject(new Error('Path not mocked'));
        });
    });
});
