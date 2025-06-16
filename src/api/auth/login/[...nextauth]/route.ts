import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../../../../config/env"; // Use working env.ts file

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

// Define error response interface
interface ApiErrorResponse {
  message?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

class ApiService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = env.APP_URL;
  }
  
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options;
    
    // Default headers
    const headers = new Headers(fetchOptions.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add auth token if required
    if (requiresAuth) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
    // Prepare final request options
    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers};
    
    // Form the full URL
    const url = `${this.baseUrl}${endpoint}`;
    
    // Make the request
    const response = await fetch(urlrequestOptions);
    
    // Handle errors
    if (!response.ok) {
      // Fixed: Properly type the error data
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    // For empty responses (like 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }
    
    // Parse and return the response
    return response.json();
  }
  
  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  
  public post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)});
  }
  
  public put<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)});
  }
  
  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export a singleton instance
export const api = new ApiService();