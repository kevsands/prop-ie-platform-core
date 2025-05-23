'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Report card component
const ReportCard = ({ 
  title, 
  date, 
  description, 
  image, 
  category,
  href
}: { 
  title: string; 
  date: string; 
  description: string; 
  image: string;
  category: string;
  href: string;
}) => (
  <Link href={href} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
    <div className="relative h-48 overflow-hidden">
      <Image 
        src={image} 
        alt={title}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute top-4 left-4 bg-[#2B5273] text-white text-xs px-2 py-1 rounded-md">
        {category}
      </div>
    </div>
    <div className="p-5">
      <div className="text-sm text-gray-500 mb-2">{date}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#2B5273]">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
      <div className="text-[#2B5273] font-medium text-sm group-hover:underline">
        Read report →
      </div>
    </div>
  </Link>
);

// Filter button component
const FilterButton = ({ 
  active, 
  label, 
  onClick 
}: { 
  active: boolean; 
  label: string; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      active 
        ? 'bg-[#2B5273] text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

// Market insight component
const MarketInsight = ({ 
  title, 
  value, 
  change, 
  trend 
}: { 
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down' | 'neutral';
}) => {
  const trendColor = trend === 'up' 
    ? 'text-green-600' 
    : trend === 'down' 
      ? 'text-red-600' 
      : 'text-gray-500';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className={`flex items-center mt-1 text-sm ${trendColor}`}>
        {trend === 'up' && (
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )}
        {trend === 'down' && (
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        {trend === 'neutral' && (
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        )}
        {change}
      </div>
    </div>
  );
};

export default function MarketReportsPage() {
  const [activeFiltersetActiveFilter] = useState('all');

  // Market reports data
  const reports = [
    {
      id: 'q1-2024-market-review',
      title: 'Q1 2024 Irish Property Market Review',
      date: 'April 15, 2024',
      description: 'A comprehensive analysis of Ireland\'s property market performance in the first quarter of 2024, including price trends, transaction volumes, and regional variations.',
      image: '/images/resources/q1-market-review.jpg',
      category: 'Quarterly Report',
      href: '/resources/market-reports/q1-2024-market-review',
      type: 'report'
    },
    {
      id: 'new-homes-survey-2024',
      title: '2024 New Homes Market Survey',
      date: 'March 10, 2024',
      description: 'Detailed insights into Ireland\'s new homes sector, covering development trends, buyer preferences, and future pipeline projections.',
      image: '/images/resources/new-homes-survey.jpg',
      category: 'Annual Report',
      href: '/resources/market-reports/new-homes-survey-2024',
      type: 'report'
    },
    {
      id: 'rental-market-analysis',
      title: 'Irish Rental Market Analysis H1 2024',
      date: 'April 3, 2024',
      description: 'An in-depth examination of rental trends, price movements, and supply-demand dynamics across Ireland\'s residential rental sector.',
      image: '/images/resources/rental-market.jpg',
      category: 'Market Analysis',
      href: '/resources/market-reports/rental-market-analysis-h1-2024',
      type: 'analysis'
    },
    {
      id: 'regional-property-barometer',
      title: 'Regional Property Barometer - Spring 2024',
      date: 'March 25, 2024',
      description: 'A detailed comparison of property market performance across different regions of Ireland, highlighting emerging hotspots and local market dynamics.',
      image: '/images/resources/regional-barometer.jpg',
      category: 'Regional Report',
      href: '/resources/market-reports/regional-property-barometer-spring-2024',
      type: 'report'
    },
    {
      id: 'investment-market-outlook',
      title: 'Property Investment Market Outlook 2024',
      date: 'February 8, 2024',
      description: 'Forward-looking analysis of investment trends, yield performance, and strategic opportunities in Ireland\'s residential and commercial property sectors.',
      image: '/images/resources/investment-outlook.jpg',
      category: 'Investment',
      href: '/resources/market-reports/investment-market-outlook-2024',
      type: 'forecast'
    },
    {
      id: 'sustainable-housing-report',
      title: 'Sustainable Housing Report 2024',
      date: 'March 15, 2024',
      description: 'Analysis of green building practices, energy efficiency standards, and the growing importance of sustainability in Ireland\'s housing market.',
      image: '/images/resources/sustainable-housing.jpg',
      category: 'Sustainability',
      href: '/resources/market-reports/sustainable-housing-report-2024',
      type: 'analysis'
    },
    {
      id: 'first-time-buyer-index',
      title: 'First-Time Buyer Affordability Index - Q1 2024',
      date: 'April 5, 2024',
      description: 'Tracking affordability metrics for first-time buyers across Ireland, including city-by-city comparisons and financing trends.',
      image: '/images/resources/ftb-index.jpg',
      category: 'Affordability',
      href: '/resources/market-reports/first-time-buyer-index-q1-2024',
      type: 'index'
    },
    {
      id: 'housing-policy-impact',
      title: 'Impact Assessment: Recent Housing Policy Changes',
      date: 'February 20, 2024',
      description: 'Analysis of how recent government housing policies have affected the market, with forecasts on future impacts and recommendations.',
      image: '/images/resources/policy-impact.jpg',
      category: 'Policy Analysis',
      href: '/resources/market-reports/housing-policy-impact-assessment-2024',
      type: 'analysis'
    }
  ];

  // Filter reports based on active filter
  const filteredReports = activeFilter === 'all' 
    ? reports 
    : reports.filter(report => report.type === activeFilter);

  // Latest market insights
  const marketInsights = [
    {
      title: 'National House Price Growth',
      value: '+2.7%',
      change: '2.7% year-on-year',
      trend: 'up' as const
    },
    {
      title: 'Average Dublin Property Price',
      value: '€428,500',
      change: '1.5% quarter-on-quarter',
      trend: 'up' as const
    },
    {
      title: 'Mortgage Approval Rate',
      value: '3,845',
      change: '5.2% month-on-month',
      trend: 'up' as const
    },
    {
      title: 'Average Rent (National)',
      value: '€1,642',
      change: '8.9% year-on-year',
      trend: 'up' as const
    },
    {
      title: 'New Housing Completions',
      value: '7,554',
      change: '0.8% quarter-on-quarter',
      trend: 'down' as const
    },
    {
      title: 'Months of Supply (National)',
      value: '3.2',
      change: '0.2 months since Q4 2023',
      trend: 'down' as const
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/resources" className="text-gray-500 hover:text-gray-700">
              Resources
            </Link>
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <span className="text-gray-900 font-medium">Market Reports</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Property Market Reports & Analysis
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Access our comprehensive collection of property market reports, research, and data analytics.
        </p>
      </header>

      {/* Latest market insights */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Market Insights</h2>
          <span className="text-sm text-gray-500">Last updated: April 15, 2024</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {marketInsights.map((insightindex: any) => (
            <MarketInsight
              key={index}
              title={insight.title}
              value={insight.value}
              change={insight.change}
              trend={insight.trend}
            />
          ))}
        </div>
      </section>

      {/* Featured report */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-[#2B5273] to-[#3D7DA5] rounded-xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 text-white">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">Featured Report</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Q1 2024 Irish Property Market Review</h2>
              <p className="text-white/80 mb-6">
                Get a comprehensive overview of Ireland's property market performance in Q1 2024. 
                Our in-depth analysis covers price trends, transaction volumes, and regional variations.
              </p>
              <Link 
                href="/resources/market-reports/q1-2024-market-review" 
                className="inline-flex items-center px-6 py-3 bg-white text-[#2B5273] rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Read the Report
                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <Image 
                src="/images/resources/featured-report.jpg" 
                alt="Q1 2024 Market Review" 
                fill 
                className="object-cover" 
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <FilterButton 
          active={activeFilter === 'all'} 
          label="All Reports" 
          onClick={() => setActiveFilter('all')} 
        />
        <FilterButton 
          active={activeFilter === 'report'} 
          label="Market Reports" 
          onClick={() => setActiveFilter('report')} 
        />
        <FilterButton 
          active={activeFilter === 'analysis'} 
          label="Market Analysis" 
          onClick={() => setActiveFilter('analysis')} 
        />
        <FilterButton 
          active={activeFilter === 'forecast'} 
          label="Forecasts & Outlook" 
          onClick={() => setActiveFilter('forecast')} 
        />
        <FilterButton 
          active={activeFilter === 'index'} 
          label="Indices & Tracking" 
          onClick={() => setActiveFilter('index')} 
        />
      </div>

      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {filteredReports.map((report: any) => (
          <ReportCard 
            key={report.id}
            title={report.title}
            date={report.date}
            description={report.description}
            image={report.image}
            category={report.category}
            href={report.href}
          />
        ))}
      </div>

      {/* Research subscription */}
      <section className="bg-gray-50 rounded-xl p-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Subscribe to Our Research</h2>
            <p className="text-gray-600 mb-4">
              Get our latest market reports, analysis and insights delivered directly to your inbox. 
              Stay informed with our property market research, published monthly.
            </p>
          </div>
          <div className="md:w-1/3">
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:ring-[#2B5273] focus:border-[#2B5273]"
                required
              />
              <button
                type="submit"
                className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Custom research services */}
      <section className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Custom Research Services</h2>
            <p className="text-gray-600 mb-4">
              Need specialized research for your property investment decisions? Our research team can provide 
              tailored market analysis, location assessments, and detailed forecasting to meet your specific needs.
            </p>
            <Link 
              href="/contact?service=research"
              className="inline-flex items-center px-6 py-3 bg-[#2B5273] text-white rounded-md font-medium hover:bg-[#1E3142] transition-colors"
            >
              Inquire About Custom Research
            </Link>
          </div>
          <div className="md:w-1/3 relative h-48 w-full md:h-64">
            <Image 
              src="/images/resources/custom-research.jpg" 
              alt="Custom Research Services" 
              fill 
              className="object-cover rounded-lg" 
            />
          </div>
        </div>
      </section>
    </div>
  );
} 