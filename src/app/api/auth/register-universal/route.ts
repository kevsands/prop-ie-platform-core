import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Validation schema for universal registration
const universalRegistrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  primaryRole: z.enum(['DEVELOPER', 'BUYER', 'PROFESSIONAL', 'CORPORATE']),
  geographicFocus: z.enum(['DUBLIN', 'CORK', 'GALWAY', 'NATIONAL', 'INTERNATIONAL']),
  urgency: z.string().optional(),
  experience: z.string().optional(),
  agreeToMarketing: z.boolean().default(false)
});

type UniversalRegistrationData = z.infer<typeof universalRegistrationSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = universalRegistrationSchema.parse(body);

    // Check if user already exists
    const existingUser = await checkExistingUser(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate temporary password for immediate access
    const temporaryPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // Create user with archetype classification
    const user = await createUser({
      ...validatedData,
      hashedPassword,
      temporaryPassword
    });

    // Generate JWT token for immediate authentication
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.primaryRole,
        isTemporaryAccess: true 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Send welcome email with temporary credentials
    await sendWelcomeEmail(user, temporaryPassword);

    // Log registration analytics
    await logRegistrationEvent(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        primaryRole: user.primaryRole,
        geographicFocus: user.geographicFocus
      },
      accessToken: token,
      onboardingPath: determineOnboardingPath(validatedData),
      welcomeMessage: generateWelcomeMessage(validatedData)
    });

  } catch (error) {
    console.error('Universal registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

async function checkExistingUser(email: string) {
  // In a real implementation, this would query your database
  // For now, we'll simulate a database check
  try {
    // Example: const user = await prisma.user.findUnique({ where: { email } });
    // return user;
    return null; // Simulate no existing user for demo
  } catch (error) {
    console.error('Error checking existing user:', error);
    return null;
  }
}

async function createUser(userData: UniversalRegistrationData & { hashedPassword: string; temporaryPassword: string }) {
  // In a real implementation, this would create a user in your database
  // For now, we'll simulate user creation
  
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const user = {
    id: userId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
    primaryRole: userData.primaryRole,
    geographicFocus: userData.geographicFocus,
    urgency: userData.urgency,
    experience: userData.experience,
    agreeToMarketing: userData.agreeToMarketing,
    hashedPassword: userData.hashedPassword,
    temporaryPassword: userData.temporaryPassword,
    isEmailVerified: false,
    requiresPasswordReset: true,
    createdAt: new Date(),
    lastLoginAt: null,
    profileCompleteness: calculateInitialCompleteness(userData),
    archetype: classifyArchetype(userData)
  };

  // Example database operation:
  // const user = await prisma.user.create({ data: userData });
  
  console.log('User created:', { id: user.id, email: user.email, role: user.primaryRole });
  return user;
}

function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function calculateInitialCompleteness(userData: UniversalRegistrationData): number {
  let completeness = 30; // Base score for registration
  
  if (userData.urgency) completeness += 10;
  if (userData.experience) completeness += 10;
  if (userData.phone) completeness += 10;
  if (userData.agreeToMarketing) completeness += 5;
  
  return Math.min(completeness, 100);
}

function classifyArchetype(userData: UniversalRegistrationData): string {
  // Smart archetype classification based on registration data
  const { primaryRole, experience, urgency, geographicFocus } = userData;
  
  if (primaryRole === 'BUYER') {
    if (experience === 'first-time') {
      return geographicFocus === 'INTERNATIONAL' ? 'FIRST_TIME_NON_EU' : 'FIRST_TIME_IRISH';
    } else if (experience === 'experienced' && urgency === 'immediate') {
      return 'EXPERIENCED_CASH';
    } else {
      return 'EXPERIENCED_TRADE_UP';
    }
  }
  
  if (primaryRole === 'DEVELOPER') {
    return 'PROPERTY_DEVELOPER'; // Default, will be refined in onboarding
  }
  
  if (primaryRole === 'PROFESSIONAL') {
    return 'SOLICITOR'; // Default, will be refined in onboarding
  }
  
  if (primaryRole === 'CORPORATE') {
    return 'INSTITUTIONAL_INVESTOR';
  }
  
  return 'GENERAL';
}

function determineOnboardingPath(userData: UniversalRegistrationData): string {
  const { primaryRole, experience, urgency } = userData;
  
  const basePaths = {
    'DEVELOPER': '/developer/onboarding',
    'BUYER': '/buyer/onboarding',
    'PROFESSIONAL': '/professional/onboarding',
    'CORPORATE': '/corporate/onboarding'
  };
  
  // Enhanced routing for buyers
  if (primaryRole === 'BUYER') {
    if (experience === 'first-time') {
      return '/buyer/first-time/onboarding';
    } else if (urgency === 'immediate') {
      return '/buyer/fast-track/onboarding';
    }
  }
  
  return basePaths[primaryRole] || '/dashboard';
}

function generateWelcomeMessage(userData: UniversalRegistrationData): string {
  const { firstName, primaryRole } = userData;
  
  const messages = {
    'DEVELOPER': `Welcome ${firstName}! Ready to showcase your properties to qualified buyers?`,
    'BUYER': `Welcome ${firstName}! Let's find your perfect property in Ireland.`,
    'PROFESSIONAL': `Welcome ${firstName}! Streamline your property services with our platform.`,
    'CORPORATE': `Welcome ${firstName}! Access our institutional property investment tools.`
  };
  
  return messages[primaryRole] || `Welcome ${firstName}! Let's get started.`;
}

async function sendWelcomeEmail(user: any, temporaryPassword: string) {
  // In a real implementation, this would send an email
  console.log(`Welcome email would be sent to ${user.email} with temporary password: ${temporaryPassword}`);
  
  // Example email content based on user type
  const emailTemplates = {
    'DEVELOPER': {
      subject: 'Welcome to PROP - Start Selling Properties Today',
      content: `Your premium developer account is ready. List your first property in under 5 minutes.`
    },
    'BUYER': {
      subject: 'Welcome to PROP - Your Property Journey Starts Here',
      content: `Access exclusive properties and get expert guidance on your purchase.`
    },
    'PROFESSIONAL': {
      subject: 'Welcome to PROP - Professional Services Platform',
      content: `Streamline your property services and connect with more clients.`
    },
    'CORPORATE': {
      subject: 'Welcome to PROP - Institutional Investment Platform', 
      content: `Access our enterprise property investment and portfolio management tools.`
    }
  };
  
  // This would integrate with your email service (SendGrid, AWS SES, etc.)
}

async function logRegistrationEvent(user: any) {
  // Analytics tracking for registration events
  const analyticsEvent = {
    event: 'user_registered',
    userId: user.id,
    properties: {
      primaryRole: user.primaryRole,
      geographicFocus: user.geographicFocus,
      archetype: user.archetype,
      profileCompleteness: user.profileCompleteness,
      registrationSource: 'universal_form',
      timestamp: new Date().toISOString()
    }
  };
  
  console.log('Analytics event:', analyticsEvent);
  
  // This would integrate with your analytics service (Mixpanel, Amplitude, etc.)
}