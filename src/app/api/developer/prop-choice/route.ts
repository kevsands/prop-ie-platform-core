import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/security/auditLogger';
import { z } from 'zod';

/**
 * Enterprise PROP Choice Management API
 * Handles developer-side customization package and order management
 * Part of the comprehensive off-plan purchase workflow
 */

// Validation schemas
const PropChoicePackageSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum(['kitchen', 'bathroom', 'flooring', 'lighting', 'appliances', 'finishes']),
  basePrice: z.number().min(0),
  supplierCode: z.string().min(1),
  leadTimeWeeks: z.number().min(1).max(52),
  availability: z.enum(['available', 'limited', 'custom_order', 'discontinued']),
  compatibility: z.array(z.string()), // Unit types this package works with
  images: z.array(z.string().url()).optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  installationRequirements: z.string().optional()
});

const PropChoiceOrderSchema = z.object({
  buyerId: z.string(),
  unitId: z.string(),
  projectId: z.string(),
  packages: z.array(z.object({
    packageId: z.string(),
    quantity: z.number().min(1),
    customizations: z.record(z.string(), z.any()).optional()
  })),
  totalValue: z.number().min(0),
  installationPhase: z.enum(['pre_construction', 'construction', 'pre_completion']),
  requestedCompletionDate: z.string().optional(),
  specialInstructions: z.string().optional()
});

