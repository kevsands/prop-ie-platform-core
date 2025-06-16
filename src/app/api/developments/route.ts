/**
 * API Route: /api/developments
 * Handles development endpoints
 * Temporarily disabled for build testing
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Temporarily return mock data for build testing
  return NextResponse.json({
    data: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      pages: 0
    },
    message: 'API temporarily disabled for build testing'
  });
}

export async function POST(request: NextRequest) {
  // Temporarily return mock response for build testing
  return NextResponse.json({
    data: null,
    message: 'API temporarily disabled for build testing'
  }, { status: 501 });
}