/**
 * Reservations API
 * Handles property reservations and booking management
 */

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';
import ReservationService, { 
  CreateReservationRequest, 
  ReservationSearchFilters,
  ReservationStatus,
  ReservationType 
} from '@/lib/services/reservation-service';
import { PaymentType } from '@/lib/payment-config';

/**
 * GET /api/reservations - Search and list reservations
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get current user
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build search filters
    const filters: ReservationSearchFilters = {};
    
    // Parse status filter
    const statusParam = searchParams.get('status');
    if (statusParam) {
      filters.status = statusParam.split(',').filter(s => 
        Object.values(ReservationStatus).includes(s as ReservationStatus)
      ) as ReservationStatus[];
    }
    
    // Parse reservation type filter
    const typeParam = searchParams.get('type');
    if (typeParam) {
      filters.reservationType = typeParam.split(',').filter(t => 
        Object.values(ReservationType).includes(t as ReservationType)
      ) as ReservationType[];
    }
    
    // Other filters
    if (searchParams.get('developmentId')) {
      filters.developmentId = searchParams.get('developmentId')!;
    }
    
    if (searchParams.get('userId')) {
      filters.userId = searchParams.get('userId')!;
    } else {
      // Default to current user's reservations unless admin
      filters.userId = currentUser.id;
    }
    
    if (searchParams.get('expiringWithinDays')) {
      filters.expiringWithinDays = parseInt(searchParams.get('expiringWithinDays')!);
    }

    // Search reservations
    const reservations = await ReservationService.searchReservations(filters);

    // Apply pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const paginatedReservations = reservations.slice(start, end);

    return NextResponse.json({
      success: true,
      reservations: paginatedReservations,
      pagination: {
        page,
        limit,
        total: reservations.length,
        totalPages: Math.ceil(reservations.length / limit),
        hasMore: end < reservations.length
      },
      message: `Found ${reservations.length} reservations`
    });

  } catch (error: any) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({
      error: 'Failed to fetch reservations',
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * POST /api/reservations - Create new reservation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get current user
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate required fields
    const {
      propertyId,
      developmentId,
      reservationType,
      paymentType,
      amount,
      buyerDetails,
      paymentIntentId
    } = body;

    if (!propertyId || !developmentId || !reservationType || !paymentType || !amount || !buyerDetails || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyId, developmentId, reservationType, paymentType, amount, buyerDetails, paymentIntentId' },
        { status: 400 }
      );
    }

    // Validate enums
    if (!Object.values(ReservationType).includes(reservationType)) {
      return NextResponse.json(
        { error: `Invalid reservation type. Must be one of: ${Object.values(ReservationType).join(', ')}` },
        { status: 400 }
      );
    }

    if (!Object.values(PaymentType).includes(paymentType)) {
      return NextResponse.json(
        { error: `Invalid payment type. Must be one of: ${Object.values(PaymentType).join(', ')}` },
        { status: 400 }
      );
    }

    // Validate buyer details
    if (!buyerDetails.fullName || !buyerDetails.email || !buyerDetails.phone) {
      return NextResponse.json(
        { error: 'Buyer details must include fullName, email, and phone' },
        { status: 400 }
      );
    }

    // Create reservation request
    const reservationRequest: CreateReservationRequest = {
      propertyId,
      unitId: body.unitId,
      developmentId,
      reservationType,
      paymentType,
      amount,
      buyerDetails,
      appointmentDate: body.appointmentDate ? new Date(body.appointmentDate) : undefined,
      journeyId: body.journeyId,
      paymentIntentId,
      metadata: body.metadata || {}
    };

    // Create reservation
    const reservation = await ReservationService.createReservation(reservationRequest);

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservation.id,
        reservationNumber: reservation.reservationNumber,
        propertyId: reservation.propertyId,
        developmentId: reservation.developmentId,
        status: reservation.status,
        reservationType: reservation.reservationType,
        totalPropertyPrice: reservation.totalPropertyPrice,
        reservationFeeAmount: reservation.reservationFeeAmount,
        amountPaid: reservation.amountPaid,
        outstandingAmount: reservation.outstandingAmount,
        expiresAt: reservation.expiresAt,
        propertySnapshot: reservation.propertySnapshot,
        appointmentDate: reservation.appointmentDate
      },
      message: 'Reservation created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({
      error: 'Failed to create reservation',
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * Helper function to get current user
 */
async function getCurrentUser(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      const authToken = request.cookies.get('auth-token')?.value;
      if (authToken?.startsWith('dev-token-')) {
        const userId = authToken.replace('dev-token-', '');
        return await userService.getUserById(userId);
      }
    } else {
      return await userService.getCurrentUser();
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
}