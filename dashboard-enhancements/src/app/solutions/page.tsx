import React from 'react';
import Link from 'next/link';

export default function SolutionsPage() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
      {/* Home Buyers */}
      <div>
        <h2 className="text-lg font-bold mb-4">HOME BUYERS</h2>
        <ul className="space-y-3 mb-8">
          <li>
            <Link href="/first-time-buyers" className="font-semibold text-blue-900 hover:text-blue-600">First-Time Buyers</Link>
            <div className="text-gray-600 text-sm">Step-by-step digital journey, exclusive tools, and expert support</div>
          </li>
          <li>
            <Link href="/move-up" className="font-semibold text-blue-900 hover:text-blue-600">Move-Up Buyers</Link>
            <div className="text-gray-600 text-sm">Upgrade to your dream home with Prop.ie</div>
          </li>
          <li>
            <Link href="/resources/buy-off-plan" className="font-semibold text-blue-900 hover:text-blue-600">Buy Off-Plan Online</Link>
            <div className="text-gray-600 text-sm">How it works: digital contracts, secure payments, and instant reservation <Link href="/first-time-buyers" className="underline text-blue-600">Learn more</Link></div>
          </li>
        </ul>
        <h3 className="text-md font-bold mb-2 mt-6">PROP Choice</h3>
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="font-semibold text-blue-900 mb-1">Customise Your Home & Buy Furniture at Point of Sale</div>
          <div className="text-gray-700 text-sm mb-2">With PROP Choice, you can personalise your new home, select upgrades, and even buy furniture and extras—all added to your sales price and managed digitally at the point of sale.</div>
          <Link href="/customisation/how-it-works" className="text-blue-600 underline font-semibold">How Customisation Works</Link>
        </div>
      </div>
      {/* Investors */}
      <div>
        <h2 className="text-lg font-bold mb-4">INVESTORS</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/investors/professional" className="font-semibold text-blue-900 hover:text-blue-600">Professional Investors</Link>
            <div className="text-gray-600 text-sm">Portfolio management, calculators, and document templates</div>
          </li>
          <li>
            <Link href="/investors/institutional" className="font-semibold text-blue-900 hover:text-blue-600">Institutional Investors</Link>
            <div className="text-gray-600 text-sm">Bulk acquisition tools, data rooms, and market insights</div>
          </li>
        </ul>
      </div>
      {/* Developers & Professionals */}
      <div>
        <h2 className="text-lg font-bold mb-4">DEVELOPERS</h2>
        <ul className="space-y-3 mb-8">
          <li>
            <Link href="/solutions/developers" className="font-semibold text-blue-900 hover:text-blue-600">Developer Platform</Link>
            <div className="text-gray-600 text-sm">End-to-end development management, sales, and analytics</div>
          </li>
        </ul>
        <h2 className="text-lg font-bold mb-4">OTHER PROFESSIONALS</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/professionals/estate-agents" className="font-semibold text-blue-900 hover:text-blue-600">Estate Agents</Link>
            <div className="text-gray-600 text-sm">Property listing and management for developer projects</div>
          </li>
          <li>
            <Link href="/professionals/solicitors" className="font-semibold text-blue-900 hover:text-blue-600">Solicitors</Link>
            <div className="text-gray-600 text-sm">Legal and conveyancing tools for developer projects</div>
          </li>
          <li>
            <Link href="/professionals/architects" className="font-semibold text-blue-900 hover:text-blue-600">Architects & Engineers</Link>
            <div className="text-gray-600 text-sm">Design and planning resources for developer projects</div>
          </li>
        </ul>
      </div>
    </div>
  );
} 