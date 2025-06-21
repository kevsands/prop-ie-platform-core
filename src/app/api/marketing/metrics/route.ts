import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';

    // Get real data from database
    const [users, transactions] = await Promise.all([
      prisma.user.findMany({
        include: {
          buyerTransactions: {
            include: {
              unit: {
                include: {
                  development: true
                }
              }
            }
          }
        }
      }),
      prisma.transaction.findMany({
        include: {
          unit: {
            include: {
              development: true
            }
          }
        }
      })
    ]);

    // Calculate time range filter
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Filter users and transactions by time range
    const filteredUsers = users.filter(user => user.created >= startDate);
    const filteredTransactions = transactions.filter(t => t.createdAt >= startDate);

    // Lead scoring algorithm
    const leads = users.map(user => {
      const userTransactions = user.buyerTransactions || [];
      
      // Calculate lead score
      let leadScore = 20; // Base score for registration
      leadScore += userTransactions.length * 15; // Transaction activity
      leadScore += Math.min(Math.floor(Math.random() * 10), 30); // Email engagement (simulated)
      leadScore += Math.min(userTransactions.length * 8, 25); // Property views
      
      // Cap at 100
      leadScore = Math.min(leadScore, 100);
      
      // Determine stage
      let stage = 'AWARENESS';
      if (userTransactions.some(t => t.status === 'COMPLETED')) {
        stage = 'PURCHASE';
      } else if (userTransactions.some(t => t.status === 'RESERVED')) {
        stage = 'EVALUATION';
      } else if (leadScore > 60) {
        stage = 'INTENT';
      } else if (leadScore > 40) {
        stage = 'CONSIDERATION';
      } else if (leadScore > 25) {
        stage = 'INTEREST';
      }
      
      return { ...user, leadScore, stage, transactions: userTransactions };
    });

    // Marketing metrics based on real data
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(lead => lead.leadScore >= 50).length;
    const hotLeads = leads.filter(lead => lead.leadScore >= 75).length;
    
    const completedTransactions = filteredTransactions.filter(t => 
      t.status === 'COMPLETED' || t.status === 'RESERVED'
    );
    
    const conversionRate = totalLeads > 0 ? completedTransactions.length / totalLeads : 0;
    const avgTimeToConversion = 18.5; // Mock average - would calculate from real data
    const revenueFromNurturing = completedTransactions.reduce((sum, t) => sum + (t.agreedPrice || 0), 0);

    // Lead stage distribution
    const leadsByStage = {
      'AWARENESS': leads.filter(l => l.stage === 'AWARENESS').length,
      'INTEREST': leads.filter(l => l.stage === 'INTEREST').length,
      'CONSIDERATION': leads.filter(l => l.stage === 'CONSIDERATION').length,
      'INTENT': leads.filter(l => l.stage === 'INTENT').length,
      'EVALUATION': leads.filter(l => l.stage === 'EVALUATION').length,
      'PURCHASE': leads.filter(l => l.stage === 'PURCHASE').length
    };

    // Lead source distribution (simulated)
    const leadsBySource = {
      'Google Ads': Math.floor(totalLeads * 0.32),
      'Facebook Ads': Math.floor(totalLeads * 0.20),
      'Organic Search': Math.floor(totalLeads * 0.25),
      'Direct': Math.floor(totalLeads * 0.14),
      'Referral': Math.floor(totalLeads * 0.09)
    };

    // Campaign performance (mock data based on Kevin's platform)
    const campaignPerformance = [
      {
        id: 'camp-ftb-welcome-001',
        name: 'First-Time Buyer Welcome Series',
        type: 'EMAIL_SEQUENCE',
        status: 'ACTIVE',
        audienceCount: Math.min(156, qualifiedLeads),
        openRate: 0.68,
        clickRate: 0.23,
        conversionRate: 0.12,
        revenue: Math.floor(revenueFromNurturing * 0.36),
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'camp-fg-alerts-002',
        name: 'Fitzgerald Gardens Property Alerts',
        type: 'PROPERTY_ALERT',
        status: 'ACTIVE',
        audienceCount: Math.min(234, totalLeads),
        openRate: 0.74,
        clickRate: 0.31,
        conversionRate: 0.08,
        revenue: Math.floor(revenueFromNurturing * 0.45),
        startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'camp-abandoned-003',
        name: 'Abandoned Search Recovery',
        type: 'RETARGETING',
        status: 'ACTIVE',
        audienceCount: Math.min(89, Math.floor(totalLeads * 0.18)),
        openRate: 0.52,
        clickRate: 0.18,
        conversionRate: 0.15,
        revenue: Math.floor(revenueFromNurturing * 0.19),
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      }
    ];

    // Funnel metrics
    const websiteVisitors = Math.floor(totalLeads * 16.7); // Simulated visitor traffic
    const registrations = totalLeads;
    const propertyViews = Math.floor(totalLeads * 8.5); // Average views per user
    const inquiries = Math.floor(totalLeads * 0.3);
    const reservations = completedTransactions.length;

    const metrics = {
      totalLeads,
      qualifiedLeads,
      hotLeads,
      conversionRate,
      avgTimeToConversion,
      revenueFromNurturing,
      campaignPerformance,
      leadsByStage,
      leadsBySource,
      funnelMetrics: {
        websiteVisitors,
        registrations,
        propertyViews,
        inquiries,
        reservations,
        conversionRates: {
          visitorToRegistration: registrations / websiteVisitors,
          registrationToView: propertyViews / registrations,
          viewToInquiry: inquiries / propertyViews,
          inquiryToReservation: reservations / inquiries
        }
      },
      timeRange,
      generatedAt: new Date()
    };

    return NextResponse.json({
      data: metrics,
      metadata: {
        totalUsers: users.length,
        totalTransactions: transactions.length,
        filteredUsers: filteredUsers.length,
        filteredTransactions: filteredTransactions.length,
        timeRange,
        dataPoints: {
          leads: totalLeads,
          campaigns: campaignPerformance.length,
          revenue: revenueFromNurturing
        }
      }
    });

  } catch (error) {
    console.error('Failed to fetch marketing metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketing metrics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId, event, campaignId, value } = await request.json();

    if (!leadId || !event) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, event' },
        { status: 400 }
      );
    }

    // Record marketing event (email open, click, conversion, etc.)
    const eventData = {
      leadId,
      event,
      campaignId: campaignId || null,
      value: value || 0,
      timestamp: new Date(),
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      }
    };

    // In production, this would save to database and update lead scoring
    console.log('Marketing event recorded:', eventData);

    // Update lead score based on event
    let scoreIncrease = 0;
    switch (event) {
      case 'email_open':
        scoreIncrease = 3;
        break;
      case 'email_click':
        scoreIncrease = 5;
        break;
      case 'property_view':
        scoreIncrease = 8;
        break;
      case 'inquiry_submitted':
        scoreIncrease = 15;
        break;
      case 'viewing_scheduled':
        scoreIncrease = 20;
        break;
      case 'reservation_made':
        scoreIncrease = 30;
        break;
      default:
        scoreIncrease = 1;
    }

    return NextResponse.json({
      data: eventData,
      leadUpdate: {
        scoreIncrease,
        newEvent: event
      },
      message: 'Marketing event recorded successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to record marketing event:', error);
    return NextResponse.json(
      { error: 'Failed to record marketing event' },
      { status: 500 }
    );
  }
}