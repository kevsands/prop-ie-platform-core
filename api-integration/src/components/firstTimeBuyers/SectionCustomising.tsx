import React from 'react';

export default function SectionCustomising() {
  return (
    <section id="customising" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-[#1E3142] mb-4">Customising</h2>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl">Make your new home truly yours. With Prop Choice, you can select finishes, extras, and upgrades—easily and transparently, all online.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Process</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Limited or unclear customisation options</li>
            <li>Manual paperwork and back-and-forth with agents</li>
            <li>Uncertainty about deadlines and availability</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#2B5273] mb-2">How Prop.ie Makes It Better</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Prop Choice: interactive configurator for finishes, extras, and upgrades</li>
            <li>Clear T&Cs, cut-off dates, and real-time availability</li>
            <li>All choices managed online, with instant confirmation</li>
            <li>Visual previews of your selections</li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <a href="/customisation" className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] font-medium transition-colors inline-block">Learn About Customisation</a>
      </div>
    </section>
  );
} 