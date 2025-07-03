import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/security/auditLogger';
import { z } from 'zod';

/**
 * Enterprise Off-Plan Purchase Workflow API
 * Manages the complete off-plan purchase journey from reservation to completion
 * Integrates with PROP Choice, payment processing, and construction monitoring
 */

// Validation schemas
const PropertyReservationSchema = z.object({
  propertyId: z.string(),
  unitId: z.string(),
  projectId: z.string(),
  developerId: z.string(),
  reservationFee: z.number().min(500).max(2000),
  propChoiceSelections: z.array(z.object({
    packageId: z.string(),
    customizations: z.record(z.string(), z.any()).optional()
  })).optional(),
  specialRequests: z.string().optional()
});

const BookingDepositSchema = z.object({
  reservationId: z.string(),
  bookingFee: z.number().min(1000),
  solicitorId: z.string().optional(),
  solicitorName: z.string().optional(),
  legalReviewPeriod: z.number().min(14).max(56), // days
  completionDeadline: z.string() // ISO date
});

const ContractExchangeSchema = z.object({
  bookingId: z.string(),
  contractualDeposit: z.number().min(0),
  htbApplicationId: z.string().optional(),
  mortgageOfferId: z.string(),
  solicitorConfirmation: z.boolean(),
  buildingSpecsApproved: z.boolean(),
  propChoiceFinalized: z.boolean()
});

// Off-plan purchase stage enum
const PurchaseStage = z.enum([
  'prerequisites',
  'online_reservation',
  'booking_deposit',
  'contract_exchange',
  'construction_monitoring',
  'pre_completion',
  'completion_handover'
]);

