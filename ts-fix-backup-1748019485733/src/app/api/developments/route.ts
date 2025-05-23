/**
 * API Route: /api/developments
 * Handles development endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/security/auditLogger';
import { authOptions } from '@/lib/auth';
import { Prisma, DevelopmentStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || undefined;
    const status = url.searchParams.get('status') as DevelopmentStatus | undefined;
    const developerId = url.searchParams.get('developerId') || undefined;
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // Create filter object with proper Prisma types
    const filter: Prisma.DevelopmentWhereInput = {
      ...(status && { status }),
      ...(developerId && { developerId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: search, mode: Prisma.QueryMode.insensitive } }]
      })
    };

    // Get developments with pagination
    const [developmentstotal] = await Promise.all([
      prisma.development.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          location: true,
          developer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      prisma.development.count({ where: filter })
    ]);

    // Format response
    const result = {
      data: developments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Error fetching developments:', { error });
    return NextResponse.json(
      { error: 'Failed to fetch developments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json() as {
      name: string;
      developerId: string;
      location: {
        address: string;
        city: string;
        county: string;
        eircode?: string;
        longitude?: number;
        latitude?: number;
      };
      description: string;
      mainImage: string;
      totalUnits: number;
      status: DevelopmentStatus;
      features?: string[];
      amenities?: string[];
    };

    // Validate required fields
    const requiredFields = ['name', 'developerId', 'location', 'description', 'mainImage', 'totalUnits', 'status'];
    for (const field of requiredFields) {
      if (!body[field as keyof typeof body]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate location fields
    const locationRequiredFields = ['address', 'city', 'county'];
    for (const field of locationRequiredFields) {
      if (!body.location[field as keyof typeof body.location]) {
        return NextResponse.json(
          { error: `Missing required location field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Set defaults for optional fields
    body.features = body.features || [];
    body.amenities = body.amenities || [];

    // Format data for Prisma
    const developmentData: Prisma.DevelopmentCreateInput = {
      name: body.name,
      developer: {
        connect: { id: body.developerId }
      },
      location: {
        create: {
          address: body.location.address,
          city: body.location.city,
          county: body.location.county,
          eircode: body.location.eircode,
          longitude: body.location.longitude,
          latitude: body.location.latitude,
          country: 'Ireland'}
      },
      description: body.description,
      mainImage: body.mainImage,
      totalUnits: body.totalUnits,
      status: body.status,
      features: body.features,
      amenities: body.amenities,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      images: [],
      videos: [],
      marketingStatus: {},
      salesStatus: {
        totalUnits: body.totalUnits,
        availableUnits: body.totalUnits,
        reservedUnits: 0,
        saleAgreedUnits: 0,
        soldUnits: 0,
        salesVelocity: 0,
        targetPriceAverage: 0,
        actualPriceAverage: 0,
        projectedSelloutDate: new Date()},
      constructionStatus: {
        currentStage: 'not_started',
        percentageComplete: 0,
        inspections: [],
        certifications: []},
      complianceStatus: {
        planningConditions: [],
        buildingRegulations: [],
        environmentalRequirements: []}
    };

    // Create development
    const development = await prisma.development.create({
      data: developmentData
    });

    return NextResponse.json({ data: development });
  } catch (error) {
    logger.error('Error creating development:', { error });
    return NextResponse.json(
      { error: 'Failed to create development' },
      { status: 500 }
    );
  }
}

// Helper function to fetch development by ID (not exported as a route handler)
// This is for internal use only and should be imported where needed
// Not using export here to avoid Next.js trying to register it as a route handler
async function getDevelopmentById(id: string) {
  try {
    // Get development with related data
    const development = await prisma.development.findUnique({
      where: { id },
      include: {
        location: true,
        developer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        units: {
          include: {
            rooms: true,
            outdoorSpaces: true
          }
        },
        DevelopmentDocument: true
      }
    });

    if (!development) {
      return { error: 'Development not found', status: 404 };
    }

    return { data: development, status: 200 };
  } catch (error) {
    logger.error('Error fetching development details:', { error });
    return { error: 'Failed to fetch development details', status: 500 };
  }
}