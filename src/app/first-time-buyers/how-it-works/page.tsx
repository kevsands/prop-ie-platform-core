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
  ArrowRight,
  Building2,
  CreditCard,
  Clock,
  AlertCircle,
  Sparkles,
  Download,
  Users,
  Phone,
  MessageSquare,
  Video,
  Banknote,
  PiggyBank,
  Key,
  UserPlus,
  Search,
  MousePointer,
  PenTool,
  Lock,
  Smartphone,
  Globe,
  BarChart3,
  RefreshCw,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface TimelineStep {
  id: number;
  title: string;
  duration: string;
  description: string;
  icon: React.ComponentType<any>
  );
  color: string;
  tasks: string[];
  tips: string[];
  documents: string[];
  costs: {
    description: string;
    amount: string;
  }[];
}

const timelineSteps: TimelineStep[] = [
  {
    id: 1,
    title: 'Getting Started',
    duration: '1-2 weeks',
    description: 'Prepare your finances and understand your buying power',
    icon: UserPlus,
    color: 'from-blue-500 to-cyan-500',
    tasks: [
      'Calculate your budget using our HTB calculator',
      'Apply for mortgage Approval in Principle (AIP)',
      'Register for Help-to-Buy scheme with Revenue',
      'Choose a qualified solicitor'
    ],
    tips: [
      'Your mortgage plus deposit should determine your budget',
      'Include purchase costs (legal feessurveys) in planning',
      'Start decluttering financial history early'
    ],
    documents: [
      'P60 forms (last 2 years)',
      'Payslips (last 6 months)',
      'Bank statements (6 months)',
      'ID & proof of address'
    ],
    costs: [
      { description: 'Mortgage broker fee', amount: '€0-€500' },
      { description: 'Initial solicitor retainer', amount: '€500-€1,000' }
    ]
  },
  {
    id: 2,
    title: 'Property Search',
    duration: '2-8 weeks',
    description: 'Find your perfect home within your budget',
    icon: Search,
    color: 'from-purple-500 to-pink-500',
    tasks: [
      'Browse properties on PROP platform',
      'Attend virtual viewings',
      'Compare locations and developments',
      'Make a reservation online'
    ],
    tips: [
      'Act fast - good properties sell quickly',
      'Consider future needs (schoolstransport)',
      'Virtual tours save time and travel'
    ],
    documents: [
      'Proof of AIP',
      'HTB approval certificate',
      'Booking deposit receipt'
    ],
    costs: [
      { description: 'Reservation fee', amount: '€500-€5,000' },
      { description: 'Valuation survey', amount: '€150-€350' }
    ]
  },
  {
    id: 3,
    title: 'Legal Process',
    duration: '6-8 weeks',
    description: 'Complete contracts and legal requirements',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    tasks: [
      'Review contracts with solicitor',
      'Complete mortgage application',
      'Pay 10% deposit',
      'Sign contracts'
    ],
    tips: [
      'Read contracts thoroughly',
      'Ask questions about anything unclear',
      'Ensure HTB benefit is correctly applied'
    ],
    documents: [
      'Signed contracts',
      'Proof of deposit payment',
      'Updated mortgage offer',
      'Insurance details'
    ],
    costs: [
      { description: '10% deposit', amount: '10% of purchase price' },
      { description: 'Legal fees', amount: '€2,000-€3,000' },
      { description: 'Stamp duty (FTB)', amount: '€0' }
    ]
  },
  {
    id: 4,
    title: 'Completion',
    duration: '2-4 weeks',
    description: 'Final steps to get your keys',
    icon: Key,
    color: 'from-yellow-500 to-orange-500',
    tasks: [
      'Final mortgage drawdown',
      'Complete snagging inspection',
      'Close the sale',
      'Collect keys'
    ],
    tips: [
      'Do thorough snagging inspection',
      'Set up utilities before moving',
      'Register for property tax'
    ],
    documents: [
      'Certificate of completion',
      'Final mortgage docs',
      'Property deeds',
      'BER certificate'
    ],
    costs: [
      { description: 'Balance of purchase', amount: 'Mortgage + balance' },
      { description: 'Home insurance', amount: '€300-€600/year' }
    ]
  }
];

