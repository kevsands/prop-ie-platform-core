import { NextRequest, NextResponse } from 'next/server';
import { DeveloperDashboardData, DeveloperProject } from '@/types/dashboard';

// Mock data for development and testing
const MOCK_PROJECTS: DeveloperProject[] = [
  {
    id: '1',
    name: 'Ellwood',
    status: 'Active',
    completionPercentage: 65,
    location: 'Dublin, Ireland',
    propertyCount: 72,
    lastUpdated: '2023-11-30T15:30:00Z'
  },
  {
    id: '2',
    name: 'Fitzgerald Gardens',
    status: 'Planning',
    completionPercentage: 25,
    location: 'Dublin, Ireland',
    propertyCount: 48,
    lastUpdated: '2023-11-28T10:15:00Z'
  },
  {
    id: '3',
    name: 'Ballymakenny View',
    status: 'Construction',
    completionPercentage: 45,
    location: 'Drogheda, Louth',
    propertyCount: 60,
    lastUpdated: '2023-11-25T14:45:00Z'
  },
  {
    id: '4',
    name: 'Ellwood Bloom',
    status: 'Active',
    completionPercentage: 80,
    location: 'Galway, Ireland',
    propertyCount: 35,
    lastUpdated: '2023-12-01T09:30:00Z'
  }
];

// Mock dashboard data
const MOCK_DASHBOARD_DATA: DeveloperDashboardData = {
  activeProjects: 4,
  propertiesAvailable: 72, 
  totalSales: 12450000,
  projects: MOCK_PROJECTS,
  salesTrend: {
    period: 'month',
    percentage: 12.5,
    direction: 'up'
  },
  financialMetrics: [
    {
      key: 'revenue',
      label: 'Total Revenue',
      value: 12450000,
      formattedValue: '€12,450,000',
      change: 8.3,
      changeDirection: 'up'
    },
    {
      key: 'cost',
      label: 'Total Costs',
      value: 9120000,
      formattedValue: '€9,120,000',
      change: 5.2,
      changeDirection: 'up'
    },
    {
      key: 'profit',
      label: 'Profit',
      value: 3330000,
      formattedValue: '€3,330,000',
      change: 12.1,
      changeDirection: 'up'
    },
    {
      key: 'margin',
      label: 'Profit Margin',
      value: 0.267,
      formattedValue: '26.7%',
      change: 3.5,
      changeDirection: 'up'
    }
  ],
  projectProgress: [
    {
      id: '1',
      name: 'Ellwood',
      progress: 65,
      phase: 'Construction',
      endDate: '2024-06-30T00:00:00Z',
      status: 'on_track'
    },
    {
      id: '2',
      name: 'Fitzgerald Gardens',
      progress: 25,
      phase: 'Planning',
      endDate: '2025-03-15T00:00:00Z',
      status: 'delayed'
    },
    {
      id: '3',
      name: 'Ballymakenny View',
      progress: 45,
      phase: 'Foundation',
      endDate: '2024-11-20T00:00:00Z',
      status: 'on_track'
    }
  ],
  upcomingMilestones: [
    {
      id: 'm1',
      title: 'Planning Approval',
      projectId: '2',
      projectName: 'Fitzgerald Gardens',
      date: '2023-12-15T00:00:00Z',
      status: 'pending'
    },
    {
      id: 'm2',
      title: 'Foundation Completion',
      projectId: '3',
      projectName: 'Ballymakenny View',
      date: '2023-12-20T00:00:00Z',
      status: 'pending'
    },
    {
      id: 'm3',
      title: 'Sales Launch',
      projectId: '1',
      projectName: 'Ellwood',
      date: '2024-01-10T00:00:00Z',
      status: 'pending'
    },
    {
      id: 'm4',
      title: 'Phase 1 Completion',
      projectId: '1',
      projectName: 'Ellwood',
      date: '2024-02-28T00:00:00Z',
      status: 'pending'
    }
  ]
};

