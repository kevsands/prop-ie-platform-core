"use client";

import React from 'react';
import PropertyCard from './PropertyCard';
import { PropertyStatus, PropertyType } from '@/types/search';
import { Property } from '@/types/models';

// Test with individual props
export function PropertyCardWithIndividualProps() {
  return (
    <PropertyCard
      id="prop-123"
      name="Luxury Apartment"
      location="Dublin, Ireland"
      price={350000}
      status={PropertyStatus.Available}
      bedrooms={2}
      bathrooms={2}
      area={85}
      imageUrl="/images/properties/test.jpg"
    />
  );
}

// Test with property object
export function PropertyCardWithPropertyObject() {
  const property: Property = {
    id: "prop-456",
    name: "Townhouse",
    slug: "townhouse-456",
    projectId: "project-1",
    projectName: "City View",  
    projectSlug: "city-view",
    developmentId: "dev-1",
    developmentName: "Downtown Development",
    unitNumber: "A123",
    price: 450000,
    status: PropertyStatus.Reserved,
    type: "townhouse",
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    floorArea: 120,
    features: ["Garden", "Solar Panels"],
    amenities: ["Gym", "Pool"],
    images: ["/images/properties/test2.jpg"],
    floorPlan: "/images/floor-plans/townhouse.jpg",
    description: "Beautiful townhouse in the heart of the city",
    createdAt: "2023-01-01",
    updatedAt: "2023-02-15"
  };

  return (
    <PropertyCard property={property} />
  );
}

// Test component to demonstrate both usages
export default function PropertyCardTestPage() {
  const mockProperty = {
    id: '1',
    name: 'Test Property',
    title: 'Test Property',
    address: '123 Test St',
    price: 300000,
    status: PropertyStatus.AVAILABLE,
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 150,
    type: PropertyType.APARTMENT,
    images: ['test.jpg']
  };

  const mockProperty2 = {
    id: '2',
    name: 'Test Property 2',
    title: 'Test Property 2',
    address: '456 Test St',
    price: 400000,
    status: PropertyStatus.RESERVED,
    bedrooms: 4,
    bathrooms: 3,
    floorArea: 200,
    type: PropertyType.HOUSE,
    images: ['test2.jpg']
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Property Card Test Page</h1>

      {/* Using individual props */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Using Individual Props</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PropertyCard
            id="1"
            name="Luxury Apartment"
            title="Luxury Apartment in City Center"
            address="123 Main St, Dublin"
            price={450000}
            status={PropertyStatus.AVAILABLE}
            bedrooms={3}
            bathrooms={2}
            floorArea={120}
            type={PropertyType.APARTMENT}
            images={['/images/property1.jpg']}
          />

          <PropertyCard
            id="2"
            name="Modern House"
            title="Modern House with Garden"
            address="456 Oak St, Cork"
            price={550000}
            status={PropertyStatus.RESERVED}
            bedrooms={4}
            bathrooms={3}
            floorArea={180}
            type={PropertyType.HOUSE}
            images={['/images/property2.jpg']}
          />
        </div>
      </div>

      {/* Using property object */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Using Property Object</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PropertyCard property={mockProperty} />
          <PropertyCard property={mockProperty2} />
        </div>
      </div>
    </div>
  );
}