'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users,
  Building,
  Calculator,
  Home,
  Briefcase,
  TrendingUp,
  FileText,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function SolutionsPage() {
  const solutions = [
    {
      title: 'First-Time Buyers',
      description: 'Navigate the property market with confidence',
      icon: Home,
      href: '/solutions/first-time-buyers',
      color: 'blue',
      features: [
        'Step-by-step buying guides',
        'Mortgage calculators',
        'Government scheme eligibility',
        'Property search tools'
      ]
    },
    {
      title: 'Professional Investors',
      description: 'Maximize returns on your property portfolio',
      icon: Calculator,
      href: '/solutions/professional-investors',
      color: 'green',
      features: [
        'Portfolio analytics',
        'Yield calculators',
        'Market insights',
        'Tax optimization tools'
      ]
    },
    {
      title: 'Institutional Investors',
      description: 'Enterprise-grade investment platform',
      icon: Building,
      href: '/solutions/institutional',
      color: 'purple',
      features: [
        'Large-scale portfolio management',
        'Advanced analytics',
        'Due diligence tools',
        'Enterprise security'
      ]
    },
    {
      title: 'Property Developers',
      description: 'Streamline development and sales',
      icon: TrendingUp,
      href: '/solutions/developers',
      color: 'orange',
      features: [
        'Project management',
        'Sales tracking',
        'Buyer management',
        'Marketing tools'
      ]
    },
    {
      title: 'Estate Agents',
      description: 'Modern tools for property professionals',
      icon: Users,
      href: '/solutions/estate-agents',
      color: 'teal',
      features: [
        'Listing management',
        'Client CRM',
        'Viewing scheduler',
        'Document handling'
      ]
    },
    {
      title: 'Solicitors',
      description: 'Efficient conveyancing and legal tools',
      icon: FileText,
      href: '/solutions/solicitors',
      color: 'indigo',
      features: [
        'Digital contracts',
        'Case management',
        'Compliance tools',
        'Client portal'
      ]
    },
    {
      title: 'Architects & Engineers',
      description: 'Collaborate on property development',
      icon: Compass,
      href: '/solutions/architects',
      color: 'pink',
      features: [
        'Design collaboration',
        'Project documentation',
        'Planning applications',
        'Site management'
      ]
    }
  ];

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e3347] to-[#2b5273] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Solutions for Every Property Professional
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Whether you're buying your first home or managing a billion-euro portfolio, 
              PropIE has the tools and expertise to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <div 
                key={solution.href}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="p-8">
                  <div className={`w-12 h-12 rounded-lg ${colorMap[solution.color]} flex items-center justify-center mb-6`}>
                    <solution.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {solution.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {solution.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {solution.features.map((featureindex) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    href={solution.href}
                    className="inline-flex items-center text-[#1e3347] font-medium hover:text-[#2b5273] transition"
                  >
                    Learn more
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Not Sure Which Solution is Right for You?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our team can help you find the perfect solution for your needs
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-[#1e3347] text-white rounded-lg font-medium hover:bg-[#2b5273] transition text-lg"
          >
            Talk to an Expert
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
} 