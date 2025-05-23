import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

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
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Generate a unique verification ID
    // In a real app, this would create a record in the database
    const verificationId = uuidv4();

    return NextResponse.json({
      success: true,
      verificationId,
      userId: session.user?.id,
      transactionId,
      status: 'INITIATED',
      createdAt: new Date().toISOString()
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to start verification process' },
      { status: 500 }
    );
  }
}