/**
 * Dynamic Pricing API
 * AI-powered pricing recommendations and market intelligence
 */

import { NextRequest, NextResponse } from 'next/server';
import { dynamicPricingEngine } from '@/lib/services/dynamic-pricing-engine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const developmentId = searchParams.get('developmentId');
    const unitId = searchParams.get('unitId');
    const action = searchParams.get('action');

    // Get market intelligence for development
    if (action === 'market-intelligence' && developmentId) {
      const intelligence = dynamicPricingEngine.getMarketIntelligence(developmentId);
      
      if (!intelligence) {
        return NextResponse.json(
          { error: 'Market intelligence not found for development' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: intelligence
      });
    }

    // Get pricing history for unit
    if (action === 'pricing-history' && unitId) {
      const history = dynamicPricingEngine.getPricingHistory(unitId);
      
      return NextResponse.json({
        success: true,
        data: history
      });
    }

    // Get bulk pricing recommendations for development
    if (action === 'bulk-recommendations' && developmentId) {
      // Mock unit data for Fitzgerald Gardens
      const units = [];
      for (let i = 13; i <= 27; i++) { // Available units 13-27
        const unitType = i <= 18 ? '2-bed' : '3-bed-penthouse';
        const basePrice = i <= 18 ? 420000 : 520000;
        
        units.push({
          unitId: `unit-${i}`,
          currentPrice: basePrice + (Math.random() * 20000 - 10000),
          basePrice,
          viewingActivity: Math.floor(Math.random() * 15) + 3,
          interestExpressions: Math.floor(Math.random() * 8) + 2,
          timeOnMarket: Math.floor(Math.random() * 30) + 5,
          features: i > 24 ? ['penthouse', 'balcony', 'parking_space'] : ['balcony', 'parking_space']
        });
      }

      const recommendations = await dynamicPricingEngine.getBulkPricingRecommendations(
        developmentId,
        units
      );

      return NextResponse.json({
        success: true,
        data: recommendations,
        count: recommendations.length
      });
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in dynamic pricing API:', error);
    return NextResponse.json(
      { error: 'Failed to process pricing request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unitId, developmentId, factors } = body;

    if (!unitId || !developmentId || !factors) {
      return NextResponse.json(
        { error: 'Missing required fields: unitId, developmentId, factors' },
        { status: 400 }
      );
    }

    // Generate pricing recommendation
    const recommendation = await dynamicPricingEngine.calculatePricingRecommendation(
      unitId,
      developmentId,
      factors
    );

    return NextResponse.json({
      success: true,
      data: recommendation,
      message: 'Pricing recommendation generated successfully'
    });

  } catch (error) {
    console.error('Error generating pricing recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to generate pricing recommendation' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { developmentId, strategy } = body;

    if (!developmentId || !strategy) {
      return NextResponse.json(
        { error: 'Missing required fields: developmentId, strategy' },
        { status: 400 }
      );
    }

    // Update pricing strategy
    dynamicPricingEngine.updatePricingStrategy(developmentId, strategy);

    return NextResponse.json({
      success: true,
      message: 'Pricing strategy updated successfully'
    });

  } catch (error) {
    console.error('Error updating pricing strategy:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing strategy' },
      { status: 500 }
    );
  }
}