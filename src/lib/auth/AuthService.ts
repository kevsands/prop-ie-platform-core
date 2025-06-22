/**
 * Enterprise Authentication Service
 * Unified, enterprise-grade authentication with proper error handling
 */

import { 
  User, 
  UserRole, 
  UserStatus, 
  AuthError, 
  AuthErrorCode, 
  LoginRequest, 
  LoginResponse, 
  ApiResponse,
  Session 
} from '@/types/auth';

class EnterpriseAuthService {
  private readonly baseUrl: string;
  private readonly tokenKey = 'prop_access_token';
  private readonly refreshTokenKey = 'prop_refresh_token';
  private readonly sessionKey = 'prop_session_id';

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }

  /**
   * Sign in user with email and password
   */
  async signIn(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.makeRequest<LoginResponse>('/api/auth/enterprise/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (response.success && response.data) {
        // Store tokens securely
        this.storeTokens(response.data);
        return response.data;
      } else {
        throw this.createAuthError(response.error);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Sign out user and clean up session
   */
  async signOut(): Promise<void> {
    try {
      const sessionId = this.getSessionId();
      if (sessionId) {
        await this.makeRequest('/api/auth/enterprise/logout', {
          method: 'POST',
          headers: this.getAuthHeaders()
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.makeRequest<User>('/api/auth/enterprise/me', {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (response.success && response.data) {
        return response.data;
      } else {
        throw this.createAuthError(response.error);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw this.createAuthError({
          code: AuthErrorCode.SESSION_EXPIRED,
          message: 'No refresh token available'
        });
      }

      const response = await this.makeRequest<LoginResponse>('/api/auth/enterprise/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      });

      if (response.success && response.data) {
        this.storeTokens(response.data);
        return response.data;
      } else {
        this.clearTokens();
        throw this.createAuthError(response.error);
      }
    } catch (error) {
      this.clearTokens();
      throw this.handleError(error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = this.parseJWT(token);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(user: User, resource: string, action: string): boolean {
    return user.permissions.some(
      permission => 
        permission.resource === resource && 
        permission.action === action
    );
  }

  /**
   * Check if user has specific role
   */
  hasRole(user: User, role: UserRole): boolean {
    return user.role === role;
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get refresh token
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Get session ID
   */
  private getSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.sessionKey);
  }

  /**
   * Store authentication tokens
   */
  private storeTokens(loginResponse: LoginResponse): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.tokenKey, loginResponse.accessToken);
    localStorage.setItem(this.refreshTokenKey, loginResponse.refreshToken);
    localStorage.setItem(this.sessionKey, loginResponse.sessionId);
  }

  /**
   * Clear authentication tokens
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.sessionKey);
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Parse JWT token payload
   */
  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      throw new Error('Invalid JWT token');
    }
  }

  /**
   * Create standardized auth error
   */
  private createAuthError(error?: any): AuthError {
    if (error?.code && error?.message) {
      return {
        code: error.code,
        message: error.message,
        field: error.field,
        details: error.details
      };
    }

    return {
      code: AuthErrorCode.UNKNOWN_ERROR,
      message: error?.message || 'An unexpected error occurred',
      details: error
    };
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: any): AuthError {
    console.error('AuthService Error:', error);

    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Unable to connect to server. Please check your connection.'
      };
    }

    // API errors
    if (error?.code) {
      return this.createAuthError(error);
    }

    // Default error
    return {
      code: AuthErrorCode.UNKNOWN_ERROR,
      message: 'An unexpected error occurred. Please try again.'
    };
  }

  /**
   * Get user dashboard route based on role
   */
  getUserDashboardRoute(role: UserRole): string {
    const dashboardRoutes: Record<UserRole, string> = {
      [UserRole.BUYER]: '/buyer',
      [UserRole.DEVELOPER]: '/developer',
      [UserRole.AGENT]: '/agents',
      [UserRole.SOLICITOR]: '/solicitor',
      [UserRole.ADMIN]: '/admin',
      [UserRole.INVESTOR]: '/investor',
      
      // Professional roles
      [UserRole.BUYER_SOLICITOR]: '/solicitor',
      [UserRole.DEVELOPER_SOLICITOR]: '/solicitor',
      [UserRole.BUYER_MORTGAGE_BROKER]: '/financial',
      [UserRole.BUYER_FINANCIAL_ADVISOR]: '/financial',
      [UserRole.BUYER_INSURANCE_BROKER]: '/financial',
      [UserRole.BUYER_SURVEYOR]: '/surveyor',
      
      // Estate and property professionals
      [UserRole.ESTATE_AGENT]: '/agents',
      [UserRole.DEVELOPMENT_SALES_AGENT]: '/agents',
      [UserRole.PROPERTY_VALUER]: '/valuer',
      [UserRole.BUILDING_SURVEYOR]: '/surveyor',
      [UserRole.PROPERTY_MANAGER]: '/property-manager',
      
      // Design professionals
      [UserRole.LEAD_ARCHITECT]: '/architect',
      [UserRole.DESIGN_ARCHITECT]: '/architect',
      [UserRole.TECHNICAL_ARCHITECT]: '/architect',
      [UserRole.LANDSCAPE_ARCHITECT]: '/architect',
      
      // Engineering professionals
      [UserRole.STRUCTURAL_ENGINEER]: '/engineer',
      [UserRole.CIVIL_ENGINEER]: '/engineer',
      [UserRole.MEP_ENGINEER]: '/engineer',
      [UserRole.ENVIRONMENTAL_ENGINEER]: '/engineer',
      [UserRole.ENGINEER]: '/engineer',
      
      // Construction professionals
      [UserRole.MAIN_CONTRACTOR]: '/contractor',
      [UserRole.PROJECT_MANAGER]: '/project-manager',
      [UserRole.DEVELOPMENT_PROJECT_MANAGER]: '/project-manager',
      [UserRole.PROJECT_MANAGER_CONSTRUCTION]: '/project-manager',
      [UserRole.SITE_FOREMAN]: '/construction',
      [UserRole.CONTRACTOR]: '/contractor',
      
      // Compliance and certification
      [UserRole.BER_ASSESSOR]: '/compliance',
      [UserRole.NZEB_CONSULTANT]: '/compliance',
      [UserRole.SUSTAINABILITY_CONSULTANT]: '/compliance',
      [UserRole.BCAR_CERTIFIER]: '/compliance',
      [UserRole.FIRE_SAFETY_CONSULTANT]: '/compliance',
      [UserRole.ACCESSIBILITY_CONSULTANT]: '/compliance',
      
      // Quality assurance
      [UserRole.QUALITY_ASSURANCE_INSPECTOR]: '/quality',
      [UserRole.STRUCTURAL_WARRANTY_INSPECTOR]: '/quality',
      [UserRole.HOMEBOND_ADMINISTRATOR]: '/quality',
      [UserRole.HEALTH_SAFETY_OFFICER]: '/safety',
      
      // Regulatory and government
      [UserRole.LOCAL_AUTHORITY_OFFICER]: '/government',
      [UserRole.BUILDING_CONTROL_OFFICER]: '/government',
      [UserRole.LAND_REGISTRY_OFFICER]: '/government',
      [UserRole.REVENUE_OFFICER]: '/government',
      
      // Specialized services
      [UserRole.QUANTITY_SURVEYOR]: '/quantity-surveyor',
      [UserRole.PLANNING_CONSULTANT]: '/planning',
      [UserRole.TAX_ADVISOR]: '/tax',
      [UserRole.CONVEYANCING_SPECIALIST]: '/conveyancing',
      [UserRole.INSURANCE_UNDERWRITER]: '/insurance',
      
      // Management roles
      [UserRole.DEVELOPMENT_MARKETING_MANAGER]: '/marketing',
      [UserRole.DEVELOPMENT_FINANCIAL_CONTROLLER]: '/financial-controller',
      [UserRole.ESTATE_AGENT_MANAGER]: '/agents',
      
      // Financial services
      [UserRole.MORTGAGE_LENDER]: '/mortgage',
      [UserRole.MORTGAGE_UNDERWRITER]: '/mortgage'
    };

    return dashboardRoutes[role] || '/dashboard';
  }

  /**
   * Check if user has permission using the new permission system
   */
  async checkUserPermission(
    userId: string, 
    permission: string, 
    context?: any
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/permissions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Permission check failed:', response.statusText);
        return false;
      }

      const data = await response.json();
      return data.result?.granted || false;

    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  /**
   * Get user's current role assignments
   */
  async getUserRoleAssignments(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/auth/permissions?action=roles&userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Role assignments fetch failed:', response.statusText);
        return [];
      }

      const data = await response.json();
      return data.roleAssignments || [];

    } catch (error) {
      console.error('Role assignments fetch error:', error);
      return [];
    }
  }

  /**
   * Request a new role assignment
   */
  async requestRoleAssignment(
    userId: string,
    roleType: UserRole,
    justification: string,
    assignmentType: 'primary' | 'secondary' = 'secondary'
  ): Promise<{ success: boolean; assignmentId?: string; needsApproval?: boolean }> {
    try {
      const response = await fetch('/api/auth/permissions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'requestRole',
          userId,
          roleType,
          assignmentType,
          requestedBy: userId, // Self-request
          justification
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        return { success: false };
      }

      const data = await response.json();
      return {
        success: data.success,
        assignmentId: data.assignmentId,
        needsApproval: data.needsApproval
      };

    } catch (error) {
      console.error('Role assignment request error:', error);
      return { success: false };
    }
  }

  /**
   * Get user's permission context for UI rendering
   */
  async getUserPermissionContext(userId: string): Promise<any> {
    try {
      const response = await fetch(`/api/auth/permissions?action=context&userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Permission context fetch failed:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data.context;

    } catch (error) {
      console.error('Permission context fetch error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const authService = new EnterpriseAuthService();
export default authService;