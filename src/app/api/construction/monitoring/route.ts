import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/security/auditLogger';
import { z } from 'zod';

/**
 * Enterprise Construction Monitoring API
 * Real-time construction progress tracking for off-plan properties
 * Integrates with IoT sensors, drone surveys, and quality management systems
 */

// Validation schemas
const ConstructionUpdateSchema = z.object({
  projectId: z.string(),
  unitId: z.string().optional(),
  milestone: z.enum([
    'site_preparation',
    'foundation',
    'structure_complete',
    'roof_complete',
    'windows_doors',
    'mechanical_electrical',
    'interior_finishes',
    'prop_choice_installation',
    'final_inspection',
    'completion_ready'
  ]),
  status: z.enum(['not_started', 'in_progress', 'completed', 'delayed', 'on_hold']),
  progressPercentage: z.number().min(0).max(100),
  description: z.string(),
  images: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
  documents: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string()
  })).optional(),
  qualityChecks: z.array(z.object({
    checkId: z.string(),
    description: z.string(),
    status: z.enum(['pass', 'fail', 'requires_attention']),
    inspector: z.string(),
    date: z.string()
  })).optional(),
  estimatedCompletion: z.string().optional(),
  delays: z.array(z.object({
    reason: z.string(),
    impact: z.string(),
    newDate: z.string()
  })).optional()
});

const QualityInspectionSchema = z.object({
  projectId: z.string(),
  unitId: z.string().optional(),
  inspectionType: z.enum([
    'structural',
    'electrical',
    'plumbing',
    'hvac',
    'finishes',
    'fire_safety',
    'accessibility',
    'energy_efficiency',
    'overall_quality'
  ]),
  inspector: z.object({
    name: z.string(),
    company: z.string(),
    certification: z.string(),
    contact: z.string()
  }),
  findings: z.array(z.object({
    category: z.string(),
    description: z.string(),
    severity: z.enum(['minor', 'major', 'critical']),
    status: z.enum(['open', 'in_progress', 'resolved']),
    images: z.array(z.string().url()).optional(),
    recommendedAction: z.string()
  })),
  overallRating: z.enum(['excellent', 'good', 'satisfactory', 'needs_improvement', 'unsatisfactory']),
  certificationStatus: z.enum(['pending', 'approved', 'conditional', 'rejected']),
  followUpRequired: z.boolean(),
  followUpDate: z.string().optional()
});

