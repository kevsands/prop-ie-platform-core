# PropIE Platform Debugging & Performance Guide

This guide provides a comprehensive strategy for debugging, maintenance, and performance optimization of the PropIE property development platform.

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
3. [Debugging Workflow](#debugging-workflow)
4. [Performance Optimization](#performance-optimization)
5. [Error Monitoring & Logging](#error-monitoring--logging)
6. [Testing Strategy](#testing-strategy)
7. [Maintenance Best Practices](#maintenance-best-practices)

## System Architecture Overview

The PropIE platform is built on the following technology stack:

- **Frontend**: Next.js 15.3.1 (React 19)
- **TypeScript**: For type safety across the codebase
- **Authentication**: AWS Amplify Cognito
- **State Management**: React Context + Local State
- **API Integration**: React Query + AWS Amplify API
- **Database**: MongoDB
- **Styling**: Tailwind CSS + CSS Modules

The application follows a feature-based architecture with the following key areas:

- `/components`: Reusable UI components organized by feature
- `/context`: Global state management via React Context
- `/hooks`: Custom React hooks for shared logic
- `/lib`: Utility functions and service integrations
- `/pages` & `/app`: Next.js application routes
- `/types`: TypeScript type definitions
- `/services`: Service layer for external integrations

## Common Issues & Troubleshooting

### 1. Build Errors

**Symptoms**: 
- Compilation failures during `next build`
- TypeScript errors in the console

**Troubleshooting Steps**:
1. Check the error message for the specific file and line number
2. Run `npx tsc --noEmit` to get a full list of TypeScript errors
3. Review recent changes to the file in question
4. Check for missing imports or incorrect prop types

**Prevention**:
- Implement pre-commit hooks with ESLint and TypeScript checking
- Run `npm run lint` and `npm run type-check` before commits

### 2. Authentication Issues

**Symptoms**:
- Users unable to log in
- "User not authenticated" errors
- Inconsistent session state

**Troubleshooting Steps**:
1. Check browser console for Amplify errors
2. Verify AWS Cognito configuration in `aws-exports.js`
3. Confirm proper initialization of Amplify in client components
4. Examine `AuthContext` for state management issues

**Common Fixes**:
- Ensure AWS Amplify is properly configured in client components
- Check token refresh mechanism in `authService`
- Verify Cognito user pool settings

### 3. Data Fetching Issues

**Symptoms**:
- Blank screens or loading spinners that never resolve
- Console errors related to API calls
- Missing or incomplete data

**Troubleshooting Steps**:
1. Check network tab for failed API requests
2. Verify API endpoint URLs in environment configuration
3. Examine `DataService` for proper error handling
4. Check for CORS issues in Network tab

**Common Fixes**:
- Add fallback mechanisms in data fetching hooks
- Implement better error handling in API clients
- Update environment variables with correct endpoints

### 4. UI/Component Issues

**Symptoms**:
- Layout breaks at certain screen sizes
- Components render incorrectly or not at all
- Console warnings about React props or keys

**Troubleshooting Steps**:
1. Use React Developer Tools to inspect component hierarchy
2. Check prop values at each level of the component tree
3. Verify CSS classes are applied correctly
4. Test with different viewport sizes

**Common Fixes**:
- Add responsive design fixes to problematic components
- Fix prop validation and default props
- Implement error boundaries around unstable components

## Debugging Workflow

### Step 1: Reproduce the Issue
1. Get a clear reproduction case and steps
2. Document environment details (browser, device, user role)
3. Create a minimal reproduction scenario

### Step 2: Isolate the Problem
1. Use binary search through the codebase
2. Start with the component tree - is it a render issue?
3. Check network requests - is it a data issue?
4. Examine state management - is it a state issue?

### Step 3: Analyze the Root Cause
1. For component issues:
   - Use React Developer Tools to inspect component props and state
   - Add console logs at key points in the component lifecycle
   - Temporarily simplify the component to isolate the issue

2. For data issues:
   - Add console logs in data fetching functions
   - Check response format against expected types
   - Verify error handling paths

3. For build issues:
   - Run TypeScript in watch mode: `npx tsc --watch --noEmit`
   - Check for circular dependencies with `madge`
   - Review package versions for compatibility issues

### Step 4: Implement and Test the Fix
1. Make the smallest possible change to fix the issue
2. Test the fix thoroughly
3. Add regression tests to prevent future occurrences
4. Document the fix and root cause

## Performance Optimization

### Component Optimization

1. **Implement Code Splitting**:
   ```jsx
   // Before optimization
   import HeavyComponent from '@/components/HeavyComponent';
   
   // After optimization
   import dynamic from 'next/dynamic';
   const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
     loading: () => <p>Loading...</p>,
   });
   ```

2. **Use Memo and Callbacks**:
   ```jsx
   // Memoize expensive component
   const MemoizedComponent = React.memo(ExpensiveComponent);
   
   // Memoize callbacks to prevent unnecessary re-renders
   const handleClick = useCallback(() => {
     // handle click logic
   }, [dependencies]);
   ```

3. **Optimize List Rendering**:
   - Use virtualization for long lists with `react-window` or `react-virtualized`
   - Implement pagination for large data sets
   - Use unique, stable keys for mapped components

### Data Fetching Optimization

1. **Implement Caching**:
   - Leverage React Query's built-in caching
   - Use the enhanced caching in `DataService`
   - Set appropriate TTLs for different data types

2. **Use Optimistic Updates**:
   ```jsx
   // Example of optimistic update with React Query
   const updateCustomization = useMutation(
     (data) => DataService.saveCustomization(data),
     {
       onMutate: async (newData) => {
         // Cancel outgoing queries
         await queryClient.cancelQueries(['customization', newData.id]);
         
         // Save previous state
         const previousData = queryClient.getQueryData(['customization', newData.id]);
         
         // Optimistically update the cache
         queryClient.setQueryData(['customization', newData.id], newData);
         
         // Return previous data for rollback
         return { previousData };
       },
       onError: (err, newData, context) => {
         // Roll back on error
         queryClient.setQueryData(
           ['customization', newData.id],
           context.previousData
         );
       },
     }
   );
   ```

3. **Batch Related Requests**:
   - Combine related API calls
   - Use GraphQL to fetch exactly what you need
   - Implement backend endpoints for common data needs

### Page Load Optimization

1. **Image Optimization**:
   - Use Next.js Image component with proper sizing
   - Implement responsive images with appropriate sizes
   - Use WebP or AVIF formats when possible

2. **Font Optimization**:
   - Use `next/font` for optimized font loading
   - Implement font subsetting
   - Use variable fonts when appropriate

3. **Critical CSS Optimization**:
   - Extract and inline critical CSS
   - Defer non-critical styles
   - Use Tailwind's purge feature to minimize CSS size

## Error Monitoring & Logging

### Structured Logging

Implement a consistent logging system:

```typescript
// src/lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

export const logger = {
  debug: (message: string, context?: Record<string, any>) => log('debug', message, context),
  info: (message: string, context?: Record<string, any>) => log('info', message, context),
  warn: (message: string, context?: Record<string, any>) => log('warn', message, context),
  error: (message: string, context?: Record<string, any>) => log('error', message, context),
};

function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };
  
  // In development, log to console with formatting
  if (process.env.NODE_ENV === 'development') {
    console[level](
      `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`,
      context || ''
    );
  }
  
  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service (e.g., Sentry, LogRocket, etc.)
  }
}
```

### Error Boundaries

Implement strategic error boundaries to prevent entire app crashes:

```jsx
// src/components/ErrorBoundary.tsx
import React from 'react';
import { logger } from '@/lib/logger';

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Component error boundary caught error', {
      error: error.toString(),
      component: errorInfo.componentStack,
    });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Something went wrong</h2>
          <p className="mt-1 text-sm text-red-700">
            Please try refreshing the page. If the problem persists, contact support.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Monitoring Integration

Set up a monitoring service:

1. **Sentry Integration**:
   ```typescript
   // src/lib/monitoring.ts
   import * as Sentry from '@sentry/nextjs';

   export function initMonitoring() {
     if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
       Sentry.init({
         dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
         environment: process.env.NODE_ENV,
         tracesSampleRate: 0.1,
       });
     }
   }

   export function captureException(error: Error, context?: Record<string, any>) {
     console.error(error);
     Sentry.captureException(error, { 
       extra: context 
     });
   }
   ```

2. **API Error Handling**:
   ```typescript
   // Enhanced API client with error tracking
   try {
     const result = await api.get('/endpoint');
     return result;
   } catch (error) {
     captureException(error instanceof Error ? error : new Error(String(error)), {
       endpoint: '/endpoint',
       method: 'GET',
     });
     throw error;
   }
   ```

## Testing Strategy

### Unit Testing Components

Use Jest and React Testing Library:

```tsx
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyCard from '@/components/property/PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: 'prop1',
    title: 'Test Property',
    price: 350000,
    // ...other props
  };

  it('renders property details correctly', () => {
    render(<PropertyCard property={mockProperty} />);
    
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('€350,000')).toBeInTheDocument();
  });

  it('navigates to property details on click', () => {
    const mockRouter = { push: jest.fn() };
    jest.mock('next/navigation', () => ({
      useRouter: () => mockRouter,
    }));
    
    render(<PropertyCard property={mockProperty} />);
    fireEvent.click(screen.getByText('View Details'));
    
    expect(mockRouter.push).toHaveBeenCalledWith('/properties/prop1');
  });
});
```

### Integration Testing

Use Cypress for integration tests:

```javascript
// cypress/integration/property_search.spec.js
describe('Property Search', () => {
  beforeEach(() => {
    cy.visit('/properties');
  });

  it('filters properties by location', () => {
    cy.get('[data-testid="location-filter"]').select('drogheda-north');
    cy.get('[data-testid="search-btn"]').click();
    
    cy.get('[data-testid="property-card"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="property-location"]').each($loc => {
      cy.wrap($loc).should('contain', 'North Drogheda');
    });
  });

  it('filters properties by price range', () => {
    cy.get('[data-testid="price-min"]').type('300000');
    cy.get('[data-testid="price-max"]').type('400000');
    cy.get('[data-testid="search-btn"]').click();
    
    cy.get('[data-testid="property-card"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="property-price"]').each($price => {
      const priceText = $price.text();
      const priceValue = parseInt(priceText.replace(/[^0-9]/g, ''));
      expect(priceValue).to.be.within(300000, 400000);
    });
  });
});
```

### Mocking External Dependencies

Create consistent mocks for external services:

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';
import { mockDevelopments } from '@/data/mockDevelopments';

export const handlers = [
  rest.get('*/developments', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockDevelopments));
  }),
  
  rest.get('*/properties', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockProperties));
  }),
  
  rest.post('*/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;
    
    if (email === 'test@example.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          user: {
            id: 'user1',
            email: 'test@example.com',
            role: 'buyer',
          },
          token: 'fake-jwt-token',
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ message: 'Invalid credentials' })
    );
  }),
];
```

