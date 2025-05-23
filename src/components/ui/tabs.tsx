import React from 'react';
"use client";

import * as React from "react";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className = "",
  ...props
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [internalValuesetInternalValue] = React.useState(defaultValue || "");

  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;

  return (
    <TabsContext.Provider value={ value: currentValue, onValueChange: handleValueChange }>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={`inline-flex items-center rounded-lg bg-gray-100 p-1 ${className}`}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
}

function TabsTrigger({
  value,
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const isActive = context.value === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium
        transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50
        ${isActive ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-900"
        ${className}
      `}
      onClick={() => context.onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({
  value,
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  const isSelected = context.value === value;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };