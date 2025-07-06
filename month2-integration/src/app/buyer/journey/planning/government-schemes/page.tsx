'use client';

import React from 'react';
import { ExternalLink, Info, CheckCircle, AlertTriangle, Calculator } from 'lucide-react';
import Link from 'next/link';

// Define Card and Button components inline for consistency
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

export default function GovernmentSchemesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-blue-900">Government Schemes for First-Time Buyers</h1>
        <p className="text-gray-600 mb-8">
          Learn about the various government programs and incentives available to help you purchase your first home in Ireland.
        </p>

        {/* Help to Buy Scheme */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">€</span>
              </div>
              <h2 className="text-2xl font-semibold">Help-to-Buy Scheme</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="mb-4">
              The Help-to-Buy (HTB) incentive is a tax rebate designed to help first-time buyers get the deposit needed to buy or build a new home.
            </p>
            
            <div className="mb-6 space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Tax Rebate for First-Time Buyers</h3>
                  <p className="text-sm text-gray-600">
                    You can claim back income tax and DIRT paid over the previous four tax years, up to a maximum of €30,000 or 10% of the purchase price of a new home.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Eligibility Requirements</h3>
                  <p className="text-sm text-gray-600">
                    You must be a first-time buyer, buying or building a new property as your principal residence, and have a mortgage of at least 70% of the purchase price.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Important Consideration</h3>
                  <p className="text-sm text-gray-600">
                    The scheme only applies to new builds or self-builds, not to second-hand properties.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Enhanced Relief</h3>
                  <p className="text-sm text-gray-600">
                    The enhanced HTB relief has been extended until the end of 2024, allowing first-time buyers to claim up to €30,000 (instead of the standard €20,000).
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.revenue.ie/en/property/help-to-buy-incentive/index.aspx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Official Revenue Website
              </a>
              
              <a 
                href="https://www.revenue.ie/en/property/help-to-buy-incentive/check-if-you-are-eligible.aspx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Calculator className="h-4 w-4 mr-1" /> Eligibility Checker
              </a>
              
              <Link href="/buyer/htb-application">
                <Button variant="outline" size="sm">HTB Application Guide</Button>
              </Link>
            </div>
          </div>
        </Card>
        
        {/* First Home Scheme */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-green-600 p-6 text-white">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">🏠</span>
              </div>
              <h2 className="text-2xl font-semibold">First Home Scheme</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="mb-4">
              The First Home Scheme is a shared equity scheme where the Government and participating banks pay up to 30% of the cost of a new home in return for a stake in the property.
            </p>
            
            <div className="mb-6 space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Bridging the Affordability Gap</h3>
                  <p className="text-sm text-gray-600">
                    The scheme helps bridge the gap between your mortgage, deposit, and the price of your new home by taking a percentage stake (up to 30%) in your property.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Eligibility Requirements</h3>
                  <p className="text-sm text-gray-600">
                    You must be a first-time buyer, take out a mortgage with a participating lender, and have a deposit of at least 10% of the property price.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Important Consideration</h3>
                  <p className="text-sm text-gray-600">
                    You'll need to buy back the stake over time, and the cost will rise and fall with the value of your home.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Property Price Caps</h3>
                  <p className="text-sm text-gray-600">
                    Price caps apply based on location - €475,000 in Dublin, €400,000 in Cork, Galway, Limerick, and Waterford, and €350,000 elsewhere.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.firsthomescheme.ie/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Official Website
              </a>
              
              <a 
                href="https://www.firsthomescheme.ie/calculator/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Calculator className="h-4 w-4 mr-1" /> Equity Calculator
              </a>
              
              <Link href="/buyer/first-home-scheme-guide">
                <Button variant="outline" size="sm">FHS Application Guide</Button>
              </Link>
            </div>
          </div>
        </Card>
        
        {/* Local Authority Home Loan */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-purple-600 p-6 text-white">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">💼</span>
              </div>
              <h2 className="text-2xl font-semibold">Local Authority Home Loan</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="mb-4">
              The Local Authority Home Loan is a government-backed mortgage for first-time buyers and fresh start applicants who may not be able to get sufficient funding from commercial banks.
            </p>
            
            <div className="mb-6 space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Government-Backed Mortgage</h3>
                  <p className="text-sm text-gray-600">
                    Fixed interest rates for the full term of the mortgage, which can be up to 30 years, providing certainty on repayments.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Eligibility Requirements</h3>
                  <p className="text-sm text-gray-600">
                    You must be a first-time buyer or fresh start applicant (certain exceptions apply), be aged between 18-70, and have an annual gross income below €65,000 for a single person or €75,000 for a couple.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Important Consideration</h3>
                  <p className="text-sm text-gray-600">
                    The loan can be used for both new and second-hand properties, as well as for self-builds.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Property Price Caps</h3>
                  <p className="text-sm text-gray-600">
                    Maximum property prices: €320,000 in Cork, Dublin, Galway, Kildare, Louth, Meath, and Wicklow; €250,000 in other counties.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://localauthorityhomeloan.ie/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Official Website
              </a>
              
              <a 
                href="https://localauthorityhomeloan.ie/eligibility/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Calculator className="h-4 w-4 mr-1" /> Eligibility Checker
              </a>
              
              <Link href="/buyer/local-authority-loan-guide">
                <Button variant="outline" size="sm">Application Guide</Button>
              </Link>
            </div>
          </div>
        </Card>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Need Help Choosing?</h3>
          <p className="text-blue-700 mb-4">
            Not sure which government scheme is right for you? Our team can help you navigate the options and understand which might be most beneficial for your specific situation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact">
              <Button>Contact Our Team</Button>
            </Link>
            <Link href="/buyer/planning/checklist">
              <Button variant="outline">Back to Checklist</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}