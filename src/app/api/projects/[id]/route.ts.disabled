import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getRepository } from '@/lib/db/repositories/index';
import { logger } from '@/lib/security/auditLogger';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { GetHandler, PatchHandler, IdParam } from '@/types/next-route-handlers';

/**
 * GET /api/projects/[id]
 * Fetch details for a specific project
 */
export const GET: GetHandler<IdParam> = async (request, { params }) => {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = params.id;
    
    // Get repository
    const developmentRepository = getRepository('development');
    
    // Get development with related data
    const development = await developmentRepository.findWithFullDetails(id);
    
    if (!development) {
      return NextResponse.json(
        { error: 'Development not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: development });
  } catch (error) {
    logger.error('Error fetching development details:', { error });
    return NextResponse.json(
      { error: 'Failed to fetch development details' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[id]
 * Update details for a specific project
 */
export const PATCH: PatchHandler<IdParam> = async (request, { params }) => {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = params.id;
    const updates = await request.json() as Prisma.DevelopmentUpdateInput;
    
    // Get repository
    const developmentRepository = getRepository('development');
    
    // Update development
    const updatedDevelopment = await developmentRepository.update(id, updates);
    
    if (!updatedDevelopment) {
      return NextResponse.json(
        { error: 'Development not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: updatedDevelopment });
  } catch (error) {
    logger.error('Error updating development:', { error });
    return NextResponse.json(
      { error: 'Failed to update development' },
      { status: 500 }
    );
  }
}