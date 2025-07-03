import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/security/auditLogger';
import { z } from 'zod';

/**
 * Enterprise Unit Configuration Matrix API
 * Manages unit-specific PROP Choice configurations and availability
 * Enables developers to customize offerings per unit type, floor, and individual units
 */

// Validation schemas
const UnitConfigurationSchema = z.object({
  unitId: z.string(),
  projectId: z.string(),
  unitType: z.enum(['studio', '1bed', '2bed', '3bed', '4bed', 'penthouse', 'duplex']),
  block: z.string(),
  floor: z.number(),
  unitNumber: z.string(),
  size: z.object({
    sqft: z.number(),
    sqm: z.number()
  }),
  basePrice: z.number(),
  propChoiceConfiguration: z.object({
    enabled: z.boolean(),
    availablePackages: z.array(z.string()),
    excludedOptions: z.array(z.string()).optional(),
    customPricing: z.object({
      packageDiscounts: z.record(z.string(), z.number()).optional(),
      optionSurcharges: z.record(z.string(), z.number()).optional(),
      bundleOffers: z.array(z.object({
        packageIds: z.array(z.string()),
        discountPercentage: z.number(),
        description: z.string()
      })).optional()
    }).optional(),
    restrictions: z.object({
      deadline: z.string().datetime().optional(),
      maxUpgradeValue: z.number().optional(),
      requiresApproval: z.array(z.string()).optional()
    }).optional(),
    preselections: z.array(z.object({
      optionId: z.string(),
      forced: z.boolean(),
      reason: z.string().optional()
    })).optional()
  }),
  buyerInfo: z.object({
    buyerId: z.string().optional(),
    buyerName: z.string().optional(),
    reservationDate: z.string().datetime().optional(),
    propChoiceDeadline: z.string().datetime().optional(),
    selectionStatus: z.enum(['not_started', 'in_progress', 'finalized', 'deadline_passed']).optional()
  }).optional(),
  technicalSpecs: z.object({
    floorPlan: z.string().url().optional(),
    aspectRatio: z.string().optional(),
    balcony: z.boolean(),
    terrace: z.boolean(),
    storage: z.boolean(),
    parking: z.number().optional(),
    orientation: z.enum(['north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west']).optional()
  }).optional()
});

const BulkConfigurationSchema = z.object({
  projectId: z.string(),
  configType: z.enum(['unit_type', 'floor', 'block', 'all_units']),
  targetCriteria: z.object({
    unitTypes: z.array(z.string()).optional(),
    floors: z.array(z.number()).optional(),
    blocks: z.array(z.string()).optional(),
    unitIds: z.array(z.string()).optional()
  }),
  configuration: z.object({
    availablePackages: z.array(z.string()).optional(),
    packageDiscounts: z.record(z.string(), z.number()).optional(),
    deadline: z.string().datetime().optional(),
    restrictions: z.object({
      maxUpgradeValue: z.number().optional(),
      requiresApproval: z.array(z.string()).optional()
    }).optional()
  })
});

