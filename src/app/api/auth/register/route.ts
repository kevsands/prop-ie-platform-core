import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role = 'buyer' } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email, password, first name, and last name are required'
        }
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Please provide a valid email address'
        }
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password must be at least 6 characters long'
        }
      }, { status: 400 });
    }

    console.log('📝 Registration attempt for:', email, 'Role:', role);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'An account with this email already exists'
        }
      }, { status: 409 });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: email.toLowerCase(),
        firstName,
        lastName,
        password: hashedPassword,
        roleData: JSON.stringify([role]),
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ User created successfully:', newUser.email, 'ID:', newUser.id);

    // Return success (don't include password hash)
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: role,
          status: newUser.status
        },
        message: 'Account created successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An internal error occurred. Please try again.'
      }
    }, { status: 500 });
  }
}