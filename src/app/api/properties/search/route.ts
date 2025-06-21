import { NextRequest, NextResponse } from 'next/server';
import { developmentsService } from '@/lib/services/developments-real';

interface PropertyTransformOptions {
  includeDevelopmentDetails?: boolean;
  includeStatistics?: boolean;
}

/**
 * Transform database unit to property format with enhanced data
 */
function transformUnitToProperty(unit: any, development?: any, options: PropertyTransformOptions = {}) {
  const { includeDevelopmentDetails = true } = options;

  const features = unit.featuresData ? JSON.parse(unit.featuresData) : [];
  const images = unit.imagesData ? JSON.parse(unit.imagesData) : ['/images/properties/default-property.jpg'];
  
  const baseProperty = {
    id: unit.id,
    title: unit.title || `${unit.bedrooms} Bed ${unit.type} - Unit ${unit.unitNumber}`,
    name: unit.title || `Unit ${unit.unitNumber}`,
    location: development?.location || 'Dublin, Ireland',
    address: {
      street: development?.address || '',
      city: development?.location || 'Dublin',
      county: development?.location?.includes('Dublin') ? 'Dublin' : 'Ireland',
      country: 'Ireland',
      eircode: development?.eircode || ''
    },
    price: Math.round(unit.price),
    type: unit.type?.toLowerCase() || 'apartment',
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    parkingSpaces: unit.parking || 0,
    size: unit.size,
    floorArea: unit.size,
    status: unit.status || 'AVAILABLE',
    berRating: unit.berRating || 'B2',
    htbEligible: unit.price <= 500000, // HTB eligibility based on price
    features,
    amenities: development?.amenitiesData ? JSON.parse(development.amenitiesData) : [],
    images,
    description: unit.description || `Modern ${unit.bedrooms} bedroom ${unit.type?.toLowerCase()} in premium development`,
    development: {
      id: development?.id || '',
      name: development?.name || 'Premium Development',
      developer: 'Premium Developments',
      completionDate: development?.estimatedCompletion || '2024-Q4'
    }
  };

  return baseProperty;
}

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

    // Build filters for real database query
    const filters: any = {};
    
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (bedrooms) filters.bedrooms = bedrooms;
    if (propertyType) filters.type = propertyType.toUpperCase();

    // Get real units from database
    const units = await developmentsService.getUnits(filters);
    
    // Get development data for enhanced transformation
    const developments = await developmentsService.getDevelopments();
    const developmentMap = new Map(developments.map(dev => [dev.id, dev]));

    // Transform units to properties
    let properties = units.map(unit => 
      transformUnitToProperty(unit, developmentMap.get(unit.developmentId))
    );

    // Apply additional filters that can't be done in SQL
    if (query) {
      const searchText = query.toLowerCase();
      properties = properties.filter(property => 
        property.title.toLowerCase().includes(searchText) ||
        property.location.toLowerCase().includes(searchText) ||
        property.development.name.toLowerCase().includes(searchText) ||
        property.description.toLowerCase().includes(searchText)
      );
    }

    if (location) {
      const locationText = location.toLowerCase();
      properties = properties.filter(property =>
        property.location.toLowerCase().includes(locationText) ||
        property.address.city.toLowerCase().includes(locationText) ||
        property.address.county.toLowerCase().includes(locationText)
      );
    }

    if (htbEligible) {
      properties = properties.filter(property => property.htbEligible);
    }

    // Sort by price (ascending by default)
    properties.sort((a, b) => a.price - b.price);

    // Pagination
    const totalCount = properties.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = properties.slice(startIndex, endIndex);

    // Statistics
    const stats = {
      totalProperties: totalCount,
      averagePrice: totalCount > 0 ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / totalCount) : 0,
      priceRange: {
        min: totalCount > 0 ? Math.min(...properties.map(p => p.price)) : 0,
        max: totalCount > 0 ? Math.max(...properties.map(p => p.price)) : 0
      },
      bedroomDistribution: {
        1: properties.filter(p => p.bedrooms === 1).length,
        2: properties.filter(p => p.bedrooms === 2).length,
        3: properties.filter(p => p.bedrooms === 3).length,
        4: properties.filter(p => p.bedrooms === 4).length
      },
      locationDistribution: properties.reduce((acc, property) => {
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
      status: 'database_connected',
      message: `Found ${totalCount} properties from database`
    });

  } catch (error) {
    console.error('Error in property search:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        properties: [],
        status: 'error'
      },
      { status: 500 }
    );
  }
}