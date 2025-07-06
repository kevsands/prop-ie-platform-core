'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { purchaseAPI } from "@/api";
import { getNumericId } from "@/utils/paramValidator";

const PurchaseInitiation: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = getNumericId(searchParams); // Will throw error if missing/invalid
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  const [depositAmount, setDepositAmount] = useState(10000);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(parseInt(e.target.value));
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      setError("You must accept the terms and conditions to proceed");
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=/property/purchase?id=${id}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await purchaseAPI.createPurchase({
        propertyId: id.toString(),
        bookingDeposit: depositAmount,
      });

      if (response.success) {
        setSuccess(true);
        setPurchaseId(response.data.id || response.data._id);

        // Redirect to dashboard after a delay
        setTimeout(() => {
          router.push("/buyer/dashboard");
        }, 5000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate purchase. Please try again.");
      console.error("Error initiating purchase:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Property Purchase Initiation
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Complete this form to begin the purchase process for this property.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border-t border-green-200 px-4 py-5 sm:px-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Purchase initiated successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your purchase has been initiated. Your booking reference is:{" "}
                    <strong>{purchaseId}</strong>
                  </p>
                  <p className="mt-2">
                    You will be redirected to your dashboard in a few seconds
                    where you can track the progress of your purchase and upload
                    required documents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label
                  htmlFor="depositAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Booking Deposit Amount (€)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="depositAmount"
                    id="depositAmount"
                    min="5000"
                    value={depositAmount}
                    onChange={handleDepositChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  The standard booking deposit is €10,000. This amount is
                  refundable as per our terms and conditions.
                </p>
              </div>

              <div className="mb-6">
                <fieldset>
                  <legend className="text-base font-medium text-gray-900">
                    Purchase Information
                  </legend>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={handleTermsChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="terms"
                          className="font-medium text-gray-700"
                        >
                          I accept the terms and conditions
                        </label>
                        <p className="text-gray-500">
                          I understand that this is a booking deposit to secure
                          the property and that I will need to complete the
                          purchase process, including document verification and
                          compliance checks.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !termsAccepted}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Initiate Purchase"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PurchaseInitiation;
