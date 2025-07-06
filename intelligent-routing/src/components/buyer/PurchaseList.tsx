'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { purchaseAPI } from "../../api";
import Link from "next/link";

interface Purchase {
  id: string;
  property: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  status: string;
  bookingDate: string;
  bookingDepositPaid: boolean;
  contractIssued: boolean;
  contractSigned: boolean;
  complianceStatus: string;
}

const PurchaseList: React.FC = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await purchaseAPI.getBuyerPurchases();

        if (response.success) {
          // Transform API data to match component state
          const formattedPurchases = response.data.map((purchase: any) => ({
            id: purchase._id,
            property: {
              id: purchase.property._id,
              name: purchase.property.name,
              price: purchase.property.price,
              images: purchase.property.images || ["/placeholder-property.jpg"],
            },
            status: purchase.status,
            bookingDate: new Date(purchase.bookingDate).toLocaleDateString(),
            bookingDepositPaid: purchase.bookingDepositPaid,
            contractIssued: purchase.contractIssued,
            contractSigned: purchase.contractSigned,
            complianceStatus: purchase.complianceStatus,
          }));

          setPurchases(formattedPurchases);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch purchases");
        console.error("Error fetching purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "booking":
        return "bg-yellow-100 text-yellow-800";
      case "documents":
        return "bg-blue-100 text-blue-800";
      case "compliance":
        return "bg-purple-100 text-purple-800";
      case "approval":
        return "bg-indigo-100 text-indigo-800";
      case "closing":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "booking":
        return "Booking";
      case "documents":
        return "Document Collection";
      case "compliance":
        return "Compliance Check";
      case "approval":
        return "Approval";
      case "closing":
        return "Closing";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No purchases</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't made any property purchases yet.
        </p>
        <div className="mt-6">
          <Link href="/property">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Properties
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Your Property Purchases
      </h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {purchases.map((purchase) => (
            <li key={purchase.id}>
              <Link href={`/buyer/purchase/${purchase.id}`}>
                <div className="block hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-md object-cover"
                          src={purchase.property.images[0]}
                          alt={purchase.property.name}
                        />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {purchase.property.name}
                          </p>
                          <p className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="truncate">
                              €{purchase.property.price.toLocaleString()}
                            </span>
                          </p>
                          <p className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="truncate">
                              Booking Date: {purchase.bookingDate}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0 flex flex-col items-end">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(purchase.status)}`}
                      >
                        {getStatusText(purchase.status)}
                      </span>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        {purchase.bookingDepositPaid ? (
                          <span className="text-green-600 text-xs">
                            Deposit Paid
                          </span>
                        ) : (
                          <span className="text-yellow-600 text-xs">
                            Deposit Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PurchaseList;
