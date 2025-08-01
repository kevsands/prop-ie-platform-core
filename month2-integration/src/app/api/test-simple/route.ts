import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Simple API test working',
    timestamp: new Date().toISOString()
  });
}