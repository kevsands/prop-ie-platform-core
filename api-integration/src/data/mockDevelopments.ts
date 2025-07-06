// src/data/mockDevelopments.ts
import { Development } from '@/types/developments'; // Fixed import path

export const mockDevelopments: Development[] = [
  {
    id: "fitzgerald-gardens",
    name: "Fitzgerald Gardens",
    description: "Luxurious living with modern comforts in the heart of Drogheda",
    location: "Drogheda, Co. Louth",
    image: "/images/developments/fitzgerald-gardens/hero.jpeg",
    status: "Now Selling",
    statusColor: "green-500",
    priceRange: "€320,000 - €450,000",
    bedrooms: [2, 3, 4],
    bathrooms: 2,
    squareFeet: 120, // Added square feet
    features: [
      "Modern Kitchen with Premium Appliances",
      "Underfloor Heating",
      "Triple Glazed Windows",
      "High Energy Efficiency",
      "Smart Home Technology",
      "Private Parking",
      "Landscaped Gardens",
      "Secure Entry System"
    ],
    amenities: [
      "Community Green Space",
      "Children's Playground",
      "Walking Trails",
      "Bicycle Storage",
      "Electric Vehicle Charging",
      "Visitor Parking"
    ],
    energyRating: "A2",
    availability: "Move in from Winter 2025",
    depositAmount: "€10,000", // Added deposit amount
    showingDates: [
      "Saturday, May 3rd: 10am - 4pm",
      "Sunday, May 4th: 12pm - 5pm",
      "Saturday, May 10th: 10am - 4pm"
    ],
    floorPlans: [ // Added floor plans
      {
        id: "fg-type-a",
        name: "Type A - 2 Bedroom",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 85,
        image: "/images/fitzgerald-gardens/floorplans/type-a.jpg"
      },
      {
        id: "fg-type-b",
        name: "Type B - 3 Bedroom",
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 110,
        image: "/images/fitzgerald-gardens/floorplans/type-b.jpg"
      },
      {
        id: "fg-type-c",
        name: "Type C - 4 Bedroom",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 145,
        image: "/images/fitzgerald-gardens/floorplans/type-c.jpg"
      }
    ],
    virtualTourUrl: "https://example.com/virtual-tour/fitzgerald-gardens"
  },
  {
    id: "ballymakenny-view",
    name: "Ballymakenny View",
    description: "Modern family homes in a convenient location with excellent amenities",
    location: "Ballymakenny, Drogheda",
    image: "/images/developments/Ballymakenny-View/hero.jpg",
    status: "Coming Soon",
    statusColor: "blue-500",
    priceRange: "€350,000 - €425,000",
    bedrooms: [3, 4],
    bathrooms: 2,
    squareFeet: 135,
    features: [
      "Spacious Open Plan Living",
      "Designer Kitchens",
      "Hardwood Flooring",
      "South-Facing Gardens",
      "High Ceilings",
      "Fiber Broadband Ready",
      "Solar Panels",
      "Double Glazed Windows"
    ],
    amenities: [
      "Central Park Area",
      "Sports Courts",
      "Outdoor Exercise Equipment",
      "Nature Walking Path",
      "Community Center",
      "Local Shopping"
    ],
    energyRating: "A3",
    availability: "Launching Summer 2025",
    depositAmount: "€15,000",
    brochureUrl: "/brochures/ballymakenny-view.pdf",
    floorPlans: [
      {
        id: "bmv-type-a",
        name: "Type A - 3 Bedroom Semi-Detached",
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 120,
        image: "/images/ballymakenny-view/floorplans/type-a.jpg"
      },
      {
        id: "bmv-type-b",
        name: "Type B - 4 Bedroom Detached",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 150,
        image: "/images/ballymakenny-view/floorplans/type-b.jpg"
      }
    ]
  },
  // Added a third development for more variety
  {
    id: "ellwood",
    name: "Ellwood",
    description: "Exclusive riverside apartments with stunning views and premium finishes",
    location: "Riverside, Drogheda",
    image: "/images/developments/Ellwood-Logos/hero.jpg",
    status: "Register Interest",
    statusColor: "purple-500",
    priceRange: "€375,000 - €550,000",
    bedrooms: [1, 2, 3],
    bathrooms: 2,
    squareFeet: 110,
    features: [
      "Floor-to-Ceiling Windows",
      "Private Balconies",
      "Designer Kitchen Units",
      "Quartz Countertops",
      "Walk-in Wardrobes",
      "Smart Home Integration",
      "Underfloor Heating",
      "High-End Appliances"
    ],
    amenities: [
      "Residents' Lounge",
      "Rooftop Garden",
      "24/7 Concierge",
      "Secure Underground Parking",
      "Fitness Center",
      "Riverside Walking Path",
      "Private Dock Access"
    ],
    energyRating: "A1",
    availability: "Launching Autumn 2025",
    depositAmount: "€20,000",
    floorPlans: [
      {
        id: "rm-type-a",
        name: "Type A - 1 Bedroom Premium",
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 65,
        image: "/images/ellwood/floorplans/type-a.jpg"
      },
      {
        id: "rm-type-b",
        name: "Type B - 2 Bedroom Deluxe",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 95,
        image: "/images/ellwood/floorplans/type-b.jpg"
      },
      {
        id: "rm-type-c",
        name: "Type C - 3 Bedroom Penthouse",
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 140,
        image: "/images/ellwood/floorplans/type-c.jpg"
      }
    ],
    brochureUrl: "/brochures/ellwood.pdf",
    virtualTourUrl: "https://example.com/virtual-tour/ellwood"
  }
];

export function getDevelopmentById(id: string): Development | undefined {
  return mockDevelopments.find(dev => dev.id === id);
}

// Helper function to get all developments
export function getAllDevelopments(): Development[] {
  return mockDevelopments;
}

// Helper function to get developments by status
export function getDevelopmentsByStatus(status: string): Development[] {
  return mockDevelopments.filter(dev => 
    dev.status?.toLowerCase().includes(status.toLowerCase())
  );
}

// Helper function to search developments by name or location
export function searchDevelopments(query: string): Development[] {
  const lowercaseQuery = query.toLowerCase();
  return mockDevelopments.filter(dev => 
    dev.name.toLowerCase().includes(lowercaseQuery) || 
    dev.location.toLowerCase().includes(lowercaseQuery)
  );
}