// GET /api/developer/prop-choice - Get all packages and orders for developer
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const category = searchParams.get('category');
    const availability = searchParams.get('availability');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Validate developer access
    const developerId = session.user.email;
    
    // Log the API request
    logger.info('PROP Choice data requested', {
      developerId,
      projectId,
      category,
      availability,
      page,
      limit,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // In production, this would query the database
    // For now, return comprehensive mock data for enterprise demo
    const mockPackages = [
      {
        id: 'pkg_001',
        name: 'Premium Kitchen Package',
        description: 'High-end kitchen with quartz countertops, soft-close cabinets, and premium appliances',
        category: 'kitchen',
        basePrice: 15000,
        supplierCode: 'KIT_PREM_001',
        leadTimeWeeks: 8,
        availability: 'available',
        compatibility: ['1bed', '2bed', '3bed'],
        images: ['/images/kitchen-premium-1.jpg', '/images/kitchen-premium-2.jpg'],
        specifications: {
          countertop: 'Quartz - Calacatta Gold',
          cabinets: 'Soft-close shaker style',
          appliances: 'Bosch Series 8',
          backsplash: 'Subway tile',
          sink: 'Undermount stainless steel'
        },
        installationRequirements: 'Requires electrical upgrade for induction hob',
        totalOrders: 23,
        monthlyRevenue: 345000,
        averageRating: 4.8
      },
      {
        id: 'pkg_002',
        name: 'Luxury Bathroom Suite',
        description: 'Spa-inspired bathroom with rainfall shower, freestanding bath, and heated floors',
        category: 'bathroom',
        basePrice: 8500,
        supplierCode: 'BATH_LUX_001',
        leadTimeWeeks: 6,
        availability: 'available',
        compatibility: ['2bed', '3bed', 'penthouse'],
        images: ['/images/bathroom-luxury-1.jpg', '/images/bathroom-luxury-2.jpg'],
        specifications: {
          shower: 'Rainfall shower with body jets',
          bath: 'Freestanding stone resin',
          flooring: 'Heated natural stone',
          vanity: 'Wall-mounted with LED lighting',
          fixtures: 'Brushed brass finish'
        },
        installationRequirements: 'Requires underfloor heating installation',
        totalOrders: 18,
        monthlyRevenue: 153000,
        averageRating: 4.9
      },
      {
        id: 'pkg_003',
        name: 'Smart Home Technology',
        description: 'Comprehensive smart home system with automated lighting, climate, and security',
        category: 'lighting',
        basePrice: 5200,
        supplierCode: 'SMART_001',
        leadTimeWeeks: 4,
        availability: 'available',
        compatibility: ['1bed', '2bed', '3bed', 'penthouse'],
        images: ['/images/smart-home-1.jpg', '/images/smart-home-2.jpg'],
        specifications: {
          lighting: 'Philips Hue throughout',
          thermostat: 'Nest Learning Thermostat',
          security: 'Ring doorbell and cameras',
          audio: 'Sonos multi-room system',
          control: 'iPad wall-mounted hubs'
        },
        installationRequirements: 'Requires Cat6 cabling throughout unit',
        totalOrders: 31,
        monthlyRevenue: 161200,
        averageRating: 4.7
      }
    ];

    const mockOrders = [
      {
        id: 'order_001',
        buyerId: 'buyer_sarah_oconnor',
        buyerName: 'Sarah O\'Connor',
        unitId: 'unit_fg_2b_15',
        unitName: 'Apartment 15, Block A',
        projectId: 'proj_fitzgerald_gardens',
        projectName: 'Fitzgerald Gardens',
        packages: [
          {
            packageId: 'pkg_001',
            packageName: 'Premium Kitchen Package',
            quantity: 1,
            unitPrice: 15000,
            customizations: {
              countertop: 'Quartz - Nero Marquina',
              cabinet_color: 'Charcoal Grey'
            }
          },
          {
            packageId: 'pkg_003',
            packageName: 'Smart Home Technology',
            quantity: 1,
            unitPrice: 5200,
            customizations: {}
          }
        ],
        totalValue: 20200,
        status: 'confirmed',
        installationPhase: 'construction',
        requestedCompletionDate: '2025-10-15',
        orderDate: '2025-03-15',
        estimatedInstallation: '2025-09-30',
        specialInstructions: 'Install smart home hub in master bedroom',
        paymentStatus: 'paid',
        installationStatus: 'scheduled'
      },
      {
        id: 'order_002',
        buyerId: 'buyer_james_murphy',
        buyerName: 'James Murphy',
        unitId: 'unit_fg_3b_08',
        unitName: 'Penthouse 08, Block B',
        projectId: 'proj_fitzgerald_gardens',
        projectName: 'Fitzgerald Gardens',
        packages: [
          {
            packageId: 'pkg_001',
            packageName: 'Premium Kitchen Package',
            quantity: 1,
            unitPrice: 15000,
            customizations: {}
          },
          {
            packageId: 'pkg_002',
            packageName: 'Luxury Bathroom Suite',
            quantity: 2,
            unitPrice: 8500,
            customizations: {
              bath_material: 'Carrara Marble',
              fixtures_finish: 'Matte Black'
            }
          }
        ],
        totalValue: 32000,
        status: 'pending_approval',
        installationPhase: 'pre_construction',
        requestedCompletionDate: '2025-11-30',
        orderDate: '2025-04-02',
        estimatedInstallation: '2025-11-15',
        specialInstructions: 'Coordinate with structural modifications',
        paymentStatus: 'deposit_paid',
        installationStatus: 'awaiting_approval'
      }
    ];

    // Apply filters
    let filteredPackages = mockPackages;
    if (category) {
      filteredPackages = filteredPackages.filter(pkg => pkg.category === category);
    }
    if (availability) {
      filteredPackages = filteredPackages.filter(pkg => pkg.availability === availability);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedPackages = filteredPackages.slice(startIndex, startIndex + limit);

    // Calculate analytics
    const analytics = {
      totalPackages: filteredPackages.length,
      totalOrders: mockOrders.length,
      totalRevenue: mockOrders.reduce((sum, order) => sum + order.totalValue, 0),
      monthlyRevenue: mockPackages.reduce((sum, pkg) => sum + (pkg.monthlyRevenue || 0), 0),
      averageOrderValue: mockOrders.length > 0 
        ? mockOrders.reduce((sum, order) => sum + order.totalValue, 0) / mockOrders.length 
        : 0,
      topSellingPackages: mockPackages
        .sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0))
        .slice(0, 5)
        .map(pkg => ({ id: pkg.id, name: pkg.name, orders: pkg.totalOrders || 0 })),
      ordersByStatus: {
        confirmed: mockOrders.filter(o => o.status === 'confirmed').length,
        pending_approval: mockOrders.filter(o => o.status === 'pending_approval').length,
        in_production: mockOrders.filter(o => o.status === 'in_production').length,
        completed: mockOrders.filter(o => o.status === 'completed').length
      }
    };

    const response = {
      success: true,
      data: {
        packages: paginatedPackages,
        orders: mockOrders,
        analytics
      },
      pagination: {
        page,
        limit,
        total: filteredPackages.length,
        totalPages: Math.ceil(filteredPackages.length / limit)
      },
      timestamp: new Date().toISOString()
    };

    // Log successful response
    logger.info('PROP Choice data provided', {
      developerId,
      packagesReturned: paginatedPackages.length,
      ordersReturned: mockOrders.length,
      totalRevenue: analytics.totalRevenue
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('PROP Choice API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch PROP Choice data'
      },
      { status: 500 }
    );
  }
}

