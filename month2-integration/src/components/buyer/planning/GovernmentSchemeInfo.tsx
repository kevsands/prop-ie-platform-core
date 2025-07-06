'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Info, 
  AlertCircle, 
  ChevronDown, 
  CheckCircle, 
  ExternalLink,
  FileText
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  maxAmount: string;
  deadline?: string;
  website: string;
  icon: React.ReactNode;
}

export default function GovernmentSchemeInfo() {
  const [expandedScheme, setExpandedScheme] = useState<string | null>('htb');
  
  const schemes: Scheme[] = [
    {
      id: 'htb',
      name: 'Help to Buy (HTB)',
      description: 'The Help to Buy (HTB) incentive is a scheme for first-time buyers that helps you with the deposit needed to buy or build a new house or apartment.',
      eligibility: [
        'You must be a first-time buyer',
        'The property must be newly built, or you must build it yourself',
        'The property value must not exceed €500,000',
        'The loan-to-value ratio must be more than 70%',
        'You must live in the property as your main home for at least 5 years'
      ],
      benefits: [
        'Tax rebate of up to €30,000 or 10% of the purchase price (whichever is lower)',
        'Can be used towards your deposit',
        'Reduces the amount you need to save'
      ],
      maxAmount: '€30,000',
      website: 'https://www.revenue.ie/en/property/help-to-buy-incentive/index.aspx',
      icon: <Award className="h-6 w-6 text-emerald-600" />
    },
    {
      id: 'fthb',
      name: 'First Home Scheme',
      description: 'The First Home Scheme is a shared equity scheme aimed at helping first-time buyers with the cost of purchasing newly built homes.',
      eligibility: [
        'You must be a first-time buyer',
        'You must get a mortgage from a participating bank',
        'You must have the maximum mortgage available (3.5 times income)',
        'The property must be newly built by an approved developer',
        'There are price ceilings depending on your location'
      ],
      benefits: [
        'The State and participating banks pay up to 30% of the cost of your new home',
        'Reduces the deposit and mortgage you need',
        'You own 100% of your home from the beginning',
        'You can buy back the stake at any time'
      ],
      maxAmount: '30% of property value',
      website: 'https://www.firsthomescheme.ie/',
      icon: <Home className="h-6 w-6 text-blue-600" />
    },
    {
      id: 'lda',
      name: 'Local Authority Affordable Purchase Scheme',
      description: 'Local authorities make homes available at reduced prices to eligible first-time buyers, with the authority retaining a percentage equity stake in the home.',
      eligibility: [
        'You must meet income criteria set by your local authority',
        'You must be a first-time buyer in most cases',
        'Priority may be given to those living or working in the area',
        'Different local authorities may have different rules'
      ],
      benefits: [
        'Purchase homes at prices lower than market rates',
        'The local authority retains a stake in the property',
        "Option to buy out the local authority's stake over time"
      ],
      maxAmount: 'Varies by location and scheme',
      website: 'https://www.housingagency.ie/housing-information/affordable-housing-schemes',
      icon: <Building className="h-6 w-6 text-purple-600" />
    },
    {
      id: 'rebuilding',
      name: 'Rebuilding Ireland Home Loan',
      description: 'A government-backed mortgage for first-time buyers available through local authorities at reduced interest rates.',
      eligibility: [
        'You must be a first-time buyer',
        'Your annual gross income must not exceed €65,000 for a single person or €75,000 for a couple',
        'You must have proof of being declined or insufficiently offered mortgage finance by two banks',
        'The property must be within certain price limits based on location'
      ],
      benefits: [
        'Fixed interest rates for the full term of the mortgage',
        'Rates as low as 2.745% fixed for up to 30 years',
        'Up to 90% of the market value of the property'
      ],
      maxAmount: 'Up to €288,000 depending on location',
      website: 'https://rebuildingirelandhomeloan.ie/',
      icon: <Home className="h-6 w-6 text-green-600" />
    }
  ];

  const toggleScheme = (schemeId: string) => {
    if (expandedScheme === schemeId) {
      setExpandedScheme(null);
    } else {
      setExpandedScheme(schemeId);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center mb-2">
          <Award className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-semibold">Government Support Schemes</h2>
        </div>
        <p className="text-blue-100">
          Financial assistance programs to help first-time buyers get on the property ladder
        </p>
      </div>
      
      <div className="p-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="compare">Compare Schemes</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility Check</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Important Note</p>
                  <p>Government schemes may change over time. Always check the official websites for the most up-to-date information and requirements.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {schemes.map(scheme => (
                <div 
                  key={scheme.id} 
                  className="border rounded-lg overflow-hidden transition-all duration-200"
                >
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleScheme(scheme.id)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        {scheme.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{scheme.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {scheme.description}
                        </p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        expandedScheme === scheme.id ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </div>
                  
                  {expandedScheme === scheme.id && (
                    <div className="px-4 pb-4 pt-2 border-t">
                      <p className="text-gray-700 mb-4">{scheme.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Eligibility Criteria</h4>
                          <ul className="space-y-1">
                            {scheme.eligibility.map((item, index) => (
                              <li key={index} className="flex items-start text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits</h4>
                          <ul className="space-y-1">
                            {scheme.benefits.map((item, index) => (
                              <li key={index} className="flex items-start text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700">
                          Max Amount: {scheme.maxAmount}
                        </div>
                        {scheme.deadline && (
                          <div className="bg-amber-50 px-3 py-1 rounded-full text-amber-700">
                            Deadline: {scheme.deadline}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <a 
                          href={scheme.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          Visit Official Website <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                        
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" /> Download Guide
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="compare">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheme
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      For First-Time Buyers
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      New Build Only
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max. Support
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Income Limits
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">Help to Buy (HTB)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      €30,000 or 10%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      No
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">First Home Scheme</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      30% of value
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      No
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">Local Authority Purchase</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">Varies</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Varies
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">Rebuilding Ireland Loan</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">No</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      €288,000
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="eligibility">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Find Out Which Schemes You Qualify For</p>
                  <p>Answer a few questions to see which government schemes you may be eligible for. This is a guide only - always check official sources for full eligibility criteria.</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Are you a first-time buyer?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="firstTime" value="yes" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="firstTime" value="no" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Are you interested in a new build property?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="newBuild" value="yes" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="newBuild" value="no" className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What is your approximate annual household income?
                  </label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>Under €50,000</option>
                    <option>€50,000 - €75,000</option>
                    <option>€75,000 - €100,000</option>
                    <option>Over €100,000</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What price range are you considering?
                  </label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>Under €250,000</option>
                    <option>€250,000 - €350,000</option>
                    <option>€350,000 - €500,000</option>
                    <option>Over €500,000</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">
                    Check My Eligibility
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Potential Eligibility</h3>
                <p className="text-gray-500 text-sm mb-6">Complete the form to see which schemes you might qualify for.</p>
                
                <div className="space-y-3">
                  <div className="flex items-center opacity-50">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-gray-500">?</span>
                    </div>
                    <span className="text-gray-400">Help to Buy (HTB)</span>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-gray-500">?</span>
                    </div>
                    <span className="text-gray-400">First Home Scheme</span>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-gray-500">?</span>
                    </div>
                    <span className="text-gray-400">Local Authority Affordable Purchase</span>
                  </div>
                  
                  <div className="flex items-center opacity-50">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-gray-500">?</span>
                    </div>
                    <span className="text-gray-400">Rebuilding Ireland Home Loan</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 border-t pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Need Help Understanding These Schemes?</h3>
          <p className="text-sm text-gray-600 mb-4">Our team can guide you through the various government schemes and help you determine which ones are right for your situation.</p>
          
          <div className="flex space-x-4">
            <Button variant="outline">
              Schedule Consultation
            </Button>
            <Button variant="outline">
              Download Full Guide
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Home(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function Building(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}