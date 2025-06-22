import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole, Permission } from '@/lib/permissions/ProfessionalPermissionMatrix';

// Route protection configuration
const PROTECTED_ROUTES = {
  // Admin routes
  '/admin': { requiredRoles: [UserRole.ADMIN], permissions: [] },
  '/api/admin': { requiredRoles: [UserRole.ADMIN], permissions: [] },
  
  // Developer routes
  '/developer': { requiredRoles: [UserRole.DEVELOPER], permissions: [Permission.VIEW_DEVELOPMENTS] },
  '/api/developments': { requiredRoles: [UserRole.DEVELOPER, UserRole.ADMIN], permissions: [Permission.VIEW_DEVELOPMENTS] },
  
  // Buyer routes
  '/buyer': { requiredRoles: [UserRole.BUYER], permissions: [] },
  '/api/buyer': { requiredRoles: [UserRole.BUYER, UserRole.ADMIN], permissions: [] },
  
  // Professional role routes
  '/solicitor': { requiredRoles: [UserRole.BUYER_SOLICITOR, UserRole.DEVELOPER_SOLICITOR, UserRole.SOLICITOR], permissions: [Permission.ACCESS_LEGAL_DOCUMENTS] },
  '/architect': { requiredRoles: [UserRole.LEAD_ARCHITECT, UserRole.DESIGN_ARCHITECT, UserRole.TECHNICAL_ARCHITECT], permissions: [Permission.CREATE_TECHNICAL_DRAWINGS] },
  '/engineer': { requiredRoles: [UserRole.STRUCTURAL_ENGINEER, UserRole.CIVIL_ENGINEER, UserRole.MEP_ENGINEER], permissions: [Permission.APPROVE_STRUCTURAL_DESIGNS] },
  
  // Estate agent routes
  '/agents': { requiredRoles: [UserRole.ESTATE_AGENT, UserRole.DEVELOPMENT_SALES_AGENT], permissions: [Permission.MANAGE_SALES_PIPELINE] },
  
  // Financial services routes
  '/financial': { requiredRoles: [UserRole.BUYER_MORTGAGE_BROKER, UserRole.BUYER_FINANCIAL_ADVISOR], permissions: [Permission.VIEW_FINANCIAL_DATA] },
  
  // Task management routes
  '/api/tasks': { requiredRoles: [], permissions: [Permission.VIEW_TASKS] },
  '/api/tasks/assign': { requiredRoles: [], permissions: [Permission.ASSIGN_TASKS] },
  
  // Document management routes
  '/api/documents': { requiredRoles: [], permissions: [Permission.VIEW_DOCUMENTS] },
  '/api/documents/upload': { requiredRoles: [], permissions: [Permission.UPLOAD_DOCUMENTS] },
  
  // HTB routes
  '/api/htb': { requiredRoles: [UserRole.BUYER, UserRole.BUYER_SOLICITOR, UserRole.BUYER_MORTGAGE_BROKER], permissions: [Permission.VIEW_HTB_DATA] },
  
  // Professional directory
  '/professionals': { requiredRoles: [], permissions: [Permission.ACCESS_PROFESSIONAL_DIRECTORY] }
};

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
  '/api/health',
  '/_next',
  '/favicon.ico',
  '/images',
  '/static'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create response with security headers
  const response = NextResponse.next();
  
  // Add comprehensive security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Skip protection for public routes
  if (isPublicRoute(pathname)) {
    return response;
  }
  
  // Get auth token from cookies or headers
  const token = getAuthToken(request);
  
  if (!token) {
    return redirectToLogin(request);
  }
  
  try {
    // Parse and validate JWT token
    const user = await validateToken(token);
    
    if (!user) {
      return redirectToLogin(request);
    }
    
    // Check route access permissions
    const accessResult = await checkRouteAccess(pathname, user);
    
    if (!accessResult.allowed) {
      return createForbiddenResponse(accessResult.reason);
    }
    
    // Add user context to response headers for downstream services
    response.headers.set('X-User-ID', user.id);
    response.headers.set('X-User-Role', user.role);
    response.headers.set('X-User-Permissions', JSON.stringify(user.permissions || []));
    
    return response;
    
  } catch (error) {
    console.error('Middleware auth error:', error);
    return redirectToLogin(request);
  }
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

function getAuthToken(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try cookie as fallback
  return request.cookies.get('prop_access_token')?.value || null;
}

async function validateToken(token: string): Promise<any> {
  try {
    // Parse JWT token
    const payload = parseJWT(token);
    
    // Check if token is expired
    if (payload.exp * 1000 <= Date.now()) {
      return null;
    }
    
    // In production, you would validate against your user database
    // For now, return the payload as user data
    return {
      id: payload.sub || payload.user_id,
      email: payload.email,
      role: payload.role || UserRole.BUYER,
      permissions: payload.permissions || []
    };
    
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

function parseJWT(token: string): any {
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

async function checkRouteAccess(pathname: string, user: any): Promise<{ allowed: boolean; reason?: string }> {
  // Find matching route protection rule
  const routeRule = findMatchingRoute(pathname);
  
  if (!routeRule) {
    // No specific protection rule - allow access for authenticated users
    return { allowed: true };
  }
  
  // Check role requirements
  if (routeRule.requiredRoles.length > 0) {
    const hasRequiredRole = routeRule.requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return { 
        allowed: false, 
        reason: `Access denied: Required role ${routeRule.requiredRoles.join(' or ')}` 
      };
    }
  }
  
  // Check permission requirements
  if (routeRule.permissions.length > 0) {
    const userPermissions = user.permissions || [];
    const hasRequiredPermission = routeRule.permissions.some(
      permission => userPermissions.includes(permission)
    );
    
    if (!hasRequiredPermission) {
      return { 
        allowed: false, 
        reason: `Access denied: Required permission ${routeRule.permissions.join(' or ')}` 
      };
    }
  }
  
  return { allowed: true };
}

function findMatchingRoute(pathname: string): any {
  // Find exact match first
  if (PROTECTED_ROUTES[pathname as keyof typeof PROTECTED_ROUTES]) {
    return PROTECTED_ROUTES[pathname as keyof typeof PROTECTED_ROUTES];
  }
  
  // Find prefix match
  for (const [route, config] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route + '/')) {
      return config;
    }
  }
  
  return null;
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

function createForbiddenResponse(reason?: string): NextResponse {
  return new NextResponse(
    JSON.stringify({ 
      error: 'Access Forbidden', 
      message: reason || 'You do not have permission to access this resource' 
    }),
    { 
      status: 403, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};