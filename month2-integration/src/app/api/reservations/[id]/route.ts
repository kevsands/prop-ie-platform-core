/**
 * Individual Reservation API
 * Handles operations on specific reservations
 */

import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/users-production';
import ReservationService from '@/lib/services/reservation-service';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/reservations/[id] - Get specific reservation
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const reservationId = params.id;
    
    // Get current user
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get reservation
    const reservation = await ReservationService.getReservationById(reservationId);
    
    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this reservation
    if (reservation.userId !== currentUser.id && !currentUser.role?.includes('admin')) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      reservation,
      message: 'Reservation retrieved successfully'
    });

  } catch (error: any) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json({
      error: 'Failed to fetch reservation',
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * PATCH /api/reservations/[id] - Update reservation
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const reservationId = params.id;
    const body = await request.json();
    
    // Get current user
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get existing reservation
    const reservation = await ReservationService.getReservationById(reservationId);
    
    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this reservation
    if (reservation.userId !== currentUser.id && !currentUser.role?.includes('admin')) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Handle different update operations
    if (body.action) {
      switch (body.action) {
        case 'extend':
          if (!body.additionalDays || body.additionalDays <= 0) {
            return NextResponse.json(
              { error: 'additionalDays must be a positive number' },
              { status: 400 }
            );
          }
          
          const extendedReservation = await ReservationService.extendReservation(
            reservationId, 
            body.additionalDays
          );
          
          return NextResponse.json({
            success: true,
            reservation: extendedReservation,
            message: `Reservation extended by ${body.additionalDays} days`
          });

        case 'cancel':
          const reason = body.reason || 'User requested cancellation';
          
          const cancelledReservation = await ReservationService.cancelReservation(
            reservationId, 
            reason
          );
          
          return NextResponse.json({
            success: true,
            reservation: cancelledReservation,
            message: 'Reservation cancelled successfully'
          });

        case 'confirm_payment':
          if (!body.paymentIntentId || !body.paymentMethod || !body.transactionReference) {
            return NextResponse.json(
              { error: 'paymentIntentId, paymentMethod, and transactionReference are required' },
              { status: 400 }
            );
          }
          
          const confirmedReservation = await ReservationService.confirmReservationPayment(
            reservationId,
            body.paymentIntentId,
            body.paymentMethod,
            body.transactionReference
          );
          
          return NextResponse.json({
            success: true,
            reservation: confirmedReservation,
            message: 'Payment confirmed successfully'
          });

        default:
          return NextResponse.json(
            { error: `Unknown action: ${body.action}` },
            { status: 400 }
          );
      }
    }

    // Direct field updates (for admin users)
    if (!currentUser.role?.includes('admin')) {
      return NextResponse.json(
        { error: 'Admin access required for direct updates' },
        { status: 403 }
      );
    }

    // TODO: Implement direct field updates for admin users
    return NextResponse.json(
      { error: 'Direct field updates not yet implemented' },
      { status: 501 }
    );

  } catch (error: any) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({
      error: 'Failed to update reservation',
      message: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/reservations/[id] - Delete reservation (admin only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const reservationId = params.id;
    
    // Get current user
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin access
    if (!currentUser.role?.includes('admin')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Cancel the reservation instead of hard delete
    const cancelledReservation = await ReservationService.cancelReservation(
      reservationId, 
      'Administrative deletion'
    );

    return NextResponse.json({
      success: true,
      reservation: cancelledReservation,
      message: 'Reservation deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json({
      error: 'Failed to delete reservation',
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