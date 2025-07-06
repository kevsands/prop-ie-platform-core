/**
 * PropIE Core Data Model - Location
 * Defines location-related interfaces for physical places
 */

/**
 * Main Location interface
 * Represents the geographical information for developments and properties
 */
export interface Location {
  address: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  county: string;
  eircode: string;
  country?: string;
  coordinates: Coordinates;
  siteArea?: number; // in square meters
  planningReference?: string;
  areaDescription?: string;
  zoning?: string;
  neighborhood?: string;
  localAuthorityArea?: string;
}

/**
 * Coordinates interface
 * GPS coordinates for mapping
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * NearbyPlace interface
 * Points of interest near a development
 */
export interface NearbyPlace {
  name: string;
  type: NearbyPlaceType;
  distance: number; // in kilometers
  travelTime?: number; // in minutes
  description?: string;
  coordinates?: Coordinates;
}

/**
 * NearbyPlaceType enum
 * Categories of nearby places
 */
export enum NearbyPlaceType {
  SCHOOL = 'school',
  HOSPITAL = 'hospital',
  SHOPPING = 'shopping',
  PARK = 'park',
  RESTAURANT = 'restaurant',
  PUBLIC_TRANSPORT = 'public_transport',
  ENTERTAINMENT = 'entertainment',
  SPORTS = 'sports',
  CHILDCARE = 'childcare',
  COLLEGE = 'college',
  SUPERMARKET = 'supermarket',
  WORKPLACE = 'workplace',
  OTHER = 'other'
}

/**
 * Area statistics
 * Demographic and other statistics about an area
 */
export interface AreaStatistics {
  populationDensity?: number; // people per km²
  averageIncome?: number;
  averageHousePrice?: number;
  schoolRatings?: number; // typically on a scale of 1-10
  crimeRate?: number;
  employmentRate?: number;
  walkScore?: number; // typically on a scale of 0-100
  transitScore?: number;
}

/**
 * Helper to format full address as a string
 */
export function formatAddress(location: Location): string {
  const parts = [
    location.addressLine1 || location.address,
    location.addressLine2,
    location.city,
    location.county,
    location.eircode
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Helper to calculate distance between two coordinates (in km)
 * Uses the Haversine formula
 */
export function calculateDistance(
  coord1: Coordinates, 
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(coord1.latitude)) * Math.cos(toRad(coord2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function for calculateDistance
function toRad(value: number): number {
  return value * Math.PI / 180;
}