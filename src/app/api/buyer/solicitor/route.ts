import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const solicitorDetailsSchema = z.object({
  reservationId: z.string(),
  solicitorDetails: z.object({
    firmName: z.string(),
    solicitorName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    lawSocRegistration: z.string(),
    address: z.string().optional()
  })
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reservationId, solicitorDetails } = solicitorDetailsSchema.parse(body);

    // Validate Law Society registration
    const validRegistration = await validateLawSocietyRegistration(
      solicitorDetails.lawSocRegistration
    );

    if (!validRegistration) {
      return NextResponse.json(
        { error: 'Invalid Law Society registration number' },
        { status: 400 }
      );
    }

    // Store solicitor details
    const updatedReservation = await updateReservationSolicitor(
      reservationId,
      solicitorDetails
    );

    // Send notification to solicitor using your existing email system
    await sendSolicitorWelcomeEmail(updatedReservation);

    // Update transaction record
    await updateTransactionSolicitor(reservationIdsolicitorDetails);

    return NextResponse.json({
      success: true,
      reservation: updatedReservation,
      nextSteps: 'CONTRACT_GENERATION'
    });

  } catch (error) {

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to nominate solicitor' },
      { status: 500 }
    );
  }
}

async function validateLawSocietyRegistration(registrationNumber: string): Promise<boolean> {
  // Implementation to validate with Law Society of Ireland API
  // This would be a real API call in production
  try {
    // In production, this would call the Law Society API
    // const response = await fetch(`https://api.lawsociety.ie/validate/${registrationNumber}`);
    // return response.ok;

    // For now, basic validation - ensure it's not empty and has reasonable format
    return registrationNumber.length> 0 && /^[A-Z0-9]+$/i.test(registrationNumber);
  } catch (error) {

    return false;
  }
}

async function updateReservationSolicitor(reservationId: string, solicitorDetails: any) {
  // Integration with your existing database patterns
  const updatedReservation = {
    id: reservationId,
    solicitor: {
      ...solicitorDetails,
      validatedAt: new Date(),
      status: 'ACTIVE'
    },
    buyer: {
      id: 'buyer_123',
      email: 'buyer@example.com',
      name: 'John Doe'
    },
    unit: {
      id: 'unit_123',
      name: 'Unit 12, Fitzgerald Gardens',
      price: 350000
    }
  };

  // In production, this would update your database
  // await prisma.reservation.update({
  //   where: { id: reservationId },
  //   data: { solicitor: solicitorDetails }
  // });

  return updatedReservation;
}

async function sendSolicitorWelcomeEmail(reservation: any) {
  // Integration with your existing email service
  const emailData = {
    to: reservation.solicitor.email,
    subject: 'New Client Assignment - Property Purchase Transaction',
    template: 'solicitor-welcome',
    data: {
      solicitorName: reservation.solicitor.solicitorName,
      firmName: reservation.solicitor.firmName,
      clientName: reservation.buyer.name,
      propertyDetails: {
        name: reservation.unit.name,
        price: reservation.unit.price
      },
      reservationId: reservation.id
    }
  };

  // await emailService.send(emailData);

}

async function updateTransactionSolicitor(reservationId: string, solicitorDetails: any) {
  // Integration with your existing transaction service
  // This would update the transaction record with solicitor information

  // await transactionService.updateTransaction(transactionId, {
  //   solicitor: solicitorDetails,
  //   stage: 'PRE_CONTRACT',
  //   status: 'IN_PROGRESS'
  // });
}