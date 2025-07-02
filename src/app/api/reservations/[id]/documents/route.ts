import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const uploadDocumentSchema = z.object({
  documentType: z.enum(['CONTRACT', 'IDENTIFICATION', 'FINANCIAL_PROOF', 'SOLICITOR_LETTER', 'MORTGAGE_APPROVAL', 'INSURANCE', 'OTHER']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().min(1, 'File size is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  documentData: z.string().min(1, 'Document data is required'), // Base64 encoded file data
  required: z.boolean().optional().default(false),
  expiryDate: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const updateDocumentSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REQUIRES_UPDATE']).optional(),
  reviewNotes: z.string().optional(),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional()
});

/**
 * GET /api/reservations/[id]/documents - Get reservation documents
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: reservationId } = params;
    const { searchParams } = new URL(request.url);

    if (!reservationId) {
      return NextResponse.json(
        { error: 'Reservation ID is required' },
        { status: 400 }
      );
    }

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get reservation to check access
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: { userId: true, id: true }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (reservation.userId !== currentUser.id && !isAdmin(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const documentType = searchParams.get('documentType');
    const status = searchParams.get('status');
    const includeContent = searchParams.get('includeContent') === 'true';

    // Build where clause
    const whereClause: any = {
      reservationId
    };

    if (documentType) {
      whereClause.documentType = documentType;
    }

    if (status) {
      whereClause.status = status;
    }

    // Get documents
    const documents = await prisma.reservationDocument.findMany({
      where: whereClause,
      orderBy: { uploadDate: 'desc' },
      include: {
        UploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        ApprovedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Calculate document completion status
    const documentRequirements = await getDocumentRequirements(reservationId);
    const completionStatus = calculateDocumentCompletion(documents, documentRequirements);

    // Format response data
    const formattedDocuments = documents.map(doc => ({
      id: doc.id,
      documentType: doc.documentType,
      title: doc.title,
      description: doc.description,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      status: doc.status,
      required: doc.required,
      uploadDate: doc.uploadDate,
      expiryDate: doc.expiryDate,
      reviewNotes: doc.reviewNotes,
      approvedAt: doc.approvedAt,
      metadata: doc.metadata,
      uploadedBy: doc.UploadedBy,
      approvedBy: doc.ApprovedBy,
      // Only include document data if specifically requested and user has access
      documentData: includeContent && (isAdmin(currentUser) || reservation.userId === currentUser.id) 
                   ? doc.documentData 
                   : undefined,
      timeAgo: calculateTimeAgo(doc.uploadDate),
      isExpiring: doc.expiryDate ? isDocumentExpiring(doc.expiryDate) : false
    }));

    return NextResponse.json({
      success: true,
      data: {
        documents: formattedDocuments,
        completionStatus,
        documentRequirements,
        summary: {
          total: documents.length,
          pending: documents.filter(d => d.status === 'PENDING').length,
          approved: documents.filter(d => d.status === 'APPROVED').length,
          rejected: documents.filter(d => d.status === 'REJECTED').length,
          requiresUpdate: documents.filter(d => d.status === 'REQUIRES_UPDATE').length,
          expiring: documents.filter(d => d.expiryDate && isDocumentExpiring(d.expiryDate)).length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reservation documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservation documents' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/reservations/[id]/documents - Upload document
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: reservationId } = params;
    const body = await request.json();
    const validatedData = uploadDocumentSchema.parse(body);

    if (!reservationId) {
      return NextResponse.json(
        { error: 'Reservation ID is required' },
        { status: 400 }
      );
    }

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get reservation to check access
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      select: { userId: true, id: true, status: true }
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    // Check permissions - reservation owner or authorized users can upload
    const canUpload = reservation.userId === currentUser.id || 
                     isAdmin(currentUser) ||
                     currentUser.roles?.includes('ESTATE_AGENT') ||
                     currentUser.roles?.includes('SOLICITOR');

    if (!canUpload) {
      return NextResponse.json(
        { error: 'Insufficient permissions to upload documents' },
        { status: 403 }
      );
    }

    // Validate file size (10MB limit)
    if (validatedData.fileSize > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Create document record
    const document = await prisma.reservationDocument.create({
      data: {
        id: generateId(),
        reservationId,
        documentType: validatedData.documentType,
        title: validatedData.title,
        description: validatedData.description,
        fileName: validatedData.fileName,
        fileSize: validatedData.fileSize,
        mimeType: validatedData.mimeType,
        documentData: validatedData.documentData,
        status: 'PENDING',
        required: validatedData.required,
        uploadDate: new Date(),
        expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null,
        metadata: validatedData.metadata || {},
        uploadedBy: currentUser.id
      },
      include: {
        UploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create timeline event
    await prisma.reservationTimelineEvent.create({
      data: {
        id: generateId(),
        reservationId,
        eventType: 'DOCUMENT_UPLOADED',
        title: `Document Uploaded: ${validatedData.title}`,
        description: `${validatedData.documentType} document uploaded`,
        eventDate: new Date(),
        metadata: {
          documentId: document.id,
          documentType: validatedData.documentType,
          fileName: validatedData.fileName
        },
        visibility: 'PUBLIC',
        relatedDocumentId: document.id,
        createdBy: currentUser.id
      }
    });

    // Create buyer event
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: reservation.userId,
        eventType: 'DOCUMENT_UPLOADED',
        eventDate: new Date(),
        eventData: {
          reservationId,
          documentId: document.id,
          documentType: validatedData.documentType,
          title: validatedData.title
        },
        description: `Document uploaded: ${validatedData.title}`
      }
    });

    // Auto-notify relevant parties
    await createDocumentNotifications(reservationId, document.id, validatedData.documentType);

    return NextResponse.json({
      success: true,
      data: {
        document: {
          id: document.id,
          documentType: document.documentType,
          title: document.title,
          fileName: document.fileName,
          fileSize: document.fileSize,
          status: document.status,
          uploadDate: document.uploadDate,
          uploadedBy: document.UploadedBy,
          timeAgo: calculateTimeAgo(document.uploadDate)
        },
        message: 'Document uploaded successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading document:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/reservations/[id]/documents - Update document status (admin/reviewer only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: reservationId } = params;
    const body = await request.json();
    const { documentId, ...updateData } = body;
    const validatedData = updateDocumentSchema.parse(updateData);

    if (!reservationId || !documentId) {
      return NextResponse.json(
        { error: 'Reservation ID and Document ID are required' },
        { status: 400 }
      );
    }

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions - only admin or authorized reviewers can update status
    const canReview = isAdmin(currentUser) || 
                     currentUser.roles?.includes('SOLICITOR') ||
                     currentUser.roles?.includes('DEVELOPER');

    if (!canReview) {
      return NextResponse.json(
        { error: 'Insufficient permissions to review documents' },
        { status: 403 }
      );
    }

    // Get document
    const document = await prisma.reservationDocument.findUnique({
      where: { id: documentId },
      include: {
        Reservation: {
          select: { userId: true }
        }
      }
    });

    if (!document || document.reservationId !== reservationId) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Update document
    const updatedDocument = await prisma.reservationDocument.update({
      where: { id: documentId },
      data: {
        status: validatedData.status,
        reviewNotes: validatedData.reviewNotes,
        approvedBy: validatedData.status === 'APPROVED' ? currentUser.id : null,
        approvedAt: validatedData.status === 'APPROVED' ? new Date() : null
      },
      include: {
        UploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        ApprovedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create timeline event for status change
    if (validatedData.status) {
      await prisma.reservationTimelineEvent.create({
        data: {
          id: generateId(),
          reservationId,
          eventType: 'STATUS_CHANGE',
          title: `Document ${validatedData.status}`,
          description: `${document.title} status changed to ${validatedData.status}`,
          eventDate: new Date(),
          metadata: {
            documentId,
            previousStatus: document.status,
            newStatus: validatedData.status,
            reviewNotes: validatedData.reviewNotes
          },
          visibility: 'PUBLIC',
          relatedDocumentId: documentId,
          createdBy: currentUser.id
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        document: {
          ...updatedDocument,
          timeAgo: calculateTimeAgo(updatedDocument.uploadDate)
        },
        message: 'Document updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating document:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
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

function isAdmin(user: any): boolean {
  return user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN');
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateTimeAgo(date: Date | string): string {
  const now = new Date();
  const eventDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - eventDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

function isDocumentExpiring(expiryDate: Date | string): boolean {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return expiry <= thirtyDaysFromNow;
}

async function getDocumentRequirements(reservationId: string) {
  // Define required documents based on reservation type and stage
  const basicRequirements = [
    { type: 'IDENTIFICATION', required: true, description: 'Government-issued photo ID' },
    { type: 'FINANCIAL_PROOF', required: true, description: 'Bank statements or income proof' },
    { type: 'CONTRACT', required: true, description: 'Signed reservation contract' }
  ];

  // TODO: Get additional requirements based on reservation specifics
  return basicRequirements;
}

function calculateDocumentCompletion(documents: any[], requirements: any[]) {
  const completedRequirements = requirements.filter(req => 
    documents.some(doc => 
      doc.documentType === req.type && 
      doc.status === 'APPROVED' && 
      doc.required
    )
  );

  const completionPercentage = requirements.length > 0 
    ? Math.round((completedRequirements.length / requirements.length) * 100)
    : 100;

  return {
    completed: completedRequirements.length,
    total: requirements.length,
    percentage: completionPercentage,
    missingRequired: requirements.filter(req => 
      !documents.some(doc => 
        doc.documentType === req.type && 
        doc.status === 'APPROVED' && 
        doc.required
      )
    )
  };
}

async function createDocumentNotifications(reservationId: string, documentId: string, documentType: string) {
  // TODO: Implement notification system for document uploads
  // This would typically notify solicitors, estate agents, etc.
}