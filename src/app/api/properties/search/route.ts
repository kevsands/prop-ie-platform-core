import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Search parameters
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : null;
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : null;
    const bathrooms = searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : null;
    const propertyType = searchParams.get('type') || '';
    const htbEligible = searchParams.get('htbEligible') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Mock properties data for development
    const mockProperties = [
      {
        id: '1',
        title: 'Fitzgerald Gardens - Unit 23',
        name: 'Unit 23',
        location: 'Cork, Ireland',
        address: {
          street: 'Fitzgerald Gardens',
          city: 'Cork',
          county: 'Cork',
          country: 'Ireland',
          eircode: 'T12 XY34'
        },
        price: 385000,
        type: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        parkingSpaces: 1,
        size: 95,
        floorArea: 95,
        status: 'AVAILABLE',
        berRating: 'A3',
        htbEligible: true,
        features: ['Balcony', 'Storage', 'Modern Kitchen', 'En-suite'],
        amenities: ['Gym', 'Concierge', 'Garden', 'Secure Parking'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        description: 'Modern 3 bedroom apartment in premium development',
        development: {
          id: 'dev1',
          name: 'Fitzgerald Gardens',
          developer: 'Premium Developments',
          completionDate: '2024-Q4'
        }
      },
      {
        id: '2',
        title: 'Ellwood - Unit 15',
        name: 'Unit 15',
        location: 'Dublin, Ireland',
        address: {
          street: 'Ellwood Avenue',
          city: 'Dublin',
          county: 'Dublin',
          country: 'Ireland',
          eircode: 'D02 AB12'
        },
        price: 420000,
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        parkingSpaces: 1,
        size: 85,
        floorArea: 85,
        status: 'RESERVED',
        berRating: 'A2',
        htbEligible: true,
        features: ['Balcony', 'Storage', 'Modern Kitchen'],
        amenities: ['Gym', 'Rooftop Terrace', 'Secure Parking'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        description: 'Contemporary 2 bedroom apartment with city views',
        development: {
          id: 'dev2',
          name: 'Ellwood',
          developer: 'Dublin Properties Ltd',
          completionDate: '2024-Q3'
        }
      },
      {
        id: '3',
        title: 'Ballymakenny View - Unit 8',
        name: 'Unit 8',
        location: 'Drogheda, Ireland',
        address: {
          street: 'Ballymakenny Road',
          city: 'Drogheda',
          county: 'Louth',
          country: 'Ireland',
          eircode: 'A92 CD56'
        },
        price: 365000,
        type: 'house',
        bedrooms: 3,
        bathrooms: 2,
        parkingSpaces: 2,
        size: 110,
        floorArea: 110,
        status: 'AVAILABLE',
        berRating: 'B1',
        htbEligible: true,
        features: ['Garden', 'Driveway', 'Utility Room', 'Modern Kitchen'],
        amenities: ['Green Spaces', 'Walking Trails', 'Local Shops'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        description: 'Spacious 3 bedroom house with private garden',
        development: {
          id: 'dev3',
          name: 'Ballymakenny View',
          developer: 'Coastal Developments',
          completionDate: '2024-Q2'
        }
      },
      {
        id: '4',
        title: 'Phoenix Park Residences - Unit 12',
        name: 'Unit 12',
        location: 'Dublin, Ireland',
        address: {
          street: 'Phoenix Park Road',
          city: 'Dublin',
          county: 'Dublin',
          country: 'Ireland',
          eircode: 'D15 EF78'
        },
        price: 450000,
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        parkingSpaces: 1,
        size: 90,
        floorArea: 90,
        status: 'AVAILABLE',
        berRating: 'A1',
        htbEligible: true,
        features: ['Park Views', 'Premium Finishes', 'Storage', 'Balcony'],
        amenities: ['Concierge', 'Gym', 'Roof Garden', 'Secure Parking'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        description: 'Luxury 2 bedroom apartment overlooking Phoenix Park',
        development: {
          id: 'dev4',
          name: 'Phoenix Park Residences',
          developer: 'Luxury Living Ltd',
          completionDate: '2024-Q4'
        }
      },
      {
        id: '5',
        title: 'Riverside Gardens - Unit 5',
        name: 'Unit 5',
        location: 'Galway, Ireland',
        address: {
          street: 'Riverside Avenue',
          city: 'Galway',
          county: 'Galway',
          country: 'Ireland',
          eircode: 'H91 GH90'
        },
        price: 340000,
        type: 'house',
        bedrooms: 4,
        bathrooms: 3,
        parkingSpaces: 2,
        size: 130,
        floorArea: 130,
        status: 'AVAILABLE',
        berRating: 'B2',
        htbEligible: true,
        features: ['River Views', 'Large Garden', 'Double Garage', 'En-suite'],
        amenities: ['Riverside Walks', 'Local Schools', 'Shopping Centre'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        description: 'Family home with stunning river views',
        development: {
          id: 'dev5',
          name: 'Riverside Gardens',
          developer: 'Western Developments',
          completionDate: '2024-Q3'
        }
      },
      {
        id: '6',
        title: 'City Centre Heights - Unit 20',
        name: 'Unit 20',
        location: 'Cork, Ireland',
        address: {
          street: 'Patrick Street',
          city: 'Cork',
          county: 'Cork',
          country: 'Ireland',
          eircode: 'T12 JK34'
        },
        price: 395000,
        type: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        parkingSpaces: 0,
        size: 55,
        floorArea: 55,
        status: 'AVAILABLE',
        berRating: 'A2',
        htbEligible: true,
        features: ['City Views', 'High Ceilings', 'Modern Kitchen'],
        amenities: ['Gym', 'Rooftop Terrace', 'Concierge'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        description: 'Modern 1 bedroom apartment in city centre',
        development: {
          id: 'dev6',
          name: 'City Centre Heights',
          developer: 'Urban Living Ltd',
          completionDate: '2024-Q1'
        }
      }
    ];

    // Apply filters
    let filteredProperties = mockProperties.filter(property => {
      // Text search
      if (query) {
        const searchText = query.toLowerCase();
        const matchesText = property.title.toLowerCase().includes(searchText) ||
                           property.location.toLowerCase().includes(searchText) ||
                           property.development.name.toLowerCase().includes(searchText) ||
                           property.development.developer.toLowerCase().includes(searchText);
        if (!matchesText) return false;
      }

      // Location filter
      if (location) {
        const locationText = location.toLowerCase();
        if (!property.location.toLowerCase().includes(locationText) &&
            !property.address.city.toLowerCase().includes(locationText) &&
            !property.address.county.toLowerCase().includes(locationText)) {
          return false;
        }
      }

      // Price range
      if (minPrice && property.price < minPrice) return false;
      if (maxPrice && property.price > maxPrice) return false;

      // Bedrooms
      if (bedrooms && property.bedrooms !== bedrooms) return false;

      // Bathrooms
      if (bathrooms && property.bathrooms !== bathrooms) return false;

      // Property type
      if (propertyType && property.type !== propertyType) return false;

      // HTB eligible
      if (htbEligible && !property.htbEligible) return false;

      return true;
    });

    // Sort by price (ascending by default)
    filteredProperties.sort((a, b) => a.price - b.price);

    // Pagination
    const totalCount = filteredProperties.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    // Statistics
    const stats = {
      totalProperties: totalCount,
      averagePrice: totalCount > 0 ? Math.round(filteredProperties.reduce((sum, p) => sum + p.price, 0) / totalCount) : 0,
      priceRange: {
        min: totalCount > 0 ? Math.min(...filteredProperties.map(p => p.price)) : 0,
        max: totalCount > 0 ? Math.max(...filteredProperties.map(p => p.price)) : 0
      },
      bedroomDistribution: {
        1: filteredProperties.filter(p => p.bedrooms === 1).length,
        2: filteredProperties.filter(p => p.bedrooms === 2).length,
        3: filteredProperties.filter(p => p.bedrooms === 3).length,
        4: filteredProperties.filter(p => p.bedrooms === 4).length
      },
      locationDistribution: filteredProperties.reduce((acc, property) => {
        const city = property.address.city;
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      properties: paginatedProperties,
      pagination: {
        page,
        limit,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        query,
        location,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        propertyType,
        htbEligible
      },
      statistics: stats,
      status: 'mock_data',
      message: 'Using development mock property data'
    });

  } catch (error) {
    console.error('Error in property search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}