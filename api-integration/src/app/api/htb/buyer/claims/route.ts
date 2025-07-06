import { NextRequest, NextResponse } from 'next/server';
import { htbService } from '@/lib/services/htb-postgresql';

/**
 * POST - Create a new HTB claim
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { buyerId, propertyId, propertyPrice, requestedAmount } = body;
    
    if (!buyerId || !propertyId || !propertyPrice || !requestedAmount) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'buyerId, propertyId, propertyPrice, and requestedAmount are required'
      }, { status: 400 });
    }
    
    // Create HTB claim using real database service
    const newClaim = await htbService.createClaim({
      buyerId,
      propertyId,
      propertyPrice,
      requestedAmount,
      propertyAddress: body.propertyAddress,
      developerId: body.developerId
    });

    return NextResponse.json(newClaim, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating HTB claim:', error);
    
    return NextResponse.json({
      error: 'Failed to create HTB claim',
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * GET - Get HTB claims for a buyer
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');
    
    if (!buyerId) {
      return NextResponse.json({
        error: 'Missing buyerId parameter'
      }, { status: 400 });
    }
    
    // Get buyer's HTB claims from database
    const claims = await htbService.getBuyerClaims(buyerId);
    
    return NextResponse.json({
      claims,
      total: claims.length,
      message: 'HTB claims retrieved successfully'
    });
    
  } catch (error: any) {
    console.error('Error fetching HTB claims:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch HTB claims',
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}