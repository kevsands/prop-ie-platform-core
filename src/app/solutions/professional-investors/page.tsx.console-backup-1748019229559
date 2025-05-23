'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building, Building2, TrendingUp, Shield, Banknote, 
  Globe2, BarChart3, Users, Clock, Home, Store, 
  Hotel, Map, PieChart, TrendingDown, Heart, Truck,
  Target, Activity, Lock, Gauge, Eye, Calculator,
  ChevronRight, ArrowRight, DollarSign, LineChart,
  Trophy, Zap, ShieldCheck, Award, Sparkles, Cpu,
  CheckCircle, Hammer, FileText, Camera, AlertCircle,
  CheckCircle2, HardHat, Package, Timer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock portfolio data
const portfolioStats = {
  totalValue: 125500000,
  averageYield: 7.8,
  propertiesUnderManagement: 47,
  occupancyRate: 94.5,
  monthlyRental: 580000,
  yearOverYearGrowth: 12.3
};

// Asset classes for filtering
const assetClasses = [
  { id: 'all', name: 'All Assets', icon: <Building className="h-5 w-5" /> },
  { id: 'residential', name: 'Residential', icon: <Home className="h-5 w-5" /> },
  { id: 'commercial', name: 'Commercial', icon: <Building2 className="h-5 w-5" /> },
  { id: 'mixed-use', name: 'Mixed Use', icon: <Store className="h-5 w-5" /> },
  { id: 'industrial', name: 'Industrial', icon: <Truck className="h-5 w-5" /> },
  { id: 'hospitality', name: 'Hospitality', icon: <Hotel className="h-5 w-5" /> }
];

// Investment opportunities
const opportunities = [
  {
    id: 1,
    name: 'The Meridian Tower',
    location: 'Dublin Docklands',
    class: 'commercial',
    price: 45000000,
    yield: 6.2,
    size: '150,000 sq ft',
    risk: 'Medium',
    irr: 15.5,
    capRate: 5.8,
    status: 'Pre-Launch',
    features: ['Grade A Office', 'LEED Platinum', 'Tech-Ready'],
    projectedGrowth: 4.2
  },
  {
    id: 2,
    name: 'Phoenix Park Residences',
    location: 'Dublin 8',
    class: 'residential',
    price: 28000000,
    yield: 7.5,
    units: 120,
    risk: 'Low',
    irr: 18.2,
    capRate: 6.8,
    status: 'Funding',
    features: ['Luxury Apartments', 'Concierge Service', 'High Demand Area'],
    projectedGrowth: 5.5
  },
  {
    id: 3,
    name: 'Cork Logistics Hub',
    location: 'Cork',
    class: 'industrial',
    price: 22000000,
    yield: 8.2,
    size: '280,000 sq ft',
    risk: 'Low-Medium',
    irr: 16.8,
    capRate: 7.2,
    status: 'Active',
    features: ['Strategic Location', 'Triple Net Lease', 'Long-term Tenant'],
    projectedGrowth: 3.8
  },
  {
    id: 4,
    name: 'Galway Hotel Portfolio',
    location: 'Galway City',
    class: 'hospitality',
    price: 65000000,
    yield: 9.1,
    rooms: 450,
    risk: 'Medium-High',
    irr: 20.5,
    capRate: 8.3,
    status: 'Due Diligence',
    features: ['4-Star Hotels', 'Tourism Growth', 'Management in Place'],
    projectedGrowth: 6.2
  }
];

// Performance metrics
const metrics = [
  { label: 'Average IRR', value: '18.5%', trend: '+2.3%' },
  { label: 'Deal Volume', value: '€2.3B', trend: '+15%' },
  { label: 'Markets', value: '12', trend: '+3' },
  { label: 'Exit Success', value: '94%', trend: '+5%' }
];