const digitalFeatures = [
  {
    icon: Globe,
    title: '24/7 Access',
    description: 'Browse properties, make reservations, track progress anytime',
    benefits: ['No office hours restrictions', 'Instant property alerts', 'Real-time availability']
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Platform',
    description: 'Complete your entire purchase journey from your phone',
    benefits: ['iOS & Android apps', 'Push notifications', 'Document scanning']
  },
  {
    icon: Video,
    title: 'Virtual Everything',
    description: 'Virtual viewings, meetings, and property tours',
    benefits: ['360° property tours', 'Live video consultations', 'AR furniture placement']
  },
  {
    icon: Lock,
    title: 'Secure & Compliant',
    description: 'Bank-level security for all transactions and documents',
    benefits: ['End-to-end encryption', 'GDPR compliant', 'Digital signatures']
  }
];

const supportChannels = [
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Instant messaging with our expert team',
    availability: '9am-8pm daily'
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Direct line to buyer specialists',
    availability: '9am-6pm Mon-Fri'
  },
  {
    icon: Video,
    title: 'Video Calls',
    description: 'Face-to-face consultations online',
    availability: 'By appointment'
  },
  {
    icon: HelpCircle,
    title: 'Help Center',
    description: 'Comprehensive guides and FAQs',
    availability: '24/7 access'
  }
];

