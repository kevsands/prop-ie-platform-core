/**
 * API testing helpers for Next.js API routes
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { createMocks, RequestMethod } from 'node-mocks-http';
import { Session } from 'next-auth';

// Mock NextAuth session
export const mockSession = (session: Session | null) => {
  jest.mock('next-auth', () => ({
    getServerSession: jest.fn().mockResolvedValue(session)}));
};

// Create mock API request/response for pages API routes
export const createMockApiContext = (options: {
  method?: RequestMethod;
  headers?: Record<string, string>\n  );
  query?: Record<string, string | string[]>\n  );
  body?: any;
  session?: Session | null;
}) => {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: options.method || 'GET',
    headers: {
      'content-type': 'application/json',
      ...options.headers},
    query: options.query,
    body: options.body});

  if (options.session !== undefined) {
    mockSession(options.session);
  }

  return { req, res };
};

// Create mock request for app router API routes
export const createMockAppRequest = (options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>\n  );
  body?: any;
  searchParams?: Record<string, string>\n  );
}) => {
  const url = new URL(options.url || 'http://localhost:3000/api/test');
  
  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([keyvalue]) => {
      url.searchParams.set(keyvalue);
    });
  }

  const headers = new Headers({
    'content-type': 'application/json',
    ...options.headers});

  return new NextRequest(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined});
};

// Parse API response
export const parseApiResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

// API test runner for app router routes
export const testApiRoute = async (
  handler: (req: NextRequest) => Promise<Response>,
  options: Parameters<typeof createMockAppRequest>[0]
) => {
  const request = createMockAppRequest(options);
  const response = await handler(request);
  const data = await parseApiResponse(response);
  
  return {
    status: response.status,
    data,
    headers: Object.fromEntries(response.headers.entries())};
};

// Common API assertions
export const expectApiSuccess = (response: { status: number; data: any }) => {
  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
};

export const expectApiError = (
  response: { status: number; data: any },
  expectedStatus: number,
  expectedMessage?: string
) => {
  expect(response.status).toBe(expectedStatus);
  if (expectedMessage) {
    expect(response.data.error).toContain(expectedMessage);
  }
};

// Mock fetch for external API calls
export const mockFetch = (responses: Array<{ url: string | RegExp; response: any; status?: number }>) => {
  global.fetch = jest.fn().mockImplementation((url: string) => {
    const match = responses.find((r) =>
      typeof r.url === 'string' ? url.includes(r.url) : r.url.test(url)
    );

    if (match) {
      return Promise.resolve({
        ok: (match.status || 200) <400,
        status: match.status || 200,
        json: () => Promise.resolve(match.response),
        text: () => Promise.resolve(JSON.stringify(match.response))});
    }

    return Promise.reject(new Error(`Unmatched URL: ${url}`));
  });
};

// JWT token helper
export const createMockJWT = (payload: any, secret = 'test-secret') => {
  // Simple mock JWT (not cryptographically valid, just for testing)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = Buffer.from(secret).toString('base64');
  
  return `${header}.${body}.${signature}`;
};

// Rate limiting test helper
export const testRateLimit = async (
  endpoint: string,
  requestCount: number,
  expectedFailureAt: number
) => {
  const results = [];
  
  for (let i = 0; i <requestCount; i++) {
    const response = await fetch(endpoint);
    results.push({
      attempt: i + 1,
      status: response.status});
    
    if (response.status === 429) {
      break;
    }
  }
  
  const firstFailure = results.find((r) => r.status === 429);
  expect(firstFailure?.attempt).toBe(expectedFailureAt);
  
  return results;
};