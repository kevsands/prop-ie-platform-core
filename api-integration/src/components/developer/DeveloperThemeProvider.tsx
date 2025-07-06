'use client';

import React, { ReactNode } from "react";

/**
 * Simplified DeveloperThemeProvider stub for build testing
 */
type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function DeveloperThemeProvider({
  children,
  defaultTheme = 'system',
}: ThemeProviderProps) {
  // Simple implementation that just renders children
  return <>{children}</>;
}