## Maintenance Best Practices

### Code Organization

1. **Feature-Based Structure**:
   - Group related files by feature rather than type
   - Keep components close to their usage
   - Use barrel exports for cleaner imports

   ```
   /src
     /features
       /authentication
         /components
         /hooks
         /services
         /utils
         index.ts
       /property
       /development
   ```

2. **Consistent Naming**:
   - Use PascalCase for components
   - Use camelCase for functions and variables
   - Use kebab-case for file names
   - Use descriptive, consistent naming patterns

3. **Component Design Patterns**:
   - Use container/presentation pattern
   - Implement compound components where appropriate
   - Leverage render props and higher-order components judiciously

### Documentation

1. **Code Comments**:
   - Document complex logic and business rules
   - Add JSDoc comments to functions and components
   - Explain "why" rather than "what" in comments

2. **Component Stories**:
   - Use Storybook for component documentation
   - Create stories for various component states
   - Include usage examples in stories

3. **Architecture Documentation**:
   - Maintain high-level architecture diagrams
   - Document key design decisions
   - Keep API documentation up to date

### Dependency Management

1. **Regular Updates**:
   - Schedule monthly dependency audits
   - Update non-breaking dependencies promptly
   - Test thoroughly after updates

2. **Version Pinning**:
   - Pin exact versions for critical dependencies
   - Use caret ranges for dev dependencies
   - Document dependency decisions

3. **Security Scanning**:
   - Run `npm audit` regularly
   - Use GitHub security alerts
   - Implement automated vulnerability scanning

---

**Remember**: Debugging is a systematic process. Start with reproducing the issue, isolate the problem, analyze the root cause, implement a fix, and validate your solution. Using these practices will help maintain a robust and performant application.

For questions or additional guidance, reach out to the development team.

Last updated: May 2, 2025