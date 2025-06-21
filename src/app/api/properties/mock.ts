import { NextRequest, NextResponse } from 'next/server';
import { PropertyStatus, PropertyType } from '@/types/enums';
import { PropertyListResponse, Property } from '@/types/models/property';

// Mock property data with the sample images we created
const mockProperties: Property[] = [
  {
    id: 'property-1',
    developmentId: 'dev-1',
    development: {
      id: 'dev-1',
      name: 'Fitzgerald Gardens',
      slug: 'fitzgerald-gardens',
      developer: {
        id: 'dev-company-1',
        name: 'Premium Developments Ltd'
      },
      location: 'Dublin 4, Ireland',
      totalUnits: 120,
      availableUnits: 35,
      completionDate: new Date('2024-12-01')
    },
    unitNumber: 'A-101',
    name: 'Luxury 3-Bed Townhouse',
    type: PropertyType.House,
    size: 1850,
    bedrooms: 3,
    bathrooms: 2,
    price: 450000,
    originalPrice: 475000,
    status: PropertyStatus.Available,
    features: ['Garden', 'Parking', 'New Build', 'Energy Efficient'],
    images: [
      {
        id: 'img-1',
        url: '/images/properties/sample-property-1.svg',
        alt: 'Luxury 3-Bed Townhouse - Main View',
        isPrimary: true,
        order: 0
      },
      {
        id: 'img-2',
        url: '/images/fitzgerald-gardens/hero.jpeg',
        alt: 'Luxury 3-Bed Townhouse - Garden View',
        isPrimary: false,
        order: 1
      }
    ],
    floorPlans: ['/images/floor-plans/type-a.jpg'],
    virtualTourUrl: 'https://example.com/virtual-tour-1',
    description: 'Beautiful 3-bedroom townhouse in the prestigious Fitzgerald Gardens development. Features modern finishes, private garden, and parking space.',
    specifications: {
      parkingSpaces: 1,
      garageSpaces: 0,
      storageArea: 50,
      balconyArea: 0,
      terraceArea: 120
    },
    location: {
      address: '123 Fitzgerald Gardens',
      city: 'Dublin',
      county: 'Dublin',
      postcode: 'D04 XYZ1',
      latitude: 53.3498,
      longitude: -6.2603
    },
    amenities: ['Gym', 'Concierge', 'Garden', 'Parking'],
    availability: {
      isAvailable: true,
      availableFrom: new Date('2024-08-01'),
      moveInDate: new Date('2024-09-01')
    },
    energyRating: 'A2',
    berNumber: 'BER12345678',
    propertyTax: 350,
    managementFee: 2400,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-15')
  },
  {
    id: 'property-2',
    developmentId: 'dev-2',
    development: {
      id: 'dev-2',
      name: 'Riverside Manor',
      slug: 'riverside-manor',
      developer: {
        id: 'dev-company-2',
        name: 'Urban Living Developments'
      },
      location: 'Dublin 2, Ireland',
      totalUnits: 80,
      availableUnits: 12,
      completionDate: new Date('2024-10-01')
    },
    unitNumber: 'B-205',
    name: 'Modern 2-Bed Apartment',
    type: PropertyType.Apartment,
    size: 950,
    bedrooms: 2,
    bathrooms: 2,
    price: 620000,
    status: PropertyStatus.Available,
    features: ['Balcony', 'City View', 'Concierge', 'Gym'],
    images: [
      {
        id: 'img-3',
        url: '/images/properties/sample-property-2.svg',
        alt: 'Modern 2-Bed Apartment - Building View',
        isPrimary: true,
        order: 0
      },
      {
        id: 'img-4',
        url: '/images/developments/riverside-manor/main.jpg',
        alt: 'Modern 2-Bed Apartment - Interior',
        isPrimary: false,
        order: 1
      }
    ],
    floorPlans: ['/images/floor-plans/type-b.jpg'],
    description: 'Stunning 2-bedroom apartment with city views and modern amenities. Located in the heart of Dublin 2.',
    specifications: {
      parkingSpaces: 1,
      garageSpaces: 0,
      storageArea: 25,
      balconyArea: 15,
      terraceArea: 0
    },
    location: {
      address: '456 Riverside Manor',
      city: 'Dublin',
      county: 'Dublin',
      postcode: 'D02 ABC2',
      latitude: 53.3448,
      longitude: -6.2673
    },
    amenities: ['Gym', 'Concierge', 'Rooftop Terrace', 'Parking'],
    availability: {
      isAvailable: true,
      availableFrom: new Date('2024-07-15'),
      moveInDate: new Date('2024-08-15')
    },
    energyRating: 'A1',
    berNumber: 'BER87654321',
    propertyTax: 480,
    managementFee: 3200,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-06-10')
  },
  {
    id: 'property-3',
    developmentId: 'dev-3',
    development: {
      id: 'dev-3',
      name: 'Ballymakenny View',
      slug: 'ballymakenny-view',
      developer: {
        id: 'dev-company-3',
        name: 'Luxury Homes Ireland'
      },
      location: 'Drogheda, Co. Louth',
      totalUnits: 45,
      availableUnits: 8,
      completionDate: new Date('2024-11-01')
    },
    unitNumber: 'C-301',
    name: 'Executive 4-Bed Villa',
    type: PropertyType.Villa,
    size: 2800,
    bedrooms: 4,
    bathrooms: 3,
    price: 850000,
    status: PropertyStatus.Available,
    features: ['Sea View', 'Garden', 'Garage', 'Premium Finishes'],
    images: [
      {
        id: 'img-5',
        url: '/images/properties/sample-property-3.svg',
        alt: 'Executive 4-Bed Villa - Main View',
        isPrimary: true,
        order: 0
      },
      {
        id: 'img-6',
        url: '/images/ballymakenny-view/hero.jpg',
        alt: 'Executive 4-Bed Villa - Garden View',
        isPrimary: false,
        order: 1
      }
    ],
    floorPlans: ['/images/floor-plans/type-c.jpg'],
    virtualTourUrl: 'https://example.com/virtual-tour-3',
    description: 'Magnificent 4-bedroom executive villa with sea views and extensive gardens. Premium finishes throughout.',
    specifications: {
      parkingSpaces: 2,
      garageSpaces: 2,
      storageArea: 100,
      balconyArea: 0,
      terraceArea: 250
    },
    location: {
      address: '789 Ballymakenny View',
      city: 'Drogheda',
      county: 'Louth',
      postcode: 'A92 XYZ3',
      latitude: 53.7197,
      longitude: -6.3439
    },
    amenities: ['Private Garden', 'Garage', 'Sea View', 'Premium Finishes'],
    availability: {
      isAvailable: true,
      availableFrom: new Date('2024-09-01'),
      moveInDate: new Date('2024-10-01')
    },
    energyRating: 'A3',
    berNumber: 'BER11223344',
    propertyTax: 750,
    managementFee: 0,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-06-05')
  },
  // Add more mock properties...
  {
    id: 'property-4',
    unitNumber: 'D-102',
    name: 'Cozy 1-Bed Studio',
    type: PropertyType.Studio,
    size: 450,
    bedrooms: 1,
    bathrooms: 1,
    price: 280000,
    status: PropertyStatus.Available,
    features: ['Compact Living', 'Modern Kitchen', 'City Center'],
    images: [
      {
        id: 'img-7',
        url: '/images/properties/sample-property-1.svg',
        alt: 'Cozy 1-Bed Studio',
        isPrimary: true,
        order: 0
      }
    ],
    floorPlans: [],
    description: 'Perfect starter home in the city center. Ideal for young professionals.',
    location: {
      address: '101 City Center',
      city: 'Dublin',
      county: 'Dublin',
      postcode: 'D01 ABC4',
      latitude: 53.3498,
      longitude: -6.2603
    },
    amenities: ['City Center', 'Public Transport'],
    availability: {
      isAvailable: true,
      availableFrom: new Date('2024-07-01'),
      moveInDate: new Date('2024-08-01')
    },
    energyRating: 'B2',
    propertyTax: 250,
    managementFee: 1800,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-06-01')
  },
  {
    id: 'property-5',
    unitNumber: 'E-203',
    name: 'Family 4-Bed House',
    type: PropertyType.House,
    size: 2200,
    bedrooms: 4,
    bathrooms: 3,
    price: 675000,
    status: PropertyStatus.Reserved,
    features: ['Garden', 'Garage', 'Family Area', 'Quiet Location'],
    images: [
      {
        id: 'img-8',
        url: '/images/properties/sample-property-2.svg',
        alt: 'Family 4-Bed House',
        isPrimary: true,
        order: 0
      }
    ],
    floorPlans: [],
    description: 'Perfect family home with spacious rooms and private garden.',
    location: {
      address: '202 Family Estate',
      city: 'Cork',
      county: 'Cork',
      postcode: 'T12 XYZ5',
      latitude: 51.8986,
      longitude: -8.4958
    },
    amenities: ['Garden', 'Garage', 'Schools Nearby'],
    availability: {
      isAvailable: false,
      availableFrom: new Date('2024-12-01'),
      moveInDate: new Date('2025-01-01')
    },
    energyRating: 'A2',
    propertyTax: 600,
    managementFee: 0,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-06-20')
  },
  {
    id: 'property-6',
    unitNumber: 'F-105',
    name: 'Penthouse Suite',
    type: PropertyType.Penthouse,
    size: 1600,
    bedrooms: 3,
    bathrooms: 2,
    price: 950000,
    status: PropertyStatus.Available,
    features: ['Rooftop Terrace', 'City View', 'Premium Finishes', 'Concierge'],
    images: [
      {
        id: 'img-9',
        url: '/images/properties/sample-property-3.svg',
        alt: 'Penthouse Suite',
        isPrimary: true,
        order: 0
      }
    ],
    floorPlans: [],
    virtualTourUrl: 'https://example.com/virtual-tour-6',
    description: 'Luxury penthouse with stunning city views and private rooftop terrace.',
    location: {
      address: '303 Sky Gardens',
      city: 'Dublin',
      county: 'Dublin',
      postcode: 'D04 SKY1',
      latitude: 53.3398,
      longitude: -6.2703
    },
    amenities: ['Rooftop Terrace', 'Concierge', 'Gym', 'Spa'],
    availability: {
      isAvailable: true,
      availableFrom: new Date('2024-08-15'),
      moveInDate: new Date('2024-09-15')
    },
    energyRating: 'A1',
    propertyTax: 850,
    managementFee: 4500,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-25')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const search = searchParams.get('search') || '';
    
    // Filter properties based on search
    let filteredProperties = mockProperties;
    
    if (search) {
      filteredProperties = mockProperties.filter(property =>
        property.name.toLowerCase().includes(search.toLowerCase()) ||
        property.description?.toLowerCase().includes(search.toLowerCase()) ||
        property.location.city.toLowerCase().includes(search.toLowerCase()) ||
        property.development?.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
    
    const response: PropertyListResponse = {
      properties: paginatedProperties,
      total: filteredProperties.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredProperties.length / pageSize),
      filters: {
        search: search || undefined,
        sortBy: 'newest',
        sortOrder: 'desc'
      },
      aggregations: {
        priceRange: {
          min: Math.min(...mockProperties.map(p => p.price)),
          max: Math.max(...mockProperties.map(p => p.price)),
          avg: mockProperties.reduce((sum, p) => sum + p.price, 0) / mockProperties.length
        },
        sizeRange: {
          min: Math.min(...mockProperties.map(p => p.size)),
          max: Math.max(...mockProperties.map(p => p.size)),
          avg: mockProperties.reduce((sum, p) => sum + p.size, 0) / mockProperties.length
        },
        typeCounts: {},
        statusCounts: {},
        bedroomCounts: {},
        locationCounts: {}
      }
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Mock API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}