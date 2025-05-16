"use client";

import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

function Badge({ 
  className = "", 
  variant = "default", 
  ...props 
}: BadgeProps) {
  // Define variant styles
  const variantStyles = {
    default: "bg-blue-100 text-blue-800 border-blue-200",
    secondary: "bg-gray-100 text-gray-800 border-gray-200",
    outline: "bg-transparent text-gray-700 border-gray-300",
    destructive: "bg-red-100 text-red-800 border-red-200"
  };
  
  const baseStyle = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  
  return (
    <div
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export { Badge };