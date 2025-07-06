/**
 * API Route: /api/supply-chain
 * Enterprise supply chain management for construction projects
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';

interface SupplyChainRequest {
  projectId: string;
  type: 'procurement' | 'delivery' | 'inventory' | 'supplier' | 'order';
  action?: 'create' | 'update' | 'track' | 'analyze';
  data?: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Comprehensive supply chain data
    const supplyChainData = {
      projectId,
      lastUpdated: new Date().toISOString(),
      
      overview: {
        totalSuppliers: 23,
        activeOrders: 15,
        pendingDeliveries: 8,
        totalValue: 2400000,
        onTimeDeliveryRate: 94.2,
        costVariance: -2.3 // Under budget
      },
      
      suppliers: [
        {
          id: 'sup_001',
          name: 'Dublin Steel Supplies',
          category: 'Structural Materials',
          rating: 4.8,
          certifications: ['ISO 9001', 'CE Marking'],
          performance: {
            onTimeDelivery: 96.5,
            qualityScore: 94.2,
            costCompetitiveness: 88.7
          },
          contact: {
            name: 'John Murphy',
            email: 'j.murphy@dublinSteel.ie',
            phone: '+353 1 234 5678'
          },
          paymentTerms: '30 days',
          status: 'active'
        },
        {
          id: 'sup_002',
          name: 'Premium Windows Ltd',
          category: 'Windows & Doors',
          rating: 4.6,
          certifications: ['ISO 9001', 'Energy Rating A++'],
          performance: {
            onTimeDelivery: 92.1,
            qualityScore: 97.3,
            costCompetitiveness: 85.4
          },
          contact: {
            name: 'Sarah O\'Brien',
            email: 's.obrien@premiumwindows.ie',
            phone: '+353 1 876 5432'
          },
          paymentTerms: '45 days',
          status: 'active'
        },
        {
          id: 'sup_003',
          name: 'Irish Timber Co.',
          category: 'Timber & Carpentry',
          rating: 4.4,
          certifications: ['FSC Certified', 'PEFC Chain of Custody'],
          performance: {
            onTimeDelivery: 89.8,
            qualityScore: 91.5,
            costCompetitiveness: 92.1
          },
          contact: {
            name: 'Michael Collins',
            email: 'm.collins@irishtimber.ie',
            phone: '+353 1 567 8901'
          },
          paymentTerms: '30 days',
          status: 'active'
        }
      ],
      
      orders: [
        {
          id: 'ord_001',
          supplierId: 'sup_001',
          supplierName: 'Dublin Steel Supplies',
          description: 'Steel beams and reinforcement bars',
          orderDate: '2024-01-15',
          expectedDelivery: '2024-02-01',
          actualDelivery: null,
          value: 185000,
          status: 'confirmed',
          items: [
            { description: 'Steel I-beams 200x100mm', quantity: 50, unit: 'pieces', unitPrice: 2400 },
            { description: 'Reinforcement bars 16mm', quantity: 2000, unit: 'meters', unitPrice: 12 }
          ],
          qualityChecks: {
            required: ['Material certificates', 'Dimensional check', 'Surface inspection'],
            completed: ['Material certificates'],
            pending: ['Dimensional check', 'Surface inspection']
          }
        },
        {
          id: 'ord_002',
          supplierId: 'sup_002',
          supplierName: 'Premium Windows Ltd',
          description: 'Triple glazed windows for Phase 1',
          orderDate: '2024-01-20',
          expectedDelivery: '2024-03-15',
          actualDelivery: null,
          value: 125000,
          status: 'in_production',
          items: [
            { description: 'Triple glazed window 1200x1500mm', quantity: 48, unit: 'pieces', unitPrice: 1800 },
            { description: 'Triple glazed window 800x1200mm', quantity: 32, unit: 'pieces', unitPrice: 1400 }
          ],
          qualityChecks: {
            required: ['Energy rating verification', 'Leak test', 'Operation test'],
            completed: [],
            pending: ['Energy rating verification', 'Leak test', 'Operation test']
          }
        }
      ],
      
      deliveries: [
        {
          id: 'del_001',
          orderId: 'ord_003',
          scheduledDate: '2024-01-25',
          actualDate: '2024-01-24',
          status: 'delivered',
          driver: 'Tom Walsh',
          vehicle: 'Truck - Reg: 142-D-12345',
          recipient: 'Site Foreman - Pat Kelly',
          items: [
            { description: 'Concrete blocks', quantity: 2000, condition: 'good' },
            { description: 'Cement bags', quantity: 150, condition: 'good' }
          ],
          inspection: {
            quality: 'passed',
            quantity: 'correct',
            damage: 'none',
            inspector: 'Quality Manager - Lisa Ryan'
          }
        }
      ],
      
      inventory: {
        onSite: [
          {
            category: 'Structural Materials',
            items: [
              { material: 'Concrete blocks', quantity: 1850, unit: 'pieces', location: 'Storage Area A' },
              { material: 'Steel reinforcement', quantity: 5200, unit: 'meters', location: 'Secure Storage' }
            ]
          },
          {
            category: 'Finishing Materials',
            items: [
              { material: 'Ceramic tiles', quantity: 2400, unit: 'sqm', location: 'Warehouse B' },
              { material: 'Paint - Interior white', quantity: 180, unit: 'liters', location: 'Paint Store' }
            ]
          }
        ],
        requirements: [
          {
            phase: 'Foundation',
            materials: [
              { material: 'Ready-mix concrete', quantity: 450, unit: 'cubic meters', needed: '2024-02-15' },
              { material: 'Waterproofing membrane', quantity: 800, unit: 'sqm', needed: '2024-02-20' }
            ]
          }
        ]
      },
      
      analytics: {
        costAnalysis: {
          budgetedTotal: 2500000,
          actualSpend: 1890000,
          committed: 510000,
          variance: 100000, // Under budget
          categories: [
            { category: 'Structural', budgeted: 800000, actual: 720000, variance: 80000 },
            { category: 'MEP', budgeted: 600000, actual: 580000, variance: 20000 },
            { category: 'Finishes', budgeted: 500000, actual: 520000, variance: -20000 },
            { category: 'External Works', budgeted: 400000, actual: 350000, variance: 50000 }
          ]
        },
        performance: {
          averageDeliveryTime: 12.3, // days
          qualityIssueRate: 2.1, // percentage
          costInflation: 3.2, // percentage
          supplierReliability: 94.8 // percentage
        },
        risks: [
          {
            risk: 'Steel price volatility',
            probability: 'Medium',
            impact: 'High',
            mitigation: 'Hedging contracts in place',
            owner: 'Procurement Manager'
          },
          {
            risk: 'Supplier capacity constraints',
            probability: 'Low',
            impact: 'Medium',
            mitigation: 'Multiple supplier sources identified',
            owner: 'Supply Chain Manager'
          }
        ]
      }
    };

    // Filter by type if specified
    if (type) {
      const typeData = supplyChainData[type as keyof typeof supplyChainData];
      if (typeData) {
        return NextResponse.json({
          success: true,
          data: {
            projectId,
            type,
            content: typeData
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: supplyChainData
    });

  } catch (error) {
    console.error('Error retrieving supply chain data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve supply chain data' },
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

    const body: SupplyChainRequest = await request.json();
    
    if (!body.projectId || !body.type) {
      return NextResponse.json(
        { error: 'Project ID and type are required' },
        { status: 400 }
      );
    }

    // Create new supply chain entry based on type
    let newEntry;
    
    switch (body.type) {
      case 'order':
        newEntry = {
          id: `ord_${Date.now()}`,
          projectId: body.projectId,
          ...body.data,
          status: 'pending',
          createdBy: session.user?.id,
          createdAt: new Date().toISOString()
        };
        break;
        
      case 'supplier':
        newEntry = {
          id: `sup_${Date.now()}`,
          projectId: body.projectId,
          ...body.data,
          status: 'pending_approval',
          addedBy: session.user?.id,
          addedAt: new Date().toISOString()
        };
        break;
        
      case 'delivery':
        newEntry = {
          id: `del_${Date.now()}`,
          projectId: body.projectId,
          ...body.data,
          status: 'scheduled',
          scheduledBy: session.user?.id,
          scheduledAt: new Date().toISOString()
        };
        break;
        
      default:
        newEntry = {
          id: `sc_${Date.now()}`,
          projectId: body.projectId,
          type: body.type,
          data: body.data,
          createdBy: session.user?.id,
          createdAt: new Date().toISOString()
        };
    }

    return NextResponse.json({
      success: true,
      data: newEntry,
      message: `Supply chain ${body.type} created successfully`
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating supply chain entry:', error);
    return NextResponse.json(
      { error: 'Failed to create supply chain entry' },
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

    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('id');
    
    if (!entryId) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const updatedEntry = {
      id: entryId,
      ...body,
      updatedBy: session.user?.id,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedEntry,
      message: 'Supply chain entry updated successfully'
    });

  } catch (error) {
    console.error('Error updating supply chain entry:', error);
    return NextResponse.json(
      { error: 'Failed to update supply chain entry' },
      { status: 500 }
    );
  }
}