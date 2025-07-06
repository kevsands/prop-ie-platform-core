import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Auth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    let currentUser;
    const isDevelopment = process.env.NODE_ENV === 'development';
    const allowMockAuth = process.env.ALLOW_MOCK_AUTH === 'true';
    
    try {
      currentUser = await Auth.currentAuthenticatedUser();
    } catch (error) {
      if (isDevelopment && allowMockAuth) {
        currentUser = {
          userId: 'dev-user-123',
          username: 'dev@prop.ie',
          email: 'dev@prop.ie',
          firstName: 'Development',
          lastName: 'User',
          roles: ['USER', 'BUYER']
        };
      } else {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
    }

    // Try to get documents from database
    let userDocuments;
    try {
      userDocuments = await prisma.document.findMany({
        where: { 
          userId: currentUser.userId 
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (dbError) {
      console.error('Database query failed:', dbError);
      // In development, fall back to mock data
      if (!isDevelopment) {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 500 }
        );
      }
    }

    // If no documents in database or in development, return mock data
    if (!userDocuments || userDocuments.length === 0) {
      const mockDocuments = [
        {
          id: 'doc-1',
          name: 'P60 Form 2023',
          type: 'tax_document',
          category: 'financial',
          status: 'verified',
          uploadDate: '2024-03-10',
          size: 245760,
          mimeType: 'application/pdf',
          description: 'Tax certificate for 2023',
          tags: ['tax', 'p60', '2023'],
          isRequired: true,
          expiryDate: null,
          verifiedBy: 'Revenue Office',
          verifiedAt: '2024-03-12T10:30:00Z'
        },
        {
          id: 'doc-2',
          name: 'Bank Statement - March 2024',
          type: 'bank_statement',
          category: 'financial',
          status: 'uploaded',
          uploadDate: '2024-03-15',
          size: 156890,
          mimeType: 'application/pdf',
          description: 'Current account statement for March 2024',
          tags: ['bank', 'statement', 'march'],
          isRequired: true,
          expiryDate: null,
          verifiedBy: null,
          verifiedAt: null
        },
        {
          id: 'doc-3',
          name: 'Proof of Identity',
          type: 'identity_document',
          category: 'personal',
          status: 'verified',
          uploadDate: '2024-03-08',
          size: 1024000,
          mimeType: 'image/jpeg',
          description: 'Irish passport for identity verification',
          tags: ['identity', 'passport', 'verification'],
          isRequired: true,
          expiryDate: '2029-03-15',
          verifiedBy: 'Identity Verification Service',
          verifiedAt: '2024-03-08T15:45:00Z'
        },
        {
          id: 'doc-4',
          name: 'Employment Contract',
          type: 'employment_document',
          category: 'financial',
          status: 'pending',
          uploadDate: null,
          size: null,
          mimeType: null,
          description: 'Current employment contract or letter',
          tags: ['employment', 'contract', 'income'],
          isRequired: true,
          expiryDate: null,
          verifiedBy: null,
          verifiedAt: null
        },
        {
          id: 'doc-5',
          name: 'Property Purchase Agreement',
          type: 'legal_document',
          category: 'property',
          status: 'pending',
          uploadDate: null,
          size: null,
          mimeType: null,
          description: 'Signed purchase agreement for selected property',
          tags: ['property', 'purchase', 'agreement'],
          isRequired: false,
          expiryDate: null,
          verifiedBy: null,
          verifiedAt: null
        }
      ];

      return NextResponse.json({
        documents: mockDocuments,
        statistics: {
          total: mockDocuments.length,
          uploaded: mockDocuments.filter(doc => doc.status !== 'pending').length,
          verified: mockDocuments.filter(doc => doc.status === 'verified').length,
          pending: mockDocuments.filter(doc => doc.status === 'pending').length,
          required: mockDocuments.filter(doc => doc.isRequired).length
        },
        categories: {
          financial: mockDocuments.filter(doc => doc.category === 'financial').length,
          personal: mockDocuments.filter(doc => doc.category === 'personal').length,
          property: mockDocuments.filter(doc => doc.category === 'property').length,
          legal: mockDocuments.filter(doc => doc.category === 'legal').length
        },
        status: 'mock_data',
        message: 'Using development mock document data'
      });
    }

    // Transform database data
    const documents = userDocuments.map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      category: doc.category || 'general',
      status: doc.status.toLowerCase(),
      uploadDate: doc.createdAt.toISOString().split('T')[0],
      size: doc.size,
      mimeType: doc.mimeType,
      description: doc.description,
      tags: doc.tags ? JSON.parse(doc.tags) : [],
      isRequired: doc.isRequired || false,
      expiryDate: doc.expiryDate?.toISOString().split('T')[0] || null,
      verifiedBy: doc.verifiedBy,
      verifiedAt: doc.verifiedAt?.toISOString()
    }));

    const statistics = {
      total: documents.length,
      uploaded: documents.filter(doc => doc.status !== 'pending').length,
      verified: documents.filter(doc => doc.status === 'verified').length,
      pending: documents.filter(doc => doc.status === 'pending').length,
      required: documents.filter(doc => doc.isRequired).length
    };

    const categories = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      documents,
      statistics,
      categories,
      status: 'database_data',
      message: 'Documents retrieved from database'
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    let currentUser;
    const isDevelopment = process.env.NODE_ENV === 'development';
    const allowMockAuth = process.env.ALLOW_MOCK_AUTH === 'true';
    
    try {
      currentUser = await Auth.currentAuthenticatedUser();
    } catch (error) {
      if (isDevelopment && allowMockAuth) {
        currentUser = {
          userId: 'dev-user-123',
          username: 'dev@prop.ie',
          email: 'dev@prop.ie',
          firstName: 'Development',
          lastName: 'User',
          roles: ['USER', 'BUYER']
        };
      } else {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 10MB allowed.' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPEG, PNG, and Word documents are allowed.' },
        { status: 400 }
      );
    }

    // In development mode, return mock success
    if (isDevelopment) {
      const mockDocument = {
        id: `doc-${Date.now()}`,
        name: name || file.name,
        type: type || 'general_document',
        category: category || 'general',
        status: 'uploaded',
        uploadDate: new Date().toISOString().split('T')[0],
        size: file.size,
        mimeType: file.type,
        description: description || 'Document uploaded via web interface',
        tags: [],
        isRequired: false,
        expiryDate: null,
        verifiedBy: null,
        verifiedAt: null
      };

      return NextResponse.json({
        success: true,
        document: mockDocument,
        message: 'Document uploaded successfully (mock mode)'
      });
    }

    // In production, would save file to storage and create database record
    const newDocument = await prisma.document.create({
      data: {
        userId: currentUser.userId,
        name: name || file.name,
        type: type || 'general_document',
        category: category || 'general',
        status: 'UPLOADED',
        size: file.size,
        mimeType: file.type,
        description: description || 'Document uploaded via web interface',
        // In production, would include storage URL
        url: `/documents/${currentUser.userId}/${file.name}`,
        tags: JSON.stringify([]),
        isRequired: false
      }
    });

    return NextResponse.json({
      success: true,
      document: {
        id: newDocument.id,
        name: newDocument.name,
        type: newDocument.type,
        category: newDocument.category,
        status: newDocument.status.toLowerCase(),
        uploadDate: newDocument.createdAt.toISOString().split('T')[0],
        size: newDocument.size,
        mimeType: newDocument.mimeType,
        description: newDocument.description,
        tags: [],
        isRequired: newDocument.isRequired || false
      },
      message: 'Document uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}