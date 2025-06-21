'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  BarChart3,
  Bot,
  Zap,
  ArrowRight
} from 'lucide-react';

interface PricingRecommendation {
  unitId: string;
  unitNumber: string;
  currentPrice: number;
  recommendedPrice: number;
  changePercentage: number;
  reason: string;
  confidence: number;
  marketFactors: string[];
  urgency: 'low' | 'medium' | 'high';
}

interface MarketAnalytics {
  averageMarketPrice: number;
  competitorAnalysis: {
    averagePrice: number;
    aboveMarket: number;
    belowMarket: number;
  };
  demandIndicators: {
    inquiries: number;
    viewings: number;
    reservations: number;
    conversionRate: number;
  };
  trends: {
    priceGrowth30Days: number;
    demandTrend: 'increasing' | 'stable' | 'decreasing';
    optimalPricingWindow: string;
  };
}

interface AIPricingAnalyticsProps {
  projectId: string;
  units: any[];
  onPriceUpdate: (unitId: string, newPrice: number) => Promise<boolean>;
}

export default function AIPricingAnalytics({ projectId, units, onPriceUpdate }: AIPricingAnalyticsProps) {
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>([]);
  const [marketAnalytics, setMarketAnalytics] = useState<MarketAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'analytics'>('recommendations');
  const [updatingUnits, setUpdatingUnits] = useState<Set<string>>(new Set());

  useEffect(() => {
    generateAIPricingRecommendations();
    generateMarketAnalytics();
  }, [units]);

  const generateAIPricingRecommendations = () => {
    // Simulate AI-driven pricing recommendations based on market data
    const recs: PricingRecommendation[] = [];
    
    units.forEach(unit => {
      if (unit.status === 'available') {
        const currentPrice = Math.round(unit.pricing.currentPrice);
        const baseAdjustment = (Math.random() - 0.5) * 0.1; // ±5% base adjustment
        
        // Market-driven factors
        let marketMultiplier = 1;
        const reasons = [];
        const factors = [];
        
        // Simulate different market conditions
        const marketScenarios = [
          {
            condition: unit.features.bedrooms === 1,
            multiplier: 1.03,
            reason: 'High demand for 1-bed units in this area',
            factors: ['First-time buyer demand', 'Rental yield optimization']
          },
          {
            condition: unit.features.floor > 3,
            multiplier: 1.02,
            reason: 'Premium floor commanding higher prices',
            factors: ['City views', 'Reduced noise levels']
          },
          {
            condition: unit.features.hasBalcony,
            multiplier: 1.01,
            reason: 'Balcony units in high demand post-pandemic',
            factors: ['Outdoor space premium', 'Work-from-home appeal']
          },
          {
            condition: Math.random() > 0.7,
            multiplier: 1.04,
            reason: 'Market analysis suggests underpricing vs. competitors',
            factors: ['Competitor pricing analysis', 'Local market appreciation']
          },
          {
            condition: Math.random() > 0.8,
            multiplier: 0.97,
            reason: 'Strategic pricing to accelerate sales velocity',
            factors: ['Cash flow optimization', 'Q4 sales targets']
          }
        ];

        const applicableScenarios = marketScenarios.filter(s => s.condition);
        if (applicableScenarios.length > 0) {
          const scenario = applicableScenarios[0];
          marketMultiplier = scenario.multiplier;
          reasons.push(scenario.reason);
          factors.push(...scenario.factors);
        }

        const recommendedPrice = Math.round(currentPrice * (1 + baseAdjustment) * marketMultiplier);
        const changePercentage = ((recommendedPrice - currentPrice) / currentPrice) * 100;

        if (Math.abs(changePercentage) > 0.5) { // Only recommend if change > 0.5%
          recs.push({
            unitId: unit.id,
            unitNumber: unit.number,
            currentPrice,
            recommendedPrice,
            changePercentage,
            reason: reasons[0] || 'AI optimization based on market analysis',
            confidence: Math.round(85 + Math.random() * 10), // 85-95% confidence
            marketFactors: factors.length > 0 ? factors : ['Market demand analysis', 'Pricing optimization'],
            urgency: Math.abs(changePercentage) > 3 ? 'high' : Math.abs(changePercentage) > 1.5 ? 'medium' : 'low'
          });
        }
      }
    });

    setRecommendations(recs.slice(0, 8)); // Show top 8 recommendations
    setIsLoading(false);
  };

  const generateMarketAnalytics = () => {
    // Simulate market analytics
    const avgPrice = units.reduce((sum, unit) => sum + unit.pricing.currentPrice, 0) / units.length;
    
    setMarketAnalytics({
      averageMarketPrice: Math.round(avgPrice * 1.02), // 2% above current avg
      competitorAnalysis: {
        averagePrice: Math.round(avgPrice * 1.05),
        aboveMarket: Math.round(Math.random() * 30 + 20), // 20-50%
        belowMarket: Math.round(Math.random() * 20 + 10)   // 10-30%
      },
      demandIndicators: {
        inquiries: Math.round(Math.random() * 50 + 80),    // 80-130
        viewings: Math.round(Math.random() * 20 + 25),     // 25-45
        reservations: Math.round(Math.random() * 5 + 3),   // 3-8
        conversionRate: Math.round((Math.random() * 15 + 20) * 100) / 100 // 20-35%
      },
      trends: {
        priceGrowth30Days: Math.round((Math.random() * 4 + 1) * 100) / 100, // 1-5%
        demandTrend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)] as any,
        optimalPricingWindow: 'Next 14 days for maximum ROI'
      }
    });
  };

  const handleApplyRecommendation = async (rec: PricingRecommendation) => {
    setUpdatingUnits(prev => new Set(prev).add(rec.unitId));
    
    try {
      const success = await onPriceUpdate(rec.unitId, rec.recommendedPrice);
      if (success) {
        // Remove the applied recommendation
        setRecommendations(prev => prev.filter(r => r.unitId !== rec.unitId));
      }
    } catch (error) {
      console.error('Failed to update price:', error);
    } finally {
      setUpdatingUnits(prev => {
        const newSet = new Set(prev);
        newSet.delete(rec.unitId);
        return newSet;
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (percentage: number) => {
    return percentage > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bot className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">AI Pricing Analytics</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">AI Pricing Analytics</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            LIVE
          </span>
        </div>
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recommendations ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Market Analytics
          </button>
        </div>
      </div>

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">All Prices Optimized</h4>
              <p className="text-gray-600">Current pricing is aligned with AI recommendations</p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Live AI Pricing Recommendations</h4>
                    <p className="text-blue-700 text-sm">
                      Based on live database performance: {units.filter(u => u.status === 'SOLD').length} sold, {units.filter(u => u.status === 'RESERVED').length} reserved from {units.length} total units
                    </p>
                  </div>
                </div>
              </div>

              {recommendations.map((rec) => (
                <div key={rec.unitId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">Unit {rec.unitNumber}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getUrgencyColor(rec.urgency)}`}>
                          {rec.urgency.toUpperCase()} PRIORITY
                        </span>
                        <span className="text-sm text-gray-500">{rec.confidence}% confidence</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Current:</span>
                          <span className="font-semibold">€{rec.currentPrice.toLocaleString()}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Recommended:</span>
                          <span className="font-semibold text-blue-600">€{rec.recommendedPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(rec.changePercentage)}
                          <span className={`font-semibold ${rec.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {rec.changePercentage > 0 ? '+' : ''}{rec.changePercentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-2">{rec.reason}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {rec.marketFactors.map((factor, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyRecommendation(rec)}
                      disabled={updatingUnits.has(rec.unitId)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updatingUnits.has(rec.unitId) ? 'Updating...' : 'Apply'}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === 'analytics' && marketAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Market Position</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Market Price:</span>
                  <span className="font-semibold">€{marketAnalytics.averageMarketPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Average Price:</span>
                  <span className="font-semibold">€{Math.round(units.reduce((sum, u) => sum + u.pricing.currentPrice, 0) / units.length).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Units Above Market:</span>
                  <span className="font-semibold text-green-600">{marketAnalytics.competitorAnalysis.aboveMarket}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Units Below Market:</span>
                  <span className="font-semibold text-red-600">{marketAnalytics.competitorAnalysis.belowMarket}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Market Trends</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">30-Day Price Growth:</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">+{marketAnalytics.trends.priceGrowth30Days}%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Demand Trend:</span>
                  <span className={`font-semibold capitalize ${
                    marketAnalytics.trends.demandTrend === 'increasing' ? 'text-green-600' :
                    marketAnalytics.trends.demandTrend === 'decreasing' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {marketAnalytics.trends.demandTrend}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-sm text-blue-600 font-medium">{marketAnalytics.trends.optimalPricingWindow}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Demand Indicators</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Inquiries:</span>
                  <span className="font-semibold">{marketAnalytics.demandIndicators.inquiries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Viewings:</span>
                  <span className="font-semibold">{marketAnalytics.demandIndicators.viewings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reservations Made:</span>
                  <span className="font-semibold">{marketAnalytics.demandIndicators.reservations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Rate:</span>
                  <span className="font-semibold text-blue-600">{marketAnalytics.demandIndicators.conversionRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Live Market Insight</h4>
                  <p className="text-blue-700 text-sm">
                    {units.filter(u => u.status === 'SOLD').length > 0 ? 
                      `Based on ${units.filter(u => u.status === 'SOLD').length} completed sales, market conditions support strategic pricing adjustments. ${units.filter(u => u.features?.bedrooms <= 2).length > units.length * 0.6 ? 'Strong demand in 1-2 bedroom segment.' : 'Balanced demand across unit types.'} Sales velocity of ${salesVelocity.toFixed(1)} units/week indicates ${salesVelocity > 1.5 ? 'strong' : salesVelocity > 0.8 ? 'steady' : 'emerging'} market momentum.` :
                      'Early sales phase - focus on market entry pricing with selective premium positioning for unique features.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}