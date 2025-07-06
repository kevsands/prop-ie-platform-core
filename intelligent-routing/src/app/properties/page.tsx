/**
 * Properties Overview Page
 * Main hub for property-related navigation
 */
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { developmentsService } from '@/lib/services/developments-prisma';

export const metadata: Metadata = {
  title: 'Properties | Prop.ie',
  description: 'Browse our property developments and find your perfect home',
};

// Property categories/sections for navigation
const propertyCategories = [
  {
    title: 'New Developments',
    description: 'Explore our latest residential developments across Ireland',
    href: '/developments',
    image: '/images/developments/fitzgerald-gardens.jpg',
    stats: '3 Active Projects',
    featured: true,
  },
  {
    title: 'Available Units',
    description: 'Browse all available properties for sale',
    href: '/properties/available',
    image: '/images/properties/apartment1.jpg',
    stats: '24 Properties',
  },
  {
    title: 'Property Search',
    description: 'Find your perfect home with our advanced search',
    href: '/properties/search',
    image: '/images/properties/villa1.jpg',
    stats: 'Search All',
  },
  {
    title: 'First-Time Buyers Hub',
    description: 'Step-by-step journey, guides, and exclusive tools for first-time buyers. Discover how Prop.ie makes buying your first home easier.',
    href: '/first-time-buyers',
    image: '/images/properties/10-maple-ave-1.jpg',
    stats: 'Start Here',
  },
];

// Transform database development to display format for featured section
function transformDevelopmentForFeatured(dev: any) {
  return {
    id: dev.id,
    name: dev.name,
    location: dev.location,
    status: 'Now Selling', // Default status
    startingPrice: `€${(dev.startingPrice || 300000).toLocaleString()}`,
    image: dev.mainImage || '/images/development-placeholder.jpg',
  };
}

export default async function PropertiesPage() {
  // Fetch developer-managed developments for featured section
  const dbDevelopments = await developmentsService.getDevelopments({ isPublished: true });
  const featuredDevelopments = dbDevelopments.map(transformDevelopmentForFeatured);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Your Dream Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Explore our premium property developments across Ireland
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/developments"
                className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                View All Developments
              </Link>
              <Link
                href="/properties/search"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                Search Properties
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Property Categories Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Browse Properties
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {propertyCategories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className={`
                  group relative overflow-hidden rounded-xl shadow-lg 
                  transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                  ${category.featured ? 'md:col-span-2 md:row-span-2' : ''}
                `}
              >
                <div className="relative h-64 md:h-full min-h-[256px]">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold">{category.title}</h3>
                    {category.stats && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                        {category.stats}
                      </span>
                    )}
                  </div>
                  <p className="text-white/90">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Featured Developments */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Developments
              </h2>
              <p className="text-xl text-gray-600">
                Our latest and most popular residential projects
              </p>
            </div>

            {featuredDevelopments.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No developments available</h3>
                <p className="text-gray-600">Check back soon for new developments.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredDevelopments.map((development) => (
                  <Link
                    key={development.id}
                    href={`/developments/${development.id}`}
                    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-64">
                      <Image
                        src={development.image}
                        alt={development.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`
                          px-3 py-1 rounded-full text-sm font-semibold text-white
                          ${development.status === 'Selling Fast' ? 'bg-red-500' : ''}
                          ${development.status === 'Coming Soon' ? 'bg-blue-500' : ''}
                          ${development.status === 'Now Selling' ? 'bg-green-500' : ''}
                        `}>
                          {development.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {development.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{development.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Starting from</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {development.startingPrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/developments"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Developments
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Help Finding Your Perfect Home?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Our property experts are here to guide you through every step
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Our Team
            </Link>
            <Link
              href="/resources/property-guides"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Property Guides
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}