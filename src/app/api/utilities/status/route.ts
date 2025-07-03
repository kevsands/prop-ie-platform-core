import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withSimpleAuth } from '@/lib/middleware/simple-auth';
import { irishUtilityApis } from '@/lib/services/irish-utility-apis';

/**
 * GET /api/utilities/status
 * Check status of utility provider applications
 * Query parameters:
 * - provider: 'homebond' | 'irish_water' | 'esb'
 * - applicationId: string
 */
export const GET = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as 'homebond' | 'irish_water' | 'esb';
    const applicationId = searchParams.get('applicationId');
    
    if (!provider || !applicationId) {
      return NextResponse.json(
        {
          error: 'Missing required parameters',
          message: 'Both provider and applicationId are required'
        },
        { status: 400 }
      );
    }
    
    if (!['homebond', 'irish_water', 'esb'].includes(provider)) {
      return NextResponse.json(
        {
          error: 'Invalid provider',
          message: 'Provider must be one of: homebond, irish_water, esb'
        },
        { status: 400 }
      );
    }
    
    // Get application status from provider
    const statusResponse = await irishUtilityApis.getApplicationStatus(
      provider,
      applicationId
    );
    
    return NextResponse.json({
      data: {
        provider,
        applicationId,
        ...statusResponse,
        checkedBy: user.id,
        checkedAt: new Date().toISOString()
      },
      message: 'Application status retrieved successfully'
    });
    
  } catch (error: any) {
    console.error('Utility status check error:', error);
    
    // Handle specific error types
    if (error.message.includes('not yet implemented')) {
      return NextResponse.json(
        {
          error: 'Feature not available',
          message: error.message,
          provider: error.message.split(' ').pop()
        },
        { status: 501 }
      );
    }
    
    if (error.code && (error.code.includes('HOMEBOND') || error.code.includes('IRISH_WATER') || error.code.includes('ESB'))) {
      return NextResponse.json(
        {
          error: 'Utility provider error',
          message: error.message,
          code: error.code
        },
        { status: 502 }
      );
    }
    
    return NextResponse.json(
      {
        error: 'Status check failed',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ADMIN']
});