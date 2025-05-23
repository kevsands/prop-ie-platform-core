// src/data/mock-models.ts
import { Property, Development } from '@/types/models';
import { PropertyStatus, PropertyType, DevelopmentStatus } from '@/types/enums';

/**
 * Mock properties with complete data fields
 * Ensures all required properties are included for consistent typing
 */
export const mockProperties: Property[] = [
  {
    id: "FG-1A-01",
    name: "2 Bedroom Apartment - Unit 1A",
    slug: "fitzgerald-gardens-2-bed-apartment-1a",
    title: "2 Bedroom Apartment", // Legacy field
    projectId: "fitzgerald-gardens",
    projectName: "Fitzgerald Gardens",
    projectSlug: "fitzgerald-gardens",
    developmentId: "fitzgerald-gardens",
    developmentName: "Fitzgerald Gardens",
    unitNumber: "1A-01",
    price: 325000,
    status: PropertyStatus.Available,
    type: PropertyType.Apartment,
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 1,
    floorArea: 85,
    area: 85, // Legacy field
    features: [
      "Modern Kitchen with Premium Appliances",
      "Underfloor Heating",
      "High-Efficiency Windows",
      "Balcony with Garden View"
    ],
    amenities: [
      "Secure Parking",
      "Communal Garden",
      "Bicycle Storage"
    ],
    images: [
      "/images/fitzgerald-gardens/2bed-apartment.jpeg",
      "/images/fitzgerald-gardens/Duplex D5.png"
    ],
    image: "/images/fitzgerald-gardens/2bed-apartment.jpeg", // Legacy field
    floorPlan: "/images/fitzgerald-gardens/House Type 1.png",
    floorPlanUrl: "/images/fitzgerald-gardens/House Type 1.png", // Legacy field
    virtualTourUrl: "https://example.com/virtual-tours/fitzgerald-gardens/2bed-apartment",
    description: "Modern 2-bedroom apartment featuring an open plan kitchen and living area with premium finishes throughout.",
    isNew: true,
    statusColor: "bg-green-100 text-green-800",
    createdAt: "2023-08-15T10:30:00Z",
    updatedAt: "2023-10-22T14:45:00Z"
  },
  {
    id: "FG-2B-03",
    name: "3 Bedroom Duplex - Unit 2B",
    slug: "fitzgerald-gardens-3-bed-duplex-2b",
    title: "3 Bedroom Duplex", // Legacy field
    projectId: "fitzgerald-gardens",
    projectName: "Fitzgerald Gardens",
    projectSlug: "fitzgerald-gardens",
    developmentId: "fitzgerald-gardens",
    developmentName: "Fitzgerald Gardens",
    unitNumber: "2B-03",
    price: 425000,
    status: PropertyStatus.Reserved,
    type: PropertyType.Duplex,
    bedrooms: 3,
    bathrooms: 2.5,
    parkingSpaces: 2,
    floorArea: 125,
    area: 125, // Legacy field
    features: [
      "Dual Aspect Living Area",
      "Private Garden",
      "Designer Kitchen",
      "Master Bedroom with En-suite"
    ],
    amenities: [
      "Dedicated Parking Spaces",
      "Storage Unit",
      "EV Charging Point"
    ],
    images: [
      "/images/fitzgerald-gardens/3bed-duplex.jpeg",
      "/images/fitzgerald-gardens/Duplex d6.png"
    ],
    image: "/images/fitzgerald-gardens/3bed-duplex.jpeg", // Legacy field
    floorPlan: "/images/fitzgerald-gardens/Duplex D5.png",
    floorPlanUrl: "/images/fitzgerald-gardens/Duplex D5.png", // Legacy field
    virtualTourUrl: "https://example.com/virtual-tours/fitzgerald-gardens/3bed-duplex",
    description: "Spacious 3-bedroom duplex with modern design, featuring an open plan ground floor and three generous bedrooms upstairs.",
    isNew: false,
    statusColor: "bg-orange-100 text-orange-800",
    createdAt: "2023-08-15T11:15:00Z",
    updatedAt: "2023-11-05T09:30:00Z"
  },
  {
    id: "BMV-H3-05",
    name: "4 Bedroom House - Type A",
    slug: "ballymakenny-view-4-bed-house-type-a",
    title: "4 Bedroom Detached House", // Legacy field
    projectId: "ballymakenny-view",
    projectName: "Ballymakenny View",
    projectSlug: "ballymakenny-view",
    developmentId: "ballymakenny-view",
    developmentName: "Ballymakenny View",
    unitNumber: "H3-05",
    price: 495000,
    status: PropertyStatus.Available,
    type: PropertyType.House,
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 2,
    floorArea: 180,
    area: 180, // Legacy field
    features: [
      "South-Facing Garden",
      "Home Office Space",
      "Double Garage",
      "Solar PV Panels"
    ],
    amenities: [
      "Landscaped Front Garden",
      "Electric Gate",
      "Smart Home System"
    ],
    images: [
      "/images/developments/Ballymakenny-View/HouseType A.jpg",
      "/images/developments/Ballymakenny-View/01-NoPeople.jpg"
    ],
    image: "/images/developments/Ballymakenny-View/HouseType A.jpg", // Legacy field
    floorPlan: "/images/developments/Ballymakenny-View/HouseType A FP1.png",
    floorPlanUrl: "/images/developments/Ballymakenny-View/HouseType A FP1.png", // Legacy field
    virtualTourUrl: "https://example.com/virtual-tours/ballymakenny-view/house-type-a",
    description: "Luxurious 4-bedroom detached house with generous living spaces and premium finishes throughout.",
    isNew: true,
    statusColor: "bg-green-100 text-green-800",
    createdAt: "2023-09-10T14:00:00Z",
    updatedAt: "2023-12-01T16:20:00Z"
  }
];

