import React from 'react';
import HelpToBuyCalculator from '@/components/calculators/HelpToBuyCalculator';

export default function HelpToBuyCalculatorPage() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#2B5273]">Help-to-Buy Calculator</h1>
          <p className="text-gray-600">
            Calculate your potential Help-to-Buy relief based on your property price and tax history.
            This tool helps you understand how much you could receive under the scheme.
          </p>
        </div>
        
        <HelpToBuyCalculator />
        
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-3 text-[#2B5273]">Next Steps</h2>
          <p className="text-gray-600 mb-4">
            After calculating your potential Help-to-Buy amount, you can:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Apply for the Help-to-Buy scheme through the Revenue website</li>
            <li>Include your HTB approval in your mortgage application</li>
            <li>Use our <a href="/buyer/htb" className="text-blue-600 hover:underline">Help-to-Buy application guide</a> for step-by-step assistance</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 