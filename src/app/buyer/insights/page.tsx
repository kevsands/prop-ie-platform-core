import React from 'react';
'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Building, MapPin, Clock, ChevronRight, Filter, Calendar, BarChart, PieChart, Download, Info } from 'lucide-react';
import { format } from 'date-fns';

interface MarketInsight {
  id: string;
  title: string;
  summary: string;
  category: 'market-trends' | 'area-analysis' | 'price-forecast' | 'investment-tips';
  publishedDate: Date;
  author: string;
  readTime: number;
  keyPoints: string[];
  charts?: {
    type: 'line' | 'bar' | 'pie';
    data: any;
  }[];
}

interface MarketStat {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export default function InsightsPage() {
  const [selectedCategorysetSelectedCategory] = useState('all');
  const [timeframesetTimeframe] = useState('3-months');
  const [selectedAreasetSelectedArea] = useState('dublin');

  // Mock market stats
  const marketStats: MarketStat[] = [
    {
      label: 'Average Property Price',
      value: '€485,000',
      change: 3.5,
      trend: 'up'
    },
    {
      label: 'Properties Listed',
      value: '2,543',
      change: -2.1,
      trend: 'down'
    },
    {
      label: 'Average Days on Market',
      value: '32',
      change: -5.0,
      trend: 'down'
    },
    {
      label: 'Price per Sq M',
      value: '€5,250',
      change: 4.2,
      trend: 'up'
    }
  ];

  // Mock insights data
  const insights: MarketInsight[] = [
    {
      id: '1',
      title: 'Dublin Property Market Q4 2023 Analysis',
      summary: 'Comprehensive analysis of Dublin\'s property market performance in the final quarter of 2023',
      category: 'market-trends',
      publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      author: 'Market Research Team',
      readTime: 8,
      keyPoints: [
        'Average prices increased by 3.5% compared to Q3',
        'First-time buyer activity up 12%',
        'New developments driving supply in key areas',
        'Interest rates stabilizing market dynamics'
      ]
    },
    {
      id: '2',
      title: 'South Dublin: Emerging Hotspots for First-Time Buyers',
      summary: 'Discover the most promising areas in South Dublin for first-time property buyers',
      category: 'area-analysis',
      publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      author: 'Sarah Kelly',
      readTime: 6,
      keyPoints: [
        'Blackrock showing strong price appreciation',
        'Dun Laoghaire offers best value for money',
        'Sandyford benefits from Luas connectivity',
        'Stillorgan emerging as family-friendly option'
      ]
    },
    {
      id: '3',
      title: '2024 Property Price Forecast: What to Expect',
      summary: 'Expert predictions for property price movements throughout 2024',
      category: 'price-forecast',
      publishedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      author: 'Economics Department',
      readTime: 10,
      keyPoints: [
        'Modest growth of 2-3% expected annually',
        'New housing supply to moderate price increases',
        'Interest rates likely to remain stable',
        'First-time buyer demand continues strong'
      ]
    },
    {
      id: '4',
      title: 'Investment Strategies for New Developments',
      summary: 'How to maximize returns when investing in new development properties',
      category: 'investment-tips',
      publishedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      author: 'Investment Advisory',
      readTime: 7,
      keyPoints: [
        'Early-bird pricing offers best value',
        'Focus on locations with infrastructure plans',
        'Consider rental yield potential',
        'Evaluate developer track record'
      ]
    }
  ];

  // Filter insights
  const filteredInsights = insights.filter(insight => {
    if (selectedCategory === 'all') return true;
    return insight.category === selectedCategory;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />\n  );
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />\n  );
      default: return <span className="h-4 w-4 inline-block bg-gray-400 rounded-full" />\n  );
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market-trends': return 'bg-blue-100 text-blue-700';
      case 'area-analysis': return 'bg-green-100 text-green-700';
      case 'price-forecast': return 'bg-purple-100 text-purple-700';
      case 'investment-tips': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market Insights</h1>
          <p className="text-gray-600 mt-1">Stay informed with the latest property market trends and analysis</p>
        </div>

        {/* Market Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Market Overview</h2>
            <div className="flex items-center gap-4">
              <select
                value={selectedArea}
                onChange={(e: any) => setSelectedArea(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="dublin">Dublin</option>
                <option value="cork">Cork</option>
                <option value="galway">Galway</option>
                <option value="limerick">Limerick</option>
              </select>
              <select
                value={timeframe}
                onChange={(e: any) => setTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="1-month">Last Month</option>
                <option value="3-months">Last 3 Months</option>
                <option value="6-months">Last 6 Months</option>
                <option value="1-year">Last Year</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {marketStats.map((statindex: any) => (
              <div key={index} className="text-center">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <div className="flex items-center justify-center gap-1">
                  {getTrendIcon(stat.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                    {stat.change> 0 ? '+' : ''}{stat.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Most Popular Areas</h3>
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <ol className="space-y-2">
              <li className="flex items-center justify-between">
                <span className="text-blue-800">1. Dublin 2</span>
                <span className="text-sm text-blue-600">+12% demand</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-blue-800">2. Blackrock</span>
                <span className="text-sm text-blue-600">+8% demand</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-blue-800">3. Sandyford</span>
                <span className="text-sm text-blue-600">+7% demand</span>
              </li>
            </ol>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-900">Best Value Areas</h3>
              <Building className="h-6 w-6 text-green-600" />
            </div>
            <ol className="space-y-2">
              <li className="flex items-center justify-between">
                <span className="text-green-800">1. Tallaght</span>
                <span className="text-sm text-green-600">€320k avg</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-green-800">2. Blanchardstown</span>
                <span className="text-sm text-green-600">€340k avg</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-green-800">3. Lucan</span>
                <span className="text-sm text-green-600">€360k avg</span>
              </li>
            </ol>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-900">Market Activity</h3>
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-purple-800">New Listings</span>
                <span className="font-semibold text-purple-900">423</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-800">Properties Sold</span>
                <span className="font-semibold text-purple-900">312</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-800">Avg. Viewing to Offer</span>
                <span className="font-semibold text-purple-900">4 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Articles */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Latest Insights</h2>
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e: any) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="market-trends">Market Trends</option>
                <option value="area-analysis">Area Analysis</option>
                <option value="price-forecast">Price Forecast</option>
                <option value="investment-tips">Investment Tips</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Download className="h-4 w-4" />
                Download Report
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredInsights.map((insight: any) => (
              <div 
                key={insight.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getCategoryColor(insight.category)}`}>
                        {insight.category.replace('-', ' ')}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{insight.summary}</p>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Key Points:</h4>
                    <ul className="space-y-1">
                      {insight.keyPoints.slice(0).map((pointindex: any) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{insight.author}</span>
                      <span>•</span>
                      <span>{format(insight.publishedDate, 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>{insight.readTime} min read</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}