/**
 * API Route: /api/developments
 * Handles development endpoints - REAL DATABASE ENABLED
 */

import { NextRequest, NextResponse } from 'next/server';
import { developmentsService } from '@/lib/services/developments-prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const published = searchParams.get('published') !== 'false';
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const city = searchParams.get('city') || undefined;

    // Get developments from real database
    const developments = await developmentsService.getDevelopments({
      isPublished: published,
      search,
      status,
      city
    });

    // Simple pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = developments.slice(start, end);

    return NextResponse.json({
      data: paginatedData.map(dev => ({
        id: dev.id,
        name: dev.name,
        description: dev.description,
        location: dev.location,
        city: dev.city,
        county: dev.county,
        status: dev.status,
        totalUnits: dev.totalUnits,
        startingPrice: dev.startingPrice,
        avgPrice: dev.avgPrice,
        mainImage: dev.mainImage,
        images: JSON.parse(dev.imagesData || '[]'),
        features: JSON.parse(dev.featuresData || '[]'),
        amenities: JSON.parse(dev.amenitiesData || '[]'),
        isPublished: dev.isPublished,
        createdAt: dev.createdAt,
        updatedAt: dev.updatedAt
      })),
      pagination: {
        total: developments.length,
        page,
        limit,
        pages: Math.ceil(developments.length / limit)
      },
      message: 'Developments retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching developments:', error);
    return NextResponse.json({
      error: 'Failed to fetch developments',
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields for development creation
    const { name, description, location, city, county, status, totalUnits, developerId, mainImage } = body;
    
    if (!name || !location || !city || !county || !developerId || !mainImage) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'name, location, city, county, developerId, and mainImage are required'
      }, { status: 400 });
    }

    // Create development using real database service
    const newDevelopment = await developmentsService.createDevelopment({
      name,
      description,
      location,
      city,
      county,
      eircode: body.eircode,
      status: status || 'PLANNING',
      developerId,
      mainImage,
      imagesData: body.images || [],
      totalUnits: totalUnits || 0,
      startingPrice: body.startingPrice,
      avgPrice: body.avgPrice,
      isPublished: body.isPublished || false,
      featuresData: body.features || [],
      amenitiesData: body.amenities || []
    });

    return NextResponse.json({
      data: newDevelopment,
      message: 'Development created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating development:', error);
    
    if (error.message === 'Development with this name already exists') {
      return NextResponse.json({
        error: 'Development with this name already exists'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      error: 'Failed to create development',
      message: 'Internal server error'
    }, { status: 500 });
  }
}