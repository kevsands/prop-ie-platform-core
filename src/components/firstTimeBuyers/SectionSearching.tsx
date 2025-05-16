import React from 'react';

export default function SectionSearching() {
  return (
    <section id="searching" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-[#1E3142] mb-4">Searching</h2>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl">Find your perfect home with ease. Prop.ie gives you access to the best new developments and properties, with tools to help you search smarter and act faster.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Process</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Browse property portals and agent websites</li>
            <li>Book viewings by phone or email</li>
            <li>Wait for agent responses</li>
            <li>Limited information and slow updates</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#2B5273] mb-2">How Prop.ie Makes It Better</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Instantly browse all available developments and properties</li>
            <li>Book viewings online or take virtual tours</li>
            <li>Real-time availability and updates</li>
            <li>Transparent, direct communication with developers and agents</li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <a href="/properties/search" className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] font-medium transition-colors inline-block">Browse Properties</a>
      </div>
    </section>
  );
} 