'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Guide card component with image, title, excerpt, and link
const GuideCard = ({ 
  slug, 
  title, 
  excerpt, 
  image, 
  category,
  readTime,
  href
}: { 
  slug: string; 
  title: string; 
  excerpt: string; 
  image: string;
  category: string;
  readTime: string;
  href?: string;
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
    <div className="relative h-48 overflow-hidden">
      <Image 
        src={image} 
        alt={title}
        fill
        className="object-cover transition-transform hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute top-4 left-4 bg-[#2B5273] text-white text-xs px-2 py-1 rounded-md">
        {category}
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{readTime} read</span>
        <Link href={href || `/resources/property-guides/${slug}`} className="text-[#2B5273] font-medium text-sm hover:underline">
          Read more →
        </Link>
      </div>
    </div>
  </div>
);

// Category card component
const CategoryCard = ({ title, description, icon, href }: { title: string; description: string; icon: string; href: string }) => (
  <Link
    href={href}
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all flex items-start"
  >
    <div className="p-3 rounded-full bg-blue-50 text-[#2B5273] mr-4">
      <span className="text-2xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  </Link>
);

export default function PropertyGuidesPage() {
  // Featured guides data
  const featuredGuides = [
    {
      slug: 'buy-off-plan',
      title: 'Buy Off-Plan Online: The Complete Digital Guide',
      excerpt: 'Discover how to buy your new home off-plan entirely online with digital contracts, secure payments, and instant reservation.',
      image: '/images/resources/buy-off-plan.jpg',
      category: 'Buying',
      readTime: '12 min',
      href: '/resources/buy-off-plan'
    },
    {
      slug: 'first-time-buyer-guide',
      title: 'Complete Guide for First-Time Buyers in Ireland',
      excerpt: 'Everything you need to know about purchasing your first home in Ireland, from saving for a deposit to closing the deal.',
      image: '/images/resources/first-time-buyer.jpg',
      category: 'Buying',
      readTime: '15 min'
    },
    {
      slug: 'help-to-buy-explained',
      title: 'Help-to-Buy Scheme: A Comprehensive Explanation',
      excerpt: 'Learn about the Help-to-Buy incentive, how it works, who qualifies, and how to maximize your tax rebate for a new home purchase.',
      image: '/images/resources/help-to-buy.jpg',
      category: 'Finance',
      readTime: '12 min'
    }
  ];

  // Guide categories
  const categories = [
    {
      title: 'Buying Guides',
      description: 'Essential guides for property buyers at any stage',
      icon: '🏠',
      href: '/resources/property-guides/buying'
    },
    {
      title: 'Selling Guides',
      description: 'Advice for selling your property efficiently',
      icon: '💰',
      href: '/resources/property-guides/selling'
    },
    {
      title: 'Investment Guides',
      description: 'Maximize your property investment returns',
      icon: '📈',
      href: '/resources/property-guides/investment'
    },
    {
      title: 'First-Time Buyers',
      description: 'Special guides for those buying their first home',
      icon: '🔑',
      href: '/resources/property-guides/first-time-buyers'
    },
    {
      title: 'Legal & Finance',
      description: 'Understanding the financial and legal aspects',
      icon: '⚖️',
      href: '/resources/property-guides/legal-finance'
    },
    {
      title: 'Area Guides',
      description: 'Detailed information about different areas in Ireland',
      icon: '🗺️',
      href: '/resources/property-guides/area-guides'
    }
  ];

  // Recent guides data
  const recentGuides = [
    {
      slug: 'mortgage-approval-process',
      title: 'Navigating the Mortgage Approval Process in 2024',
      excerpt: 'A step-by-step guide to securing mortgage approval in the current financial climate with tips to improve your chances.',
      image: '/images/resources/mortgage-approval.jpg',
      category: 'Finance',
      readTime: '14 min'
    },
    {
      slug: 'understanding-ber-ratings',
      title: 'Understanding BER Ratings and Energy Efficiency',
      excerpt: 'A complete explanation of Building Energy Ratings, their importance, and how they impact property value and running costs.',
      image: '/images/resources/ber-ratings.jpg',
      category: 'Property',
      readTime: '8 min'
    },
    {
      slug: 'negotiating-property-price',
      title: 'Expert Tips for Negotiating Property Prices',
      excerpt: 'Learn effective negotiation strategies to get the best possible price when buying a property in a competitive market.',
      image: '/images/resources/negotiation.jpg',
      category: 'Buying',
      readTime: '11 min'
    },
    {
      slug: 'stamp-duty-explained',
      title: 'Stamp Duty in Ireland: Complete Guide',
      excerpt: 'Everything you need to know about stamp duty, including current rates, exemptions, and how to calculate your liability.',
      image: '/images/resources/stamp-duty.jpg',
      category: 'Legal',
      readTime: '9 min'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Property Guides</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive guides and expert advice to help you navigate every step of your property journey.
        </p>
      </div>

      {/* Categories section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Guides by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((categoryindex) => (
            <CategoryCard 
              key={index}
              title={category.title}
              description={category.description}
              icon={category.icon}
              href={category.href}
            />
          ))}
        </div>
      </section>

      {/* Featured guides section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Guides</h2>
          <Link href="/resources/property-guides/all" className="text-[#2B5273] hover:underline">
            View all guides →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredGuides.map((guideindex) => (
            <GuideCard 
              key={index}
              slug={guide.slug}
              title={guide.title}
              excerpt={guide.excerpt}
              image={guide.image}
              category={guide.category}
              readTime={guide.readTime}
              href={guide.href}
            />
          ))}
        </div>
      </section>

      {/* Recent guides section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recently Published</h2>
          <Link href="/resources/property-guides/all" className="text-[#2B5273] hover:underline">
            View all guides →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentGuides.map((guideindex) => (
            <GuideCard 
              key={index}
              slug={guide.slug}
              title={guide.title}
              excerpt={guide.excerpt}
              image={guide.image}
              category={guide.category}
              readTime={guide.readTime}
            />
          ))}
        </div>
      </section>

      {/* Newsletter signup */}
      <section className="mt-16 bg-blue-50 rounded-xl p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter to receive the latest property guides, market insights, and expert advice.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:ring-[#2B5273] focus:border-[#2B5273]"
              required
            />
            <button
              type="submit"
              className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            By subscribing, you agree to our Privacy Policy and consent to receive property-related emails.
          </p>
        </div>
      </section>
    </div>
  );
} 