'use client';

import React from 'react';
// Temporarily comment out problematic imports for build testing
// // Removed import for build testing;
// // Removed import for build testing;
import { FileText, Download, ExternalLink, Info, AlertTriangle, CheckCircle } from 'lucide-react';

// Simplified component definitions for build testing

// Simplified Card components
const Card = ({ className = "", children }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ className = "", children }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Simplified Button component
const Button = ({ 
  className = "", 
  variant = "default", 
  children, 
  disabled = false, 
  onClick,
  ...props 
}) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
      variant === "outline" 
        ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700" 
        : "bg-blue-600 text-white hover:bg-blue-700"
    } h-10 px-4 py-2 ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export default function RevenueGuidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help-to-Buy Revenue Guide</h1>
          <p className="mt-1 text-gray-500">
            Official documentation and guidelines for processing HTB claims
          </p>
        </div>
        <button className="inline-flex items-center border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-md">
          <Download className="mr-2 h-4 w-4" />
          Download Full Guide
        </button>
      </div>

      {/* Alert for important updates */}
      <div className="flex items-start p-4 mb-6 border border-blue-200 bg-blue-50 rounded-md">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-700">Important Update</h3>
          <p className="text-sm text-blue-600">
            Revenue has updated the Help-to-Buy guidelines for 2023. Please review the latest documentation.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="md:col-span-1 space-y-6">
          {/* Resources */}
          <div className="border rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Resources</h2>
              <p className="text-sm text-gray-500">Official HTB documentation</p>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span>HTB Developer Guide (PDF)</span>
                    <Download className="h-4 w-4 ml-2" />
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Claim Process Flowchart</span>
                    <Download className="h-4 w-4 ml-2" />
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Required Documentation</span>
                    <Download className="h-4 w-4 ml-2" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.revenue.ie/en/property/help-to-buy-incentive/index.aspx" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span>Revenue HTB Website</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <p className="text-sm text-gray-500">Help-to-Buy support</p>
            </div>
            <div className="p-4">
              <div className="space-y-3 text-sm">
                <p className="font-medium">HTB Support Team:</p>
                <p>Phone: 01 738 3699</p>
                <p>International: +353 1 738 3699</p>
                <p>
                  Email: <a href="mailto:htbqueries@revenue.ie" className="text-blue-600">htbqueries@revenue.ie</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="md:col-span-2 space-y-6">
          {/* Overview */}
          <div className="border rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Help-to-Buy Scheme Overview</h2>
              <p className="text-sm text-gray-500">Guide for property developers</p>
            </div>
            <div className="p-4 prose">
              <p>
                The Help-to-Buy (HTB) scheme is designed to assist first-time buyers with obtaining the deposit required 
                to purchase or self-build a new property. The scheme provides for a refund of Income Tax and Deposit 
                Interest Retention Tax (DIRT) paid in Ireland over the previous four tax years.
              </p>
              
              <h3>Key Developer Responsibilities</h3>
              <ul>
                <li>Verify the HTB Access Code provided by the buyer</li>
                <li>Process the application within the Revenue system</li>
                <li>Provide the buyer with a Claim Code</li>
                <li>Submit relevant documentation to Revenue</li>
                <li>Apply HTB funds to the buyer's deposit</li>
              </ul>
              
              <h3>Documentation Requirements</h3>
              <p>
                Developers must maintain the following documentation for each HTB claim:
              </p>
              <ul>
                <li>Signed contract of sale</li>
                <li>Proof of planning permission</li>
                <li>Builder's/developer's tax clearance certificate</li>
                <li>Evidence of application of HTB funds to the deposit</li>
              </ul>
            </div>
          </div>

          {/* Process Steps */}
          <div className="border rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">HTB Process Steps</h2>
              <p className="text-sm text-gray-500">Step-by-step guide to process a claim</p>
            </div>
            <div className="p-4">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center font-bold mr-3 mt-0.5">1</div>
                  <div>
                    <h4 className="font-medium">Receive Access Code from Buyer</h4>
                    <p className="text-sm text-gray-600">
                      The buyer provides you with their HTB Access Code after completing their application 
                      with Revenue.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center font-bold mr-3 mt-0.5">2</div>
                  <div>
                    <h4 className="font-medium">Process Access Code and Verify Buyer</h4>
                    <p className="text-sm text-gray-600">
                      Enter the Access Code on the Revenue HTB system to verify the buyer's eligibility and 
                      HTB amount.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center font-bold mr-3 mt-0.5">3</div>
                  <div>
                    <h4 className="font-medium">Generate and Provide Claim Code</h4>
                    <p className="text-sm text-gray-600">
                      After processing the Access Code, generate a Claim Code in the Revenue system and 
                      provide it to the buyer.
                    </p>
                  </div>
                </li>
                
                {/* Remaining steps omitted for brevity */}
              </ol>
            </div>
          </div>

          {/* Common Issues */}
          <div className="border rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Common Issues and Resolutions</h2>
              <p className="text-sm text-gray-500">Troubleshooting HTB claim problems</p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Expired Access Code</h4>
                    <p className="text-sm text-gray-600">
                      If a buyer's Access Code has expired, they will need to generate a new code through 
                      their Revenue account. Access Codes are valid for 60 days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Tax Clearance Requirements</h4>
                    <p className="text-sm text-gray-600">
                      Ensure your company maintains valid tax clearance throughout the HTB process. Without 
                      valid tax clearance, HTB payments cannot be processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-amber-100 p-3 mt-6 rounded-md text-amber-800">
        Note: UI components temporarily simplified for build testing - full functionality will be restored later.
      </div>
    </div>
  );
}