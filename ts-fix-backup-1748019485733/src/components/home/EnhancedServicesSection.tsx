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
    <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <BarChart2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Enterprise Solutions
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Our Services
          </h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            End-to-end solutions for property development and sales, powered by cutting-edge technology
          </p>
        </div>

        {/* Mobile Services Slider */}
        <div className="md:hidden overflow-x-auto pb-6 -mx-4 px-4 hide-scrollbar">
          <div className="flex space-x-4 w-max">
            {services.map((serviceindex) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all w-[280px] flex-shrink-0 overflow-hidden"
              >
                {/* Background Gradient - Active on tap for mobile */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative p-5">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center h-12 w-12 bg-gray-100 rounded-lg group-hover:bg-white/20 group-active:bg-white/20 transition-colors duration-300 mb-4">
                    <div className="text-gray-700 group-hover:text-white group-active:text-white transition-colors duration-300">
                      {service.icon}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-white group-active:text-white transition-colors duration-300 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-white/90 group-active:text-white/90 transition-colors duration-300 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Mobile - Show only 2 features */}
                  <ul className="space-y-1.5 mb-4">
                    {service.features.slice(02).map((featureidx) => (
                      <li
                        key={idx}
                        className="flex items-start text-xs text-gray-600 group-hover:text-white/80 group-active:text-white/80 transition-colors duration-300"
                      >
                        <span className="inline-block w-1 h-1 bg-blue-500 group-hover:bg-white group-active:bg-white rounded-full mt-1.5 mr-1.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Link */}
                  <Link
                    href={service.link}
                    className="inline-flex items-center text-blue-600 group-hover:text-white group-active:text-white font-medium text-xs transition-colors duration-300"
                  >
                    {service.linkText}
                    <svg
                      className="ml-1 h-3 w-3 transform group-hover:translate-x-1 group-active:translate-x-1 transition-transform duration-300"
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
              </div>
            ))}
          </div>
        </div>

        {/* Desktop and Tablet Services Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((serviceindex) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Content */}
              <div className="relative p-6 lg:p-8">
                {/* Icon */}
                <div className="inline-flex items-center justify-center h-14 lg:h-16 w-14 lg:w-16 bg-gray-100 rounded-xl group-hover:bg-white/20 transition-colors duration-300 mb-5 lg:mb-6">
                  <div className="text-gray-700 group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-2 lg:mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 mb-5 lg:mb-6">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-5 lg:mb-6">
                  {service.features.map((featureidx) => (
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
              <div className="absolute top-0 right-0 w-16 lg:w-20 h-16 lg:h-20 bg-gradient-to-bl from-gray-100 to-transparent opacity-50 group-hover:from-white/20 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 sm:mt-12 md:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/solutions"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#2B5273] text-white rounded-lg sm:rounded-xl hover:bg-[#1E3142] transition-all font-medium shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
              View All Solutions
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#2B5273] text-[#2B5273] rounded-lg sm:rounded-xl hover:bg-[#2B5273] hover:text-white transition-all font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 sm:mt-12 md:mt-16 border-t pt-8 sm:pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2B5273] mb-1 sm:mb-2">99.9%</div>
              <div className="text-xs sm:text-sm text-gray-600">Platform Uptime</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2B5273] mb-1 sm:mb-2">24/7</div>
              <div className="text-xs sm:text-sm text-gray-600">Support Available</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2B5273] mb-1 sm:mb-2">256-bit</div>
              <div className="text-xs sm:text-sm text-gray-600">SSL Encryption</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2B5273] mb-1 sm:mb-2">GDPR</div>
              <div className="text-xs sm:text-sm text-gray-600">Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}