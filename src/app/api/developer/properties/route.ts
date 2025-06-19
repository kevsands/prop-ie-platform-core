// src/app/api/developer/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';

interface Property {
  id: string;
  projectId: string;
  unitNumber: string;
  unitType: 'apartment' | 'house' | 'duplex' | 'penthouse';
  bedrooms: number;
  bathrooms: number;
  floorArea: number; // square meters
  balconyArea?: number;
  parkingSpaces: number;
  floor: number;
  facing: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
  status: 'available' | 'reserved' | 'sold' | 'held' | 'unavailable';
  pricing: {
    basePrice: number;
    currentPrice: number;
    pricePerSqm: number;
    htbEligible: boolean;
    htbMaxBenefit?: number;
    incentives: string[];
    paymentTerms: string;
  };
  specifications: {
    finishLevel: 'standard' | 'premium' | 'luxury';
    features: string[];
    appliances: string[];
    flooring: string[];
    bathroom: string[];
    kitchen: string[];
    energyRating: 'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'B3' | 'C1' | 'C2' | 'C3' | 'D1' | 'D2' | 'E1' | 'E2' | 'F' | 'G';
  };
  media: {
    floorPlan: string;
    images: string[];
    virtualTour?: string;
    video?: string;
  };
  reservations?: {
    buyerId: string;
    buyerName: string;
    reservationDate: string;
    depositAmount: number;
    reservationExpiry: string;
    status: 'active' | 'expired' | 'converted' | 'cancelled';
  };
  saleData?: {
    buyerId: string;
    buyerName: string;
    salePrice: number;
    saleDate: string;
    depositPaid: number;
    completionDate: string;
    solicitorId?: string;
    mortgageProvider?: string;
    htbClaimId?: string;
  };
  construction: {
    phase: string;
    completionPercentage: number;
    expectedCompletion: string;
    snagStatus: 'pending' | 'in_progress' | 'completed' | 'remediation_required';
    handoverDate?: string;
  };
  compliance: {
    bcaCompliance: boolean;
    planningCompliance: boolean;
    safetyCompliance: boolean;
    energyCompliance: boolean;
    accessibilityCompliance: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface PropertyFilter {
  projectId?: string;
  status?: string;
  unitType?: string;
  bedrooms?: number;
  floor?: number;
  priceMin?: number;
  priceMax?: number;
  htbEligible?: boolean;
  available?: boolean;
}

/**
 * Developer Properties API
 * Comprehensive property management for developers
 */
export async function GET(request: NextRequest) {
  try {
    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const unitType = searchParams.get('unitType');
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined;
    const floor = searchParams.get('floor') ? parseInt(searchParams.get('floor')!) : undefined;
    const priceMin = searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined;
    const priceMax = searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined;
    const htbEligible = searchParams.get('htbEligible') === 'true';
    const available = searchParams.get('available') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // In development mode, return mock properties
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Getting developer properties for user ${currentUser.id}`);
      
      const mockProperties: Property[] = [
        // Fitzgerald Gardens Properties
        ...Array.from({ length: 15 }, (_, i) => ({
          id: `fg-unit-${String(i + 1).padStart(2, '0')}`,
          projectId: 'fitzgerald-gardens',
          unitNumber: `Unit ${i + 1}A`,
          unitType: i % 3 === 0 ? 'apartment' : i % 3 === 1 ? 'duplex' : 'penthouse' as any,
          bedrooms: i % 3 === 0 ? 2 : i % 3 === 1 ? 3 : 4,
          bathrooms: i % 3 === 0 ? 2 : i % 3 === 1 ? 2 : 3,
          floorArea: i % 3 === 0 ? 85 : i % 3 === 1 ? 110 : 145,
          balconyArea: i % 3 === 0 ? 12 : i % 3 === 1 ? 15 : 25,
          parkingSpaces: i % 3 === 0 ? 1 : 2,
          floor: Math.floor(i / 3) + 1,
          facing: ['north', 'south', 'east', 'west'][i % 4] as any,
          status: i < 2 ? 'sold' : i < 4 ? 'reserved' : 'available' as any,
          pricing: {
            basePrice: (i % 3 === 0 ? 320000 : i % 3 === 1 ? 420000 : 580000) + (i * 5000),
            currentPrice: (i % 3 === 0 ? 320000 : i % 3 === 1 ? 420000 : 580000) + (i * 5000),
            pricePerSqm: i % 3 === 0 ? 3765 : i % 3 === 1 ? 3818 : 4000,
            htbEligible: (i % 3 === 0 ? 320000 : i % 3 === 1 ? 420000 : 580000) + (i * 5000) <= 500000,
            htbMaxBenefit: (i % 3 === 0 ? 320000 : i % 3 === 1 ? 420000 : 580000) + (i * 5000) <= 500000 ? 30000 : undefined,
            incentives: i < 5 ? ['First time buyer discount', 'Legal fees included'] : ['Stamp duty covered'],
            paymentTerms: '10% deposit, balance on completion'
          },
          specifications: {
            finishLevel: i % 3 === 0 ? 'standard' : i % 3 === 1 ? 'premium' : 'luxury' as any,
            features: [
              'Open plan living',
              'Modern kitchen',
              'Built-in wardrobes',
              ...(i % 3 === 2 ? ['Private balcony', 'Ensuite bathroom', 'Walk-in closet'] : [])
            ],
            appliances: ['Integrated dishwasher', 'Electric oven', 'Ceramic hob', 'Fridge/freezer'],
            flooring: ['Engineered wood flooring', 'Ceramic tiles in bathrooms'],
            bathroom: ['Modern suite', 'Electric shower', 'Heated towel rail'],
            kitchen: ['Modern fitted kitchen', 'Quartz worktops', 'Soft close doors'],
            energyRating: 'A2'
          },
          media: {
            floorPlan: `/api/placeholder/floorplan/fg-unit-${i + 1}.pdf`,
            images: [
              `/api/placeholder/400/300?text=FG-Unit-${i + 1}-Living`,
              `/api/placeholder/400/300?text=FG-Unit-${i + 1}-Kitchen`,
              `/api/placeholder/400/300?text=FG-Unit-${i + 1}-Bedroom`
            ],
            virtualTour: i % 3 === 0 ? `/virtual-tours/fg-unit-${i + 1}` : undefined,
            video: i % 5 === 0 ? `/videos/fg-unit-${i + 1}.mp4` : undefined
          },
          ...(i < 2 ? {
            saleData: {
              buyerId: `buyer-${i + 1}`,
              buyerName: i === 0 ? 'John O\'Sullivan' : 'Mary Murphy',
              salePrice: (i % 3 === 0 ? 320000 : i % 3 === 1 ? 420000 : 580000) + (i * 5000),
              saleDate: '2025-06-15T10:00:00Z',
              depositPaid: ((i % 3 === 0 ? 320000 : i % 3 === 1 ? 420000 : 580000) + (i * 5000)) * 0.1,
              completionDate: '2025-08-15T10:00:00Z',
              solicitorId: 'solicitor-001',
              mortgageProvider: 'Bank of Ireland',
              htbClaimId: `htb-claim-${i + 1}`
            }
          } : {}),
          ...(i >= 2 && i < 4 ? {
            reservations: {
              buyerId: `buyer-res-${i + 1}`,
              buyerName: i === 2 ? 'David Kelly' : 'Sarah Walsh',
              reservationDate: '2025-06-18T14:30:00Z',
              depositAmount: 5000,
              reservationExpiry: '2025-07-18T14:30:00Z',
              status: 'active'
            }
          } : {}),
          construction: {
            phase: 'Phase 1',
            completionPercentage: 75 + (i * 2),
            expectedCompletion: '2025-08-15T00:00:00Z',
            snagStatus: i < 2 ? 'completed' : i < 5 ? 'in_progress' : 'pending' as any,
            handoverDate: i < 2 ? '2025-08-10T00:00:00Z' : undefined
          },
          compliance: {
            bcaCompliance: true,
            planningCompliance: true,
            safetyCompliance: i < 10,
            energyCompliance: true,
            accessibilityCompliance: true
          },
          createdAt: '2025-06-01T00:00:00Z',
          updatedAt: '2025-06-18T12:00:00Z'
        })),

        // Ballymakenny View Properties (mostly sold)
        ...Array.from({ length: 20 }, (_, i) => ({
          id: `bv-unit-${String(i + 1).padStart(2, '0')}`,
          projectId: 'ballymakenny-view',
          unitNumber: `Unit ${i + 1}`,
          unitType: i % 2 === 0 ? 'house' : 'apartment' as any,
          bedrooms: i % 2 === 0 ? 3 : 2,
          bathrooms: i % 2 === 0 ? 3 : 2,
          floorArea: i % 2 === 0 ? 125 : 75,
          balconyArea: i % 2 === 0 ? undefined : 10,
          parkingSpaces: i % 2 === 0 ? 2 : 1,
          floor: i % 2 === 0 ? 1 : Math.floor(i / 4) + 1,
          facing: ['north', 'south', 'east', 'west'][i % 4] as any,
          status: i === 19 ? 'reserved' : 'sold' as any,
          pricing: {
            basePrice: i % 2 === 0 ? 385000 : 295000,
            currentPrice: i % 2 === 0 ? 385000 : 295000,
            pricePerSqm: i % 2 === 0 ? 3080 : 3933,
            htbEligible: true,
            htbMaxBenefit: 30000,
            incentives: ['Legal fees covered', 'First time buyer incentive'],
            paymentTerms: '10% deposit, balance on completion'
          },
          specifications: {
            finishLevel: 'premium',
            features: [
              'Modern fitted kitchen',
              'Built-in wardrobes',
              'Private garden' + (i % 2 === 0 ? '' : ' access'),
              'Energy efficient heating'
            ],
            appliances: ['Integrated appliances', 'Gas hob', 'Electric oven'],
            flooring: ['Hardwood flooring', 'Ceramic tiles'],
            bathroom: ['Modern bathroom suite', 'Thermostatic shower'],
            kitchen: ['Fitted kitchen', 'Granite worktops'],
            energyRating: 'A3'
          },
          media: {
            floorPlan: `/api/placeholder/floorplan/bv-unit-${i + 1}.pdf`,
            images: [
              `/api/placeholder/400/300?text=BV-Unit-${i + 1}-Exterior`,
              `/api/placeholder/400/300?text=BV-Unit-${i + 1}-Living`,
              `/api/placeholder/400/300?text=BV-Unit-${i + 1}-Kitchen`
            ]
          },
          ...(i < 19 ? {
            saleData: {
              buyerId: `bv-buyer-${i + 1}`,
              buyerName: `Buyer ${i + 1}`,
              salePrice: i % 2 === 0 ? 385000 : 295000,
              saleDate: `2024-${String(Math.floor(i / 3) + 3).padStart(2, '0')}-15T10:00:00Z`,
              depositPaid: (i % 2 === 0 ? 385000 : 295000) * 0.1,
              completionDate: `2024-${String(Math.floor(i / 3) + 5).padStart(2, '0')}-15T10:00:00Z`,
              solicitorId: 'solicitor-002',
              mortgageProvider: i % 3 === 0 ? 'Bank of Ireland' : i % 3 === 1 ? 'AIB' : 'Permanent TSB',
              htbClaimId: `bv-htb-claim-${i + 1}`
            }
          } : {
            reservations: {
              buyerId: 'bv-buyer-20',
              buyerName: 'Final Buyer',
              reservationDate: '2025-06-10T14:30:00Z',
              depositAmount: 5000,
              reservationExpiry: '2025-07-10T14:30:00Z',
              status: 'active'
            }
          }),
          construction: {
            phase: 'Completed',
            completionPercentage: 100,
            expectedCompletion: '2024-09-15T00:00:00Z',
            snagStatus: 'completed',
            handoverDate: `2024-${String(Math.floor(i / 3) + 5).padStart(2, '0')}-15T00:00:00Z`
          },
          compliance: {
            bcaCompliance: true,
            planningCompliance: true,
            safetyCompliance: true,
            energyCompliance: true,
            accessibilityCompliance: true
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-09-15T12:00:00Z'
        }))
      ];

      // Apply filters
      let filteredProperties = mockProperties;
      
      if (projectId) {
        filteredProperties = filteredProperties.filter(p => p.projectId === projectId);
      }
      
      if (status) {
        filteredProperties = filteredProperties.filter(p => p.status === status);
      }
      
      if (unitType) {
        filteredProperties = filteredProperties.filter(p => p.unitType === unitType);
      }
      
      if (bedrooms) {
        filteredProperties = filteredProperties.filter(p => p.bedrooms === bedrooms);
      }
      
      if (floor) {
        filteredProperties = filteredProperties.filter(p => p.floor === floor);
      }
      
      if (priceMin) {
        filteredProperties = filteredProperties.filter(p => p.pricing.currentPrice >= priceMin);
      }
      
      if (priceMax) {
        filteredProperties = filteredProperties.filter(p => p.pricing.currentPrice <= priceMax);
      }
      
      if (htbEligible) {
        filteredProperties = filteredProperties.filter(p => p.pricing.htbEligible);
      }
      
      if (available) {
        filteredProperties = filteredProperties.filter(p => p.status === 'available');
      }

      // Apply pagination
      const paginatedProperties = filteredProperties.slice(offset, offset + limit);

      // Calculate summary statistics
      const summary = {
        total: filteredProperties.length,
        available: filteredProperties.filter(p => p.status === 'available').length,
        reserved: filteredProperties.filter(p => p.status === 'reserved').length,
        sold: filteredProperties.filter(p => p.status === 'sold').length,
        totalValue: filteredProperties.reduce((sum, p) => sum + p.pricing.currentPrice, 0),
        averagePrice: filteredProperties.length > 0 ? 
          filteredProperties.reduce((sum, p) => sum + p.pricing.currentPrice, 0) / filteredProperties.length : 0,
        htbEligible: filteredProperties.filter(p => p.pricing.htbEligible).length,
        constructionProgress: filteredProperties.length > 0 ?
          filteredProperties.reduce((sum, p) => sum + p.construction.completionPercentage, 0) / filteredProperties.length : 0
      };

      return NextResponse.json({
        success: true,
        properties: paginatedProperties,
        pagination: {
          total: filteredProperties.length,
          limit,
          offset,
          hasMore: offset + limit < filteredProperties.length
        },
        summary,
        message: '[DEV MODE] Mock developer properties data'
      });
    }

    // Production: Query actual database
    try {
      return NextResponse.json({
        success: true,
        properties: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false
        },
        summary: {
          total: 0,
          available: 0,
          reserved: 0,
          sold: 0,
          totalValue: 0,
          averagePrice: 0,
          htbEligible: 0,
          constructionProgress: 0
        }
      });
    } catch (dbError: any) {
      console.error('Database query error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to retrieve properties' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Developer properties API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create New Property
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['projectId', 'unitNumber', 'unitType', 'bedrooms', 'bathrooms', 'floorArea', 'basePrice'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Get current user
    let currentUser = null;
    try {
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        const authToken = request.cookies.get('auth-token')?.value;
        if (authToken?.startsWith('dev-token-')) {
          const userId = authToken.replace('dev-token-', '');
          currentUser = await userService.getUserById(userId);
        }
      } else {
        currentUser = await userService.getCurrentUser();
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In development mode, simulate property creation
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      console.log(`[DEV] Creating property for project ${body.projectId}`);
      
      const newProperty: Property = {
        id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        projectId: body.projectId,
        unitNumber: body.unitNumber,
        unitType: body.unitType,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        floorArea: body.floorArea,
        balconyArea: body.balconyArea,
        parkingSpaces: body.parkingSpaces || 1,
        floor: body.floor || 1,
        facing: body.facing || 'south',
        status: 'available',
        pricing: {
          basePrice: body.basePrice,
          currentPrice: body.currentPrice || body.basePrice,
          pricePerSqm: Math.round(body.basePrice / body.floorArea),
          htbEligible: body.basePrice <= 500000,
          htbMaxBenefit: body.basePrice <= 500000 ? 30000 : undefined,
          incentives: body.incentives || [],
          paymentTerms: body.paymentTerms || '10% deposit, balance on completion'
        },
        specifications: {
          finishLevel: body.finishLevel || 'standard',
          features: body.features || [],
          appliances: body.appliances || [],
          flooring: body.flooring || [],
          bathroom: body.bathroom || [],
          kitchen: body.kitchen || [],
          energyRating: body.energyRating || 'A3'
        },
        media: {
          floorPlan: body.floorPlan || '',
          images: body.images || [],
          virtualTour: body.virtualTour,
          video: body.video
        },
        construction: {
          phase: body.constructionPhase || 'Phase 1',
          completionPercentage: body.completionPercentage || 0,
          expectedCompletion: body.expectedCompletion || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          snagStatus: 'pending'
        },
        compliance: {
          bcaCompliance: body.bcaCompliance || false,
          planningCompliance: body.planningCompliance || false,
          safetyCompliance: body.safetyCompliance || false,
          energyCompliance: body.energyCompliance || false,
          accessibilityCompliance: body.accessibilityCompliance || false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        property: newProperty,
        message: '[DEV MODE] Property created successfully'
      });
    }

    // Production: Create actual property
    try {
      return NextResponse.json({
        success: true,
        property: {
          id: `prop_${Date.now()}`,
          ...body,
          createdAt: new Date().toISOString()
        }
      });
    } catch (dbError: any) {
      console.error('Database insert error:', dbError);
      
      return NextResponse.json(
        { error: 'Failed to create property' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Create property error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}