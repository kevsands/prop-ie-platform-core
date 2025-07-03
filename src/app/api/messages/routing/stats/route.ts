// API for routing statistics and analytics
import { NextRequest, NextResponse } from 'next/server';

interface RoutingStats {
  totalRules: number;
  activeRules: number;
  messagesRouted: number;
  averageResponseTime: number;
  routingAccuracy: number;
  topRoutingReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
  dailyRoutingVolume: Array<{
    date: string;
    count: number;
    automated: number;
    manual: number;
  }>;
  teamWorkload: Array<{
    team: string;
    messageCount: number;
    averageResponseTime: number;
    satisfaction: number;
  }>;
  rulePerformance: Array<{
    ruleId: string;
    ruleName: string;
    triggers: number;
    successRate: number;
    avgProcessingTime: number;
  }>;
}

// GET /api/messages/routing/stats - Get routing statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '7d'; // 1d, 7d, 30d, 90d
    const teamId = searchParams.get('team');

    console.log('[Routing Stats] Fetching stats for timeframe:', timeframe);

    // Mock statistics data for demonstration
    const mockStats: RoutingStats = {
      totalRules: 6,
      activeRules: 5,
      messagesRouted: 156,
      averageResponseTime: 24.5, // minutes
      routingAccuracy: 92.3,
      
      topRoutingReasons: [
        { reason: 'Urgent buyer queries', count: 45, percentage: 28.8 },
        { reason: 'Customization requests', count: 32, percentage: 20.5 },
        { reason: 'Payment inquiries', count: 28, percentage: 17.9 },
        { reason: 'After hours messages', count: 25, percentage: 16.0 },
        { reason: 'Legal documents', count: 15, percentage: 9.6 },
        { reason: 'Executive escalations', count: 11, percentage: 7.1 }
      ],

      dailyRoutingVolume: [
        { date: '2025-06-26', count: 18, automated: 15, manual: 3 },
        { date: '2025-06-27', count: 22, automated: 19, manual: 3 },
        { date: '2025-06-28', count: 25, automated: 21, manual: 4 },
        { date: '2025-06-29', count: 19, automated: 16, manual: 3 },
        { date: '2025-06-30', count: 24, automated: 20, manual: 4 },
        { date: '2025-07-01', count: 26, automated: 23, manual: 3 },
        { date: '2025-07-02', count: 22, automated: 19, manual: 3 }
      ],

      teamWorkload: [
        {
          team: 'Development Team',
          messageCount: 45,
          averageResponseTime: 18.5,
          satisfaction: 94.2
        },
        {
          team: 'Design Team',
          messageCount: 32,
          averageResponseTime: 32.1,
          satisfaction: 91.8
        },
        {
          team: 'Finance Team',
          messageCount: 28,
          averageResponseTime: 45.3,
          satisfaction: 87.5
        },
        {
          team: 'Legal Team',
          messageCount: 15,
          averageResponseTime: 120.5,
          satisfaction: 96.7
        },
        {
          team: 'Executive Team',
          messageCount: 11,
          averageResponseTime: 15.2,
          satisfaction: 98.1
        }
      ],

      rulePerformance: [
        {
          ruleId: 'rule_001',
          ruleName: 'Urgent Buyer Queries',
          triggers: 23,
          successRate: 94.5,
          avgProcessingTime: 12.3
        },
        {
          ruleId: 'rule_002',
          ruleName: 'Customization Requests',
          triggers: 18,
          successRate: 88.9,
          avgProcessingTime: 25.7
        },
        {
          ruleId: 'rule_003',
          ruleName: 'Executive Escalation',
          triggers: 5,
          successRate: 100.0,
          avgProcessingTime: 8.1
        },
        {
          ruleId: 'rule_004',
          ruleName: 'After Hours Support',
          triggers: 45,
          successRate: 96.2,
          avgProcessingTime: 2.1
        },
        {
          ruleId: 'rule_006',
          ruleName: 'Payment Queries',
          triggers: 12,
          successRate: 91.7,
          avgProcessingTime: 18.9
        }
      ]
    };

    // Apply team filter if specified
    if (teamId) {
      mockStats.teamWorkload = mockStats.teamWorkload.filter(team => 
        team.team.toLowerCase().includes(teamId.toLowerCase())
      );
    }

    // Calculate efficiency metrics
    const totalAutomated = mockStats.dailyRoutingVolume.reduce((sum, day) => sum + day.automated, 0);
    const totalManual = mockStats.dailyRoutingVolume.reduce((sum, day) => sum + day.manual, 0);
    const automationRate = totalAutomated / (totalAutomated + totalManual) * 100;

    const insights = {
      automationRate: Math.round(automationRate * 10) / 10,
      topPerformingRule: mockStats.rulePerformance.reduce((top, rule) => 
        rule.successRate > top.successRate ? rule : top, mockStats.rulePerformance[0]
      ),
      busyTeam: mockStats.teamWorkload.reduce((busy, team) => 
        team.messageCount > busy.messageCount ? team : busy, mockStats.teamWorkload[0]
      ),
      trends: {
        volumeChange: '+12.5%', // vs previous period
        responseTimeChange: '-8.3%',
        satisfactionChange: '+2.1%'
      }
    };

    return NextResponse.json({
      success: true,
      stats: mockStats,
      insights,
      timeframe,
      generatedAt: new Date().toISOString(),
      message: 'Routing statistics retrieved successfully'
    });

  } catch (error: any) {
    console.error('Routing stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routing statistics' },
      { status: 500 }
    );
  }
}

// POST /api/messages/routing/stats/export - Export routing analytics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format = 'csv', timeframe = '30d', includeDetails = false } = body;

    console.log('[Routing Stats] Exporting analytics:', { format, timeframe });

    // In production, generate actual export file
    const exportData = {
      filename: `routing_analytics_${timeframe}_${new Date().toISOString().split('T')[0]}.${format}`,
      url: `/exports/routing_analytics_${Date.now()}.${format}`,
      size: '1.2MB',
      recordCount: 156,
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      export: exportData,
      message: 'Export generated successfully'
    });

  } catch (error: any) {
    console.error('Export routing stats error:', error);
    return NextResponse.json(
      { error: 'Failed to export statistics' },
      { status: 500 }
    );
  }
}