export default function FirstTimeBuyersHowItWorksPage() {
  const [activeStepsetActiveStep] = useState<number>(0);
  const [expandedFAQsetExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How much deposit do I need as a first-time buyer?',
      answer: 'First-time buyers need a minimum 10% deposit (vs 20% for other buyers). With Help-to-Buy, you can get up to €30,000 towards your deposit, significantly reducing the amount you need to save.'
    },
    {
      question: 'What is the Help-to-Buy scheme?',
      answer: 'The Help-to-Buy (HTB) scheme provides a tax rebate of up to €30,000 to first-time buyers purchasing new homes. It's calculated as 10% of the purchase price (max €30,000) or the income tax you've paid over the last 4 years, whichever is lower.'
    },
    {
      question: 'How long does the buying process take?',
      answer: 'Typically 3-4 months from property selection to keys. With PROP's digital platform, we've reduced this by 30% compared to traditional methods. The exact timeline depends on mortgage approval and legal processes.'
    },
    {
      question: 'What costs should I budget for beyond the deposit?',
      answer: 'Budget for: Legal fees (€2,000-€3,000), mortgage protection insurance (€20-€50/month), home insurance (€300-€600/year), valuation survey (€150-€350), and potential moving costs.'
    },
    {
      question: 'Can I buy with friends or a partner?',
      answer: 'Yes! You can buy jointly with others. All parties must be first-time buyers to qualify for HTB benefits. You'll need to agree on ownership percentages and have a legal agreement in place.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-purple-800/90 z-0" />
        <div className="absolute inset-0 bg-grid-white/5 z-0" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            How First-Time Buying Works
          </h1>
          <p className="text-2xl md:text-3xl text-blue-100 mb-10 max-w-4xl mx-auto">
            Your complete guide to buying your first home in Ireland with PROP's revolutionary platform
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/first-time-buyers/register"
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-6 h-6" />
              Get Started Now
            </Link>
            <button className="px-8 py-4 bg-white/90 text-blue-900 rounded-xl font-bold text-lg shadow-lg hover:bg-white transition-all flex items-center gap-2">
              <Download className="w-6 h-6" />
              Download Guide
            </button>
          </div>
        </div>
      </section>

      {/* Quick Benefits Bar */}
      <section className="py-8 border-b bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">€30,000</div>
              <div className="text-gray-600">HTB Tax Relief</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">10%</div>
              <div className="text-gray-600">Deposit Only</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">€0</div>
              <div className="text-gray-600">Stamp Duty</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-gray-600">Digital Process</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Your Journey to Homeownership</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Follow our proven 4-step process to buy your first home
          </p>

          {/* Timeline Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {timelineSteps.map((stepindex: any) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`group relative px-6 py-3 rounded-full font-medium transition-all ${
                  activeStep === index
                    ? 'bg-gradient-to-r text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:shadow-md'
                } ${activeStep === index ? step.color : ''}`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg font-bold">{step.id}</span>
                  <span>{step.title}</span>
                </span>
                {index <timelineSteps.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 text-gray-400 hidden md:block" />
                )}
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className={`h-3 bg-gradient-to-r ${timelineSteps[activeStep].color}`} />
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Left Column */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${timelineSteps[activeStep].color} flex items-center justify-center text-white`}>
                      {React.createElement(timelineSteps[activeStep].icon, { size: 32 })}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{timelineSteps[activeStep].title}</h3>
                      <p className="text-gray-600">{timelineSteps[activeStep].duration}</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 mb-6">
                    {timelineSteps[activeStep].description}
                  </p>

                  {/* Key Tasks */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <CheckCircle className="text-green-500" size={20} />
                      Key Tasks
                    </h4>
                    <ul className="space-y-3">
                      {timelineSteps[activeStep].tasks.map((taskindex: any) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                          <span className="text-gray-700">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro Tips */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Sparkles className="text-yellow-500" size={20} />
                      Pro Tips
                    </h4>
                    <ul className="space-y-3">
                      {timelineSteps[activeStep].tips.map((tipindex: any) => (
                        <li key={index} className="flex items-start gap-3">
                          <Sparkles className="text-yellow-400 mt-0.5 flex-shrink-0" size={16} />
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  {/* Required Documents */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <FileText className="text-blue-500" size={20} />
                      Required Documents
                    </h4>
                    <ul className="space-y-3">
                      {timelineSteps[activeStep].documents.map((docindex: any) => (
                        <li key={index} className="flex items-start gap-3">
                          <FileText className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
                          <span className="text-gray-700">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Costs */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Banknote className="text-green-500" size={20} />
                      Typical Costs
                    </h4>
                    <div className="space-y-3">
                      {timelineSteps[activeStep].costs.map((costindex: any) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">{cost.description}</span>
                          <span className="font-semibold text-gray-900">{cost.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Features Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">The PROP Digital Advantage</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Experience the future of property buying with our cutting-edge platform
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {digitalFeatures.map((featureindex: any) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4">
                  {React.createElement(feature.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefitbIndex: any) => (
                    <li key={bIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-400" size={16} />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HTB Benefit Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Maximize Your HTB Benefit</h2>
              <p className="text-xl text-gray-600 mb-8">
                As a first-time buyer, you can get up to €30,000 in tax relief to boost your deposit. 
                Our platform automatically calculates and applies your benefit.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <Calculator className="text-blue-500" size={24} />
                  <span className="text-lg">Instant HTB calculator integrated</span>
                </div>
                <div className="flex items-center gap-4">
                  <PiggyBank className="text-green-500" size={24} />
                  <span className="text-lg">Average benefit: €20,000</span>
                </div>
                <div className="flex items-center gap-4">
                  <BarChart3 className="text-purple-500" size={24} />
                  <span className="text-lg">Track your eligibility in real-time</span>
                </div>
              </div>
              <Link href="/first-time-buyers/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition-all"
              >
                Calculate Your Benefit
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6">Example HTB Calculation</h3>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>Property Price</span>
                  <span className="font-semibold">€350,000</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>10% HTB Eligible</span>
                  <span className="font-semibold">€35,000</span>
                </div>
                <div className="flex justify-between p-3 bg-white rounded-lg">
                  <span>Tax Paid (4 years)</span>
                  <span className="font-semibold">€28,000</span>
                </div>
                <div className="flex justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-400">
                  <span className="font-semibold">Your HTB Benefit</span>
                  <span className="font-bold text-green-600 text-xl">€28,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Expert Support Every Step</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Our dedicated team is here to guide you through your journey
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channelindex: any) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                  {React.createElement(channel.icon, { size: 32, className: 'text-blue-600' })}
                </div>
                <h3 className="text-lg font-semibold mb-2">{channel.title}</h3>
                <p className="text-gray-600 mb-2">{channel.description}</p>
                <p className="text-sm text-blue-600 font-medium">{channel.availability}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faqindex: any) => (
              <div key={index} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-medium text-left">{faq.question}</span>
                  <ArrowRight className={`transform transition-transform ${expandedFAQ === index ? 'rotate-90' : ''}`} />
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">
            Join thousands of first-time buyers who have found their dream home with PROP
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/first-time-buyers/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
            >
              Get Started Now
            </Link>
            <Link href="/first-time-buyers/calculator"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              Calculate HTB Benefit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}