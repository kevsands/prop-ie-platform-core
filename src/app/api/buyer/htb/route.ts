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
      // In development with mock auth enabled, provide a mock user
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

    // Try to get HTB data from database
    let htbClaims;
    try {
      htbClaims = await prisma.htbClaim.findMany({
        where: { 
          userId: currentUser.userId 
        },
        include: {
          property: {
            include: {
              development: true
            }
          },
          documents: true
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

    // If no HTB claims in database or in development, return mock data
    if (!htbClaims || htbClaims.length === 0) {
      const mockHTBData = {
        id: 'HTB-2024-001',
        status: 'in_progress',
        submissionDate: '2024-03-15',
        amount: 30000,
        property: {
          id: '1',
          title: 'Fitzgerald Gardens - Unit 23',
          price: 385000,
          developer: 'Premium Developments'
        },
        documents: [
          { name: 'P60 Form (Year 1)', status: 'verified', uploadDate: '2024-03-10' },
          { name: 'P60 Form (Year 2)', status: 'verified', uploadDate: '2024-03-10' },
          { name: 'P60 Form (Year 3)', status: 'verified', uploadDate: '2024-03-10' },
          { name: 'P60 Form (Year 4)', status: 'verified', uploadDate: '2024-03-10' },
          { name: 'Bank Statements', status: 'uploaded', uploadDate: '2024-03-12' },
          { name: 'Property Purchase Contract', status: 'required' },
          { name: 'Solicitor Confirmation', status: 'required' }
        ],
        timeline: [
          {
            stage: 'Eligibility Check',
            status: 'completed',
            date: '2024-03-10',
            description: 'Verified first-time buyer status and property eligibility'
          },
          {
            stage: 'Document Upload',
            status: 'completed',
            date: '2024-03-12',
            description: 'Uploaded required tax documents and bank statements'
          },
          {
            stage: 'Application Review',
            status: 'current',
            description: 'Revenue reviewing submitted documentation'
          },
          {
            stage: 'Approval',
            status: 'pending',
            description: 'Final approval and HTB certificate generation'
          },
          {
            stage: 'Payment',
            status: 'pending',
            description: 'HTB refund paid to solicitor at property closing'
          }
        ]
      };

      return NextResponse.json({
        application: mockHTBData,
        status: 'mock_data',
        message: 'Using development mock data'
      });
    }

    // Transform database data to response format
    const latestClaim = htbClaims[0];
    
    const htbApplication = {
      id: latestClaim.id,
      status: latestClaim.status.toLowerCase(),
      submissionDate: latestClaim.submissionDate?.toISOString().split('T')[0],
      approvalDate: latestClaim.approvalDate?.toISOString().split('T')[0],
      paymentDate: latestClaim.paymentDate?.toISOString().split('T')[0],
      amount: latestClaim.amount,
      property: latestClaim.property ? {
        id: latestClaim.property.id,
        title: `${latestClaim.property.development?.name} - Unit ${latestClaim.property.unitNumber}`,
        price: latestClaim.property.price,
        developer: latestClaim.property.development?.name || 'Unknown Developer'
      } : null,
      documents: latestClaim.documents.map(doc => ({
        name: doc.name,
        status: doc.status.toLowerCase(),
        uploadDate: doc.uploadDate?.toISOString().split('T')[0]
      })),
      timeline: [
        {
          stage: 'Eligibility Check',
          status: 'completed',
          date: latestClaim.createdAt.toISOString().split('T')[0],
          description: 'Verified first-time buyer status and property eligibility'
        },
        {
          stage: 'Document Upload',
          status: latestClaim.documents.length > 0 ? 'completed' : 'current',
          date: latestClaim.documents.length > 0 ? latestClaim.documents[0].uploadDate?.toISOString().split('T')[0] : undefined,
          description: 'Uploaded required tax documents and bank statements'
        },
        {
          stage: 'Application Review',
          status: latestClaim.status === 'SUBMITTED' ? 'current' : latestClaim.status === 'APPROVED' ? 'completed' : 'pending',
          date: latestClaim.submissionDate?.toISOString().split('T')[0],
          description: 'Revenue reviewing submitted documentation'
        },
        {
          stage: 'Approval',
          status: latestClaim.status === 'APPROVED' ? 'completed' : 'pending',
          date: latestClaim.approvalDate?.toISOString().split('T')[0],
          description: 'Final approval and HTB certificate generation'
        },
        {
          stage: 'Payment',
          status: latestClaim.status === 'PAID' ? 'completed' : 'pending',
          date: latestClaim.paymentDate?.toISOString().split('T')[0],
          description: 'HTB refund paid to solicitor at property closing'
        }
      ]
    };

    return NextResponse.json({
      application: htbApplication,
      status: 'database_data',
      message: 'HTB data retrieved from database'
    });

  } catch (error) {
    console.error('Error fetching HTB data:', error);
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

    const body = await req.json();
    const { propertyId, amount } = body;

    // In development mode, return mock success
    if (isDevelopment) {
      return NextResponse.json({
        id: 'HTB-2024-NEW',
        status: 'created',
        message: 'HTB application created successfully (mock)',
        amount,
        propertyId
      });
    }

    // Create new HTB claim in database
    const newClaim = await prisma.htbClaim.create({
      data: {
        userId: currentUser.userId,
        propertyId,
        amount,
        status: 'PENDING',
        submissionDate: new Date()
      },
      include: {
        property: {
          include: {
            development: true
          }
        }
      }
    });

    return NextResponse.json({
      id: newClaim.id,
      status: 'created',
      message: 'HTB application created successfully',
      claim: newClaim
    });

  } catch (error) {
    console.error('Error creating HTB claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}