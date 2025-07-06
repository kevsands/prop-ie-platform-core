// src/types/enums.ts
// Consolidated enum definitions for the PropIE platform

/**
 * Property Status Types
 * Represents the current status of a property in the sales process
 */
export enum PropertyStatus {
  Available = 'available',
  Reserved = 'reserved',
  Sold = 'sold',
  UnderOffer = 'under_offer',
  ComingSoon = 'coming_soon',
  UnderConstruction = 'under_construction',
  OffMarket = 'off_market',
  Selling = 'selling',
  SaleAgreed = 'sale_agreed',
  ToLet = 'to_let'
}

/**
 * Property Types
 * Represents the type/category of a property
 */
export enum PropertyType {
  House = 'house',
  Apartment = 'apartment',
  Townhouse = 'townhouse',
  Duplex = 'duplex',
  Bungalow = 'bungalow',
  SemiDetached = 'semi-detached',
  Detached = 'detached',
  Terrace = 'terrace',
  Villa = 'villa',
  Studio = 'studio',
  Penthouse = 'penthouse'
}

/**
 * Development Status Types
 * Represents the current status of a development project
 */
export enum DevelopmentStatus {
  Planning = 'planning',
  Approved = 'approved',
  UnderConstruction = 'under_construction',
  Completed = 'completed',
  Selling = 'selling',
  SoldOut = 'sold_out',
  SellingFast = 'selling_fast',
  NewRelease = 'new_release',
  LaunchingSoon = 'launching_soon',
  Future = 'future',
  Paused = 'paused'
}

/**
 * User Roles
 * Defines the different roles users can have in the system
 */
export enum UserRole {
  Buyer = 'buyer',
  Investor = 'investor',
  Agent = 'agent',
  Developer = 'developer',
  Admin = 'admin'
}

/**
 * Customization Status
 * Represents the current status of a property customization
 */
export enum CustomizationStatus {
  Draft = 'draft',
  Submitted = 'submitted',
  Approved = 'approved',
  Rejected = 'rejected'
}

/**
 * Contract Status
 * Represents the current status of a contract document
 */
export enum ContractStatus {
  Draft = 'draft',
  Pending = 'pending',
  Signed = 'signed',
  Expired = 'expired',
  Canceled = 'canceled'
}

/**
 * Helper functions to normalize values between string and enum
 */

/**
 * Convert string status to PropertyStatus enum
 * @param status String status value (case-insensitive)
 * @returns PropertyStatus enum value or undefined if not found
 */
export function stringToPropertyStatus(status: string): PropertyStatus | undefined {
  const normalized = status.trim().toLowerCase();
  
  // Map common string variations to enum values
  const statusMap: Record<string, PropertyStatus> = {
    'available': PropertyStatus.Available,
    'reserved': PropertyStatus.Reserved,
    'sold': PropertyStatus.Sold,
    'under construction': PropertyStatus.UnderConstruction,
    'underconstruction': PropertyStatus.UnderConstruction,
    'under_construction': PropertyStatus.UnderConstruction,
    'coming soon': PropertyStatus.ComingSoon,
    'comingsoon': PropertyStatus.ComingSoon,
    'coming_soon': PropertyStatus.ComingSoon,
    'off market': PropertyStatus.OffMarket,
    'offmarket': PropertyStatus.OffMarket,
    'off_market': PropertyStatus.OffMarket,
    'under offer': PropertyStatus.UnderOffer,
    'underoffer': PropertyStatus.UnderOffer,
    'under_offer': PropertyStatus.UnderOffer,
    'sale agreed': PropertyStatus.SaleAgreed,
    'saleagreed': PropertyStatus.SaleAgreed,
    'sale_agreed': PropertyStatus.SaleAgreed,
    'to let': PropertyStatus.ToLet,
    'tolet': PropertyStatus.ToLet,
    'to_let': PropertyStatus.ToLet,
    'selling': PropertyStatus.Selling
  };
  
  return statusMap[normalized];
}

/**
 * Convert string type to PropertyType enum
 * @param type String type value (case-insensitive)
 * @returns PropertyType enum value or undefined if not found
 */
export function stringToPropertyType(type: string): PropertyType | undefined {
  const normalized = type.trim().toLowerCase();
  
  const typeMap: Record<string, PropertyType> = {
    'house': PropertyType.House,
    'apartment': PropertyType.Apartment,
    'duplex': PropertyType.Duplex,
    'townhouse': PropertyType.Townhouse,
    'bungalow': PropertyType.Bungalow,
    'villa': PropertyType.Villa,
    'studio': PropertyType.Studio,
    'penthouse': PropertyType.Penthouse,
    'semi-detached': PropertyType.SemiDetached,
    'semi_detached': PropertyType.SemiDetached,
    'semidetached': PropertyType.SemiDetached,
    'detached': PropertyType.Detached,
    'terrace': PropertyType.Terrace
  };
  
  return typeMap[normalized];
}

/**
 * Get status display color based on PropertyStatus
 * @param status PropertyStatus or string status
 * @returns Tailwind CSS color class
 */
export function getStatusColor(status: PropertyStatus | string): string {
  // Normalize status to string for comparison
  const normalizedStatus = typeof status === 'string' 
    ? status.toLowerCase() 
    : String(status).toLowerCase();
  
  // Map status to color
  switch (normalizedStatus) {
    case PropertyStatus.Available:
      return 'bg-green-100 text-green-800';
    case PropertyStatus.Reserved:
      return 'bg-orange-100 text-orange-800';
    case PropertyStatus.Sold:
      return 'bg-red-100 text-red-800';
    case PropertyStatus.UnderConstruction:
      return 'bg-yellow-100 text-yellow-800';
    case PropertyStatus.ComingSoon:
      return 'bg-blue-100 text-blue-800';
    case PropertyStatus.OffMarket:
      return 'bg-gray-100 text-gray-800';
    case PropertyStatus.UnderOffer:
      return 'bg-purple-100 text-purple-800';
    case PropertyStatus.SaleAgreed:
      return 'bg-indigo-100 text-indigo-800';
    case PropertyStatus.ToLet:
      return 'bg-teal-100 text-teal-800';
    case PropertyStatus.Selling:
      return 'bg-emerald-100 text-emerald-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}