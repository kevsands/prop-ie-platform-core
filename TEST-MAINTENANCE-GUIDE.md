# PropIE AWS App - Test Maintenance Guide

This document provides guidance for maintaining the test suite for the PropIE AWS App.

## Recent Test Infrastructure Improvements

### May 2023 - TypeScript Type Definitions for Test Functions

We've made several improvements to the test infrastructure:

1. **Fixed Jest Custom Matcher Types** - Resolved TypeScript errors with custom matchers like `toHaveTextContent`, `toBeInTheDocument`, etc.
2. **Added Auth Test Type Definitions** - Created proper type definitions for Amplify Auth test mocks
3. **Improved Test Type Imports** - Streamlined imports for Jest and Testing Library types

These changes resolve issues in the following areas:
- Type errors in auth-flows.test.tsx and other test files
- Missing matcher methods on the `expect()` object
- Type mismatches between mock implementations and actual API

The main files updated were:
- `src/tests/setup.ts` - Enhanced type definitions
- `src/types/amplify/auth-test.d.ts` - Custom test types for Amplify Auth
- Test files - Updated import patterns

## Test Structure Overview

The testing architecture consists of four layers:

1. **Unit Tests** - Test individual components and functions in isolation
2. **Integration Tests** - Test interactions between related components
3. **End-to-End Tests** - Test complete user flows through the application
4. **Security Tests** - Test security-specific concerns like authentication

## Key Test Files and Directories

```
/
├── __tests__/                    # Unit and integration tests
│   ├── api/                      # API endpoint tests
│   ├── app-router/               # Next.js App Router tests
│   ├── context/                  # Context API tests
│   ├── helpers/                  # Test utilities
│   │   ├── app-router-test-utils.tsx    # App Router testing utilities
│   │   └── integration-test-utils.tsx   # Integration testing utilities
│   ├── mocks/                    # Mock implementations
│   │   ├── amplify-mock.ts       # AWS Amplify mocking utilities
│   │   ├── handlers.js           # MSW request handlers
│   │   └── server.js             # MSW server setup
│   ├── performance/              # Performance test files
│   └── security/                 # Security test files
│
├── cypress/                      # End-to-end tests with Cypress
│   ├── e2e/                      # E2E test specifications
│   │   ├── auth/                 # Authentication flow tests
│   │   ├── buyer/                # Buyer user flow tests
│   │   └── properties/           # Property-related flow tests
│   ├── fixtures/                 # Test data fixtures
│   └── support/                  # Cypress support files and commands
│
├── jest.config.js                # Jest configuration for unit tests
├── jest.integration.config.js    # Jest configuration for integration tests
├── jest.setup.js                 # Jest setup for unit tests
└── jest.integration.setup.js     # Jest setup for integration tests
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run unit tests with coverage reporting
npm run test:ci

# Run a specific test file
npm test -- path/to/test-file.ts
```

### Integration Tests

```bash
# Run all integration tests
npm run test:integration

# Run integration tests with coverage reporting
npm run test:integration:ci

# Run a specific integration test file
npm run test:integration -- path/to/test-file.ts
```

### End-to-End Tests

```bash
# Open Cypress UI
npm run cypress

# Run all Cypress tests headlessly
npm run cypress:run

# Run Cypress tests with CI server
npm run cypress:ci
```

### Security Tests

Security tests are included in the standard test suites but can also be run directly:

```bash
# Run security checks (static analysis)
npm run security-check

# Run dependency security scan
npm run dependency-scan
```

## Adding New Tests

### Unit Tests

1. Create a new test file in the `__tests__` directory
2. Follow the naming convention: `*.test.ts` or `*.test.tsx`
3. Import the component or function to test
4. Use Jest and React Testing Library for assertions

Example:

```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../src/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

1. Create a new test file in the `__tests__` directory
2. Follow the naming convention: `*.integration.test.ts` or `*.integration.test.tsx`
3. Use the integration test utilities to simplify setup
4. Focus on testing component interactions

Example:

```typescript
// __tests__/forms/LoginForm.integration.test.tsx
import { renderForIntegration, mockFetch, waitForToast } from '../helpers/integration-test-utils';
import LoginForm from '../../src/components/auth/LoginForm';

describe('LoginForm Integration', () => {
  it('submits the form and shows success message', async () => {
    // Mock successful login API response
    mockFetch({ user: { id: '123', name: 'Test User' } });
    
    // Render with integration utilities
    const { getByLabelText, getByRole } = renderForIntegration(<LoginForm />);
    
    // Fill form
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(getByRole('button', { name: /sign in/i }));
    
    // Wait for success toast
    await waitForToast('success');
  });
});
```

### End-to-End Tests

1. Create a new test file in the `cypress/e2e` directory
2. Follow the naming convention: `*.cy.ts`
3. Use Cypress commands and assertions

Example:

```typescript
// cypress/e2e/auth/registration.cy.ts
describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('allows user to register successfully', () => {
    // Fill registration form
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="email-input"]').type('newuser@example.com');
    cy.get('[data-testid="password-input"]').type('Password123!');
    cy.get('[data-testid="confirm-password-input"]').type('Password123!');
    
    // Submit form
    cy.get('[data-testid="register-button"]').click();
    
    // Should be redirected to dashboard after successful registration
    cy.url().should('include', '/dashboard');
  });
});
```

## Mocking Strategies

### Mocking AWS Amplify

The `amplify-mock.ts` utility provides comprehensive mocking for AWS Amplify services:

```typescript
import { createMockAmplifyModules, simulateAuthenticatedUser } from '../mocks/amplify-mock';

