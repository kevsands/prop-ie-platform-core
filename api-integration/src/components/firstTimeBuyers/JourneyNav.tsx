import React from 'react';

const stages = [
  { id: 'planning', label: 'Planning', icon: '📝' },
  { id: 'financing', label: 'Financing', icon: '💶' },
  { id: 'searching', label: 'Searching', icon: '🔍' },
  { id: 'buying', label: 'Buying', icon: '🤝' },
  { id: 'customising', label: 'Customising', icon: '🎨' },
  { id: 'legal', label: 'Legal & Contracts', icon: '📜' },
  { id: 'moving', label: 'Moving In', icon: '🏠' },
  { id: 'aftercare', label: 'Aftercare', icon: '🔧' },
];

export default function JourneyNav() {
  return (
    <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100 py-3 mb-8">
      <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
        {stages.map(stage => (
          <li key={stage.id}>
            <a href={`#${stage.id}`} className="flex flex-col items-center text-sm font-medium text-gray-700 hover:text-[#1E3142] transition-colors">
              <span className="text-2xl mb-1">{stage.icon}</span>
              {stage.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
} 