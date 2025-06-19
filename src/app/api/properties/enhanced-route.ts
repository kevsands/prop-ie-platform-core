/**
 * ================================================================================
 * ENHANCED PROPERTIES API ENDPOINT
 * Production-ready properties API with full database integration
 * Removes mock data, adds comprehensive filtering, caching, and statistics
 * ================================================================================
 */

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
    features,
    amenities: development?.amenities ? JSON.parse(development.amenities) : [],
    images,
    description: unit.description || `Modern ${unit.bedrooms} bedroom ${unit.type?.toLowerCase()} in premium development`,
    availableDate: unit.availableFrom ? unit.availableFrom.toISOString().split('T')[0] : '2024-03-01',
    unitNumber: unit.unitNumber,
    floorPlan: unit.floorplansData || '/images/floorplans/default.jpg',
    virtualTour: !!unit.virtualTourUrl,
    virtualTourUrl: unit.virtualTourUrl,
    
    // HTB Information
    htbEligible: unit.price <= 500000, // HTB threshold
    htbAmount: unit.price <= 500000 ? Math.min(Math.round(unit.price * 0.1), 30000) : 0,
    
    // Property IDs for relationships
    propertyId: unit.id,
    projectId: unit.developmentId,
    developmentId: unit.developmentId,
    
    // Timestamps
    createdAt: unit.createdAt,
    updatedAt: unit.updatedAt,
    
    // Calculated fields
    pricePerSqM: unit.size ? Math.round(unit.price / unit.size) : 0,
    estimatedServiceCharge: Math.round(unit.size * 2.5), // €2.50 per sqm estimate
  };

  // Add development details if requested
  if (includeDevelopmentDetails && development) {
    return {
      ...baseProperty,
      development: {
        id: development.id,
        name: development.name,
        slug: development.name?.toLowerCase().replace(/\s+/g, '-'),
        description: development.description,
        location: development.location,
        masterPlan: development.masterPlan,
        amenities: development.amenities ? JSON.parse(development.amenities) : [],
        images: development.images ? JSON.parse(development.images) : [],
        totalUnits: development.totalUnits,
        phaseCount: development.phases || 1,
        completionDate: development.expectedCompletion,
        builderName: development.builderName || 'Premium Developments Ltd',
        architect: development.architect,
        planningRef: development.planningRef
      },
      projectName: development.name,
      projectSlug: development.name?.toLowerCase().replace(/\s+/g, '-'),
      developmentName: development.name
    };
  }

  return baseProperty;
}

/**
 * Apply advanced filtering to properties
 */
function applyAdvancedFilters(properties: any[], searchParams: URLSearchParams) {
  let filtered = [...properties];

  // Text search in title, description, location
  const query = searchParams.get('query');
  if (query) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.location.toLowerCase().includes(searchTerm) ||
      p.features.some((f: string) => f.toLowerCase().includes(searchTerm))
    );
  }

  // Price range filtering
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseInt(maxPrice));
  }

  // Bedroom filtering (exact or range)
  const bedrooms = searchParams.get('bedrooms');
  const minBedrooms = searchParams.get('minBedrooms');
  const maxBedrooms = searchParams.get('maxBedrooms');
  
  if (bedrooms) {
    filtered = filtered.filter(p => p.bedrooms === parseInt(bedrooms));
  } else {
    if (minBedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(minBedrooms));
    }
    if (maxBedrooms) {
      filtered = filtered.filter(p => p.bedrooms <= parseInt(maxBedrooms));
    }
  }

  // Bathroom filtering
  const bathrooms = searchParams.get('bathrooms');
  const minBathrooms = searchParams.get('minBathrooms');
  if (bathrooms) {
    filtered = filtered.filter(p => p.bathrooms === parseInt(bathrooms));
  } else if (minBathrooms) {
    filtered = filtered.filter(p => p.bathrooms >= parseInt(minBathrooms));
  }

  // Floor area filtering
  const minFloorArea = searchParams.get('minFloorArea');
  const maxFloorArea = searchParams.get('maxFloorArea');
  if (minFloorArea) {
    filtered = filtered.filter(p => p.size >= parseInt(minFloorArea));
  }
  if (maxFloorArea) {
    filtered = filtered.filter(p => p.size <= parseInt(maxFloorArea));
  }

  // Property type filtering
  const propertyType = searchParams.get('type');
  const propertyTypes = searchParams.get('propertyTypes')?.split(',').filter(Boolean);
  
  if (propertyType) {
    filtered = filtered.filter(p => p.type.toLowerCase() === propertyType.toLowerCase());
  } else if (propertyTypes && propertyTypes.length > 0) {
    filtered = filtered.filter(p => 
      propertyTypes.some(type => p.type.toLowerCase() === type.toLowerCase())
    );
  }

  // Features filtering (must have ALL specified features)
  const featuresParam = searchParams.get('features');
  if (featuresParam) {
    const requiredFeatures = featuresParam.split(',').filter(Boolean);
    filtered = filtered.filter(p => 
      requiredFeatures.every(feature => 
        p.features.some((f: string) => f.toLowerCase().includes(feature.toLowerCase()))
      )
    );
  }

  // Amenities filtering
  const amenitiesParam = searchParams.get('amenities');
  if (amenitiesParam) {
    const requiredAmenities = amenitiesParam.split(',').filter(Boolean);
    filtered = filtered.filter(p => 
      requiredAmenities.every(amenity => 
        p.amenities.some((a: string) => a.toLowerCase().includes(amenity.toLowerCase()))
      )
    );
  }

  // BER rating filtering
  const berRating = searchParams.get('berRating');
  if (berRating) {
    const ratings = berRating.split(',').filter(Boolean);
    filtered = filtered.filter(p => ratings.includes(p.berRating));
  }

  // Status filtering
  const status = searchParams.get('status');
  if (status && status !== 'all') {
    filtered = filtered.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }

  // HTB eligibility filtering
  const htbEligible = searchParams.get('htbEligible');
  if (htbEligible === 'true') {
    filtered = filtered.filter(p => p.htbEligible);
  }

  // Virtual tour filtering
  const virtualTour = searchParams.get('virtualTour');
  if (virtualTour === 'true') {
    filtered = filtered.filter(p => p.virtualTour);
  }

  // Location/Development filtering
  const location = searchParams.get('location');
  if (location) {
    filtered = filtered.filter(p => 
      p.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  const developmentId = searchParams.get('developmentId') || searchParams.get('projectId');
  if (developmentId) {
    filtered = filtered.filter(p => p.developmentId === developmentId);
  }

  return filtered;
}

/**
 * Apply sorting to properties
 */
function applySorting(properties: any[], searchParams: URLSearchParams) {
  const sortBy = searchParams.get('sortBy') || 'price';
  const sortOrder = searchParams.get('sortOrder') || 'asc';
  const isDescending = sortOrder === 'desc';

  const sorted = [...properties].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'size':
      case 'floorArea':
        comparison = a.size - b.size;
        break;
      case 'bedrooms':
        comparison = a.bedrooms - b.bedrooms;
        break;
      case 'bathrooms':
        comparison = a.bathrooms - b.bathrooms;
        break;
      case 'pricePerSqM':
        comparison = a.pricePerSqM - b.pricePerSqM;
        break;
      case 'title':
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'location':
        comparison = a.location.localeCompare(b.location);
        break;
      case 'availableDate':
        comparison = new Date(a.availableDate).getTime() - new Date(b.availableDate).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      default:
        comparison = a.price - b.price;
    }

    return isDescending ? -comparison : comparison;
  });

  return sorted;
}

