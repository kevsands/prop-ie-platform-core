import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BuyingGuideRedirect() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-24">
      <div className="max-w-xl w-full text-center bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E3142] mb-4">First-Time Buyers Hub</h1>
        <p className="text-lg text-gray-700 mb-6">
          Looking for the best step-by-step guide to buying your first home? <br />
          <span className="font-semibold text-[#2B5273]">Prop.ie's new First-Time Buyers Hub</span> is your complete, up-to-date resource for every stage of the journey—planning, financing, searching, buying, customising, and more.
        </p>
        <Link href="/first-time-buyers">
          <button className="inline-flex items-center gap-2 bg-[#2B5273] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#1E3142] transition-colors text-lg">
            Go to First-Time Buyers Hub <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
        <p className="mt-8 text-gray-500 text-sm">
          This page has been replaced by our new, world-class First-Time Buyers Hub. <br />
          For all other property guides, visit our <Link href="/resources/property-guides" className="text-[#2B5273] underline">Property Guides</Link> section.
        </p>
      </div>
    </div>
  );
} 