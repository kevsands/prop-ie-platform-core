'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { purchaseAPI } from "@/api";
import { getNumericId } from "@/utils/paramValidator";
import Link from "next/link";

interface PurchaseDetail {
  id: string;
  property: {
    id: string;
    name: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
  };
  status: string;
  bookingDate: string;
  bookingDeposit: number;
  bookingDepositPaid: boolean;
  bookingDepositDate?: string;
  documents: Array<{
    type: string;
    filename: string;
    path: string;
    uploadDate: string;
    status: string;
    notes?: string;
  }>
  );
  contractIssued: boolean;
  contractIssuedDate?: string;
  contractSigned: boolean;
  contractSignedDate?: string;
  complianceStatus: string;
  complianceNotes?: string;
  mortgageApproved: boolean;
  mortgageApprovedDate?: string;
  closingDate?: string;
  completionDate?: string;
  totalPrice: number;
  notes?: string;
}

const PurchaseDetail: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = getNumericId(searchParams); // Will throw error if missing/invalid

  const [purchasesetPurchase] = useState<PurchaseDetail | null>(null);
  const [loadingsetLoading] = useState(true);
  const [errorsetError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await purchaseAPI.getPurchase(id!.toString());

        if (response.success) {
          // Transform API data to match component state
          const purchaseData = response.data;
          setPurchase({
            id: purchaseData._id,
            property: {
              id: purchaseData.property._id,
              name: purchaseData.property.name,
              price: purchaseData.property.price,
              bedrooms: purchaseData.property.bedrooms,
              bathrooms: purchaseData.property.bathrooms,
              area: purchaseData.property.area,
              images: purchaseData.property.images || [
                "/placeholder-property.jpg"]},
            status: purchaseData.status,
            bookingDate: new Date(
              purchaseData.bookingDate,
            ).toLocaleDateString(),
            bookingDeposit: purchaseData.bookingDeposit,
            bookingDepositPaid: purchaseData.bookingDepositPaid,
            bookingDepositDate: purchaseData.bookingDepositDate
              ? new Date(purchaseData.bookingDepositDate).toLocaleDateString()
              : undefined,
            documents: purchaseData.documents
              ? purchaseData.documents.map((doc: any) => ({
                  type: doc.type,
                  filename: doc.filename,
                  path: doc.path,
                  uploadDate: new Date(doc.uploadDate).toLocaleDateString(),
                  status: doc.status,
                  notes: doc.notes}))
              : [],
            contractIssued: purchaseData.contractIssued,
            contractIssuedDate: purchaseData.contractIssuedDate
              ? new Date(purchaseData.contractIssuedDate).toLocaleDateString()
              : undefined,
            contractSigned: purchaseData.contractSigned,
            contractSignedDate: purchaseData.contractSignedDate
              ? new Date(purchaseData.contractSignedDate).toLocaleDateString()
              : undefined,
            complianceStatus: purchaseData.complianceStatus,
            complianceNotes: purchaseData.complianceNotes,
            mortgageApproved: purchaseData.mortgageApproved,
            mortgageApprovedDate: purchaseData.mortgageApprovedDate
              ? new Date(purchaseData.mortgageApprovedDate).toLocaleDateString()
              : undefined,
            closingDate: purchaseData.closingDate
              ? new Date(purchaseData.closingDate).toLocaleDateString()
              : undefined,
            completionDate: purchaseData.completionDate
              ? new Date(purchaseData.completionDate).toLocaleDateString()
              : undefined,
            totalPrice: purchaseData.totalPrice,
            notes: purchaseData.notes});
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch purchase details");

      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [id]);

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

  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case "id":
        return "Identification";
      case "address":
        return "Proof of Address";
      case "mortgage":
        return "Mortgage Approval";
      case "helpToBuy":
        return "Help to Buy";
      case "solicitor":
        return "Solicitor Details";
      case "contract":
        return "Signed Contract";
      case "compliance":
        return "Compliance Document";
      case "other":
        return "Other Document";
      default:
        return type;
    }
  };

  const getDocumentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            <button
              onClick={() => router.back()}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Purchase not found</p>
        <button
          onClick={() => router.back()}
          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Purchase Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Property: {purchase.property.name}
          </p>
        </div>
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(purchase.status)}`}
        >
          {getStatusText(purchase.status)}
        </span>
      </div>

      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Property</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img
                    className="h-10 w-10 rounded-md object-cover"
                    src={purchase.property.images[0]}
                    alt={purchase.property.name}
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {purchase.property.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {purchase.property.bedrooms} bed •{" "
                    {purchase.property.bathrooms} bath •{" "
                    {purchase.property.area} m²
                  </div>
                </div>
              </div>
            </dd>
          </div>

          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Price</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              €{purchase.totalPrice.toLocaleString()}
            </dd>
          </div>

          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Booking Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {purchase.bookingDate}
            </dd>
          </div>

          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Booking Deposit
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              €{purchase.bookingDeposit.toLocaleString()}
              {purchase.bookingDepositPaid ? (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Paid on {purchase.bookingDepositDate}
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              )}
            </dd>
          </div>

          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Contract Status
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {purchase.contractIssued ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                  Issued on {purchase.contractIssuedDate}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                  Not Issued
                </span>
              )}

              {purchase.contractSigned ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Signed on {purchase.contractSignedDate}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Not Signed
                </span>
              )}
            </dd>
          </div>

          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Compliance Status
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  purchase.complianceStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : purchase.complianceStatus === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {purchase.complianceStatus === "completed"
                  ? "Completed"
                  : purchase.complianceStatus === "in-progress"
                    ? "In Progress"
                    : "Pending"
              </span>
              {purchase.complianceNotes && (
                <p className="mt-1 text-sm text-gray-500">
                  {purchase.complianceNotes}
                </p>
              )}
            </dd>
          </div>

          {purchase.mortgageApproved !== undefined && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Mortgage Status
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase.mortgageApproved ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Approved on {purchase.mortgageApprovedDate}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Approval
                  </span>
                )}
              </dd>
            </div>
          )}

          {purchase.closingDate && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Closing Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase.closingDate}
              </dd>
            </div>
          )}

          {purchase.completionDate && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Completion Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase.completionDate}
              </dd>
            </div>
          )}

          {purchase.notes && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {purchase.notes}
              </dd>
            </div>
          )}

          <div className="bg-gray-50 px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Documents
              </h3>
              <Link href={`/buyer/purchase/${purchase.id}/upload`}>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload Document
                </button>
              </Link>
            </div>

            {purchase.documents.length> 0 ? (
              <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {purchase.documents.map((documentindex: any) => (
                  <div
                    key={index}
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="h-10 w-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={document.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus:outline-none"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">
                          {document.filename}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {getDocumentTypeText(document.type)}
                        </p>
                        <div className="mt-1 flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusBadgeClass(document.status)}`}
                          >
                            {document.status.charAt(0).toUpperCase() +
                              document.status.slice(1)}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {document.uploadDate}
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-white rounded-lg border border-gray-200">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No documents
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by uploading a document.
                </p>
                <div className="mt-6">
                  <Link href={`/buyer/purchase/${purchase.id}/upload`}>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Upload Document
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </dl>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <Link href="/buyer/dashboard">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PurchaseDetail;
