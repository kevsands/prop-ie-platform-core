# Prop IE AWS App Testing Patterns

This document serves as the central reference for testing patterns, best practices, and utilities for all teams working on the Prop IE AWS application. It establishes standardized approaches that should be followed across the project.

## Table of Contents

1. [Test Environment Setup](#test-environment-setup)
2. [Testing React Components](#testing-react-components)
3. [Testing API Endpoints](#testing-api-endpoints)
4. [Working with React Query](#working-with-react-query)
5. [Authentication Testing](#authentication-testing)
6. [Data Mocking](#data-mocking)
7. [Troubleshooting Common Issues](#troubleshooting-common-issues)
8. [Test Creation Checklist](#test-creation-checklist)

## Test Environment Setup

### Required Configuration

All tests must use the following configuration to ensure consistency:

1. **TypeScript Configuration**
   - Use `tsconfig.jest.json` for all tests
   - This provides less strict type checking that's more suitable for tests

2. **Jest Configuration**
   - Run tests with the `--no-cache` flag for reliable results
   - Use the `--no-coverage` flag during development to speed up tests

3. **Common Imports**
   - Always include `jest-extended` for enhanced matchers
   - Use the project's test utilities rather than creating your own

### Basic Test Structure

```typescript
// Good example of basic test structure
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-extended';
import { ComponentToTest } from './ComponentToTest';

describe('ComponentToTest', () => {
  beforeEach(() => {
    // Setup code
  });

  afterEach(() => {
    // Cleanup code
  });

  it('should render correctly', () => {
    render(<ComponentToTest />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

## Testing React Components

### Component Test Pattern

Follow this pattern for all component tests:

1. **Rendering and Basic Assertions**:
   - Test that the component renders without crashing
   - Test that key elements are in the document
   - Test that the component handles props correctly

2. **Interaction Testing**:
   - Test user interactions using `userEvent` not `fireEvent`
   - Ensure all interactive elements can be used with keyboard

3. **Conditional Rendering**:
   - Test all major rendering conditions (loading, error, empty states)

### Example Component Test

```typescript
// src/__tests__/components/PropertyCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import 'jest-extended';
import { PropertyCard } from '@/components/property/PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: 'prop-1',
    title: 'Luxury Apartment',
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    imageUrl: '/images/properties/luxury-apartment.jpg',
  };

  it('renders property details correctly', () => {
    render(<PropertyCard property={mockProperty} />);
    
    expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
    expect(screen.getByText('€450,000')).toBeInTheDocument();
    expect(screen.getByText('3 bed')).toBeInTheDocument();
    expect(screen.getByText('2 bath')).toBeInTheDocument();
    expect(screen.getByText('1500 sq ft')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const handleSelect = jest.fn();
    render(<PropertyCard property={mockProperty} onSelect={handleSelect} />);
    
    const card = screen.getByTestId('property-card');
    await userEvent.click(card);
    
    expect(handleSelect).toHaveBeenCalledWith('prop-1');
  });

  it('shows a placeholder when no image is provided', () => {
    const propertyWithoutImage = { ...mockProperty, imageUrl: undefined };
    render(<PropertyCard property={propertyWithoutImage} />);
    
    expect(screen.getByTestId('property-image-placeholder')).toBeInTheDocument();
  });
});
```

## Testing API Endpoints

### API Test Pattern

When testing API endpoints:

1. **Mock the Request/Response Cycle**:
   - Mock `fetch` or API client functions
   - Test all response scenarios (success, error, validation failure)

2. **Validate Request Format**:
   - Check that the API is called with the correct parameters
   - Verify authentication headers when required

3. **Handle Response Processing**:
   - Test that API responses are processed correctly
   - Ensure error handling works as expected

### Example API Test

```typescript
// __tests__/api/properties.test.ts
import '@testing-library/jest-dom';
import 'jest-extended';
import { getProperty, getPropertiesByDevelopment } from '@/api/properties';

describe('Property API', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches a single property by ID', async () => {
    const mockResponse = {
      id: 'prop-1',
      title: 'Luxury Apartment',
      price: 450000,
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });
    
    const result = await getProperty('prop-1');
    
    expect(global.fetch).toHaveBeenCalledWith('/api/properties/prop-1');
    expect(result).toEqual(mockResponse);
  });

  it('handles errors when fetching a property', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValueOnce({ error: 'Property not found' }),
    });
    
    await expect(getProperty('non-existent')).rejects.toThrow('Property not found');
  });

  it('fetches properties by development ID', async () => {
    const mockResponse = [
      { id: 'prop-1', developmentId: 'dev-1', title: 'Luxury Apartment' },
      { id: 'prop-2', developmentId: 'dev-1', title: 'Garden Villa' },
    ];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });
    
    const result = await getPropertiesByDevelopment('dev-1');
    
    expect(global.fetch).toHaveBeenCalledWith('/api/properties?developmentId=dev-1');
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Luxury Apartment');
  });
});
```

## Working with React Query

For components that use React Query, use the dedicated testing utilities located in:
- `/src/tests/mocks/react-query-mock.ts`
- `/src/tests/utils/query-test-utils.tsx`

### React Query Test Pattern

1. **Basic Query Component Test**:
   - Use the `renderWithQueryClient` helper function
   - Use the mock query hooks for controlled tests

2. **Testing Loading/Error States**:
   - Use the dedicated mock implementations
   - Test how the component responds to different query states

### Example React Query Component Test

```typescript
import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-extended';
import { 
  renderWithQueryClient, 
  mockUseQuery, 
  mockUseQueryLoading,
  mockUseQueryError
} from '@/tests/utils/query-test-utils';
import { DevelopmentList } from '@/components/DevelopmentList';

