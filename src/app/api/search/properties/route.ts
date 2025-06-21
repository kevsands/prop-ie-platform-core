import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { searchService, SearchFilters, SearchSort } from '@/services/searchService';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    // Extract search parameters
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortField = searchParams.get('sortField') || 'price';
    const sortDirection = searchParams.get('sortDirection') || 'asc';
    
    // Parse filters from query parameters
    const filters: SearchFilters = {};
    
    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      filters.priceRange = {
        min: minPrice ? parseInt(minPrice) : undefined,
        max: maxPrice ? parseInt(maxPrice) : undefined
      };
    }
    
    // Bedrooms
    const minBedrooms = searchParams.get('minBedrooms');
    const maxBedrooms = searchParams.get('maxBedrooms');
    if (minBedrooms || maxBedrooms) {
      filters.bedrooms = {
        min: minBedrooms ? parseInt(minBedrooms) : undefined,
        max: maxBedrooms ? parseInt(maxBedrooms) : undefined
      };
    }
    
    // Property types
    const propertyTypes = searchParams.get('propertyTypes');
    if (propertyTypes) {
      filters.propertyType = propertyTypes.split(',');
    }
    
    // Availability status
    const availabilityStatus = searchParams.get('availabilityStatus');
    if (availabilityStatus) {
      filters.availabilityStatus = availabilityStatus.split(',');
    }
    
    // Development
    const development = searchParams.get('development');
    if (development) {
      filters.development = [development];
    }
    
    // Features
    const features = searchParams.get('features');
    if (features) {
      filters.features = features.split(',');
    }
    
    // Help to Buy
    const helpToBuy = searchParams.get('helpToBuy');
    if (helpToBuy === 'true') {
      filters.helpToBuy = true;
    }
    
    // Floor area
    const minFloorArea = searchParams.get('minFloorArea');
    const maxFloorArea = searchParams.get('maxFloorArea');
    if (minFloorArea || maxFloorArea) {
      filters.floorArea = {
        min: minFloorArea ? parseInt(minFloorArea) : undefined,
        max: maxFloorArea ? parseInt(maxFloorArea) : undefined
      };
    }
    
    // Build sort object
    const sort: SearchSort = {
      field: sortField as SearchSort['field'],
      direction: sortDirection as SearchSort['direction']
    };
    
    // Execute search using search service
    const results = await searchService.search(
      query,
      filters,
      sort,
      page,
      limit,
      session?.user?.id
    );
    
    return NextResponse.json({
      data: results,
      success: true,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Property search failed:', error);
    
    // Return fallback results on error
    const fallbackResults = {
      units: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      },
      aggregations: {
        priceRanges: [],
        bedroomCounts: [],
        propertyTypes: [],
        developments: [],
        availabilityStatus: []
      },
      suggestions: [
        'Try searching for "3 bedroom house"',
        'Filter by "help to buy eligible"',
        'Search "Fitzgerald Gardens"'
      ],
      searchTime: 0
    };
    
    return NextResponse.json({
      data: fallbackResults,
      success: false,
      error: 'Search service temporarily unavailable',
      timestamp: new Date()
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, searchData } = await request.json();

    if (action === 'save_search') {
      const { name, filters, sort, enableAlerts } = searchData;
      
      if (!name || !filters) {
        return NextResponse.json(
          { error: 'Missing required fields: name, filters' },
          { status: 400 }
        );
      }

      // Save search using search service
      const savedSearch = await searchService.saveSearch(
        session.user.id,
        name,
        filters,
        sort,
        enableAlerts
      );

      return NextResponse.json({
        data: savedSearch,
        message: 'Search saved successfully'
      }, { status: 201 });
    }

    if (action === 'get_recommendations') {
      const userProfile = searchData?.userProfile || {};
      
      // Get recommendations using search service
      const recommendations = await searchService.getRecommendations(
        session.user.id,
        userProfile
      );

      return NextResponse.json({
        data: recommendations,
        message: 'Recommendations generated successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Search action failed:', error);
    return NextResponse.json(
      { error: 'Failed to process search action' },
      { status: 500 }
    );
  }
}

// Enhanced search with database integration
async function executeAdvancedSearch(
  query: string,
  filters: SearchFilters,
  sort: SearchSort,
  page: number,
  limit: number
) {
  try {
    // Build Prisma query
    const whereClause: any = {};
    
    // Price range filter
    if (filters.priceRange) {
      whereClause.basePrice = {};
      if (filters.priceRange.min) {
        whereClause.basePrice.gte = filters.priceRange.min;
      }
      if (filters.priceRange.max) {
        whereClause.basePrice.lte = filters.priceRange.max;
      }
    }
    
    // Bedrooms filter
    if (filters.bedrooms) {
      whereClause.bedrooms = {};
      if (filters.bedrooms.min) {
        whereClause.bedrooms.gte = filters.bedrooms.min;
      }
      if (filters.bedrooms.max) {
        whereClause.bedrooms.lte = filters.bedrooms.max;
      }
    }
    
    // Property type filter
    if (filters.propertyType?.length) {
      whereClause.type = {
        in: filters.propertyType
      };
    }
    
    // Availability status filter
    if (filters.availabilityStatus?.length) {
      whereClause.status = {
        in: filters.availabilityStatus
      };
    }
    
    // Development filter
    if (filters.development?.length) {
      whereClause.development = {
        name: {
          in: filters.development
        }
      };
    }
    
    // Text search across multiple fields
    if (query) {
      whereClause.OR = [
        {
          development: {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          }
        },
        {
          type: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    // Build order by clause
    const orderBy: any = {};
    switch (sort.field) {
      case 'price':
        orderBy.basePrice = sort.direction;
        break;
      case 'size':
        orderBy.floorArea = sort.direction;
        break;
      case 'bedrooms':
        orderBy.bedrooms = sort.direction;
        break;
      case 'completion':
        orderBy.completionDate = sort.direction;
        break;
      default:
        orderBy.basePrice = 'asc';
    }
    
    // Execute database query
    const [units, totalCount] = await Promise.all([
      prisma.unit.findMany({
        where: whereClause,
        include: {
          development: {
            include: {
              location: true
            }
          },
          customizationOptions: true
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.unit.count({
        where: whereClause
      })
    ]);
    
    // Transform results to match SearchResult format
    const transformedUnits = units.map(unit => ({
      id: unit.id,
      developmentId: unit.developmentId,
      developmentName: unit.development.name,
      unitNumber: unit.unitNumber,
      type: unit.type,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      livingAreas: unit.livingAreas || 2,
      floorArea: unit.floorArea,
      basePrice: unit.basePrice,
      status: unit.status,
      completionDate: unit.completionDate,
      features: unit.features || [],
      images: unit.images || [],
      description: unit.description || '',
      location: {
        address: unit.development.location?.address || unit.development.address,
        area: unit.development.location?.city || 'Drogheda',
        county: unit.development.location?.county || 'Louth',
        coordinates: unit.development.location ? {
          lat: parseFloat(unit.development.location.latitude || '0'),
          lng: parseFloat(unit.development.location.longitude || '0')
        } : undefined
      },
      financing: {
        monthlyPayment: Math.round(unit.basePrice * 0.0045), // Approximate monthly payment
        deposit: Math.round(unit.basePrice * 0.1), // 10% deposit
        helpToBuyEligible: unit.basePrice <= 500000 // Help to Buy eligible up to €500k
      },
      investment: {
        estimatedRentalYield: parseFloat(((1500 * 12 / unit.basePrice) * 100).toFixed(1)),
        pricePerSqFt: Math.round(unit.basePrice / unit.floorArea),
        growthPotential: unit.basePrice > 400000 ? 'High' : 'Medium'
      },
      searchScore: 100,
      matchReasons: []
    }));
    
    return {
      units: transformedUnits,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
    
  } catch (error) {
    console.error('Database search failed:', error);
    throw error;
  }
}