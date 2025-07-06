import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';

/**
 * GET /api/finance
 * Fetches financial data for a specific project or development
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
    const timeRange = searchParams.get('timeRange') || 'month';
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Enhanced financial data with real calculations
    const baseRevenue = 1250000;
    const baseExpenses = 780000;
    const previousRevenue = 1100000;
    const previousExpenses = 740000;
    
    const currentProfitMargin = ((baseRevenue - baseExpenses) / baseRevenue) * 100;
    const previousProfitMargin = ((previousRevenue - previousExpenses) / previousRevenue) * 100;
    
    const financialData = {
      projectId,
      timeRange,
      calculatedAt: new Date().toISOString(),
      metrics: [
        {
          title: 'Total Revenue',
          value: baseRevenue,
          previousValue: previousRevenue,
          percentChange: ((baseRevenue - previousRevenue) / previousRevenue * 100).toFixed(2),
          trend: baseRevenue > previousRevenue ? 'up' : 'down'
        },
        {
          title: 'Expenses',
          value: baseExpenses,
          previousValue: previousExpenses,
          percentChange: ((baseExpenses - previousExpenses) / previousExpenses * 100).toFixed(2),
          trend: baseExpenses > previousExpenses ? 'up' : 'down'
        },
        {
          title: 'Profit Margin',
          value: currentProfitMargin.toFixed(1),
          previousValue: previousProfitMargin.toFixed(1),
          percentChange: ((currentProfitMargin - previousProfitMargin) / previousProfitMargin * 100).toFixed(2),
          trend: currentProfitMargin > previousProfitMargin ? 'up' : 'down'
        },
        {
          title: 'Units Sold',
          value: 42,
          previousValue: 38,
          percentChange: ((42 - 38) / 38 * 100).toFixed(2),
          trend: 'up'
        },
        {
          title: 'Net Profit',
          value: baseRevenue - baseExpenses,
          previousValue: previousRevenue - previousExpenses,
          percentChange: (((baseRevenue - baseExpenses) - (previousRevenue - previousExpenses)) / (previousRevenue - previousExpenses) * 100).toFixed(2),
          trend: (baseRevenue - baseExpenses) > (previousRevenue - previousExpenses) ? 'up' : 'down'
        }
      ],
      budgetData: [
        {
          title: 'Construction Costs',
          budgetValue: 650000,
          actualValue: 680000,
          category: 'Development',
        },
        {
          title: 'Land Acquisition',
          budgetValue: 350000,
          actualValue: 350000,
          category: 'Development',
        },
        {
          title: 'Marketing Budget',
          budgetValue: 80000,
          actualValue: 75000,
          category: 'Marketing',
        },
      ],
      revenueData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Residential',
            data: [180000, 210000, 250000, 280000, 330000],
          },
          {
            label: 'Commercial',
            data: [0, 0, 0, 0, 0],
          },
        ],
      },
      costData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Construction',
            data: [120000, 140000, 150000, 160000, 180000],
          },
          {
            label: 'Marketing',
            data: [15000, 18000, 20000, 22000, 25000],
          },
          {
            label: 'Administration',
            data: [30000, 30000, 32000, 32000, 35000],
          },
        ],
      },
      cashFlowData: {
        inflows: 1250000,
        outflows: 780000,
        netCashFlow: 470000,
        chartData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              label: 'Inflows',
              data: [230000, 250000, 270000, 290000, 310000],
            },
            {
              label: 'Outflows',
              data: [170000, 180000, 190000, 200000, 210000],
            },
            {
              label: 'Net Cash Flow',
              data: [60000, 70000, 80000, 90000, 100000],
            },
          ],
        },
      },
    };

    return NextResponse.json(financialData);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/finance/budget
 * Updates budget data for a project
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
    const { projectId, budgetData } = body;
    
    if (!projectId || !budgetData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would update the budget in database
    // For now, just return success response
    return NextResponse.json({
      success: true,
      message: 'Budget updated successfully',
      projectId,
    });
  } catch (error) {
    console.error('Error updating budget data:', error);
    return NextResponse.json(
      { error: 'Failed to update budget data' },
      { status: 500 }
    );
  }
}