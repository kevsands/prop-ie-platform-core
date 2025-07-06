/**
 * Ecosystem Coordination API
 * 
 * Week 4 Implementation: Core Service Enhancement
 * Provides endpoints for initiating and managing professional ecosystem coordination
 */

import { NextRequest, NextResponse } from 'next/server';
import EcosystemCoordinationService from '@/services/EcosystemCoordinationService';
import { UserRole } from '@prisma/client';

/**
 * POST /api/ecosystem/coordinate
 * Initiate ecosystem coordination for a transaction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const coordinationRequest = {
      transactionId: body.transactionId,
      requiredRoles: body.requiredRoles as UserRole[],
      priority: body.priority || 'medium',
      timeline: {
        startDate: new Date(body.timeline.startDate),
        targetCompletionDate: new Date(body.timeline.targetCompletionDate)
      },
      customRequirements: body.customRequirements
    };

    const result = await EcosystemCoordinationService.initiateEcosystemCoordination(coordinationRequest);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Ecosystem coordination initiated successfully'
    });

  } catch (error) {
    console.error('Ecosystem coordination API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initiate ecosystem coordination'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ecosystem/coordinate?coordinationId=xxx
 * Get coordination status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coordinationId = searchParams.get('coordinationId');

    if (!coordinationId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Coordination ID is required'
        },
        { status: 400 }
      );
    }

    const status = await EcosystemCoordinationService.getCoordinationStatus(coordinationId);

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Coordination not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Get coordination status API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get coordination status'
      },
      { status: 500 }
    );
  }
}