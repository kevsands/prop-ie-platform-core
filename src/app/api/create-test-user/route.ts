import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if test buyer already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@buyer.com' }
    });

    if (existingUser) {
      return NextResponse.json({ 
        message: 'Test user already exists',
        user: { email: existingUser.email, id: existingUser.id }
      });
    }

    // Create test buyer user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@buyer.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Buyer',
        roles: ['BUYER'],
        status: 'ACTIVE',
        kycStatus: 'APPROVED',
        organization: 'Test Org',
        preferences: {}
      }
    });

    return NextResponse.json({
      message: 'Test user created successfully',
      user: { email: user.email, id: user.id },
      credentials: {
        email: 'test@buyer.com',
        password: 'password123'
      }
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to create test user' },
      { status: 500 }
    );
  }
}