// GET /api/construction/monitoring - Get construction progress data
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
    const projectId = searchParams.get('projectId');
    const unitId = searchParams.get('unitId');
    const purchaseId = searchParams.get('purchaseId');
    const timeframe = searchParams.get('timeframe') || '30d';

    // Log the API request
    logger.info('Construction monitoring data requested', {
      userId,
      projectId,
      unitId,
      purchaseId,
      timeframe,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // In production, this would query IoT sensors, construction management systems, etc.
    // For enterprise demo, return comprehensive construction monitoring data
    const mockConstructionData = {
      project: {
        id: 'proj_fitzgerald_gardens',
        name: 'Fitzgerald Gardens',
        developer: 'Premium Developments Ltd',
        location: 'Sandyford, Dublin 18',
        totalUnits: 120,
        startDate: '2025-05-15',
        estimatedCompletion: '2026-11-15',
        currentPhase: 'foundation'
      },

      // Overall project progress
      overallProgress: {
        percentage: 25,
        currentMilestone: 'foundation',
        milestonesCompleted: 2,
        totalMilestones: 10,
        onSchedule: true,
        estimatedDelay: 0,
        nextMilestone: {
          name: 'structure_complete',
          estimatedDate: '2025-09-30',
          daysRemaining: 95
        }
      },

      // Unit-specific progress (if unitId provided)
      unitProgress: unitId ? {
        unitId: 'unit_fg_2b_15',
        unitName: 'Apartment 15, Block A',
        buyer: 'Sarah O\'Connor',
        currentProgress: 30,
        propChoiceStatus: 'selections_finalized',
        estimatedCompletion: '2025-11-10',
        milestones: [
          {
            id: 'site_preparation',
            name: 'Site Preparation',
            status: 'completed',
            completedDate: '2025-05-20',
            progress: 100,
            description: 'Site cleared and prepared for foundation work'
          },
          {
            id: 'foundation',
            name: 'Foundation Work',
            status: 'in_progress',
            startDate: '2025-05-25',
            progress: 75,
            estimatedCompletion: '2025-07-15',
            description: 'Foundation and basement construction in progress',
            updates: [
              {
                date: '2025-06-15',
                description: 'Foundation concrete poured for Block A',
                images: ['/construction/foundation-block-a-1.jpg'],
                inspector: 'John Murphy, Structural Engineer'
              }
            ]
          },
          {
            id: 'structure_complete',
            name: 'Structure Complete',
            status: 'not_started',
            estimatedStart: '2025-07-20',
            estimatedCompletion: '2025-09-30',
            progress: 0,
            description: 'Main structural work and floor slabs'
          }
        ]
      } : null,

      // Recent updates (last 30 days)
      recentUpdates: [
        {
          id: 'update_001',
          date: '2025-06-15T09:00:00Z',
          type: 'milestone_progress',
          title: 'Foundation Work - Block A Progress',
          description: 'Foundation concrete poured for Block A apartments 1-30. Structural steel delivery scheduled for next week.',
          projectId: 'proj_fitzgerald_gardens',
          milestone: 'foundation',
          progress: 75,
          images: [
            '/construction/foundation-concrete-pour.jpg',
            '/construction/steel-reinforcement.jpg'
          ],
          qualityScore: 'excellent',
          onSchedule: true
        },
        {
          id: 'update_002',
          date: '2025-06-10T14:30:00Z',
          type: 'prop_choice_update',
          title: 'PROP Choice Kitchen Installation Planning',
          description: 'Kitchen specifications finalized for units with premium package selections. Installation scheduled for Q4 2025.',
          affectedUnits: ['unit_fg_2b_15', 'unit_fg_3b_08'],
          installationPhase: 'interior_finishes',
          estimatedInstallation: '2025-10-15'
        },
        {
          id: 'update_003',
          date: '2025-06-08T11:15:00Z',
          type: 'quality_inspection',
          title: 'Weekly Quality Inspection - Foundation',
          description: 'Independent structural engineer completed foundation inspection. All quality checks passed.',
          inspector: 'Sarah Kelly, Chartered Engineer',
          findings: 'All foundation work meets building regulations and design specifications',
          overallRating: 'excellent',
          certificationStatus: 'approved'
        }
      ],

      // Quality inspections
      qualityInspections: [
        {
          id: 'inspection_001',
          date: '2025-06-08T11:15:00Z',
          type: 'structural',
          phase: 'foundation',
          inspector: {
            name: 'Sarah Kelly',
            company: 'Kelly Engineering Consultants',
            certification: 'Chartered Engineer (CEng)',
            contact: 'sarah@kellyeng.ie'
          },
          findings: [
            {
              category: 'Concrete Quality',
              description: 'Foundation concrete meets C30/37 specification',
              severity: 'minor',
              status: 'resolved',
              recommendedAction: 'Continue with standard curing process'
            }
          ],
          overallRating: 'excellent',
          certificationStatus: 'approved',
          followUpRequired: false
        }
      ],

      // Environmental monitoring (IoT sensors)
      environmentalData: {
        lastUpdated: '2025-06-15T16:00:00Z',
        sensors: [
          {
            id: 'sensor_001',
            type: 'air_quality',
            location: 'Block A - Level 3',
            reading: {
              pm25: 8.2,
              pm10: 12.5,
              co2: 420,
              humidity: 65,
              temperature: 22.5
            },
            status: 'normal',
            alerts: []
          },
          {
            id: 'sensor_002',
            type: 'noise_monitoring',
            location: 'Site Perimeter',
            reading: {
              decibelLevel: 72,
              averageDaily: 68,
              peakHours: '09:00-17:00'
            },
            status: 'within_limits',
            alerts: []
          }
        ]
      },

      // Safety monitoring
      safetyData: {
        incidentFreedays: 145,
        safetyRating: 'A+',
        lastInspection: '2025-06-10T09:00:00Z',
        complianceStatus: 'fully_compliant',
        certifications: [
          {
            type: 'HSE Safety Certification',
            status: 'current',
            expiryDate: '2026-05-15',
            certificationNumber: 'HSE-2025-FG-001'
          }
        ]
      },

      // Delivery tracking (for PROP Choice items)
      deliveryTracking: [
        {
          orderId: 'order_001',
          buyerName: 'Sarah O\'Connor',
          items: ['Premium Kitchen Package', 'Smart Home Technology'],
          status: 'in_production',
          estimatedDelivery: '2025-09-15',
          installationWindow: '2025-10-01 to 2025-10-15',
          supplier: 'Premier Kitchens Ltd',
          trackingReference: 'PKL-2025-0015'
        }
      ],

      // Communication log
      communicationsLog: [
        {
          id: 'comm_001',
          date: '2025-06-15T10:00:00Z',
          type: 'email',
          recipients: ['buyers', 'solicitors'],
          subject: 'Construction Progress Update - June 2025',
          status: 'sent',
          openRate: '92%'
        },
        {
          id: 'comm_002',
          date: '2025-06-10T15:30:00Z',
          type: 'sms',
          recipients: ['buyers'],
          message: 'Foundation work ahead of schedule. Next update: 25 June',
          status: 'delivered',
          deliveryRate: '98%'
        }
      ],

      // Analytics and metrics
      analytics: {
        constructionVelocity: 'on_schedule',
        qualityTrend: 'improving',
        buyerSatisfaction: 4.8,
        onTimeDeliveryRate: 95,
        averageTimeToCompletion: '18.2 months',
        budgetVariance: '+2.3%', // Positive indicates under budget
        safetyIncidents: 0,
        environmentalCompliance: 100
      }
    };

    // Calculate real-time metrics
    const metrics = {
      totalUpdates: mockConstructionData.recentUpdates.length,
      qualityScore: 'excellent',
      scheduleAdherence: 98.5,
      buyerEngagement: 87,
      nextMilestoneEta: '2025-09-30',
      constructionPhase: 'foundation',
      overallHealth: 'excellent'
    };

    const response = {
      success: true,
      data: mockConstructionData,
      metrics,
      realTimeData: {
        lastSensorUpdate: mockConstructionData.environmentalData.lastUpdated,
        activeSensors: mockConstructionData.environmentalData.sensors.length,
        systemStatus: 'operational'
      },
      timestamp: new Date().toISOString()
    };

    // Log successful response
    logger.info('Construction monitoring data provided', {
      userId,
      projectId: mockConstructionData.project.id,
      overallProgress: mockConstructionData.overallProgress.percentage,
      updatesProvided: mockConstructionData.recentUpdates.length
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Construction monitoring API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch construction monitoring data'
      },
      { status: 500 }
    );
  }
}

