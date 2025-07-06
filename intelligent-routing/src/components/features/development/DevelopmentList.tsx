'use client';

import React from 'react';
import Link from 'next/link';
import { Development } from '@/types/developments';

interface DevelopmentListProps {
  developments: Development[];
  title?: string;
  subtitle?: string;
}

const DevelopmentList = ({ 
  developments, 
  title = "Our Communities", 
  subtitle = "Discover our premium new developments in Drogheda" 
}: DevelopmentListProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-4 text-xl text-gray-600">
            {subtitle}
          </p>
        </div>
        
        {/* Development Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {developments.map((development) => (
            <Link 
              key={development.id}
              href={`/developments/${development.id}`} 
              className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={development.image} 
                  alt={development.name} 
                  className="w-full h-full object-cover rounded-t-lg"
                />
                {development.status && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md uppercase">
                    {development.status}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{development.name}</h3>
                <p className="text-gray-600 mb-3">{development.description}</p>
                
                <div className="flex items-center text-gray-500 mb-4">
                  <svg className="h-5 w-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{development.location}</span>
                </div>
                
                {development.priceRange && (
                  <div className="text-blue-600 font-semibold mb-4">
                    {development.priceRange}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {development.bedrooms && (
                    <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                      <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      {Array.isArray(development.bedrooms) 
                        ? `${Math.min(...development.bedrooms)}-${Math.max(...development.bedrooms)} Bed` 
                        : `${development.bedrooms} Bed`}
                    </div>
                  )}
                  
                  {development.bathrooms && (
                    <div className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                      <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {development.availability ? development.availability.split(' ')[development.availability.split(' ').length - 1] : "Available Now"}
                    </div>
                  )}
                  
                  {development.energyRating && (
                    <div className="inline-flex items-center bg-green-100 px-3 py-1 rounded-full text-sm text-green-700">
                      <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      BER {development.energyRating}
                    </div>
                  )}
                </div>
                
                <div className="text-blue-600 font-medium group-hover:underline flex items-center">
                  View Development
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/developments"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-300"
          >
            View All Developments
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DevelopmentList;