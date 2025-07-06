// Fitzgerald Gardens Units Data
export interface FitzgeraldGardensUnit {
  houseNo: string;
  houseType: string;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  price: number;
  status: 'Available' | 'Reserved' | 'Sold';
  energyRating: string;
  plotSize?: number;
  features: string[];
  floorPlan?: string;
  images: string[];
}

export const FITZGERALD_GARDENS_UNITS: FitzgeraldGardensUnit[] = [
  {
    houseNo: "1",
    houseType: "Hawthorne",
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 110,
    price: 395000,
    status: "Available",
    energyRating: "A2",
    plotSize: 150,
    features: [
      "Open plan kitchen/dining/living",
      "Master bedroom with en-suite",
      "Private rear garden",
      "Downstairs WC",
      "Utility room",
      "High-quality finishes"
    ],
    images: [
      "/images/developments/fitzgerald-gardens/3bed-House.jpeg",
      "/images/developments/fitzgerald-gardens/hero.jpeg"
    ]
  },
  {
    houseNo: "2",
    houseType: "Hawthorne",
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 110,
    price: 400000,
    status: "Available",
    energyRating: "A2",
    plotSize: 160,
    features: [
      "Open plan kitchen/dining/living",
      "Master bedroom with en-suite",
      "Private rear garden",
      "Downstairs WC",
      "Utility room",
      "High-quality finishes"
    ],
    images: [
      "/images/developments/fitzgerald-gardens/3bed-House.jpeg",
      "/images/developments/fitzgerald-gardens/hero.jpeg"
    ]
  },
  {
    houseNo: "3",
    houseType: "Oak",
    bedrooms: 4,
    bathrooms: 3,
    floorArea: 135,
    price: 475000,
    status: "Available",
    energyRating: "A2",
    plotSize: 180,
    features: [
      "Open plan kitchen/dining/living",
      "Master bedroom with en-suite",
      "Second en-suite bathroom",
      "Private rear garden",
      "Downstairs WC",
      "Utility room",
      "Study/Home office"
    ],
    images: [
      "/images/developments/fitzgerald-gardens/hero.jpeg",
      "/images/developments/fitzgerald-gardens/HouseTypes Header.jpeg"
    ]
  },
  {
    houseNo: "4",
    houseType: "Birch",
    bedrooms: 2,
    bathrooms: 2,
    floorArea: 85,
    price: 350000,
    status: "Available",
    energyRating: "A2",
    features: [
      "Open plan kitchen/dining/living",
      "Master bedroom with en-suite",
      "Private balcony",
      "Storage room",
      "High-quality finishes"
    ],
    images: [
      "/images/developments/fitzgerald-gardens/2bed-apartment.jpeg",
      "/images/developments/fitzgerald-gardens/hero.jpeg"
    ]
  },
  {
    houseNo: "5",
    houseType: "Birch",
    bedrooms: 2,
    bathrooms: 2,
    floorArea: 85,
    price: 355000,
    status: "Reserved",
    energyRating: "A2",
    features: [
      "Open plan kitchen/dining/living",
      "Master bedroom with en-suite",
      "Private balcony",
      "Storage room",
      "High-quality finishes"
    ],
    images: [
      "/images/developments/fitzgerald-gardens/2bed-apartment.jpeg",
      "/images/developments/fitzgerald-gardens/hero.jpeg"
    ]
  },
  {
    houseNo: "6",
    houseType: "Oak",
    bedrooms: 4,
    bathrooms: 3,
    floorArea: 135,
    price: 485000,
    status: "Available",
    energyRating: "A2",
    plotSize: 190,
    features: [
      "Open plan kitchen/dining/living",
      "Master bedroom with en-suite",
      "Second en-suite bathroom",
      "Private rear garden",
      "Downstairs WC",
      "Utility room",
      "Study/Home office",
      "Corner plot"
    ],
    images: [
      "/images/developments/fitzgerald-gardens/hero.jpeg",
      "/images/developments/fitzgerald-gardens/HouseTypes Header.jpeg"
    ]
  }
];

export const HOUSE_TYPES = {
  Birch: {
    name: "Birch",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    floorArea: 85,
    startingPrice: 350000,
    description: "Modern 2-bedroom apartments with private balconies"
  },
  Hawthorne: {
    name: "Hawthorne", 
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 110,
    startingPrice: 395000,
    description: "Spacious 3-bedroom family homes with private gardens"
  },
  Oak: {
    name: "Oak",
    type: "House", 
    bedrooms: 4,
    bathrooms: 3,
    floorArea: 135,
    startingPrice: 475000,
    description: "Premium 4-bedroom homes with study and larger gardens"
  }
};