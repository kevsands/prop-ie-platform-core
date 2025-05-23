import { NextRequest, NextResponse } from 'next/server';

interface SecurityViolation {
  type: 'csp' | 'xss' | 'clickjacking' | 'cors' | 'csrf' | 'injection' | 'redirect' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
  url: string;
  metadata?: Record<string, any>\n  );
}

interface SecurityReportPayload {
  violation: SecurityViolation;
}

/**
 * API route for receiving and processing security violation reports
 * 
 * This endpoint accepts security violation reports from the client-side
 * security monitoring hook and logs them for review.
 * 
 * In a production environment, these reports should be:
 * 1. Stored in a secure database
 * 2. Trigger alerts for high/critical violations
 * 3. Rate limited to prevent abuse
 * 4. Analyzed for patterns
 */
export async function POST(request: NextRequest) {
  try {
    const payload: SecurityReportPayload = await request.json();
    const { violation } = payload;

    if (!violation || !violation.type || !violation.severity || !violation.description) {
      return NextResponse.json(
        { error: 'Invalid security violation report format' },
        { status: 400 }
      );
    }

    // Add IP address for tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const enrichedViolation = {
      ...violation,
      reporter: {
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString()}
    };

    // Log the violation (in production, you would save to a database)
    } - ${enrichedViolation.type}: ${enrichedViolation.description}`,
      JSON.stringify(enrichedViolation, null2)
    );

    // For critical and high severity violations, you might want to:
    // 1. Send notifications to security team
    // 2. Log to a security monitoring service
    // 3. Trigger an incident response process
    if (['critical', 'high'].includes(violation.severity)) {
      // Example: Trigger alert for critical violations
      // await sendSecurityAlert(enrichedViolation);

      // Example: Save to database
      // await db.securityViolations.create({ data: enrichedViolation });
    }

    return NextResponse.json({ status: 'received' });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to process security report' },
      { status: 500 }
    );
  }
}

/**
 * Options handler for CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'});
}