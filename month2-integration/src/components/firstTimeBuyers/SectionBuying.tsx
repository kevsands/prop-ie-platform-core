import React from 'react';

export default function SectionBuying() {
  return (
    <section id="buying" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-[#1E3142] mb-4">Buying</h2>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl">Secure your new home with confidence. Prop.ie transforms the traditional buying process, making it faster, safer, and more transparent for first-time buyers.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Process</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Make an offer and pay a booking deposit</li>
            <li>Wait for paperwork and legal pack</li>
            <li>Unclear timelines and limited transparency</li>
            <li>Manual KYC/AML checks and document collection</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#2B5273] mb-2">How Prop.ie Makes It Better</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Secure a call option (your right to buy, subject to contract, with a 30-day window to sign)</li>
            <li>Booking deposit held safely by our trusted agent</li>
            <li>Instant KYC/AML checks and secure document upload</li>
            <li>Unlock the full legal pack after deposit</li>
            <li>Full transparency: see all documents, all parties, all steps</li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <a href="/properties/search" className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] font-medium transition-colors inline-block">Start Buying Process</a>
      </div>
    </section>
  );
} 