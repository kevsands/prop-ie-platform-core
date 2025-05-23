// This is a non-JSX TypeScript file to test our type changes

import React from 'react';
import PropertyCard from '@/components/property/PropertyCard';
import { PropertyStatus } from '@/types/enums';
import type { PropertyCardProps } from '@/components/property/PropertyCard';

// Test individual props - TypeScript should accept this
const individualProps: PropertyCardProps = {
  id: "prop-123",
  name: "Luxury Apartment",
  location: "Dublin, Ireland",
  price: 350000,
  status: PropertyStatus.Available,
  bedrooms: 2,
  bathrooms: 2,
  area: 85,
  imageUrl: "/images/properties/test.jpg",
};

// This simulates how it's used in PropertiesPage
const propertyFromPage = {
  id: "prop-123",
  name: "Luxury Apartment",
  location: "Dublin, Ireland",
  price: 350000,
  status: PropertyStatus.Available,
  bedrooms: 2,
  bathrooms: 2,
  area: 85,
  imageUrl: "/images/properties/test.jpg",
};

// Create a React element properly
const element = React.createElement(PropertyCard, {
  key: propertyFromPage.id,
  ...propertyFromPage,
});

// Export for testing
export { element, individualProps, propertyFromPage };