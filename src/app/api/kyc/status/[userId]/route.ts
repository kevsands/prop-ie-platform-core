import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        kycStatus: true,
        metadata: true,
        Document_UserKycDocuments: {
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            status: true,
            category: true,
            fileUrl: true,
            fileType: true,
            fileSize: true,
            uploadDate: true,
            tags: true,
            metadata: true
          },
          orderBy: {
            uploadDate: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate verification progress
    const documents = user.Document_UserKycDocuments;
    const requiredDocumentTypes = ['identity_document', 'selfie_verification', 'address_proof'];
    
    const uploadedTypes = [...new Set(documents.map(doc => doc.type))];
    const progress = Math.round((uploadedTypes.length / requiredDocumentTypes.length) * 100);

    // Group documents by category
    const documentsByCategory = {
      identity: documents.filter(doc => doc.category === 'kyc_identity'),
      address: documents.filter(doc => doc.category === 'kyc_address'),
      financial: documents.filter(doc => doc.category === 'kyc_financial')
    };

    // Determine next steps
    let nextSteps = [];
    if (!uploadedTypes.includes('identity_document')) {
      nextSteps.push('Upload identity document (passport, driving license, or national ID)');
    }
    if (!uploadedTypes.includes('selfie_verification')) {
      nextSteps.push('Take selfie with ID document');
    }
    if (!uploadedTypes.includes('address_proof')) {
      nextSteps.push('Upload proof of address document');
    }

    // Get KYC form data from metadata
    const kycData = user.metadata?.kyc || null;

    const response = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        kycStatus: user.kycStatus
      },
      verification: {
        status: user.kycStatus,
        progress: progress,
        completedSteps: uploadedTypes.length,
        totalSteps: requiredDocumentTypes.length,
        nextSteps: nextSteps,
        submittedAt: kycData?.submittedAt || null
      },
      documents: {
        total: documents.length,
        byCategory: documentsByCategory,
        recent: documents.slice(0, 5)
      },
      formData: kycData,
      requiresAction: user.kycStatus === 'NOT_STARTED' || nextSteps.length > 0
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching KYC status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KYC status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();
    const { status, reviewNotes } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const validStatuses = ['NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: status,
        metadata: {
          ...await prisma.user.findUnique({ where: { id: userId }, select: { metadata: true } }).then(u => u?.metadata || {}),
          kycReview: {
            status,
            reviewNotes,
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'system' // In production, this would be the reviewer's ID
          }
        }
      },
      select: {
        id: true,
        kycStatus: true,
        metadata: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `KYC status updated to ${status}`,
      data: updatedUser
    });

  } catch (error) {
    console.error('Error updating KYC status:', error);
    return NextResponse.json(
      { error: 'Failed to update KYC status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}