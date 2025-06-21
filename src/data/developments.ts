// src/data/developments.ts
import { Development } from '@/types/developments';

export const developments: Development[] = [
  {
    id: "fitzgerald-gardens",
    name: "Fitzgerald Gardens",
    description: "Luxurious living with modern comforts in the heart of Drogheda",
    location: "Drogheda, Co. Louth",
    image: "/images/developments/fitzgerald-gardens/hero.jpeg",
    galleryImages: [
      "/images/developments/fitzgerald-gardens/hero.jpeg",
      "/images/developments/fitzgerald-gardens/1.jpg",
      "/images/developments/fitzgerald-gardens/2.jpg",
      "/images/developments/fitzgerald-gardens/3.jpg",
      "/images/developments/fitzgerald-gardens/2bed-apartment.jpeg",
      "/images/developments/fitzgerald-gardens/3bed-House.jpeg",
      "/images/developments/fitzgerald-gardens/HouseTypes Header.jpeg",
      "/images/developments/fitzgerald-gardens/Vanity-unit.jpeg"
    ],
    status: "Now Selling",
    statusColor: "green-500",
    priceRange: "€320,000 - €450,000",
    bedrooms: [2, 3, 4],
    bathrooms: 2,
    squareFeet: 120,
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
    depositAmount: "€10,000",
    showingDates: [
      "Saturday, May 3rd: 10am - 4pm",
      "Sunday, May 4th: 12pm - 5pm",
      "Saturday, May 10th: 10am - 4pm"
    ],
    floorPlans: [
      {
        id: "fg-type-a",
        name: "Type A - 2 Bedroom",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 85,
        image: "/images/developments/fitzgerald-gardens/House Type 1.png",
        price: "€320,000"
      },
      {
        id: "fg-type-b",
        name: "Type B - 3 Bedroom",
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 110,
        image: "/images/developments/fitzgerald-gardens/House Type 2.png",
        price: "€380,000"
      },
      {
        id: "fg-type-c",
        name: "Type C - 4 Bedroom",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 145,
        image: "/images/developments/fitzgerald-gardens/House Type 3.png",
        price: "€450,000"
      },
      {
        id: "fg-duplex",
        name: "Duplex Apartment",
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 105,
        image: "/images/developments/fitzgerald-gardens/Duplex D5.png",
        price: "€375,000"
      }
    ],
    virtualTourUrl: "https://example.com/virtual-tour/fitzgerald-gardens",
    mapLocation: {
      lat: 53.718,
      lng: -6.351
    }
  },
  {
    id: "ballymakenny-view",
    name: "Ballymakenny View",
    description: "Modern family homes in a convenient location with excellent amenities",
    location: "Ballymakenny, Drogheda, Co. Louth",
    image: "/images/developments/Ballymakenny-View/hero.jpg",
    galleryImages: [
      "/images/developments/Ballymakenny-View/hero.jpg",
      "/images/developments/Ballymakenny-View/01-People.jpg",
      "/images/developments/Ballymakenny-View/02-People.jpg",
      "/images/developments/Ballymakenny-View/03.jpg",
      "/images/developments/Ballymakenny-View/04.jpg",
      "/images/developments/Ballymakenny-View/BMV 1.jpg",
      "/images/developments/Ballymakenny-View/BMV 2.jpg",
      "/images/developments/Ballymakenny-View/main.jpg"
    ],
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
        image: "/images/developments/Ballymakenny-View/HouseType A.jpg",
        floorPlan: "/images/developments/Ballymakenny-View/HouseType A FP1.png",
        price: "€350,000"
      },
      {
        id: "bmv-type-b",
        name: "Type B - 4 Bedroom Detached",
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 150,
        image: "/images/developments/Ballymakenny-View/House Type B.jpg",
        floorPlan: "/images/developments/Ballymakenny-View/HouseTypeB FP2.png",
        price: "€425,000"
      }
    ],
    siteplan: "/images/developments/Ballymakenny-View/BMV Site Plan.png",
    mapLocation: {
      lat: 53.725,
      lng: -6.362
    }
  },
  {
    id: "ellwood",
    name: "Ellwood",
    description: "Contemporary apartment living in Drogheda",
    location: "Ellwood, Drogheda, Co. Louth",
    image: "/images/developments/Ellwood-Logos/hero.jpg",
    galleryImages: [
      "/images/developments/Ellwood-Logos/hero.jpg",
      "/images/developments/Ellwood-Logos/EllwoodBloom-1.jpeg",
      "/images/developments/Ellwood-Logos/EllwoodBloom-2.jpeg",
      "/images/developments/Ellwood-Logos/EllwoodBloom-3.jpeg",
      "/images/developments/Ellwood-Logos/EllwoodBloom-4.jpeg",
      "/images/developments/Ellwood-Logos/EllwoodBloom-5.jpeg"
    ],
    status: "Now Selling",
    statusColor: "green-500",
    priceRange: "€285,000 - €450,000",
    bedrooms: [1, 2, 3],
    bathrooms: 2,
    squareFeet: 85,
    features: [
      "Modern Open Plan Living",
      "Floor to Ceiling Windows",
      "Private Balconies",
      "Integrated Appliances",
      "Underfloor Heating",
      "Built-in Wardrobes",
      "Video Intercom System",
      "Secure Underground Parking"
    ],
    amenities: [
      "Residents Gym",
      "Concierge Service",
      "Landscaped Courtyard",
      "Bike Storage",
      "Package Room",
      "Community Lounge"
    ],
    energyRating: "A1",
    availability: "Ready to Move In",
    depositAmount: "€5,000",
    logos: [
      "/images/developments/Ellwood-Logos/2.png",
      "/images/developments/Ellwood-Logos/4 (1).png",
      "/images/developments/Ellwood-Logos/ELLWOOD (1).png"
    ],
    floorPlans: [
      {
        id: "ellwood-1bed",
        name: "1 Bedroom Apartment",
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 52,
        price: "€285,000"
      },
      {
        id: "ellwood-2bed",
        name: "2 Bedroom Apartment",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 75,
        price: "€365,000"
      },
      {
        id: "ellwood-3bed",
        name: "3 Bedroom Apartment",
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 95,
        price: "€450,000"
      }
    ],
    mapLocation: {
      lat: 53.720,
      lng: -6.350
    }
  }
];