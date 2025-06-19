import { NextRequest, NextResponse } from 'next/server';
import { htbService } from '@/lib/services/htb-postgresql';
import { HTBClaimStatus } from '@/types/htb';

interface RouteParams {
  params: { id: string };
}

/**
 * GET - Get specific HTB claim by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    // Get claim from database
    const claim = await htbService.getClaimById(id);
    
    if (!claim) {
      return NextResponse.json({
        error: 'HTB claim not found',
        message: `Claim with ID '${id}' does not exist`
      }, { status: 404 });
    }
    
    return NextResponse.json(claim);
    
  } catch (error: any) {
    console.error('Error fetching HTB claim:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch HTB claim',
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * PUT - Update HTB claim status
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { status, updatedBy, notes } = body;
    
    if (!status || !updatedBy) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'status and updatedBy are required'
      }, { status: 400 });
    }
    
    // Validate status is a valid HTB status
    if (!Object.values(HTBClaimStatus).includes(status)) {
      return NextResponse.json({
        error: 'Invalid status',
        message: `Status must be one of: ${Object.values(HTBClaimStatus).join(', ')}`
      }, { status: 400 });
    }
    
    // Update claim status
    const updatedClaim = await htbService.updateClaimStatus(id, status, updatedBy, notes);
    
    if (!updatedClaim) {
      return NextResponse.json({
        error: 'HTB claim not found',
        message: `Claim with ID '${id}' does not exist`
      }, { status: 404 });
    }
    
    return NextResponse.json(updatedClaim);
    
  } catch (error: any) {
    console.error('Error updating HTB claim:', error);
    
    return NextResponse.json({
      error: 'Failed to update HTB claim',
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}