// POST /api/developer/prop-choice - Create new package or order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const developerId = session.user.email;
    const body = await request.json();
    const { type, data } = body;

    // Log the creation request
    logger.info('PROP Choice creation requested', {
      developerId,
      type,
      timestamp: new Date().toISOString()
    });

    if (type === 'package') {
      // Validate package data
      const validatedData = PropChoicePackageSchema.parse(data);
      
      // In production, this would create the package in the database
      const newPackage = {
        id: `pkg_${Date.now()}`,
        ...validatedData,
        createdAt: new Date().toISOString(),
        createdBy: developerId,
        totalOrders: 0,
        monthlyRevenue: 0,
        averageRating: 0
      };

      logger.info('PROP Choice package created', {
        developerId,
        packageId: newPackage.id,
        packageName: newPackage.name,
        category: newPackage.category
      });

      return NextResponse.json({
        success: true,
        message: 'Package created successfully',
        data: newPackage,
        timestamp: new Date().toISOString()
      });

    } else if (type === 'order') {
      // Validate order data
      const validatedData = PropChoiceOrderSchema.parse(data);
      
      // In production, this would create the order in the database
      const newOrder = {
        id: `order_${Date.now()}`,
        ...validatedData,
        status: 'pending_approval',
        orderDate: new Date().toISOString(),
        createdBy: developerId,
        paymentStatus: 'pending',
        installationStatus: 'not_scheduled'
      };

      logger.info('PROP Choice order created', {
        developerId,
        orderId: newOrder.id,
        buyerId: newOrder.buyerId,
        totalValue: newOrder.totalValue,
        packagesCount: newOrder.packages.length
      });

      return NextResponse.json({
        success: true,
        message: 'Order created successfully',
        data: newOrder,
        timestamp: new Date().toISOString()
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "package" or "order"' },
        { status: 400 }
      );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('PROP Choice validation error', {
        errors: error.errors,
        developerId: session?.user?.email
      });

      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      );
    }

    logger.error('PROP Choice creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to create PROP Choice item'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/developer/prop-choice - Update package or order
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const developerId = session.user.email;
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');
    const type = searchParams.get('type');
    
    if (!itemId || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters: id and type' },
        { status: 400 }
      );
    }

    const updates = await request.json();

    // Log the update request
    logger.info('PROP Choice update requested', {
      developerId,
      itemId,
      type,
      updates: Object.keys(updates),
      timestamp: new Date().toISOString()
    });

    // In production, this would update the database
    const updatedItem = {
      id: itemId,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: developerId
    };

    logger.info('PROP Choice item updated', {
      developerId,
      itemId,
      type,
      updatedFields: Object.keys(updates)
    });

    return NextResponse.json({
      success: true,
      message: `${type} updated successfully`,
      data: updatedItem,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('PROP Choice update error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to update PROP Choice item'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/developer/prop-choice - Delete package or order
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const developerId = session.user.email;
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');
    const type = searchParams.get('type');
    
    if (!itemId || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters: id and type' },
        { status: 400 }
      );
    }

    // Log the deletion request
    logger.info('PROP Choice deletion requested', {
      developerId,
      itemId,
      type,
      timestamp: new Date().toISOString()
    });

    // In production, this would soft-delete the item in the database
    logger.info('PROP Choice item deleted', {
      developerId,
      itemId,
      type
    });

    return NextResponse.json({
      success: true,
      message: `${type} deleted successfully`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('PROP Choice deletion error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to delete PROP Choice item'
      },
      { status: 500 }
    );
  }
}