// GET /api/buyer/off-plan - Get buyer's off-plan purchases and progress
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const buyerId = session.user.email;
    const { searchParams } = new URL(request.url);
    const purchaseId = searchParams.get('purchaseId');
    const stage = searchParams.get('stage');

    // Log the API request
    logger.info('Off-plan purchase data requested', {
      buyerId,
      purchaseId,
      stage,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // In production, this would query the database
    // For enterprise demo, return comprehensive purchase journey data
    const mockPurchase = {
      id: 'purchase_fg_sarah_001',
      buyerId,
      buyerName: 'Sarah O\'Connor',
      
      // Property details
      property: {
        id: 'prop_fg_2b_15',
        unitId: 'unit_fg_2b_15',
        projectId: 'proj_fitzgerald_gardens',
        projectName: 'Fitzgerald Gardens',
        unitName: 'Apartment 15, Block A',
        unitType: '2bed',
        floorPlan: '2 bed, 2 bath, balcony',
        floor: 3,
        orientation: 'South-East',
        squareMeters: 85,
        basePrice: 395000,
        address: 'Fitzgerald Gardens, Sandyford, Dublin 18'
      },

      // Purchase journey tracking
      currentStage: 'contract_exchange',
      stages: {
        prerequisites: {
          status: 'completed',
          completedAt: '2025-03-10T14:30:00Z',
          tasks: {
            identity_verification: { completed: true, completedAt: '2025-03-08T10:15:00Z' },
            financial_documentation: { completed: true, completedAt: '2025-03-09T16:20:00Z' },
            htb_eligibility_check: { completed: true, completedAt: '2025-03-09T16:45:00Z' },
            mortgage_approval_principle: { completed: true, completedAt: '2025-03-10T11:30:00Z' },
            budget_confirmation: { completed: true, completedAt: '2025-03-10T14:30:00Z' }
          }
        },
        online_reservation: {
          status: 'completed',
          completedAt: '2025-03-15T09:45:00Z',
          reservationId: 'res_fg_sarah_001',
          reservationFee: 500,
          paymentReference: 'PAY_RES_001_2025',
          tasks: {
            browse_properties: { completed: true, completedAt: '2025-03-12T19:30:00Z' },
            select_unit: { completed: true, completedAt: '2025-03-14T20:15:00Z' },
            customize_with_prop_choice: { completed: true, completedAt: '2025-03-15T08:30:00Z' },
            pay_reservation_fee: { completed: true, completedAt: '2025-03-15T09:45:00Z' }
          }
        },
        booking_deposit: {
          status: 'completed',
          completedAt: '2025-03-22T14:20:00Z',
          bookingId: 'book_fg_sarah_001',
          bookingFee: 5000,
          paymentReference: 'PAY_BOOK_001_2025',
          solicitor: {
            id: 'sol_murphy_partners',
            name: 'Murphy & Partners Solicitors',
            contact: 'sarah.murphy@murphypartners.ie',
            phone: '+353 1 234 5678'
          },
          legalReviewPeriod: 28,
          tasks: {
            review_property_details: { completed: true, completedAt: '2025-03-16T10:00:00Z' },
            solicitor_selection: { completed: true, completedAt: '2025-03-18T15:30:00Z' },
            review_contracts: { completed: true, completedAt: '2025-03-20T17:45:00Z' },
            pay_booking_deposit: { completed: true, completedAt: '2025-03-22T14:20:00Z' }
          }
        },
        contract_exchange: {
          status: 'in_progress',
          estimatedCompletion: '2025-04-30T17:00:00Z',
          contractualDeposit: 39500, // 10% of 395k
          depositDue: '2025-04-30T17:00:00Z',
          tasks: {
            finalize_htb_application: { completed: true, completedAt: '2025-03-25T11:00:00Z' },
            mortgage_formal_application: { completed: false, inProgress: true, startedAt: '2025-03-28T09:00:00Z' },
            contract_signing: { completed: false, scheduled: '2025-04-28T14:00:00Z' },
            pay_contractual_deposit: { completed: false, due: '2025-04-30T17:00:00Z' }
          }
        },
        construction_monitoring: {
          status: 'pending',
          estimatedStart: '2025-05-15T00:00:00Z',
          estimatedDuration: '18 months',
          tasks: {
            construction_commencement: { completed: false },
            milestone_updates: { completed: false },
            prop_choice_installation: { completed: false },
            quality_inspections: { completed: false },
            completion_notice: { completed: false }
          }
        },
        pre_completion: {
          status: 'pending',
          estimatedStart: '2025-10-01T00:00:00Z',
          tasks: {
            mortgage_offer_confirmation: { completed: false },
            property_valuation: { completed: false },
            htb_final_approval: { completed: false },
            home_insurance: { completed: false },
            professional_fees_payment: { completed: false }
          }
        },
        completion_handover: {
          status: 'pending',
          estimatedStart: '2025-11-15T00:00:00Z',
          finalBalance: 349500, // Remaining after deposits and mortgage
          tasks: {
            final_inspection_walkthrough: { completed: false },
            mortgage_funds_drawdown: { completed: false },
            final_balance_payment: { completed: false },
            stamp_duty_payment: { completed: false },
            property_registration: { completed: false },
            keys_handover: { completed: false }
          }
        }
      },

      // PROP Choice selections
      propChoiceSelections: [
        {
          packageId: 'pkg_001',
          packageName: 'Premium Kitchen Package',
          value: 15000,
          customizations: {
            countertop: 'Quartz - Nero Marquina',
            cabinet_color: 'Charcoal Grey'
          },
          status: 'confirmed',
          installationPhase: 'construction'
        },
        {
          packageId: 'pkg_003',
          packageName: 'Smart Home Technology',
          value: 5200,
          customizations: {},
          status: 'confirmed',
          installationPhase: 'pre_completion'
        }
      ],

      // Financial summary
      financials: {
        propertyPrice: 395000,
        propChoiceValue: 20200,
        totalPurchasePrice: 415200,
        paidToDate: 5500, // reservation + booking
        contractualDeposit: 39500,
        finalBalance: 370200,
        htbBenefit: 30000,
        mortgageAmount: 350000,
        ownFundsRequired: 60200,
        stampDuty: 4152, // 1% of total
        legalFees: 1500,
        surveyorFees: 500,
        totalCosts: 421352
      },

      // Timeline and milestones
      timeline: {
        reservationDate: '2025-03-15',
        contractExchangeDeadline: '2025-04-30',
        constructionStart: '2025-05-15',
        propChoiceInstallation: '2025-09-30',
        estimatedCompletion: '2025-11-15',
        keyHandover: '2025-11-20'
      },

      // Professional services
      professionals: {
        solicitor: {
          name: 'Murphy & Partners Solicitors',
          contact: 'sarah.murphy@murphypartners.ie',
          phone: '+353 1 234 5678',
          status: 'appointed',
          feesEstimate: 1500
        },
        surveyor: {
          name: 'Dublin Property Surveys',
          contact: 'info@dublinsurveys.ie',
          phone: '+353 1 345 6789',
          status: 'to_be_appointed',
          feesEstimate: 500
        },
        mortgageBroker: {
          name: 'First Home Finance',
          contact: 'advisor@firsthome.ie',
          phone: '+353 1 456 7890',
          status: 'active',
          feesEstimate: 0
        }
      },

      // Construction monitoring (when active)
      constructionUpdates: [],

      // Communication log
      communications: [
        {
          id: 'comm_001',
          type: 'email',
          from: 'sales@propie.ie',
          subject: 'Reservation Confirmed - Fitzgerald Gardens Apt 15',
          date: '2025-03-15T09:50:00Z',
          status: 'delivered'
        },
        {
          id: 'comm_002',
          type: 'sms',
          from: 'PROPIE',
          message: 'Contract exchange deadline: 30 Apr 2025. Contact your solicitor.',
          date: '2025-04-01T10:00:00Z',
          status: 'delivered'
        }
      ],

      // Audit trail
      createdAt: '2025-03-15T09:45:00Z',
      updatedAt: '2025-03-28T14:30:00Z',
      lastSyncedAt: new Date().toISOString()
    };

    // Calculate progress percentages
    const totalTasks = Object.values(mockPurchase.stages).reduce((total, stage) => {
      return total + Object.keys(stage.tasks || {}).length;
    }, 0);

    const completedTasks = Object.values(mockPurchase.stages).reduce((total, stage) => {
      return total + Object.values(stage.tasks || {}).filter((task: any) => task.completed).length;
    }, 0);

    const overallProgress = Math.round((completedTasks / totalTasks) * 100);

    const analytics = {
      overallProgress,
      completedTasks,
      totalTasks,
      currentStageProgress: mockPurchase.currentStage,
      estimatedCompletionDate: mockPurchase.timeline.estimatedCompletion,
      daysToCompletion: Math.ceil(
        (new Date(mockPurchase.timeline.estimatedCompletion).getTime() - new Date().getTime()) 
        / (1000 * 60 * 60 * 24)
      ),
      nextMilestone: {
        title: 'Contract Exchange',
        date: mockPurchase.timeline.contractExchangeDeadline,
        daysRemaining: Math.ceil(
          (new Date(mockPurchase.timeline.contractExchangeDeadline).getTime() - new Date().getTime()) 
          / (1000 * 60 * 60 * 24)
        )
      }
    };

    const response = {
      success: true,
      data: mockPurchase,
      analytics,
      timestamp: new Date().toISOString()
    };

    // Log successful response
    logger.info('Off-plan purchase data provided', {
      buyerId,
      purchaseId: mockPurchase.id,
      currentStage: mockPurchase.currentStage,
      overallProgress
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Off-plan purchase API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch off-plan purchase data'
      },
      { status: 500 }
    );
  }
}

