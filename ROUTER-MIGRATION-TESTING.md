# App Router Migration Testing Guide

This document outlines the testing strategy for our migration from Next.js Pages Router to App Router. It provides detailed instructions for verifying all routing functionality and ensuring no regressions were introduced during the migration.

## Overview

The migration from Pages Router to App Router requires testing several key components:

1. Basic navigation and page loading
2. Parameter handling (query, route, search)
3. Authentication flows and redirects
4. State preservation in URLs
5. Browser history interaction
6. Error handling

## Test Environment Setup

### Jest Testing

We've set up Jest tests to verify core App Router functionality:

```bash
# Install dependencies if needed
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Run the tests
npm test
```

### Test Files

Our test suite includes:

- `__tests__/app-router/navigation.test.tsx` - Basic navigation testing
- `__tests__/app-router/auth-flow.test.tsx` - Authentication flow testing
- `__tests__/app-router/integration.test.tsx` - End-to-end integration tests
- `__tests__/utils/paramValidator.test.ts` - Parameter validation utilities
- `__tests__/helpers/app-router-test-utils.tsx` - Testing utilities

### Manual Testing Checklist

For components that use App Router features, verify:

- [ ] Component mounts without errors
- [ ] Navigation happens as expected (client-side, no full page refresh)
- [ ] URL parameters are correctly parsed and used
- [ ] State is preserved during navigation
- [ ] Error boundaries catch and display errors properly

## Testing URL Parameter Handling

### Query Parameter Testing

```tsx
// Example usage in a component
import { useSearchParams } from 'next/navigation';
import { getNumericId, getValidParam, getBooleanParam } from '@/utils/paramValidator';

function MyComponent() {
  const searchParams = useSearchParams();
  
  // Get and validate parameters
  const id = getNumericId(searchParams);
  const filter = getValidParam(searchParams, 'filter', false, 'default');
  const showDetails = getBooleanParam(searchParams, 'details', false);
  
  // Rest of the component...
}
```

When testing, verify that:

1. Parameters are correctly extracted from the URL
2. Validation works as expected for required parameters
3. Default values are used when parameters are missing
4. Type conversion is handled properly
5. Error handling works for invalid parameters

### Route Parameter Testing

```tsx
// Example usage in a component
import { useParams } from 'next/navigation';

function MyComponent() {
  const params = useParams();
  const id = params?.id;
  
  // Rest of the component...
}
```

When testing route parameters, verify:

1. The component correctly extracts parameters from the route
2. It handles both string and array values (for catch-all routes)
3. Missing parameters are handled gracefully
4. Parameter validation is applied

## Testing Authentication Flows

Verify that authentication flows work properly with the new router:

1. Unauthenticated users are redirected to login
2. After login, users are redirected to their original destination
3. Protected routes correctly check authentication status
4. Role-based redirects work as expected

Example test scenario:

```tsx
// Example test
it('should redirect to login and then back to original page', async () => {
  // 1. Setup as unauthenticated
  setupAuthMock({ isAuthenticated: false });
  
  // 2. Try to access a protected route
  renderWithAppRouter(<ProtectedComponent />);
  
  // 3. Verify redirect to login
  expect(mockRouter.push).toHaveBeenCalledWith('/login?redirect=/protected-route');
  
  // 4. Simulate successful login
  setupAuthMock({ isAuthenticated: true });
  
  // 5. Verify redirect back to original route
  // In actual component, this would happen in the useEffect after auth state change
});
```

## Testing Browser History Navigation

Test browser history navigation to ensure it works with the App Router:

1. Back button works as expected
2. Forward button works as expected
3. State is preserved during navigation

## Performance Testing

Compare performance metrics between Pages Router and App Router:

1. Page load time
2. Time to interactive
3. Memory usage
4. Network requests

## Common Issues to Watch For

During testing, be alert for these common issues:

1. **Incorrect Imports**: Using old router imports instead of new ones
2. **Missing 'use client' Directive**: Client components that use router hooks must have this directive
3. **Query Parameter Access**: Using `router.query` instead of `useSearchParams()`
4. **Object-style Router.push**: Using object syntax instead of string URL
5. **Event Listeners**: Improperly handling router events
6. **Missing Error Handling**: For required but missing parameters

## Edge Case Testing

Don't forget to test edge cases:

1. URLs with special characters
2. Long query parameters
3. Multiple values for the same parameter
4. Missing required parameters
5. Invalid numeric IDs
6. Empty string parameters

## Automated Testing with Cypress

For end-to-end testing of critical flows:

```javascript
// Example Cypress test for authentication flow
describe('Authentication Flow', () => {
  it('redirects to login for protected routes and back after login', () => {
    // Attempt to visit protected route
    cy.visit('/buyer/dashboard');
    
    // Should be redirected to login
    cy.url().should('include', '/login');
    cy.url().should('include', 'redirect=/buyer/dashboard');
    
    // Login
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-submit"]').click();
    
    // Should be redirected back to protected route
    cy.url().should('include', '/buyer/dashboard');
  });
});
```

## Conclusion

By thoroughly testing all aspects of the App Router migration, we can ensure a smooth transition with no regressions in functionality. The test suite provides confidence that all routing features work as expected in the new architecture.