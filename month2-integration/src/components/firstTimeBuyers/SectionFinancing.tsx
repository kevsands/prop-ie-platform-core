import React from 'react';

export default function SectionFinancing() {
  return (
    <section id="financing" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-[#1E3142] mb-4">Financing</h2>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl">Understand your mortgage options, grants, and how to finance your first home. Prop.ie guides you through every step, with tools to make it easier.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Process</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Save for a deposit</li>
            <li>Apply for mortgage pre-approval</li>
            <li>Research government grants (HTB, First Home Scheme, etc.)</li>
            <li>Compare lenders and rates</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#2B5273] mb-2">How Prop.ie Makes It Better</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Integrated mortgage calculator and eligibility checker</li>
            <li>Step-by-step grant guidance</li>
            <li>Personalized financing recommendations (coming soon)</li>
            <li>Clear, jargon-free explanations</li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <a href="/resources/calculators/mortgage-calculator" className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] font-medium transition-colors inline-block">Try Mortgage Calculator</a>
      </div>
    </section>
  );
} 