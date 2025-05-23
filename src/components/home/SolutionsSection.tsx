import React from 'react';
"use client";

import SolutionCard from '@/components/solutions/SolutionCard';

export default function SolutionsSection() {
  // Solution icons could be replaced with actual SVGs/images
  const placeholderIcon = "/icons/placeholder.svg";

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Solutions for every stakeholder</h2>
          <p className="mt-4 text-xl text-gray-600">
            Specialized tools for everyone in the property ecosystem
          </p>
        </div>

        <div className="grid gap-8">
          {/* Home Buyers */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Home Buyers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SolutionCard
                title="First-Time Buyers"
                description="Step-by-step guidance for your first home purchase"
                icon={placeholderIcon}
                href="/solutions/first-time-buyers"
              />
              <SolutionCard
                title="Move-Up Buyers"
                description="Upgrade to your dream home seamlessly"
                icon={placeholderIcon}
                href="/solutions/move-up-buyers"
              />
              <SolutionCard
                title="Investment Properties"
                description="Build your property portfolio"
                icon={placeholderIcon}
                href="/solutions/investment-properties"
              />
            </div>
          </div>

          {/* Investors */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Investors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SolutionCard
                title="Professional Investors"
                description="Tools to maximize your property portfolio"
                icon={placeholderIcon}
                href="/solutions/professional-investors"
              />
              <SolutionCard
                title="Institutional Investors"
                description="Enterprise-grade solutions for large-scale property investment"
                icon={placeholderIcon}
                href="/solutions/institutional"
              />
              <SolutionCard
                title="Property Funds"
                description="Manage multiple properties and investments"
                icon={placeholderIcon}
                href="/solutions/property-funds"
              />
            </div>
          </div>

          {/* Developers */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Developers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SolutionCard
                title="Developer Hub"
                description="Centralized platform for property developers"
                icon={placeholderIcon}
                href="/solutions/developer-hub"
              />
              <SolutionCard
                title="Project Management"
                description="Track and manage development projects"
                icon={placeholderIcon}
                href="/solutions/project-management"
              />
              <SolutionCard
                title="Sales & Marketing"
                description="Tools to promote and sell your developments"
                icon={placeholderIcon}
                href="/solutions/developer-marketing"
              />
            </div>
          </div>

          {/* Professionals */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Professionals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SolutionCard
                title="Estate Agents"
                description="Property listing and management tools"
                icon={placeholderIcon}
                href="/solutions/estate-agents"
              />
              <SolutionCard
                title="Solicitors"
                description="Document processing and conveyancing"
                icon={placeholderIcon}
                href="/solutions/solicitors"
              />
              <SolutionCard
                title="Architects & Engineers"
                description="Design and technical assessment resources"
                icon={placeholderIcon}
                href="/solutions/architects-engineers"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 