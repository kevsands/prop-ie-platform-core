type Props = {
  params: Promise<{ id: string }>
}

/**
 * API Route: /api/developments/[id]
 * Handles specific development endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getRepository } from '@/lib/db/repositories/index';
import { logger } from '@/lib/security/auditLogger';
import { authOptions } from '@/lib/auth';
import { mockDevelopments } from '@/data/mockDevelopments';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const id = params.id;
    const developments = mockDevelopments;

    // Find the development by id (which is the same as slug in our mock data)
    const development = developments.find((dev: any) => dev.id === id);

    if (!development) {
      return NextResponse.json({ error: 'Development not found' }, { status: 404 });
    }

    return NextResponse.json(development);
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch development data' },
      { status: 500 }
    );
  }
}