// Mock developments data
const MOCK_DEVELOPMENTS = [
  {
    id: '1',
    name: 'Ellwood',
    slug: 'ellwood',
    status: 'CONSTRUCTION',
    statusColor: 'blue-500',
    description: 'Luxury riverside apartments with stunning views and modern amenities.',
    shortDescription: 'Luxury riverside apartments with stunning views.',
    mainImage: '/images/ellwood/hero.jpg',
    images: [
      '/images/ellwood/1.jpg',
      '/images/ellwood/2.jpg',
      '/images/ellwood/3.jpg'
    ],
    sitePlanUrl: '/images/ellwood/site-plan.jpg',
    brochureUrl: '/brochures/Ellwood Brochure.pdf',
    totalUnits: 72,
    availableUnits: 18,
    features: [
      'Riverside views',
      'Floor-to-ceiling windows',
      'Modern kitchens',
      'Ensuite bathrooms',
      'Private balconies',
      'Secure parking'
    ],
    amenities: [
      'Fitness center',
      'Resident lounge',
      'Landscaped gardens',
      'Secure entry system',
      'Bike storage',
      'Electric car charging'
    ],
    bedrooms: [1, 2, 3],
    bathrooms: 2,
    squareFeet: 1200,
    energyRating: 'A2',
    availability: 'Move in Q3 2025',
    depositAmount: '€25,000',
    buildingType: 'Apartment',
    priceRange: '€320,000 - €550,000',
    location: {
      address: 'Riverside Road',
      addressLine1: 'Dublin 4',
      city: 'Dublin',
      county: 'Dublin',
      country: 'Ireland',
      eircode: 'D04 V1W8',
      longitude: -6.2297,
      latitude: 53.3498
    },
    timeline: {
      planningSubmissionDate: '2022-03-15',
      planningDecisionDate: '2022-06-10',
      constructionStartDate: '2022-09-01',
      constructionEndDate: '2025-07-31',
      marketingLaunchDate: '2023-02-15',
      salesLaunchDate: '2023-03-15'
    },
    salesStatus: {
      totalUnits: 72,
      availableUnits: 18,
      reservedUnits: 12,
      saleAgreedUnits: 8,
      soldUnits: 34,
      salesVelocity: 3.2,
      targetPriceAverage: 420000,
      actualPriceAverage: 435000,
      projectedSelloutDate: '2025-12-31'
    },
    developer: {
      id: 'dev-001',
      fullName: 'Prop Development Ltd',
      email: 'info@propdevelopment.ie',
      avatar: '/images/developers/prop-dev-logo.jpg',
      roles: ['DEVELOPER']
    },
    tags: ['Waterfront', 'Luxury', 'City Centre', 'Investment'],
    showingDates: [
      'Saturday, December 10th, 12-4pm',
      'Sunday, December 11th, 12-4pm',
      'Wednesday, December 14th, 5-8pm'
    ],
    units: [
      {
        id: 'unit-001',
        name: '1 Bed Apartment',
        type: 'Apartment',
        status: 'Available',
        price: 320000,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 650
      },
      {
        id: 'unit-002',
        name: '2 Bed Apartment',
        type: 'Apartment',
        status: 'Available',
        price: 410000,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 950
      },
      {
        id: 'unit-003',
        name: '3 Bed Penthouse',
        type: 'Penthouse',
        status: 'Reserved',
        price: 550000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1400
      }
    ],
    created: '2022-02-01T10:00:00Z',
    updated: '2023-11-10T14:30:00Z',
    publishedDate: '2023-02-15T09:00:00Z',
    isPublished: true
  },
  {
    id: '2',
    name: 'Fitzgerald Gardens',
    slug: 'fitzgerald-gardens',
    status: 'PLANNING',
    statusColor: 'yellow-500',
    description: 'Family-friendly houses and duplexes set in beautifully landscaped gardens in Dublin\'s commuter belt.',
    shortDescription: 'Family-friendly houses in Dublin\'s commuter belt.',
    mainImage: '/images/fitzgerald-gardens/hero.jpeg',
    images: [
      '/images/fitzgerald-gardens/1.jpg',
      '/images/fitzgerald-gardens/2.jpg',
      '/images/fitzgerald-gardens/3.jpg'
    ],
    sitePlanUrl: '/images/fitzgerald-gardens/site-plan.jpg',
    brochureUrl: '/brochures/FitzGerald Gardens Brochure.pdf',
    totalUnits: 48,
    availableUnits: 48,
    features: [
      'Spacious gardens',
      'Open plan living',
      'High-efficiency heating',
      'Solar panels',
      'Electric car charging points',
      'Smart home ready'
    ],
    amenities: [
      'Community park',
      'Children\'s playground',
      'Walking trails',
      'Close to schools',
      'Local shopping center',
      'Transport links'
    ],
    bedrooms: [2, 3, 4],
    bathrooms: 2.5,
    squareFeet: 1500,
    energyRating: 'A1',
    availability: 'Coming 2025',
    depositAmount: '€20,000',
    buildingType: 'House',
    priceRange: '€385,000 - €550,000',
    location: {
      address: 'Fitzgerald Road',
      addressLine1: 'Swords',
      city: 'Dublin',
      county: 'Dublin',
      country: 'Ireland',
      eircode: 'K67 D9F5',
      longitude: -6.2189,
      latitude: 53.4561
    },
    timeline: {
      planningSubmissionDate: '2023-01-20',
      planningDecisionDate: '2023-04-15',
      constructionStartDate: '2024-03-01',
      marketingLaunchDate: '2023-12-01'
    },
    salesStatus: {
      totalUnits: 48,
      availableUnits: 48,
      reservedUnits: 0,
      saleAgreedUnits: 0,
      soldUnits: 0,
      salesVelocity: 0,
      targetPriceAverage: 450000,
      actualPriceAverage: 0
    },
    developer: {
      id: 'dev-001',
      fullName: 'Prop Development Ltd',
      email: 'info@propdevelopment.ie',
      avatar: '/images/developers/prop-dev-logo.jpg',
      roles: ['DEVELOPER']
    },
    tags: ['Family', 'Commuter', 'Energy Efficient', 'Community'],
    showingDates: [],
    units: [
      {
        id: 'unit-101',
        name: '2 Bed Townhouse',
        type: 'Townhouse',
        status: 'Coming Soon',
        price: 385000,
        bedrooms: 2,
        bathrooms: 2.5,
        squareFeet: 1100
      },
      {
        id: 'unit-102',
        name: '3 Bed Semi-Detached',
        type: 'Semi-Detached',
        status: 'Coming Soon',
        price: 475000,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1500
      },
      {
        id: 'unit-103',
        name: '4 Bed Detached',
        type: 'Detached',
        status: 'Coming Soon',
        price: 550000,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 1900
      }
    ],
    created: '2022-11-10T10:00:00Z',
    updated: '2023-10-05T11:20:00Z',
    isPublished: true,
    publishedDate: '2023-11-01T12:00:00Z'
  },
  {
    id: '3',
    name: 'Ballymakenny View',
    slug: 'ballymakenny-view',
    status: 'CONSTRUCTION',
    statusColor: 'blue-500',
    description: 'Stunning modern homes with exceptional finishes in a prime Drogheda location, offering excellent value and modern living.',
    shortDescription: 'Modern homes in a prime Drogheda location.',
    mainImage: '/images/ballymakenny-view/hero.jpg',
    images: [
      '/images/ballymakenny-view/1.jpg',
      '/images/ballymakenny-view/2.jpg',
      '/images/ballymakenny-view/3.jpg',
      '/images/ballymakenny-view/4.jpg'
    ],
    sitePlanUrl: '/images/ballymakenny-view/BMV Site Plan.png',
    brochureUrl: '/brochures/Ballymakenny View Brochure.pdf',
    totalUnits: 60,
    availableUnits: 25,
    features: [
      'High specification finish',
      'Modern kitchens',
      'Luxury bathrooms',
      'Landscaped front gardens',
      'Parking for two cars',
      'A-rated energy efficiency'
    ],
    amenities: [
      'Local schools nearby',
      'Shopping centers within 10 minutes',
      'Parks and recreation',
      'Public transport links',
      'Easy M1 motorway access',
      'Dublin Airport - 30 mins'
    ],
    bedrooms: [3, 4],
    bathrooms: 3,
    squareFeet: 1650,
    energyRating: 'A3',
    availability: 'Phase 2 now available',
    depositAmount: '€15,000',
    buildingType: 'House',
    priceRange: '€360,000 - €445,000',
    location: {
      address: 'Ballymakenny Road',
      addressLine1: 'Drogheda',
      city: 'Drogheda',
      county: 'Louth',
      country: 'Ireland',
      eircode: 'A92 XP63',
      longitude: -6.3351,
      latitude: 53.7101
    },
    timeline: {
      planningSubmissionDate: '2022-05-10',
      planningDecisionDate: '2022-08-15',
      constructionStartDate: '2022-11-01',
      constructionEndDate: '2024-12-30',
      marketingLaunchDate: '2023-01-15',
      salesLaunchDate: '2023-02-15'
    },
    salesStatus: {
      totalUnits: 60,
      availableUnits: 25,
      reservedUnits: 8,
      saleAgreedUnits: 7,
      soldUnits: 20,
      salesVelocity: 2.5,
      targetPriceAverage: 395000,
      actualPriceAverage: 410000,
      projectedSelloutDate: '2024-10-30'
    },
    developer: {
      id: 'dev-002',
      fullName: 'Louth Developments Ltd',
      email: 'info@louthdevelopments.ie',
      avatar: '/images/developers/louth-dev-logo.jpg',
      roles: ['DEVELOPER']
    },
    tags: ['Family', 'Commuter', 'A-Rated', 'Value'],
    showingDates: [
      'Saturday, December 3rd, 2-4pm',
      'Sunday, December 4th, 2-4pm'
    ],
    units: [
      {
        id: 'unit-201',
        name: 'House Type A - 3 Bed Semi-Detached',
        type: 'Semi-Detached',
        status: 'Available',
        price: 360000,
        bedrooms: 3,
        bathrooms: 3,
        squareFeet: 1450
      },
      {
        id: 'unit-202',
        name: 'House Type B - 4 Bed Detached',
        type: 'Detached',
        status: 'Available',
        price: 445000,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 1850
      }
    ],
    created: '2022-04-01T09:30:00Z',
    updated: '2023-11-15T16:45:00Z',
    publishedDate: '2023-01-15T10:00:00Z',
    isPublished: true
  },
  {
    id: '4',
    name: 'Ellwood Bloom',
    slug: 'ellwood-bloom',
    status: 'SALES',
    statusColor: 'green-500',
    description: 'Boutique development of luxury townhouses and apartments set in landscaped grounds in Galway city.',
    shortDescription: 'Boutique luxury townhouses in Galway city.',
    mainImage: '/images/developments/Ellwood-Logos/hero.jpg',
    images: [
      '/images/developments/Ellwood-Logos/EllwoodBloom-1.jpeg',
      '/images/developments/Ellwood-Logos/EllwoodBloom-2.jpeg',
      '/images/developments/Ellwood-Logos/EllwoodBloom-3.jpeg',
      '/images/developments/Ellwood-Logos/EllwoodBloom-4.jpeg'
    ],
    totalUnits: 35,
    availableUnits: 8,
    features: [
      'Designer kitchens',
      'Luxury bathrooms',
      'Hardwood flooring',
      'Triple glazing',
      'Home office space',
      'Private gardens/balconies'
    ],
    amenities: [
      'Central location',
      'Riverside walks',
      'City center 10 min walk',
      'Secure parking',
      'Bicycle storage',
      'Electric car charging'
    ],
    bedrooms: [2, 3],
    bathrooms: 2,
    squareFeet: 1100,
    energyRating: 'A2',
    availability: 'Final phase now selling',
    depositAmount: '€20,000',
    buildingType: 'Mixed',
    priceRange: '€345,000 - €495,000',
    location: {
      address: 'Ellwood Road',
      addressLine1: 'Galway City',
      city: 'Galway',
      county: 'Galway',
      country: 'Ireland',
      eircode: 'H91 YD34',
      longitude: -9.0568,
      latitude: 53.2707
    },
    timeline: {
      planningSubmissionDate: '2021-03-10',
      planningDecisionDate: '2021-06-15',
      constructionStartDate: '2021-09-01',
      constructionEndDate: '2023-05-30',
      marketingLaunchDate: '2022-02-15',
      salesLaunchDate: '2022-03-01'
    },
    salesStatus: {
      totalUnits: 35,
      availableUnits: 8,
      reservedUnits: 3,
      saleAgreedUnits: 4,
      soldUnits: 20,
      salesVelocity: 1.8,
      targetPriceAverage: 410000,
      actualPriceAverage: 425000,
      projectedSelloutDate: '2024-03-30'
    },
    developer: {
      id: 'dev-003',
      fullName: 'Western Homes Ltd',
      email: 'info@westernhomes.ie',
      avatar: '/images/developers/western-homes-logo.jpg',
      roles: ['DEVELOPER']
    },
    tags: ['Luxury', 'City', 'Boutique', 'Riverside'],
    showingDates: [
      'By appointment only',
      'Virtual tours available'
    ],
    units: [
      {
        id: 'unit-301',
        name: '2 Bed Townhouse',
        type: 'Townhouse',
        status: 'Available',
        price: 345000,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 950
      },
      {
        id: 'unit-302',
        name: '3 Bed Townhouse',
        type: 'Townhouse',
        status: 'Available',
        price: 425000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1250
      },
      {
        id: 'unit-303',
        name: '3 Bed Duplex',
        type: 'Duplex',
        status: 'Reserved',
        price: 495000,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1450
      }
    ],
    created: '2021-02-10T08:00:00Z',
    updated: '2023-10-20T13:15:00Z',
    publishedDate: '2022-02-15T09:30:00Z',
    isPublished: true
  }
];

