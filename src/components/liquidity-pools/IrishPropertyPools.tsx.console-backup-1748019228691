'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Shield, AlertCircle, Building, Clock, 
  Euro, Users, Award, FileText, CheckCircle2, 
  Lock, BarChart3, Info, Calculator, BanknoteIcon,
  Timer, Target, Zap, ShieldCheck, BookOpen,
  Activity, ArrowRight, TrendingDown, Percent
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const activePools = [
  {
    id: 'pool-001',
    projectName: 'Sandyford Business Quarter',
    developer: 'Horizon Developments Ltd',
    location: 'Dublin 18',
    poolSize: 15000000,
    currentLiquidity: 8750000,
    baseYield: 7.5,
    currentBonus: 2.5, // Early investor bonus
    liquidityBonus: 0.75,
    minimumInvestment: {
      retail: 1000,
      professional: 10000,
      institutional: 100000
    },
    timeline: {
      fundingDeadline: '2025-03-01',
      constructionStart: '2025-04-01',
      expectedCompletion: '2027-03-31'
    },
    risk: 'Medium',
    collateralValue: 22500000,
    ltv: 66.7,
    status: 'ACTIVE',
    investorCount: 127,
    documentsAvailable: [
      'Investment Memorandum',
      'Planning Permission',
      'Environmental Impact Assessment',
      'Financial Projections',
      'Legal Opinion'
    ],
    milestones: [
      { name: 'Planning Granted', percentage: 10, status: 'COMPLETED' },
      { name: 'Site Preparation', percentage: 15, status: 'IN_PROGRESS' },
      { name: 'Foundation', percentage: 20, status: 'PENDING' },
      { name: 'Structure', percentage: 30, status: 'PENDING' },
      { name: 'Completion', percentage: 25, status: 'PENDING' }
    ]
  },
  {
    id: 'pool-002',
    projectName: 'Cork Riverside Apartments',
    developer: 'Southern Living Developments',
    location: 'Cork City',
    poolSize: 8500000,
    currentLiquidity: 1200000,
    baseYield: 8.2,
    currentBonus: 3.5, // Maximum early bonus
    liquidityBonus: 1.0,
    minimumInvestment: {
      retail: 1000,
      professional: 10000,
      institutional: 100000
    },
    timeline: {
      fundingDeadline: '2025-02-15',
      constructionStart: '2025-03-15',
      expectedCompletion: '2026-09-30'
    },
    risk: 'Low-Medium',
    collateralValue: 12000000,
    ltv: 70.8,
    status: 'FUNDING',
    investorCount: 43,
    documentsAvailable: [
      'Investment Memorandum',
      'Planning Permission',
      'Title Documents',
      'Insurance Policies',
      'Construction Contract'
    ],
    milestones: [
      { name: 'Land Acquisition', percentage: 15, status: 'COMPLETED' },
      { name: 'Planning', percentage: 10, status: 'COMPLETED' },
      { name: 'Foundation', percentage: 20, status: 'PENDING' },
      { name: 'Structure', percentage: 35, status: 'PENDING' },
      { name: 'Completion', percentage: 20, status: 'PENDING' }
    ]
  }
];

