// src/types/developments.ts
// Updated with proper type definitions

// Define the missing enum types
export enum PropertyStatus {
  Available = "Available",
  Reserved = "Reserved",
  Sold = "Sold",
  UnderConstruction = "Under Construction",
  ComingSoon = "Coming Soon",
  OffMarket = "Off Market"
}

export enum PropertyType {
  Apartment = "Apartment",
  House = "House",
  Townhouse = "Townhouse",
  Duplex = "Duplex",
  Villa = "Villa",
  Studio = "Studio",
  Penthouse = "Penthouse"
}

export interface Development {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  status?: string;
  statusColor?: string;
  priceRange?: string;
  availability?: string;
  bedrooms?: number | number[];
  bathrooms?: number;
  squareFeet?: number;
  features?: string[];
  amenities?: string[];
  brochureUrl?: string;
  virtualTourUrl?: string;
  showingDates?: string[];
  depositAmount?: string;
  energyRating?: string;
  type?: string;
  units?: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    image: string;
  }>\n  );
  floorPlans?: Array<{
    id: string;
    name: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    image: string;
    price?: string;  // Made price optional to match mock data
  }>\n  );
  mapLocation?: {
    lat: number;
    lng: number;
  };
  // Legacy fields for backward compatibility
  availabilityStatus?: string;
  buildingType?: string;
  totalUnits?: number;
  developmentFeatures?: string[];
  areaAmenities?: string[];
  salesAgent?: { name: string; agency: string };
  createdAt?: string;
  updatedAt?: string;
}

// Property interface with correct type references
export interface Property {
  id: string;
  name: string;
  slug: string;
  projectId: string;
  projectName: string;
  projectSlug: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
  };
  unitNumber: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  floorArea: number;
  features: string[];
  amenities: string[];
  images: string[];
  floorPlan: string;
  description: string;
  isNew?: boolean;
  isReduced?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sample export that combines all property-related types
export type PropertyWithDevelopment = Property & {
  development: Development;
};