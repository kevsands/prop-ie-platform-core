import { NextRequest, NextResponse } from 'next/server';

// Mock audit data
const complianceAudits = [
  {
    id: 'audit-1',
    name: 'Q4 2024 GDPR Audit',
    type: 'INTERNAL',
    status: 'IN_PROGRESS',
    startDate: new Date('2024-11-20'),
    endDate: new Date('2024-11-27'),
    auditor: 'Internal Compliance Team',
    scope: 'GDPR compliance across all systems',
    findings: [
      {
        id: 'finding-1',
        title: 'Incomplete data retention policy',
        severity: 'MEDIUM',
        status: 'OPEN',
        description: 'Data retention policy not fully implemented in legacy systems',
        recommendation: 'Update legacy systems to comply with retention policy',
        responsibleParty: 'IT Department',
        dueDate: new Date('2024-12-15')
      }
    ],
    overallScore: 85,
    riskLevel: 'MEDIUM'
  },
  {
    id: 'audit-2',
    name: 'AML Compliance Review',
    type: 'EXTERNAL',
    status: 'COMPLETED',
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-10-15'),
    auditor: 'PwC Ireland',
    scope: 'Anti-money laundering procedures and controls',
    findings: [
      {
        id: 'finding-2',
        title: 'Enhanced due diligence procedures needed',
        severity: 'HIGH',
        status: 'RESOLVED',
        description: 'High-risk customers require additional verification steps',
        recommendation: 'Implement enhanced due diligence workflow',
        responsibleParty: 'Compliance Department',
        dueDate: new Date('2024-11-01')
      }
    ],
    overallScore: 78,
    riskLevel: 'MEDIUM'
  },
  {
    id: 'audit-3',
    name: 'Data Security Assessment',
    type: 'INTERNAL',
    status: 'SCHEDULED',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-10'),
    auditor: 'Security Team',
    scope: 'End-to-end data security and encryption',
    findings: [],
    overallScore: null,
    riskLevel: null
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let filtered = [...complianceAudits];

  if (status) {
    filtered = filtered.filter(audit => audit.status === status);
  }

  if (type) {
    filtered = filtered.filter(audit => audit.type === type);
  }

  if (startDate) {
    const start = new Date(startDate);
    filtered = filtered.filter(audit => audit.startDate>= start);
  }

  if (endDate) {
    const end = new Date(endDate);
    filtered = filtered.filter(audit => audit.startDate <= end);
  }

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();
    const newAudit: any = {
      id: `audit-${Date.now()}`,
      ...(body as Record<string, any>),
      findings: [],
      overallScore: null,
      riskLevel: null
    };

    complianceAudits.push(newAudit);

    return NextResponse.json(newAudit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create audit' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as any;
    const { id, ...updates } = body;

    const auditIndex = complianceAudits.findIndex(audit => audit.id === id);
    if (auditIndex === -1) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    complianceAudits[auditIndex] = {
      ...complianceAudits[auditIndex],
      ...updates
    };

    return NextResponse.json(complianceAudits[auditIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update audit' },
      { status: 400 }
    );
  }
}