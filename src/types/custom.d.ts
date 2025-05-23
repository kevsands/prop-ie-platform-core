// Define interfaces for your custom types

// For CustomizationOption
export interface CustomizationOption {
    id: string;
    name: string;
    description?: string;
    price?: number;
    modelPath?: string;
    customData?: any;
    category?: string;
    room?: string;
    supplierItemId?: string;
  }
  
  // For SelectedOption
  export interface SelectedOption {
    id: string;
    option: CustomizationOption;
    quantity?: number;
  }
  
  // For CustomizationState
  export interface CustomizationState {
    selectedOptions?: Record<string, SelectedOption>\n  );
    lastSaved?: Date;
    totalCost?: number;
  }
  
  // For CustomizationContextType
  export interface CustomizationContextType {
    selectedOptions?: Record<string, SelectedOption>\n  );
    totalCost?: number;
    // Add other properties needed
  }
  
  // For User type 
  export interface User {
    id: string;
    name?: string;
    email?: string;
    // Instead of user property, add the properties directly
    role?: string;
  }
  
  // For ProtectedRouteProps
  export interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
  }
  
  // For Property types
  export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'under_offer';
  export type PropertyType = 'house' | 'apartment' | 'duplex';
  
  export interface PropertyFilter {
    location?: string;
    minBedrooms?: number;
    maxBedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: PropertyStatus;
    type?: PropertyType;
    projectId?: string;
  }
  
  export interface PropertyListResponse {
    properties: Property[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }
  
  export interface PropertySearchParams {
    projectSlug?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    type?: PropertyType;
    status?: PropertyStatus;
    query?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }
  
  export interface Property {
    id: string;
    name: string;
    slug: string;
    description: string;
    projectId: string;
    projectName: string;
    projectSlug: string;
    address: string;
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
    virtualTourUrl?: string;
    createdAt: string;
    updatedAt: string;
    // Add optional properties that appear in your code
    isNew?: boolean;
    isReduced?: boolean;
  }