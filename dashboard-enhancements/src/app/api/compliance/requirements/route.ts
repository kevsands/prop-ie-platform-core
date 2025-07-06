import { NextRequest, NextResponse } from 'next/server';

// Mock compliance requirements data
const complianceRequirements = [
  {
    id: 'req-1',
    name: 'GDPR Data Protection',
    description: 'General Data Protection Regulation compliance requirements',
    category: 'GDPR',
    priority: 'CRITICAL',
    status: 'COMPLIANT',
    regulatoryBody: 'European Data Protection Board',
    jurisdiction: 'European Union',
    controls: ['Data encryption', 'Access logs', 'User consent management'],
    lastAssessed: new Date('2024-11-15'),
    nextAssessment: new Date('2025-02-15'),
    penalties: 'Up to €20 million or 4% of annual turnover'
  },
  {
    id: 'req-2',
    name: 'Anti-Money Laundering',
    description: 'AML compliance requirements for financial transactions',
    category: 'AML',
    priority: 'HIGH',
    status: 'PARTIAL',
    regulatoryBody: 'Central Bank of Ireland',
    jurisdiction: 'Ireland',
    controls: ['Identity verification', 'Transaction monitoring', 'Suspicious activity reporting'],
    lastAssessed: new Date('2024-10-01'),
    nextAssessment: new Date('2025-01-01'),
    penalties: 'Up to €5 million'
  },
  {
    id: 'req-3',
    name: 'Know Your Customer',
    description: 'Customer identification and verification requirements',
    category: 'KYC',
    priority: 'HIGH',
    status: 'COMPLIANT',
    regulatoryBody: 'Central Bank of Ireland',
    jurisdiction: 'Ireland',
    controls: ['Identity verification', 'Address verification', 'PEP screening'],
    lastAssessed: new Date('2024-11-01'),
    nextAssessment: new Date('2025-02-01'),
    penalties: 'Administrative sanctions and fines'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  
  let filtered = [...complianceRequirements];
  
  if (category) {
    filtered = filtered.filter(req => req.category === category);
  }
  
  if (status) {
    filtered = filtered.filter(req => req.status === status);
  }
  
  if (priority) {
    filtered = filtered.filter(req => req.priority === priority);
  }
  
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRequirement = {
      id: `req-${Date.now()}`,
      ...body,
      lastAssessed: new Date(),
      nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    };
    
    complianceRequirements.push(newRequirement);
    
    return NextResponse.json(newRequirement, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create compliance requirement' },
      { status: 400 }
    );
  }
}