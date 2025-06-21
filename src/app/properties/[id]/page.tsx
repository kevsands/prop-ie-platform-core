'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, Home } from "lucide-react";
import Link from "next/link";

// Property to Unit Mapping Service
const PropertyMappingService = {
  findUnitByPropertyId: async (propertyId: string) => {
    try {
      // First try to find unit directly by the property ID
      const unitResponse = await fetch(`/api/units/${propertyId}`);
      if (unitResponse.ok) {
        const unitData = await unitResponse.json();
        return unitData.data || unitData;
      }

      // If not found, try searching all units
      const allUnitsResponse = await fetch('/api/units?limit=200');
      if (allUnitsResponse.ok) {
        const allUnitsData = await allUnitsResponse.json();
        const units = allUnitsData.units || allUnitsData.data || [];
        
        // Try to find by ID, unitNumber, or name
        const unit = units.find((u: any) => 
          u.id === propertyId || 
          u.unitNumber === propertyId || 
          u.name === propertyId ||
          u.propertyId === propertyId
        );
        
        return unit;
      }

      return null;
    } catch (error) {
      console.error('Error finding unit:', error);
      return null;
    }
  },

  getDevelopmentSlug: (developmentId: string, developmentName?: string) => {
    // Convert development ID to URL-friendly slug
    if (developmentName) {
      return developmentName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    return developmentId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
};

export default function PropertyRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToUnitPage = async () => {
      if (!propertyId) {
        setError("Property ID not found in URL");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Find the unit that corresponds to this property ID
        const unit = await PropertyMappingService.findUnitByPropertyId(propertyId);
        
        if (unit && unit.developmentId) {
          // Get development slug
          const developmentSlug = PropertyMappingService.getDevelopmentSlug(
            unit.developmentId, 
            unit.development?.name
          );
          
          // Get unit identifier (prefer unitNumber, fallback to id)
          const unitIdentifier = unit.unitNumber || unit.id;
          
          // Redirect to new unit page structure
          const newUrl = `/developments/${developmentSlug}/units/${unitIdentifier}`;
          
          console.log(`Redirecting from /properties/${propertyId} to ${newUrl}`);
          router.replace(newUrl);
          return;
        }

        // If no unit found, show error state
        setError("Property not found or has been moved");
        setLoading(false);
        
      } catch (error) {
        console.error('Error during property redirect:', error);
        setError("Failed to redirect to property page");
        setLoading(false);
      }
    };

    redirectToUnitPage();
  }, [propertyId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Redirecting to Property...
          </h1>
          <p className="text-gray-600">
            We're taking you to the new property page format
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error}. The property you're looking for may have been moved or no longer exists.
          </p>
          <div className="space-y-3">
            <Link 
              href="/properties/search"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
            >
              Search All Properties
            </Link>
            <Link 
              href="/developments"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
            >
              View Developments
            </Link>
            <Link 
              href="/"
              className="w-full text-gray-600 py-3 px-6 rounded-lg font-medium hover:text-gray-800 transition-colors inline-flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}