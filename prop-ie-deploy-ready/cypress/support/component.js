// ***********************************************************
// This is the main configuration file for Cypress Component tests
// ***********************************************************
// Import commands
import './commands';
// Import mount function from Cypress
import { mount } from 'cypress/react';
// Import React and dependencies
import React from 'react';
// Import global styles
import '../../src/styles/globals.css';
// Add mount command
Cypress.Commands.add('mount', mount);
// Mock wrapper for mounting components with providers
Cypress.Commands.add('mountWithProviders', (component, { isAuthenticated = false, user = null, mockAmplify = true, mockApi = true, mockRouter = true, } = {}) => {
    // Mock window.matchMedia for component tests
    cy.window().then((window) => {
        window.matchMedia =
            window.matchMedia ||
                (() => ({
                    matches: false,
                    addListener: () => { },
                    removeListener: () => { },
                }));
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
    const AllProviders = ({ children }) => {
        return React.createElement(QueryClientProvider, { client: queryClient }, children);
    };
    // Mount component with all providers
    return cy.mount(React.createElement(AllProviders, {}, component));
});
