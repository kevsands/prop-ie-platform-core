type Props = {
  params: Promise<{ id: string }>
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  // Mock HTB claim data
  const mockClaim = {
    id: params.id,
    buyerId: 'mock-buyer-id',
    propertyId: 'Fitzgerald Gardens - Unit 102',
    propertyPrice: 400000,
    propertyAddress: '102 Fitzgerald Gardens, Dublin',
    status: 'ACCESS_CODE_RECEIVED',
    requestedAmount: 30000,
    approvedAmount: null,
    accessCode: 'HTB-1234-ABCD-5678',
    applicationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdatedDate: new Date().toISOString(),
    DevelopmentDocument: [],
    notes: [],
    statusHistory: [
      {
        id: 'status-1',
        claimId: params.id,
        previousStatus: null,
        newStatus: 'INITIATED',
        updatedBy: 'system',
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Application initiated'
      },
      {
        id: 'status-2',
        claimId: params.id,
        previousStatus: 'INITIATED',
        newStatus: 'ACCESS_CODE_RECEIVED',
        updatedBy: 'system',
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Access code received from Revenue'
      }
    ]
  };

  return NextResponse.json(mockClaim);
}