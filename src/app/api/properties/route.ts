import { NextRequest, NextResponse } from 'next/server';

// Mock property data
const mockProperties = [
  {
    id: '1',
    title: '2 Bed Apartment - Fitzgerald Gardens',
    location: 'Finglas, Dublin',
    price: 395000,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    size: 85,
    status: 'AVAILABLE',
    berRating: 'A2',
    features: ['parking', 'balcony', 'ensuite', 'lift', 'garden'],
    images: [
      '/images/properties/apartment1.jpg',
      '/images/properties/10-maple-ave-1.jpg',
      '/images/properties/10-maple-ave-2.jpg',
    ],
    description: 'Modern 2-bedroom apartment in the heart of Finglas with stunning views.',
    availableDate: '2024-03-01',
    serviceCharge: 150,
    development: 'Fitzgerald Gardens',
    virtualTour: true,
    htbEligible: true,
    htbAmount: 30000
  },
  {
    id: '2',
    title: '3 Bed House - Ballymakenny View',
    location: 'Drogheda, Co. Louth',
    price: 285000,
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    size: 120,
    status: 'AVAILABLE',
    berRating: 'A3',
    features: ['parking', 'garden', 'garage', 'solar panels'],
    images: [
      '/images/properties/villa1.jpg',
      '/images/properties/10-maple-ave-3.jpg',
    ],
    description: 'Spacious family home with modern finishes throughout.',
    availableDate: '2024-04-01',
    development: 'Ballymakenny View',
    htbEligible: true,
    htbAmount: 28500
  },
  {
    id: '3',
    title: 'Penthouse Suite - Ellwood',
    location: 'Celbridge, Co. Kildare',
    price: 595000,
    type: 'penthouse',
    bedrooms: 3,
    bathrooms: 3,
    size: 150,
    status: 'RESERVED',
    berRating: 'A1',
    features: ['parking', 'terrace', 'gym', 'concierge', 'lift', 'storage'],
    images: [
      '/images/properties/penthouse1.jpg',
    ],
    description: 'Luxury penthouse with panoramic views and premium finishes.',
    availableDate: '2024-06-01',
    serviceCharge: 300,
    development: 'Ellwood',
    virtualTour: true,
    htbEligible: false,
    htbAmount: 0
  },
  // Add more mock properties
  {
    id: '4',
    title: '1 Bed Studio - City Centre',
    location: 'Dublin City Centre',
    price: 275000,
    type: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    size: 45,
    status: 'AVAILABLE',
    berRating: 'B1',
    features: ['lift', 'gym', 'security'],
    images: ['/images/properties/apartment1.jpg'],
    description: 'Compact studio apartment perfect for city living.',
    availableDate: 'Immediate',
    htbEligible: true,
    htbAmount: 27500
  },
  {
    id: '5',
    title: '4 Bed Detached - Riverside Manor',
    location: 'Cork',
    price: 450000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    size: 180,
    status: 'AVAILABLE',
    berRating: 'A2',
    features: ['parking', 'garden', 'garage', 'ensuite', 'study'],
    images: ['/images/properties/villa1.jpg'],
    description: 'Large family home in established neighborhood.',
    availableDate: '2024-05-01',
    development: 'Riverside Manor',
    htbEligible: true,
    htbAmount: 30000
  },
  {
    id: '6',
    title: '2 Bed Duplex - Phoenix Park',
    location: 'Dublin West',
    price: 425000,
    type: 'duplex',
    bedrooms: 2,
    bathrooms: 2,
    size: 95,
    status: 'AVAILABLE',
    berRating: 'A3',
    features: ['parking', 'balcony', 'storage'],
    images: ['/images/properties/apartment1.jpg'],
    description: 'Split-level living with modern design.',
    availableDate: '2024-04-15',
    htbEligible: true,
    htbAmount: 30000
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Parse filters
  const priceMin = searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined;
  const priceMax = searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined;
  const bedroomsMin = searchParams.get('bedroomsMin') ? parseInt(searchParams.get('bedroomsMin')!) : undefined;
  const bedroomsMax = searchParams.get('bedroomsMax') ? parseInt(searchParams.get('bedroomsMax')!) : undefined;
  const bathroomsMin = searchParams.get('bathroomsMin') ? parseInt(searchParams.get('bathroomsMin')!) : undefined;
  const propertyTypes = searchParams.get('propertyTypes')?.split(',').filter(Boolean) || [];
  const locations = searchParams.get('locations')?.split(',').filter(Boolean) || [];
  const features = searchParams.get('features')?.split(',').filter(Boolean) || [];
  const berRating = searchParams.get('berRating')?.split(',').filter(Boolean) || [];
  const status = searchParams.get('status');
  const sort = searchParams.get('sort') || 'price_asc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  
  // Filter properties
  let filtered = [...mockProperties];
  
  if (priceMin) {
    filtered = filtered.filter(p => p.price >= priceMin);
  }
  if (priceMax) {
    filtered = filtered.filter(p => p.price <= priceMax);
  }
  if (bedroomsMin) {
    filtered = filtered.filter(p => p.bedrooms >= bedroomsMin);
  }
  if (bedroomsMax) {
    filtered = filtered.filter(p => p.bedrooms <= bedroomsMax);
  }
  if (bathroomsMin) {
    filtered = filtered.filter(p => p.bathrooms >= bathroomsMin);
  }
  if (propertyTypes.length > 0) {
    filtered = filtered.filter(p => propertyTypes.includes(p.type));
  }
  if (locations.length > 0) {
    filtered = filtered.filter(p => 
      locations.some(loc => p.location.toLowerCase().includes(loc.toLowerCase()))
    );
  }
  if (features.length > 0) {
    filtered = filtered.filter(p => 
      features.every(feature => p.features.includes(feature))
    );
  }
  if (berRating.length > 0) {
    filtered = filtered.filter(p => berRating.includes(p.berRating));
  }
  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }
  
  // Sort properties
  switch (sort) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'size_desc':
      filtered.sort((a, b) => b.size - a.size);
      break;
    case 'size_asc':
      filtered.sort((a, b) => a.size - b.size);
      break;
    case 'date_desc':
      // In production, sort by actual listing date
      filtered.reverse();
      break;
    default:
      break;
  }
  
  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProperties = filtered.slice(startIndex, endIndex);
  
  return NextResponse.json({
    properties: paginatedProperties,
    totalCount: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit)
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // In production, save to database
    const newProperty = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date(),
    };
    
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 400 }
    );
  }
}