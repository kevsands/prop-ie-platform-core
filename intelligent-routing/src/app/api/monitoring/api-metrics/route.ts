import { NextRequest, NextResponse } from "next/server";
import { Auth } from "@/lib/auth";

// Interface for API metrics
interface ApiMetric {
  endpoint: string;
  method: string;
  duration: number;
  status: 'success' | 'error';
  timestamp: number;
  statusCode?: number;
  errorType?: string;
  cached?: boolean;
}

// Auth utility functions
const auth = {
  /**
   * Verify authentication from request
   */
  verifyAuth: async (req: NextRequest): Promise<any | null> => {
    try {
      // Get JWT token from Authorization header
      const authHeader = req.headers.get('Authorization');
      const token = authHeader?.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : null;
      
      if (!token) {
        return null;
      }
      
      // In a real implementation, verify the token
      // For this mock version, just return a mock user
      return await Auth.currentAuthenticatedUser();
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  },

  /**
   * Check if user has a specific permission
   */
  hasPermission: (user: any, permission: string): boolean => {
    if (!user || !user.roles) {
      return false;
    }
    
    if (permission === 'admin') {
      return user.roles.includes('ADMIN');
    }
    
    return user.roles.includes(permission.toUpperCase());
  }
};

/**
 * API endpoint for receiving API performance metrics
 * POST /api/monitoring/api-metrics
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the metrics
    const { metrics } = await req.json() as { metrics: ApiMetric[] };
    
    if (!Array.isArray(metrics)) {
      return NextResponse.json(
        { error: "Invalid metrics format" },
        { status: 400 }
      );
    }
    
    // Get the current user if authenticated
    const user = await auth.verifyAuth(req);
    const userId = user?.id;
    
    // Process each metric
    const processedMetrics = metrics.map(metric => ({
      ...metric,
      userId,
      userAgent: req.headers.get('user-agent') || undefined,
      environment: process.env.NODE_ENV,
    }));
    
    // In a real implementation, you would store these metrics
    // in a database, send them to a monitoring service, etc.
    if (process.env.NODE_ENV === 'development') {
      console.log(`Received ${metrics.length} API metrics`);
    }
    
    // Calculate summary statistics
    const totalRequests = processedMetrics.length;
    const totalDuration = processedMetrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration = totalDuration / totalRequests;
    const slowRequests = processedMetrics.filter(m => m.duration > 1000).length;
    const errorRequests = processedMetrics.filter(m => m.status === 'error').length;
    
    // TODO: Store metrics in database or send to monitoring service
    
    return NextResponse.json(
      {
        received: metrics.length,
        summary: {
          totalRequests,
          averageDuration,
          slowRequests,
          errorRequests,
          successRate: (totalRequests - errorRequests) / totalRequests,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing API metrics:', error);
    
    return NextResponse.json(
      { error: "Failed to process metrics" },
      { status: 500 }
    );
  }
}

/**
 * GET handler for retrieving performance summary
 * GET /api/monitoring/api-metrics
 */
export async function GET(req: NextRequest) {
  // Check if user is authorized to view metrics
  const user = await auth.verifyAuth(req);
  
  if (!user || !auth.hasPermission(user, 'admin')) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }
  
  // In a real implementation, you would retrieve metrics from a database
  // For now, return a placeholder response
  return NextResponse.json({
    metrics: {
      summary: {
        last24Hours: {
          totalRequests: 1250,
          averageDuration: 145.3,
          slowRequests: 23,
          errorRequests: 14,
          successRate: 0.989,
        },
        lastWeek: {
          totalRequests: 8732,
          averageDuration: 152.7,
          slowRequests: 167,
          errorRequests: 98,
          successRate: 0.988,
        }
      },
      topEndpoints: [
        { endpoint: '/api/properties', averageDuration: 132.4, requests: 283 },
        { endpoint: '/api/users/me', averageDuration: 87.2, requests: 201 },
        { endpoint: '/api/projects', averageDuration: 210.1, requests: 187 },
      ],
      slowestEndpoints: [
        { endpoint: '/api/projects/123/sales', averageDuration: 876.3, requests: 45 },
        { endpoint: '/api/properties/search', averageDuration: 654.2, requests: 132 },
        { endpoint: '/api/reports/financial', averageDuration: 543.1, requests: 23 },
      ]
    }
  });
}