// POST /api/construction/monitoring - Create construction update or inspection
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
    const { type, data } = body;

    // Log the creation request
    logger.info('Construction monitoring data creation requested', {
      userId,
      type,
      timestamp: new Date().toISOString()
    });

    if (type === 'progress_update') {
      // Validate construction update data
      const validatedData = ConstructionUpdateSchema.parse(data);
      
      // In production, this would:
      // 1. Store in construction management database
      // 2. Update project timelines
      // 3. Trigger notifications to buyers
      // 4. Update real-time dashboards
      
      const newUpdate = {
        id: `update_${Date.now()}`,
        ...validatedData,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        verified: false,
        approvalStatus: 'pending'
      };

      logger.info('Construction update created', {
        userId,
        updateId: newUpdate.id,
        projectId: validatedData.projectId,
        milestone: validatedData.milestone,
        progress: validatedData.progressPercentage
      });

      return NextResponse.json({
        success: true,
        message: 'Construction update created successfully',
        data: newUpdate,
        timestamp: new Date().toISOString()
      });

    } else if (type === 'quality_inspection') {
      // Validate quality inspection data
      const validatedData = QualityInspectionSchema.parse(data);
      
      const newInspection = {
        id: `inspection_${Date.now()}`,
        ...validatedData,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        status: 'completed',
        reportGenerated: true
      };

      logger.info('Quality inspection created', {
        userId,
        inspectionId: newInspection.id,
        projectId: validatedData.projectId,
        inspectionType: validatedData.inspectionType,
        overallRating: validatedData.overallRating
      });

      return NextResponse.json({
        success: true,
        message: 'Quality inspection recorded successfully',
        data: newInspection,
        timestamp: new Date().toISOString()
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "progress_update" or "quality_inspection"' },
        { status: 400 }
      );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Construction monitoring validation error', {
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

    logger.error('Construction monitoring creation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to create construction monitoring data'
      },
      { status: 500 }
    );
  }
}

// PUT /api/construction/monitoring - Update construction progress or inspection
export async function PUT(request: NextRequest) {
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
    const updateId = searchParams.get('updateId');
    const inspectionId = searchParams.get('inspectionId');
    
    if (!updateId && !inspectionId) {
      return NextResponse.json(
        { error: 'Missing required parameter: updateId or inspectionId' },
        { status: 400 }
      );
    }

    const updates = await request.json();

    // Log the update request
    logger.info('Construction monitoring update requested', {
      userId,
      updateId,
      inspectionId,
      updates: Object.keys(updates),
      timestamp: new Date().toISOString()
    });

    // In production, this would update the database and trigger workflows
    const updatedItem = {
      id: updateId || inspectionId,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: userId
    };

    logger.info('Construction monitoring item updated', {
      userId,
      itemId: updateId || inspectionId,
      updatedFields: Object.keys(updates)
    });

    return NextResponse.json({
      success: true,
      message: 'Construction data updated successfully',
      data: updatedItem,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Construction monitoring update error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to update construction monitoring data'
      },
      { status: 500 }
    );
  }
}