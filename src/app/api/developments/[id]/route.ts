/**
 * API Route: /api/developments/[id]
 * Handles specific development endpoints - ENTERPRISE ENABLED
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDevelopmentByName, getUnitsForDevelopment, getSalesAnalytics } from '@/lib/enterprise-data';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Handle Fitzgerald Gardens specifically (main development)
    let development;
    if (id === 'fitzgerald-gardens' || id === 'fitzgerald-gardens-main') {
      development = await getDevelopmentByName('Fitzgerald Gardens');
    } else {
      // For other developments, try to find by ID or name
      development = await getDevelopmentByName(id);
    }
    
    if (!development) {
      return NextResponse.json({ 
        error: 'Development not found',
        message: `Development with ID '${id}' does not exist`
      }, { status: 404 });
    }

    // Get units for this development
    const units = await getUnitsForDevelopment(development.id);
    
    // Get sales analytics for this development
    const salesAnalytics = await getSalesAnalytics(development.id);

    // Prepare response with complete development data
    const responseData = {
      ...development,
      units: units.map(unit => ({
        id: unit.id,
        unitNumber: unit.unitNumber,
        floor: unit.floor,
        type: unit.type,
        status: unit.status,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        size: unit.size,
        price: unit.price,
        title: unit.title,
        description: unit.description,
        berRating: unit.berRating,
        features: unit.features,
        primaryImage: unit.primaryImage,
        images: unit.images,
        floorplans: unit.floorplans,
        virtualTourUrl: unit.virtualTourUrl,
        availableFrom: unit.availableFrom,
        estimatedCompletion: unit.estimatedCompletion,
        sale: unit.sale,
        reservation: unit.reservation
      })),
      analytics: salesAnalytics,
      unitStats: {
        total: units.length,
        available: units.filter(u => u.status === 'AVAILABLE').length,
        reserved: units.filter(u => u.status === 'RESERVED').length,
        sold: units.filter(u => u.status === 'SOLD').length
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