// src/types/index.ts
// Consolidated type definitions for your property platform

// Property Status Types
export enum PropertyStatus {
    Available = "Available",
    Reserved = "Reserved",
    Sold = "Sold",
    UnderConstruction = "Under Construction",
    ComingSoon = "Coming Soon",
    OffMarket = "Off Market"
  }
  
  // Property Types
  export enum PropertyType {
    Apartment = "Apartment",
    House = "House",
    Townhouse = "Townhouse",
    Duplex = "Duplex",
    Villa = "Villa",
    Studio = "Studio",
    Penthouse = "Penthouse"
  }
  
  // Development Interface
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
  
  // Property Interface
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
  
  // Property Detail with all information needed for detail view
  export interface PropertyDetail extends Property {
    development?: Development;
    floorPlanUrl?: string;
    virtualTourUrl?: string;
    developmentName?: string;
    developmentId?: string;
    isFeatured?: boolean;
    location?: {
      lat: number;
      lng: number;
    };
  }
  
  // Type definitions for customization options
  export interface CustomizationOption {
    id: string;
    name: string;
    category: string;
    room: string;
    price: number;
    image?: string;
    unit: string;
    materialPath?: string;
    modelPath?: string;
    customData?: {
      colorHex?: string;
      position?: [number, number, number];
      rotation?: [number, number, number];
      scale?: [number, number, number];
    };
  }
  
  export interface SelectedOption {
    optionId: string;
    option: CustomizationOption;
  }
  
  // Missing Customization interface
  export interface Customization {
    id: string;
    propertyId: string;
    userId: string;
    name?: string;
    description?: string;
    selectedOptions: SelectedOption[];
    totalCost: number;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
  }
  
  // Filter interfaces for searching
  export interface PropertyFilters {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: PropertyType;
    status?: PropertyStatus;
  }
  
  export interface DevelopmentFilters {
    location?: string;
    priceRange?: string;
    bedrooms?: number;
    status?: string;
  }
  
  // API response types for GraphQL/REST
  export interface GraphQLListResponse<T> {
    items: T[];
    nextToken?: string | null;
  }
  
  export interface ListDevelopmentsResponse {
    listDevelopments: GraphQLListResponse<Development> | null;
  }
  
  export interface ListPropertiesResponse {
    listProperties: GraphQLListResponse<Property> | null;
  }
  
  // User related types
  export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    role: 'buyer' | 'investor' | 'agent' | 'developer' | 'admin';
    savedProperties?: string[];
    savedDevelopments?: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  // User auth types to align with AuthContext
  export interface User {
    userId: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    roles?: string[];
  }
  
  // ——— Added missing types for DataService ———
  export interface Room {
    id: string;
    name: string;
    icon?: string;
    displayOrder?: number;
  }
  
  export interface Category {
    id: string;
    name: string;
    displayOrder?: number;
  }
  
  export interface UserInfo {
    userId: string;
    username: string;
    email?: string;
    roles: string[];
  }
  
  export interface ListCustomizationOptionsResponse {
    listCustomizationOptions: {
      items: CustomizationOption[];
      nextToken?: string | null;
    } | null;
  }
  
  export interface ListRoomsResponse {
    listRooms: {
      items: Room[];
      nextToken?: string | null;
    } | null;
  }
  
  export interface ListCategoriesResponse {
    listCategories: {
      items: Category[];
      nextToken?: string | null;
    } | null;
  }
  
  export interface ListCustomizationsResponse {
    listCustomizations: {
      items: Customization[];
      nextToken?: string | null;
    } | null;
  }
  
  export interface GetCustomizationResponse {
    getCustomization: Customization | null;
  }
  
  export interface CreateMutationResponse {
    createCustomization: { id: string };
  }
  
  export interface UpdateMutationResponse {
    updateCustomization: { id: string };
  }
  
  export interface DeleteMutationResponse {
    deleteCustomization: { id: string };
  }
  
  // Auth context related types
  export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    error: Error | string | null;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
  }