'use client';

import React from 'react';

/**
 * Property Search Page - Simplified Stub
 */
export default function PropertySearchPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Property Search</h1>
      <p className="text-gray-600 mb-6">
        Find your dream home by searching through our available properties.
      </p>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by location, development name, or property type..."
            className="w-full px-4 py-2 pl-10 border rounded-lg"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Property Card 1 */}
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="h-48 bg-gray-200 relative">
            <img 
              src="/images/developments/fitzgerald-gardens/3bed-House.jpeg" 
              alt="Fitzgerald Gardens - Type A"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
              BER: A2
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg">Fitzgerald Gardens - Type A</h3>
            <p className="text-gray-500 text-sm mb-2">Fitzgerald Gardens, Dublin</p>

            <div className="flex justify-between items-center mb-3">
              <div className="text-xl font-bold">€375,000</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>3 bed</span>
                <span>2 bath</span>
                <span>110 m²</span>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">
              View Details
            </button>
          </div>
        </div>

        {/* Property Card 2 */}
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="h-48 bg-gray-200 relative">
            <img 
              src="/images/developments/fitzgerald-gardens/2bed-house.jpeg" 
              alt="Fitzgerald Gardens - Type B"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
              BER: A3
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg">Fitzgerald Gardens - Type B</h3>
            <p className="text-gray-500 text-sm mb-2">Fitzgerald Gardens, Dublin</p>

            <div className="flex justify-between items-center mb-3">
              <div className="text-xl font-bold">€325,000</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>2 bed</span>
                <span>2 bath</span>
                <span>85 m²</span>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">
              View Details
            </button>
          </div>
        </div>

        {/* Property Card 3 */}
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="h-48 bg-gray-200 relative">
            <img 
              src="/images/developments/Ballymakenny-View/HouseType A.jpg" 
              alt="Ballymakenny View - Type A"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
              BER: A2
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg">Ballymakenny View - Type A</h3>
            <p className="text-gray-500 text-sm mb-2">Ballymakenny View, Louth</p>

            <div className="flex justify-between items-center mb-3">
              <div className="text-xl font-bold">€395,000</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>4 bed</span>
                <span>3 bath</span>
                <span>140 m²</span>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}