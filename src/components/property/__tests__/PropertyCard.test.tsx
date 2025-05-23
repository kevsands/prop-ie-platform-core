/**
 * Unit tests for PropertyCard component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyCard } from '../PropertyCard';
import { createMockProperty } from '@/test-utils/test-factories';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )}));

describe('PropertyCard', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush});
  });

  it('should render property details correctly', () => {
    const property = createMockProperty({
      title: 'Modern Apartment in Dublin',
      price: 350000,
      location: 'Dublin 2, Ireland',
      bedrooms: 2,
      bathrooms: 1,
      size: 85});

    render(<PropertyCard property={property} />);

    expect(screen.getByText('Modern Apartment in Dublin')).toBeInTheDocument();
    expect(screen.getByText('€350,000')).toBeInTheDocument();
    expect(screen.getByText('Dublin 2, Ireland')).toBeInTheDocument();
    expect(screen.getByText('2 beds')).toBeInTheDocument();
    expect(screen.getByText('1 bath')).toBeInTheDocument();
    expect(screen.getByText('85 m²')).toBeInTheDocument();
  });

  it('should display property image', () => {
    const property = createMockProperty({
      images: ['/property-1.jpg', '/property-2.jpg'],
      title: 'Test Property'});

    render(<PropertyCard property={property} />);

    const image = screen.getByAltText('Test Property');
    expect(image).toHaveAttribute('src', '/property-1.jpg');
  });

  it('should show placeholder when no image available', () => {
    const property = createMockProperty({
      images: [],
      title: 'No Image Property'});

    render(<PropertyCard property={property} />);

    expect(screen.getByAltText('No Image Property')).toHaveAttribute(
      'src',
      expect.stringContaining('placeholder')
    );
  });

  it('should navigate to property details on click', async () => {
    const property = createMockProperty({ id: 'prop-123' });
    const user = userEvent.setup();

    render(<PropertyCard property={property} />);

    const card = screen.getByRole('article');
    await user.click(card);

    expect(mockPush).toHaveBeenCalledWith('/properties/prop-123');
  });

  it('should show property status badge', () => {
    const property = createMockProperty({
      status: 'reserved'});

    render(<PropertyCard property={property} />);

    expect(screen.getByText('Reserved')).toHaveClass('badge-warning');
  });

  it('should display property features', () => {
    const property = createMockProperty({
      features: ['Parking', 'Balcony', 'Gym']});

    render(<PropertyCard property={property} />);

    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Balcony')).toBeInTheDocument();
    expect(screen.getByText('Gym')).toBeInTheDocument();
  });

  it('should show price reduction badge if applicable', () => {
    const property = createMockProperty({
      originalPrice: 400000,
      price: 350000});

    render(<PropertyCard property={property} />);

    expect(screen.getByText('Price Reduced')).toBeInTheDocument();
    expect(screen.getByText('€400,000')).toHaveClass('line-through');
  });

  it('should handle favorite button click', async () => {
    const onFavorite = jest.fn();
    const property = createMockProperty();
    const user = userEvent.setup();

    render(<PropertyCard property={property} onFavorite={onFavorite} />);

    const favoriteButton = screen.getByLabelText('Add to favorites');
    await user.click(favoriteButton);

    expect(onFavorite).toHaveBeenCalledWith(property.id);
  });

  it('should show favorited state', () => {
    const property = createMockProperty();

    render(<PropertyCard property={property} isFavorited />);

    const favoriteButton = screen.getByLabelText('Remove from favorites');
    expect(favoriteButton).toHaveClass('text-red-500');
  });

  it('should format large prices correctly', () => {
    const property = createMockProperty({
      price: 1250000});

    render(<PropertyCard property={property} />);

    expect(screen.getByText('€1,250,000')).toBeInTheDocument();
  });

  it('should show "New" badge for recent listings', () => {
    const property = createMockProperty({
      createdAt: new Date(), // Today
    });

    render(<PropertyCard property={property} />);

    expect(screen.getByText('New')).toHaveClass('badge-success');
  });

  it('should be keyboard accessible', async () => {
    const property = createMockProperty({ id: 'prop-123' });
    const user = userEvent.setup();

    render(<PropertyCard property={property} />);

    // Tab to the card
    await user.tab();
    const card = screen.getByRole('article');
    expect(card).toHaveFocus();

    // Press Enter to navigate
    await user.keyboard('{Enter}');
    expect(mockPush).toHaveBeenCalledWith('/properties/prop-123');
  });

  it('should show virtual tour indicator if available', () => {
    const property = createMockProperty({
      virtualTour: 'https://example.com/tour'});

    render(<PropertyCard property={property} />);

    expect(screen.getByText('Virtual Tour Available')).toBeInTheDocument();
  });

  it('should display developer information if available', () => {
    const property = createMockProperty({
      developer: {
        name: 'ABC Developers',
        logo: '/developer-logo.png'});

    render(<PropertyCard property={property} />);

    expect(screen.getByText('ABC Developers')).toBeInTheDocument();
  });

  it('should show urgency indicator for limited units', () => {
    const property = createMockProperty({
      availableUnits: 2,
      totalUnits: 50});

    render(<PropertyCard property={property} />);

    expect(screen.getByText('Only 2 units left!')).toHaveClass('text-orange-600');
  });

  it('should handle loading state', () => {
    render(<PropertyCard property={null} isLoading />);

    expect(screen.getByTestId('property-card-skeleton')).toBeInTheDocument();
  });

  it('should handle error state gracefully', () => {
    const property = createMockProperty({
      title: undefined as any,
      price: null as any});

    render(<PropertyCard property={property} />);

    expect(screen.getByText('Property Details Unavailable')).toBeInTheDocument();
  });
});