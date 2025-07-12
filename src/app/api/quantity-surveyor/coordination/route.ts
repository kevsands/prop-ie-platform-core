import { NextRequest, NextResponse } from 'next/server';

// Mock data for Fitzgerald Gardens Quantity Surveyor project
const mockProjectData = {
  id: 'fitzgerald-gardens-qs',
  name: 'Fitzgerald Gardens Cost Management',
  totalBudget: 28500000, // €28.5M total project cost
  currentSpend: 18720000, // €18.72M spent so far
  projectPhase: 'construction',
  completionPercentage: 67,
  valuations: [
    {
      id: 'val-001',
      valuationNumber: 8,
      projectId: 'fitzgerald-gardens-qs',
      periodFrom: new Date('2025-06-01'),
      periodTo: new Date('2025-06-30'),
      status: 'certified',
      thisValuation: 1850000, // €1.85M this month
      cumulativeValue: 18720000, // €18.72M total
      retentionPercentage: 5,
      retentionAmount: 92500,
      netAmount: 1757500,
      paymentDue: new Date('2025-07-15'),
      notes: 'June 2025 progress valuation - Phase 2 superstructure completion'
    }
  ],
  boqElements: [
    {
      id: 'boq-001',
      code: 'A.1.1',
      description: 'Excavation and groundworks',
      originalQuantity: 12500,
      unit: 'm³',
      rate: 35.50,
      originalValue: 443750,
      executedQuantity: 12500,
      completionPercentage: 100,
      status: 'completed'
    },
    {
      id: 'boq-002', 
      code: 'B.2.1',
      description: 'Reinforced concrete foundations',
      originalQuantity: 2800,
      unit: 'm³',
      rate: 185.00,
      originalValue: 518000,
      executedQuantity: 2800,
      completionPercentage: 100,
      status: 'completed'
    },
    {
      id: 'boq-003',
      code: 'C.3.1', 
      description: 'Structural steelwork',
      originalQuantity: 450,
      unit: 'tonnes',
      rate: 2850.00,
      originalValue: 1282500,
      executedQuantity: 302,
      completionPercentage: 67,
      status: 'in_progress'
    },
    {
      id: 'boq-004',
      code: 'D.4.1',
      description: 'External envelope - brick/block',
      originalQuantity: 15600,
      unit: 'm²',
      rate: 95.00,
      originalValue: 1482000,
      executedQuantity: 8736,
      completionPercentage: 56,
      status: 'in_progress'
    }
  ],
  variations: [
    {
      id: 'var-001',
      number: 'VO-023',
      description: 'Additional insulation upgrade for A-rated compliance',
      type: 'addition',
      originalValue: 0,
      revisedValue: 156000,
      impact: 156000,
      status: 'approved',
      dateRaised: new Date('2025-05-15'),
      architect: 'Sarah O\'Brien RIAI',
      reason: 'Enhanced energy efficiency requirements'
    },
    {
      id: 'var-002',
      number: 'VO-024', 
      description: 'Upgrade kitchen specifications - Phase 2 units',
      type: 'addition',
      originalValue: 0,
      revisedValue: 89500,
      impact: 89500,
      status: 'pending',
      dateRaised: new Date('2025-06-20'),
      architect: 'Sarah O\'Brien RIAI',
      reason: 'Market demand for premium finishes'
    }
  ],
  riskRegister: [
    {
      id: 'risk-001',
      category: 'cost',
      description: 'Steel price volatility affecting remaining procurement',
      probability: 'medium',
      impact: 'high',
      riskValue: 125000,
      mitigation: 'Lock in steel prices for Q3 deliveries',
      owner: 'Procurement Manager',
      status: 'active'
    },
    {
      id: 'risk-002',
      category: 'schedule',
      description: 'Weather delays impacting exterior work',
      probability: 'high',
      impact: 'medium', 
      riskValue: 75000,
      mitigation: 'Accelerate interior fit-out activities',
      owner: 'Project Manager',
      status: 'monitoring'
    }
  ],
  projectTeam: {
    quantitySurveyor: 'Michael Murphy MSCSI',
    architect: 'Sarah O\'Brien RIAI',
    engineer: 'David Walsh CEng MIEI',
    projectManager: 'Lisa Kelly PMP',
    developer: 'Fitzgerald Developments Ltd'
  },
  certifications: {
    scsiCompliance: true,
    cisCompliance: true,
    lastAuditDate: new Date('2025-06-01'),
    nextAuditDue: new Date('2025-09-01')
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const projectId = searchParams.get('projectId');

  try {
    switch (action) {
      case 'get_project':
        if (projectId === 'fitzgerald-gardens-qs') {
          return NextResponse.json({
            success: true,
            project: mockProjectData
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'Project not found'
          }, { status: 404 });
        }

      case 'get_valuations':
        return NextResponse.json({
          success: true,
          valuations: mockProjectData.valuations
        });

      case 'get_boq':
        return NextResponse.json({
          success: true,
          boqElements: mockProjectData.boqElements
        });

      case 'get_variations':
        return NextResponse.json({
          success: true,
          variations: mockProjectData.variations
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Quantity Surveyor API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const body = await request.json();

    switch (action) {
      case 'create_valuation':
        // In a real implementation, this would save to database
        console.log('Creating new valuation:', body);
        return NextResponse.json({
          success: true,
          message: 'Valuation created successfully',
          id: `val-${Date.now()}`
        });

      case 'submit_variation':
        console.log('Submitting variation:', body);
        return NextResponse.json({
          success: true,
          message: 'Variation submitted for approval',
          id: `var-${Date.now()}`
        });

      case 'update_boq':
        console.log('Updating BOQ element:', body);
        return NextResponse.json({
          success: true,
          message: 'BOQ element updated successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Quantity Surveyor API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}