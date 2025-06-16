import { NextRequest, NextResponse } from 'next/server';

export interface RequestHandler {
  (req: NextRequest, res: NextResponse, next?: () => void): Promise<void>
  );
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  // Add other user properties as needed
}

export interface CustomRequest extends NextRequest {
  user?: User;
}

export interface CustomResponse extends NextResponse {
  locals?: {
    [key: string]: any;
  };
}

// API handler type for your route handlers
export type ApiHandler = (
  req: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>
  );
// Type for API request options
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>
  );
  body?: any;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

// Type for the Next.js fetch config
interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

// Error response interface
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// Success response interface
export interface SuccessResponse<T = any> {
  data: T;
  message?: string;
  statusCode: number;
}

// MongoDB related types
export interface MongoDbOptions {
  collection: string;
  database?: string;
  query?: Record<string, any>
  );
  projection?: Record<string, any>
  );
  sort?: Record<string, any>
  );
  limit?: number;
  skip?: number;
}

// Type helper for service functions
export type ServiceFunction<T = any, R = any> = (params: T) => Promise<R>
  );
// Authentication response interface
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}