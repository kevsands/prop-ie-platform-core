/**
 * API Route: /api/projects/[id]
 * Redirects to the working developments API
 */

import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;
  
  // Redirect to working developments API
  return NextResponse.redirect(
    new URL(`/api/developments/${id}`, request.url)
  );
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const { id } = await params;
  
  // Redirect to working developments API  
  return NextResponse.redirect(
    new URL(`/api/developments/${id}`, request.url)
  );
}