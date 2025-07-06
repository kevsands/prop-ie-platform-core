/// <reference types="cypress" />
describe('Authentication - Login Flow', () => {
    beforeEach(() => {
        // Start from a clean slate for each test
        cy.clearLocalStorage();
        cy.clearCookies();
        // Visit the login page
        cy.visit('/login');
    });
    it('should display the login form', () => {
        // Check that the login form is visible
        cy.get('[data-testid="login-form"]').should('be.visible');
        // Verify form elements
        cy.get('[data-testid="email-input"]').should('be.visible');
        cy.get('[data-testid="password-input"]').should('be.visible');
        cy.get('[data-testid="login-button"]').should('be.visible');
        cy.get('[data-testid="register-link"]').should('be.visible');
    });
    it('should display error message for invalid credentials', () => {
        // Type invalid credentials
        cy.get('[data-testid="email-input"]').type('invalid@example.com');
        cy.get('[data-testid="password-input"]').type('wrongpassword');
        // Submit the form
        cy.get('[data-testid="login-button"]').click();
        // Expect error message
        cy.get('[data-testid="error-message"]').should('be.visible');
        cy.get('[data-testid="error-message"]').should('contain', 'Invalid email or password');
        // URL should still be login page
        cy.url().should('include', '/login');
    });
    it('should login successfully with valid credentials', () => {
        // Load test user data
        cy.fixture('users').then((users) => {
            const testUser = users.buyers[0];
            // Type valid credentials
            cy.get('[data-testid="email-input"]').type(testUser.email);
            cy.get('[data-testid="password-input"]').type(testUser.password);
            // Intercept API calls for login
            cy.intercept('POST', '**/api/auth/login').as('loginRequest');
            cy.intercept('GET', '**/api/users/me').as('getUserProfile');
            // Submit the form
            cy.get('[data-testid="login-button"]').click();
            // Wait for login API request
            cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
            // Check that user is redirected to dashboard after login
            cy.url().should('include', '/dashboard');
            // Check that the user name is displayed in the header
            cy.get('[data-testid="user-name"]').should('contain', testUser.name);
        });
    });
    it('should navigate to register page when clicking the register link', () => {
        // Click on the register link
        cy.get('[data-testid="register-link"]').click();
        // Check that user is redirected to register page
        cy.url().should('include', '/register');
        // Verify register form is displayed
        cy.get('[data-testid="register-form"]').should('be.visible');
    });
    it('should handle social login options', () => {
        // Check that social login options are available
        cy.get('[data-testid="social-login-options"]').should('be.visible');
        // Check specific social login buttons if they exist
        cy.get('[data-testid="social-login-options"]').then(($options) => {
            if ($options.find('[data-testid="google-login"]').length) {
                cy.get('[data-testid="google-login"]').should('be.visible');
            }
            if ($options.find('[data-testid="facebook-login"]').length) {
                cy.get('[data-testid="facebook-login"]').should('be.visible');
            }
        });
    });
    it('should validate form inputs', () => {
        // Submit with empty fields
        cy.get('[data-testid="login-button"]').click();
        // Expect validation errors
        cy.get('[data-testid="email-error"]').should('be.visible');
        cy.get('[data-testid="password-error"]').should('be.visible');
        // Type invalid email format
        cy.get('[data-testid="email-input"]').type('invalidemail');
        // Expect email format validation error
        cy.get('[data-testid="email-error"]').should('be.visible');
        cy.get('[data-testid="email-error"]').should('contain', 'valid email');
        // Type valid email to clear error
        cy.get('[data-testid="email-input"]').clear().type('valid@example.com');
        // Email error should disappear
        cy.get('[data-testid="email-error"]').should('not.exist');
        // Type short password
        cy.get('[data-testid="password-input"]').type('short');
        // Expect password length validation error if it exists
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="password-error"]').length) {
                cy.get('[data-testid="password-error"]').should('contain', 'Password');
            }
        });
    });
    it('should maintain accessibility standards', () => {
        // Check accessibility
        cy.injectAxe();
        cy.checkA11y();
    });
});
