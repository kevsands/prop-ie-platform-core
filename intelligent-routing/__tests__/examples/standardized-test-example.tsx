/**
 * Standardized Test Example
 * 
 * This file demonstrates how to use the standardized test utilities
 * for testing different types of components.
 */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import 'jest-extended';

// Import the standardized test utilities
import { 
  customRender, 
  setupUser,
  renderWithQueryClient,
  renderWithAuth,
  mockFetch,
  createMockProperty,
  createMockUser
} from '../../src/test-utils';

// Simple component example
function SimpleButton({ 
  onClick, 
  label = 'Click me', 
  disabled = false 
}: { 
  onClick: () => void; 
  label?: string; 
  disabled?: boolean 
}) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      data-testid="test-button"
    >
      {label}
    </button>
  );
}

// Test a simple component
describe('SimpleButton Component', () => {
  it('renders correctly with default props', () => {
    const handleClick = jest.fn();
    customRender(<SimpleButton onClick={handleClick} />);
    
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
    expect(screen.getByTestId('test-button')).not.toBeDisabled();
  });
  
  it('uses the provided label', () => {
    const handleClick = jest.fn();
    customRender(<SimpleButton onClick={handleClick} label="Submit" />);
    
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
  
  it('can be disabled', () => {
    const handleClick = jest.fn();
    customRender(<SimpleButton onClick={handleClick} disabled={true} />);
    
    expect(screen.getByTestId('test-button')).toBeDisabled();
  });
  
  it('calls the onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const { user } = setupUser(<SimpleButton onClick={handleClick} />);
    
    await user.click(screen.getByTestId('test-button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// Example component using API
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  
  React.useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]);
  
  if (loading) {
    return <div data-testid="loading">Loading user profile...</div>;
  }
  
  if (error) {
    return <div data-testid="error">Error: {error.message}</div>;
  }
  
  if (!user) {
    return <div data-testid="not-found">User not found</div>;
  }
  
  return (
    <div data-testid="user-profile">
      <h1>{user.firstName} {user.lastName}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

// Test the API component
describe('UserProfile Component', () => {
  it('shows loading state initially', () => {
    mockFetch(null);
    customRender(<UserProfile userId="user-1" />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
  
  it('displays user information after loading', async () => {
    const mockUser = createMockUser({ 
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'BUYER'
    });
    
    mockFetch(mockUser);
    customRender(<UserProfile userId="user-1" />);
    
    // Check that loading state is shown initially
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Wait for the user data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    // Check that user data is displayed
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Role: BUYER')).toBeInTheDocument();
  });
  
  it('shows error state when fetch fails', async () => {
    mockFetch({ error: 'User not found' }, 404, false);
    customRender(<UserProfile userId="invalid-user" />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByText(/Error: Failed to fetch user/i)).toBeInTheDocument();
  });
});

// Example protected component that requires authentication
function ProtectedContent({ content }: { content: string }) {
  // This is a simplified example - in reality you would use a hook to get auth state
  const isAuthenticated = true;
  const user = createMockUser();
  
  if (!isAuthenticated) {
    return <div data-testid="unauthorized">Please log in to view this content</div>;
  }
  
  return (
    <div data-testid="protected-content">
      <h2>Welcome, {user.firstName}!</h2>
      <div>{content}</div>
    </div>
  );
}

// Test the protected component with auth utilities
describe('ProtectedContent Component', () => {
  it('renders content when authenticated', () => {
    renderWithAuth(
      <ProtectedContent content="Secret content" />,
      { 
        isAuthenticated: true, 
        user: createMockUser({ firstName: 'Jane' })
      }
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Welcome, Jane!')).toBeInTheDocument();
    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });
  
  it('shows unauthorized message when not authenticated', () => {
    renderWithAuth(
      <ProtectedContent content="Secret content" />,
      { isAuthenticated: false }
    );
    
    expect(screen.getByTestId('unauthorized')).toBeInTheDocument();
    expect(screen.getByText('Please log in to view this content')).toBeInTheDocument();
  });
});

// Example component using React Query
function PropertyCard({ propertyId }: { propertyId: string }) {
  // In a real component, this would use useQuery
  const { data: property, isLoading, isError } = { 
    data: createMockProperty({ 
      id: propertyId, 
      title: 'Luxury Apartment',
      price: 450000,
      bedrooms: 3
    }),
    isLoading: false,
    isError: false
  };
  
  if (isLoading) {
    return <div data-testid="loading">Loading property...</div>;
  }
  
  if (isError || !property) {
    return <div data-testid="error">Error loading property</div>;
  }
  
  return (
    <div data-testid={`property-card-${propertyId}`}>
      <h2>{property.title}</h2>
      <p>{property.bedrooms} bedroom</p>
      <p>€{property.price.toLocaleString()}</p>
      <button>View details</button>
    </div>
  );
}

// Test the React Query component
describe('PropertyCard Component', () => {
  it('renders property details', () => {
    renderWithQueryClient(<PropertyCard propertyId="prop-1" />);
    
    expect(screen.getByTestId('property-card-prop-1')).toBeInTheDocument();
    expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
    expect(screen.getByText('3 bedroom')).toBeInTheDocument();
    expect(screen.getByText('€450,000')).toBeInTheDocument();
  });
});

// Combined utilities example
function ComplexPage() {
  // This would use hooks in a real component
  const isAuthenticated = true;
  const user = createMockUser({ firstName: 'Alice' });
  const properties = [
    createMockProperty({ id: 'prop-1', title: 'Modern Apartment' }),
    createMockProperty({ id: 'prop-2', title: 'Suburban House' })
  ];
  
  if (!isAuthenticated) {
    return <div data-testid="login-required">Please log in to view properties</div>;
  }
  
  return (
    <div data-testid="complex-page">
      <header>
        <h1>Welcome, {user.firstName}</h1>
        <button data-testid="logout-button">Logout</button>
      </header>
      
      <main>
        <h2>Your Saved Properties</h2>
        <div className="property-list">
          {properties.map(property => (
            <div key={property.id} data-testid={`property-${property.id}`}>
              <h3>{property.title}</h3>
              <p>€{property.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// Test the complex page with combined utilities
describe('ComplexPage Component', () => {
  it('renders correctly for authenticated users', async () => {
    const { user } = setupUser(
      <ComplexPage />,
      { withProviders: true }
    );
    
    expect(screen.getByTestId('complex-page')).toBeInTheDocument();
    expect(screen.getByText('Welcome, Alice')).toBeInTheDocument();
    expect(screen.getByText('Your Saved Properties')).toBeInTheDocument();
    expect(screen.getByTestId('property-prop-1')).toBeInTheDocument();
    expect(screen.getByTestId('property-prop-2')).toBeInTheDocument();
    
    // Test user interaction
    await user.click(screen.getByTestId('logout-button'));
    // In a real test, we would assert something happened after click
  });
});