// POST /api/buyer/off-plan - Create reservation, booking, or progress purchase stage
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const buyerId = session.user.email;
    const body = await request.json();
    const { action, data } = body;

    // Log the action request
    logger.info('Off-plan purchase action requested', {
      buyerId,
      action,
      timestamp: new Date().toISOString()
    });

    switch (action) {
      case 'reservation':
        const reservationData = PropertyReservationSchema.parse(data);
        
        // In production, this would:
        // 1. Validate property availability
        // 2. Process payment
        // 3. Create reservation record
        // 4. Send confirmation notifications
        
        const reservation = {
          id: `res_${Date.now()}`,
          buyerId,
          ...reservationData,
          status: 'confirmed',
          paymentStatus: 'completed',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        };

        logger.info('Property reservation created', {
          buyerId,
          reservationId: reservation.id,
          propertyId: reservationData.propertyId,
          reservationFee: reservationData.reservationFee
        });

        return NextResponse.json({
          success: true,
          message: 'Property reserved successfully',
          data: reservation,
          nextSteps: [
            'Complete booking deposit within 7 days',
            'Select your solicitor',
            'Review property contract'
          ],
          timestamp: new Date().toISOString()
        });

      case 'booking':
        const bookingData = BookingDepositSchema.parse(data);
        
        const booking = {
          id: `book_${Date.now()}`,
          buyerId,
          ...bookingData,
          status: 'confirmed',
          paymentStatus: 'completed',
          legalReviewStartDate: new Date().toISOString(),
          legalReviewEndDate: new Date(Date.now() + bookingData.legalReviewPeriod * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        };

        logger.info('Booking deposit processed', {
          buyerId,
          bookingId: booking.id,
          reservationId: bookingData.reservationId,
          bookingFee: bookingData.bookingFee
        });

        return NextResponse.json({
          success: true,
          message: 'Booking deposit processed successfully',
          data: booking,
          nextSteps: [
            'Complete formal mortgage application',
            'Finalize HTB application',
            'Review and sign contracts before deadline'
          ],
          timestamp: new Date().toISOString()
        });

      case 'contract_exchange':
        const contractData = ContractExchangeSchema.parse(data);
        
        const contract = {
          id: `contract_${Date.now()}`,
          buyerId,
          ...contractData,
          status: 'executed',
          paymentStatus: 'completed',
          constructionStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedCompletionDate: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        };

        logger.info('Contract exchange completed', {
          buyerId,
          contractId: contract.id,
          contractualDeposit: contractData.contractualDeposit
        });

        return NextResponse.json({
          success: true,
          message: 'Contract exchange completed successfully',
          data: contract,
          nextSteps: [
            'Construction will begin within 30 days',
            'Monthly progress updates will be provided',
            'PROP Choice installation will be scheduled'
          ],
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be "reservation", "booking", or "contract_exchange"' },
          { status: 400 }
        );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Off-plan purchase validation error', {
        errors: error.errors,
        buyerId: session?.user?.email
      });

      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      );
    }

    logger.error('Off-plan purchase action error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process off-plan purchase action'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/buyer/off-plan - Update purchase progress or details
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const buyerId = session.user.email;
    const { searchParams } = new URL(request.url);
    const purchaseId = searchParams.get('purchaseId');
    const action = searchParams.get('action');
    
    if (!purchaseId) {
      return NextResponse.json(
        { error: 'Missing required parameter: purchaseId' },
        { status: 400 }
      );
    }

    const updates = await request.json();

    // Log the update request
    logger.info('Off-plan purchase update requested', {
      buyerId,
      purchaseId,
      action,
      updates: Object.keys(updates),
      timestamp: new Date().toISOString()
    });

    // In production, this would update the database
    const updatedPurchase = {
      id: purchaseId,
      ...updates,
      updatedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString()
    };

    logger.info('Off-plan purchase updated', {
      buyerId,
      purchaseId,
      updatedFields: Object.keys(updates)
    });

    return NextResponse.json({
      success: true,
      message: 'Purchase updated successfully',
      data: updatedPurchase,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Off-plan purchase update error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to update off-plan purchase'
      },
      { status: 500 }
    );
  }
}