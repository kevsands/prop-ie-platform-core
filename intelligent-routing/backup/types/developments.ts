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
  status: string;
  statusColor: string;
  priceRange: string;
  availabilityStatus: string;
  bedrooms: number[];
  bathrooms: number;
  buildingType: string;
  totalUnits: number;
  brochureUrl: string;
  virtualTourUrl: string;
  developmentFeatures: string[];
  areaAmenities: string[];
  salesAgent: { name: string; agency: string };
  showingDates: string[];
  createdAt: string;
  updatedAt: string;
}

// src/types/properties.ts
// Updated Property interface with correct type references

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