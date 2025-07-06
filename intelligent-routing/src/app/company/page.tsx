'use client';

import React from 'react';
import Link from 'next/link';

export default function CompanyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Company</h1>
      <p className="text-lg text-gray-700 mb-8">
        Learn more about Prop.ie, our mission, our team, and how we're transforming 
        the property industry in Ireland.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">About Us</h2>
          <p className="text-gray-600 mb-4">
            Discover our story, mission, and vision for the future of property in Ireland.
          </p>
          <Link
            href="/company/about"
            className="text-[#2B5273] flex items-center font-medium hover:text-[#1E3142]"
          >
            Learn more 
            <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            Get in touch with our team to learn more about our services or discuss potential partnerships.
          </p>
          <Link
            href="/company/contact"
            className="text-[#2B5273] flex items-center font-medium hover:text-[#1E3142]"
          >
            Contact us 
            <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Careers</h2>
          <p className="text-gray-600 mb-4">
            Join our team of property and technology experts and help shape the future of real estate.
          </p>
          <Link
            href="/company/careers"
            className="text-[#2B5273] flex items-center font-medium hover:text-[#1E3142]"
          >
            View opportunities 
            <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Testimonials</h2>
          <p className="text-gray-600 mb-4">
            See what our clients and partners have to say about working with Prop.ie.
          </p>
          <Link
            href="/company/testimonials"
            className="text-[#2B5273] flex items-center font-medium hover:text-[#1E3142]"
          >
            Read testimonials 
            <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 