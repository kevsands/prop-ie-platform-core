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
    
    // Try to get user data from database
    let dbUser;
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: currentUser.email },
        include: {
          buyerProfile: true,
          savedProperties: {
            include: {
              property: {
                include: {
                  development: true
                }
              }
            }
          },
          htbClaims: true,
          documents: true,
          tasks: true
        }
      });
    } catch (dbError) {
      console.error('Database query failed:', dbError);
      if (!isDevelopment) {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 500 }
        );
      }
    }

    // If no user in database and in development, return mock data
    if (!dbUser && isDevelopment) {
      const mockData = {
        user: {
          id: currentUser.userId,
          email: currentUser.email,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          roles: currentUser.roles
        },
        metrics: {
          budget: 380000,
          htbBenefit: 30000,
          preApprovalAmount: 350000,
          monthlyPayment: 1650,
          savedProperties: 7,
          documentsUploaded: 8,
          verificationStatus: 'completed' as const,
          journeyProgress: 75,
          tasksCompleted: 12,
          totalTasks: 16
        },
        nextAppointment: {
          type: 'Mortgage Consultation',
          date: 'Tomorrow at 2:00 PM',
          location: 'Bank of Ireland, O\'Connell Street'
        },
        tasks: [
          {
            id: '1',
            title: 'Complete Mortgage Application',
            description: 'Submit final mortgage application with supporting documents',
            status: 'in_progress' as const,
            priority: 'high' as const,
            dueDate: '2 days',
            progress: 85,
            category: 'financial' as const
          },
          {
            id: '2',
            title: 'Schedule Property Viewing',
            description: 'Book viewing appointments for shortlisted properties',
            status: 'pending' as const,
            priority: 'high' as const,
            dueDate: '3 days',
            category: 'property' as const
          },
          {
            id: '3',
            title: 'HTB Application Review',
            description: 'Review and submit Help-to-Buy scheme application',
            status: 'pending' as const,
            priority: 'medium' as const,
            dueDate: '1 week',
            category: 'financial' as const
          }
        ],
        savedProperties: [
          {
            id: '1',
            title: 'Fitzgerald Gardens - Unit 23',
            price: 385000,
            location: 'Cork, Ireland',
            beds: 3,
            baths: 2,
            htbEligible: true,
            developer: 'Premium Developments',
            status: 'available' as const,
            image: '/api/placeholder/300/200'
          },
          {
            id: '2',
            title: 'Ellwood - Unit 15',
            price: 420000,
            location: 'Dublin, Ireland',
            beds: 2,
            baths: 2,
            htbEligible: true,
            developer: 'Dublin Properties Ltd',
            status: 'reserved' as const,
            image: '/api/placeholder/300/200'
          }
        ]
      };

      return NextResponse.json(mockData);
    }

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Calculate real metrics from database
    const completedTasks = dbUser.tasks.filter(task => task.status === 'COMPLETED').length;
    const totalTasks = dbUser.tasks.length;
    const journeyProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Get latest HTB claim
    const latestHtbClaim = dbUser.htbClaims[0];
    const htbBenefit = latestHtbClaim?.amount || 0;

    // Calculate budget and approval amount from buyer profile
    const budget = dbUser.buyerProfile?.budget || 0;
    const preApprovalAmount = dbUser.buyerProfile?.preApprovalAmount || 0;
    const monthlyPayment = dbUser.buyerProfile?.monthlyPayment || 0;

    // Transform saved properties
    const savedProperties = dbUser.savedProperties.map(sp => ({
      id: sp.property.id,
      title: `${sp.property.development?.name} - Unit ${sp.property.unitNumber}`,
      price: sp.property.price,
      location: sp.property.location,
      beds: sp.property.bedrooms,
      baths: sp.property.bathrooms,
      htbEligible: sp.property.htbEligible,
      developer: sp.property.development?.name || 'Unknown Developer',
      status: sp.property.status.toLowerCase(),
      image: '/api/placeholder/300/200'
    }));

    // Transform tasks
    const tasks = dbUser.tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status.toLowerCase(),
      priority: task.priority.toLowerCase(),
      dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : undefined,
      progress: task.progress,
      category: task.category.toLowerCase()
    }));

    const response = {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        roles: currentUser.roles
      },
      metrics: {
        budget,
        htbBenefit,
        preApprovalAmount,
        monthlyPayment,
        savedProperties: savedProperties.length,
        documentsUploaded: dbUser.documents.length,
        verificationStatus: dbUser.verificationStatus?.toLowerCase() || 'pending',
        journeyProgress,
        tasksCompleted: completedTasks,
        totalTasks
      },
      nextAppointment: dbUser.buyerProfile?.nextAppointment ? {
        type: dbUser.buyerProfile.nextAppointment.type,
        date: dbUser.buyerProfile.nextAppointment.date.toISOString(),
        location: dbUser.buyerProfile.nextAppointment.location
      } : null,
      tasks,
      savedProperties
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching buyer overview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}