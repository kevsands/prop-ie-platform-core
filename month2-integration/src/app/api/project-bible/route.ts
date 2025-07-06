/**
 * API Route: /api/project-bible
 * Comprehensive project documentation and management system
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';

interface ProjectBibleRequest {
  projectId: string;
  section?: 'overview' | 'technical' | 'financial' | 'legal' | 'marketing' | 'timeline' | 'risks';
  action?: 'create' | 'update' | 'export';
  data?: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const section = searchParams.get('section');
    const format = searchParams.get('format') || 'json';

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Comprehensive project bible data structure
    const projectBible = {
      projectId,
      generatedAt: new Date().toISOString(),
      version: '2.1.0',
      
      overview: {
        projectName: 'Fitzgerald Gardens',
        projectCode: 'FG-2025',
        description: 'Premium residential development in Dublin',
        vision: 'Creating sustainable, modern living spaces for families',
        objectives: [
          'Deliver 48 high-quality residential units',
          'Achieve A1 BER rating across all units',
          'Complete construction by Q4 2025',
          'Maintain 15% profit margin'
        ],
        keyStakeholders: [
          { role: 'Developer', name: 'Prop Development Ltd', contact: 'developer@prop.ie' },
          { role: 'Architect', name: 'Modern Design Studio', contact: 'architect@modern.ie' },
          { role: 'Main Contractor', name: 'Dublin Builders Ltd', contact: 'contractor@dublin.ie' }
        ]
      },
      
      technical: {
        specifications: {
          totalUnits: 48,
          unitTypes: [
            { type: '2-bed townhouse', count: 16, size: '85 sqm' },
            { type: '3-bed semi-detached', count: 20, size: '110 sqm' },
            { type: '4-bed detached', count: 12, size: '140 sqm' }
          ],
          buildingStandards: 'Building Regulations 2019',
          energyRating: 'A1 BER minimum',
          materials: {
            structure: 'Reinforced concrete and steel frame',
            external: 'Brick and render facade',
            roofing: 'Slate tiles with solar panel integration',
            insulation: 'High-performance mineral wool'
          }
        },
        infrastructure: {
          utilities: ['Electricity', 'Gas', 'Water', 'Sewerage', 'Telecommunications'],
          roads: 'New access road with pedestrian pathways',
          parking: '96 designated parking spaces',
          landscaping: '40% green space allocation'
        }
      },
      
      financial: {
        budget: {
          totalProjectCost: 21600000,
          landAcquisition: 5400000,
          construction: 14400000,
          professional: 1080000,
          marketing: 432000,
          contingency: 648000
        },
        funding: {
          developerEquity: 6480000,
          developmentLoan: 15120000,
          loanProvider: 'Allied Irish Bank',
          interestRate: 4.2,
          loanTerm: '24 months'
        },
        revenue: {
          grossRevenue: 25200000,
          netProfit: 3600000,
          profitMargin: 14.3,
          avgSellingPrice: 525000,
          presalesTarget: 60
        }
      },
      
      legal: {
        planningPermission: {
          reference: 'D15A/0523',
          grantedDate: '2023-04-15',
          conditions: 12,
          appeals: 'None',
          complianceStatus: 'Ongoing'
        },
        contracts: [
          { type: 'Construction Contract', value: 14400000, status: 'Executed' },
          { type: 'Professional Services', value: 1080000, status: 'Executed' },
          { type: 'Sales & Marketing', value: 432000, status: 'Pending' }
        ],
        compliance: {
          buildingControl: 'Commencement notice submitted',
          fireCompliance: 'Fire cert application submitted',
          disabilityAccess: 'Part M compliance confirmed'
        }
      },
      
      marketing: {
        strategy: {
          targetMarket: 'First-time buyers and young families',
          uniqueSellingPoints: [
            'A1 BER rating',
            'Family-friendly design',
            'Excellent transport links',
            'Green spaces and amenities'
          ],
          pricingStrategy: 'Competitive with local market',
          salesChannels: ['Direct sales', 'Property portal', 'Estate agents']
        },
        materials: {
          brochure: 'High-quality printed and digital brochure',
          website: 'Dedicated project website with virtual tours',
          showhouse: 'Furnished showhouse opening Q2 2024',
          advertising: 'Digital marketing and property portals'
        }
      },
      
      timeline: {
        majorMilestones: [
          { phase: 'Planning Permission', startDate: '2023-01-01', endDate: '2023-04-15', status: 'Complete' },
          { phase: 'Site Preparation', startDate: '2023-05-01', endDate: '2023-07-31', status: 'Complete' },
          { phase: 'Construction Phase 1', startDate: '2023-08-01', endDate: '2024-08-31', status: 'In Progress' },
          { phase: 'Construction Phase 2', startDate: '2024-09-01', endDate: '2025-06-30', status: 'Planned' },
          { phase: 'Sales Launch', startDate: '2024-02-01', endDate: '2025-12-31', status: 'Active' },
          { phase: 'First Handovers', startDate: '2025-01-01', endDate: '2025-03-31', status: 'Planned' },
          { phase: 'Project Completion', startDate: '2025-07-01', endDate: '2025-09-30', status: 'Planned' }
        ],
        criticalPath: [
          'Planning permission approval',
          'Construction financing',
          'Main contractor mobilization',
          'Infrastructure completion',
          'Building completion',
          'Final inspections'
        ]
      },
      
      risks: {
        identified: [
          {
            risk: 'Construction cost overrun',
            probability: 'Medium',
            impact: 'High',
            mitigation: 'Fixed price contract with main contractor',
            owner: 'Project Manager'
          },
          {
            risk: 'Planning condition delays',
            probability: 'Low',
            impact: 'Medium',
            mitigation: 'Early engagement with planning authority',
            owner: 'Planning Consultant'
          },
          {
            risk: 'Market downturn',
            probability: 'Medium',
            impact: 'High',
            mitigation: 'Flexible pricing and sales strategy',
            owner: 'Sales Director'
          },
          {
            risk: 'Interest rate increases',
            probability: 'Medium',
            impact: 'Medium',
            mitigation: 'Accelerated sales program',
            owner: 'Finance Director'
          }
        ],
        mitigation: {
          contingencyFund: 648000,
          insurance: {
            construction: 'Comprehensive all-risks policy',
            professional: 'Professional indemnity coverage',
            public: 'Public liability €6.5M'
          }
        }
      }
    };

    // Return specific section if requested
    if (section && projectBible[section as keyof typeof projectBible]) {
      return NextResponse.json({
        success: true,
        data: {
          projectId,
          section,
          content: projectBible[section as keyof typeof projectBible]
        }
      });
    }

    // Return full project bible
    return NextResponse.json({
      success: true,
      data: projectBible
    });

  } catch (error) {
    console.error('Error retrieving project bible:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve project bible' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: ProjectBibleRequest = await request.json();
    
    if (!body.projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Create new project bible entry
    const newEntry = {
      id: `pb_${Date.now()}`,
      projectId: body.projectId,
      section: body.section || 'overview',
      data: body.data,
      createdBy: session.user?.id,
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    };

    return NextResponse.json({
      success: true,
      data: newEntry,
      message: 'Project bible entry created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating project bible entry:', error);
    return NextResponse.json(
      { error: 'Failed to create project bible entry' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: ProjectBibleRequest = await request.json();
    
    // Update project bible section
    const updatedEntry = {
      projectId: body.projectId,
      section: body.section,
      data: body.data,
      updatedBy: session.user?.id,
      updatedAt: new Date().toISOString(),
      version: '1.1.0'
    };

    return NextResponse.json({
      success: true,
      data: updatedEntry,
      message: 'Project bible updated successfully'
    });

  } catch (error) {
    console.error('Error updating project bible:', error);
    return NextResponse.json(
      { error: 'Failed to update project bible' },
      { status: 500 }
    );
  }
}