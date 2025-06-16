/**
 * API Route: /api/developments
 * Handles development endpoints - ENTERPRISE ENABLED
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDevelopments } from '@/lib/enterprise-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const published = searchParams.get('published') !== 'false';

    // Get developments from enterprise database
    const developments = await getDevelopments();
    
    // Filter published if specified
    const filteredDevelopments = published 
      ? developments.filter(dev => dev.isPublished)
      : developments;

    // Simple pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filteredDevelopments.slice(start, end);

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
        updatedAt: dev.updatedAt,
        developer: {
          id: dev.developer.id,
          companyName: dev.developer.companyName,
          isVerified: dev.developer.isVerified
        },
        unitCount: dev.units.length,
        availableUnits: dev.units.filter(u => u.status === 'AVAILABLE').length
      })),
      pagination: {
        total: filteredDevelopments.length,
        page,
        limit,
        pages: Math.ceil(filteredDevelopments.length / limit)
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
    const { name, description, location, status, totalUnits, developerId } = body;
    
    if (!name || !description || !location || !developerId) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'name, description, location, and developerId are required'
      }, { status: 400 });
    }

    // Create a new development with structured data
    const newDevelopment = {
      id: `dev_${Date.now()}`,
      name,
      description,
      location,
      status: status || 'PLANNING',
      totalUnits: totalUnits || 0,
      developerId,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: body.images || [],
      features: body.features || [],
      amenities: body.amenities || [],
      priceRange: body.priceRange || 'TBD',
      availableUnits: totalUnits || 0
    };

    return NextResponse.json({
      data: newDevelopment,
      message: 'Development created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating development:', error);
    return NextResponse.json({
      error: 'Failed to create development',
      message: 'Internal server error'
    }, { status: 500 });
  }
}