export default function IrishPropertyPools() {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [investorType, setInvestorType] = useState<'retail' | 'professional' | 'institutional'>('retail');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showRiskWarning, setShowRiskWarning] = useState(false);

  // Calculate returns based on investment amount and timing
  const calculateReturns = (pool: any, amount: number) => {
    const baseReturn = pool.baseYield;
    const bonusReturn = pool.currentBonus;
    const liquidityReturn = pool.liquidityBonus;
    const totalReturn = baseReturn + bonusReturn + liquidityReturn;
    
    const annualReturn = (amount * totalReturn) / 100;
    const totalProjectReturn = annualReturn * 2.5; // Assuming 2.5 year average project
    
    return {
      baseReturn,
      bonusReturn,
      liquidityReturn,
      totalReturn,
      annualReturn,
      totalProjectReturn,
      afterTaxReturn: totalProjectReturn * 0.67 // 33% CGT
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-blue-900 to-emerald-900">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-6 py-3 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/50 rounded-full mb-8"
            >
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="text-white font-medium">Revolutionary Development Finance</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Irish Property Liquidity Pools
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Fund premium developments with dynamic returns, milestone-based releases, 
              and full regulatory compliance
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => setShowRiskWarning(true)}
                className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                Start Investing
                <ArrowRight className="h-5 w-5" />
              </button>
              <Link
                href="/learn/liquidity-pools"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Learn How It Works
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: 'Dynamic Returns',
                description: 'Earn up to 12.7% p.a. with early investor bonuses'
              },
              {
                icon: <ShieldCheck className="h-8 w-8" />,
                title: 'CBI Regulated',
                description: 'Full compliance with Central Bank of Ireland'
              },
              {
                icon: <Timer className="h-8 w-8" />,
                title: 'Milestone Payouts',
                description: 'Funds released based on verified progress'
              },
              {
                icon: <Euro className="h-8 w-8" />,
                title: 'Low Minimums',
                description: 'Start from €1,000 for retail investors'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-emerald-600 mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Pools */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Active Investment Pools
            </h2>
            <p className="text-xl text-gray-600">
              Fund verified development projects with transparent tracking
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activePools.map((pool) => {
              const fillPercentage = (pool.currentLiquidity / pool.poolSize) * 100;
              const daysRemaining = Math.ceil((new Date(pool.timeline.fundingDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <motion.div
                  key={pool.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{pool.projectName}</h3>
                        <p className="text-emerald-100">{pool.location} • {pool.developer}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pool.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}>
                        {pool.status}
                      </div>
                    </div>
                    
                    {/* Live Returns Display */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-emerald-200 text-sm">Base Yield</div>
                          <div className="text-xl font-bold">{pool.baseYield}%</div>
                        </div>
                        <div>
                          <div className="text-emerald-200 text-sm">Early Bonus</div>
                          <div className="text-xl font-bold text-yellow-300">+{pool.currentBonus}%</div>
                        </div>
                        <div>
                          <div className="text-emerald-200 text-sm">Total Return</div>
                          <div className="text-xl font-bold text-emerald-300">
                            {(pool.baseYield + pool.currentBonus + pool.liquidityBonus).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pool Details */}
                  <div className="p-6">
                    {/* Funding Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Pool Progress</span>
                        <span className="text-sm font-medium">{fillPercentage.toFixed(0)}% Filled</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${fillPercentage}%` }}
                          transition={{ duration: 1 }}
                          className="bg-gradient-to-r from-emerald-600 to-blue-600 h-4 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>€{(pool.currentLiquidity / 1000000).toFixed(1)}M raised</span>
                        <span>€{(pool.poolSize / 1000000).toFixed(1)}M target</span>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-600">Min Investment</div>
                        <div className="text-lg font-bold text-gray-900">
                          €{pool.minimumInvestment[investorType].toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">LTV Ratio</div>
                        <div className="text-lg font-bold text-gray-900">{pool.ltv}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Investors</div>
                        <div className="text-lg font-bold text-gray-900">{pool.investorCount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Time Remaining</div>
                        <div className="text-lg font-bold text-orange-600">{daysRemaining} days</div>
                      </div>
                    </div>

                    {/* Investment Calculator */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Calculate Your Returns
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Investment amount"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (selectedPool === pool.id) {
                              setInvestmentAmount(value);
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            setSelectedPool(pool.id);
                            setShowRiskWarning(true);
                          }}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                        >
                          Calculate
                        </button>
                      </div>
                      
                      {selectedPool === pool.id && investmentAmount && (
                        <div className="mt-4 p-3 bg-white rounded-lg">
                          {(() => {
                            const returns = calculateReturns(pool, parseFloat(investmentAmount));
                            return (
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Annual Return:</span>
                                  <span className="font-bold text-emerald-600">
                                    €{returns.annualReturn.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Total Project Return:</span>
                                  <span className="font-bold text-emerald-600">
                                    €{returns.totalProjectReturn.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                  <span>After Tax (33% CGT):</span>
                                  <span className="font-bold text-gray-900">
                                    €{returns.afterTaxReturn.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowRiskWarning(true)}
                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all"
                      >
                        Invest Now
                      </button>
                      <Link
                        href={`/pools/${pool.id}/details`}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Risk Warning Modal */}
      <AnimatePresence>
        {showRiskWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Investment Risk Warning</h2>
                </div>
                <p className="text-gray-600">Important information - Please read carefully</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">Capital at Risk</h3>
                  <p className="text-gray-700">
                    Property development investments carry significant risks. You may lose some or all of your invested capital.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900">Key Risks Include:</h3>
                  <ul className="space-y-2">
                    {[
                      'Construction delays or cost overruns',
                      'Planning permission complications',
                      'Market value fluctuations',
                      'Developer insolvency risk',
                      'Illiquidity during construction period',
                      'Interest rate changes'
                    ].map((risk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">Regulatory Information</h3>
                  <p className="text-gray-700">
                    This investment is regulated by the Central Bank of Ireland. A cooling-off period of 14 days applies for retail investors.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I understand the risks involved and confirm I have read the full investment memorandum. 
                      I understand that property investments are illiquid and I may not be able to access my funds until project completion.
                    </span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex gap-3">
                <button
                  onClick={() => setShowRiskWarning(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  disabled={!acceptedTerms}
                  onClick={() => {
                    // Proceed to investment flow
                    window.location.href = '/invest/kyc';
                  }}
                  className={`flex-1 py-3 rounded-xl font-medium ${
                    acceptedTerms 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Proceed to Investment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}