'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, Users, FileText, CheckCircle, Clock, Shield, 
  Calendar, MessageSquare, BarChart3, Smartphone, Eye, 
  ArrowRight, DollarSign, Home, UserCheck, ChevronRight,
  Briefcase, TrendingUp, Target, Award, Zap, Phone,
  Package, ClipboardCheck, LineChart, MapPin, Key,
  AlertCircle, Settings, Video, HeadphonesIcon, 
  BookOpen, Calculator, Scale, Timer, Mail, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EstateAgentsPage() {
  const [activeFeaturesetActiveFeature] = useState('transaction');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <motion.div
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
              className="inline-flex items-center px-6 py-3 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full mb-6"
            >
              <Briefcase className="h-5 w-5 mr-2 text-blue-300" />
              <span className="text-blue-300 font-medium">Estate Agent Solutions</span>
            </motion.div>

            <motion.h1 
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
              transition={ delay: 0.1 }
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Streamline Every Sale from
              <span className="block text-blue-400">Launch to Handover</span>
            </motion.h1>

            <motion.p 
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
              transition={ delay: 0.2 }
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Complete digital platform for estate agents to manage developer sales, 
              coordinate transactions, and deliver exceptional buyer experiences
            </motion.p>

            <motion.div 
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
              transition={ delay: 0.3 }
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/demo"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl"
              >
                Book Platform Demo
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/30"
              >
                Talk to Our Team
                <MessageSquare className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            {[
              {
                icon: <Timer className="h-8 w-8" />,
                value: "75%",
                label: "Faster Completions",
                description: "Reduce closing time"
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                value: "40%",
                label: "Higher Conversion",
                description: "From viewing to sale"
              },
              {
                icon: <Users className="h-8 w-8" />,
                value: "200+",
                label: "Agents Using PROP",
                description: "Nationwide network"
              },
              {
                icon: <DollarSign className="h-8 w-8" />,
                value: "€500M+",
                label: "Sales Managed",
                description: "Total transaction value"
              }
            ].map((metricindex) => (
              <motion.div
                key={index}
                initial={ opacity: 0, y: 20 }
                animate={ opacity: 1, y: 0 }
                transition={ delay: 0.4 + index * 0.1 }
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="text-blue-400 mb-3 flex justify-center">{metric.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-lg font-semibold text-white">{metric.label}</div>
                <div className="text-sm text-gray-300">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Tabs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Sales & Transaction Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage developer sales from initial viewing to final handover
            </p>
          </div>

          {/* Feature Navigation */}
          <div className="flex flex-wrap justify-center mb-12 border-b">
            {[
              { id: 'transaction', label: 'Transaction Management', icon: FileText },
              { id: 'viewing', label: 'Viewing Coordination', icon: Calendar },
              { id: 'completion', label: 'Completion Process', icon: CheckCircle },
              { id: 'communication', label: 'Client Communication', icon: MessageSquare },
              { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFeature(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
                  activeFeature === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Feature Content */}
          <div className="mt-12">
            {activeFeature === 'transaction' && <TransactionManagement />}
            {activeFeature === 'viewing' && <ViewingCoordination />}
            {activeFeature === 'completion' && <CompletionProcess />}
            {activeFeature === 'communication' && <ClientCommunication />}
            {activeFeature === 'analytics' && <SalesAnalytics />}
          </div>
        </div>
      </section>

      {/* Workflow Visualization */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              End-to-End Sales Process
            </h2>
            <p className="text-xl text-gray-600">
              Seamless workflow from lead to handover
            </p>
          </div>

          <div className="grid md:grid-cols-6 gap-4">
            {[
              { icon: Target, label: "Lead Capture", color: "blue" },
              { icon: Calendar, label: "Viewing", color: "purple" },
              { icon: FileText, label: "Offer", color: "green" },
              { icon: Scale, label: "Contracts", color: "yellow" },
              { icon: Building, label: "Completion", color: "orange" },
              { icon: Key, label: "Handover", color: "red" }
            ].map((stepindex) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className={`w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <step.icon className={`h-8 w-8 text-${step.color}-600`} />
                  </div>
                  <p className="font-medium text-gray-900">{step.label}</p>
                </div>
                {index <5 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-8 h-6 w-6 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Seamless Integration with Developer Systems
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Work directly with developers' project data, pricing, and inventory in real-time. 
                Coordinate with solicitors, manage documentation, and track every transaction milestone.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Building className="h-6 w-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Developer Dashboard Access</h3>
                    <p className="text-gray-600">Real-time unit availability, pricing, and project updates</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Scale className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Solicitor Coordination</h3>
                    <p className="text-gray-600">Automated document sharing and milestone tracking</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FileCheck className="h-6 w-6 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Document Management</h3>
                    <p className="text-gray-600">Centralized storage for contracts, agreements, and compliance</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <img src="/api/placeholder/600/400" alt="Platform Integration" className="rounded-xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Top Agents Choose PROP
            </h2>
            <p className="text-xl text-gray-600">
              Transform your agency operations with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Accelerated Sales Cycle</h3>
              <p className="text-gray-600 mb-4">
                Reduce time from viewing to completion by up to 75% with automated workflows
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Digital offer management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Instant document generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Automated compliance checks</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-6">
                <UserCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enhanced Client Experience</h3>
              <p className="text-gray-600 mb-4">
                Provide buyers with a premium digital experience from first contact to keys
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Virtual viewings & 3D tours</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Real-time status updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Mobile-first buyer portal</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-6">
                <LineChart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Analytics</h3>
              <p className="text-gray-600 mb-4">
                Data-driven insights to optimize your sales strategy and commissions
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Conversion tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Commission calculator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Lead source analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Agency Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how leading agencies transform their operations with PROP
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                agency: "Dublin Property Partners",
                quote: "PROP has revolutionized how we manage developer sales. We've cut our transaction time in half while providing a much better experience for buyers.",
                author: "Sarah Murphy",
                role: "Sales Director",
                metric: "50% faster completions"
              },
              {
                agency: "Cork Estate Solutions",
                quote: "The integration with solicitors and developers saves us hours every week. Everything is in one place, and our clients love the transparency.",
                author: "Michael O'Brien",
                role: "Managing Partner",
                metric: "200% ROI increase"
              },
              {
                agency: "Galway Premier Estates",
                quote: "We've seen a 40% increase in conversion rates since using PROP. The automated follow-ups and digital documentation make a huge difference.",
                author: "Emma Walsh",
                role: "Senior Agent",
                metric: "40% higher conversions"
              }
            ].map((storyindex) => (
              <motion.div
                key={index}
                initial={ opacity: 0, y: 20 }
                animate={ opacity: 1, y: 0 }
                transition={ delay: index * 0.1 }
                className="bg-white rounded-xl p-8 shadow-lg"
              >
                <Award className="h-8 w-8 text-yellow-500 mb-4" />
                <p className="text-gray-700 mb-6 italic">"{story.quote}"</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-900">{story.author}</p>
                    <p className="text-sm text-gray-600">{story.role}, {story.agency}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="font-bold text-blue-900">{story.metric}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about using PROP for your agency
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                question: "How does PROP integrate with developer systems?",
                answer: "PROP seamlessly connects with developer project management systems, providing real-time access to unit availability, pricing, and project updates. Your agency gets a dedicated dashboard with all relevant information."
              },
              {
                question: "Can we manage multiple developer clients?",
                answer: "Yes, PROP allows you to manage unlimited developer relationships. Each developer has their own project space, and you can switch between them easily while maintaining separate workflows and documentation."
              },
              {
                question: "How does the solicitor coordination work?",
                answer: "PROP includes built-in communication channels with solicitors. Documents are automatically shared at the right stages, and all parties can track progress in real-time, eliminating email chains and phone tag."
              },
              {
                question: "What training is provided?",
                answer: "We offer comprehensive onboarding including video tutorials, live training sessions, and ongoing support. Most agents are fully operational within 48 hours of starting."
              },
              {
                question: "How does commission tracking work?",
                answer: "PROP automatically calculates commissions based on your agreed rates with each developer. You can track pending, earned, and paid commissions with detailed reporting."
              }
            ].map((faqindex) => (
              <motion.div
                key={index}
                initial={ opacity: 0, y: 20 }
                animate={ opacity: 1, y: 0 }
                transition={ delay: index * 0.1 }
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Agency?
          </h2>
          <p className="text-xl mb-8">
            Join Ireland's leading estate agents using PROP to streamline their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              Book a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
            >
              Contact Sales
              <Phone className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-8 justify-center items-center">
            <div className="flex items-center gap-2">
              <HeadphonesIcon className="h-6 w-6" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span>Free Training</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span>Secure Platform</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Feature Components
function TransactionManagement() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Complete Transaction Management</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Manage every aspect of the sales process from initial offer to final completion
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <FileText className="h-10 w-10 text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Digital Offer Management</h4>
            <p className="text-gray-600 mb-4">
              Create, submit, and track offers digitally with instant developer approval workflows
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Pre-populated offer forms</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Automated compliance checks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Real-time status tracking</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Scale className="h-10 w-10 text-green-600 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Solicitor Coordination</h4>
            <p className="text-gray-600 mb-4">
              Seamless integration with buyer and vendor solicitors for smooth transactions
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Automated document sharing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Milestone notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Query management system</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <h4 className="text-xl font-semibold mb-6">Transaction Dashboard</h4>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Active Transactions</span>
                <span className="text-2xl font-bold text-blue-600">24</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={ width: '65%' }></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">This Month's Completions</span>
                <span className="text-2xl font-bold text-green-600">8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={ width: '80%' }></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Pending Commission</span>
                <span className="text-2xl font-bold text-purple-600">€142,500</span>
              </div>
              <p className="text-sm text-gray-600">Across 12 transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewingCoordination() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Smart Viewing Management</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Coordinate viewings efficiently with automated scheduling and follow-ups
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <Calendar className="h-10 w-10 text-purple-600 mb-4" />
          <h4 className="text-xl font-semibold mb-2">Online Booking</h4>
          <p className="text-gray-600 mb-4">
            Buyers can book viewings directly through the platform
          </p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">• Real-time availability</li>
            <li className="text-sm text-gray-700">• Automated confirmations</li>
            <li className="text-sm text-gray-700">• SMS reminders</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <Video className="h-10 w-10 text-blue-600 mb-4" />
          <h4 className="text-xl font-semibold mb-2">Virtual Tours</h4>
          <p className="text-gray-600 mb-4">
            Offer 3D tours and live video viewings for remote buyers
          </p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">• HD video streaming</li>
            <li className="text-sm text-gray-700">• Interactive 3D models</li>
            <li className="text-sm text-gray-700">• Recording capabilities</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <ClipboardCheck className="h-10 w-10 text-green-600 mb-4" />
          <h4 className="text-xl font-semibold mb-2">Follow-up Automation</h4>
          <p className="text-gray-600 mb-4">
            Never miss a follow-up with automated sequences
          </p>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">• Post-viewing surveys</li>
            <li className="text-sm text-gray-700">• Interest tracking</li>
            <li className="text-sm text-gray-700">• Next step prompts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CompletionProcess() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Streamlined Completion Process</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Guide buyers through completion with clear milestones and automated workflows
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h4 className="text-xl font-semibold mb-6">Completion Timeline</h4>
        <div className="space-y-6">
          {[
            { title: "Offer Accepted", status: "complete", date: "Jan 15" },
            { title: "Contracts Issued", status: "complete", date: "Jan 22" },
            { title: "Survey Complete", status: "complete", date: "Feb 5" },
            { title: "Mortgage Approved", status: "complete", date: "Feb 12" },
            { title: "Contracts Signed", status: "current", date: "Feb 20" },
            { title: "Deposit Paid", status: "upcoming", date: "Mar 1" },
            { title: "Completion", status: "upcoming", date: "Mar 15" },
            { title: "Keys Handover", status: "upcoming", date: "Mar 15" }
          ].map((milestoneindex) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                milestone.status === 'complete' ? 'bg-green-100' :
                milestone.status === 'current' ? 'bg-blue-100' :
                'bg-gray-100'
              }`}>
                {milestone.status === 'complete' ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : milestone.status === 'current' ? (
                  <Clock className="h-6 w-6 text-blue-600" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900">{milestone.title}</h5>
                <p className="text-sm text-gray-600">{milestone.date}</p>
              </div>
              {milestone.status === 'current' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  In Progress
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClientCommunication() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Multi-Channel Communication</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Keep all parties informed with automated updates and centralized messaging
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <MessageSquare className="h-10 w-10 text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Centralized Messaging</h4>
            <p className="text-gray-600">
              All communication in one place - buyers, solicitors, developers
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Mail className="h-10 w-10 text-green-600 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Automated Updates</h4>
            <p className="text-gray-600">
              Status changes trigger automatic notifications to all parties
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="text-xl font-semibold mb-4">Recent Activity</h4>
          <div className="space-y-4">
            {[
              { type: "message", from: "John Smith", content: "Query about parking space", time: "2 min ago" },
              { type: "update", content: "Survey report uploaded", time: "1 hour ago" },
              { type: "notification", content: "Contract review complete", time: "3 hours ago" },
              { type: "message", from: "Solicitor", content: "Mortgage approval received", time: "1 day ago" }
            ].map((activityindex) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'message' ? 'bg-blue-100' :
                  activity.type === 'update' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'message' ? <MessageSquare className="h-4 w-4 text-blue-600" /> :
                   activity.type === 'update' ? <File className="h-4 w-4 text-green-600" /> :
                   <Bell className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  {activity.from && <p className="font-medium text-gray-900">{activity.from}</p>}
                  <p className="text-sm text-gray-600">{activity.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesAnalytics() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Performance Analytics</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Track your performance, optimize your strategy, and maximize commissions
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900">€3.2M</p>
          <p className="text-sm text-gray-600">YTD Sales Volume</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900">42%</p>
          <p className="text-sm text-gray-600">Conversion Rate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900">21 days</p>
          <p className="text-sm text-gray-600">Avg Time to Close</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg text-center">
          <DollarSign className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900">€156K</p>
          <p className="text-sm text-gray-600">Total Commission</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h4 className="text-xl font-semibold mb-6">Monthly Performance</h4>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Interactive Chart Placeholder</p>
        </div>
      </div>
    </div>
  );
}

// Add these missing icon imports at the top
import { Circle, Bell, File } from 'lucide-react';