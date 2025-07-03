import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/security/auditLogger';
import { z } from 'zod';

/**
 * Enterprise Professional Services Payment Coordination API
 * Manages payments to solicitors, surveyors, and other professionals
 * Integrated escrow and coordination system for off-plan purchases
 */

// Validation schemas
const ProfessionalServiceSchema = z.object({
  type: z.enum(['solicitor', 'surveyor', 'mortgage_broker', 'insurance_broker', 'engineer', 'architect']),
  provider: z.object({
    id: z.string(),
    name: z.string(),
    company: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      county: z.string(),
      eircode: z.string()
    }),
    credentials: z.object({
      registration: z.string(),
      certification: z.string(),
      insurance: z.string()
    })
  }),
  services: z.array(z.object({
    serviceId: z.string(),
    description: z.string(),
    estimatedFee: z.number().min(0),
    feeStructure: z.enum(['fixed', 'hourly', 'percentage', 'milestone']),
    timeline: z.string(),
    deliverables: z.array(z.string())
  })),
  purchaseId: z.string(),
  buyerId: z.string(),
  projectId: z.string()
});

const PaymentRequestSchema = z.object({
  serviceProviderId: z.string(),
  purchaseId: z.string(),
  serviceId: z.string(),
  amount: z.number().min(0),
  currency: z.string().default('EUR'),
  description: z.string(),
  milestone: z.string().optional(),
  dueDate: z.string().optional(),
  paymentMethod: z.enum(['bank_transfer', 'escrow', 'credit_card', 'direct_debit']),
  escrowRequired: z.boolean().default(false),
  invoiceReference: z.string().optional(),
  vatAmount: z.number().min(0).optional(),
  netAmount: z.number().min(0).optional()
});

const EscrowReleaseSchema = z.object({
  escrowId: z.string(),
  releaseAmount: z.number().min(0),
  releaseReason: z.enum(['milestone_completed', 'service_delivered', 'buyer_approval', 'dispute_resolved']),
  approvals: z.array(z.object({
    party: z.enum(['buyer', 'seller', 'professional', 'propie_admin']),
    approved: z.boolean(),
    approvedBy: z.string(),
    approvedAt: z.string(),
    notes: z.string().optional()
  })),
  documentation: z.array(z.object({
    type: z.string(),
    url: z.string().url(),
    description: z.string()
  })).optional()
});

