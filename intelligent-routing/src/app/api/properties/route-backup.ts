import { NextRequest, NextResponse } from 'next/server';
import { developmentsService } from '@/lib/services/developments-real';

// Mock property data (keeping for fallback, will be replaced with real units)
const mockPropertiesBackup = [
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
  try {
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
    const developmentId = searchParams.get('developmentId');
    
    // Get real units data from database
    const units = await developmentsService.getUnits({
      developmentId,
      status,
      minPrice: priceMin,
      maxPrice: priceMax,
      bedrooms: bedroomsMin, // Use minimum as filter for exact match
      type: propertyTypes.length > 0 ? propertyTypes[0].toUpperCase() : undefined
    });
    
    // Transform units to properties format for compatibility
    let filtered = units.map(unit => ({
      id: unit.id,
      title: unit.title || `${unit.bedrooms} Bed ${unit.type}`,
      location: 'Dublin', // Will get from development data later
      price: Math.round(unit.price),
      type: unit.type.toLowerCase(),
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      size: unit.size,
      status: unit.status,
      berRating: unit.berRating,
      features: JSON.parse(unit.featuresData || '[]'),
      images: JSON.parse(unit.imagesData || '["/images/properties/apartment1.jpg"]'),
      description: unit.description || `Modern ${unit.bedrooms} bedroom ${unit.type.toLowerCase()}`,
      availableDate: unit.availableFrom ? unit.availableFrom.toISOString().split('T')[0] : '2024-03-01',
      development: 'Fitzgerald Gardens',
      htbEligible: true,
      htbAmount: Math.round(unit.price * 0.1), // 10% HTB estimate
      unitNumber: unit.unitNumber,
      floorPlan: unit.floorplansData || '',
      virtualTour: !!unit.virtualTourUrl,
      virtualTourUrl: unit.virtualTourUrl
    }));
    
    // Apply additional client-side filters that couldn't be done in DB
    if (bedroomsMax) {
      filtered = filtered.filter(p => p.bedrooms <= bedroomsMax);
    }
    if (bathroomsMin) {
      filtered = filtered.filter(p => p.bathrooms >= bathroomsMin);
    }
    if (propertyTypes.length > 1) {
      filtered = filtered.filter(p => propertyTypes.map(t => t.toLowerCase()).includes(p.type));
    }
    if (features.length > 0) {
      filtered = filtered.filter(p => 
        features.every(feature => p.features.includes(feature))
      );
    }
    if (berRating.length > 0) {
      filtered = filtered.filter(p => berRating.includes(p.berRating));
    }
    if (locations.length > 0) {
      filtered = filtered.filter(p => 
        locations.some(loc => p.location.toLowerCase().includes(loc.toLowerCase()))
      );
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
        // Sort by unit number for consistency
        filtered.sort((a, b) => b.unitNumber.localeCompare(a.unitNumber));
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
    
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({
      error: 'Failed to fetch properties',
      message: 'Internal server error'
    }, { status: 500 });
  }
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