// Additional mock dashboard data for specific routes
const MOCK_DASHBOARD_DATA_SIMPLE: DeveloperDashboardData = {
  activeProjects: 3,
  propertiesAvailable: 123,
  totalSales: 3750000,
  projects: MOCK_PROJECTS,
  salesTrend: {
    period: 'month',
    percentage: 5.2,
    direction: 'up'
  }
};

/**
 * Handle GraphQL requests
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables } = body;

    // Development queries
    if (query.includes('GetDevelopment') || query.includes('development(id:')) {
      const id = variables?.id;
      const development = MOCK_DEVELOPMENTS.find(dev => dev.id === id);
      
      if (development) {
        return NextResponse.json({
          data: {
            development
          }
        });
      } else {
        return NextResponse.json({
          errors: [{ message: `Development with ID ${id} not found` }]
        }, { status: 404 });
      }
    }
    
    if (query.includes('GetDevelopmentBySlug') || query.includes('developmentBySlug(slug:')) {
      const slug = variables?.slug;
      const development = MOCK_DEVELOPMENTS.find(dev => dev.slug === slug);
      
      if (development) {
        return NextResponse.json({
          data: {
            developmentBySlug: development
          }
        });
      } else {
        return NextResponse.json({
          errors: [{ message: `Development with slug ${slug} not found` }]
        }, { status: 404 });
      }
    }
    
    if (query.includes('GetDevelopments') || query.includes('developments(')) {
      const filter = variables?.filter || {};
      const pagination = variables?.pagination || {};
      
      // Apply basic filtering - would be more complex in a real implementation
      let filteredDevelopments = [...MOCK_DEVELOPMENTS];
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredDevelopments = filteredDevelopments.filter(dev => 
          dev.name.toLowerCase().includes(searchLower) || 
          dev.description.toLowerCase().includes(searchLower) ||
          (dev.location.city && dev.location.city.toLowerCase().includes(searchLower)) ||
          (dev.location.county && dev.location.county.toLowerCase().includes(searchLower))
        );
      }
      
      if (filter.status && filter.status.length > 0) {
        filteredDevelopments = filteredDevelopments.filter(dev => 
          filter.status.includes(dev.status)
        );
      }
      
      // Apply pagination
      const limit = pagination.first || 10;
      
      // Create response with proper format
      const slicedDevelopments = filteredDevelopments.slice(0, limit);
      const response = {
        developments: slicedDevelopments,
        totalCount: filteredDevelopments.length,
        pageInfo: {
          hasNextPage: filteredDevelopments.length > limit,
          hasPreviousPage: false,
          startCursor: slicedDevelopments.length > 0 ? slicedDevelopments[0].id : null,
          endCursor: slicedDevelopments.length > 0 ? slicedDevelopments[slicedDevelopments.length - 1].id : null
        }
      };
      
      return NextResponse.json({
        data: {
          developments: response
        }
      });
    }
    
    if (query.includes('GetMyDevelopments') || query.includes('myDevelopments(')) {
      // In a real implementation, this would filter based on the authenticated user
      // For mock purposes, we'll return the same data as GetDevelopments
      const filter = variables?.filter || {};
      const pagination = variables?.pagination || {};
      
      // Apply basic filtering
      const filteredDevelopments = [...MOCK_DEVELOPMENTS];
      
      // Apply pagination
      const limit = pagination.first || 10;
      
      // Create response with proper format
      const slicedDevelopments = filteredDevelopments.slice(0, limit);
      const response = {
        developments: slicedDevelopments,
        totalCount: filteredDevelopments.length,
        pageInfo: {
          hasNextPage: filteredDevelopments.length > limit,
          hasPreviousPage: false,
          startCursor: slicedDevelopments.length > 0 ? slicedDevelopments[0].id : null,
          endCursor: slicedDevelopments.length > 0 ? slicedDevelopments[slicedDevelopments.length - 1].id : null
        }
      };
      
      return NextResponse.json({
        data: {
          myDevelopments: response
        }
      });
    }
    
    if (query.includes('developmentStatistics')) {
      const id = variables?.id;
      const development = MOCK_DEVELOPMENTS.find(dev => dev.id === id);
      
      if (development) {
        // Mock statistics for the development
        const stats = {
          salesVelocity: development.salesStatus.salesVelocity,
          viewingsPerWeek: 12,
          websiteVisits: 456,
          inquiriesLastMonth: 28,
          pricePerSquareFoot: Math.round(development.salesStatus.actualPriceAverage / development.squareFeet),
          popularUnitTypes: development.units.slice(0, 2).map(u => u.type),
          projectedCompletionDate: development.timeline.constructionEndDate,
          reservationConversionRate: 65,
          similarDevelopmentsPricing: [{
            name: "Nearby Development 1",
            pricePerSqFt: Math.round(development.salesStatus.actualPriceAverage / development.squareFeet) * 0.95
          }, {
            name: "Nearby Development 2",
            pricePerSqFt: Math.round(development.salesStatus.actualPriceAverage / development.squareFeet) * 1.05
          }]
        };
        
        return NextResponse.json({
          data: {
            developmentStatistics: stats
          }
        });
      } else {
        return NextResponse.json({
          errors: [{ message: `Development with ID ${id} not found` }]
        }, { status: 404 });
      }
    }

    // Dashboard queries
    if (query.includes('developerDashboard') || query.includes('GetDeveloperDashboard')) {
      // Use the full dashboard data for the developer dashboard
      return NextResponse.json({
        data: {
          developerDashboard: MOCK_DASHBOARD_DATA
        }
      });
    }

    if (query.includes('recentProjects') || query.includes('GetRecentProjects')) {
      const limit = variables?.limit || 5;
      return NextResponse.json({
        data: {
          recentProjects: MOCK_PROJECTS.slice(0, limit)
        }
      });
    }

    if (query.includes('financialDashboard') || query.includes('GetFinancialDashboard')) {
      return NextResponse.json({
        data: {
          financialDashboard: {
            totalSales: 3750000,
            totalRevenue: 12400000,
            projectedRevenue: 18500000,
            monthlySales: [
              { month: 'Jan', sales: 2, revenue: 650000 },
              { month: 'Feb', sales: 5, revenue: 1250000 },
              { month: 'Mar', sales: 7, revenue: 1750000 },
              { month: 'Apr', sales: 4, revenue: 1000000 },
              { month: 'May', sales: 9, revenue: 2250000 },
              { month: 'Jun', sales: 11, revenue: 2750000 },
              { month: 'Jul', sales: 13, revenue: 3250000 }
            ]
          }
        }
      });
    }

    // Default response for unknown queries
    return NextResponse.json({
      errors: [{ message: 'Query not supported' }]
    }, { status: 400 });
  } catch (error) {
    console.error('GraphQL error:', error);
    return NextResponse.json({
      errors: [{ message: 'Internal server error' }]
    }, { status: 500 });
  }
}

/**
 * Handle GraphQL GET requests (typically for introspection)
 */
export async function GET() {
  return NextResponse.json({
    data: {
      __schema: {
        queryType: {
          name: 'Query'
        },
        types: []
      }
    }
  });
}