// Private Placement Deals
const privatePlacements = [
  {
    id: 1,
    name: 'Sandyford Tech Campus',
    developer: 'Horizon Developments',
    location: 'Dublin 18',
    totalCost: 85000000,
    raised: 62000000,
    targetIRR: 22.5,
    timeline: '36 months',
    status: 'Construction',
    completionPercentage: 35,
    nextMilestone: 'Foundation Complete',
    milestoneDate: '2025-02-15',
    updates: [
      { date: '2025-01-10', title: 'Site Preparation Complete', type: 'milestone' },
      { date: '2024-12-15', title: 'Planning Permission Granted', type: 'regulatory' },
      { date: '2024-11-20', title: 'Ground Breaking Ceremony', type: 'event' }
    ],
    highlights: [
      '250,000 sq ft Grade A office space',
      'LEED Platinum certification',
      '85% pre-let to Fortune 500 companies',
      'Adjacent to Luas Green Line'
    ],
    risks: ['Construction delays', 'Material cost inflation', 'Interest rate sensitivity'],
    exitStrategy: 'Sale to institutional investor or REIT'
  },
  {
    id: 2,
    name: 'Cork Riverside Residences',
    developer: 'Emerald Living',
    location: 'Cork City',
    totalCost: 45000000,
    raised: 38000000,
    targetIRR: 19.8,
    timeline: '24 months',
    status: 'Pre-Construction',
    completionPercentage: 15,
    nextMilestone: 'Site Clearance',
    milestoneDate: '2025-01-25',
    updates: [
      { date: '2025-01-05', title: 'Final Design Approved', type: 'design' },
      { date: '2024-12-10', title: 'Construction Tender Awarded', type: 'contract' },
      { date: '2024-11-15', title: 'Environmental Impact Assessment Completed', type: 'regulatory' }
    ],
    highlights: [
      '180 luxury apartments',
      'Riverside views',
      '92% pre-sales achieved',
      'Sustainable design features'
    ],
    risks: ['Flood zone proximity', 'Local market saturation', 'Construction labor shortage'],
    exitStrategy: 'Individual unit sales and bulk sale to institutional investor'
  },
  {
    id: 3,
    name: 'Galway Innovation Quarter',
    developer: 'Atlantic Properties',
    location: 'Galway City',
    totalCost: 120000000,
    raised: 45000000,
    targetIRR: 25.2,
    timeline: '48 months',
    status: 'Funding',
    completionPercentage: 5,
    nextMilestone: 'Financial Close',
    milestoneDate: '2025-02-01',
    updates: [
      { date: '2025-01-08', title: 'Anchor Tenant Letter of Intent', type: 'commercial' },
      { date: '2024-12-20', title: 'Master Plan Unveiled', type: 'design' },
      { date: '2024-11-30', title: 'Site Acquisition Complete', type: 'milestone' }
    ],
    highlights: [
      '500,000 sq ft mixed-use development',
      'Innovation hub for tech companies',
      'Government-backed initiative',
      'Strategic partnership with local universities'
    ],
    risks: ['Long development timeline', 'Market cycle risk', 'Complex stakeholder management'],
    exitStrategy: 'Phased disposal over 5-7 years'
  },
  {
    id: 4,
    name: 'Ballymakenny Village Centre',
    developer: 'Village Developments Ireland',
    location: 'Drogheda, Co. Louth',
    totalCost: 42000000,
    raised: 31500000,
    targetIRR: 21.5,
    timeline: '24 months',
    status: 'Construction',
    completionPercentage: 55,
    nextMilestone: 'First Fix Complete',
    milestoneDate: '2025-03-20',
    updates: [
      { date: '2025-01-12', title: 'Anchor Tenant SuperValu Confirmed', type: 'commercial' },
      { date: '2025-01-05', title: 'Structural Frame 80% Complete', type: 'milestone' },
      { date: '2024-12-28', title: 'Retail Units 65% Pre-Let', type: 'commercial' },
      { date: '2024-12-10', title: 'Roof Installation Started', type: 'milestone' }
    ],
    highlights: [
      '75,000 sq ft retail & community hub',
      'SuperValu anchor tenant (15-year lease)',
      '300-space underground parking',
      'Community facilities & medical centre',
      'Prime location serving 40,000+ residents',
      'Adjacent to M1 motorway junction'
    ],
    risks: ['Local retail competition', 'Construction material costs', 'Seasonal trading patterns'],
    exitStrategy: 'Long-term income generation with potential REIT sale'
  }
];

// Mock real-time activity feed
const liveActivity = [
  { time: '2 min ago', action: 'New investment', amount: '€2.5M', project: 'Sandyford Tech Campus', investor: 'Institutional' },
  { time: '15 min ago', action: 'Milestone reached', project: 'Cork Riverside', milestone: 'Foundation Pour Complete' },
  { time: '1 hour ago', action: 'Document uploaded', project: 'Galway Innovation Quarter', document: 'Q4 Progress Report' },
  { time: '3 hours ago', action: 'New investment', amount: '€500K', project: 'Cork Riverside', investor: 'Private' }
];

