// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireRoles } from "@/lib/auth"; // Adjust path if necessary
import { securityMiddleware } from "@/middleware/security";

// Define roles required for specific paths
const protectedRoutes: { [path: string]: string[] } = {
  "/dashboard": ["user", "admin"], // Example: Requires user or admin role
  "/admin": ["admin"],             // Example: Requires admin role
  "/api/secure": ["user", "admin"], // Example: Protects all routes under /api/secure
  // Add more protected routes and their required roles here
};

export async function middleware(request: NextRequest) {
  // Apply security middleware first
  const securityResponse = await securityMiddleware(request);

  // If security middleware returns a response, return it immediately
  if (securityResponse && securityResponse !== NextResponse.next()) {
    return securityResponse;
  }

  const pathname = request.nextUrl.pathname;

  // Check if the current path matches any protected route prefix
  for (const pathPrefix in protectedRoutes) {
    if (pathname.startsWith(pathPrefix)) {
      const requiredRoles = protectedRoutes[pathPrefix];
      console.log(`Applying role check for path: ${pathname}, required roles: ${requiredRoles.join(", ")}`);
      // Create the specific middleware function for these roles
      const roleMiddleware = requireRoles(requiredRoles);
      // Execute the role check middleware
      const result = await roleMiddleware(request);
      // If the middleware returns a response (redirect or error), return it immediately
      if (result instanceof NextResponse) {
        return result;
      }
      // If role check passes (middleware returns void/null), break the loop and proceed
      break;
    }
  }

  // If no protected route matched or role check passed, continue with the modified response from security middleware
  return securityResponse;
}

// Configure the matcher to specify which routes the middleware should run on.
// This improves performance by avoiding running the middleware on static assets or public pages.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /images/ (public images)
     * - /login (public login page)
     * - /register (public register page)
     * - /access-denied (public access denied page)
     * - / (public homepage - adjust if homepage requires login)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|login|register|access-denied|$).*)",
    // Explicitly include API routes that need protection if not covered above
    "/api/secure/:path*",
  ],
};

