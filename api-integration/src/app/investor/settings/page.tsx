'use client';

import React from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';

// Simplified UI components with TypeScript types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const Button = ({ 
  children, 
  asChild, 
  className = "", 
  variant = "default", 
  ...props 
}: ButtonProps) => {
  if (asChild) {
    return children;
  }
  
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors";
  
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 text-gray-700",
  };
  
  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm",
  };
  
  return (
    <button 
      className={`${baseStyle} ${variantStyles[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card = ({ className = "", children }: CardProps) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }: CardProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }: CardProps) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }: CardProps) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }: CardProps) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export default function InvestorSettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Investor Settings</h1>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Account Settings</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              This page will provide settings for your investor account, preferences, notifications, and document management.
            </p>
            <p className="text-blue-600 mb-6">This page is under development and will be available soon.</p>
            <Button asChild>
              <Link href="/investor/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}