// src/types/developments.d.ts

export interface Development {
    id: string;
    name: string;
    description: string;
    location: string; // e.g., 'North Drogheda', 'South Drogheda'
    image: string; // Path to hero image in public folder
    slug: string; // URL friendly identifier
  
    // Status information
    status?: 'Selling Fast' | 'New Release' | 'Launching Soon' | 'Completed' | 'Future' | 'Paused';
    statusColor?: 'green' | 'blue' | 'yellow' | 'gray' | 'purple' | 'red'; // Base color name for Tailwind mapping
  
    // Pricing and availability
    priceRange?: string; // e.g., 'From €350,000', '€295,000 - €450,000', 'Price TBC'
    availabilityStatus?: 'Available Now' | 'Limited Availability' | 'Launching Soon' | 'Fully Booked' | 'Future Phase'; // More detailed availability
  
    // Key specs summary (can be ranges if multiple property types)
    bedrooms?: number | number[]; // e.g., 3 or [2, 4] for a development with 2, 3, and 4 beds
    bathrooms?: number | number[];
    buildingType?: string | string[]; // e.g., 'House', 'Apartment', 'Townhouse', or ['House', 'Apartment']
    totalUnits?: number; // Total number of properties in the development
  
    // Links/Resources
    brochureUrl?: string; // Path to PDF brochure in public folder
    virtualTourUrl?: string; // External URL for a development overview virtual tour
    websiteUrl?: string; // External website for the development
  
    // Detailed Features/Amenities
    developmentFeatures?: string[]; // Features of the overall development (e.g., communal gardens, parking)
    areaAmenities?: string[]; // Amenities in the surrounding area (e.g., schools, shops, transport)
    specifications?: { // Example: detailed build specs
      structure?: string;
      exteriorFinish?: string;
      windowsAndDoors?: string;
      heatingSystem?: string;
      energyRatingDetails?: string; // e.g., specific BER features
    }
  
    // Sales/Contact Info (could also be a separate SalesTeam type)
    salesAgent?: {
        name: string;
        phone?: string;
        email?: string;
        image?: string; // Path to agent photo
        agency?: string; // Associated agency name
    };
     showingDates?: string[]; // Array of upcoming open house/viewing date strings
  
     // Timestamps
     createdAt: string;
     updatedAt: string;
  }