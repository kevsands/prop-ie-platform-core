// ***********************************************************
// This is the main configuration file for Cypress Component tests
// ***********************************************************

// Import commands
import './commands';

// Import mount function from Cypress
import { mount } from 'cypress/react';
import type { MountReturn } from 'cypress/react';

// Import React and dependencies
import * as React from 'react';
import { ReactNode } from 'react';

// Import global styles
import '../../src/styles/globals.css';

// Augment the Cypress namespace to include type definitions for
// the mount function
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mount a React component with support for the prop-ie-aws-app context
       * @example cy.mount(<Button>Click me</Button>)
       */
      mount: typeof mount;
      
      /**
       * Mount a React component with all necessary providers
       * @example cy.mountWithProviders(<UserProfile />)
       */
      mountWithProviders(
        component: React.ReactNode,
        options?: {
          isAuthenticated?: boolean;
          user?: Record<string, any>;
          mockAmplify?: boolean;
          mockApi?: boolean;
          mockRouter?: boolean;
        }
      ): Chainable<MountReturn>;
    }
  }
}

// Add mount command
Cypress.Commands.add('mount', mount);

// Mock wrapper for mounting components with providers
Cypress.Commands.add(
  'mountWithProviders',
  (
    component,
    {
      isAuthenticated = false,
      user = null,
      mockAmplify = true,
      mockApi = true,
      mockRouter = true,
    } = {}
  ) => {
    // Mock window.matchMedia for component tests
    cy.window().then((window) => {
      window.matchMedia =
        window.matchMedia ||
        function matchMediaPolyfill(query: string) {
          return {
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
          } as MediaQueryList;
        };
    });

    // Import necessary providers
    const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');
    
    // Create a new QueryClient for each test
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });
    
    // Mock Amplify Auth
    if (mockAmplify) {
      // Setup auth mock based on isAuthenticated flag
      cy.stubAmplifySignIn({
        isSuccess: isAuthenticated,
        user: user || {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'buyer',
        },
      });
    }
    
    // Create wrapper with all necessary providers
    const AllProviders = ({ children }: { children: React.ReactNode }) => {
      return React.createElement(
        QueryClientProvider, 
        { client: queryClient }, 
        children
      );
    };
    
    // Mount component with all providers
    return cy.mount(
      React.createElement(AllProviders, { children: component })
    );
  }
);