// GET /api/developer/prop-choice/units - Get unit configuration matrix
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
    const unitType = searchParams.get('unitType');
    const block = searchParams.get('block');
    const floor = searchParams.get('floor');
    const status = searchParams.get('status');

    // Log the API request
    logger.info('Unit configuration matrix requested', {
      userId,
      projectId,
      unitType,
      block,
      floor,
      status,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // In production, this would query unit database and configurations
    // For enterprise demo, return comprehensive unit configuration matrix
    const mockUnitMatrix = {
      project: {
        id: 'proj_fitzgerald_gardens',
        name: 'Fitzgerald Gardens',
        totalUnits: 120,
        completedUnits: 45,
        availableForPropChoice: 95,
        propChoiceDeadline: '2025-09-30T00:00:00Z'
      },

      // Unit configuration summary
      configurationSummary: {
        totalUnits: 120,
        configuredUnits: 95,
        unconfiguredUnits: 25,
        unitsWithBuyers: 45,
        pendingSelections: 18,
        finalizedSelections: 27,
        averageUpgradeValue: 18500,
        totalPotentialRevenue: 2250000
      },

      // Configuration matrix by floor and unit type
      configurationMatrix: [
        // Ground Floor - Retail/Commercial (No PROP Choice)
        {
          floor: 0,
          description: 'Ground Floor - Commercial',
          unitCount: 4,
          propChoiceEnabled: false,
          units: [
            {
              unitId: 'unit_fg_gf_01',
              unitNumber: 'GF-01',
              unitType: 'commercial',
              size: { sqft: 1200, sqm: 111 },
              status: 'commercial_space',
              propChoiceConfiguration: { enabled: false }
            }
          ]
        },

        // First Floor - 1 & 2 Bedroom Apartments
        {
          floor: 1,
          description: 'First Floor - 1 & 2 Bed Apartments',
          unitCount: 12,
          propChoiceEnabled: true,
          unitTypes: ['1bed', '2bed'],
          defaultPackages: ['essential', 'comfort', 'premium'],
          units: [
            {
              unitId: 'unit_fg_1f_01',
              unitNumber: '1F-01',
              unitType: '1bed',
              block: 'A',
              floor: 1,
              size: { sqft: 650, sqm: 60.4 },
              basePrice: 295000,
              propChoiceConfiguration: {
                enabled: true,
                availablePackages: ['essential', 'comfort', 'premium'],
                customPricing: {
                  packageDiscounts: {
                    'essential': 500,
                    'comfort': 1000
                  },
                  bundleOffers: [
                    {
                      packageIds: ['kitchen_premium', 'smart_home_basic'],
                      discountPercentage: 10,
                      description: 'First Floor Smart Kitchen Bundle'
                    }
                  ]
                },
                restrictions: {
                  deadline: '2025-08-15T00:00:00Z',
                  maxUpgradeValue: 25000
                }
              },
              buyerInfo: {
                buyerId: 'buyer_001',
                buyerName: 'Michael O\'Sullivan',
                reservationDate: '2025-03-15T00:00:00Z',
                propChoiceDeadline: '2025-08-15T00:00:00Z',
                selectionStatus: 'in_progress'
              },
              technicalSpecs: {
                floorPlan: '/floorplans/1bed-type-a.pdf',
                balcony: true,
                storage: true,
                parking: 1,
                orientation: 'south_west'
              }
            },
            {
              unitId: 'unit_fg_1f_02',
              unitNumber: '1F-02',
              unitType: '2bed',
              block: 'A',
              floor: 1,
              size: { sqft: 850, sqm: 78.9 },
              basePrice: 385000,
              propChoiceConfiguration: {
                enabled: true,
                availablePackages: ['essential', 'comfort', 'premium', 'luxury'],
                customPricing: {
                  packageDiscounts: {
                    'premium': 1500,
                    'luxury': 2000
                  }
                },
                restrictions: {
                  deadline: '2025-08-01T00:00:00Z',
                  maxUpgradeValue: 35000
                }
              },
              buyerInfo: {
                buyerId: 'buyer_002',
                buyerName: 'Emma & David Walsh',
                reservationDate: '2025-03-20T00:00:00Z',
                propChoiceDeadline: '2025-08-01T00:00:00Z',
                selectionStatus: 'finalized'
              },
              technicalSpecs: {
                floorPlan: '/floorplans/2bed-type-a.pdf',
                balcony: true,
                storage: true,
                parking: 1,
                orientation: 'south'
              }
            }
          ]
        },

        // Second Floor - Premium 2 Bedroom Apartments
        {
          floor: 2,
          description: 'Second Floor - Premium 2 Bed Apartments',
          unitCount: 10,
          propChoiceEnabled: true,
          unitTypes: ['2bed'],
          defaultPackages: ['comfort', 'premium', 'luxury'],
          specialFeatures: ['Enhanced city views', 'Premium finishes standard'],
          units: [
            {
              unitId: 'unit_fg_2b_15',
              unitNumber: '2B-15',
              unitType: '2bed',
              block: 'B',
              floor: 2,
              size: { sqft: 950, sqm: 88.3 },
              basePrice: 415200,
              propChoiceConfiguration: {
                enabled: true,
                availablePackages: ['comfort', 'premium', 'luxury'],
                excludedOptions: ['basic_kitchen'], // Premium floor excludes basic options
                customPricing: {
                  packageDiscounts: {
                    'premium': 2000,
                    'luxury': 3000
                  },
                  bundleOffers: [
                    {
                      packageIds: ['kitchen_luxury', 'bathroom_premium', 'smart_home_advanced'],
                      discountPercentage: 15,
                      description: 'Premium Floor Luxury Bundle'
                    }
                  ]
                },
                restrictions: {
                  deadline: '2025-07-30T00:00:00Z',
                  maxUpgradeValue: 45000,
                  requiresApproval: ['custom_modifications']
                },
                preselections: [
                  {
                    optionId: 'premium_flooring',
                    forced: true,
                    reason: 'Standard for second floor units'
                  }
                ]
              },
              buyerInfo: {
                buyerId: 'buyer_sarah_oconnor',
                buyerName: 'Sarah O\'Connor',
                reservationDate: '2025-03-10T00:00:00Z',
                propChoiceDeadline: '2025-07-30T00:00:00Z',
                selectionStatus: 'in_progress'
              },
              technicalSpecs: {
                floorPlan: '/floorplans/2bed-premium-type-b.pdf',
                balcony: true,
                terrace: false,
                storage: true,
                parking: 1,
                orientation: 'south_east'
              }
            }
          ]
        },

        // Penthouse Floor
        {
          floor: 6,
          description: 'Penthouse Level - Luxury Apartments',
          unitCount: 6,
          propChoiceEnabled: true,
          unitTypes: ['3bed', 'penthouse'],
          defaultPackages: ['luxury', 'bespoke'],
          specialFeatures: ['Panoramic views', 'Private terraces', 'Premium specifications'],
          units: [
            {
              unitId: 'unit_fg_ph_01',
              unitNumber: 'PH-01',
              unitType: 'penthouse',
              block: 'A',
              floor: 6,
              size: { sqft: 1850, sqm: 171.9 },
              basePrice: 995000,
              propChoiceConfiguration: {
                enabled: true,
                availablePackages: ['luxury', 'bespoke'],
                customPricing: {
                  packageDiscounts: {
                    'luxury': 5000,
                    'bespoke': 10000
                  },
                  bundleOffers: [
                    {
                      packageIds: ['kitchen_bespoke', 'bathroom_luxury', 'smart_home_premium', 'wine_cellar'],
                      discountPercentage: 20,
                      description: 'Penthouse Ultimate Living Bundle'
                    }
                  ]
                },
                restrictions: {
                  deadline: '2025-06-30T00:00:00Z',
                  maxUpgradeValue: 150000,
                  requiresApproval: ['structural_modifications', 'custom_modifications']
                }
              },
              technicalSpecs: {
                floorPlan: '/floorplans/penthouse-type-a.pdf',
                balcony: false,
                terrace: true,
                storage: true,
                parking: 2,
                orientation: 'panoramic'
              }
            }
          ]
        }
      ],

      // Package availability matrix
      packageMatrix: {
        'essential': {
          availableFloors: [1, 2, 3, 4],
          restrictedUnits: [],
          defaultDiscount: 0,
          maxUpgradeValue: 15000
        },
        'comfort': {
          availableFloors: [1, 2, 3, 4, 5],
          restrictedUnits: [],
          defaultDiscount: 500,
          maxUpgradeValue: 25000
        },
        'premium': {
          availableFloors: [2, 3, 4, 5, 6],
          restrictedUnits: [],
          defaultDiscount: 1000,
          maxUpgradeValue: 35000
        },
        'luxury': {
          availableFloors: [3, 4, 5, 6],
          restrictedUnits: ['studio'],
          defaultDiscount: 2000,
          maxUpgradeValue: 50000
        },
        'bespoke': {
          availableFloors: [6],
          restrictedUnits: ['studio', '1bed'],
          defaultDiscount: 5000,
          maxUpgradeValue: 150000
        }
      },

      // Bulk configuration templates
      configurationTemplates: [
        {
          id: 'template_first_time_buyers',
          name: 'First Time Buyer Optimized',
          description: 'Configuration optimized for first-time buyers with HTB',
          applicableUnitTypes: ['1bed', '2bed'],
          configuration: {
            availablePackages: ['essential', 'comfort'],
            packageDiscounts: {
              'essential': 1000,
              'comfort': 1500
            },
            maxUpgradeValue: 20000,
            deadline: '2025-08-31T00:00:00Z'
          }
        },
        {
          id: 'template_investor_units',
          name: 'Investor Focused Configuration',
          description: 'Rental-optimized configurations for investors',
          applicableUnitTypes: ['1bed', '2bed'],
          configuration: {
            availablePackages: ['comfort', 'premium'],
            preselections: ['durable_flooring', 'neutral_colors'],
            restrictions: {
              requiresApproval: ['luxury_finishes']
            }
          }
        }
      ],

      // Analytics and insights
      analytics: {
        conversionRates: {
          byUnitType: {
            '1bed': 78,
            '2bed': 85,
            '3bed': 92,
            'penthouse': 95
          },
          byPackage: {
            'essential': 45,
            'comfort': 65,
            'premium': 78,
            'luxury': 85,
            'bespoke': 90
          }
        },
        averageUpgradeValues: {
          byUnitType: {
            '1bed': 12500,
            '2bed': 18500,
            '3bed': 25000,
            'penthouse': 75000
          },
          byFloor: {
            1: 14000,
            2: 20000,
            3: 22000,
            4: 23000,
            5: 28000,
            6: 85000
          }
        },
        deadlinePerformance: {
          onTimeSelections: 82,
          lateSelections: 15,
          missedDeadlines: 3
        }
      }
    };

    // Apply filters if provided
    let filteredMatrix = mockUnitMatrix.configurationMatrix;
    
    if (unitType) {
      filteredMatrix = filteredMatrix.map(floor => ({
        ...floor,
        units: floor.units.filter(unit => unit.unitType === unitType)
      })).filter(floor => floor.units.length > 0);
    }

    if (block) {
      filteredMatrix = filteredMatrix.map(floor => ({
        ...floor,
        units: floor.units.filter(unit => unit.block === block)
      })).filter(floor => floor.units.length > 0);
    }

    if (floor !== null) {
      const floorNum = parseInt(floor);
      filteredMatrix = filteredMatrix.filter(f => f.floor === floorNum);
    }

    if (status) {
      filteredMatrix = filteredMatrix.map(floor => ({
        ...floor,
        units: floor.units.filter(unit => 
          unit.buyerInfo?.selectionStatus === status || 
          (status === 'available' && !unit.buyerInfo)
        )
      })).filter(floor => floor.units.length > 0);
    }

    const response = {
      success: true,
      data: {
        ...mockUnitMatrix,
        configurationMatrix: filteredMatrix
      },
      filters: {
        projectId,
        unitType,
        block,
        floor,
        status
      },
      summary: {
        totalUnitsInView: filteredMatrix.reduce((sum, floor) => sum + floor.units.length, 0),
        floorsInView: filteredMatrix.length,
        averageUpgradeValue: 18500
      },
      timestamp: new Date().toISOString()
    };

    // Log successful response
    logger.info('Unit configuration matrix provided', {
      userId,
      projectId: mockUnitMatrix.project.id,
      totalUnits: mockUnitMatrix.configurationSummary.totalUnits,
      filteredUnits: response.summary.totalUnitsInView
    });

    return NextResponse.json(response);

  } catch (error) {
    logger.error('Unit configuration matrix API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch unit configuration matrix'
      },
      { status: 500 }
    );
  }
}

