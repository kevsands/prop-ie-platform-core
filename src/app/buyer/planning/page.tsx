'use client';

import React from 'react';
import { CheckSquare, FileText, HelpCircle, PiggyBank } from 'lucide-react';
import Link from 'next/link';

// Define Card and Button components inline since imports are problematic
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className || ''}`}>
    {children}
  </div>
);

const Button = ({ 
  className, 
  children, 
  variant = 'default',
  size = 'default',
  onClick
}: { 
  className?: string; 
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm';
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      rounded-md font-medium transition-colors
      ${size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base'}
      ${variant === 'outline' 
        ? 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50' 
        : 'bg-blue-600 text-white hover:bg-blue-700'}
      ${className || ''}
    `}
  >
    {children}
  </button>
);

export default function BuyerPlanningPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-blue-900">First-Time Buyer Planning</h1>
          <p className="text-gray-600">
            Plan your home buying journey with our comprehensive tools and resources.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Readiness Checklist Card */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <CheckSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Readiness Checklist</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Track your progress towards buying your first home with our interactive checklist. We'll guide you through the essential steps to prepare for homeownership.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Financial readiness assessment</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Document preparation guide</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Market research recommendations</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Step-by-step buying preparation</span>
                </div>
              </div>
              <Link href="/buyer/planning/checklist">
                <Button className="w-full">View Checklist</Button>
              </Link>
            </div>
          </Card>

          {/* Budget Calculator Card */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <PiggyBank className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Budget Calculator</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Calculate how much you can afford to spend on a property based on your income, expenses, and savings.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Estimate your mortgage capacity</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Calculate monthly repayments</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Plan for additional home buying costs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Visualize different financing scenarios</span>
                </div>
              </div>
              <Link href="/buyer/planning/budget-calculator">
                <Button variant="outline" className="w-full">Calculate Budget</Button>
              </Link>
            </div>
          </Card>

          {/* Government Schemes Card */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <HelpCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">Government Schemes</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Learn about the various government programs and incentives available to first-time buyers in Ireland.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Help-to-Buy scheme explained</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">First Home Scheme details</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Rebuilding Ireland Home Loan</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Eligibility calculators and guides</span>
                </div>
              </div>
              <Link href="/buyer/journey/planning/government-schemes">
                <Button variant="outline" className="w-full">Explore Schemes</Button>
              </Link>
            </div>
          </Card>

          {/* Guides & Resources Card */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-xl font-semibold">Guides & Resources</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Access comprehensive guides, articles, and resources to help you navigate the home buying process with confidence.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Step-by-step buying process guide</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Understanding mortgage types</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Property viewing checklist</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-100 flex-shrink-0 mr-2"></div>
                  <span className="text-sm">Legal process explained</span>
                </div>
              </div>
              <Link href="/buyer/resources">
                <Button variant="outline" className="w-full">View Resources</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}