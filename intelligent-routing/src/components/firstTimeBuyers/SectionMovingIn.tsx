import React from 'react';

export default function SectionMovingIn() {
  return (
    <section id="moving" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-[#1E3142] mb-4">Moving In</h2>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl">Get ready for the big day! Prop.ie keeps you updated on progress and makes moving in seamless, with digital tools and real support.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Process</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Uncertain timelines for completion</li>
            <li>Manual snag list and issue reporting</li>
            <li>Little post-sale support</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#2B5273] mb-2">How Prop.ie Makes It Better</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Track construction progress in your dashboard</li>
            <li>Digital snag list and support tickets</li>
            <li>All post-sale maintenance managed through the Prop app</li>
            <li>Personalized moving-in checklist</li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <a href="/resources/moving-in" className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] font-medium transition-colors inline-block">Learn About Moving In</a>
      </div>
    </section>
  );
} 