import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createBuyerProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  currentJourneyPhase: z.string().optional().default('planning'),
  financialDetails: z.object({
    annualIncome: z.number().optional(),
    partnerIncome: z.number().optional(),
    savings: z.number().optional(),
    monthlyDebts: z.number().optional(),
    depositAmount: z.number().optional(),
    htbEligible: z.boolean().optional(),
    htbAmount: z.number().optional(),
    maxBudget: z.number().optional(),
    preApprovalStatus: z.string().optional(),
    preferredLender: z.string().optional()
  }).optional(),
  preferences: z.object({
    preferredAreas: z.array(z.string()).optional(),
    propertyTypes: z.array(z.string()).optional(),
    minBedrooms: z.number().optional(),
    maxBedrooms: z.number().optional(),
    mustHaveFeatures: z.array(z.string()).optional(),
    avoidFeatures: z.array(z.string()).optional(),
    transportLinks: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional()
  }).optional(),
  governmentSchemes: z.object({
    htbApplicationStatus: z.string().optional(),
    htbApplicationDate: z.string().optional(),
    htbReferenceNumber: z.string().optional(),
    sharedEquityScheme: z.boolean().optional(),
    firstHomeBuyer: z.boolean().optional(),
    localAuthority: z.string().optional()
  }).optional()
});

const updateBuyerProfileSchema = createBuyerProfileSchema.partial();

/**
 * POST /api/buyer/profile - Create buyer profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createBuyerProfileSchema.parse(body);

    // Verify user exists and get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user can create/modify this profile
    if (currentUser.id !== validatedData.userId && !isAdmin(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check if profile already exists
    const existingProfile = await prisma.buyerProfile.findUnique({
      where: { userId: validatedData.userId }
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Buyer profile already exists. Use PATCH to update.' },
        { status: 409 }
      );
    }

    // Create buyer profile
    const buyerProfile = await prisma.buyerProfile.create({
      data: {
        id: generateId(),
        userId: validatedData.userId,
        currentJourneyPhase: validatedData.currentJourneyPhase || 'planning',
        financialDetails: validatedData.financialDetails || {},
        preferences: validatedData.preferences || {},
        governmentSchemes: validatedData.governmentSchemes || {},
        updatedAt: new Date()
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      }
    });

    // Create initial buyer journey record
    await prisma.buyerJourneys.create({
      data: {
        id: generateId(),
        buyerId: validatedData.userId,
        currentPhase: 'PLANNING', // Enum value
        lastUpdated: new Date(),
        notes: 'Initial profile created'
      }
    });

    // Log profile creation event
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: validatedData.userId,
        eventType: 'PROFILE_CREATED',
        eventDate: new Date(),
        eventData: {
          journeyPhase: validatedData.currentJourneyPhase,
          createdBy: currentUser.id
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        profile: buyerProfile,
        message: 'Buyer profile created successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating buyer profile:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create buyer profile' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/buyer/profile - Update buyer profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateBuyerProfileSchema.parse(body);

    if (!validatedData.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    if (currentUser.id !== validatedData.userId && !isAdmin(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check if profile exists
    const existingProfile = await prisma.buyerProfile.findUnique({
      where: { userId: validatedData.userId }
    });

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Buyer profile not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };

    if (validatedData.currentJourneyPhase) {
      updateData.currentJourneyPhase = validatedData.currentJourneyPhase;
    }

    if (validatedData.financialDetails) {
      updateData.financialDetails = {
        ...existingProfile.financialDetails,
        ...validatedData.financialDetails
      };
    }

    if (validatedData.preferences) {
      updateData.preferences = {
        ...existingProfile.preferences,
        ...validatedData.preferences
      };
    }

    if (validatedData.governmentSchemes) {
      updateData.governmentSchemes = {
        ...existingProfile.governmentSchemes,
        ...validatedData.governmentSchemes
      };
    }

    // Update buyer profile
    const updatedProfile = await prisma.buyerProfile.update({
      where: { userId: validatedData.userId },
      data: updateData,
      include: {
        User: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        }
      }
    });

    // Log profile update event
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: validatedData.userId,
        eventType: 'PROFILE_UPDATED',
        eventDate: new Date(),
        eventData: {
          updatedFields: Object.keys(validatedData).filter(key => key !== 'userId'),
          updatedBy: currentUser.id
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        profile: updatedProfile,
        message: 'Buyer profile updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating buyer profile:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update buyer profile' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
async function getCurrentUser(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      const authToken = request.cookies.get('auth-token')?.value;
      if (authToken?.startsWith('dev-token-')) {
        const userId = authToken.replace('dev-token-', '');
        return await userService.getUserById(userId);
      }
    } else {
      return await userService.getCurrentUser();
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
}

function isAdmin(user: any): boolean {
  return user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN');
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}