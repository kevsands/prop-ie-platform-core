'use client';

// pages/dashboard/index.tsx
"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import TasksList from "./TasksList";
import AlertsList from "./AlertsList";
import { AuthUser } from "@/types/amplify/auth";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { 
    tasks, 
    alerts, 
    isLoading: dataLoading,
    error,
    isDueSoon,
    isOverdue,
    markAlertAsRead,
    updateTaskStatus
  } = useDashboardData();

  const isLoading = authLoading || dataLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B5273]" />
        <span className="ml-2 text-lg text-gray-600">Loading Dashboard...</span>
      </div>
    );
  }

  if (!user) {
    // This shouldn't happen if middleware is working, but good to handle
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Error: User not found. Please try logging in again.</p>
        <a href="/login" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go to Login
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Error loading dashboard data: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // In a real app, you would have role-specific dashboards
  // This is a simplified example that shows the same dashboard for all users
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A374D] mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user.cognitoAttributes?.firstName && user.cognitoAttributes?.lastName 
            ? `${user.cognitoAttributes.firstName} ${user.cognitoAttributes.lastName}` 
            : user.name}
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <TasksList 
            tasks={tasks} 
            isDueSoon={isDueSoon} 
            isOverdue={isOverdue}
            updateTaskStatus={updateTaskStatus} 
          />
        </div>

        {/* Alerts Section */}
        <div>
          <AlertsList 
            alerts={alerts} 
            markAlertAsRead={markAlertAsRead}
          />
        </div>

        {/* Add more dashboard widgets as needed */}
      </div>
    </div>
  );
}

