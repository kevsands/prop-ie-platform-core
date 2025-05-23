'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Calculator, 
  FileText, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  Info,
  ArrowRight,
  BookOpen,
  Building2,
  CreditCard,
  ScrollText,
  UserCheck,
  EuroIcon,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';

export default function FirstTimeBuyersPageFixed() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'prop-difference' | 'htb' | 'mortgage' | 'properties' | 'documents' | 'progress'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-800/80 z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
            Ireland's Best First-Time Buyer Hub
          </h1>
          <p className="text-2xl md:text-3xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Step-by-step guidance, exclusive tools, and digital-first support for your homeownership journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/first-time-buyers/register"
              className="px-10 py-5 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center gap-2"
            >
              <UserCheck className="w-6 h-6" />
              Start Your Journey
            </Link>
            <button
              onClick={() => setCurrentView('htb')}
              className="px-10 py-5 bg-white/80 text-blue-900 rounded-xl font-bold text-lg shadow-lg hover:bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center gap-2"
            >
              <Calculator className="w-6 h-6" />
              HTB Calculator
            </button>
          </div>
        </div>
      </section>

      {/* Sticky Tabs */}
      <div className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-md shadow-md border-b border-blue-100">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-2 py-4 px-2">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'prop-difference', label: 'The PROP Way', icon: TrendingUp },
            { id: 'progress', label: 'Your Progress', icon: Clock },
            { id: 'htb', label: 'HTB Calculator', icon: Calculator },
            { id: 'mortgage', label: 'Mortgage', icon: Building2 },
            { id: 'properties', label: 'Find Properties', icon: Home },
            { id: 'documents', label: 'Documents', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300
                ${currentView === id ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-lg scale-105' : 'bg-white/70 text-blue-900 hover:bg-blue-50'}`}
              aria-current={currentView === id ? 'page' : undefined}
            >
              <Icon size={22} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {currentView === 'overview' && (
          <div>
            {/* Benefits Section */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-900">Why Buy With Prop.ie?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
                    <TrendingUp className="text-green-500 mb-4" size={40} />
                    <h3 className="text-xl font-semibold mb-2">Help to Buy Scheme</h3>
                    <p className="text-gray-600 mb-4">Get up to €30,000 in tax relief to boost your deposit for new homes.</p>
                    <ul className="space-y-2 text-sm text-gray-600 text-left">
                      <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} />10% of purchase price (max €30,000)</li>
                      <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} />Based on income tax paid over 4 years</li>
                      <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} />For properties up to €500,000</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
                    <Shield className="text-blue-500 mb-4" size={40} />
                    <h3 className="text-xl font-semibold mb-2">No Stamp Duty</h3>
                    <p className="text-gray-600 mb-4">Save thousands with stamp duty exemption for first-time buyers.</p>
                    <ul className="space-y-2 text-sm text-gray-600 text-left">
                      <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} />0% stamp duty up to €500,000</li>
                      <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} />Saves €5,000 on €500k purchase</li>
                      <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} />Automatic exemption applied</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
                    <CreditCard className="text-purple-500 mb-4" size={40} />
                    <h3 className="text-xl font-semibold mb-2">Lower Deposit</h3>
                    <p className="text-gray-600 mb-4">First-time buyers need only 10% deposit versus 20% for others.</p>
                    <ul className="space-y-2 text-sm text-gray-600 text-left">
                      <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} />10% deposit requirement</li>
                      <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} />90% mortgage available</li>
                      <li className="flex items-center"><CheckCircle className="text-green-400 mr-2" size={16} />Combined with HTB relief</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'prop-difference' && (
          <div>
            {/* The PROP Way Section */}
            <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-900">
                  How PROP Revolutionizes First-Time Buying
                </h2>
                <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                  Experience a digital-first approach that makes buying your first home faster, 
                  more transparent, and more personalized than ever before.
                </p>

                {/* Traditional vs PROP Comparison */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                  {/* Traditional Way */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-700 flex items-center">
                      <X className="mr-3 text-red-500" size={28} />
                      Traditional Buying
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <AlertCircle className="text-red-400 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-gray-700">In-Person Only</p>
                          <p className="text-gray-600">Queue at sales offices, limited viewing times</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="text-red-400 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-gray-700">Paper-Heavy Process</p>
                          <p className="text-gray-600">Physical documents, manual signatures, postal delays</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="text-red-400 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-gray-700">Limited Choice</p>
                          <p className="text-gray-600">Basic finishes, no customization options</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="text-red-400 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-gray-700">Opaque Process</p>
                          <p className="text-gray-600">Unclear timelines, limited updates</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* PROP Way */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border-2 border-blue-200">
                    <h3 className="text-2xl font-bold mb-6 text-blue-900 flex items-center">
                      <CheckCircle className="mr-3 text-green-500" size={28} />
                      The PROP Way
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="text-green-400 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-blue-900">100% Digital</p>
                          <p className="text-blue-800">Buy online 24/7, virtual tours, instant reservations</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-400 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-blue-900">Paperless & Fast</p>
                          <p className="text-blue-800">Digital contracts, e-signatures, instant processing</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-400 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-blue-900">PROP Choice</p>
                          <p className="text-blue-800">Customize finishes, add furniture, smart features</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="text-green-400 mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-blue-900">Full Transparency</p>
                          <p className="text-blue-800">Real-time updates, milestone tracking, direct communication</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Key Features */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                  <h3 className="text-2xl font-bold mb-8 text-center text-blue-900">
                    Exclusive PROP Features for First-Time Buyers
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Home className="text-blue-600" size={32} />
                      </div>
                      <h4 className="font-semibold mb-2">Off-Plan Excellence</h4>
                      <p className="text-gray-600">Buy directly from developers with the best prices and newest homes</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="text-purple-600" size={32} />
                      </div>
                      <h4 className="font-semibold mb-2">Instant HTB Integration</h4>
                      <p className="text-gray-600">Help-to-Buy benefits calculated and applied automatically</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="text-green-600" size={32} />
                      </div>
                      <h4 className="font-semibold mb-2">30-Day Incentives</h4>
                      <p className="text-gray-600">Close within 30 days for €2,500 PROP Choice credit</p>
                    </div>
                  </div>
                </div>

                {/* How It Works */}
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-2xl font-bold mb-8 text-center text-blue-900">
                    Your Digital Journey with PROP
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-start hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">1</div>
                      <div>
                        <h4 className="font-semibold mb-1">Browse & Reserve Online</h4>
                        <p className="text-gray-600">View properties 24/7, take virtual tours, and reserve instantly with just €500</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-start hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">2</div>
                      <div>
                        <h4 className="font-semibold mb-1">Digital Documentation</h4>
                        <p className="text-gray-600">Complete all paperwork online, e-sign contracts, track progress in real-time</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-start hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">3</div>
                      <div>
                        <h4 className="font-semibold mb-1">Customize with PROP Choice</h4>
                        <p className="text-gray-600">Select finishes, furniture, and smart features using our 3D visualizer</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-start hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">4</div>
                      <div>
                        <h4 className="font-semibold mb-1">Track & Complete</h4>
                        <p className="text-gray-600">Monitor construction, complete final payments digitally, get keys on completion</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                  <Link href="/first-time-buyers/register"
                    className="inline-block px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
                  >
                    Start Your Digital Journey
                  </Link>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Other view content placeholders */}
        {currentView === 'htb' && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Help-to-Buy Calculator</h2>
              <p className="text-center text-gray-600">Calculator component would go here</p>
            </div>
          </section>
        )}

        {currentView === 'mortgage' && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Mortgage Approval Flow</h2>
              <p className="text-center text-gray-600">Mortgage component would go here</p>
            </div>
          </section>
        )}

        {currentView === 'properties' && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Property Selection</h2>
              <p className="text-center text-gray-600">Property selection component would go here</p>
            </div>
          </section>
        )}

        {currentView === 'documents' && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Document Collection</h2>
              <p className="text-center text-gray-600">Document hub component would go here</p>
            </div>
          </section>
        )}

        {currentView === 'progress' && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Your Progress</h2>
              <p className="text-center text-gray-600">Milestone tracker component would go here</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}