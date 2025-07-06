// src/app/buyer/htb/HTBContextProvider.tsx
"use client";

import React from "react";
import { HTBProvider } from "@/context/HTBContext";

/**
 * Simple wrapper for HTBProvider
 */
export function HTBContextProvider({ children }: { children: React.ReactNode }) {
  return <HTBProvider>{children}</HTBProvider>;
}