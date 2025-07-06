'use client';

import React from 'react';

export type TabType = "details" | "documents" | "notes" | "actions";

interface ClaimTabsProps {
  activeTab: TabType;
  onTabChangeAction: (tab: TabType) => void;
}

export function ClaimTabs({ activeTab, onTabChangeAction }: ClaimTabsProps) {
  return (
    <div className="px-4 sm:px-0">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => onTabChangeAction("details")}
            className={`${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Details
          </button>
          <button
            onClick={() => onTabChangeAction("documents")}
            className={`${
              activeTab === "documents"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Documents
          </button>
          <button
            onClick={() => onTabChangeAction("notes")}
            className={`${
              activeTab === "notes"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Notes
          </button>
          <button
            onClick={() => onTabChangeAction("actions")}
            className={`${
              activeTab === "actions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Actions
          </button>
        </nav>
      </div>
    </div>
  );
}