// GET /api/payments/professional-services - Get payment coordination data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.email;
    const { searchParams } = new URL(request.url);
    const purchaseId = searchParams.get('purchaseId');
    const providerId = searchParams.get('providerId');
    const status = searchParams.get('status');

    // Log the API request
    logger.info('Professional services payment data requested', {
      userId,
      purchaseId,
      providerId,
      status,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // In production, this would query payment systems, escrow accounts, etc.
    // For enterprise demo, return comprehensive payment coordination data
    const mockPaymentData = {
      purchase: {
        id: 'purchase_fg_sarah_001',
        buyerId: userId,
        buyerName: 'Sarah O\'Connor',
        propertyId: 'unit_fg_2b_15',
        projectId: 'proj_fitzgerald_gardens',
        currentStage: 'contract_exchange',
        totalPropertyValue: 415200
      },

      // Professional services engaged
      professionalServices: [
        {
          id: 'service_001',
          type: 'solicitor',
          status: 'active',
          provider: {
            id: 'sol_murphy_partners',
            name: 'Sarah Murphy',
            company: 'Murphy & Partners Solicitors',
            email: 'sarah.murphy@murphypartners.ie',
            phone: '+353 1 234 5678',
            address: {
              street: '15 Grafton Street',
              city: 'Dublin',
              county: 'Dublin',
              eircode: 'D02 XY45'
            },
            credentials: {
              registration: 'Law Society of Ireland - LSI123456',
              certification: 'Solicitor - Admitted 2010',
              insurance: 'Professional Indemnity - €2M coverage'
            }
          },
          services: [
            {
              serviceId: 'legal_001',
              description: 'Property purchase legal services',
              estimatedFee: 1500,
              feeStructure: 'fixed',
              timeline: '6-8 weeks',
              deliverables: [
                'Contract review and negotiation',
                'Title investigation',
                'Mortgage documentation',
                'Completion coordination',
                'Registration with Land Registry'
              ]
            }
          ],
          engagementDate: '2025-03-18',
          estimatedCompletion: '2025-05-15',
          milestones: [
            {
              id: 'legal_m1',
              description: 'Contract review completed',
              status: 'completed',
              completedDate: '2025-03-25',
              feeAmount: 300,
              paymentStatus: 'paid'
            },
            {
              id: 'legal_m2',
              description: 'Mortgage documentation review',
              status: 'in_progress',
              estimatedDate: '2025-04-15',
              feeAmount: 400,
              paymentStatus: 'pending'
            },
            {
              id: 'legal_m3',
              description: 'Completion and registration',
              status: 'not_started',
              estimatedDate: '2025-05-15',
              feeAmount: 800,
              paymentStatus: 'not_due'
            }
          ]
        },
        {
          id: 'service_002',
          type: 'surveyor',
          status: 'to_be_engaged',
          provider: {
            id: 'surv_dublin_property',
            name: 'Michael O\'Brien',
            company: 'Dublin Property Surveys',
            email: 'michael@dublinsurveys.ie',
            phone: '+353 1 345 6789',
            address: {
              street: '28 Baggot Street Lower',
              city: 'Dublin',
              county: 'Dublin',
              eircode: 'D02 R156'
            },
            credentials: {
              registration: 'Society of Chartered Surveyors Ireland - SCSI789',
              certification: 'Chartered Surveyor - MRICS',
              insurance: 'Professional Indemnity - €1M coverage'
            }
          },
          services: [
            {
              serviceId: 'survey_001',
              description: 'Pre-completion property survey',
              estimatedFee: 500,
              feeStructure: 'fixed',
              timeline: '2-3 hours inspection + 5 days report',
              deliverables: [
                'Comprehensive property inspection',
                'Snag list report',
                'Photo documentation',
                'Recommendations for completion'
              ]
            }
          ],
          scheduledDate: '2025-10-15',
          milestones: [
            {
              id: 'survey_m1',
              description: 'Property inspection',
              status: 'not_started',
              estimatedDate: '2025-10-15',
              feeAmount: 250,
              paymentStatus: 'not_due'
            },
            {
              id: 'survey_m2',
              description: 'Report delivery',
              status: 'not_started',
              estimatedDate: '2025-10-20',
              feeAmount: 250,
              paymentStatus: 'not_due'
            }
          ]
        },
        {
          id: 'service_003',
          type: 'mortgage_broker',
          status: 'completed',
          provider: {
            id: 'broker_first_home',
            name: 'Emma Walsh',
            company: 'First Home Finance',
            email: 'emma@firsthome.ie',
            phone: '+353 1 456 7890',
            address: {
              street: '45 Merrion Square',
              city: 'Dublin',
              county: 'Dublin',
              eircode: 'D02 W123'
            },
            credentials: {
              registration: 'Central Bank of Ireland - CBI456789',
              certification: 'Qualified Financial Advisor - QFA',
              insurance: 'Professional Indemnity - €1M coverage'
            }
          },
          services: [
            {
              serviceId: 'mortgage_001',
              description: 'Mortgage advisory and application',
              estimatedFee: 0, // No fee service
              feeStructure: 'commission', // Paid by lender
              timeline: '4-6 weeks',
              deliverables: [
                'Mortgage market analysis',
                'Application assistance',
                'Rate negotiation',
                'Approval coordination'
              ]
            }
          ],
          completedDate: '2025-03-28',
          milestones: [
            {
              id: 'mortgage_m1',
              description: 'Application submitted',
              status: 'completed',
              completedDate: '2025-03-20',
              feeAmount: 0,
              paymentStatus: 'not_applicable'
            },
            {
              id: 'mortgage_m2',
              description: 'Approval received',
              status: 'completed',
              completedDate: '2025-03-28',
              feeAmount: 0,
              paymentStatus: 'not_applicable'
            }
          ]
        }
      ],

      // Payment coordination and escrow
      paymentCoordination: {
        totalEstimatedFees: 2000,
        totalPaidToDate: 300,
        totalPending: 650,
        totalEscrowed: 1050,
        escrowBalance: 1050,
        
        // Payment schedule
        paymentSchedule: [
          {
            id: 'payment_001',
            dueDate: '2025-03-25',
            description: 'Solicitor - Contract review',
            amount: 300,
            provider: 'Murphy & Partners Solicitors',
            status: 'paid',
            paidDate: '2025-03-25',
            paymentMethod: 'bank_transfer',
            reference: 'PROP-SOL-001'
          },
          {
            id: 'payment_002',
            dueDate: '2025-04-15',
            description: 'Solicitor - Mortgage documentation',
            amount: 400,
            provider: 'Murphy & Partners Solicitors',
            status: 'pending',
            paymentMethod: 'escrow',
            escrowId: 'ESC_001'
          },
          {
            id: 'payment_003',
            dueDate: '2025-05-15',
            description: 'Solicitor - Completion services',
            amount: 800,
            provider: 'Murphy & Partners Solicitors',
            status: 'escrowed',
            paymentMethod: 'escrow',
            escrowId: 'ESC_002'
          },
          {
            id: 'payment_004',
            dueDate: '2025-10-15',
            description: 'Surveyor - Property inspection',
            amount: 250,
            provider: 'Dublin Property Surveys',
            status: 'not_due',
            paymentMethod: 'escrow',
            escrowId: 'ESC_003'
          },
          {
            id: 'payment_005',
            dueDate: '2025-10-20',
            description: 'Surveyor - Report delivery',
            amount: 250,
            provider: 'Dublin Property Surveys',
            status: 'not_due',
            paymentMethod: 'escrow',
            escrowId: 'ESC_003'
          }
        ],

        // Escrow accounts
        escrowAccounts: [
          {
            id: 'ESC_001',
            purpose: 'Solicitor milestone payments',
            balance: 400,
            currency: 'EUR',
            status: 'active',
            createdDate: '2025-03-18',
            beneficiary: 'Murphy & Partners Solicitors',
            releaseConditions: [
              'Mortgage documentation review completed',
              'Buyer approval of milestone completion',
              'Invoice provided'
            ],
            pendingReleases: [
              {
                amount: 400,
                milestone: 'Mortgage documentation review',
                requestedDate: '2025-04-10',
                status: 'awaiting_milestone_completion'
              }
            ]
          },
          {
            id: 'ESC_002',
            purpose: 'Completion services',
            balance: 800,
            currency: 'EUR',
            status: 'active',
            createdDate: '2025-03-18',
            beneficiary: 'Murphy & Partners Solicitors',
            releaseConditions: [
              'Property completion confirmed',
              'Land Registry registration initiated',
              'Final invoice provided'
            ]
          },
          {
            id: 'ESC_003',
            purpose: 'Survey services',
            balance: 500,
            currency: 'EUR',
            status: 'pending_service',
            createdDate: '2025-03-18',
            beneficiary: 'Dublin Property Surveys',
            releaseConditions: [
              'Property inspection completed',
              'Survey report delivered',
              'Buyer approval of report'
            ]
          }
        ]
      },

      // PROP.ie coordination services
      propieCoordination: {
        serviceFee: 0, // Included in platform
        services: [
          'Payment coordination and escrow management',
          'Professional service provider verification',
          'Milestone tracking and approval workflows',
          'Communication coordination between all parties',
          'Dispute resolution assistance',
          'Compliance monitoring and reporting'
        ],
        contactPerson: {
          name: 'David Kelly',
          title: 'Professional Services Coordinator',
          email: 'david.kelly@propie.ie',
          phone: '+353 1 567 8901',
          availability: 'Monday-Friday 9AM-6PM'
        },
        supportTickets: [
          {
            id: 'TICKET_001',
            subject: 'Solicitor payment coordination',
            status: 'resolved',
            createdDate: '2025-03-20',
            resolvedDate: '2025-03-21'
          }
        ]
      },

      // Compliance and audit trail
      compliance: {
        amlChecks: {
          buyerVerified: true,
          professionalsVerified: true,
          lastCheck: '2025-03-18',
          status: 'compliant'
        },
        regulatoryCompliance: {
          centralBankRequirements: 'met',
          dataProtection: 'gdpr_compliant',
          financialRegulations: 'compliant',
          lastAudit: '2025-02-15'
        },
        insuranceCoverage: {
          propieInsurance: '€10M Professional Indemnity',
          escrowInsurance: '€5M Client Money Protection',
          providerInsurance: 'Verified for all engaged professionals'
        }
      },

      // Analytics and insights
      analytics: {
        averageProcessingTime: '3.2 days',
        paymentSuccessRate: 99.8,
        professionalSatisfactionRating: 4.9,
        buyerSatisfactionRating: 4.8,
        disputeRate: 0.1,
        costSavingsVsTraditional: '15-25%',
        timeToCompletion: 'Reduced by 40%'
      }
    };

    // Apply filters if provided
    let filteredData = mockPaymentData;
    if (status) {
      filteredData.professionalServices = filteredData.professionalServices.filter(
        service => service.status === status
      );
    }

    const response = {
      success: true,
      data: filteredData,
      coordination: {
        totalProfessionals: mockPaymentData.professionalServices.length,
        activeEscrows: mockPaymentData.paymentCoordination.escrowAccounts.filter(e => e.status === 'active').length,
        pendingPayments: mockPaymentData.paymentCoordination.paymentSchedule.filter(p => p.status === 'pending').length,
        coordinationStatus: 'optimal'
      },
      timestamp: new Date().toISOString()
    };

    // Log successful response
    logger.info('Professional services payment data provided', {
      userId,
      purchaseId: mockPaymentData.purchase.id,
      totalFees: mockPaymentData.paymentCoordination.totalEstimatedFees,
      escrowBalance: mockPaymentData.paymentCoordination.escrowBalance
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Professional services payment API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch professional services payment data'
      },
      { status: 500 }
    );
  }
}

