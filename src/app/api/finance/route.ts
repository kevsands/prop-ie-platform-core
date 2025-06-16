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

    // Mock data for demonstration - in production this would fetch from database
    const financialData = {
      projectId,
      timeRange,
      metrics: [
        {
          title: 'Total Revenue',
          value: 1250000,
          previousValue: 1100000,
          percentChange: 13.64},
        {
          title: 'Expenses',
          value: 780000,
          previousValue: 740000,
          percentChange: 5.41},
        {
          title: 'Profit Margin',
          value: 37.6,
          previousValue: 32.7,
          percentChange: 14.98},
        {
          title: 'Units Sold',
          value: 42,
          previousValue: 38,
          percentChange: 10.53}],
      budgetData: [
        {
          title: 'Construction Costs',
          budgetValue: 650000,
          actualValue: 680000,
          category: 'Development'},
        {
          title: 'Land Acquisition',
          budgetValue: 350000,
          actualValue: 350000,
          category: 'Development'},
        {
          title: 'Marketing Budget',
          budgetValue: 80000,
          actualValue: 75000,
          category: 'Marketing'}],
      revenueData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Residential',
            data: [180000210000250000280000330000]},
          {
            label: 'Commercial',
            data: [00000]}]},
      costData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Construction',
            data: [120000140000150000160000180000]},
          {
            label: 'Marketing',
            data: [1500018000200002200025000]},
          {
            label: 'Administration',
            data: [3000030000320003200035000]}]},
      cashFlowData: {
        inflows: 1250000,
        outflows: 780000,
        netCashFlow: 470000,
        chartData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              label: 'Inflows',
              data: [230000250000270000290000310000]},
            {
              label: 'Outflows',
              data: [170000180000190000200000210000]},
            {
              label: 'Net Cash Flow',
              data: [60000700008000090000100000]}]};

    return NextResponse.json(financialData);
  } catch (error) {

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
    const body: any = await request.json();
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
      projectId});
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to update budget data' },
      { status: 500 }
    );
  }
}