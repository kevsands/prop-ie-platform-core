import React from 'react';

export default function SectionLegal() {
  return (
    <section id="legal" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-[#1E3142] mb-4">Legal & Contracts</h2>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl">Navigate the legal process with confidence. Prop.ie brings all parties together on one platform, giving you full transparency and control.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Process</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Manual document exchange between solicitors</li>
            <li>Unclear timelines and responsibilities</li>
            <li>Little visibility for buyers</li>
            <li>Slow, paper-based process</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#2B5273] mb-2">How Prop.ie Makes It Better</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>All legal documents exchanged via Prop platform</li>
            <li>Real-time status tracker for every step</li>
            <li>All parties (buyerssellerssolicitors) on-platform</li>
            <li>Instant notifications and full transparency</li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <a href="/resources/legal-process" className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] font-medium transition-colors inline-block">Learn About Legal Process</a>
      </div>
    </section>
  );
} 