// POST /api/payments/professional-services - Create payment request or engage professional
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.email;
    const body = await request.json();
    const { action, data } = body;

    // Log the creation request
    logger.info('Professional services payment action requested', {
      userId,
      action,
      timestamp: new Date().toISOString()
    });

    switch (action) {
      case 'engage_professional':
        const professionalData = ProfessionalServiceSchema.parse(data);
        
        // In production, this would:
        // 1. Verify professional credentials
        // 2. Create service agreement
        // 3. Set up escrow accounts
        // 4. Send engagement notifications
        
        const engagement = {
          id: `service_${Date.now()}`,
          ...professionalData,
          status: 'pending_acceptance',
          createdAt: new Date().toISOString(),
          escrowSetup: true,
          totalEstimatedFees: professionalData.services.reduce((sum, service) => sum + service.estimatedFee, 0)
        };

        logger.info('Professional service engagement created', {
          userId,
          engagementId: engagement.id,
          professionalType: professionalData.type,
          totalFees: engagement.totalEstimatedFees
        });

        return NextResponse.json({
          success: true,
          message: 'Professional service engagement created successfully',
          data: engagement,
          nextSteps: [
            'Professional will receive engagement notification',
            'Escrow account will be set up upon acceptance',
            'Service agreement will be executed'
          ],
          timestamp: new Date().toISOString()
        });

      case 'payment_request':
        const paymentData = PaymentRequestSchema.parse(data);
        
        const payment = {
          id: `payment_${Date.now()}`,
          ...paymentData,
          status: paymentData.escrowRequired ? 'escrowed' : 'pending',
          createdAt: new Date().toISOString(),
          expectedProcessingTime: '1-3 business days',
          fees: {
            amount: paymentData.amount,
            netAmount: paymentData.netAmount || paymentData.amount,
            vatAmount: paymentData.vatAmount || 0,
            propieProcessingFee: 0 // Included in platform service
          }
        };

        logger.info('Payment request created', {
          userId,
          paymentId: payment.id,
          amount: paymentData.amount,
          serviceProviderId: paymentData.serviceProviderId,
          escrowRequired: paymentData.escrowRequired
        });

        return NextResponse.json({
          success: true,
          message: 'Payment request created successfully',
          data: payment,
          processingInfo: {
            expectedCompletion: paymentData.escrowRequired ? 'Upon milestone completion' : '1-3 business days',
            trackingReference: payment.id,
            coordinationSupport: 'Available 9AM-6PM weekdays'
          },
          timestamp: new Date().toISOString()
        });

      case 'escrow_release':
        const releaseData = EscrowReleaseSchema.parse(data);
        
        const release = {
          id: `release_${Date.now()}`,
          ...releaseData,
          status: 'pending_approval',
          createdAt: new Date().toISOString(),
          estimatedReleaseDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
          approvalWorkflow: 'multi_party_approval_required'
        };

        logger.info('Escrow release request created', {
          userId,
          releaseId: release.id,
          escrowId: releaseData.escrowId,
          releaseAmount: releaseData.releaseAmount,
          reason: releaseData.releaseReason
        });

        return NextResponse.json({
          success: true,
          message: 'Escrow release request created successfully',
          data: release,
          approvalProcess: {
            requiredApprovals: releaseData.approvals.length,
            estimatedProcessingTime: '2-5 business days',
            nextSteps: 'Awaiting approvals from all required parties'
          },
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be "engage_professional", "payment_request", or "escrow_release"' },
          { status: 400 }
        );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Professional services payment validation error', {
        errors: error.errors,
        userId: session?.user?.email
      });

      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      );
    }

    logger.error('Professional services payment action error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process professional services payment action'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/payments/professional-services - Update payment or escrow status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.email;
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const escrowId = searchParams.get('escrowId');
    
    if (!paymentId && !escrowId) {
      return NextResponse.json(
        { error: 'Missing required parameter: paymentId or escrowId' },
        { status: 400 }
      );
    }

    const updates = await request.json();

    // Log the update request
    logger.info('Professional services payment update requested', {
      userId,
      paymentId,
      escrowId,
      updates: Object.keys(updates),
      timestamp: new Date().toISOString()
    });

    // In production, this would update payment systems and trigger workflows
    const updatedItem = {
      id: paymentId || escrowId,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
      auditTrail: {
        action: 'status_update',
        previousValues: {}, // Would contain previous values
        newValues: updates,
        timestamp: new Date().toISOString(),
        updatedBy: userId
      }
    };

    logger.info('Professional services payment updated', {
      userId,
      itemId: paymentId || escrowId,
      updatedFields: Object.keys(updates)
    });

    return NextResponse.json({
      success: true,
      message: 'Payment coordination updated successfully',
      data: updatedItem,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Professional services payment update error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to update professional services payment'
      },
      { status: 500 }
    );
  }
}