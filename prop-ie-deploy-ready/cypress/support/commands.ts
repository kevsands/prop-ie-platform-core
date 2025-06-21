/// <reference types="cypress" />
/// <reference types="cypress-axe" />

// Import additional Cypress commands
import "cypress-wait-until";
import "cypress-file-upload";
import "cypress-localstorage-commands";

// Extend Cypress interfaces
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with email and password
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<Element>;
      
      /**
       * Custom command to logout the current user
       * @example cy.logout()
       */
      logout(): Chainable<Element>;
      
      /**
       * Custom command to visit a route with authentication
       * @example cy.visitAuth('/dashboard')
       */
      visitAuth(url: string, options?: Partial<Cypress.VisitOptions>): Chainable<Element>;
      
      /**
       * Custom command to wait for API request to complete
       * @example cy.waitForApi('GET', '/api/users')
       */
      waitForApi(method: string, url: string, alias?: string): Chainable<Element>;
      
      /**
       * Custom command to stub Amplify Auth.signIn response
       * @example cy.stubAmplifySignIn({ isSuccess: true })
       */
      stubAmplifySignIn(options: { isSuccess: boolean, user?: any, error?: string }): Chainable<Element>;
      
      /**
       * Custom command to stub Amplify API response
       * @example cy.stubAmplifyApi('GET', '/api/users', [{ id: 1, name: 'Test User' }])
       */
      stubAmplifyApi(method: string, url: string, response: any, statusCode?: number): Chainable<Element>;
      
      /**
       * Custom command to call API
       * @example cy.apiCall('users', { id: 1 })
       */
      apiCall(name: string, params: any): Chainable<Element>;
    }
  }

  interface Window {
    Auth: {
      signIn: (email: string, password: string) => Promise<any>;
      signOut: () => Promise<any>;
    };
    API: {
      post: (name: string, params: any) => Promise<any>;
      get: (options: { path: string }) => Promise<any>;
      put: (options: { path: string }) => Promise<any>;
      delete: (options: { path: string }) => Promise<any>;
    };
  }
}

// Login command implementation
Cypress.Commands.add('login', (email: string, password: string) => {
  if (!window.Auth) {
    throw new Error('Auth is not available in the window object');
  }
  return cy.wrap(window.Auth.signIn(email, password));
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
Cypress.Commands.add('waitForApi', (method: string, url: string, alias?: string) => {
  const aliasName = alias || `${method.toLowerCase()}${url.replace(/\//g, '_')}`;
  cy.intercept(method, url).as(aliasName);
  cy.wait(`@${aliasName}`);
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
      } else {
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
    const methodName = method.toLowerCase() as keyof typeof win.API;
    
    if (methodName === 'post') {
      win.API.post = cy.stub().callsFake((name, params) => {
        if (name === url) {
          return Promise.resolve(response);
        }
        return Promise.reject(new Error('Path not mocked'));
      });
    } else {
      win.API[methodName] = cy.stub().callsFake((options) => {
        if (options.path === url) {
          return Promise.resolve(response);
        }
        return Promise.reject(new Error('Path not mocked'));
      });
    }
  });
});

// API call command
Cypress.Commands.add('apiCall', (name: string, params: any) => {
  if (!window.API) {
    throw new Error('API is not available in the window object');
  }
  return cy.wrap(window.API.post(name, params));
});