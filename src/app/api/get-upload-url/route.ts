import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/get-upload-url
 * Compatibility endpoint that redirects to the main upload-url API
 * This maintains compatibility with existing GraphQL mutation hooks
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the main upload-url endpoint
    const uploadUrlResponse = await fetch(
      new URL('/api/documents/upload-url', request.url).toString(),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': request.headers.get('x-csrf-token') || ''
        },
        body: JSON.stringify(body)
      }
    );

    const result = await uploadUrlResponse.json();
    
    if (!uploadUrlResponse.ok) {
      return NextResponse.json(result, { status: uploadUrlResponse.status });
    }

    // Return in the format expected by GraphQL mutations
    return NextResponse.json({
      url: result.uploadUrl,
      fileUrl: result.fileUrl,
      key: result.key,
      expiresIn: result.expiresIn,
      bucket: result.bucket,
      region: result.region
    });

  } catch (error: any) {
    console.error("Error in get-upload-url compatibility endpoint:", error);
    return NextResponse.json(
      { 
        error: "Failed to get upload URL",
        message: error.message || "Internal server error"
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-csrf-token',
      'Access-Control-Max-Age': '86400',
    },
  });
}