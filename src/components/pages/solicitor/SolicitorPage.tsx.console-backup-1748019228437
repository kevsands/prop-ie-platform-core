"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";

// Define TypeScript interfaces for our data structures
interface Transaction {
  id: number;
  client: string;
  property: string;
  status: string;
  lastUpdated: string;
  type: "buyer" | "vendor";
  otherParty: string;
  otherPartySolicitor: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  status: string;
  date: string;
  transactionType: "buyer" | "vendor";
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
  transactionType: "buyer" | "vendor";
}

// Define allowed transaction type values as a union type
type TransactionType = "all" | "buyer" | "vendor";

export default function SolicitorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [transactionType, setTransactionType] = useState<TransactionType>("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For now, we'll use mock data
    setTransactions([
      {
        id: 1,
        client: "John Doe",
        property: "Maple Heights - Unit 101",
        status: "In Progress",
        lastUpdated: "2 hours ago",
        type: "buyer", // Added transaction type
        otherParty: "Fitzgerald Developments Ltd",
        otherPartySolicitor: "Smith & Partners"
      },
      {
        id: 2,
        client: "Jane Smith",
        property: "Oak Residences - Unit A2",
        status: "Completed",
        lastUpdated: "Yesterday",
        type: "buyer",
        otherParty: "Oakwood Properties",
        otherPartySolicitor: "Wilson Legal"
      },
      {
        id: 3,
        client: "Michael Johnson",
        property: "Maple Heights - Unit 103",
        status: "Pending",
        lastUpdated: "3 days ago",
        type: "buyer",
        otherParty: "Fitzgerald Developments Ltd",
        otherPartySolicitor: "Smith & Partners"
      },
      {
        id: 4,
        client: "Fitzgerald Developments Ltd",
        property: "Maple Heights - Unit 105",
        status: "In Progress",
        lastUpdated: "1 day ago",
        type: "vendor",
        otherParty: "Sarah Williams",
        otherPartySolicitor: "Carter & Associates"
      },
      {
        id: 5,
        client: "Fitzgerald Developments Ltd",
        property: "Maple Heights - Unit 110",
        status: "Contract Issued",
        lastUpdated: "4 hours ago",
        type: "vendor",
        otherParty: "Robert Brown",
        otherPartySolicitor: "Murphy Law"
      }
    ]);

    setDocuments([
      {
        id: 1,
        name: "Contract of Sale - John Doe",
        type: "Contract",
        status: "Awaiting Signature",
        date: "2 hours ago",
        transactionType: "buyer"
      },
      {
        id: 2,
        name: "Title Deed - Jane Smith",
        type: "Title",
        status: "Verified",
        date: "Yesterday",
        transactionType: "buyer"
      },
      {
        id: 3,
        name: "Help-to-Buy Confirmation - Michael Johnson",
        type: "HTB",
        status: "Received",
        date: "3 days ago",
        transactionType: "buyer"
      },
      {
        id: 4,
        name: "Management Company Information - Maple Heights",
        type: "Management",
        status: "Ready for Issue",
        date: "1 day ago",
        transactionType: "vendor"
      },
      {
        id: 5,
        name: "Building Energy Rating Certificate - Unit 110",
        type: "BER",
        status: "Issued",
        date: "4 hours ago",
        transactionType: "vendor"
      }
    ]);

    setNotifications([
      {
        id: 1,
        message: "New document uploaded: Contract of Sale - John Doe",
        time: "2 hours ago",
        read: false,
        transactionType: "buyer"
      },
      {
        id: 2,
        message: "Transaction completed for Jane Smith",
        time: "Yesterday",
        read: true,
        transactionType: "buyer"
      },
      {
        id: 3,
        message: "Help-to-Buy approval received for Michael Johnson",
        time: "3 days ago",
        read: true,
        transactionType: "buyer"
      },
      {
        id: 4,
        message: "New enquiry received from Carter & Associates for Unit 105",
        time: "1 day ago",
        read: false,
        transactionType: "vendor"
      },
      {
        id: 5,
        message: "Deposit received for Unit 110",
        time: "6 hours ago",
        read: false,
        transactionType: "vendor"
      }
    ]);
  }, []);

  // Filter transactions, documents, and notifications based on transaction type
  const filteredTransactions = transactionType === "all" 
    ? transactions 
    : transactions.filter(t => t.type === transactionType);

  const filteredDocuments = transactionType === "all"
    ? documents
    : documents.filter(d => d.transactionType === transactionType);

  const filteredNotifications = transactionType === "all"
    ? notifications
    : notifications.filter(n => n.transactionType === transactionType);

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  
  // Count active transactions by type with explicit type definition
  const activeTransactionsCount: Record<TransactionType, number> = {
    all: transactions.filter(t => t.status === "In Progress").length,
    buyer: transactions.filter(t => t.status === "In Progress" && t.type === "buyer").length,
    vendor: transactions.filter(t => t.status === "In Progress" && t.type === "vendor").length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Solicitor Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your property transactions and legal documents for both buyer and vendor clients.
          </p>

          {/* Transaction Type Selector */}
          <div className="mt-6 flex space-x-4">
            <span className="text-sm font-medium text-gray-700 pt-1">View transactions for:</span>
            <div className="flex bg-white rounded-md shadow-sm">
              <button
                onClick={() => setTransactionType("all")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  transactionType === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                All Transactions
              </button>
              <button
                onClick={() => setTransactionType("buyer")}
                className={`px-4 py-2 text-sm font-medium ${
                  transactionType === "buyer"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Buyer Side
              </button>
              <button
                onClick={() => setTransactionType("vendor")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  transactionType === "vendor"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Vendor Side
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`${
                  activeTab === "transactions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`${
                  activeTab === "documents"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab("kyc")}
                className={`${
                  activeTab === "kyc"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                KYC Verification
              </button>
              <button
                onClick={() => setActiveTab("guides")}
                className={`${
                  activeTab === "guides"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Transaction Guides
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Transaction type explanation */}
            {transactionType !== "all" && (
              <div className={`p-4 mb-6 rounded-md ${
                transactionType === "buyer" 
                  ? "bg-blue-50 text-blue-800 border border-blue-200" 
                  : "bg-indigo-50 text-indigo-800 border border-indigo-200"
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">
                      {transactionType === "buyer" 
                        ? "Buyer-Side Transactions" 
                        : "Vendor-Side Transactions"}
                    </h3>
                    <div className="mt-2 text-sm">
                      <p>
                        {transactionType === "buyer" 
                          ? "You are viewing transactions where you represent the purchaser. These transactions typically involve reviewing contracts, conducting title searches, arranging financing, and ensuring the buyer's interests are protected."
                          : "You are viewing transactions where you represent the property seller or developer. These transactions typically involve preparing contracts, addressing purchaser enquiries, and ensuring all regulatory requirements are met."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${
                      transactionType === "vendor" 
                        ? "bg-indigo-500" 
                        : transactionType === "buyer" 
                          ? "bg-blue-500" 
                          : "bg-purple-500"
                    }`}>
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Active Transactions
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {activeTransactionsCount[transactionType]}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link
                      href="/solicitor/transactions"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      View all transactions
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Pending Documents
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {transactionType === "all" 
                              ? documents.filter(d => d.status === "Awaiting Signature").length 
                              : documents.filter(d => d.status === "Awaiting Signature" && d.transactionType === transactionType).length}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link
                      href="/solicitor/documents"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      View all documents
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Unread Notifications
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {transactionType === "all" 
                              ? notifications.filter(n => !n.read).length 
                              : notifications.filter(n => !n.read && n.transactionType === transactionType).length}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <button className="font-medium text-blue-600 hover:text-blue-500">
                      View all notifications
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Activity
              </h2>
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <li key={transaction.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 truncate mr-2">
                              {transaction.client}
                            </p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              transaction.type === "buyer" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-indigo-100 text-indigo-800"
                            }`}>
                              {transaction.type === "buyer" ? "Buyer" : "Vendor"}
                            </span>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "In Progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {transaction.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {transaction.property}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>Updated {transaction.lastUpdated}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>{transaction.type === "buyer" ? "Vendor" : "Purchaser"}: {transaction.otherParty} ({transaction.otherPartySolicitor})</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Transactions
              </h2>
              <div className="flex space-x-2">
                <button
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    transactionType === "buyer" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setTransactionType("buyer")}
                >
                  Buyer Side
                </button>
                <button
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    transactionType === "vendor" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setTransactionType("vendor")}
                >
                  Vendor Side
                </button>
                <Link
                  href="/solicitor/transactions/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  New Transaction
                </Link>
              </div>
            </div>
            
            {/* Transaction type explanation */}
            {transactionType !== "all" && (
              <div className={`p-4 mb-6 rounded-md ${
                transactionType === "buyer" 
                  ? "bg-blue-50 border border-blue-200" 
                  : "bg-indigo-50 border border-indigo-200"
              }`}>
                <h3 className="text-sm font-medium mb-1 text-gray-900">
                  {transactionType === "buyer" 
                    ? "Buyer-Side Transaction Requirements" 
                    : "Vendor-Side Transaction Requirements"}
                </h3>
                <div className="mt-1 text-sm text-gray-600">
                  <ul className="list-disc pl-5 space-y-1">
                    {transactionType === "buyer" ? (
                      <>
                        <li>Verify client identity and source of funds</li>
                        <li>Review contract for sale and raise pre-contract enquiries</li>
                        <li>Conduct title searches and review title documents</li>
                        <li>Coordinate with lender for mortgage approval and requirements</li>
                        <li>Process Help-to-Buy application (if applicable)</li>
                        <li>Review management company structures (if applicable)</li>
                        <li>Ensure snag list completion and property compliance</li>
                      </>
                    ) : (
                      <>
                        <li>Prepare contracts for sale</li>
                        <li>Address pre-contract enquiries from buyer's solicitor</li>
                        <li>Provide title documentation and building certificates</li>
                        <li>Ensure Property Registration Authority requirements are met</li>
                        <li>Prepare management company documentation (if applicable)</li>
                        <li>Process stage payments for new builds (if applicable)</li>
                        <li>Manage the closing process and funds transfer</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <li key={transaction.id}>
                    <Link
                      href={`/solicitor/transactions/${transaction.id}`}
                      className="block hover:bg-gray-50"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 truncate mr-2">
                              {transaction.client}
                            </p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              transaction.type === "buyer" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-indigo-100 text-indigo-800"
                            }`}>
                              {transaction.type === "buyer" ? "Buyer" : "Vendor"}
                            </span>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "In Progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : transaction.status === "Contract Issued"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {transaction.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {transaction.property}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>Updated {transaction.lastUpdated}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>{transaction.type === "buyer" ? "Vendor" : "Purchaser"}: {transaction.otherParty} ({transaction.otherPartySolicitor})</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
              <div className="flex space-x-2">
                <button
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    transactionType === "buyer" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setTransactionType("buyer")}
                >
                  Buyer Side
                </button>
                <button
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    transactionType === "vendor" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setTransactionType("vendor")}
                >
                  Vendor Side
                </button>
                <Link
                  href="/solicitor/documents/upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload Document
                </Link>
              </div>
            </div>

            {/* Document type requirements based on transaction type */}
            {transactionType !== "all" && (
              <div className={`p-4 mb-6 rounded-md ${
                transactionType === "buyer" 
                  ? "bg-blue-50 border border-blue-200" 
                  : "bg-indigo-50 border border-indigo-200"
              }`}>
                <h3 className="text-sm font-medium mb-1 text-gray-900">
                  {transactionType === "buyer" 
                    ? "Required Buyer-Side Documents" 
                    : "Required Vendor-Side Documents"}
                </h3>
                <div className="mt-1 text-sm text-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    {transactionType === "buyer" ? (
                      <>
                        <div>
                          <span className="font-medium">Pre-Contract Stage:</span>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Proof of identity and address</li>
                            <li>Proof of funds/mortgage approval in principle</li>
                            <li>Source of funds declaration</li>
                            <li>Help-to-Buy approval (if applicable)</li>
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium">Closing Stage:</span>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Signed contract</li>
                            <li>Loan offer and loan pack</li>
                            <li>Signed deed of transfer</li>
                            <li>Completion certificate</li>
                            <li>Building Energy Rating (BER) certificate</li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="font-medium">Pre-Contract Stage:</span>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Title documents</li>
                            <li>Building specifications</li>
                            <li>Planning permission & compliance certificates</li>
                            <li>Management company details (if applicable)</li>
                            <li>Property plans and maps</li>
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium">Closing Stage:</span>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Counterpart contracts</li>
                            <li>Building completion certificate</li>
                            <li>Building Energy Rating (BER) certificate</li>
                            <li>Property tax clearance</li>
                            <li>Deed of transfer/assurance</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <li key={document.id}>
                    <Link
                      href={`/solicitor/documents/${document.id}`}
                      className="block hover:bg-gray-50"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 truncate mr-2">
                              {document.name}
                            </p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              document.transactionType === "buyer" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-indigo-100 text-indigo-800"
                            }`}>
                              {document.transactionType === "buyer" ? "Buyer" : "Vendor"}
                            </span>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                document.status === "Verified"
                                  ? "bg-green-100 text-green-800"
                                  : document.status === "Awaiting Signature"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : document.status === "Ready for Issue" || document.status === "Received"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {document.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {document.type}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>Updated {document.date}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* KYC Verification Tab */}
        {activeTab === "kyc" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                KYC Verification
              </h2>
              <Link
                href="/solicitor/kyc/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                New Verification
              </Link>
            </div>
            
            {/* KYC Requirements based on transaction type */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-1 text-gray-900">
                  Buyer-Side KYC Requirements
                </h3>
                <div className="mt-1 text-sm text-gray-600">
                  <p className="mb-2">Solicitors representing buyers must verify:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Proof of identity (passport/driving license)</li>
                    <li>Proof of address (utility bills/bank statements)</li>
                    <li>Source of funds verification</li>
                    <li>Anti-money laundering (AML) checks</li>
                    <li>Politically exposed person (PEP) screening</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-1 text-gray-900">
                  Vendor-Side KYC Requirements
                </h3>
                <div className="mt-1 text-sm text-gray-600">
                  <p className="mb-2">Solicitors representing vendors must verify:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Company verification (for developers)</li>
                    <li>Director identification</li>
                    <li>Beneficial ownership verification</li>
                    <li>Corporate structure documentation</li>
                    <li>Authority to sell verification</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  KYC/AML Verification Status
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Verify client identity and perform anti-money laundering checks.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      John Doe
                    </dt>
                    <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2">
                      Verified
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Jane Smith
                    </dt>
                    <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2">
                      Verified
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Michael Johnson
                    </dt>
                    <dd className="mt-1 text-sm text-yellow-600 sm:mt-0 sm:col-span-2">
                      Pending - Awaiting Documents
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Fitzgerald Developments Ltd
                    </dt>
                    <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2">
                      Company Verified
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Verifications
              </h3>
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate mr-2">
                            John Doe
                          </p>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Buyer
                          </span>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Complete
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            ID verification and AML check completed
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate mr-2">
                            Jane Smith
                          </p>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Buyer
                          </span>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Complete
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            ID verification and AML check completed
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate mr-2">
                            Fitzgerald Developments Ltd
                          </p>
                          <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                            Vendor
                          </span>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Complete
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Company verification completed
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Transaction Guides Tab (New) */}
        {activeTab === "guides" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Transaction Guides
              </h2>
              <div className="flex space-x-2">
                <button
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    transactionType === "buyer" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setTransactionType("buyer")}
                >
                  Buyer Side
                </button>
                <button
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    transactionType === "vendor" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setTransactionType("vendor")}
                >
                  Vendor Side
                </button>
              </div>
            </div>
           
            {transactionType === "buyer" && (
              <div className="space-y-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Buyer's Solicitor: Process Timeline</h3>
                    <div className="mt-5">
                      <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                        <li className="mb-10 ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white">
                            <span className="text-blue-800 font-bold">1</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Client Engagement</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Take instructions, verify identity, and perform KYC/AML checks</p>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">Initial Stage</span>
                        </li>
                        <li className="mb-10 ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white">
                            <span className="text-blue-800 font-bold">2</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Pre-Contract Review</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Review contract, title, and raise pre-contract enquiries</p>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">Due Diligence</span>
                        </li>
                        <li className="mb-10 ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white">
                            <span className="text-blue-800 font-bold">3</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Contract Signing</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Client signs contract and pays deposit</p>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">Commitment</span>
                        </li>
                        <li className="mb-10 ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white">
                            <span className="text-blue-800 font-bold">4</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Mortgage Process</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Coordinate with lender for mortgage approval and requirements</p>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">Financing</span>
                        </li>
                        <li className="mb-10 ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white">
                            <span className="text-blue-800 font-bold">5</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Pre-Completion</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Prepare completion documents and conduct final searches</p>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">Preparation</span>
                        </li>
                        <li className="ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white">
                            <span className="text-blue-800 font-bold">6</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Completion</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Transfer funds, complete purchase, and register title</p>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">Finalization</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">New Build Buyer: Essential Checklist</h3>
                    <p className="mt-1 text-gray-500">For solicitors representing buyers of new build properties</p>
                    <div className="mt-4 space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">1. Property Compliance</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Building Energy Rating (BER) certificate</li>
                          <li>Building Regulation Compliance certificate</li>
                          <li>Fire safety compliance</li>
                          <li>Structural guarantee certification (e.g., HomeBond)</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">2. Planning Verification</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Planning permission compliance</li>
                          <li>Planning conditions satisfaction</li>
                          <li>Development compliance certificates</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">3. Management & Services</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Management company structure and fees</li>
                          <li>Service charge estimates</li>
                          <li>Property management details</li>
                          <li>Common areas maintenance agreement</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">4. Financial Protections</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Stage payment protection</li>
                          <li>Deposit protection mechanism</li>
                          <li>Help-to-Buy scheme compliance (if applicable)</li>
                          <li>Completion timeline guarantees</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">5. Warranty & Post-Completion</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Builder's warranty details</li>
                          <li>Defects liability period</li>
                          <li>Snagging procedure</li>
                          <li>After-sales customer service details</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {transactionType === "vendor" && (
              <div className="space-y-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Vendor's Solicitor: Process Timeline</h3>
                    <div className="mt-5">
                      <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                        <li className="mb-10 ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-indigo-200 rounded-full ring-8 ring-white">
                            <span className="text-indigo-800 font-bold">1</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Developer Engagement</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Take instructions, verify client authority, and collect development documentation</p>
                          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">Initial Stage</span>
                        </li>
                        <li className="mb-10 ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-indigo-200 rounded-full ring-8 ring-white">
                            <span className="text-indigo-800 font-bold">2</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Contract Preparation</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Draft contracts, compile title documentation and building certificates</p>
                          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">Documentation</span>
                        </li>
                        <li className="mb-10 ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-indigo-200 rounded-full ring-8 ring-white">
                            <span className="text-indigo-800 font-bold">3</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Contract Issue</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Issue contract pack to buyer's solicitor</p>
                          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">Initiation</span>
                        </li>
                        <li className="mb-10 ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-indigo-200 rounded-full ring-8 ring-white">
                            <span className="text-indigo-800 font-bold">4</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Pre-Contract Enquiries</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Respond to enquiries from buyer's solicitor</p>
                          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">Clarification</span>
                        </li>
                        <li className="mb-10 ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-indigo-200 rounded-full ring-8 ring-white">
                            <span className="text-indigo-800 font-bold">5</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Construction & Compliance</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Monitor construction progress and ensure compliance documentation</p>
                          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">Development</span>
                        </li>
                        <li className="ml-6">
                          <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-indigo-200 rounded-full ring-8 ring-white">
                            <span className="text-indigo-800 font-bold">6</span>
                          </span>
                          <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Completion</h3>
                          <p className="mb-2 text-base font-normal text-gray-500">Coordinate closing with buyer's solicitor and process funds</p>
                          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">Finalization</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Developer's Documentation Guide</h3>
                    <p className="mt-1 text-gray-500">Essential documentation for solicitors representing property developers</p>
                    <div className="mt-4 space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">1. Planning & Development</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Full planning permission and conditions</li>
                          <li>Commencement notices</li>
                          <li>Development agreements</li>
                          <li>Site maps and plans</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">2. Title & Property Details</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Title deeds and land registry folios</li>
                          <li>Boundary confirmations</li>
                          <li>Maps and survey documentation</li>
                          <li>Easements and rights of way</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">3. Construction & Compliance</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Building regulation compliance certificates</li>
                          <li>Fire safety certificates</li>
                          <li>Structural warranties (HomeBond, etc.)</li>
                          <li>BER certificates</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">4. Management Structure</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Management company incorporation documents</li>
                          <li>Service charge budget</li>
                          <li>Management agreement</li>
                          <li>Common areas transfer documentation</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">5. Sales & Marketing</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Sales brochures and specifications</li>
                          <li>Price lists and availability schedules</li>
                          <li>Stage payment structures</li>
                          <li>Show house/unit details</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {transactionType === "all" && (
              <div className="py-10 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Choose a transaction type</h3>
                <p className="mt-1 text-sm text-gray-500">Select "Buyer Side" or "Vendor Side" to view specific guides</p>
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setTransactionType("buyer")}
                  >
                    Buyer Side Guides
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => setTransactionType("vendor")}
                  >
                    Vendor Side Guides
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}