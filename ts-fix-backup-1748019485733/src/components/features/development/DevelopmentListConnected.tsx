'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDevelopments, DevelopmentFilterInput } from '@/hooks/api/useDevelopments';
import DevelopmentCardConnected from './DevelopmentCardConnected';

interface DevelopmentListConnectedProps {
  title?: string;
  subtitle?: string;
  initialFilter?: DevelopmentFilterInput;
  limit?: number;
  showViewAll?: boolean;
}

/**
 * Connected version of the DevelopmentList component
 * This component fetches data using GraphQL and renders the developments
 */
const DevelopmentListConnected: React.FC<DevelopmentListConnectedProps> = ({ 
  title = "Our Communities", 
  subtitle = "Discover our premium new developments", 
  initialFilter = {},
  limit = 6,
  showViewAll = true
}) => {
  // State for filters
  const [filtersetFilter] = useState<DevelopmentFilterInput>(initialFilter);

  // Fetch developments with GraphQL
  const { data, isLoading, error } = useDevelopments({
    filter,
    pagination: { first: limit }
  });

  // Show loading state
  if (isLoading) {
    return (
      <section aria-labelledby="our-communities-heading" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="our-communities-heading" className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-4 text-xl text-gray-600">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md h-96 animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section aria-labelledby="our-communities-heading" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="our-communities-heading" className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-4 text-xl text-gray-600">
              {subtitle}
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <p className="text-red-600">
              Error loading developments: {error.message}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // No developments found
  if (!data || !data.developments || data.developments.length === 0) {
    return (
      <section aria-labelledby="our-communities-heading" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="our-communities-heading" className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-4 text-xl text-gray-600">
              {subtitle}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
            <p className="text-gray-600">
              No developments found.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show developments
  return (
    <section aria-labelledby="our-communities-heading" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="our-communities-heading" className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-4 text-xl text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Development Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.developments.map((development: any) => (
            <DevelopmentCardConnected key={development.id} development: any={development: any} />
          ))}
        </div>

        {showViewAll && (
          <div className="mt-12 text-center">
            <Link 
              href="/developments"
              className="inline-flex items-center px-6 py-3 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-[#2B5273] hover:text-white transition-colors duration-300"
            >
              View All Developments
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default DevelopmentListConnected;