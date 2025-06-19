'use client';

import React from 'react';
import { PropertySearch } from '@/components/buyer/PropertySearch';

export default function BuyerSearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Home</h1>
        <p className="text-gray-600">
          Search through our extensive collection of properties and find your dream home with our advanced filters.
        </p>
      </div>
      
      <PropertySearch 
        className="mb-8"
        showFilters={true}
        defaultFilters={{
          htbEligible: false
        }}
      />
    </div>
  );
}