/**
 * Mock developments with complete data fields
 * Ensures all required properties are included for consistent typing
 */
export const mockDevelopments: Development[] = [
  {
    id: "fitzgerald-gardens",
    name: "Fitzgerald Gardens",
    slug: "fitzgerald-gardens",
    description: "Luxurious living with modern comforts in the heart of Drogheda",
    location: "Drogheda, Co. Louth",
    coordinates: {
      lat: 53.7172,
      lng: -6.3504
    },
    image: "/images/fitzgerald-gardens/hero.jpeg",
    images: [
      "/images/fitzgerald-gardens/hero.jpeg",
      "/images/fitzgerald-gardens/HouseTypes Header.jpeg",
      "/images/fitzgerald-gardens/2bed-apartment.jpeg"
    ],
    status: DevelopmentStatus.SellingFast,
    statusColor: "green-500",
    priceRange: "€320,000 - €450,000",
    availabilityStatus: "Selling Fast",
    bedrooms: [2, 34],
    bathrooms: 2,
    buildingType: "Mixed - Apartments and Houses",
    totalUnits: 45,
    brochureUrl: "/images/brochures/FitzGerald Gardens Brochure.pdf",
    virtualTourUrl: "https://example.com/virtual-tours/fitzgerald-gardens",
    sitePlanUrl: "/images/fitzgerald-gardens/site-plan.jpg",
    developmentFeatures: [
      "Landscaped Communal Areas",
      "Secured Gated Access",
      "Electric Vehicle Charging Points",
      "Fiber Broadband Ready"
    ],
    areaAmenities: [
      "5 minutes to Drogheda Town Centre",
      "Excellent Schools Nearby",
      "Public Transport Links",
      "Shopping Centers"
    ],
    salesAgent: {
      name: "Sarah Johnson",
      agency: "Prop Ireland",
      phone: "+353 41 123 4567",
      email: "sarah@propireland.ie"
    },
    showingDates: [
      "2023-11-25T10:00:00Z",
      "2023-11-26T14:00:00Z",
      "2023-12-02T10:00:00Z"
    ],
    completionDate: "2024-05-30T00:00:00Z",
    startDate: "2023-03-15T00:00:00Z",
    type: PropertyType.Apartment,
    units: [
      {
        id: "FG-1A-01",
        name: "2 Bedroom Apartment - Unit 1A",
        price: 325000,
        status: PropertyStatus.Available,
        type: PropertyType.Apartment,
        bedrooms: 2,
        bathrooms: 1,
        area: 85
      },
      {
        id: "FG-2B-03",
        name: "3 Bedroom Duplex - Unit 2B",
        price: 425000,
        status: PropertyStatus.Reserved,
        type: PropertyType.Duplex,
        bedrooms: 3,
        bathrooms: 2.5,
        area: 125
      }
    ],
    floorPlans: [
      {
        id: "fp-1",
        name: "Type 1 - 2 Bed Apartment",
        image: "/images/fitzgerald-gardens/House Type 1.png",
        unitType: PropertyType.Apartment,
        bedrooms: 2,
        bathrooms: 1,
        area: 85
      },
      {
        id: "fp-2",
        name: "Type 2 - 3 Bed Duplex",
        image: "/images/fitzgerald-gardens/Duplex D5.png",
        unitType: PropertyType.Duplex,
        bedrooms: 3,
        bathrooms: 2.5,
        area: 125
      }
    ],
    createdAt: "2023-01-10T09:00:00Z",
    updatedAt: "2023-11-15T15:30:00Z"
  },
  {
    id: "ballymakenny-view",
    name: "Ballymakenny View",
    slug: "ballymakenny-view",
    description: "Premium family homes with countryside views in a well-connected location",
    location: "Ballymakenny, Drogheda, Co. Louth",
    coordinates: {
      lat: 53.7245,
      lng: -6.3269
    },
    image: "/images/developments/Ballymakenny-View/hero.jpg",
    images: [
      "/images/developments/Ballymakenny-View/hero.jpg",
      "/images/developments/Ballymakenny-View/01-People.jpg",
      "/images/developments/Ballymakenny-View/02-NoPeople.jpg"
    ],
    status: DevelopmentStatus.LaunchingSoon,
    statusColor: "blue-500",
    priceRange: "€380,000 - €550,000",
    availabilityStatus: "Launching Soon",
    bedrooms: [3, 45],
    bathrooms: 3,
    buildingType: "Detached and Semi-Detached Houses",
    totalUnits: 32,
    brochureUrl: "/images/brochures/Ballymakenny View Brochure.pdf",
    virtualTourUrl: "https://example.com/virtual-tours/ballymakenny-view",
    sitePlanUrl: "/images/developments/Ballymakenny-View/BMV Site Plan.png",
    developmentFeatures: [
      "A-Rated Energy Efficiency",
      "Air Source Heat Pumps",
      "Solar PV Panels",
      "Smart Home Ready"
    ],
    areaAmenities: [
      "10 minutes to M1 Motorway",
      "Local Primary and Secondary Schools",
      "Parks and Recreation Areas",
      "Retail Park Nearby"
    ],
    salesAgent: {
      name: "Michael O'Connor",
      agency: "Prop Ireland",
      phone: "+353 41 123 4568",
      email: "michael@propireland.ie"
    },
    showingDates: [
      "2023-12-09T10:00:00Z",
      "2023-12-10T14:00:00Z",
      "2023-12-16T10:00:00Z"
    ],
    completionDate: "2024-09-30T00:00:00Z",
    startDate: "2023-06-01T00:00:00Z",
    type: PropertyType.House,
    units: [
      {
        id: "BMV-H3-05",
        name: "4 Bedroom House - Type A",
        price: 495000,
        status: PropertyStatus.Available,
        type: PropertyType.House,
        bedrooms: 4,
        bathrooms: 3,
        area: 180
      },
      {
        id: "BMV-H2-08",
        name: "3 Bedroom House - Type B",
        price: 420000,
        status: PropertyStatus.ComingSoon,
        type: PropertyType.House,
        bedrooms: 3,
        bathrooms: 2.5,
        area: 145
      }
    ],
    floorPlans: [
      {
        id: "bmv-fp-1",
        name: "Type A - 4 Bed Detached",
        image: "/images/developments/Ballymakenny-View/HouseType A FP1.png",
        unitType: PropertyType.Detached,
        bedrooms: 4,
        bathrooms: 3,
        area: 180
      },
      {
        id: "bmv-fp-2",
        name: "Type B - 3 Bed Semi-Detached",
        image: "/images/developments/Ballymakenny-View/HouseTypeB FP1.html",
        unitType: PropertyType.SemiDetached,
        bedrooms: 3,
        bathrooms: 2.5,
        area: 145
      }
    ],
    createdAt: "2023-04-20T11:30:00Z",
    updatedAt: "2023-11-28T14:15:00Z"
  }
];