/**
 * Apply pagination
 */
function applyPagination(properties: any[], searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedProperties = properties.slice(startIndex, endIndex);
  const hasMore = endIndex < properties.length;
  
  return {
    properties: paginatedProperties,
    pagination: {
      page,
      limit,
      total: properties.length,
      totalPages: Math.ceil(properties.length / limit),
      hasMore,
      hasNext: hasMore,
      hasPrevious: page > 1
    }
  };
}

/**
 * GET /api/properties - Enhanced properties endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check for featured properties request
    const featured = searchParams.get('featured') === 'true';
    const includeStatistics = searchParams.get('includeStatistics') === 'true';
    const includeDevelopmentDetails = searchParams.get('includeDevelopment') !== 'false';
    
    // Get all units from database with development data
    const units = await developmentsService.getUnits({
      includeDetails: true
    });

    if (!units || units.length === 0) {
      return NextResponse.json({
        properties: [],
        total: 0,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasMore: false,
          hasNext: false,
          hasPrevious: false
        },
        message: 'No properties found'
      });
    }

    // Get development data for enhanced transformation
    const developments = await developmentsService.getAllDevelopments();
    const developmentMap = new Map(developments.map(dev => [dev.id, dev]));

    // Transform units to properties
    let properties = units.map(unit => 
      transformUnitToProperty(
        unit, 
        developmentMap.get(unit.developmentId),
        { includeDevelopmentDetails }
      )
    );

    // Handle featured properties request
    if (featured) {
      // Get highest value properties or most recently updated
      properties = properties
        .filter(p => p.status === 'AVAILABLE')
        .sort((a, b) => b.price - a.price)
        .slice(0, parseInt(searchParams.get('limit') || '8'));
    } else {
      // Apply comprehensive filtering
      properties = applyAdvancedFilters(properties, searchParams);
      
      // Apply sorting
      properties = applySorting(properties, searchParams);
    }

    // Apply pagination
    const result = applyPagination(properties, searchParams);

    // Add statistics if requested
    let statistics = {};
    if (includeStatistics) {
      const allAvailable = units.filter(unit => unit.status === 'AVAILABLE');
      const prices = allAvailable.map(unit => unit.price);
      
      statistics = {
        totalProperties: units.length,
        availableProperties: allAvailable.length,
        averagePrice: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
        medianPrice: prices.length > 0 ? prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)] : 0,
        priceRange: {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 0
        },
        typeDistribution: allAvailable.reduce((acc, unit) => {
          const type = unit.type?.toLowerCase() || 'apartment';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        bedroomDistribution: allAvailable.reduce((acc, unit) => {
          const bedrooms = unit.bedrooms || 0;
          acc[bedrooms] = (acc[bedrooms] || 0) + 1;
          return acc;
        }, {} as Record<number, number>)
      };
    }

    // Build response
    const response = {
      properties: result.properties,
      total: result.pagination.total,
      pagination: result.pagination,
      ...(includeStatistics && { statistics }),
      message: `Found ${result.pagination.total} properties`,
      timestamp: new Date().toISOString()
    };

    // Add cache headers for performance
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600'); // 5min cache
    headers.set('Content-Type', 'application/json');

    return NextResponse.json(response, { headers });

  } catch (error: any) {
    console.error('Error fetching properties:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch properties',
      message: error.message || 'Internal server error',
      properties: [],
      total: 0,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
        hasNext: false,
        hasPrevious: false
      }
    }, { status: 500 });
  }
}