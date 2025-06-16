'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { FeatherIcon } from '../ui/feather-icon';

// Use the existing context from InvestorModeContext.tsx
import { useInvestorMode } from './InvestorModeContext';

// Keep your existing context and provider code

// Add new interfaces for portfolio management
interface Property {
  id: string;
  name: string;
  address: string;
  type: 'Residential' | 'Commercial' | 'Mixed-Use';
  status: 'Owned' | 'For Sale' | 'Under Offer';
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  mortgage?: {
    lender: string;
    amount: number;
    interestRate: number;
    term: number;
    monthlyPayment: number;
    remainingBalance: number;
  };
  rental?: {
    isRented: boolean;
    monthlyRent: number;
    leaseStartDate?: string;
    leaseEndDate?: string;
    tenantName?: string;
    tenantContact?: string;
  };
  expenses: {
    propertyTax: number;
    insurance: number;
    maintenance: number;
    managementFees: number;
    utilities: number;
    other: number;
  };
  documents: Array<{
    name: string;
    type: string;
    uploadDate: string;
    url: string;
  }>
  );
}

interface Portfolio {
  id: string;
  name: string;
  description: string;
  properties: string[]; // Array of property IDs
  totalValue: number;
  totalEquity: number;
  annualCashFlow: number;
  roi: number;
}