// Setup mocks
const mocks = createMockAmplifyModules({
  authOptions: {
    initialUser: {
      userId: 'test-user-id',
      username: 'testuser',
      email: 'test@example.com'
    }
  }
});

// Access mock implementations
const authMock = mocks.Auth;
const apiMock = mocks.API;

// Configure mock responses
apiMock.__mockResponse('GET', '/api/user', { id: '123', name: 'Test User' });
```

### Mocking API Requests

For integration and E2E tests, use MSW (Mock Service Worker) to intercept API requests:

```typescript
// Define additional request handlers
import { rest } from 'msw';

const customHandlers = [
  rest.get('https://api.example.com/data', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ data: 'mocked response' })
    );
  })
];

// Add handlers in your tests
import { server } from '../mocks/server';
server.use(...customHandlers);
```

## Testing Best Practices

### General Guidelines

1. **Test behavior, not implementation** - Focus on what the component does, not how it does it
2. **Use data-testid attributes** - Add `data-testid` to elements for more reliable selection
3. **Mock external dependencies** - Isolate tests from external services
4. **Follow AAA pattern** - Arrange, Act, Assert
5. **Keep tests independent** - Avoid dependencies between tests

### Security Testing Guidelines

1. **Test authentication flows** - Verify login, registration, and password reset
2. **Test authorization** - Ensure proper access control
3. **Test input validation** - Verify protection against injection attacks
4. **Test error handling** - Ensure errors don't reveal sensitive information

### Performance Testing Guidelines

1. **Benchmark key user journeys** - Measure performance of critical flows
2. **Test with realistic data volumes** - Use production-like data sizes
3. **Monitor Core Web Vitals** - Track LCP, FID, CLS metrics
4. **Test on lower-end devices** - Use CPU throttling in Chrome DevTools

## Troubleshooting Common Issues

### Jest Tests

| Issue | Solution |
|-------|----------|
| Test fails only in CI | Check for environment differences or race conditions |
| "Cannot find module" error | Verify import paths and module aliasing |
| Context not initialized | Ensure components are wrapped in the correct providers |
| Stale mocks | Call `jest.clearAllMocks()` in `afterEach` |

### Cypress Tests

| Issue | Solution |
|-------|----------|
| Element not found | Use `cy.waitUntil()` to wait for async conditions |
| Authentication fails | Check if login flow has changed or use `cy.visitAuth()` |
| Network errors | Use `cy.intercept()` to mock API responses |
| Flaky tests | Add `cy.wait()` for animations or state changes |

## Maintaining Test Coverage

1. **Track coverage metrics** - Monitor code coverage in CI reports
2. **Add tests for new features** - Require tests for all new code
3. **Add tests when fixing bugs** - Create a regression test for each bug fix
4. **Regularly update snapshot tests** - Keep snapshot tests current

## CI/CD Integration

The test suite is integrated with the CI/CD pipeline in GitHub Actions:

- **Unit tests** run on every push and pull request
- **Integration tests** run on every push and pull request
- **E2E tests** run on pull requests to main branches
- **Security scans** run on pull requests to main branches

See `.github/workflows/test.yml` for the complete configuration.

## Performance Testing

Performance tests include:

1. **Lighthouse CI** - Measures Core Web Vitals and performance scores
2. **Bundle analysis** - Tracks bundle size changes
3. **API performance tests** - Measures API response times

Run performance tests locally with:

```bash
npm run performance:analyze  # Analyze bundle size
npm run performance:test     # Run Lighthouse tests
```

## Accessibility Testing

Accessibility tests ensure the application meets WCAG standards:

1. **Automated a11y tests** - Using Cypress-axe in E2E tests
2. **Storybook a11y addon** - Tests components in isolation

Run accessibility tests with:

```bash
npm run a11y-audit        # Run accessibility audit
npm run a11y-audit:fix    # Auto-fix some accessibility issues
```

## Future Test Enhancements

Planned improvements to the test suite:

1. **Visual regression testing** - Compare screenshots for UI changes
2. **User flow recording** - Generate test scripts from user sessions
3. **Load testing** - Simulate multiple concurrent users
4. **Cross-browser testing** - Test on multiple browsers and devices

## Questions and Support

For questions about the test suite, contact:

- **Testing Lead:** [TestingLead@example.com](mailto:TestingLead@example.com)
- **Security Testing:** [SecurityTest@example.com](mailto:SecurityTest@example.com)

Report test failures and issues in the project's issue tracker.