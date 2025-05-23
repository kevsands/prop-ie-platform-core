'use client';

import React, { useState } from "react";
import BuyerDashboardSidebar from "./BuyerDashboardSidebar";

// Dashboard content components
const DashboardOverview: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          My Properties
        </h3>
        <p className="text-3xl font-bold">1</p>
        <p className="text-sm text-gray-500">Property in progress</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Documents</h3>
        <p className="text-3xl font-bold">3/5</p>
        <p className="text-sm text-gray-500">Required documents uploaded</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Next Steps</h3>
        <p className="text-sm text-gray-500">Upload Help-to-Buy documents</p>
      </div>
    </div>

    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Purchase Progress
      </h3>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={ width: "60%" }
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Booking</span>
            <span>Documents</span>
            <span>Compliance</span>
            <span>Approval</span>
            <span>Closing</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MyProperties: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">My Properties</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Fitzgerald Gardens - Unit 14
        </h3>
        <p className="text-sm text-gray-500">3 Bedroom Semi-Detached House</p>
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            In Progress
          </span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-md font-medium text-gray-900 mb-2">
          Purchase Details
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Purchase Price</p>
            <p className="text-md font-medium">€385,000</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Booking Deposit</p>
            <p className="text-md font-medium">€10,000</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Booking Date</p>
            <p className="text-md font-medium">March 15, 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estimated Completion</p>
            <p className="text-md font-medium">September 2025</p>
          </div>
        </div>
        <div className="mt-4">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Full Details
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Documents: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Documents</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Required Documents
        </h3>
        <p className="text-sm text-gray-500">
          Please upload all required documents to proceed with your purchase
        </p>
      </div>
      <div className="p-4">
        <ul className="divide-y divide-gray-200">
          <li className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-md font-medium text-gray-900">
                  Proof of Identity
                </h4>
                <p className="text-sm text-gray-500">
                  Passport or Driver's License
                </p>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                  Uploaded
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </button>
              </div>
            </div>
          </li>
          <li className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-md font-medium text-gray-900">
                  Proof of Address
                </h4>
                <p className="text-sm text-gray-500">
                  Utility bill or bank statement (less than 3 months old)
                </p>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                  Uploaded
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </button>
              </div>
            </div>
          </li>
          <li className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-md font-medium text-gray-900">
                  Help-to-Buy Approval
                </h4>
                <p className="text-sm text-gray-500">
                  HTB approval letter from Revenue
                </p>
              </div>
              <div>
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Upload
                </button>
              </div>
            </div>
          </li>
          <li className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-md font-medium text-gray-900">
                  Mortgage Approval in Principle
                </h4>
                <p className="text-sm text-gray-500">
                  Approval letter from your mortgage provider
                </p>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                  Uploaded
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </button>
              </div>
            </div>
          </li>
          <li className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-md font-medium text-gray-900">
                  Solicitor Details
                </h4>
                <p className="text-sm text-gray-500">
                  Contact information for your solicitor
                </p>
              </div>
              <div>
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Upload
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const BuyerDashboard: React.FC = () => {
  const [activeTabsetActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />\n  );
      case "properties":
        return <MyProperties />\n  );
      case "documents":
        return <Documents />\n  );
      case "payments":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Payments</h2>
            <p>Payment history and upcoming payments will be displayed here.</p>
          </div>
        );
      case "messages":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Messages</h2>
            <p>Your messages and notifications will be displayed here.</p>
          </div>
        );
      case "profile":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p>Your profile information and settings will be displayed here.</p>
          </div>
        );
      default:
        return <DashboardOverview />\n  );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 h-full">
        <BuyerDashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      <div className="flex-1 overflow-auto p-8">{renderTabContent()}</div>
    </div>
  );
};

export default BuyerDashboard;