// New component for investor dashboard
export const InvestorDashboard: React.FC<Record<string, never>> = () => {
  const { investorMode } = useInvestorMode();
  const [activeTabsetActiveTab] = useState<string>('portfolio');
  const [isSubscribedsetIsSubscribed] = useState<boolean>(false);

  // Mock portfolios and properties
  const [portfoliossetPortfolios] = useState<Portfolio[]>([
    {
      id: 'p1',
      name: 'Dublin Properties',
      description: 'My investment properties in Dublin',
      properties: ['prop1', 'prop2'],
      totalValue: 1250000,
      totalEquity: 450000,
      annualCashFlow: 32000,
      roi: 7.1
    },
    {
      id: 'p2',
      name: 'Rental Portfolio',
      description: 'Long-term rental investments',
      properties: ['prop3'],
      totalValue: 580000,
      totalEquity: 180000,
      annualCashFlow: 18000,
      roi: 10.0
    }
  ]);

  const [propertiessetProperties] = useState<Property[]>([
    {
      id: 'prop1',
      name: 'Riverside Apartment',
      address: '42 Liffey View, Dublin 2',
      type: 'Residential',
      status: 'Owned',
      purchaseDate: '2020-05-15',
      purchasePrice: 420000,
      currentValue: 490000,
      mortgage: {
        lender: 'Bank of Ireland',
        amount: 336000,
        interestRate: 3.2,
        term: 30,
        monthlyPayment: 1450,
        remainingBalance: 318000
      },
      rental: {
        isRented: true,
        monthlyRent: 2300,
        leaseStartDate: '2023-06-01',
        leaseEndDate: '2024-06-01',
        tenantName: 'John Smith',
        tenantContact: 'johnsmith@email.com'
      },
      expenses: {
        propertyTax: 900,
        insurance: 750,
        maintenance: 2100,
        managementFees: 2760,
        utilities: 0,
        other: 500
      },
      documents: [
        {
          name: 'Purchase Deed',
          type: 'pdf',
          uploadDate: '2020-05-15',
          url: '/documents/deed-prop1.pdf'
        },
        {
          name: 'Insurance Policy',
          type: 'pdf',
          uploadDate: '2024-01-10',
          url: '/documents/insurance-prop1.pdf'
        }
      ]
    },
    // Add more properties...
  ]);

  if (!investorMode) {
    return null;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Subscription Banner (if not subscribed) */}
      {!isSubscribed && (
        <div className="bg-gradient-to-r from-[#2B5273] to-[#1E3142] text-white p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <FeatherIcon name="Award" size={24} className="mr-3 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg">Upgrade to Investor Pro</h3>
                <p className="text-white/80 text-sm mt-1">
                  Get full access to portfolio management, AI insights, and premium market data.
                </p>
              </div>
            </div>
            <button className="bg-white text-[#2B5273] px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'portfolio'
                ? 'border-[#2B5273] text-[#2B5273]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <FeatherIcon name="Grid" size={16} className="mr-2" />
              Portfolio Overview
            </div>
          </button>

          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'properties'
                ? 'border-[#2B5273] text-[#2B5273]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <FeatherIcon name="Home" size={16} className="mr-2" />
              My Properties
            </div>
          </button>

          <button
            onClick={() => setActiveTab('finances')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'finances'
                ? 'border-[#2B5273] text-[#2B5273]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <FeatherIcon name="DollarSign" size={16} className="mr-2" />
              Financial Analysis
            </div>
          </button>

          <button
            onClick={() => setActiveTab('tenants')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'tenants'
                ? 'border-[#2B5273] text-[#2B5273]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <FeatherIcon name="Users" size={16} className="mr-2" />
              Lease Management
            </div>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'insights'
                ? 'border-[#2B5273] text-[#2B5273]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <FeatherIcon name="TrendingUp" size={16} className="mr-2" />
              AI Insights
            </div>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-[#2B5273] text-[#2B5273]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <FeatherIcon name="FileText" size={16} className="mr-2" />
              Documents
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Portfolio Overview Tab */}
        {activeTab === 'portfolio' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Portfolio Overview</h2>
              <button className="flex items-center text-sm bg-[#2B5273] text-white px-3 py-2 rounded-md hover:bg-[#1E3142] transition-colors">
                <FeatherIcon name="PlusCircle" size={16} className="mr-2" />
                Add Portfolio
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Total Property Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(1830000)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FeatherIcon name="TrendingUp" size={12} className="mr-1" /> 
                  Up 8.3% from last year
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Total Equity</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(630000)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FeatherIcon name="TrendingUp" size={12} className="mr-1" /> 
                  Up 12.5% from last year
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Annual Cash Flow</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(50000)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FeatherIcon name="TrendingUp" size={12} className="mr-1" /> 
                  Up 5.2% from last year
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Average ROI</p>
                <p className="text-2xl font-bold text-gray-900">7.9%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FeatherIcon name="TrendingUp" size={12} className="mr-1" /> 
                  Up 0.8% from last year
                </p>
              </div>
            </div>

            {/* Portfolios List */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Portfolios</h3>
              <div className="space-y-4">
                {portfolios.map(portfolio => (
                  <div key={portfolio.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="font-medium text-[#2B5273]">{portfolio.name}</h4>
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700">
                          <FeatherIcon name="Edit" size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-red-500">
                          <FeatherIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3">{portfolio.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Properties</p>
                          <p className="font-medium">{portfolio.properties.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Value</p>
                          <p className="font-medium">{formatCurrency(portfolio.totalValue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Annual Cash Flow</p>
                          <p className="font-medium">{formatCurrency(portfolio.annualCashFlow)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ROI</p>
                          <p className="font-medium">{portfolio.roi.toFixed(1)}%</p>
                        </div>
                      </div>
                      <button className="text-sm text-[#2B5273] hover:underline">
                        View Portfolio Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Investment Recommendations */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <FeatherIcon name="TrendingUp" size={20} className="text-[#2B5273] mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">AI Investment Recommendations</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start p-3 bg-blue-50 rounded-md border border-blue-200">
                  <FeatherIcon name="Info" size={20} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Portfolio Diversification Opportunity</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Your portfolio is heavily concentrated in Dublin 2. Consider expanding to emerging areas like Drogheda which has shown 9% annual appreciation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-green-50 rounded-md border border-green-200">
                  <FeatherIcon name="TrendingUp" size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Rental Optimization</p>
                    <p className="text-sm text-green-600 mt-1">
                      Market analysis suggests you could increase rent on your Riverside Apartment by €200/month while remaining competitive in the area.
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-amber-50 rounded-md border border-amber-200">
                  <FeatherIcon name="AlertCircle" size={20} className="text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Refinancing Opportunity</p>
                    <p className="text-sm text-amber-600 mt-1">
                      Current rates are 0.8% lower than your Riverside Apartment mortgage. Refinancing could save approximately €200/month.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Properties</h2>
              <button className="flex items-center text-sm bg-[#2B5273] text-white px-3 py-2 rounded-md hover:bg-[#1E3142] transition-colors">
                <FeatherIcon name="PlusCircle" size={16} className="mr-2" />
                Add Property
              </button>
            </div>

            <div className="space-y-6">
              {properties.map(property => (
                <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-gray-100 p-4 flex items-center justify-center">
                      {/* Placeholder for property image */}
                      <div className="h-48 w-full bg-gray-200 rounded flex items-center justify-center">
                        <FeatherIcon name="Home" size={48} className="text-gray-400" />
                      </div>
                    </div>

                    <div className="md:w-2/3 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-[#2B5273]">{property.name}</h3>
                          <p className="text-gray-600 text-sm">{property.address}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <FeatherIcon name="Edit" size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-red-500">
                            <FeatherIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Purchase Price</p>
                          <p className="font-medium">{formatCurrency(property.purchasePrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Current Value</p>
                          <p className="font-medium">{formatCurrency(property.currentValue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Appreciation</p>
                          <p className="font-medium text-green-600">
                            {(((property.currentValue - property.purchasePrice) / property.purchasePrice) * 100).toFixed(1)}%
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Monthly Rental Income</p>
                          <p className="font-medium">
                            {property.rental?.isRented ? formatCurrency(property.rental.monthlyRent) : 'Not rented'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Monthly Expenses</p>
                          <p className="font-medium">
                            {formatCurrency(
                              (property.expenses.propertyTax + 
                               property.expenses.insurance + 
                               property.expenses.maintenance + 
                               property.expenses.managementFees + 
                               property.expenses.utilities + 
                               property.expenses.other) / 12 +
                              (property.mortgage?.monthlyPayment || 0)
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Net Cash Flow</p>
                          <p className="font-medium">
                            {formatCurrency(
                              (property.rental?.monthlyRent || 0) - 
                              ((property.expenses.propertyTax + 
                                property.expenses.insurance + 
                                property.expenses.maintenance + 
                                property.expenses.managementFees + 
                                property.expenses.utilities + 
                                property.expenses.other) / 12 +
                               (property.mortgage?.monthlyPayment || 0))
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {property.type}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.status === 'Owned' 
                            ? 'bg-green-100 text-green-800' 
                            : property.status === 'For Sale'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {property.status}
                        </span>
                        {property.rental?.isRented && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Rented
                          </span>
                        )}
                      </div>

                      <div className="mt-4">
                        <button className="text-sm text-[#2B5273] hover:underline">
                          View Property Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'insights' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">AI-Powered Insights</h2>
              <span className="bg-[#2B5273] text-white text-xs px-2 py-1 rounded">Premium Feature</span>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#2B5273] to-[#1E3142] px-4 py-3">
                  <h3 className="text-white font-medium">Value Enhancement Opportunities</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="bg-white shadow-sm border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-[#2B5273]">Energy Efficiency Grants</h4>
                        <span className="text-green-600 text-sm font-medium">+€35,000 potential value</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Your Riverside Apartment qualifies for SEAI energy efficiency grants that could increase property value and reduce energy costs.
                      </p>
                      <div className="flex space-x-4">
                        <div className="text-xs text-gray-500">
                          <span className="block font-medium">Estimated cost:</span>
                          <span>€15,000</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="block font-medium">ROI:</span>
                          <span>233%</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="block font-medium">Grant available:</span>
                          <span>Up to €25,000</span>
                        </div>
                      </div>
                      <button className="mt-3 text-sm bg-[#2B5273] text-white px-3 py-1 rounded hover:bg-[#1E3142] transition-colors">
                        View Details
                      </button>
                    </div>

                    <div className="bg-white shadow-sm border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-[#2B5273]">Kitchen Renovation</h4>
                        <span className="text-green-600 text-sm font-medium">+€25,000 potential value</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Modern kitchen renovations in your area deliver an average 180% return on investment, and could increase rental income by €150/month.
                      </p>
                      <div className="flex space-x-4">
                        <div className="text-xs text-gray-500">
                          <span className="block font-medium">Estimated cost:</span>
                          <span>€12,000 - €18,000</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="block font-medium">ROI:</span>
                          <span>170-180%</span>
                        </div>
                      </div>
                      <button className="mt-3 text-sm bg-[#2B5273] text-white px-3 py-1 rounded hover:bg-[#1E3142] transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#2B5273] to-[#1E3142] px-4 py-3">
                  <h3 className="text-white font-medium">Dynamic Rental Pricing</h3>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Our AI model analyzes market trends, seasonal demand, and local economic factors to recommend optimal rental pricing.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white shadow-sm border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-[#2B5273]">Riverside Apartment</h4>
                        <div className="flex items-center text-green-600 text-sm font-medium">
                          <FiTrendingUp size={16} className="mr-1" />
                          <span>Underpriced by €200</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Current Rent</p>
                          <p className="font-medium">€2,300/month</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Suggested Rent</p>
                          <p className="font-medium text-green-600">€2,500/month</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Market Range</p>
                          <p className="font-medium">€2,400 - €2,600</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        Based on 12 comparable properties in Dublin 2 rented in the last 30 days
                      </p>
                      <button className="text-sm bg-[#2B5273] text-white px-3 py-1 rounded hover:bg-[#1E3142] transition-colors">
                        View Analysis
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#2B5273] to-[#1E3142] px-4 py-3">
                  <h3 className="text-white font-medium">Market Opportunity Alerts</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="bg-white shadow-sm border rounded-md p-4">
                      <div className="flex items-start">
                        <FiTrendingUp size={16} className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-[#2B5273] mb-1">Emerging Area: Drogheda</h4>
                          <p className="text-sm text-gray-600">
                            Properties in Drogheda show 9.2% annual appreciation, outperforming Dublin by 2.3%. New transport links and technology investments are driving growth.
                          </p>
                          <div className="mt-2 flex space-x-4">
                            <div className="text-xs text-gray-500">
                              <span className="block font-medium">Price trend:</span>
                              <span className="text-green-600">+9.2% year-over-year</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="block font-medium">Rental yield:</span>
                              <span>5.8% (Dublin avg: 4.2%)</span>
                            </div>
                          </div>
                          <button className="mt-3 text-sm text-[#2B5273] hover:underline">
                            View Drogheda Properties
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lease Management Tab */}
        {activeTab === 'tenants' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Lease Management</h2>
              <span className="bg-[#2B5273] text-white text-xs px-2 py-1 rounded">Premium Feature</span>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium text-[#2B5273]">Active Leases</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lease Period</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Riverside Apartment</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Smith</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jun 1, 2023 - Jun 1, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€2,300/month</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-[#2B5273] hover:text-[#1E3142] mr-3">View</button>
                          <button className="text-[#2B5273] hover:text-[#1E3142]">Renew</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium text-[#2B5273]">Lease Expiry Calendar</h3>
                </div>

                <div className="p-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
                    <FeatherIcon name="Calendar" size={16} className="text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">Upcoming Lease Expiry</p>
                      <p className="text-sm text-amber-700 mt-1">
                        The lease for <strong>Riverside Apartment</strong> with tenant John Smith expires in <strong>35 days</strong>. Consider sending a renewal offer.
                      </p>
                      <div className="mt-3">
                        <button className="mr-3 text-sm bg-[#2B5273] text-white px-3 py-1 rounded hover:bg-[#1E3142] transition-colors">
                          Send Renewal Offer
                        </button>
                        <button className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50 transition-colors">
                          View Lease Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium text-[#2B5273]">Tenant Screening Tools</h3>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Our AI-powered tenant screening tools help you find reliable tenants while complying with fair housing laws.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-md p-4 text-center">
                      <FeatherIcon name="FileText" size={32} className="text-[#2B5273] mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Background Checks</h4>
                      <p className="text-xs text-gray-500">
                        Comprehensive background checks including credit, criminal, and eviction history.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4 text-center">
                      <FeatherIcon name="CheckCircle" size={32} className="text-[#2B5273] mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Income Verification</h4>
                      <p className="text-xs text-gray-500">
                        Secure and compliant income and employment verification process.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4 text-center">
                      <FeatherIcon name="Users" size={32} className="text-[#2B5273] mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">Rental History</h4>
                      <p className="text-xs text-gray-500">
                        Verify past rental experiences and landlord references automatically.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <button className="text-sm bg-[#2B5273] text-white px-4 py-2 rounded hover:bg-[#1E3142] transition-colors">
                      Start Tenant Screening
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};