export default function ProfessionalInvestorsPage() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [sortBy, setSortBy] = useState('yield');
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [portfolioVisible, setPortfolioVisible] = useState(false);
  const [expandedPlacement, setExpandedPlacement] = useState<number | null>(null);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  
  const filteredOpportunities = opportunities.filter(opp => 
    selectedClass === 'all' || opp.class === selectedClass
  );

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch(sortBy) {
      case 'yield': return b.yield - a.yield;
      case 'price': return a.price - b.price;
      case 'irr': return b.irr - a.irr;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-6 py-3 bg-blue-600/20 backdrop-blur-sm border border-blue-500/50 rounded-full mb-8"
            >
              <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="text-white font-medium">Ireland\'s Leading Investment Platform</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Professional Property Investment
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Access institutional-grade opportunities with advanced analytics, 
              AI-powered insights, and comprehensive portfolio management
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/register/investor"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                Start Investing
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button 
                onClick={() => setPortfolioVisible(!portfolioVisible)}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
              >
                View Demo Portfolio
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Portfolio Dashboard */}
      <AnimatePresence>
        {portfolioVisible && (
          <motion.section 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-900 text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-2xl font-bold mb-8">Live Portfolio Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-2">Total Value</div>
                  <div className="text-2xl font-bold text-green-400">
                    €{(portfolioStats.totalValue / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-2">Avg Yield</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {portfolioStats.averageYield}%
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-2">Properties</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {portfolioStats.propertiesUnderManagement}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-2">Occupancy</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {portfolioStats.occupancyRate}%
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-2">Monthly Income</div>
                  <div className="text-2xl font-bold text-green-400">
                    €{(portfolioStats.monthlyRental / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-2">YoY Growth</div>
                  <div className="text-2xl font-bold text-green-400">
                    +{portfolioStats.yearOverYearGrowth}%
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Asset Class Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {assetClasses.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedClass(asset.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedClass === asset.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {asset.icon}
                  {asset.name}
                </button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="yield">Sort by Yield</option>
              <option value="price">Sort by Price</option>
              <option value="irr">Sort by IRR</option>
            </select>
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current Investment Opportunities
            </h2>
            <p className="text-xl text-gray-600">
              Curated institutional-grade properties with verified returns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedOpportunities.map((opp) => (
              <motion.div
                key={opp.id}
                layout
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
              >
                {/* Status Badge */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{opp.status}</span>
                    <span className="text-sm">ID: #{opp.id}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{opp.name}</h3>
                      <p className="text-gray-600">{opp.location}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      opp.risk === 'Low' ? 'bg-green-100 text-green-700' :
                      opp.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      opp.risk === 'Low-Medium' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {opp.risk} Risk
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-600">Investment</div>
                      <div className="text-xl font-bold text-gray-900">
                        €{(opp.price / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Projected Yield</div>
                      <div className="text-xl font-bold text-green-600">
                        {opp.yield}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">IRR</div>
                      <div className="text-xl font-bold text-blue-600">
                        {opp.irr}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Cap Rate</div>
                      <div className="text-xl font-bold text-purple-600">
                        {opp.capRate}%
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {opp.features.map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-600">5-Year Growth Projection</div>
                        <div className="text-lg font-bold text-gray-900">+{opp.projectedGrowth}% p.a.</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Size/Units</div>
                        <div className="text-lg font-bold text-gray-900">{opp.size || `${opp.units} units` || `${opp.rooms} rooms`}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowDetails(showDetails === opp.id ? null : opp.id)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {showDetails === opp.id ? 'Hide' : 'View'} Detailed Analysis
                      <ChevronRight className={`h-5 w-5 transition-transform ${showDetails === opp.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <AnimatePresence>
                  {showDetails === opp.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-gray-50 border-t">
                        <h4 className="font-bold text-lg mb-4">Detailed Analysis</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">10-Year NPV</div>
                            <div className="text-lg font-bold">€{(opp.price * 1.5 / 1000000).toFixed(1)}M</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Break-even Period</div>
                            <div className="text-lg font-bold">{(100 / opp.yield).toFixed(1)} years</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Debt Service Coverage</div>
                            <div className="text-lg font-bold">1.{Math.floor(opp.yield * 10)}x</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Exit Strategy</div>
                            <div className="text-lg font-bold">Year 5-7</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex gap-3">
                          <Link
                            href={`/investment/${opp.id}/full-analysis`}
                            className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-center font-medium hover:bg-gray-50"
                          >
                            Full Report
                          </Link>
                          <Link
                            href={`/investment/${opp.id}/book-viewing`}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700"
                          >
                            Schedule Call
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Irish Property Liquidity Pools Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-full mb-6">
              <Zap className="h-5 w-5 mr-2" />
              <span className="font-bold">NEW: Irish Property Liquidity Pools</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Revolutionary Development Finance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Access crypto-style liquidity pools for Irish property development with full CBI compliance, 
              dynamic returns up to 12.7% p.a., and milestone-based fund releases
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200">
                <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Dynamic Returns</h3>
                <p className="text-gray-600">Early investors earn bonus returns + liquidity incentives</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
                <ShieldCheck className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">CBI Regulated</h3>
                <p className="text-gray-600">Full compliance with Central Bank of Ireland requirements</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
                <Timer className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Milestone Releases</h3>
                <p className="text-gray-600">Funds released based on verified construction progress</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/invest/liquidity-pools"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Explore Liquidity Pools
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/learn/liquidity-pools"
                className="px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-all"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
          
          {/* Live Pool Stats */}
          <div className="mt-12 bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Activity className="h-6 w-6 text-emerald-400" />
              Live Pool Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-emerald-400 text-sm uppercase tracking-wide mb-1">Active Pools</div>
                <div className="text-3xl font-bold">12</div>
              </div>
              <div>
                <div className="text-emerald-400 text-sm uppercase tracking-wide mb-1">Total Liquidity</div>
                <div className="text-3xl font-bold">€45.7M</div>
              </div>
              <div>
                <div className="text-emerald-400 text-sm uppercase tracking-wide mb-1">Avg Returns</div>
                <div className="text-3xl font-bold">9.8%</div>
              </div>
              <div>
                <div className="text-emerald-400 text-sm uppercase tracking-wide mb-1">Investors</div>
                <div className="text-3xl font-bold">3,247</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Placement Deals */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-purple-600/20 backdrop-blur-sm border border-purple-500/50 rounded-full mb-6">
              <Hammer className="h-5 w-5 mr-2 text-purple-400" />
              <span className="text-purple-900 font-medium">Private Placement Opportunities</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fund Premier Development Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exclusive access to pre-construction funding opportunities with real-time project tracking and milestone updates
            </p>
            
            <button
              onClick={() => setShowActivityFeed(!showActivityFeed)}
              className="mt-6 px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              {showActivityFeed ? 'Hide' : 'Show'} Live Activity Feed
            </button>
          </div>

          {/* Live Activity Feed */}
          <AnimatePresence>
            {showActivityFeed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-12 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-gray-900 to-purple-900 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Live Investment Activity
                  </h3>
                  <div className="space-y-3">
                    {liveActivity.map((activity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${activity.action === 'New investment' ? 'bg-green-400' : 'bg-blue-400'} animate-pulse`} />
                          <div className="text-white">
                            <span className="font-medium">{activity.action}</span>
                            {activity.amount && <span className="text-green-400 ml-2">{activity.amount}</span>}
                            <span className="text-gray-300 text-sm ml-2">• {activity.project}</span>
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Private Placement Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {privatePlacements.map((placement) => {
              const fundingPercentage = (placement.raised / placement.totalCost) * 100;
              const remainingAmount = placement.totalCost - placement.raised;
              const daysToMilestone = Math.ceil((new Date(placement.milestoneDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <motion.div
                  key={placement.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{placement.name}</h3>
                        <p className="text-purple-100">{placement.location} • {placement.developer}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur`}>
                        {placement.status}
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-600">Total Project Cost</div>
                        <div className="text-xl font-bold text-gray-900">
                          €{(placement.totalCost / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Target IRR</div>
                        <div className="text-xl font-bold text-purple-600">
                          {placement.targetIRR}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Timeline</div>
                        <div className="text-xl font-bold text-gray-900">
                          {placement.timeline}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Remaining to Fund</div>
                        <div className="text-xl font-bold text-blue-600">
                          €{(remainingAmount / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Funding Progress</span>
                        <span className="text-sm font-medium">{fundingPercentage.toFixed(0)}% Funded</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${fundingPercentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Construction Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Construction Progress</span>
                        <span className="text-sm font-medium">{placement.completionPercentage}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${placement.completionPercentage}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Next Milestone */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="h-6 w-6 text-purple-600" />
                          <div>
                            <div className="font-medium text-gray-900">Next Milestone</div>
                            <div className="text-sm text-gray-600">{placement.nextMilestone}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{daysToMilestone} days</div>
                          <div className="text-sm text-gray-600">
                            {new Date(placement.milestoneDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Key Investment Highlights</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {placement.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setExpandedPlacement(expandedPlacement === placement.id ? null : placement.id)}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                      >
                        {expandedPlacement === placement.id ? 'Hide Details' : 'View Full Details'}
                      </button>
                      <Link
                        href={`/invest/private-placement/${placement.id}`}
                        className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all text-center"
                      >
                        Invest Now
                      </Link>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedPlacement === placement.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 bg-gray-50 border-t">
                          {/* Recent Updates */}
                          <div className="mb-6">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <Activity className="h-5 w-5 text-blue-600" />
                              Recent Updates
                            </h4>
                            <div className="space-y-3">
                              {placement.updates.map((update, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    update.type === 'milestone' ? 'bg-green-100' :
                                    update.type === 'regulatory' ? 'bg-blue-100' :
                                    update.type === 'design' ? 'bg-purple-100' :
                                    update.type === 'contract' ? 'bg-orange-100' :
                                    'bg-gray-100'
                                  }`}>
                                    {update.type === 'milestone' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                                     update.type === 'regulatory' ? <FileText className="h-4 w-4 text-blue-600" /> :
                                     update.type === 'design' ? <Package className="h-4 w-4 text-purple-600" /> :
                                     update.type === 'contract' ? <FileText className="h-4 w-4 text-orange-600" /> :
                                     <Activity className="h-4 w-4 text-gray-600" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{update.title}</div>
                                    <div className="text-sm text-gray-600">{new Date(update.date).toLocaleDateString()}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Risk Analysis */}
                          <div className="mb-6">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-orange-600" />
                              Risk Factors
                            </h4>
                            <div className="space-y-2">
                              {placement.risks.map((risk, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className="h-2 w-2 bg-orange-400 rounded-full" />
                                  <span className="text-sm text-gray-700">{risk}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Exit Strategy */}
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-bold text-gray-900 mb-2">Exit Strategy</h4>
                            <p className="text-gray-700">{placement.exitStrategy}</p>
                          </div>

                          {/* View Documents */}
                          <div className="mt-6 flex gap-3">
                            <Link
                              href={`/documents/placement/${placement.id}/prospectus`}
                              className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-center font-medium hover:bg-gray-50"
                            >
                              View Prospectus
                            </Link>
                            <Link
                              href={`/documents/placement/${placement.id}/timeline`}
                              className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-center font-medium hover:bg-gray-50"
                            >
                              View Timeline
                            </Link>
                            <Link
                              href={`/documents/placement/${placement.id}/photos`}
                              className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-center font-medium hover:bg-gray-50"
                            >
                              <Camera className="h-4 w-4 inline mr-1" />
                              Site Photos
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* CTA for Private Placements */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Access to private placement opportunities requires verified professional investor status
            </p>
            <Link
              href="/register/investor?type=professional"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Apply for Professional Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional-Grade Tools
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your property portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: 'Portfolio Analytics',
                description: 'Real-time performance tracking with AI-powered insights',
                features: ['Risk Assessment', 'Yield Optimization', 'Market Comparison']
              },
              {
                icon: <Globe2 className="h-8 w-8" />,
                title: 'Global Deal Flow',
                description: 'Access to exclusive off-market opportunities worldwide',
                features: ['Pre-market Access', 'Co-investment Options', 'Syndication Tools']
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Risk Management',
                description: 'Advanced risk modeling and mitigation strategies',
                features: ['Stress Testing', 'Hedging Strategies', 'Insurance Options']
              },
              {
                icon: <Banknote className="h-8 w-8" />,
                title: 'Financial Structuring',
                description: 'Optimize capital structure for maximum returns',
                features: ['Tax Optimization', 'Leverage Analysis', 'Exit Planning']
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: 'Transaction Speed',
                description: 'Complete deals 70% faster with digital processes',
                features: ['Digital Due Diligence', 'E-signatures', 'Instant Funding']
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Expert Advisory',
                description: 'Access to top-tier property investment advisors',
                features: ['Market Analysis', 'Legal Support', 'Tax Advisory']
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Track Record of Excellence
              </h2>
              <p className="text-xl text-blue-100">
                Consistent outperformance across all market cycles
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{metric.value}</div>
                  <div className="text-blue-200 mb-1">{metric.label}</div>
                  <div className="text-green-400 text-sm">{metric.trend}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/case-studies"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-900 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                View Case Studies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Elevate Your Portfolio?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join Ireland\'s most sophisticated property investment platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register/investor"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact/investor-relations"
              className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium text-lg"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}