// Fallback route for temporarily disabled auth endpoints during Next.js migration
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'disabled',
    message: 'Auth API endpoints are temporarily disabled during Next.js 15.3.1 migration'});
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'disabled',
    message: 'Auth API endpoints are temporarily disabled during Next.js 15.3.1 migration'});
}

// Handle all methods
export const runtime = 'edge';