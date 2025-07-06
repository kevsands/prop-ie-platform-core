// src/services/data-service/mock.ts

import { DataService } from './index'; // Import the interface
import { Development } from '../../types/developments'; // Import Development type
import { Property, PropertyFilters } from '../../types/properties'; // Import Property and Filters types
import { PropertyStatus, PropertyType } from '../../types/enums'; // Import enums

// --- Mock Data Arrays ---

// Define mock development data matching the Development type
const mockDevelopmentsData: Development[] = [
  {
    id: 'fitzgerald-gardens',
    name: 'Fitzgerald Gardens',
    description: 'Luxury homes in a prime Drogheda location',
    location: 'North Drogheda',
    image: '/images/developments/fitzgerald-gardens/hero.jpg',
    // slug property is removed as it's not in the Development type
    status: 'Selling Fast',
    statusColor: 'green',
    priceRange: 'From €385,000',
    availabilityStatus: 'Limited Availability',
    bedrooms: [3, 4],
    bathrooms: 3, // Fixed from array type to single number
    buildingType: 'House',
    totalUnits: 50,
    brochureUrl: '/brochures/fitzgerald-gardens-brochure.pdf',
    virtualTourUrl: 'https://my.matterport.com/show/?m=xxxxxxxxx',
    developmentFeatures: ['Communal Green Spaces', 'Private Gardens', 'High-speed Fibre'],
    areaAmenities: ['Schools', 'Shops', 'Transport Links'],
    salesAgent: { name: 'Sarah Johnson', agency: 'Prop.ie Sales' },
    showingDates: ['Saturday, May 4th, 10am - 1pm', 'Sunday, May 5th, 2pm - 4pm'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-04-28T12:00:00Z',
  },
  {
    id: 'riverside-manor',
    name: 'Riverside Manor',
    description: 'Waterfront apartments with stunning views of the Boyne',
    location: 'South Drogheda',
    image: '/images/developments/riverside-manor/hero.jpg',
    // slug property is removed as it's not in the Development type
    status: 'New Release',
    statusColor: 'blue',
    priceRange: 'From €295,000',
    availabilityStatus: 'Launching Soon',
    bedrooms: [1, 2, 3],
    bathrooms: 2, // Fixed from array type to single number
    buildingType: 'Apartment',
    totalUnits: 80,
    brochureUrl: '/brochures/riverside-manor-brochure.pdf',
    virtualTourUrl: 'https://my.matterport.com/show/?m=yyyyyyyyyy',
    developmentFeatures: ['Secure Parking', 'Lifts', 'Communal Roof Garden'],
    areaAmenities: ['Riverside Walks', 'Restaurants', 'Town Centre'],
    salesAgent: { name: 'John Murphy', agency: 'Town & Country Estates' },
    showingDates: ['Saturday, May 11th, 11am - 2pm'],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2025-04-20T10:00:00Z',
  },
  {
    id: 'meadow-heights',
    name: 'Meadow Heights',
    description: 'Spacious family houses near amenities and green spaces',
    location: 'West Drogheda',
    image: '/images/developments/meadow-heights/hero.jpg',
    // slug property is removed as it's not in the Development type
    status: 'Launching Soon',
    statusColor: 'yellow',
    priceRange: 'From €350,000',
    availabilityStatus: 'Future Phase',
    bedrooms: [3, 4],
    bathrooms: 3,
    buildingType: 'House',
    totalUnits: 60,
    brochureUrl: '', // Empty string instead of null
    virtualTourUrl: '', // Empty string instead of null
    developmentFeatures: ['Large Green Areas', 'Playgrounds', 'Creche On-site'],
    areaAmenities: ['Primary School', 'Shopping Centre', 'Sports Clubs'],
    salesAgent: { name: '', agency: '' }, // Empty object instead of null
    showingDates: [],
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z',
  },
  {
    id: 'harbour-view',
    name: 'Harbour View',
    description: 'Modern townhouses close to the coast and harbour',
    location: 'East Drogheda',
    image: '/images/developments/harbour-view/hero.jpg',
    // slug property is removed as it's not in the Development type
    status: 'Completed',
    statusColor: 'gray',
    priceRange: 'Fully Sold',
    availabilityStatus: 'Fully Booked',
    bedrooms: [3, 4],
    bathrooms: 3, // Fixed from array type to single number
    buildingType: 'Townhouse',
    totalUnits: 30,
    brochureUrl: '', // Empty string instead of null
    virtualTourUrl: 'https://my.matterport.com/show/?m=zzzzzzzz',
    developmentFeatures: ['Coastal Access', 'Modern Design'],
    areaAmenities: ['Harbour Activities', 'Coastal Walks', 'Seafood Restaurants'],
    salesAgent: { name: 'Lisa Kelly', agency: 'Coastal Properties' },
    showingDates: [],
    createdAt: '2023-01-20T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
  },
  { // More developments for comprehensiveness
    id: 'bridgefield-park',
    name: 'Bridgefield Park',
    description: 'New family homes with excellent connectivity near the train station',
    location: 'South Drogheda',
    image: '/images/developments/placeholder-dev-2.jpg',
    // slug property is removed as it's not in the Development type
    status: 'Future',
    statusColor: 'purple',
    priceRange: 'Price TBC',
    availabilityStatus: 'Future Phase',
    bedrooms: [3, 4],
    bathrooms: 3,
    buildingType: 'House',
    totalUnits: 40,
    brochureUrl: '', // Empty string instead of null
    virtualTourUrl: '', // Empty string instead of null
    developmentFeatures: ['Close to Train Station', 'Modern Design'],
    areaAmenities: ['Train Station', 'Bus Routes', 'Local Shops'],
    salesAgent: { name: '', agency: '' }, // Empty object instead of null
    showingDates: [],
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
];

// Define mock property data matching the Property type
const mockPropertiesData: Property[] = [
  {
    id: 'prop-fg-101',
    name: 'Type A - 3 Bed Semi-Detached',
    slug: 'type-a-3-bed-semi-detached',
    projectId: 'fitzgerald-gardens',
    projectName: 'Fitzgerald Gardens',
    projectSlug: 'fitzgerald-gardens',
    developmentId: 'fitzgerald-gardens', // Added required field
    developmentName: 'Fitzgerald Gardens', // Added required field
    address: { 
      city: 'Drogheda',
      country: 'Ireland'
    },
    unitNumber: '101',
    price: 385000,
    status: PropertyStatus.Available,
    type: PropertyType.House,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    floorArea: 110, // sq meters
    features: ['Fitted Kitchen', 'Built-in Wardrobes', 'A2 BER'],
    amenities: ['Private Garden'],
    images: ['/images/properties/fg101_1.jpg', '/images/properties/fg101_2.jpg'],
    floorPlan: '/images/floorplans/fg101.jpg',
    description: 'Beautiful 3-bedroom semi-detached home in a prime location.',
    isNew: true,
    createdAt: '2025-04-25T10:00:00Z',
    updatedAt: '2025-04-25T10:00:00Z',
  },
  {
    id: 'prop-fg-105',
    name: 'Type B - 4 Bed Detached',
    slug: 'type-b-4-bed-detached',
    projectId: 'fitzgerald-gardens',
    projectName: 'Fitzgerald Gardens',
    projectSlug: 'fitzgerald-gardens',
    developmentId: 'fitzgerald-gardens',
    developmentName: 'Fitzgerald Gardens',
    address: {
      city: 'Drogheda',
      country: 'Ireland'
    },
    unitNumber: '105',
    price: 450000,
    status: PropertyStatus.Available,
    type: PropertyType.House,
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 2,
    floorArea: 140, // sq meters
    features: ['Spacious Living', 'Utility Room', 'Master Ensuite'],
    amenities: ['Large Private Garden'],
    images: ['/images/properties/fg105_1.jpg', '/images/properties/fg105_2.jpg'],
    floorPlan: '/images/floorplans/fg105.jpg',
    description: 'Spacious 4-bedroom detached home perfect for growing families.', // Added required field
    isNew: true,
    createdAt: '2025-04-20T10:00:00Z',
    updatedAt: '2025-04-20T10:00:00Z',
  },
  {
    id: 'prop-rm-203',
    name: 'Unit 203 - 2 Bed Apartment',
    slug: 'unit-203-2-bed-apartment',
    projectId: 'riverside-manor',
    projectName: 'Riverside Manor',
    projectSlug: 'riverside-manor',
    developmentId: 'riverside-manor',
    developmentName: 'Riverside Manor',
    address: {
      city: 'Drogheda',
      country: 'Ireland'
    },
    unitNumber: '203',
    price: 295000,
    status: PropertyStatus.Reserved, // Changed from "under_offer" to PropertyStatus.Reserved to match PropertyStatus type
    type: PropertyType.Apartment,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    floorArea: 85, // sq meters
    features: ['River View', 'Modern Appliances', 'Secure Access'],
    amenities: ['Private Balcony'],
    images: ['/images/properties/rm203_1.jpg'],
    floorPlan: '/images/floorplans/rm203.jpg',
    description: 'Stylish 2-bedroom apartment with river views.', // Added required field
    isReduced: true,
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-04-10T10:00:00Z',
  },
  {
    id: 'prop-mh-301',
    name: 'Plot 1A - 3 Bed Terrace',
    slug: 'plot-1a-3-bed-terrace',
    projectId: 'meadow-heights',
    projectName: 'Meadow Heights',
    projectSlug: 'meadow-heights',
    developmentId: 'meadow-heights',
    developmentName: 'Meadow Heights',
    address: {
      city: 'Drogheda',
      country: 'Ireland'
    },
    unitNumber: 'Plot 1A',
    price: 350000,
    status: PropertyStatus.Reserved,
    type: PropertyType.House,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    floorArea: 100, // sq meters
    features: ['Large Kitchen/Dining', 'Efficient Heating'],
    amenities: ['Good School Catchment'],
    images: ['/images/properties/mh301_1.jpg'],
    floorPlan: '/images/floorplans/mh301.jpg',
    description: 'Attractive 3-bedroom terraced house in a family-friendly location.', // Added required field
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-05T10:00:00Z',
  },
  { // More properties for comprehensiveness
    id: 'prop-fg-110',
    name: 'Type A - 3 Bed Semi-Detached',
    slug: 'type-a-3-bed-semi-detached-110',
    projectId: 'fitzgerald-gardens',
    projectName: 'Fitzgerald Gardens',
    projectSlug: 'fitzgerald-gardens',
    developmentId: 'fitzgerald-gardens',
    developmentName: 'Fitzgerald Gardens',
    address: {
      city: 'Drogheda',
      country: 'Ireland'
    },
    unitNumber: '110',
    price: 380000,
    status: PropertyStatus.Reserved, // Changed from PropertyStatus.UnderOffer to match PropertyStatus type
    type: PropertyType.House,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    floorArea: 110, // sq meters
    features: ['Fitted Kitchen', 'Built-in Wardrobes'],
    amenities: ['Private Garden'],
    images: ['/images/properties/fg101_1.jpg'], // Using same image for mock
    floorPlan: '/images/floorplans/fg101.jpg', // Using same floorplan for mock
    description: 'Well-appointed 3-bedroom semi-detached house in a popular development.', // Added required field
    isReduced: true,
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-04-28T10:00:00Z',
  },
  {
    id: 'prop-rm-208',
    name: 'Unit 208 - 2 Bed Apartment',
    slug: 'unit-208-2-bed-apartment',
    projectId: 'riverside-manor',
    projectName: 'Riverside Manor',
    projectSlug: 'riverside-manor',
    developmentId: 'riverside-manor',
    developmentName: 'Riverside Manor',
    address: {
      city: 'Drogheda',
      country: 'Ireland'
    },
    unitNumber: '208',
    price: 300000,
    status: PropertyStatus.Available,
    type: PropertyType.Apartment,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    floorArea: 85, // sq meters
    features: ['River View', 'Modern Appliances'],
    amenities: ['Private Balcony'],
    images: ['/images/properties/rm203_1.jpg'], // Using same image for mock
    floorPlan: '/images/floorplans/rm203.jpg', // Using same floorplan for mock
    description: 'Contemporary 2-bedroom apartment with excellent amenities.', // Added required field
    isNew: true,
    createdAt: '2025-04-28T10:00:00Z',
    updatedAt: '2025-04-28T10:00:00Z',
  },
  {
    id: 'prop-mh-305',
    name: 'Plot 1B - 3 Bed Semi-Detached',
    slug: 'plot-1b-3-bed-semi-detached',
    projectId: 'meadow-heights',
    projectName: 'Meadow Heights',
    projectSlug: 'meadow-heights',
    developmentId: 'meadow-heights',
    developmentName: 'Meadow Heights',
    address: {
      city: 'Drogheda',
      country: 'Ireland'
    },
    unitNumber: 'Plot 1B',
    price: 365000,
    status: PropertyStatus.Available,
    type: PropertyType.House,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    floorArea: 105, // sq meters
    features: ['Large Kitchen/Dining'],
    amenities: ['Good School Catchment'],
    images: ['/images/properties/mh301_1.jpg'], // Using same image for mock
    floorPlan: '/images/floorplans/mh301.jpg', // Using same floorplan for mock
    description: 'Lovely 3-bedroom semi-detached home in a desirable location.', // Added required field
    createdAt: '2025-04-20T10:00:00Z',
    updatedAt: '2025-04-20T10:00:00Z',
  },
  {
    id: 'prop-hv-401',
    name: 'Unit 1 - 4 Bed Townhouse',
    slug: 'unit-1-4-bed-townhouse',
    projectId: 'harbour-view',
    projectName: 'Harbour View',
    projectSlug: 'harbour-view',
    developmentId: 'harbour-view',
    developmentName: 'Harbour View',
    address: {
      city: 'Drogheda',
      country: 'Ireland'
    },
    unitNumber: '1',
    price: 410000,
    status: PropertyStatus.Sold,
    type: PropertyType.House, // Changed from "townhouse" to a valid PropertyType
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 1,
    floorArea: 125, // sq meters
    features: ['Coastal Views', 'Roof Terrace'],
    amenities: ['Walk to Coast'],
    images: ['/images/properties/hv401.jpg'],
    floorPlan: '/images/floorplans/hv401.jpg',
    description: 'Stunning 4-bedroom townhouse with coastal views.', // Added required field
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-06-01T10:00:00Z', // Sold date could be update date
  },
  {
    id: 'prop-fg-115',
    name: 'Type B - 4 Bed Detached',
    slug: 'type-b-4-bed-detached-115',
    projectId: 'fitzgerald-gardens',
    projectName: 'Fitzgerald Gardens',
    projectSlug: 'fitzgerald-gardens',
    developmentId: 'fitzgerald-gardens',
    developmentName: 'Fitzgerald Gardens',
    address: {
      city: 'Drogheda',
      country: 'Ireland'
    },
    unitNumber: '115',
    price: 445000,
    status: PropertyStatus.Available,
    type: PropertyType.House,
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 2,
    floorArea: 140, // sq meters
    features: ['Spacious Living', 'Utility Room'],
    amenities: ['Large Private Garden'],
    images: ['/images/properties/fg105_1.jpg'], // Using same image for mock
    floorPlan: '/images/floorplans/fg105.jpg', // Using same floorplan for mock
    description: 'Executive 4-bedroom detached home with spacious accommodation.', // Added required field
    createdAt: '2025-04-28T10:00:00Z',
    updatedAt: '2025-04-28T10:00:00Z',
  },
  { // Property for a 'Future' development
    id: 'prop-bp-101',
    name: 'Type C - 3 Bed Semi-Detached',
    slug: 'type-c-3-bed-semi-detached',
    projectId: 'bridgefield-park',
    projectName: 'Bridgefield Park',
    projectSlug: 'bridgefield-park',
    developmentId: 'bridgefield-park',
    developmentName: 'Bridgefield Park',
    address: {
      city: 'Drogheda',
      country: 'Ireland'
    },
    unitNumber: 'Plot 1',
    price: 340000,
    status: PropertyStatus.Available, // Can be PropertyStatus.Available even if development is 'Future' if pre-selling
    type: PropertyType.House,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    floorArea: 105, // sq meters
    features: ['Modern Kitchen', 'Close to Transport'],
    amenities: ['Communal Area'],
    images: ['/images/properties/placeholder-prop-1.jpg'],
    floorPlan: '/images/floorplans/placeholder-floorplan-1.jpg',
    description: 'Well-designed 3-bedroom semi-detached house near transport links.', // Added required field
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-01T10:00:00Z',
  },
];

// Extended filter interface for mock implementation without directly extending PropertyFilters
// to avoid type conflicts with status and propertyType
interface ExtendedPropertyFilter {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  projectId?: string;
  developmentId?: string;
  // Using different field names to avoid conflicts
  statusList?: PropertyStatus[]; // Array of statuses
  typeList?: PropertyType[]; // Array of types
  // Single values (from PropertyFilters)
  propertyType?: PropertyType;
  status?: PropertyStatus;
}

// Helper function to simulate API delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock implementation of the DataService interface.
 * Provides mock data for development purposes.
 *
 * @implements {DataService}
 */
export class MockDataService implements DataService {

  /**
   * Gets all mock developments.
   * @returns {Promise<Development[]>} A promise resolving with an array of developments.
   */
  async getDevelopments(): Promise<Development[]> {
    await delay(300); // Simulate network delay
    return [...mockDevelopmentsData]; // Return a copy to prevent external modification
  }

  /**
   * Gets a single mock development by its ID.
   * @param {string} id - The ID of the development.
   * @returns {Promise<Development | null>} A promise resolving with the development or null if not found.
   */
  async getDevelopmentById(id: string): Promise<Development | null> {
    await delay(200); // Simulate network delay
    const development = mockDevelopmentsData.find(dev => dev.id === id);
    return development ? { ...development } : null; // Return a copy
  }

  /**
   * Gets a limited number of featured mock developments.
   * @param {number} [limit=4] - The maximum number of developments to return.
   * @returns {Promise<Development[]>} A promise resolving with an array of featured developments.
   */
  async getFeaturedDevelopments(limit = 4): Promise<Development[]> {
    await delay(300); // Simulate network delay
    // Simple implementation: return the first 'limit' developments
    return [...mockDevelopmentsData].slice(0, limit); // Return a copy
  }

  /**
   * Gets mock properties, optionally applying filters.
   * @param {PropertyFilters} [filters] - Optional filters to apply.
   * @returns {Promise<Property[]>} A promise resolving with an array of properties.
   */
  async getProperties(filters?: PropertyFilters): Promise<Property[]> {
    await delay(400); // Simulate network delay

    let filteredProperties = [...mockPropertiesData]; // Start with all properties (copy)

    // Apply filters if provided
    if (filters) {
      // Cast the filters to our extended interface
      const extendedFilters = filters as ExtendedPropertyFilter;
      
      // Filter by Location (based on linked development's location)
      if (filters.location) {
        // Find developments matching the location filter
        const matchingDevelopmentIds = mockDevelopmentsData
          .filter(dev => dev.location.toLowerCase().includes(filters.location!.toLowerCase()))
          .map(dev => dev.id);

        // Filter properties belonging to those developments
        filteredProperties = filteredProperties.filter(prop =>
          matchingDevelopmentIds.includes(prop.projectId)
        );
      }

      // Filter by bedrooms
      if (filters.bedrooms !== undefined) {
        filteredProperties = filteredProperties.filter(
          prop => prop.bedrooms === filters.bedrooms
        );
      }

      // Filter by minimum price
      if (filters.minPrice !== undefined) {
        filteredProperties = filteredProperties.filter(
          prop => prop.price >= filters.minPrice!
        );
      }

      // Filter by maximum price
      if (filters.maxPrice !== undefined) {
        filteredProperties = filteredProperties.filter(
          prop => prop.price <= filters.maxPrice!
        );
      }

      // Filter by property status
      if (filters.status) {
        filteredProperties = filteredProperties.filter(
          prop => prop.status === filters.status
        );
      }

      // Filter by property type
      if (filters.propertyType) {
        filteredProperties = filteredProperties.filter(
          prop => prop.type === filters.propertyType
        );
      }

      // Filter by parent development ID
      if (filters.developmentId) {
        filteredProperties = filteredProperties.filter(
          prop => prop.developmentId === filters.developmentId
        );
      }

      // Support for extended filters if present
      if (extendedFilters.typeList && extendedFilters.typeList.length > 0) {
        filteredProperties = filteredProperties.filter(
          prop => extendedFilters.typeList!.includes(prop.type)
        );
      }

      if (extendedFilters.statusList && extendedFilters.statusList.length > 0) {
        filteredProperties = filteredProperties.filter(
          prop => extendedFilters.statusList!.includes(prop.status)
        );
      }

      if (extendedFilters.projectId) {
        filteredProperties = filteredProperties.filter(
          prop => prop.projectId === extendedFilters.projectId
        );
      }

      // Add other filtering logic as needed (e.g., features, amenities)
    }

    return filteredProperties;
  }

  /**
   * Gets a single mock property by its ID.
   * @param {string} id - The ID of the property.
   * @returns {Promise<Property | null>} A promise resolving with the property or null if not found.
   */
  async getPropertyById(id: string): Promise<Property | null> {
    await delay(200); // Simulate network delay
    const property = mockPropertiesData.find(prop => prop.id === id);
    return property ? { ...property } : null; // Return a copy
  }

  /**
   * Gets a limited number of featured mock properties.
   * @param {number} [limit=6] - The maximum number of properties to return.
   * @returns {Promise<Property[]>} A promise resolving with an array of featured properties.
   */
  async getFeaturedProperties(limit = 6): Promise<Property[]> {
    await delay(300); // Simulate network delay
    // Simple implementation: return the first 'limit' properties that are available or reserved
    const availableProperties = mockPropertiesData.filter(prop => 
      [PropertyStatus.Available, PropertyStatus.Reserved].includes(prop.status)
    );
    return [...availableProperties].slice(0, limit); // Return a copy
  }

  /**
   * Gets mock properties belonging to a specific development.
   * @param {string} developmentId - The ID of the parent development.
   * @returns {Promise<Property[]>} A promise resolving with an array of properties in the development.
   */
  async getPropertiesByDevelopment(developmentId: string): Promise<Property[]> {
    await delay(300); // Simulate network delay
    const developmentProperties = mockPropertiesData.filter(prop => prop.projectId === developmentId);
    return [...developmentProperties]; // Return a copy
  }

  // Implement other DataService methods here...
}