// POST /api/developer/prop-choice/units - Create or update unit configuration
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
    logger.info('Unit configuration action requested', {
      userId,
      action,
      timestamp: new Date().toISOString()
    });

    switch (action) {
      case 'update_unit_configuration':
        const unitData = UnitConfigurationSchema.parse(data);
        
        // In production, this would update the unit configuration database
        const updatedUnit = {
          ...unitData,
          updatedAt: new Date().toISOString(),
          updatedBy: userId,
          configurationVersion: Date.now()
        };

        logger.info('Unit configuration updated', {
          userId,
          unitId: unitData.unitId,
          projectId: unitData.projectId,
          propChoiceEnabled: unitData.propChoiceConfiguration.enabled
        });

        return NextResponse.json({
          success: true,
          message: 'Unit configuration updated successfully',
          data: updatedUnit,
          timestamp: new Date().toISOString()
        });

      case 'bulk_configuration':
        const bulkData = BulkConfigurationSchema.parse(data);
        
        // Calculate affected units based on criteria
        const affectedUnitsCount = calculateAffectedUnits(bulkData.targetCriteria);
        
        const bulkUpdate = {
          id: `bulk_config_${Date.now()}`,
          ...bulkData,
          affectedUnits: affectedUnitsCount,
          status: 'pending_application',
          createdAt: new Date().toISOString(),
          createdBy: userId
        };

        logger.info('Bulk configuration created', {
          userId,
          configType: bulkData.configType,
          affectedUnits: affectedUnitsCount,
          projectId: bulkData.projectId
        });

        return NextResponse.json({
          success: true,
          message: 'Bulk configuration created successfully',
          data: bulkUpdate,
          preview: {
            affectedUnits: affectedUnitsCount,
            estimatedProcessingTime: `${Math.ceil(affectedUnitsCount / 10)} minutes`,
            changes: Object.keys(bulkData.configuration)
          },
          timestamp: new Date().toISOString()
        });

      case 'apply_template':
        const { templateId, targetUnits } = data;
        
        const templateApplication = {
          id: `template_app_${Date.now()}`,
          templateId,
          targetUnits,
          status: 'applied',
          appliedAt: new Date().toISOString(),
          appliedBy: userId
        };

        logger.info('Configuration template applied', {
          userId,
          templateId,
          targetUnits: targetUnits.length
        });

        return NextResponse.json({
          success: true,
          message: 'Configuration template applied successfully',
          data: templateApplication,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be "update_unit_configuration", "bulk_configuration", or "apply_template"' },
          { status: 400 }
        );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('Unit configuration validation error', {
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

    logger.error('Unit configuration action error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process unit configuration action'
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate affected units for bulk operations
function calculateAffectedUnits(criteria: any): number {
  // In production, this would query the database
  // For demo, return mock calculations
  if (criteria.unitIds) return criteria.unitIds.length;
  if (criteria.unitTypes) return criteria.unitTypes.length * 15; // ~15 units per type
  if (criteria.floors) return criteria.floors.length * 12; // ~12 units per floor
  if (criteria.blocks) return criteria.blocks.length * 30; // ~30 units per block
  return 120; // All units
}