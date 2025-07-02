import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { userService } from '@/lib/services/users-production';
import { z } from 'zod';

const prisma = new PrismaClient();

const uploadDocumentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  documentType: z.enum([
    'PAYSLIP', 'BANK_STATEMENT', 'P60', 'TAX_CERT', 'EMPLOYMENT_LETTER', 
    'SELF_EMPLOYED_ACCOUNTS', 'PROOF_OF_DEPOSIT', 'PROPERTY_DETAILS', 
    'VALUATION_REPORT', 'BUILDING_INSURANCE', 'LIFE_INSURANCE', 
    'SOLICITOR_LETTER', 'CONTRACT_OF_SALE', 'SURVEY_REPORT', 'OTHER'
  ]),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().min(1, 'File size is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  documentData: z.string().min(1, 'Document data is required'), // Base64 encoded file data
  lenderSpecific: z.boolean().optional().default(false),
  lenderName: z.string().optional(),
  required: z.boolean().optional().default(false),
  expiryDate: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

const updateDocumentSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REQUIRES_UPDATE', 'EXPIRED']).optional(),
  reviewNotes: z.string().optional(),
  validatedBy: z.string().optional(),
  validatedAt: z.string().optional(),
  expiryDate: z.string().optional()
});

/**
 * GET /api/mortgage/documents - Get mortgage documents with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const userId = searchParams.get('userId');
    const documentType = searchParams.get('documentType');
    const status = searchParams.get('status');
    const lenderName = searchParams.get('lenderName');
    const includeContent = searchParams.get('includeContent') === 'true';

    // Build where clause
    const whereClause: any = {};

    if (userId) {
      // Check permissions for accessing another user's documents
      if (currentUser.id !== userId && !isAuthorizedToView(currentUser)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      whereClause.MortgageTracking = { userId };
    } else {
      // Default to current user's documents
      whereClause.MortgageTracking = { userId: currentUser.id };
    }

    if (documentType) {
      whereClause.documentType = documentType;
    }

    if (status) {
      whereClause.status = status;
    }

    if (lenderName) {
      whereClause.lenderName = lenderName;
    }

    // Get documents
    const documents = await prisma.mortgageDocument.findMany({
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
        ValidatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        MortgageTracking: {
          select: {
            userId: true,
            lender: true,
            status: true
          }
        }
      }
    });

    // Calculate document completion status
    const targetUserId = userId || currentUser.id;
    const documentRequirements = await getDocumentRequirements(targetUserId);
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
      lenderSpecific: doc.lenderSpecific,
      lenderName: doc.lenderName,
      uploadDate: doc.uploadDate,
      expiryDate: doc.expiryDate,
      reviewNotes: doc.reviewNotes,
      validatedAt: doc.validatedAt,
      metadata: doc.metadata,
      uploadedBy: doc.UploadedBy,
      validatedBy: doc.ValidatedBy,
      // Only include document data if specifically requested and user has access
      documentData: includeContent && canAccessContent(currentUser, doc) 
                   ? doc.documentData 
                   : undefined,
      timeAgo: calculateTimeAgo(doc.uploadDate),
      isExpiring: doc.expiryDate ? isDocumentExpiring(doc.expiryDate) : false,
      isExpired: doc.expiryDate ? new Date(doc.expiryDate) < new Date() : false,
      validityStatus: getDocumentValidityStatus(doc)
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
          expired: documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date()).length,
          expiring: documents.filter(d => d.expiryDate && isDocumentExpiring(d.expiryDate)).length,
          byType: groupDocumentsByType(documents),
          byLender: groupDocumentsByLender(documents)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching mortgage documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mortgage documents' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/mortgage/documents - Upload mortgage document
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = uploadDocumentSchema.parse(body);

    // Get current user for authorization
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions to upload for this user
    if (currentUser.id !== validatedData.userId && !isAuthorizedToUpload(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to upload documents for this user' },
        { status: 403 }
      );
    }

    // Validate file size (25MB limit for mortgage documents)
    if (validatedData.fileSize > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 25MB' },
        { status: 400 }
      );
    }

    // Get or create mortgage tracking record
    let mortgageTracking = await prisma.mortgageTracking.findUnique({
      where: { userId: validatedData.userId }
    });

    if (!mortgageTracking) {
      mortgageTracking = await prisma.mortgageTracking.create({
        data: {
          id: generateId(),
          userId: validatedData.userId,
          status: 'INITIAL',
          lastUpdated: new Date()
        }
      });
    }

    // Create document record
    const document = await prisma.mortgageDocument.create({
      data: {
        id: generateId(),
        trackingId: mortgageTracking.id,
        documentType: validatedData.documentType,
        title: validatedData.title,
        description: validatedData.description,
        fileName: validatedData.fileName,
        fileSize: validatedData.fileSize,
        mimeType: validatedData.mimeType,
        documentData: validatedData.documentData,
        status: 'PENDING',
        required: validatedData.required,
        lenderSpecific: validatedData.lenderSpecific,
        lenderName: validatedData.lenderName,
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

    // Create buyer event
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: validatedData.userId,
        eventType: 'MORTGAGE_DOCUMENT_UPLOADED',
        eventDate: new Date(),
        eventData: {
          documentId: document.id,
          documentType: validatedData.documentType,
          title: validatedData.title,
          lenderSpecific: validatedData.lenderSpecific,
          lenderName: validatedData.lenderName
        },
        description: `Mortgage document uploaded: ${validatedData.title}`
      }
    });

    // Auto-validate certain document types
    await autoValidateDocument(document.id, validatedData.documentType);

    // Check if this upload completes any document requirements
    await checkDocumentCompletionTriggers(validatedData.userId, validatedData.documentType);

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
          timeAgo: calculateTimeAgo(document.uploadDate),
          validityStatus: getDocumentValidityStatus(document)
        },
        message: 'Document uploaded successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading mortgage document:', error);
    
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
 * PATCH /api/mortgage/documents - Update document status (reviewer only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, ...updateData } = body;
    const validatedData = updateDocumentSchema.parse(updateData);

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
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

    // Check permissions - only authorized reviewers can update status
    if (!isAuthorizedToReview(currentUser)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to review documents' },
        { status: 403 }
      );
    }

    // Get document
    const document = await prisma.mortgageDocument.findUnique({
      where: { id: documentId },
      include: {
        MortgageTracking: {
          select: { userId: true }
        }
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Update document
    const updatedDocument = await prisma.mortgageDocument.update({
      where: { id: documentId },
      data: {
        status: validatedData.status,
        reviewNotes: validatedData.reviewNotes,
        validatedBy: validatedData.status === 'APPROVED' ? currentUser.id : null,
        validatedAt: validatedData.status === 'APPROVED' ? new Date() : null,
        expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : document.expiryDate
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
        ValidatedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create buyer event for status change
    if (validatedData.status) {
      await prisma.buyerEvent.create({
        data: {
          id: generateId(),
          buyerId: document.MortgageTracking.userId,
          eventType: 'MORTGAGE_DOCUMENT_REVIEWED',
          eventDate: new Date(),
          eventData: {
            documentId,
            previousStatus: document.status,
            newStatus: validatedData.status,
            reviewNotes: validatedData.reviewNotes,
            reviewedBy: currentUser.id
          },
          description: `Document ${validatedData.status.toLowerCase()}: ${document.title}`
        }
      });
    }

    // Check if document approval triggers any workflow actions
    if (validatedData.status === 'APPROVED') {
      await checkApprovalTriggers(document.MortgageTracking.userId, document.documentType);
    }

    return NextResponse.json({
      success: true,
      data: {
        document: {
          ...updatedDocument,
          timeAgo: calculateTimeAgo(updatedDocument.uploadDate),
          validityStatus: getDocumentValidityStatus(updatedDocument)
        },
        message: 'Document updated successfully'
      }
    });

  } catch (error) {
    console.error('Error updating mortgage document:', error);
    
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

function isAuthorizedToView(user: any): boolean {
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('MORTGAGE_BROKER') ||
         user?.roles?.includes('SOLICITOR');
}

function isAuthorizedToUpload(user: any): boolean {
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('MORTGAGE_BROKER');
}

function isAuthorizedToReview(user: any): boolean {
  return user?.roles?.includes('ADMIN') || 
         user?.roles?.includes('SUPER_ADMIN') ||
         user?.roles?.includes('MORTGAGE_BROKER') ||
         user?.roles?.includes('MORTGAGE_UNDERWRITER');
}

function canAccessContent(user: any, document: any): boolean {
  // User can access their own documents
  if (document.MortgageTracking?.userId === user.id) return true;
  
  // Authorized professionals can access content
  return isAuthorizedToView(user);
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
  return expiry <= thirtyDaysFromNow && expiry > now;
}

function getDocumentValidityStatus(document: any): any {
  const now = new Date();
  
  if (document.expiryDate && new Date(document.expiryDate) < now) {
    return { status: 'expired', color: 'red', message: 'Document has expired' };
  }
  
  if (document.expiryDate && isDocumentExpiring(document.expiryDate)) {
    const daysUntilExpiry = Math.ceil((new Date(document.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { status: 'expiring', color: 'orange', message: `Expires in ${daysUntilExpiry} days` };
  }
  
  switch (document.status) {
    case 'APPROVED':
      return { status: 'valid', color: 'green', message: 'Document approved' };
    case 'REJECTED':
      return { status: 'rejected', color: 'red', message: 'Document rejected' };
    case 'REQUIRES_UPDATE':
      return { status: 'needs_update', color: 'orange', message: 'Update required' };
    case 'PENDING':
      return { status: 'pending', color: 'yellow', message: 'Awaiting review' };
    default:
      return { status: 'unknown', color: 'gray', message: 'Unknown status' };
  }
}

async function getDocumentRequirements(userId: string) {
  // Get mortgage tracking to determine required documents
  const mortgageTracking = await prisma.mortgageTracking.findUnique({
    where: { userId }
  });

  // Base requirements for all mortgage applications
  const baseRequirements = [
    { type: 'PAYSLIP', required: true, description: 'Recent payslips (last 3 months)', count: 3 },
    { type: 'BANK_STATEMENT', required: true, description: 'Bank statements (last 6 months)', count: 6 },
    { type: 'P60', required: true, description: 'Latest P60 or tax certificate', count: 1 },
    { type: 'EMPLOYMENT_LETTER', required: true, description: 'Employment confirmation letter', count: 1 },
    { type: 'PROOF_OF_DEPOSIT', required: true, description: 'Proof of deposit funds', count: 1 }
  ];

  // Additional requirements based on mortgage stage
  const additionalRequirements = [];

  if (mortgageTracking?.status && ['FORMAL_APPLICATION', 'SURVEY_ORDERED'].includes(mortgageTracking.status)) {
    additionalRequirements.push(
      { type: 'PROPERTY_DETAILS', required: true, description: 'Property details and purchase agreement', count: 1 },
      { type: 'BUILDING_INSURANCE', required: true, description: 'Building insurance quote', count: 1 },
      { type: 'LIFE_INSURANCE', required: false, description: 'Life insurance details', count: 1 }
    );
  }

  if (mortgageTracking?.status && ['OFFER_ISSUED', 'OFFER_ACCEPTED'].includes(mortgageTracking.status)) {
    additionalRequirements.push(
      { type: 'SOLICITOR_LETTER', required: true, description: 'Solicitor appointment confirmation', count: 1 },
      { type: 'CONTRACT_OF_SALE', required: true, description: 'Signed contract of sale', count: 1 }
    );
  }

  return [...baseRequirements, ...additionalRequirements];
}

function calculateDocumentCompletion(documents: any[], requirements: any[]) {
  const documentCounts = documents.reduce((acc, doc) => {
    if (doc.status === 'APPROVED') {
      acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
    }
    return acc;
  }, {} as any);

  const completedRequirements = requirements.filter(req => 
    (documentCounts[req.type] || 0) >= req.count && req.required
  );

  const totalRequired = requirements.filter(req => req.required).length;
  const completionPercentage = totalRequired > 0 ? 
    Math.round((completedRequirements.length / totalRequired) * 100) : 100;

  return {
    completed: completedRequirements.length,
    total: totalRequired,
    percentage: completionPercentage,
    missingRequired: requirements.filter(req => 
      req.required && (documentCounts[req.type] || 0) < req.count
    ),
    documentCounts
  };
}

function groupDocumentsByType(documents: any[]) {
  return documents.reduce((acc, doc) => {
    acc[doc.documentType] = (acc[doc.documentType] || 0) + 1;
    return acc;
  }, {} as any);
}

function groupDocumentsByLender(documents: any[]) {
  return documents.reduce((acc, doc) => {
    if (doc.lenderSpecific && doc.lenderName) {
      acc[doc.lenderName] = (acc[doc.lenderName] || 0) + 1;
    }
    return acc;
  }, {} as any);
}

async function autoValidateDocument(documentId: string, documentType: string) {
  // Auto-approve certain document types that don't require manual review
  const autoApproveTypes = ['P60', 'EMPLOYMENT_LETTER'];
  
  if (autoApproveTypes.includes(documentType)) {
    await prisma.mortgageDocument.update({
      where: { id: documentId },
      data: {
        status: 'APPROVED',
        validatedAt: new Date(),
        reviewNotes: 'Auto-approved based on document type'
      }
    });
  }
}

async function checkDocumentCompletionTriggers(userId: string, documentType: string) {
  // Check if uploading this document type completes any milestones
  const requirements = await getDocumentRequirements(userId);
  const documents = await prisma.mortgageDocument.findMany({
    where: {
      MortgageTracking: { userId },
      status: 'APPROVED'
    }
  });

  const completion = calculateDocumentCompletion(documents, requirements);
  
  // Trigger events based on completion percentage
  if (completion.percentage >= 100) {
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: userId,
        eventType: 'MORTGAGE_DOCUMENTS_COMPLETE',
        eventDate: new Date(),
        eventData: {
          completionPercentage: completion.percentage,
          totalDocuments: documents.length
        },
        description: 'All required mortgage documents submitted'
      }
    });
  } else if (completion.percentage >= 75) {
    await prisma.buyerEvent.create({
      data: {
        id: generateId(),
        buyerId: userId,
        eventType: 'MORTGAGE_DOCUMENTS_MOSTLY_COMPLETE',
        eventDate: new Date(),
        eventData: {
          completionPercentage: completion.percentage,
          missingDocuments: completion.missingRequired.length
        },
        description: 'Most mortgage documents submitted'
      }
    });
  }
}

async function checkApprovalTriggers(userId: string, documentType: string) {
  // Check if approving this document triggers any workflow actions
  const criticalDocuments = ['PAYSLIP', 'BANK_STATEMENT', 'P60', 'EMPLOYMENT_LETTER'];
  
  if (criticalDocuments.includes(documentType)) {
    // Check if all critical documents are now approved
    const approvedCriticalDocs = await prisma.mortgageDocument.count({
      where: {
        MortgageTracking: { userId },
        documentType: { in: criticalDocuments },
        status: 'APPROVED'
      }
    });

    if (approvedCriticalDocs >= criticalDocuments.length) {
      // Update mortgage tracking status if appropriate
      const mortgageTracking = await prisma.mortgageTracking.findUnique({
        where: { userId }
      });

      if (mortgageTracking?.status === 'ADDITIONAL_INFO_REQUIRED') {
        await prisma.mortgageTracking.update({
          where: { userId },
          data: {
            status: 'UNDER_REVIEW',
            lastUpdated: new Date()
          }
        });

        await prisma.buyerEvent.create({
          data: {
            id: generateId(),
            buyerId: userId,
            eventType: 'MORTGAGE_STATUS_CHANGED',
            eventDate: new Date(),
            eventData: {
              previousStatus: 'ADDITIONAL_INFO_REQUIRED',
              newStatus: 'UNDER_REVIEW',
              reason: 'All critical documents approved'
            },
            description: 'Mortgage application returned to review status'
          }
        });
      }
    }
  }
}