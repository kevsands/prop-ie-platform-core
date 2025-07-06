import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    sentry_dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ? 'CONFIGURED' : 'MISSING',
    sentry_org: process.env.SENTRY_ORG,
    sentry_project: process.env.SENTRY_PROJECT,
    sentry_dev_mode: process.env.SENTRY_DEV_MODE,
    node_env: process.env.NODE_ENV,
    dsn_first_chars: process.env.NEXT_PUBLIC_SENTRY_DSN?.substring(0, 20) + '...',
  });
}