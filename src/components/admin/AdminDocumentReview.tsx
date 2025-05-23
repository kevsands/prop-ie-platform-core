'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface Document {
  id: string;
  type: string;
  filename: string;
  path: string;
  uploadDate: string;
  status: string;
  notes?: string;
  purchaseId: string;
  propertyName: string;
  buyerName: string;
}

const AdminDocumentReview: React.FC = () => {
  const { user } = useAuth();
  const [documentssetDocuments] = useState<Document[]>([]);
  const [loadingsetLoading] = useState(true);
  const [errorsetError] = useState<string | null>(null);
  const [selectedDocumentsetSelectedDocument] = useState<Document | null>(
    null,
  );
  const [reviewNotessetReviewNotes] = useState("");
  const [reviewStatussetReviewStatus] = useState("");
  const [reviewLoadingsetReviewLoading] = useState(false);
  const [reviewSuccesssetReviewSuccess] = useState(false);
  const [filtersetFilter] = useState("pending");

  // Mock API function - will be replaced with actual API call
  const fetchDocuments = async (status = "pending") => {
    // Simulate API call
    return new Promise<any>((resolve: any) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: "doc-1",
              type: "id",
              filename: "passport.pdf",
              path: "/documents/passport.pdf",
              uploadDate: new Date().toISOString(),
              status: "pending",
              purchaseId: "purchase-1",
              propertyName: "Fitzgerald Gardens - Unit 14",
              buyerName: "John Smith",
            {
              id: "doc-2",
              type: "address",
              filename: "utility_bill.pdf",
              path: "/documents/utility_bill.pdf",
              uploadDate: new Date(Date.now() - 86400000).toISOString(),
              status: "pending",
              purchaseId: "purchase-2",
              propertyName: "Ballymakennyview - Unit 8",
              buyerName: "Jane Doe",
            {
              id: "doc-3",
              type: "mortgage",
              filename: "mortgage_approval.pdf",
              path: "/documents/mortgage_approval.pdf",
              uploadDate: new Date(Date.now() - 172800000).toISOString(),
              status: "approved",
              purchaseId: "purchase-1",
              propertyName: "Fitzgerald Gardens - Unit 14",
              buyerName: "John Smith",
            {
              id: "doc-4",
              type: "solicitor",
              filename: "solicitor_details.pdf",
              path: "/documents/solicitor_details.pdf",
              uploadDate: new Date(Date.now() - 259200000).toISOString(),
              status: "rejected",
              notes:
                "Document is incomplete. Please provide full solicitor details.",
              purchaseId: "purchase-3",
              propertyName: "Fitzgerald Gardens - Unit 15",
              buyerName: "Robert Johnson"].filter((doc: any) => status === "all" || doc.status === status)});
      }, 1000);
    });
  };

  // Mock API function - will be replaced with actual API call
  const reviewDocument = async (
    documentId: string,
    status: string,
    notes: string,
  ) => {
    // Simulate API call
    return new Promise<any>((resolve: any) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: documentId,
            status,
            notes});
      }, 1500);
    });
  };

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetchDocuments(filter);

        if (response.success) {
          setDocuments(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch documents");

      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [filterreviewSuccess]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setReviewNotes(document.notes || "");
    setReviewStatus(document.status);
    setReviewSuccess(false);
  };

  const handleReviewNotesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReviewNotes(e.target.value);
  };

  const handleReviewStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setReviewStatus(e.target.value);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDocument) return;

    try {
      setReviewLoading(true);

      const response = await reviewDocument(
        selectedDocument.id,
        reviewStatus,
        reviewNotes,
      );

      if (response.success) {
        setReviewSuccess(true);

        // Update document in list
        setDocuments((prevDocs: any) =>
          prevDocs.map((doc: any) =>
            doc.id === selectedDocument.id
              ? { ...doc, status: reviewStatus, notes: reviewNotes }
              : doc,
          ),
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to review document");

    } finally {
      setReviewLoading(false);
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

  if (loading && documents.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && documents.length === 0) {
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

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Document Review
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Review and approve buyer documents for property purchases.
        </p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="mb-4">
          <label
            htmlFor="filter"
            className="block text-sm font-medium text-gray-700"
          >
            Filter Documents
          </label>
          <select
            id="filter"
            name="filter"
            value={filter}
            onChange={handleFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Documents</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 overflow-hidden">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Documents
            </h4>

            {documents.length> 0 ? (
              <div className="overflow-y-auto max-h-96 pr-2">
                <ul className="divide-y divide-gray-200">
                  {documents.map((document: any) => (
                    <li key={document.id}>
                      <button
                        onClick={() => handleDocumentSelect(document)}
                        className={`block w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none ${selectedDocument?.id === document.id ? "bg-blue-50" : ""`}
                      >
                        <div className="flex items-center">
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
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {document.filename}
                            </p>
                            <p className="text-xs text-gray-500">
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
                                {new Date(
                                  document.uploadDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
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
                  No documents match the selected filter.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedDocument ? (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Document Details
                </h4>

                {reviewSuccess && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          Document review submitted successfully!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-t-lg">
                  <dt className="text-sm font-medium text-gray-500">
                    Document Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {selectedDocument.filename}
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Document Type
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {getDocumentTypeText(selectedDocument.type)}
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Property
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {selectedDocument.propertyName}
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Buyer</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {selectedDocument.buyerName}
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Upload Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(selectedDocument.uploadDate).toLocaleString()}
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Current Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusBadgeClass(selectedDocument.status)}`}
                    >
                      {selectedDocument.status.charAt(0).toUpperCase() +
                        selectedDocument.status.slice(1)}
                    </span>
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:px-6 rounded-b-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">
                    Document Preview
                  </h5>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <a
                        href={selectedDocument.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleReviewSubmit} className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Review Document
                  </h4>

                  <div className="mb-4">
                    <label
                      htmlFor="reviewStatus"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Review Status
                    </label>
                    <select
                      id="reviewStatus"
                      name="reviewStatus"
                      value={reviewStatus}
                      onChange={handleReviewStatusChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="reviewNotes"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Review Notes
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="reviewNotes"
                        name="reviewNotes"
                        rows={3}
                        value={reviewNotes}
                        onChange={handleReviewNotesChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Add notes about this document review"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {reviewStatus === "rejected"
                        ? "Please provide a reason for rejection."
                        : "Optional notes for this review."
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {reviewLoading ? "Submitting..." : "Submit Review"
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No document selected
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a document from the list to review it.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDocumentReview;
