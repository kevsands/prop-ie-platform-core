'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import CustomizationStudio from '@/components/customization/CustomizationStudio';

export default function CustomizePage() {
  const params = useParams();
  const propertyId = params.id as string;

  // Fetch property data
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) throw new Error('Failed to fetch property');
      return response.json();
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">Failed to load property information.</p>
      </div>
    );
  }

  return (
    <CustomizationStudio
      propertyId={propertyId}
      propertyData={
        id: property.id,
        title: property.name || property.title,
        price: property.price,
        modelUrl: property.modelUrl,
        developmentId: property.developmentId}
    />
  );
}