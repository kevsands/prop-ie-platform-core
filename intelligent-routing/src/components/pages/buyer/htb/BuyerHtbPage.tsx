"use client";

import React from 'react';
import { useHTB } from "@/context/HTBContext";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from 'src/components/layout/AppLayout';

export default function HTBClaim() {
  const [propertyId, setPropertyId] = useState("1"); // Default to first property
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ppsNumber, setPpsNumber] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [claimAmount, setClaimAmount] = useState(30000);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { submitClaim } = useHTB();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate form
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !ppsNumber ||
      !propertyAddress
    ) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Validate PPS number format (example: 1234567T)
    const ppsRegex = /^\d{7}[A-Z]$/;
    if (!ppsRegex.test(ppsNumber)) {
      setError("Please enter a valid PPS number (format: 1234567T)");
      setIsLoading(false);
      return;
    }

    try {
      // Only pass propertyId and requestedAmount to submitClaim
      await submitClaim({
        propertyId,
        requestedAmount: claimAmount,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/buyer/htb/status");
      }, 2000);
    } catch (err) {
      setError("An error occurred while submitting your claim");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Help-to-Buy Claim
          </h1>
          <p className="mt-2 text-gray-600">
            Submit your Help-to-Buy claim to avail of the tax rebate for
            first-time buyers.
          </p>
        </div>
        
        {/* Navigation Pills for HTB Functionality */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/buyer/htb"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
            >
              Submit Claim
            </Link>
            <Link
              href="/buyer/htb/calculator"
              className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50"
            >
              HTB Calculator
            </Link>
            <Link
              href="/buyer/htb/status"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Check Status
            </Link>
            <a
              href="https://www.revenue.ie/en/property/help-to-buy-incentive/index.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center"
            >
              Revenue Website
              <svg 
                className="h-4 w-4 ml-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {success ? (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your Help-to-Buy claim has been submitted successfully!
                  Redirecting to status page...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Property Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Details about the property you're purchasing.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="propertyId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Select Property
                    </label>
                    <select
                      id="propertyId"
                      name="propertyId"
                      value={propertyId}
                      onChange={(e) => setPropertyId(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="1">Maple Heights - Unit 101</option>
                      <option value="2">Maple Heights - Unit 102</option>
                      <option value="3">Oak Residences - Unit A1</option>
                      <option value="4">Oak Residences - Unit A2</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="propertyAddress"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Property Address
                    </label>
                    <input
                      type="text"
                      name="propertyAddress"
                      id="propertyAddress"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="claimAmount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Claim Amount (€)
                    </label>
                    <input
                      type="number"
                      name="claimAmount"
                      id="claimAmount"
                      min="0"
                      max="30000"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(parseInt(e.target.value))}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Maximum claim amount is €30,000
                    </p>
                    <p className="mt-2 text-sm text-blue-600">
                      <Link href="/buyer/htb/calculator" className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Use calculator to estimate your relief
                      </Link>
                    </p>
                  </div>

                  <div className="sm:col-span-3">
                    <div className="flex items-start mt-6">
                      <div className="flex items-center h-5">
                        <input
                          id="isFirstTimeBuyer"
                          name="isFirstTimeBuyer"
                          type="checkbox"
                          checked={isFirstTimeBuyer}
                          onChange={(e) =>
                            setIsFirstTimeBuyer(e.target.checked)
                          }
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="isFirstTimeBuyer"
                          className="font-medium text-gray-700"
                        >
                          I confirm this is my first home purchase
                        </label>
                        <p className="text-gray-500">
                          You must be a first-time buyer to qualify for the
                          Help-to-Buy scheme
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Personal Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your personal details for the Help-to-Buy claim.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="ppsNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      PPS Number
                    </label>
                    <input
                      type="text"
                      name="ppsNumber"
                      id="ppsNumber"
                      value={ppsNumber}
                      onChange={(e) => setPpsNumber(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="1234567T"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Format: 7 digits followed by a letter
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Declaration
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    By submitting this form, you confirm that all information
                    provided is accurate and complete.
                  </p>
                </div>
                <div className="mt-5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? "Submitting..." : "Submit Help-to-Buy Claim"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
