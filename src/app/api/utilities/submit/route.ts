import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withSimpleAuth } from '@/lib/middleware/simple-auth';
import { irishUtilityApis } from '@/lib/services/irish-utility-apis';

// Validation schemas for different providers
const homebondApplicationSchema = z.object({
  provider: z.literal('homebond'),
  applicationType: z.enum(['new_home_warranty', 'structural_warranty']),
  applicationData: z.object({
    developerId: z.string(),
    projectName: z.string(),
    projectAddress: z.string(),
    totalUnits: z.number().min(1),
    unitTypes: z.array(z.object({
      type: z.string(),
      count: z.number(),
      floorArea: z.number()
    })),
    expectedCompletionDate: z.string(),
    planningReference: z.string(),
    buildingControlReference: z.string().optional()
  })
});

const irishWaterApplicationSchema = z.object({
  provider: z.literal('irish_water'),
  applicationType: z.enum(['new_connection', 'wastewater_connection']),
  applicationData: z.object({
    applicantName: z.string(),
    applicantEmail: z.string().email(),
    siteAddress: z.string(),
    propertyType: z.enum(['residential', 'commercial', 'industrial']),
    unitsCount: z.number().min(1),
    estimatedDemand: z.number().optional(),
    estimatedDischarge: z.number().optional(),
    connectionType: z.enum(['new', 'upgrade']),
    plannedConnectionDate: z.string(),
    planningReference: z.string()
  })
});

const esbApplicationSchema = z.object({
  provider: z.literal('esb'),
  applicationType: z.enum(['new_electricity_connection', 'temporary_supply']),
  applicationData: z.union([
    z.object({
      applicantName: z.string(),
      applicantEmail: z.string().email(),
      siteAddress: z.string(),
      connectionType: z.enum(['domestic', 'non_domestic']),
      loadRequirement: z.number(),
      unitsCount: z.number(),
      plannedConnectionDate: z.string(),
      planningReference: z.string(),
      buildingType: z.string()
    }),
    z.object({
      applicantName: z.string(),
      applicantEmail: z.string().email(),
      siteAddress: z.string(),
      supplyDuration: z.string(),
      loadRequirement: z.number(),
      startDate: z.string(),
      endDate: z.string()
    })
  ])
});

const utilityApplicationSchema = z.union([
  homebondApplicationSchema,
  irishWaterApplicationSchema,
  esbApplicationSchema
]);

/**
 * POST /api/utilities/submit
 * Submit application to Irish utility providers
 */
export const POST = withSimpleAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = utilityApplicationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.format()
        },
        { status: 400 }
      );
    }
    
    const { provider, applicationType, applicationData } = validationResult.data;
    
    // Add user context to application data
    const enrichedApplicationData = {
      ...applicationData,
      submittedBy: {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        organization: user.roles.includes('DEVELOPER') ? 'Development Company' : 'Professional Services'
      },
      submissionTimestamp: new Date().toISOString()
    };
    
    // Submit to utility provider
    const submissionResponse = await irishUtilityApis.submitApplication(
      provider,
      applicationType,
      enrichedApplicationData
    );
    
    // Log submission for audit trail
    console.log(`Utility application submitted:`, {
      provider,
      applicationType,
      applicationId: submissionResponse.applicationId,
      referenceNumber: submissionResponse.referenceNumber,
      userId: user.id,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      data: {
        ...submissionResponse,
        provider,
        applicationType,
        submittedBy: user.id
      },
      message: `Application successfully submitted to ${provider.replace('_', ' ')}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Utility application submission error:', error);
    
    // Handle API-specific errors
    if (error.code && error.code.includes('RATE_LIMIT')) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests to utility provider. Please try again later.',
          retryAfter: 60
        },
        { status: 429 }
      );
    }
    
    if (error.code && (error.code.includes('HOMEBOND') || error.code.includes('IRISH_WATER') || error.code.includes('ESB'))) {
      return NextResponse.json(
        {
          error: 'Utility provider error',
          message: error.message,
          code: error.code,
          provider: error.code.split('_')[0].toLowerCase()
        },
        { status: 502 }
      );
    }
    
    return NextResponse.json(
      {
        error: 'Application submission failed',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}, {
  requiredRoles: ['DEVELOPER', 'PROJECT_MANAGER', 'ADMIN']
});