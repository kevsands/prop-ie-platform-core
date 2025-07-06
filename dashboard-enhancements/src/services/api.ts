// src/services/api.ts
import { env } from '../config/environment';

// Define API error type
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Define request options interface
interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  skipErrorHandling?: boolean;
}

class ApiService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = env.apiUrl || '';
    
    // Validate baseUrl during initialization
    if (!this.baseUrl) {
    }
  }
  
  /**
   * Get access token from storage safely (works in both browser and server contexts)
   */
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }
  
  /**
   * Core request method for all HTTP requests
   */
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, skipErrorHandling = false, ...fetchOptions } = options;
    
    // Default headers
    const headers = new Headers(fetchOptions.headers);
    if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add auth token if required
    if (requiresAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      } else if (typeof window !== 'undefined') {
        // Only throw if we're in the browser and should have an auth token
      }
    }
    
    // Prepare final request options
    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers,
    };
    
    // Form the full URL
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    try {
      // Make the request
      const response = await fetch(url, requestOptions);
      
      // Handle success
      if (response.ok) {
        // Check if response is empty
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json() as T;
        } else {
          // Handle empty responses (e.g., DELETE operations that return 204 No Content)
          return {} as T;
        }
      }
      
      // Handle errors
      if (!skipErrorHandling) {
        // Fixed: Properly type errorData and handle the unknown type from response.json()
        let errorData: Record<string, any> = {};
        try {
          const jsonData = await response.json();
          // Safely convert to a usable object with type checking
          if (jsonData && typeof jsonData === 'object') {
            errorData = jsonData as Record<string, any>;
          }
        } catch {
          // If JSON parsing fails, keep the default empty object
        }
        
        throw new ApiError(
          // Safely access message property with type checking
          typeof errorData.message === 'string' 
            ? errorData.message 
            : `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }
      
      return response as unknown as T;
    } catch (error) {
      // Rethrow ApiError instances
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Convert other errors to ApiError
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0,
        { originalError: error }
      );
    }
  }
  
  /**
   * Perform GET request
   */
  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  
  /**
   * Perform POST request
   */
  public post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * Perform PUT request
   */
  public put<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * Perform PATCH request
   */
  public patch<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
  
  /**
   * Perform DELETE request
   */
  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
  
  /**
   * Upload file(s) as FormData
   */
  public uploadFile<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      // Don't set Content-Type header as the browser needs to set it with the boundary
    });
  }
}

// Export a singleton instance
export const api = new ApiService();