// src/app/api/users/me/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@prop.ie',
    role: 'admin',
    organisationId: 'fitzgeraldgardens',
    permissions: [
      { resource: 'projects', action: 'create' },
      { resource: 'projects', action: 'read' },
      { resource: 'projects', action: 'update' },
      { resource: 'projects', action: 'delete' },
      { resource: 'units', action: 'create' },
      { resource: 'units', action: 'read' },
      { resource: 'sales', action: 'create' }]
  });
}