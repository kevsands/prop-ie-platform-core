/**
 * Authentication REST API Service
 * 
 * Service layer that connects authentication operations to the newly enabled authentication endpoints.
 * Handles JWT tokens, session management, and user data.
 */

// API Base URL
const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

// Types for authentication
export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  organizationId?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organisationId: string;
  accessToken?: string;
  permissions?: Array<{ resource: string; action: string }>;
}

export interface AuthResponse {
  success: boolean;
  user: AuthUser;
  token: string;
  refreshToken?: string;
  message?: string;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

/**
 * Authentication REST API Service
 */
export class AuthRestApiService {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Initialize with stored tokens if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      this.refreshToken = localStorage.getItem('refresh-token') || sessionStorage.getItem('refresh-token');
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(credentials: AuthCredentials): Promise<{ isSignedIn: boolean; nextStep: { signInStep: string } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.username,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data: AuthResponse = await response.json();

      if (data.success && data.token) {
        // Store tokens
        this.token = data.token;
        this.refreshToken = data.refreshToken || null;
        
        // Store in localStorage for persistence
        localStorage.setItem('auth-token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refresh-token', data.refreshToken);
        }

        // Also store user data for quick access
        localStorage.setItem('auth-user', JSON.stringify(data.user));

        return {
          isSignedIn: true,
          nextStep: { signInStep: 'DONE' },
        };
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sign out - clear tokens and user data
   */
  async signOut(): Promise<void> {
    try {
      // Call logout endpoint if we have a token
      if (this.token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }).catch(() => {
          // If logout endpoint fails, we still want to clear local data
        });
      }
    } finally {
      // Always clear local data
      this.token = null;
      this.refreshToken = null;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        localStorage.removeItem('auth-user');
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('refresh-token');
        sessionStorage.removeItem('auth-user');
      }
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<{ userId: string; signInDetails: { loginId: string } }> {
    // First try to get user from stored data
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('auth-user');
      const storedToken = this.token || localStorage.getItem('auth-token');
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Verify token is still valid by calling /me endpoint
          const response = await fetch(`${API_BASE_URL}/api/users/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const currentUserData = await response.json();
            
            // Update stored user data if it's different
            if (currentUserData.id !== userData.id || currentUserData.email !== userData.email) {
              localStorage.setItem('auth-user', JSON.stringify(currentUserData));
            }

            return {
              userId: currentUserData.id,
              signInDetails: { loginId: storedToken },
            };
          } else if (response.status === 401) {
            // Token is invalid, try to refresh or clear data
            await this.signOut();
            throw new Error('Authentication expired');
          }
        } catch (error) {
        }
      }
    }

    throw new Error('No authenticated user');
  }

  /**
   * Fetch user attributes/profile
   */
  async fetchUserAttributes(): Promise<Record<string, string>> {
    try {
      const token = this.token || localStorage.getItem('auth-token');
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          await this.signOut();
          throw new Error('Authentication expired');
        }
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();

      // Convert to the expected format for compatibility
      return {
        name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        email: userData.email || '',
        preferred_username: userData.email || '',
        'custom:role': userData.role || 'user',
        'custom:organisationId': userData.organizationId || userData.organisationId || '',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshAuthToken(): Promise<string | null> {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.token) {
        this.token = data.token;
        localStorage.setItem('auth-token', data.token);
        return data.token;
      }

      throw new Error('No token in refresh response');
    } catch (error) {
      // Clear tokens if refresh fails
      await this.signOut();
      return null;
    }
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return this.token || localStorage.getItem('auth-token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Export singleton instance
export const authRestApiService = new AuthRestApiService();