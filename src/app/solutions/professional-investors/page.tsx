'use client';

import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Shield, 
  Building2, 
  Euro, 
  BarChart3, 
  Target, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  Calendar,
  Globe,
  PieChart,
  Briefcase,
  Clock,
  Zap,
  FileText,
  Database,
  Lock,
  Phone,
  Mail,
  MapPin,
  Star
} from 'lucide-react';

export default function ProfessionalInvestorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Institutional-Grade Investment Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Professional Investment
              <span className="text-blue-300 block">Solutions</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Access exclusive deal flow, sophisticated analytics, and institutional-grade investment tools 
              for professional property investors managing €10M+ portfolios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/investor/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center transition-colors"
              >
                Access Investment Platform
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/contact?type=professional-investor"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Metrics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">€2.8B+</div>
              <div className="text-gray-600">Assets Under Management</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">847</div>
              <div className="text-gray-600">Professional Investors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">12.4%</div>
              <div className="text-gray-600">Average Annual Return</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">98.7%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Investment Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive investment solutions designed for sophisticated investors, 
              family offices, and institutional capital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Portfolio Management */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Portfolio Management</h3>
              <p className="text-gray-600 mb-6">
                Professional portfolio construction and management services with institutional-grade analytics and reporting.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Real-time portfolio tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Risk-adjusted performance metrics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  ESG compliance monitoring
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Tax optimization strategies
                </li>
              </ul>
            </div>

            {/* Deal Flow Access */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Exclusive Deal Flow</h3>
              <p className="text-gray-600 mb-6">
                Access to off-market opportunities, pre-IPO investments, and institutional-only deals across Ireland and Europe.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Off-market opportunities
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Institutional partnerships
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Pre-launch development access
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Cross-border opportunities
                </li>
              </ul>
            </div>

            {/* Market Intelligence */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Market Intelligence</h3>
              <p className="text-gray-600 mb-6">
                Proprietary research, market analysis, and investment insights powered by institutional-grade data analytics.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Proprietary market research
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Predictive analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Quarterly market reports
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Investment thesis development
                </li>
              </ul>
            </div>

            {/* Due Diligence */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Due Diligence Services</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive due diligence support with legal, financial, and technical expertise from our professional network.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Financial auditing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Legal review services
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Technical inspections
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Market validation
                </li>
              </ul>
            </div>

            {/* Financing Solutions */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Euro className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Financing Solutions</h3>
              <p className="text-gray-600 mb-6">
                Access to institutional lending, structured finance, and alternative funding solutions for large-scale investments.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Institutional lending access
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Structured finance products
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Joint venture opportunities
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Alternative funding sources
                </li>
              </ul>
            </div>

            {/* Wealth Management */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Wealth Management</h3>
              <p className="text-gray-600 mb-6">
                Integrated wealth management services including tax planning, estate planning, and multi-generational wealth strategies.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Tax optimization strategies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Estate planning services
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Multi-generational planning
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Cross-border structuring
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Platform Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Investment Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology platform designed specifically for professional investors 
              with institutional-grade features and analytics.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Advanced Analytics Dashboard</h3>
                    <p className="text-gray-600">Real-time portfolio performance, risk metrics, and market intelligence in a comprehensive dashboard interface.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Institutional Data Access</h3>
                    <p className="text-gray-600">Access to proprietary market data, comparable sales analysis, and institutional-grade research reports.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Bank-Grade Security</h3>
                    <p className="text-gray-600">Enterprise-level security with encryption, multi-factor authentication, and compliance with financial regulations.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Automated Reporting</h3>
                    <p className="text-gray-600">Automated generation of investment reports, tax documents, and compliance reporting for investors and regulators.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Portfolio Performance</h3>
                  <span className="text-green-600 font-semibold">+12.4% YTD</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Assets</span>
                    <span className="font-semibold">€45.2M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Return</span>
                    <span className="text-green-600 font-semibold">+2.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Risk Score</span>
                    <span className="font-semibold">7.2/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Properties</span>
                    <span className="font-semibold">127</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Allocation by Type</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Residential</span>
                      <span>65%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Commercial</span>
                      <span>25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Development</span>
                      <span>10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Investor Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how professional investors are achieving superior returns through our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Dublin Portfolio Fund</h3>
                  <p className="text-gray-600 text-sm">€180M AUM</p>
                </div>
              </div>
              <blockquote className="text-gray-700 mb-6">
                "PROP's institutional platform has transformed our investment process. The analytics and deal flow access have helped us achieve 15.2% annual returns over 3 years."
              </blockquote>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">Professional Fund Manager</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Atlantic Capital</h3>
                  <p className="text-gray-600 text-sm">€320M AUM</p>
                </div>
              </div>
              <blockquote className="text-gray-700 mb-6">
                "The off-market deals and professional network have been invaluable. We've sourced €85M in properties through PROP's exclusive channels."
              </blockquote>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">Investment Director</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Celtic Family Office</h3>
                  <p className="text-gray-600 text-sm">€150M AUM</p>
                </div>
              </div>
              <blockquote className="text-gray-700 mb-6">
                "PROP's wealth management integration and tax optimization strategies have helped us structure investments efficiently across multiple jurisdictions."
              </blockquote>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">Family Office Principal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Membership Tiers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the membership level that best fits your investment scale and requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Elite Tier */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">Elite Professional</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">€10M+</div>
                <p className="text-gray-600">Minimum investment threshold</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Full platform access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Dedicated relationship manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Quarterly strategy sessions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Priority deal access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Custom reporting</span>
                </li>
              </ul>
              <Link 
                href="/contact?tier=elite"
                className="w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
              >
                Apply for Elite
              </Link>
            </div>

            {/* Premier Tier */}
            <div className="bg-gradient-to-b from-blue-50 to-white border-2 border-blue-500 rounded-xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">Premier Professional</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">€25M+</div>
                <p className="text-gray-600">Minimum investment threshold</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Everything in Elite</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Exclusive investment opportunities</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Co-investment opportunities</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>White-glove service</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Tax optimization consulting</span>
                </li>
              </ul>
              <Link 
                href="/contact?tier=premier"
                className="w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
              >
                Apply for Premier
              </Link>
            </div>

            {/* Institutional Tier */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">Institutional</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">€100M+</div>
                <p className="text-gray-600">Minimum investment threshold</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Everything in Premier</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Institutional partnerships</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Direct developer access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Custom platform features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Regulatory support</span>
                </li>
              </ul>
              <Link 
                href="/contact?tier=institutional"
                className="w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
              >
                Apply for Institutional
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Elevate Your Investment Strategy?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join Ireland's leading professional investment platform and access institutional-grade 
            opportunities, analytics, and services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/investor/dashboard"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
            >
              Access Investment Platform
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/contact?type=professional-consultation"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
            >
              <Phone className="mr-2 w-5 h-5" />
              Schedule Consultation
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Mail className="w-5 h-5 text-blue-300 mr-2" />
                <span className="text-white font-medium">Email</span>
              </div>
              <p className="text-blue-100">professional@prop.ie</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Phone className="w-5 h-5 text-blue-300 mr-2" />
                <span className="text-white font-medium">Direct Line</span>
              </div>
              <p className="text-blue-100">+353 1 234 5678</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <MapPin className="w-5 h-5 text-blue-300 mr-2" />
                <span className="text-white font-medium">Office</span>
              </div>
              <p className="text-blue-100">Dublin 2, Ireland</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}