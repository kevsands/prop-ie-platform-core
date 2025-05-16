/**
 * Type definitions for Next.js route handlers
 */

import { NextRequest, NextResponse } from 'next/server';
import type { PrismaClient, Prisma } from '@prisma/client';

// Type for Prisma transaction context
export type PrismaTransactionClient = Omit<
  PrismaClient, 
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

// API Response types
export interface ApiSuccessResponse<T = any> {
  status?: number;
  success: true;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApiErrorResponse {
  status?: number;
  success: false;
  error: {
    code?: string;
    message: string;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Route Context for route handlers with params
export interface RouteContext<TParams = Record<string, string>> {
  params: TParams;
}

// Common param types
export type IdParam = { id: string };
export type SlugParam = { slug: string };

// Handler signatures for Next.js API routes
export type GetHandler<TParams = {}> = 
  (request: NextRequest, context: RouteContext<TParams>) => Promise<NextResponse>;
export type PostHandler<TParams = {}> = 
  (request: NextRequest, context: RouteContext<TParams>) => Promise<NextResponse>;
export type PutHandler<TParams = {}> = 
  (request: NextRequest, context: RouteContext<TParams>) => Promise<NextResponse>;
export type DeleteHandler<TParams = {}> = 
  (request: NextRequest, context: RouteContext<TParams>) => Promise<NextResponse>;
export type PatchHandler<TParams = {}> = 
  (request: NextRequest, context: RouteContext<TParams>) => Promise<NextResponse>;

// Session types
export interface Session {
  user: {
    id: string;
    name?: string;
    email?: string;
    role: string;
    [key: string]: any;
  };
  expires?: string;
}

// Helper to extract query parameters with type safety
export function getQueryParam(request: NextRequest, name: string): string | null {
  return request.nextUrl.searchParams.get(name);
}

export function getQueryParamAsNumber(request: NextRequest, name: string): number | undefined {
  const value = request.nextUrl.searchParams.get(name);
  return value ? parseFloat(value) : undefined;
}

export function getQueryParamAsInt(request: NextRequest, name: string): number | undefined {
  const value = request.nextUrl.searchParams.get(name);
  return value ? parseInt(value, 10) : undefined;
}

export function getQueryParamAsBoolean(request: NextRequest, name: string): boolean | undefined {
  const value = request.nextUrl.searchParams.get(name);
  return value === null ? undefined : value.toLowerCase() === 'true';
}