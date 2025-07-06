import { NextRequest, NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';

// Define the security violation type
interface SecurityViolation {
  type: string;
  details: string | Record<string, unknown>;
  timestamp: number;
  stack?: string;
  codePreview?: string;
  location?: string;
  ip?: string;
  userAgent?: string;
  serverTimestamp?: number;
}

/**
 * API route for logging security-related events
 * 
 * This endpoint accepts security violation logs from the client-side
 * security monitoring hook and records them for later analysis.
 * Enhanced to handle detailed eval() security information.
 */
export async function POST(request: NextRequest) {
  try {
    // Read the request body with type assertion
    const violationData = await request.json() as Partial<SecurityViolation>;
    
    // Basic validation
    if (!violationData || !violationData.type) {
      return NextResponse.json(
        { error: 'Invalid security log data' },
        { status: 400 }
      );
    }
    
    // Add IP address and user agent information
    const enrichedData: SecurityViolation = {
      type: violationData.type,
      details: violationData.details || 'No details provided',
      timestamp: violationData.timestamp || Date.now(),
      stack: violationData.stack,
      codePreview: violationData.codePreview,
      location: violationData.location,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      serverTimestamp: Date.now(),
    };
    
    // Special handling for eval-related violations
    if (violationData.type === 'eval_usage' || violationData.type === 'eval_json_usage') {
      // Extract the calling component/file from the stack if available
      if (enrichedData.stack) {
        const stackLines = enrichedData.stack.split('\n');
        const relevantLines = stackLines.slice(2, 6); // Skip the first two lines which are our monitoring code
        
        // Add additional context for eval calls
        console.warn('[SECURITY ALERT] Eval usage detected!');
        console.warn(`Location: ${enrichedData.location}`);
        console.warn(`Code preview: ${enrichedData.codePreview}`);
        console.warn(`Stack trace: \n${relevantLines.join('\n')}`);
        
        // You might want to escalate critical eval usages
        if (process.env.NODE_ENV === 'production') {
          // Here you could add code to send alerts via email, Slack, etc.
          // For example: await sendSecurityAlert(enrichedData);
        }
      }
    }
    
    // Log to console in development with better formatting
    if (process.env.NODE_ENV === 'development') {
      console.error('\n[SECURITY LOG] =====================');
      console.error(`Type: ${enrichedData.type}`);
      console.error(`Time: ${new Date(enrichedData.timestamp).toISOString()}`);
      console.error(`Location: ${enrichedData.location || 'unknown'}`);
      
      if (typeof enrichedData.details === 'object') {
        console.error('Details:', enrichedData.details);
      } else {
        console.error(`Details: ${enrichedData.details}`);
      }
      
      if (enrichedData.codePreview) {
        console.error(`Code: ${enrichedData.codePreview}`);
      }
      
      console.error('===============================\n');
    }
    
    // In production, store to a database or send to a security logging service
    if (process.env.NODE_ENV === 'production') {
      // Example database storage (uncomment when ready to implement)
      // await db.securityLogs.create({ data: enrichedData });
      
      // Example centralized logging
      // await fetch(process.env.SECURITY_LOGGING_ENDPOINT, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(enrichedData)
      // });
    }
    
    // Return success response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing security log:', error);
    return NextResponse.json(
      { error: 'Failed to process security log' },
      { status: 500 }
    );
  }
}

/**
 * Allow beacon API calls (which use POST method)
 */
// Dynamic declaration moved to the top of the file