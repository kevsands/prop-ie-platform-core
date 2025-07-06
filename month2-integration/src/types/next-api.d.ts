import { NextRequest, NextResponse } from 'next/server';

/**
 * Type definitions for Next.js API Route Handlers (App Router)
 */
export interface RouteParams {
  params: Record<string, string | string[]>;
}

/**
 * Type for API routes with dynamic segments
 */
export type RouteSegmentHandler<T = any> = (
  request: NextRequest,
  context: { params: Record<string, string | string[]> }
) => Promise<T>;

/**
 * Type definition for API route handler in Next.js 13+ App Router
 * Updated for compatibility with Next.js 15+
 */
export type RouteHandler = (
  request: NextRequest,
  context: { params: Record<string, string | string[]> }
) => Promise<NextResponse> | NextResponse;

/**
 * Type definition for dynamic segment params for page components in Next.js 15+
 */
export interface PageParams {
  params: {
    [key: string]: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * Corrected PageParams for Next.js 15+
 * This resolves issues with the params type not matching Promise<any>
 */
export interface NextPageParams {
  params: {
    [key: string]: string;
  };
}

/**
 * Type definition for API response data structure
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status?: number;
  message?: string;
}