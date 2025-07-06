'use client';

import React from 'react';
import Link from 'next/link';

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Resources</h1>
      <p className="text-lg text-gray-700 mb-8">
        Explore our comprehensive collection of property resources, tools, and guides 
        to help you make informed decisions throughout your property journey.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <ResourceCard 
          title="Property Guides" 
          description="Comprehensive guides covering all aspects of property buying, selling, and investing."
          href="/resources/property-guides"
        />
        <ResourceCard 
          title="Calculators & Tools" 
          description="Interactive tools to help plan your finances and make informed property decisions."
          href="/resources/calculators"
        />
        <ResourceCard 
          title="Document Templates" 
          description="Ready-to-use legal documents and templates for various property transactions."
          href="/resources/templates"
        />
        <ResourceCard 
          title="Market Reports" 
          description="Latest insights and analysis on the Irish property market trends and forecasts."
          href="/resources/market-reports"
        />
        <ResourceCard 
          title="Regulations & Compliance" 
          description="Stay up-to-date with current property laws, regulations, and compliance requirements."
          href="/resources/regulations"
        />
        <ResourceCard 
          title="API Documentation" 
          description="Technical resources and integration guides for developers."
          href="/resources/api-docs"
        />
      </div>
    </div>
  );
}

// Resource Card Component
function ResourceCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:translate-y-[-2px]"
    >
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <div className="mt-4 flex items-center text-[#2B5273]">
        <span className="text-sm font-medium">Explore</span>
        <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  );
} 