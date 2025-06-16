'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Plus, 
  Bed, 
  Bath, 
  Square, 
  Home, 
  MapPin, 
  Trash2, 
  Check,
  Calendar,
  Euro,
  Zap,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: 'available' | 'reserved' | 'sold';
  isNew: boolean;
  mainImage: string;
  additionalImages: string[];
  description: string;
  features: string[];
  developmentId?: string;
  developmentName?: string;
  readyDate?: string;
  energyRating?: string;
  specifications?: Record<string, string>
  );
}

interface PropertyComparisonProps {
  properties: Property[];
  onAddProperty?: () => void;
  onRemoveProperty?: (propertyId: string) => void;
  onSelectProperty?: (property: Property) => void;
}

export default function PropertyComparison({
  properties,
  onAddProperty,
  onRemoveProperty,
  onSelectProperty
}: PropertyComparisonProps) {
  const [viewModesetViewMode] = useState<'basic' | 'detailed'>('basic');

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0}).format(amount);
  };

  // Common specifications to compare
  const commonSpecifications = [
    { key: 'floorArea', label: 'Floor Area' },
    { key: 'energyRating', label: 'Energy Rating' },
    { key: 'heatingSystem', label: 'Heating System' },
    { key: 'windowType', label: 'Windows' },
    { key: 'garden', label: 'Garden' },
    { key: 'parking', label: 'Parking' },
    { key: 'kitchen', label: 'Kitchen' },
    { key: 'flooring', label: 'Flooring' },
    { key: 'security', label: 'Security' }
  ];

  // Common features to compare
  const commonFeatures = [
    'South-facing garden',
    'A-rated energy efficiency',
    'Electric car charging point',
    'Solar panels',
    'Fitted kitchen',
    'Smart home ready',
    'Utility room',
    'Ensuite bathroom',
    'Walk-in wardrobe',
    'High-speed broadband ready'
  ];

  // Generate mock specifications for properties that don't have them
  const generateMockSpecifications = (property: Property): Record<string, string> => {
    if (property.specifications) return property.specifications;

    // Default specifications based on property type
    return {
      floorArea: `${property.area} m²`,
      energyRating: property.energyRating || 'A3',
      heatingSystem: 'Air to water heat pump',
      windowType: 'Triple glazed',
      garden: property.type === 'apartment' ? 'Balcony' : 'Private rear garden',
      parking: property.type === 'apartment' ? 'Designated space' : '2 car driveway',
      kitchen: 'Fully fitted contemporary kitchen',
      flooring: 'Engineered wood & tiles',
      security: 'Alarm system & smart locks'
    };
  };

  // Check if a feature is included in a property
  const hasFeature = (property: Property, feature: string): boolean => {
    return property.features.some(f => 
      f.toLowerCase().includes(feature.toLowerCase()));
  };

  // Handle property selection
  const handlePropertySelect = (property: Property) => {
    if (onSelectProperty) {
      onSelectProperty(property);
    }
  };

  // Handle property removal
  const handleRemoveProperty = (propertyId: string) => {
    if (onRemoveProperty) {
      onRemoveProperty(propertyId);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 md:p-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <ArrowUpDown className="h-5 w-5 mr-2" />
            <h2 className="text-lg md:text-xl font-semibold">Property Comparison</h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('basic')}
              className={`px-3 py-1 text-xs rounded-md ${
                viewMode === 'basic' 
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              Basic
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 text-xs rounded-md ${
                viewMode === 'detailed' 
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              Detailed
            </button>
          </div>
        </div>
        <p className="text-white/80 text-sm">
          Compare properties side by side to find your perfect match
        </p>
      </div>

      <div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex p-4">
            {/* Property columns */}
            {properties.map((propertyindex: any) => (
              <div key={property.id} className="flex-shrink-0 w-[280px] md:w-[320px] border-r last:border-r-0 pr-3 mr-3 last:pr-0 last:mr-0">
                {/* Property Card */}
                <div className="relative">
                  <img 
                    src={property.mainImage} 
                    alt={property.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveProperty(property.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>

                  {/* Status badge */}
                  {property.status !== 'available' && (
                    <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium ${
                      property.status === 'reserved' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {property.status === 'reserved' ? 'Reserved' : 'Sold'}
                    </div>
                  )}

                  <h3 className="font-semibold text-lg mb-1 truncate">{property.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 flex-shrink-0 mr-1" />
                    <p className="text-sm truncate">{property.location}</p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.area} m²</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-lg font-bold mb-3">{formatCurrency(property.price)}</div>

                  <div className="mb-3">
                    <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </span>
                    {property.energyRating && (
                      <span className="ml-1 inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {property.energyRating}
                      </span>
                    )}
                    {property.readyDate && (
                      <span className="ml-1 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Ready {new Date(property.readyDate).toLocaleDateString('en-IE', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => handlePropertySelect(property)}
                    className="w-full"
                    disabled={property.status !== 'available'}
                  >
                    {property.status === 'available' ? 'View Details' : 'Not Available'}
                  </Button>
                </div>
              </div>
            ))}

            {/* Add Property Card */}
            {properties.length <4 && (
              <div className="flex-shrink-0 w-[280px] md:w-[320px]">
                <div 
                  className="h-[360px] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={onAddProperty}
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Add Property</h3>
                  <p className="text-gray-500 text-center text-sm">
                    Add another property to compare features and specifications
                  </p>
                </div>
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {viewMode === 'basic' ? (
        <div className="px-4 pb-4">
          {/* Basic comparison table */}
          <div className="border-t mt-4 pt-4">
            <h3 className="font-medium text-gray-900 mb-4">Key Comparison</h3>

            <div className="grid gap-2">
              <div className="grid grid-cols-5 gap-3">
                <div className="font-medium text-gray-700">Feature</div>
                {properties.map(property => (
                  <div key={`header-${property.id}`} className="text-center text-sm font-medium text-gray-600">
                    {property.name.split(' - ')[1] || property.name.split(' ').slice(-1)[0]}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                <div className="text-gray-700 flex items-center">
                  <Euro className="h-4 w-4 mr-2 text-gray-400" />
                  Price
                </div>
                {properties.map(property => (
                  <div key={`price-${property.id}`} className="text-center">
                    <span className="font-medium">{formatCurrency(property.price)}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                <div className="text-gray-700 flex items-center">
                  <Home className="h-4 w-4 mr-2 text-gray-400" />
                  Type
                </div>
                {properties.map(property => (
                  <div key={`type-${property.id}`} className="text-center">
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                <div className="text-gray-700 flex items-center">
                  <Bed className="h-4 w-4 mr-2 text-gray-400" />
                  Bedrooms
                </div>
                {properties.map(property => (
                  <div key={`bed-${property.id}`} className="text-center">
                    {property.bedrooms}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                <div className="text-gray-700 flex items-center">
                  <Bath className="h-4 w-4 mr-2 text-gray-400" />
                  Bathrooms
                </div>
                {properties.map(property => (
                  <div key={`bath-${property.id}`} className="text-center">
                    {property.bathrooms}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                <div className="text-gray-700 flex items-center">
                  <Square className="h-4 w-4 mr-2 text-gray-400" />
                  Floor Area
                </div>
                {properties.map(property => (
                  <div key={`area-${property.id}`} className="text-center">
                    {property.area} m²
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                <div className="text-gray-700 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-gray-400" />
                  Energy Rating
                </div>
                {properties.map(property => (
                  <div key={`energy-${property.id}`} className="text-center">
                    {property.energyRating || 'N/A'}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                <div className="text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Ready Date
                </div>
                {properties.map(property => (
                  <div key={`ready-${property.id}`} className="text-center">
                    {property.readyDate 
                      ? new Date(property.readyDate).toLocaleDateString('en-IE', { month: 'short', year: 'numeric' })
                      : 'N/A'
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4">
          {/* Detailed comparison table */}
          <div className="border-t mt-4 pt-4">
            <h3 className="font-medium text-gray-900 mb-4">Detailed Comparison</h3>

            <div className="grid gap-6">
              {/* Basic info section */}
              <div>
                <h4 className="text-sm font-medium uppercase text-gray-500 mb-3">Basic Information</h4>
                <div className="grid gap-2">
                  <div className="grid grid-cols-5 gap-3">
                    <div className="font-medium text-gray-700">Feature</div>
                    {properties.map(property => (
                      <div key={`header-${property.id}`} className="text-center text-sm font-medium text-gray-600">
                        {property.name.split(' - ')[1] || property.name.split(' ').slice(-1)[0]}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                    <div className="text-gray-700">Price</div>
                    {properties.map(property => (
                      <div key={`price-det-${property.id}`} className="text-center">
                        <span className="font-medium">{formatCurrency(property.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                    <div className="text-gray-700">Type</div>
                    {properties.map(property => (
                      <div key={`type-det-${property.id}`} className="text-center">
                        {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                    <div className="text-gray-700">Location</div>
                    {properties.map(property => (
                      <div key={`loc-${property.id}`} className="text-center">
                        {property.location.split(',')[0]}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                    <div className="text-gray-700">Development</div>
                    {properties.map(property => (
                      <div key={`dev-${property.id}`} className="text-center">
                        {property.developmentName || 'N/A'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Specifications section */}
              <div>
                <h4 className="text-sm font-medium uppercase text-gray-500 mb-3">Specifications</h4>
                <div className="grid gap-2">
                  {commonSpecifications.map(spec => (
                    <div key={spec.key} className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                      <div className="text-gray-700">{spec.label}</div>
                      {properties.map(property => {
                        const specs = generateMockSpecifications(property);
                        return (
                          <div key={`${spec.key}-${property.id}`} className="text-center">
                            {specs[spec.key] || 'N/A'}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Features section */}
              <div>
                <h4 className="text-sm font-medium uppercase text-gray-500 mb-3">Features</h4>
                <div className="grid gap-2">
                  {commonFeatures.map(feature => (
                    <div key={feature} className="grid grid-cols-5 gap-3 py-2 border-b border-gray-100">
                      <div className="text-gray-700">{feature}</div>
                      {properties.map(property => (
                        <div key={`${feature}-${property.id}`} className="text-center">
                          {hasFeature(propertyfeature) ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                              <Check className="h-4 w-4 text-green-600" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                              <X className="h-4 w-4 text-gray-400" />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}