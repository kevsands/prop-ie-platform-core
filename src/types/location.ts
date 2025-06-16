/**
 * Location and address related types
 */

/**
 * Geocoordinates interface
 */
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Address interface representing a physical address
 */
export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  state?: string;  // Used for international addresses
  postalCode: string;
  country: string;
  coordinates?: GeoCoordinates;
  formattedAddress?: string;
}

/**
 * Location interface that combines address and geographic information
 */
export interface Location {
  address: Address;
  coordinates: GeoCoordinates;
  eircode?: string;  // Irish postal code
  description?: string;
  placeId?: string;  // For integration with mapping services
  timezone?: string;
}

/**
 * Nearby amenity or point of interest
 */
export interface NearbyPlace {
  name: string;
  type: NearbyPlaceType;
  distance: number; // in kilometers
  travelTime?: number; // in minutes
  coordinates?: GeoCoordinates;
  address?: Partial<Address>
  );
}

/**
 * Types of nearby places/amenities
 */
export enum NearbyPlaceType {
  SCHOOL = 'school',
  HOSPITAL = 'hospital',
  PARK = 'park',
  SHOPPING = 'shopping',
  RESTAURANT = 'restaurant',
  PUBLIC_TRANSPORT = 'public_transport',
  GROCERY = 'grocery',
  GYM = 'gym',
  PHARMACY = 'pharmacy',
  BANK = 'bank',
  ENTERTAINMENT = 'entertainment'
}

/**
 * Travel information between locations
 */
export interface TravelInfo {
  origin: GeoCoordinates | string;
  destination: GeoCoordinates | string;
  mode: TravelMode;
  distance: number; // in kilometers
  duration: number; // in minutes
  route?: GeoCoordinates[]; // For visualizing the route
}

/**
 * Travel modes for directions
 */
export enum TravelMode {
  DRIVING = 'driving',
  WALKING = 'walking',
  BICYCLING = 'bicycling',
  TRANSIT = 'transit'
}