describe('DevelopmentList Component', () => {
  it('renders development list correctly', () => {
    renderWithQueryClient(<DevelopmentList />);
    
    expect(screen.getByText('Developments')).toBeInTheDocument();
    expect(screen.getByTestId('development-list')).toBeInTheDocument();
    
    // Verify mock data is displayed
    expect(screen.getByText('Riverside Manor')).toBeInTheDocument();
    expect(screen.getByText('Mountain View')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    // Override the default mock to return loading state
    mockUseQuery.mockImplementationOnce(() => ({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      status: 'loading',
    }));
    
    renderWithQueryClient(<DevelopmentList />);
    
    expect(screen.getByText('Loading developments...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    // Override the default mock to return error state
    mockUseQuery.mockImplementationOnce(() => ({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch developments'),
      status: 'error',
    }));
    
    renderWithQueryClient(<DevelopmentList />);
    
    expect(screen.getByText('Error: Failed to fetch developments')).toBeInTheDocument();
  });
});
```

## Authentication Testing

### Auth Test Pattern

When testing components that require authentication:

1. **Mock Auth Context**:
   - Create a mock AuthProvider
   - Test both authenticated and unauthenticated states

2. **Test Protected Routes**:
   - Verify redirect behavior for unauthenticated users
   - Verify correct rendering for authenticated users

### Example Auth Test

```typescript
// __tests__/auth/ProtectedRoute.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'jest-extended';
import { AuthContext } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Mock router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ProtectedRoute', () => {
  it('redirects to login when user is not authenticated', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, user: null, signIn: jest.fn() }}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthContext.Provider>
    );
    
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    render(
      <AuthContext.Provider 
        value={{ 
          isAuthenticated: true, 
          user: { id: 'user-1', email: 'user@example.com' }, 
          signIn: jest.fn() 
        }}
      >
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthContext.Provider>
    );
    
    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
```

## Data Mocking

### Mock Data Strategy

1. **Centralized Test Data**:
   - Use consistent mock data across tests
   - Store mock data in dedicated files for reuse

2. **Type-Safe Mocks**:
   - Ensure mock data matches expected interfaces
   - Use TypeScript interfaces to validate mocks

3. **Testing with Mock Data**:
   - Use realistic values when possible
   - Include edge cases in your test data

### Example Mock Data File

```typescript
// src/tests/mocks/property-data.ts
import { Property, PropertyStatus, PropertyType } from '@/types/properties';

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    developmentId: 'dev-1',
    title: 'Luxury Apartment',
    description: 'A beautiful luxury apartment in the heart of the city',
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    type: PropertyType.APARTMENT,
    status: PropertyStatus.AVAILABLE,
    features: ['Air Conditioning', 'Parking', 'Garden Access'],
    imageUrl: '/images/properties/luxury-apartment.jpg',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'prop-2',
    developmentId: 'dev-1',
    title: 'Garden Villa',
    description: 'Spacious villa with private garden',
    price: 650000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    type: PropertyType.HOUSE,
    status: PropertyStatus.AVAILABLE,
    features: ['Garden', 'Garage', 'Swimming Pool'],
    imageUrl: '/images/properties/garden-villa.jpg',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
  // Property with special case - property without image
  {
    id: 'prop-3',
    developmentId: 'dev-2',
    title: 'Mountain View Cottage',
    description: 'Cozy cottage with mountain views',
    price: 350000,
    bedrooms: 2,
    bathrooms: 1,
    area: 1000,
    type: PropertyType.HOUSE,
    status: PropertyStatus.RESERVED,
    features: ['Mountain View', 'Fireplace'],
    imageUrl: undefined, // Missing image URL for testing fallback
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
  },
];

export const getMockPropertyById = (id: string): Property | undefined => {
  return mockProperties.find(property => property.id === id);
};

export const getMockPropertiesByDevelopment = (developmentId: string): Property[] => {
  return mockProperties.filter(property => property.developmentId === developmentId);
};
```

## Troubleshooting Common Issues

### Module Resolution Issues

If you encounter module resolution errors:

1. Check that the import path is correct
2. Verify the moduleNameMapper in jest.config.js includes the path
3. Try using `jest-extended` instead of paths to jest extension files

### TypeScript Parse Errors

For TypeScript parsing errors:

1. Make sure to use the `tsconfig.jest.json` configuration
2. Try disabling strict mode or isolatedModules for the test
3. Add problematic error codes to the ignoreCodes list

### React Query Issues

For React Query related test failures:

1. Make sure you're using the `renderWithQueryClient` helper
2. Check that query keys match between components and tests
3. Verify that mock data structure matches what components expect

## Test Creation Checklist

Use this checklist when creating new tests:

- [ ] Test imports use project standards and include jest-extended
- [ ] Component tests are isolated (not dependent on external services)
- [ ] UI components use proper rendering and user events
- [ ] React Query components use the rendering utility
- [ ] Tests include all key scenarios (normal, error, edge cases)
- [ ] Tests are resilient to changes in mock data
- [ ] Component tests do not test internal implementation details
- [ ] Test descriptions clearly explain what's being tested

## Team Leads and Points of Contact

| Area | Lead | Contact |
|------|------|---------|
| Test Infrastructure | TBD | tbd@example.com |
| UI Component Testing | TBD | tbd@example.com |
| API Testing | TBD | tbd@example.com |
| Data Mocking | TBD | tbd@example.com |
| CI Integration | TBD | tbd@example.com |

---

This document will be continually updated as we develop more testing patterns and best practices. All team members are encouraged to contribute improvements to this guide.

**Last updated:** May 8, 2025