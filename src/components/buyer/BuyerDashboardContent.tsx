import React from 'react';
'use client';

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

// Define an interface for the User type
interface User {
  name?: string;
  email?: string;
  id?: string;
  // Add any other user properties you might need
}

// Type for the auth context
interface AuthContextType {
  user: User | null;
  // Add other auth context properties if needed
}

export default function BuyerDashboardContent() {
  const { user } = useAuth() as AuthContextType;

  return (
    <main className="min-h-screen p-6 md:p-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Buyer Dashboard</h1>
        <p className="text-gray-600">
          Welcome back{user?.name ? `, ${user.name}` : ""! Manage your property
          journey from here.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Help-to-Buy Status</h2>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-800">Approved</p>
              <p className="text-sm text-gray-600">€30,000</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/buyer/htb/status"
              className="text-blue-600 hover:underline text-sm"
            >
              View Details
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Property Customization</h2>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-blue-800">In Progress</p>
              <p className="text-sm text-gray-600">Maple Heights</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/buyer/customization"
              className="text-blue-600 hover:underline text-sm"
            >
              Continue Customization
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Transaction Status</h2>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-yellow-800">Contract Review</p>
              <p className="text-sm text-gray-600">With solicitor</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/buyer/transaction"
              className="text-blue-600 hover:underline text-sm"
            >
              View Transaction
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Your Property</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm font-medium">Reserved</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Completion</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Expected Handover</span>
                <span className="text-sm font-medium">June 2025</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Maple Heights</h3>
            <p className="text-gray-600 mb-4">Dublin, Ireland</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">€450,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">HTB Amount</p>
                <p className="font-medium">€30,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Size</p>
                <p className="font-medium">120 m²</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bedrooms/Bathrooms</p>
                <p className="font-medium">3 bed / 2 bath</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/buyer/property/1"
                className="text-blue-600 hover:underline"
              >
                View Property Details
              </Link>
              <Link
                href="/buyer/customization"
                className="text-blue-600 hover:underline"
              >
                Customize Property
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="h-full w-0.5 bg-green-500 mt-1"></div>
              </div>
              <div>
                <h3 className="font-medium">Property Reserved</h3>
                <p className="text-sm text-gray-500">March 5, 2025</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="h-full w-0.5 bg-green-500 mt-1"></div>
              </div>
              <div>
                <h3 className="font-medium">HTB Approved</h3>
                <p className="text-sm text-gray-500">March 15, 2025</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="h-full w-0.5 bg-gray-300 mt-1"></div>
              </div>
              <div>
                <h3 className="font-medium">Contract Review</h3>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Contract Signing</h3>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">
                  Closing & Handover
                </h3>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <Link
              href="/buyer/htb"
              className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              <div className="font-medium">Help-to-Buy</div>
              <div className="text-sm text-gray-500">
                Manage your HTB application
              </div>
            </Link>
            <Link
              href="/buyer/customization"
              className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              <div className="font-medium">Property Customization</div>
              <div className="text-sm text-gray-500">
                Personalize your new home
              </div>
            </Link>
            <Link
              href="/buyer/documents"
              className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              <div className="font-medium">Documents</div>
              <div className="text-sm text-gray-500">
                View and manage your documents
              </div>
            </Link>
            <Link
              href="/buyer/payments"
              className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
            >
              <div className="font-medium">Payments</div>
              <div className="text-sm text-gray-500">
                Track payments and schedule
              </div>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Need Assistance?
            </h3>
            <p className="text-sm text-blue-700 mb-2">
              Our team is here to help you with any questions about your
              property purchase.
            </p>
            <Link
              href="/buyer/support"
              className="text-sm text-blue-600 hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
