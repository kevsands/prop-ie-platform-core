'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, BarChart3, TrendingUp, Shield, Users, Globe,
  CheckCircle, ArrowRight, DollarSign, FileText, Calculator,
  Target, Award, Zap, Eye, Clock, Search, Star, ChevronRight,
  Calendar
} from 'lucide-react';

export default function InstitutionalInvestorsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: BarChart3,
      title: 'Portfolio Analytics',
      description: 'Advanced analytics dashboard with real-time property performance metrics, yield calculations, and market intelligence.',
      benefits: ['Real-time valuations', 'Risk assessment tools', 'Market trend analysis', 'Performance benchmarking']
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Comprehensive risk assessment tools and compliance monitoring for institutional-grade investment security.',
      benefits: ['ESG compliance tracking', 'Regulatory reporting', 'Risk scoring algorithms', 'Stress testing tools']
    },
    {
      icon: Globe,
      title: 'Deal Origination',
      description: 'Exclusive access to off-market opportunities and pre-launch developments across Ireland.',
      benefits: ['Off-market deals', 'Bulk acquisition opportunities', 'Early access programs', 'Exclusive partnerships']
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Dedicated institutional relationship managers and white-glove service for complex transactions.',
      benefits: ['Dedicated account manager', '24/7 support access', 'Custom reporting', 'Priority deal flow']
    }
  ];

  const caseStudies = [
    {
      client: 'European REIT Fund',
      investment: '€45M',
      properties: '127 units',
      yield: '6.8%',
      description: 'Multi-site acquisition across Dublin and Cork with 18-month deployment period.',
      outcomes: ['15% above target yield', 'Full occupancy within 6 months', '€3M additional value through PROP Choice upgrades']
    },
    {
      client: 'Pension Fund Consortium',
      investment: '€120M',
      properties: '8 developments',
      yield: '7.2%',
      description: 'Forward-funded development portfolio with pre-let guarantees.',
      outcomes: ['22% IRR achieved', 'Zero vacancy risk', 'ESG certification on all properties']
    }
  ];

  const services = [
    {
      category: 'Deal Sourcing',
      items: [
        'Off-market opportunity identification',
        'Development forward funding',
        'Bulk unit acquisitions',
        'Portfolio optimization analysis'
      ]
    },
    {
      category: 'Due Diligence',
      items: [
        'Technical & legal due diligence',
        'Market analysis & feasibility studies',
        'Environmental impact assessments',
        'ESG compliance verification'
      ]
    },
    {
      category: 'Transaction Management',
      items: [
        'Deal structuring & negotiation',
        'Legal documentation management',
        'Funding coordination',
        'Completion management'
      ]
    },
    {
      category: 'Portfolio Management',
      items: [
        'Asset management services',
        'Performance monitoring',
        'Exit strategy planning',
        'Yield optimization'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white py-24">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <Building className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Institutional Investment Solutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Scale Your Property
              <span className="block text-blue-300">Investment Portfolio</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Institutional-grade property investment platform serving REITs, pension funds, 
              and sovereign wealth funds with €2B+ in transactions facilitated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/investor/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Access Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/contact?type=institutional"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all border border-blue-500"
              >
                Request Demo
                <Calendar className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Institutional-Grade Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for scale with enterprise security, advanced analytics, and institutional workflows
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, bIndex) => (
                        <li key={bIndex} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Full-Service Institutional Support</h2>
            <p className="text-xl text-gray-600">End-to-end support for complex institutional investments</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{service.category}</h3>
                <ul className="space-y-3">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven Track Record</h2>
            <p className="text-xl text-gray-600">Real results from institutional partnerships</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{study.client}</h3>
                    <p className="text-gray-600">{study.description}</p>
                  </div>
                  <Award className="h-8 w-8 text-blue-600 flex-shrink-0" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{study.investment}</div>
                    <div className="text-sm text-gray-500">Investment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{study.properties}</div>
                    <div className="text-sm text-gray-500">Properties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{study.yield}</div>
                    <div className="text-sm text-gray-500">Net Yield</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Outcomes:</h4>
                  <ul className="space-y-1">
                    {study.outcomes.map((outcome, oIndex) => (
                      <li key={oIndex} className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Scale Your Portfolio?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join leading institutional investors using PROP's platform for €50M+ transactions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/investor/dashboard"
              className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg"
            >
              Access Platform
            </Link>
            <Link 
              href="/contact?type=institutional"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-slate-900 transition-all"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}