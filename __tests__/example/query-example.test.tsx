/**
 * Query Example Test
 * 
 * This test demonstrates how to use the new test utilities and mocks
 * for testing components that use React Query.
 */

import React from 'react';
import { renderWithQueryClient, screen } from '../../src/tests/utils/query-test-utils';
import { mockUseQuery } from '../../src/tests/mocks/react-query-mock';
import '@testing-library/jest-dom';

// Create a simple component that uses React Query
interface DevelopmentListProps {
  title?: string;
}

const DevelopmentList: React.FC<DevelopmentListProps> = ({ title = 'Developments' }) => {
  const { data: developments = [], isLoading } = mockUseQuery(['developments']);

  if (isLoading) {
    return <div data-testid="loading">Loading developments...</div>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <ul data-testid="development-list">
        {developments.map((dev: any) => (
          <li key={dev.id} data-testid={`development-${dev.id}`}>
            {dev.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('DevelopmentList Component', () => {
  it('renders development list correctly', () => {
    // Render the component using our custom utility
    renderWithQueryClient(<DevelopmentList />);
    
    // Verify the component renders correctly
    expect(screen.getByText('Developments')).toBeInTheDocument();
    expect(screen.getByTestId('development-list')).toBeInTheDocument();
    
    // Verify that mock data is displayed
    expect(screen.getByTestId('development-dev-1')).toHaveTextContent('Riverside Manor');
    expect(screen.getByTestId('development-dev-2')).toHaveTextContent('Mountain View');
  });

  it('respects custom title prop', () => {
    renderWithQueryClient(<DevelopmentList title="Featured Properties" />);
    expect(screen.getByText('Featured Properties')).toBeInTheDocument();
  });
});

// Create a simple component that interacts with props and state
interface PropertyCardProps {
  propertyId: string;
  onSelect?: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ propertyId, onSelect }) => {
  const { data: property } = mockUseQuery(['properties', { id: propertyId }]);
  const [isSelected, setIsSelected] = React.useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
    if (onSelect) {
      onSelect(propertyId);
    }
  };

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div 
      data-testid={`property-card-${propertyId}`}
      className={isSelected ? 'selected' : ''}
      onClick={handleClick}
    >
      <h3>{property.type} - {property.bedrooms} BR</h3>
      <p>Price: €{property.price}</p>
      <p>Status: {property.status}</p>
    </div>
  );
};

describe('PropertyCard Component', () => {
  it('renders property details correctly', () => {
    renderWithQueryClient(<PropertyCard propertyId="prop-1" />);
    
    const card = screen.getByTestId('property-card-prop-1');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('APARTMENT - 2 BR');
    expect(card).toHaveTextContent('Price: €350000');
    expect(card).toHaveTextContent('Status: AVAILABLE');
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = jest.fn();
    renderWithQueryClient(
      <PropertyCard propertyId="prop-1" onSelect={handleSelect} />
    );
    
    const card = screen.getByTestId('property-card-prop-1');
    card.click();
    
    expect(handleSelect).toHaveBeenCalledWith('prop-1');
  });
});