// src/types/properties.d.ts

export interface Property {
    id: string;
    name: string; // e.g., '3 Bed Semi-Detached', 'Apartment 203'
    slug: string; // URL friendly identifier
  
    projectId: string; // Link back to the parent development
    projectName: string; // Development name (for easy access)
    projectSlug: string; // Development slug (for linking)
  
    address: string; // Full address
    unitNumber?: string; // Specific unit number if applicable
  
    price: number;
    status: 'available' | 'under offer' | 'sale agreed' | 'sold' | 'reserved' | 'to let'; // Property-specific status
    type: 'house' | 'apartment' | 'townhouse' | 'duplex'; // Property type
  
    bedrooms: number;
    bathrooms: number;
    parkingSpaces?: number;
    floorArea: number; // Floor area in square meters or feet
  
    features?: string[]; // Specific features of this unit (e.g., 'South Facing Garden', 'Integrated Appliances')
    amenities?: string[]; // Amenities specific to this unit (e.g., 'Private Balcony')
  
    images: string[]; // Array of paths to images in public folder
    floorPlan?: string; // Path to floor plan image in public folder
    virtualTourUrl?: string; // External URL for this specific unit's virtual tour
  
    // Optional flags for display (e.g., on listings)
    isNew?: boolean; // Recently listed
    isReduced?: boolean; // Price reduction
  
    // Timestamps
    createdAt: string;
    updatedAt: string;
  }
  
  
  /**
   * Interface for filters applied when getting a list of properties.
   */
  export interface PropertyFilters {
      location?: string; // Filter by development location or general area
      minBedrooms?: number;
      maxBedrooms?: number;
      minPrice?: number;
      maxPrice?: number;
      status?: Property['status']; // Filter by property status
      type?: Property['type']; // Filter by property type
      projectId?: string; // Filter by parent development
      // Add other filter types as needed
  }