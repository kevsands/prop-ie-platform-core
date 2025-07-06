/**
 * API Route: /api/developments/[id]
 * Handles specific development endpoints - ENTERPRISE ENABLED
 */

import { NextRequest, NextResponse } from 'next/server';
import { developmentsService } from '@/lib/services/developments-prisma';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Get development from database
    const development = await developmentsService.getDevelopmentById(id);
    
    if (!development) {
      return NextResponse.json({ 
        error: 'Development not found',
        message: `Development with ID '${id}' does not exist`
      }, { status: 404 });
    }

    // For now, return basic development data
    // Units and analytics can be added later when we have the full schema
    const responseData = {
      id: development.id,
      name: development.name,
      description: development.description,
      location: development.location,
      city: development.city,
      county: development.county,
      status: development.status,
      mainImage: development.mainImage,
      startingPrice: development.startingPrice,
      totalUnits: development.totalUnits,
      isPublished: development.isPublished,
      createdAt: development.createdAt,
      updatedAt: development.updatedAt,
      units: [], // Empty for now
      analytics: null, // Empty for now
      unitStats: {
        total: development.totalUnits,
        available: development.totalUnits,
        reserved: 0,
        sold: 0
      }
    };
    
    return NextResponse.json({
      data: responseData,
      message: 'Development retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching development:', error);
    return NextResponse.json({
      error: 'Failed to fetch development data',
      message: 'Internal server error'
    }, { status: 500 });
  }
}