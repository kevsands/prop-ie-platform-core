'use client';

import React from 'react';

/**
 * Simplified First-Time Buyer Profile Setup Page
 * For build purposes
 */
export default function BuyerProfileSetupPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">First-Time Buyer Profile Setup</h1>
          <p className="text-gray-500">Provide your details to help us guide you through your home buying journey</p>
        </div>

        <form>
          <div className="space-y-6">
            {/* Journey Phase */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Your Buying Journey</h2>
                <p className="text-gray-500 text-sm">Select the phase of your home buying journey</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex flex-col items-center space-y-2 border rounded-md p-4 bg-blue-50 border-blue-200">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  </div>
                  <label className="font-medium">Planning</label>
                  <p className="text-xs text-center text-gray-500">Starting to consider buying a home</p>
                </div>

                <div className="flex flex-col items-center space-y-2 border rounded-md p-4 hover:bg-gray-50">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  <label className="font-medium">Financing</label>
                  <p className="text-xs text-center text-gray-500">Arranging mortgage or savings</p>
                </div>

                <div className="flex flex-col items-center space-y-2 border rounded-md p-4 hover:bg-gray-50">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  <label className="font-medium">Searching</label>
                  <p className="text-xs text-center text-gray-500">Actively viewing properties</p>
                </div>

                <div className="flex flex-col items-center space-y-2 border rounded-md p-4 hover:bg-gray-50">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  <label className="font-medium">Buying</label>
                  <p className="text-xs text-center text-gray-500">Made an offer or completing</p>
                </div>

                <div className="flex flex-col items-center space-y-2 border rounded-md p-4 hover:bg-gray-50">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  <label className="font-medium">Moved In</label>
                  <p className="text-xs text-center text-gray-500">Already purchased a property</p>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Financial Information</h2>
                <p className="text-gray-500 text-sm">This helps us calculate what you can afford</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Annual Household Income (€)</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="e.g. 60000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Available Deposit/Savings (€)</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="e.g. 30000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium">Credit Score Estimate</label>
                    <span className="text-sm">700</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full w-3/4"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Maximum Budget (€)</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="e.g. 300000"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Your Preferences</h2>
                <p className="text-gray-500 text-sm">Tell us what you're looking for</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Property Types (select all that apply)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <label>Apartment</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked className="rounded" />
                      <label>House</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <label>Duplex</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <label>Townhouse</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Bedrooms Needed</label>
                  <select className="w-full p-2 border rounded">
                    <option>1 Bedroom</option>
                    <option selected>2 Bedrooms</option>
                    <option>3 Bedrooms</option>
                    <option>4+ Bedrooms</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Preferred Locations</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Dublin, Cork, Galway"
                    value="Dublin"
                  />
                </div>
              </div>
            </div>

            {/* Government Schemes */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Government Schemes</h2>
                <p className="text-gray-500 text-sm">Select any schemes you're interested in or eligible for</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <input type="checkbox" checked className="mt-1" />
                  <div>
                    <label className="font-medium">Help to Buy Scheme</label>
                    <p className="text-xs text-gray-500">Tax rebate for first-time buyers of newly built homes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <label className="font-medium">First Homes Scheme</label>
                    <p className="text-xs text-gray-500">Helps bridge the gap between your mortgage and the price of your new home</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <label className="font-medium">Shared Ownership</label>
                    <p className="text-xs text-gray-500">Buy a share of a property and pay rent on the remaining share</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <label className="font-medium">Mortgage Guarantee</label>
                    <p className="text-xs text-gray-500">Government-backed 95% mortgage loans</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button 
                type="button" 
                className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Create Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}