import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

// Validation schema
const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
  organization: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  agreeToMarketing: z.boolean().optional()});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        password: hashedPassword,
        roles: [data.role],
        organization: data.organization || null,
        position: data.position || null,
        status: 'ACTIVE',
        kycStatus: 'NOT_STARTED',
        preferences: {
          marketing: data.agreeToMarketing || false,
          notifications: {
            email: true,
            sms: false,
            push: true
          }
        }
      }
    });

    // Log registration event
    await prisma.authLog.create({
      data: {
        eventType: 'REGISTRATION',
        userId: user.id,
        email: user.email,
        metadata: {
          role: data.role,
          organization: data.organization,
          provider: 'credentials'
        }
      }
    });

    // Send welcome email (in production)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement email sending
      // await sendWelcomeEmail(user.email, user.firstName);
    }

    return NextResponse.json(
      { 
        message: 'Account created successfully',
        user: { 
          id: user.id, 
          email: user.email, 
          name: `${user.firstName} ${user.lastName}`,
          role: user.roles[0]
        }
      },
      { status: 201 }
    );
  } catch (error) {

    // Check for specific Prisma errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}