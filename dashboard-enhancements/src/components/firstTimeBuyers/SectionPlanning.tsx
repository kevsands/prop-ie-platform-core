import React from 'react';

export default function SectionPlanning() {
  return (
    <section id="planning" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-[#1E3142] mb-4">Planning</h2>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl">Start your home buying journey with confidence. Learn how to budget, set your goals, and understand the steps ahead—then see how Prop.ie makes it all easier.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Process</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Research the market and set your budget</li>
            <li>Understand your needs and priorities</li>
            <li>Prepare a timeline for your move</li>
            <li>Gather information on grants and schemes</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#2B5273] mb-2">How Prop.ie Makes It Better</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Interactive budget planner and timeline generator</li>
            <li>Personalized checklists and reminders</li>
            <li>Access to expert guides and resources</li>
            <li>Transparent, step-by-step journey overview</li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <button className="bg-[#2B5273] text-white px-6 py-3 rounded-md hover:bg-[#1E3142] font-medium transition-colors">Download Planning Checklist</button>
      </div>
    </section>
  );
} 