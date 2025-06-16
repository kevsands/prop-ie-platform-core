"use client";

import React from 'react';
import Link from 'next/link';

const HeroWithCarousel: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[550px] md:h-[600px] overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Property
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover premium developments across Ireland with our innovative property platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/developments"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Developments
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroWithCarousel;