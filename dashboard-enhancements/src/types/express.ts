// src/types/express.ts
import { Request, Response, NextFunction } from 'express';

// Express middleware handler with proper types
export type RequestHandler = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => Promise<void> | void;

// Custom error interface with status property
export interface ServiceError extends Error {
  status?: number;
  code?: string;
}

// Error handling middleware with proper types
export type ErrorHandler = (
  err: ServiceError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => Promise<void> | void;

// Custom request with user property
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// PDF text styling options
export interface TextStyle {
  fontSize?: number;
  bold?: boolean;
  lineGap?: number;
  align?: 'left' | 'center' | 'right';
  color?: string;
  font?: string;
}

// Contract related types
export interface ContractData {
  id?: string;
  title: string;
  content: string;
  signatories: string[];
  createdAt?: Date;
  updatedAt?: Date;
  status?: 'draft' | 'pending' | 'signed' | 'expired';
  options?: ContractOptions;
}

export interface ContractOptions {
  expiresAt?: Date;
  requireWitness?: boolean;
  allowElectronicSignature?: boolean;
  template?: string;
  [key: string]: any; // For any additional options
}

// Selection data type
export interface SelectionData {
  option: string;
  [key: string]: any;
}

// Enhanced authenticated request for contract operations
export interface ContractRequest extends AuthenticatedRequest {
  contract?: ContractData;
}

// Pagination options for list endpoints
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Response object with pagination metadata
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}