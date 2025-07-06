// src/components/property/PropertyCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/models"; // Updated import path
import { PropertyStatus, getStatusColor } from '../../types/enums'; // Import enum and helper

interface PropertyIndividualProps {
  // Core identification
  id: string;
  name: string;
  title?: string;
  
  // Location
  location?: string;
  
  // Unit details
  price?: number;
  status: PropertyStatus | string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floorArea?: number;
  type?: string;
  
  // Media
  image?: string;
  images?: string[];
  imageUrl?: string; // For backward compatibility
  
  // Development information
  developmentName?: string;
  projectName?: string;
  
  // Status flags
  isNew?: boolean;
  isReduced?: boolean;
}

// Support both property object and individual props
export type PropertyCardProps = {
  formatPrice?: (price: number | undefined | null) => string;
  showDevelopmentName?: boolean;
} & (
  | { property: Property }
  | PropertyIndividualProps
);

const PropertyCard: React.FC<PropertyCardProps> = React.memo((props) => {
  // Default values
  const formatPrice = props.formatPrice || ((price) => `€${price?.toLocaleString() || 'Price TBC'}`);
  const showDevelopmentName = props.showDevelopmentName !== false;

  // Extract properties - either from property object or direct props
  const {
    id,
    title,
    name,
    price,
    status,
    bedrooms,
    bathrooms,
    area,
    floorArea,
    image,
    images = [],
    developmentName,
    projectName,
    isNew,
    isReduced,
  } = 'property' in props 
    ? props.property 
    : props;
    
  // Handle imageUrl separately since TypeScript doesn't see it in destructuring
  const imageUrl = 'property' in props 
    ? props.property.imageUrl 
    : ('imageUrl' in props ? props.imageUrl : undefined);
    
  // Determine location from property object or direct props
  const location = 'property' in props 
    ? (props.property.address?.city || (props.property as any).location || '')
    : (props.location || '');
  // Use provided image or imageUrl (for backward compatibility)
  const actualImage = image || imageUrl;

  // Get display name, using title as fallback
  const displayName = title || name;
  
  // Get main image to display
  const mainImage = actualImage || (images.length > 0 ? images[0] : null);
  
  // Calculate area to display - use floorArea with area as fallback
  const displayArea = floorArea || area;
  
  // Get development name with fallbacks
  const displayDevelopment = developmentName || projectName || "Development TBC";

  return (
    <Link 
      key={id} 
      href={`/properties/${id}`} 
      prefetch={true}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
      aria-label={`View details for ${displayName}`}
    >
      <div className="relative h-56 w-full">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={`Exterior view of ${displayName}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to placeholder on error
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-property.jpg';
            }}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">No Image Available</div>
        )}
        <div className="absolute top-2 left-2 flex space-x-1">
          {isNew && <span className="px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded">New</span>}
          {isReduced && <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded">Reduced</span>}
        </div>
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {typeof status === 'string' 
              ? status.replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
              : status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-[#2B5273] transition-colors">
          {displayName}
        </h3>
        {showDevelopmentName && (
          <p className="text-sm text-gray-600 mt-1">
            {displayDevelopment}
          </p>
        )}
        <p className="text-xl font-bold text-[#2B5273] mt-2">{formatPrice(price)}</p>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{bedrooms ? `${bedrooms} Bed` : ""}</span>
          <span>{bathrooms ? `${bathrooms} Bath` : ""}</span>
          <span>{displayArea ? `${displayArea} sq m` : ""}</span>
        </div>
      </div>
    </Link>
  );
});

PropertyCard.displayName = "PropertyCard"; // Add display name for better debugging

export default PropertyCard;