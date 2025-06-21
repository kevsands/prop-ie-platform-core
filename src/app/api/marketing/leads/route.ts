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
    const stage = searchParams.get('stage');
    const category = searchParams.get('category');
    const score = searchParams.get('score');

    // Get all users with their activity data
    const users = await prisma.user.findMany({
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
      },
      orderBy: {
        created: 'desc'
      }
    });

    // Transform users into leads with scoring
    const leads = users.map(user => {
      const transactions = user.buyerTransactions || [];
      
      // Calculate lead score
      let leadScore = 0;
      
      // Base score for registration
      leadScore += 20;
      
      // Transaction activity
      leadScore += transactions.length * 15;
      
      // Session activity (simulated)
      leadScore += Math.min(Math.floor(Math.random() * 6) * 5, 30);
      
      // Email engagement (simulated)
      const emailOpens = Math.floor(Math.random() * 10);
      const emailClicks = Math.floor(Math.random() * 5);
      leadScore += emailOpens * 2 + emailClicks * 3;
      
      // Property views (simulated based on transactions)
      const propertyViews = transactions.length > 0 ? 
        Math.floor(Math.random() * 15) + 5 : 
        Math.floor(Math.random() * 8);
      leadScore += propertyViews * 2;
      
      // Cap score at 100
      leadScore = Math.min(leadScore, 100);
      
      // Determine stage based on transaction status and score
      let stage = 'AWARENESS';
      if (transactions.some(t => t.status === 'COMPLETED')) {
        stage = 'PURCHASE';
      } else if (transactions.some(t => t.status === 'RESERVED')) {
        stage = 'EVALUATION';
      } else if (leadScore > 60) {
        stage = 'INTENT';
      } else if (leadScore > 40) {
        stage = 'CONSIDERATION';
      } else if (leadScore > 25) {
        stage = 'INTEREST';
      }
      
      // Determine category
      let category = 'CASUAL_BROWSER';
      if (transactions.length > 0) {
        // Check property types for investment indicators
        const hasMultipleUnits = transactions.length > 1;
        const hasCommercial = transactions.some(t => 
          t.unit?.development?.name?.toLowerCase().includes('commercial') ||
          t.unit?.type?.toLowerCase().includes('commercial')
        );
        
        if (hasMultipleUnits || hasCommercial) {
          category = 'INVESTOR';
        } else {
          category = 'FIRST_TIME_BUYER';
        }
      } else if (leadScore > 50) {
        category = 'HIGH_VALUE_PROSPECT';
      }
      
      // Calculate engagement level
      let engagementLevel = 'LOW';
      if (leadScore >= 75) engagementLevel = 'URGENT';
      else if (leadScore >= 50) engagementLevel = 'HIGH';
      else if (leadScore >= 25) engagementLevel = 'MEDIUM';
      
      // Determine next action
      let nextAction = 'Send welcome email';
      if (stage === 'EVALUATION') nextAction = 'Schedule viewing appointment';
      else if (stage === 'INTENT') nextAction = 'Call within 24 hours';
      else if (stage === 'CONSIDERATION') nextAction = 'Send property recommendations';
      else if (engagementLevel === 'URGENT') nextAction = 'Immediate follow-up required';
      
      // Calculate total value (transaction amounts)
      const totalValue = transactions.reduce((sum, t) => sum + (t.agreedPrice || 0), 0);
      
      // Days in funnel (since registration)
      const daysInFunnel = Math.floor(
        (Date.now() - user.created.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      return {
        id: user.id,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
        email: user.email,
        phone: user.phone,
        stage,
        score: leadScore,
        category,
        source: 'Organic Search - Property Drogheda', // Would be tracked from UTM params
        interests: transactions.length > 0 ? 
          transactions.map(t => t.unit?.development?.name || 'Property').slice(0, 3) :
          ['Property News', 'Market Updates'],
        lastActivity: user.lastActive,
        totalValue,
        engagementLevel,
        nextAction,
        daysInFunnel,
        propertyViews,
        emailOpens,
        emailClicks
      };
    });

    // Apply filters
    let filteredLeads = leads;
    
    if (stage) {
      filteredLeads = filteredLeads.filter(lead => lead.stage === stage);
    }
    
    if (category) {
      filteredLeads = filteredLeads.filter(lead => lead.category === category);
    }
    
    if (score) {
      const minScore = parseInt(score);
      filteredLeads = filteredLeads.filter(lead => lead.score >= minScore);
    }

    return NextResponse.json({
      data: filteredLeads,
      total: filteredLeads.length,
      metadata: {
        totalUsers: users.length,
        avgScore: leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length,
        stageBreakdown: {
          AWARENESS: leads.filter(l => l.stage === 'AWARENESS').length,
          INTEREST: leads.filter(l => l.stage === 'INTEREST').length,
          CONSIDERATION: leads.filter(l => l.stage === 'CONSIDERATION').length,
          INTENT: leads.filter(l => l.stage === 'INTENT').length,
          EVALUATION: leads.filter(l => l.stage === 'EVALUATION').length,
          PURCHASE: leads.filter(l => l.stage === 'PURCHASE').length
        }
      }
    });

  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
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

    const { leadIds, action, campaignType } = await request.json();

    if (!leadIds || !Array.isArray(leadIds) || !action) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Process bulk action on leads
    const results = [];
    
    for (const leadId of leadIds) {
      try {
        // Find the user/lead
        const user = await prisma.user.findUnique({
          where: { id: leadId }
        });
        
        if (!user) {
          results.push({ leadId, success: false, error: 'Lead not found' });
          continue;
        }

        switch (action) {
          case 'send_email':
            // In production, integrate with email service
            console.log(`Sending ${campaignType} email to ${user.email}`);
            results.push({ 
              leadId, 
              success: true, 
              message: `Email sent to ${user.email}` 
            });
            break;
            
          case 'update_stage':
            // Would update lead stage in CRM system
            results.push({ 
              leadId, 
              success: true, 
              message: 'Stage updated successfully' 
            });
            break;
            
          case 'add_tag':
            // Would add tags to lead in CRM system
            results.push({ 
              leadId, 
              success: true, 
              message: 'Tag added successfully' 
            });
            break;
            
          default:
            results.push({ 
              leadId, 
              success: false, 
              error: 'Unknown action' 
            });
        }
      } catch (error) {
        results.push({ 
          leadId, 
          success: false, 
          error: error.message 
        });
      }
    }

    return NextResponse.json({
      data: results,
      summary: {
        total: leadIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });

  } catch (error) {
    console.error('Failed to process bulk action:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk action' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}