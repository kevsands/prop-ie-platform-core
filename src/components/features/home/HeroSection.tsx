'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="relative bg-gray-900 h-[70vh]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E3142]/80 to-[#2B5273]/50">
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Communities for the next generation of home owners
          </h1>
          <p className="mt-4 text-xl text-white">
            Premium sustainable homes across Ireland with excellent connectivity
          </p>
          <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => router.push('/developments')}
              className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] transition-colors text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
            >
              Explore Developments
            </button>
            <button 
              onClick={() => router.push('/register')}
              className="bg-white text-[#2B5273] px-6 py-3 rounded-md hover:bg-gray-100 transition-colors text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Register Interest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;