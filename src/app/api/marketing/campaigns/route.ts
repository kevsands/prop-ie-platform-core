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
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    // Mock campaign data based on Kevin's property platform
    const campaigns = [
      {
        id: 'camp-ftb-welcome-001',
        name: 'First-Time Buyer Welcome Series',
        type: 'EMAIL_SEQUENCE',
        status: 'ACTIVE',
        audienceCount: 156,
        openRate: 0.68,
        clickRate: 0.23,
        conversionRate: 0.12,
        revenue: 987000,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: null,
        description: '5-email sequence introducing Kevin\'s developments and first-time buyer guidance',
        targetCategory: ['FIRST_TIME_BUYER'],
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'camp-fg-alerts-002',
        name: 'Fitzgerald Gardens Property Alerts',
        type: 'PROPERTY_ALERT',
        status: 'ACTIVE',
        audienceCount: 234,
        openRate: 0.74,
        clickRate: 0.31,
        conversionRate: 0.08,
        revenue: 1245000,
        startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        endDate: null,
        description: 'Targeted alerts for new releases and price updates in Fitzgerald Gardens',
        targetCategory: ['FIRST_TIME_BUYER', 'UPGRADER'],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'camp-abandoned-003',
        name: 'Abandoned Search Recovery',
        type: 'RETARGETING',
        status: 'ACTIVE',
        audienceCount: 89,
        openRate: 0.52,
        clickRate: 0.18,
        conversionRate: 0.15,
        revenue: 503500,
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        endDate: null,
        description: 'Re-engagement campaign for visitors who viewed 3+ properties without registering',
        targetCategory: ['CASUAL_BROWSER', 'HIGH_VALUE_PROSPECT'],
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'camp-investor-004',
        name: 'Investment Opportunity Digest',
        type: 'INVESTMENT_OPPORTUNITIES',
        status: 'ACTIVE',
        audienceCount: 45,
        openRate: 0.81,
        clickRate: 0.34,
        conversionRate: 0.22,
        revenue: 2150000,
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        endDate: null,
        description: 'Monthly digest of investment properties and rental yield analysis',
        targetCategory: ['INVESTOR'],
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'camp-nurture-005',
        name: 'Property Education Series',
        type: 'NURTURE_SEQUENCE',
        status: 'ACTIVE',
        audienceCount: 312,
        openRate: 0.61,
        clickRate: 0.19,
        conversionRate: 0.05,
        revenue: 425000,
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: null,
        description: 'Educational content about the property buying process in Ireland',
        targetCategory: ['FIRST_TIME_BUYER', 'CASUAL_BROWSER'],
        createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'camp-customization-006',
        name: 'Kitchen Upgrade Promotion',
        type: 'PROP_CHOICE_UPSELL',
        status: 'PAUSED',
        audienceCount: 67,
        openRate: 0.73,
        clickRate: 0.41,
        conversionRate: 0.28,
        revenue: 189000,
        startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        description: 'Limited-time promotion for premium kitchen packages',
        targetCategory: ['FIRST_TIME_BUYER', 'UPGRADER'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    ];

    // Apply filters
    let filteredCampaigns = campaigns;
    
    if (type) {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.type === type);
    }
    
    if (status) {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === status);
    }

    // Calculate summary metrics
    const totalSent = filteredCampaigns.reduce((sum, campaign) => sum + campaign.audienceCount, 0);
    const avgOpenRate = filteredCampaigns.reduce((sum, campaign) => sum + campaign.openRate, 0) / filteredCampaigns.length;
    const avgClickRate = filteredCampaigns.reduce((sum, campaign) => sum + campaign.clickRate, 0) / filteredCampaigns.length;
    const totalRevenue = filteredCampaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);

    return NextResponse.json({
      data: filteredCampaigns,
      total: filteredCampaigns.length,
      metadata: {
        totalSent,
        avgOpenRate,
        avgClickRate,
        totalRevenue,
        activeCampaigns: filteredCampaigns.filter(c => c.status === 'ACTIVE').length,
        typeBreakdown: {
          EMAIL_SEQUENCE: campaigns.filter(c => c.type === 'EMAIL_SEQUENCE').length,
          PROPERTY_ALERT: campaigns.filter(c => c.type === 'PROPERTY_ALERT').length,
          RETARGETING: campaigns.filter(c => c.type === 'RETARGETING').length,
          INVESTMENT_OPPORTUNITIES: campaigns.filter(c => c.type === 'INVESTMENT_OPPORTUNITIES').length,
          NURTURE_SEQUENCE: campaigns.filter(c => c.type === 'NURTURE_SEQUENCE').length,
          PROP_CHOICE_UPSELL: campaigns.filter(c => c.type === 'PROP_CHOICE_UPSELL').length
        }
      }
    });

  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
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

    const campaignData = await request.json();

    const {
      name,
      type,
      targetCategory,
      subject,
      content,
      triggerConditions,
      scheduling
    } = campaignData;

    if (!name || !type || !targetCategory) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, targetCategory' },
        { status: 400 }
      );
    }

    // Generate campaign ID
    const campaignId = `camp-${type.toLowerCase().replace('_', '-')}-${Date.now().toString().slice(-6)}`;

    // Create new campaign
    const newCampaign = {
      id: campaignId,
      name,
      type,
      status: 'ACTIVE',
      audienceCount: 0, // Will be calculated when campaign is executed
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0,
      startDate: new Date(),
      endDate: scheduling?.endDate ? new Date(scheduling.endDate) : null,
      description: content || `${name} campaign`,
      targetCategory: Array.isArray(targetCategory) ? targetCategory : [targetCategory],
      subject: subject || `Update from Kevin Fitzgerald Developments`,
      triggerConditions: triggerConditions || {},
      scheduling: scheduling || { immediate: true },
      createdAt: new Date()
    };

    // In production, this would save to database and integrate with email service
    console.log('Campaign created:', newCampaign);

    return NextResponse.json({
      data: newCampaign,
      message: 'Campaign created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to create campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}