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

    // Mock automation workflows based on Kevin's property platform
    const automationWorkflows = [
      {
        id: 'auto-welcome-001',
        name: 'Welcome Series',
        type: 'EMAIL_SEQUENCE',
        description: '5-email sequence introducing Kevin\'s developments and first-time buyer guidance',
        status: 'ACTIVE',
        trigger: {
          event: 'user_registration',
          conditions: {
            category: ['FIRST_TIME_BUYER', 'CASUAL_BROWSER']
          }
        },
        steps: [
          {
            stepNumber: 1,
            action: 'send_email',
            template: 'welcome_intro',
            delay: 0,
            subject: 'Welcome to Kevin Fitzgerald Developments'
          },
          {
            stepNumber: 2,
            action: 'send_email',
            template: 'first_time_buyer_guide',
            delay: 86400000, // 24 hours
            subject: 'Your First-Time Buyer\'s Guide to Irish Property'
          },
          {
            stepNumber: 3,
            action: 'send_email',
            template: 'development_showcase',
            delay: 259200000, // 3 days
            subject: 'Discover Our Premium Developments'
          },
          {
            stepNumber: 4,
            action: 'send_email',
            template: 'help_to_buy_info',
            delay: 604800000, // 7 days
            subject: 'Maximize Your Help-to-Buy Benefits'
          },
          {
            stepNumber: 5,
            action: 'send_email',
            template: 'viewing_invitation',
            delay: 1209600000, // 14 days
            subject: 'Ready to Visit? Book Your Private Viewing'
          }
        ],
        performance: {
          activeSubscribers: 156,
          completionRate: 0.73,
          avgOpenRate: 0.68,
          avgClickRate: 0.23,
          conversions: 19,
          revenue: 987000
        },
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'auto-abandoned-002',
        name: 'Abandoned Search Recovery',
        type: 'RETARGETING',
        description: 'Re-engagement for users who viewed 3+ properties without registering',
        status: 'ACTIVE',
        trigger: {
          event: 'abandoned_search',
          conditions: {
            propertyViews: 3,
            timeWithoutAction: 3600000, // 1 hour
            isRegistered: false
          }
        },
        steps: [
          {
            stepNumber: 1,
            action: 'show_popup',
            template: 'registration_incentive',
            delay: 0,
            subject: 'Get Instant Property Updates'
          },
          {
            stepNumber: 2,
            action: 'send_email',
            template: 'property_recommendations',
            delay: 86400000, // 24 hours (if email provided)
            subject: 'Properties You Might Love'
          },
          {
            stepNumber: 3,
            action: 'send_email',
            template: 'limited_availability',
            delay: 259200000, // 3 days
            subject: 'These Properties Are Selling Fast'
          }
        ],
        performance: {
          activeSubscribers: 89,
          completionRate: 0.52,
          avgOpenRate: 0.52,
          avgClickRate: 0.18,
          conversions: 13,
          revenue: 503500
        },
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'auto-favorites-003',
        name: 'Property Favorites Notifications',
        type: 'PROPERTY_ALERT',
        description: 'Instant notifications when favorited properties have updates',
        status: 'ACTIVE',
        trigger: {
          event: 'property_favorite',
          conditions: {
            isRegistered: true
          }
        },
        steps: [
          {
            stepNumber: 1,
            action: 'send_notification',
            template: 'favorite_confirmation',
            delay: 0,
            subject: 'Property Added to Favorites'
          },
          {
            stepNumber: 2,
            action: 'send_email',
            template: 'price_drop_alert',
            delay: 0, // Immediate when price changes
            subject: 'Price Drop Alert: Your Favorite Property'
          },
          {
            stepNumber: 3,
            action: 'send_email',
            template: 'availability_alert',
            delay: 0, // Immediate when status changes
            subject: 'New Units Available in Your Favorite Development'
          }
        ],
        performance: {
          activeSubscribers: 234,
          completionRate: 0.89,
          avgOpenRate: 0.74,
          avgClickRate: 0.31,
          conversions: 28,
          revenue: 1245000
        },
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'auto-viewing-004',
        name: 'Viewing Reminder System',
        type: 'APPOINTMENT_AUTOMATION',
        description: 'Automated scheduling and reminder system for property viewings',
        status: 'ACTIVE',
        trigger: {
          event: 'viewing_scheduled',
          conditions: {
            appointmentType: 'property_viewing'
          }
        },
        steps: [
          {
            stepNumber: 1,
            action: 'send_email',
            template: 'viewing_confirmation',
            delay: 0,
            subject: 'Your Property Viewing is Confirmed'
          },
          {
            stepNumber: 2,
            action: 'send_sms',
            template: 'viewing_reminder_24h',
            delay: -86400000, // 24 hours before
            subject: 'Reminder: Property viewing tomorrow'
          },
          {
            stepNumber: 3,
            action: 'send_sms',
            template: 'viewing_reminder_2h',
            delay: -7200000, // 2 hours before
            subject: 'Your viewing starts in 2 hours'
          },
          {
            stepNumber: 4,
            action: 'send_email',
            template: 'post_viewing_followup',
            delay: 86400000, // 24 hours after
            subject: 'Thanks for visiting - Next steps'
          }
        ],
        performance: {
          activeSubscribers: 45,
          completionRate: 0.91,
          avgOpenRate: 0.85,
          avgClickRate: 0.42,
          conversions: 23,
          revenue: 890000
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'auto-investor-005',
        name: 'Investor Opportunity Alerts',
        type: 'INVESTMENT_OPPORTUNITIES',
        description: 'Targeted alerts for high-value investors about new opportunities',
        status: 'ACTIVE',
        trigger: {
          event: 'new_investment_property',
          conditions: {
            category: ['INVESTOR'],
            leadScore: 60
          }
        },
        steps: [
          {
            stepNumber: 1,
            action: 'send_email',
            template: 'investment_opportunity',
            delay: 0,
            subject: 'Exclusive Investment Opportunity Available'
          },
          {
            stepNumber: 2,
            action: 'send_email',
            template: 'yield_analysis',
            delay: 86400000, // 24 hours
            subject: 'Rental Yield Analysis for Your Investment'
          },
          {
            stepNumber: 3,
            action: 'schedule_call',
            template: 'investment_consultation',
            delay: 259200000, // 3 days
            subject: 'Investment consultation scheduled'
          }
        ],
        performance: {
          activeSubscribers: 32,
          completionRate: 0.84,
          avgOpenRate: 0.81,
          avgClickRate: 0.34,
          conversions: 11,
          revenue: 2150000
        },
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'auto-customization-006',
        name: 'Customization Upsell Workflow',
        type: 'PROP_CHOICE_UPSELL',
        description: 'Targeted upselling of customization packages to reserved buyers',
        status: 'PAUSED',
        trigger: {
          event: 'property_reserved',
          conditions: {
            hasCustomizations: false,
            reservationValue: 300000
          }
        },
        steps: [
          {
            stepNumber: 1,
            action: 'send_email',
            template: 'customization_intro',
            delay: 86400000, // 24 hours after reservation
            subject: 'Personalize Your New Home'
          },
          {
            stepNumber: 2,
            action: 'send_email',
            template: 'kitchen_upgrade_offer',
            delay: 259200000, // 3 days
            subject: 'Limited Time: Premium Kitchen Upgrade'
          },
          {
            stepNumber: 3,
            action: 'schedule_call',
            template: 'customization_consultation',
            delay: 604800000, // 7 days
            subject: 'Design consultation scheduled'
          }
        ],
        performance: {
          activeSubscribers: 67,
          completionRate: 0.67,
          avgOpenRate: 0.73,
          avgClickRate: 0.41,
          conversions: 19,
          revenue: 189000
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    ];

    // Calculate overall metrics
    const totalActiveWorkflows = automationWorkflows.filter(w => w.status === 'ACTIVE').length;
    const totalSubscribers = automationWorkflows.reduce((sum, w) => sum + w.performance.activeSubscribers, 0);
    const totalConversions = automationWorkflows.reduce((sum, w) => sum + w.performance.conversions, 0);
    const totalRevenue = automationWorkflows.reduce((sum, w) => sum + w.performance.revenue, 0);
    const avgCompletionRate = automationWorkflows.reduce((sum, w) => sum + w.performance.completionRate, 0) / automationWorkflows.length;

    return NextResponse.json({
      data: automationWorkflows,
      total: automationWorkflows.length,
      metadata: {
        totalActiveWorkflows,
        totalSubscribers,
        totalConversions,
        totalRevenue,
        avgCompletionRate,
        typeBreakdown: {
          EMAIL_SEQUENCE: automationWorkflows.filter(w => w.type === 'EMAIL_SEQUENCE').length,
          RETARGETING: automationWorkflows.filter(w => w.type === 'RETARGETING').length,
          PROPERTY_ALERT: automationWorkflows.filter(w => w.type === 'PROPERTY_ALERT').length,
          APPOINTMENT_AUTOMATION: automationWorkflows.filter(w => w.type === 'APPOINTMENT_AUTOMATION').length,
          INVESTMENT_OPPORTUNITIES: automationWorkflows.filter(w => w.type === 'INVESTMENT_OPPORTUNITIES').length,
          PROP_CHOICE_UPSELL: automationWorkflows.filter(w => w.type === 'PROP_CHOICE_UPSELL').length
        }
      }
    });

  } catch (error) {
    console.error('Failed to fetch automation workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch automation workflows' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflowData = await request.json();

    const {
      name,
      type,
      description,
      trigger,
      steps
    } = workflowData;

    if (!name || !type || !trigger || !steps) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, trigger, steps' },
        { status: 400 }
      );
    }

    // Generate workflow ID
    const workflowId = `auto-${type.toLowerCase().replace('_', '-')}-${Date.now().toString().slice(-6)}`;

    // Create new automation workflow
    const newWorkflow = {
      id: workflowId,
      name,
      type,
      description: description || `${name} automation workflow`,
      status: 'ACTIVE',
      trigger,
      steps,
      performance: {
        activeSubscribers: 0,
        completionRate: 0,
        avgOpenRate: 0,
        avgClickRate: 0,
        conversions: 0,
        revenue: 0
      },
      createdAt: new Date()
    };

    // In production, this would save to database and register with automation engine
    console.log('Automation workflow created:', newWorkflow);

    return NextResponse.json({
      data: newWorkflow,
      message: 'Automation workflow created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to create automation workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create automation workflow' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId, status } = await request.json();

    if (!workflowId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: workflowId, status' },
        { status: 400 }
      );
    }

    // In production, this would update the workflow status in database
    console.log(`Workflow ${workflowId} status updated to: ${status}`);

    return NextResponse.json({
      message: `Workflow ${status.toLowerCase()} successfully`,
      workflowId,
      status
    });

  } catch (error) {
    console.error('Failed to update automation workflow:', error);
    return NextResponse.json(
      { error: 'Failed to update automation workflow' },
      { status: 500 }
    );
  }
}