/**
 * Helper function to safely access property fields, providing default values for missing fields
 * @param property Property object, potentially with missing fields
 * @returns Modified property with default values for missing fields
 */
export function ensureCompleteProperty(property: Partial<Property>): Property {
  return {
    id: property.id || 'unknown-id',
    name: property.name || 'Untitled Property',
    slug: property.slug || `property-${property.id || 'unknown'}`,
    title: property.title || property.name || 'Untitled Property',
    projectId: property.projectId || 'unknown-project',
    projectName: property.projectName || 'Unknown Project',
    projectSlug: property.projectSlug || 'unknown-project',
    developmentId: property.developmentId || property.projectId || 'unknown-development',
    developmentName: property.developmentName || property.projectName || 'Unknown Development',
    unitNumber: property.unitNumber || 'N/A',
    price: property.price || 0,
    status: property.status || PropertyStatus.OffMarket,
    type: property.type || PropertyType.House,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    parkingSpaces: property.parkingSpaces || 0,
    floorArea: property.floorArea || property.area || 0,
    area: property.area || property.floorArea || 0,
    features: property.features || [],
    amenities: property.amenities || [],
    images: property.images || (property.image ? [property.image] : []),
    image: property.image || (property.images && property.images.length> 0 ? property.images[0] : ''),
    floorPlan: property.floorPlan || property.floorPlanUrl || '',
    floorPlanUrl: property.floorPlanUrl || property.floorPlan || '',
    virtualTourUrl: property.virtualTourUrl || '',
    description: property.description || 'No description provided',
    isNew: property.isNew || false,
    isReduced: property.isReduced || false,
    statusColor: property.statusColor || 'bg-gray-100 text-gray-800',
    createdAt: property.createdAt || new Date().toISOString(),
    updatedAt: property.updatedAt || new Date().toISOString()};
}