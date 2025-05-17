'use client';

import React from 'react';
import { Building, Users, Calculator, Shield, BarChart2, Globe } from 'lucide-react';
import Link from 'next/link';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  link: string;
  linkText: string;
  gradient: string;
}

const services: Service[] = [
  {
    icon: <Building className="h-10 w-10" />,
    title: 'Development Marketing',
    description: 'Premium marketing solutions for new developments with 3D tours and virtual staging',
    features: [
      '3D Property Tours',
      'Virtual Staging',
      'AI-Powered Marketing',
      'Professional Photography'
    ],
    link: '/solutions/development-marketing',
    linkText: 'Explore Marketing Solutions',
    gradient: 'from-blue-600 to-blue-700'
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: 'Lead Management',
    description: 'Advanced CRM platform for tracking buyer interest and managing sales pipeline',
    features: [
      'Automated Lead Scoring',
      'Sales Pipeline Tracking',
      'Customer Journey Mapping',
      'Real-time Analytics'
    ],
    link: '/solutions/lead-management',
    linkText: 'Discover CRM Features',
    gradient: 'from-purple-600 to-purple-700'
  },
  {
    icon: <Calculator className="h-10 w-10" />,
    title: 'Financial Tools',
    description: 'Mortgage calculators, Help-to-Buy integration, and affordability assessments',
    features: [
      'Mortgage Calculator',
      'Help-to-Buy Scheme',
      'Affordability Check',
      'Financial Reports'
    ],
    link: '/solutions/financial-tools',
    linkText: 'Access Financial Tools',
    gradient: 'from-green-600 to-green-700'
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: 'Secure Transactions',
    description: 'Digital document exchange and secure payment processing for property transactions',
    features: [
      'Digital Signatures',
      'Document Vault',
      'Secure Payments',
      'Compliance Tracking'
    ],
    link: '/solutions/secure-transactions',
    linkText: 'Learn About Security',
    gradient: 'from-indigo-600 to-indigo-700'
  }
];

export default function EnhancedServicesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <BarChart2 className="h-4 w-4 mr-2" />
            Enterprise Solutions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            End-to-end solutions for property development and sales, powered by cutting-edge technology
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative p-8">
                {/* Icon */}
                <div className="inline-flex items-center justify-center h-16 w-16 bg-gray-100 rounded-xl group-hover:bg-white/20 transition-colors duration-300 mb-6">
                  <div className="text-gray-700 group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 mb-6">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-gray-600 group-hover:text-white/80 transition-colors duration-300"
                    >
                      <span className="inline-block w-1.5 h-1.5 bg-blue-500 group-hover:bg-white rounded-full mt-1.5 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Link */}
                <Link
                  href={service.link}
                  className="inline-flex items-center text-blue-600 group-hover:text-white font-medium text-sm transition-colors duration-300"
                >
                  {service.linkText}
                  <svg
                    className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-100 to-transparent opacity-50 group-hover:from-white/20 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link
              href="/solutions"
              className="inline-flex items-center px-8 py-4 bg-[#2B5273] text-white rounded-xl hover:bg-[#1E3142] transition-all font-medium shadow-lg hover:shadow-xl"
            >
              <Globe className="h-5 w-5 mr-2" />
              View All Solutions
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-[#2B5273] text-[#2B5273] rounded-xl hover:bg-[#2B5273] hover:text-white transition-all font-medium"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 border-t pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#2B5273] mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Platform Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2B5273] mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2B5273] mb-2">256-bit</div>
              <div className="text-sm text-gray-600">SSL Encryption</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2B5273] mb-2">GDPR</div>
              <div className="text-sm text-gray-600">Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}