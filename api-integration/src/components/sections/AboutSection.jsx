// @/components/sections/AboutSection.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section aria-labelledby="about-us-heading" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 id="about-us-heading" className="text-3xl font-bold text-gray-900 mb-6">About Property Developments</h2>
            <p className="text-lg text-gray-600 mb-4">
              With over 25 years of experience in the Irish property market, we're committed to creating
              exceptional homes in thriving communities across Drogheda and the surrounding areas.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our developments are built to the highest standards, combining quality craftsmanship,
              sustainable design and thoughtful planning to create homes that our customers love. We prioritize
              locations with excellent amenities and connectivity.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-[#2B5273] font-medium hover:underline transition-colors group"
            >
              Learn more about us
              <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.02]">
            <Image
              src="/images/about-image-placeholder.jpg"
              alt="Our projects overview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect width='8' height='5' fill='%23cccccc'/%3E%3C/svg%3E"
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;