import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    const { verificationId } = body;

    if (!verificationId) {
      return NextResponse.json(
        { error: 'Verification ID is required' },
        { status: 400 }
      );
    }

    // In a real app, this would update the verification status in the database
    // For demo purposes, we're just returning a success response

    // Call our status API to mark the user as verified
    const statusUpdateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/kyc/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '' // Pass the session cookie
      }
    });

    if (!statusUpdateResponse.ok) {
      throw new Error('Failed to update KYC status');
    }

    return NextResponse.json({
      success: true,
      verificationId,
      status: 'VERIFIED',
      completedAt: new Date().toISOString(),
      userId: session.user?.id
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to complete verification process' },
      { status: 500 }
    );
  }
}