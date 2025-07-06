import React from 'react';

export default function SectionAftercare() {
  return (
    <section id="aftercare" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-[#1E3142] mb-4">Aftercare</h2>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl">Enjoy peace of mind after you move in. Prop.ie offers digital support, transparent maintenance tracking, and a dedicated team to help with anything you need.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Process</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Manual issue reporting and follow-up</li>
            <li>Unclear warranty and support process</li>
            <li>Little visibility on maintenance progress</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#2B5273] mb-2">How Prop.ie Makes It Better</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Digital support and maintenance requests</li>
            <li>Transparent tracking of all issues and resolutions</li>
            <li>Dedicated aftercare team and resources</li>
            <li>All documentation and warranties in your dashboard</li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <a href="/resources/aftercare" className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] font-medium transition-colors inline-block">Learn About Aftercare</a>
      </div>
    </section>
  );
} 