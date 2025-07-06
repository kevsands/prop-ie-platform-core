import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';

/**
 * GET /api/finance/budget-vs-actual
 * Fetches budget vs actual data for a specific project
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
    const category = searchParams.get('category');
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Mock budget vs actual data - in production this would be fetched from database
    const budgetVsActualData = [
      {
        title: 'Construction Costs',
        budgetValue: 650000,
        actualValue: 680000,
        category: 'Development',
        invertComparison: true
      },
      {
        title: 'Land Acquisition',
        budgetValue: 350000,
        actualValue: 350000,
        category: 'Development',
        invertComparison: true
      },
      {
        title: 'Permits & Fees',
        budgetValue: 45000,
        actualValue: 42000,
        category: 'Development',
        invertComparison: true
      },
      {
        title: 'Marketing Budget',
        budgetValue: 80000,
        actualValue: 75000,
        category: 'Marketing',
        invertComparison: true
      },
      {
        title: 'Sales Costs',
        budgetValue: 120000,
        actualValue: 115000,
        category: 'Sales',
        invertComparison: true
      },
      {
        title: 'Administrative Costs',
        budgetValue: 90000,
        actualValue: 98000,
        category: 'Administrative',
        invertComparison: true
      },
      {
        title: 'Legal Fees',
        budgetValue: 35000,
        actualValue: 38000,
        category: 'Administrative',
        invertComparison: true
      },
      {
        title: 'Revenue - Phase 1',
        budgetValue: 800000,
        actualValue: 850000,
        category: 'Revenue'
      },
      {
        title: 'Revenue - Phase 2',
        budgetValue: 450000,
        actualValue: 400000,
        category: 'Revenue'
      },
    ];

    // Filter by category if specified
    const filteredData = category 
      ? budgetVsActualData.filter(item => item.category === category)
      : budgetVsActualData;
    
    // Calculate summary metrics
    const summary = {
      totalBudget: filteredData.reduce((sum, item) => sum + item.budgetValue, 0),
      totalActual: filteredData.reduce((sum, item) => sum + item.actualValue, 0),
      variance: filteredData.reduce((sum, item) => sum + (item.actualValue - item.budgetValue), 0),
      overBudgetItems: filteredData.filter(item => 
        (item.invertComparison && item.actualValue > item.budgetValue) || 
        (!item.invertComparison && item.actualValue < item.budgetValue)
      ).length,
      underBudgetItems: filteredData.filter(item => 
        (item.invertComparison && item.actualValue < item.budgetValue) || 
        (!item.invertComparison && item.actualValue > item.budgetValue)
      ).length
    };

    // Monthly breakdown
    const monthlyBreakdown = [
      { month: 'Jan', budget: 175000, actual: 170000 },
      { month: 'Feb', budget: 185000, actual: 190000 },
      { month: 'Mar', budget: 190000, actual: 195000 },
      { month: 'Apr', budget: 200000, actual: 205000 },
      { month: 'May', budget: 210000, actual: 220000 },
    ];

    return NextResponse.json({
      projectId,
      budgetVsActual: filteredData,
      summary,
      monthlyBreakdown
    });
  } catch (error) {
    console.error('Error fetching budget vs actual data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget vs actual data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/finance/budget-vs-actual
 * Updates budget data for a specific item
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
    const { projectId, itemId, budgetValue } = body;
    
    if (!projectId || !itemId || budgetValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would update the budget in database
    // For now, just return success response
    return NextResponse.json({
      success: true,
      message: 'Budget item updated successfully',
      projectId,
      itemId
    });
  } catch (error) {
    console.error('Error updating budget item:', error);
    return NextResponse.json(
      { error: 'Failed to update budget item' },
      { status: 500 }
    );
  }
}