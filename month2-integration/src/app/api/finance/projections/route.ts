import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';

/**
 * GET /api/finance/projections
 * Fetches financial projections for a specific project
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const projectionPeriod = searchParams.get('period') || '12months';
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Mock projection data - in production this would be generated based on actual data and models
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const displayMonths = projectionPeriod === '12months' ? months : months.slice(0, 6);
    
    const revenueProjection = {
      baseline: [350000, 370000, 390000, 410000, 430000, 450000, 470000, 490000, 510000, 530000, 550000, 570000],
      optimistic: [380000, 400000, 430000, 460000, 490000, 520000, 550000, 580000, 610000, 640000, 670000, 700000],
      pessimistic: [320000, 330000, 340000, 350000, 360000, 370000, 380000, 390000, 400000, 410000, 420000, 430000]
    };
    
    const profitProjection = {
      baseline: [105000, 110000, 115000, 120000, 125000, 130000, 135000, 140000, 145000, 150000, 155000, 160000],
      optimistic: [120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 210000, 220000, 230000],
      pessimistic: [90000, 95000, 100000, 105000, 110000, 115000, 120000, 125000, 130000, 135000, 140000, 145000]
    };
    
    const cashFlowProjection = {
      inflows: [350000, 370000, 390000, 410000, 430000, 450000, 470000, 490000, 510000, 530000, 550000, 570000],
      outflows: [240000, 250000, 260000, 270000, 280000, 290000, 300000, 310000, 320000, 330000, 340000, 350000],
      net: [110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 210000, 220000],
      cumulativeCash: [600000, 720000, 850000, 990000, 1140000, 1300000, 1470000, 1650000, 1840000, 2040000, 2250000, 2470000]
    };

    // Format data for response
    const revenueData = displayMonths.map((month, i) => ({
      month,
      baseline: revenueProjection.baseline[i],
      optimistic: revenueProjection.optimistic[i],
      pessimistic: revenueProjection.pessimistic[i]
    }));
    
    const profitData = displayMonths.map((month, i) => ({
      month,
      baseline: profitProjection.baseline[i],
      optimistic: profitProjection.optimistic[i],
      pessimistic: profitProjection.pessimistic[i]
    }));
    
    const cashFlowData = displayMonths.map((month, i) => ({
      month,
      inflows: cashFlowProjection.inflows[i],
      outflows: cashFlowProjection.outflows[i],
      netCashFlow: cashFlowProjection.net[i],
      cashPosition: cashFlowProjection.cumulativeCash[i]
    }));
    
    // Sensitivity analysis data
    const sensitivityAnalysis = [
      { variable: '-10%', profitMargin: 14, returnOnInvestment: 8 },
      { variable: '-5%', profitMargin: 18, returnOnInvestment: 12 },
      { variable: '0%', profitMargin: 22, returnOnInvestment: 16 },
      { variable: '+5%', profitMargin: 26, returnOnInvestment: 20 },
      { variable: '+10%', profitMargin: 30, returnOnInvestment: 24 },
    ];

    return NextResponse.json({
      projectId,
      projectionPeriod,
      revenueProjection: revenueData,
      profitProjection: profitData,
      cashFlowProjection: cashFlowData,
      sensitivityAnalysis,
      summary: {
        projectedRevenue: revenueProjection.baseline.reduce((sum, val) => sum + val, 0),
        projectedProfit: profitProjection.baseline.reduce((sum, val) => sum + val, 0),
        projectedCashFlow: cashFlowProjection.net.reduce((sum, val) => sum + val, 0),
        endingCashPosition: cashFlowProjection.cumulativeCash[cashFlowProjection.cumulativeCash.length - 1]
      }
    });
  } catch (error) {
    console.error('Error fetching financial projections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial projections' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/finance/projections
 * Creates or updates financial projections for a project
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { projectId, assumptions } = body;
    
    if (!projectId || !assumptions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would update the projections in database
    // For now, just return success response
    return NextResponse.json({
      success: true,
      message: 'Projections updated successfully',
      projectId,
    });
  } catch (error) {
    console.error('Error updating projections:', error);
    return NextResponse.json(
      { error: 'Failed to update projections' },
      { status: 500 }
    );
  }
}