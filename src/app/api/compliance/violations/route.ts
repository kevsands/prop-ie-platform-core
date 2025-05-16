import { NextRequest, NextResponse } from 'next/server';

// Mock compliance violations data
const complianceViolations = [
  {
    id: 'violation-1',
    title: 'Data Retention Policy Violation',
    description: 'User data retained beyond specified period in backup systems',
    category: 'GDPR',
    severity: 'HIGH',
    status: 'UNDER_REVIEW',
    detectedDate: new Date('2024-11-15'),
    reportedBy: 'System Audit',
    affectedSystems: ['Backup Server A', 'Archive Database'],
    requiredAction: 'Purge data beyond retention period and update retention scripts',
    deadline: new Date('2024-12-01'),
    assignedTo: 'IT Operations Team',
    rootCause: 'Automated deletion script failure',
    impactAssessment: {
      dataSubjects: 1500,
      financialImpact: 'Potential fine up to €50,000',
      reputationalImpact: 'LOW',
      operationalImpact: 'MEDIUM'
    },
    remediationSteps: [
      {
        step: 'Identify all affected data',
        status: 'COMPLETED',
        completedDate: new Date('2024-11-16')
      },
      {
        step: 'Update retention scripts',
        status: 'IN_PROGRESS',
        completedDate: null
      },
      {
        step: 'Purge non-compliant data',
        status: 'PENDING',
        completedDate: null
      }
    ],
    notes: [
      {
        author: 'John Smith',
        date: new Date('2024-11-16'),
        content: 'Initial assessment completed. Working with IT to resolve.'
      }
    ]
  },
  {
    id: 'violation-2',
    name: 'KYC Documentation Gap',
    description: 'Missing identity verification documents for 12 high-value accounts',
    category: 'KYC',
    severity: 'CRITICAL',
    status: 'IN_REMEDIATION',
    detectedDate: new Date('2024-11-10'),
    reportedBy: 'Internal Audit',
    affectedSystems: ['Customer Database', 'Document Management System'],
    requiredAction: 'Obtain missing KYC documents and update verification procedures',
    deadline: new Date('2024-11-25'),
    assignedTo: 'Compliance Team',
    rootCause: 'Manual process oversight',
    impactAssessment: {
      dataSubjects: 12,
      financialImpact: 'Transaction freeze on affected accounts',
      reputationalImpact: 'MEDIUM',
      operationalImpact: 'HIGH'
    },
    remediationSteps: [
      {
        step: 'Contact affected customers',
        status: 'COMPLETED',
        completedDate: new Date('2024-11-11')
      },
      {
        step: 'Collect missing documents',
        status: 'IN_PROGRESS',
        completedDate: null
      },
      {
        step: 'Update verification system',
        status: 'PENDING',
        completedDate: null
      }
    ],
    notes: [
      {
        author: 'Sarah Johnson',
        date: new Date('2024-11-11'),
        content: 'Customers contacted. 8 of 12 have responded.'
      },
      {
        author: 'Sarah Johnson',
        date: new Date('2024-11-18'),
        content: '10 of 12 documents received. Following up on remaining 2.'
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const severity = searchParams.get('severity');
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  let filtered = [...complianceViolations];
  
  if (category) {
    filtered = filtered.filter(violation => violation.category === category);
  }
  
  if (severity) {
    filtered = filtered.filter(violation => violation.severity === severity);
  }
  
  if (status) {
    filtered = filtered.filter(violation => violation.status === status);
  }
  
  if (startDate) {
    const start = new Date(startDate);
    filtered = filtered.filter(violation => violation.detectedDate >= start);
  }
  
  if (endDate) {
    const end = new Date(endDate);
    filtered = filtered.filter(violation => violation.detectedDate <= end);
  }
  
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newViolation = {
      id: `violation-${Date.now()}`,
      ...body,
      detectedDate: new Date(),
      status: 'OPEN',
      remediationSteps: body.remediationSteps || [],
      notes: [{
        author: body.reportedBy,
        date: new Date(),
        content: 'Violation reported'
      }]
    };
    
    complianceViolations.push(newViolation);
    
    return NextResponse.json(newViolation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create violation' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const violationIndex = complianceViolations.findIndex(v => v.id === id);
    if (violationIndex === -1) {
      return NextResponse.json(
        { error: 'Violation not found' },
        { status: 404 }
      );
    }
    
    const existingViolation = complianceViolations[violationIndex];
    
    // Add note if status changed
    if (updates.status && updates.status !== existingViolation.status) {
      updates.notes = [
        ...(existingViolation.notes || []),
        {
          author: updates.updatedBy || 'System',
          date: new Date(),
          content: `Status changed from ${existingViolation.status} to ${updates.status}`
        }
      ];
    }
    
    complianceViolations[violationIndex] = {
      ...existingViolation,
      ...updates
    };
    
    return NextResponse.json(complianceViolations[violationIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update violation' },
      { status: 400 }
    );
  }
}